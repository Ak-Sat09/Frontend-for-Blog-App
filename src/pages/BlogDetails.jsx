import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogById } from "../api/blogApi";
import { getComments, addComment } from "../api/commentApi";
import { toggleLike, getLikeCount } from "../api/likeApi";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./styles.css";

const BASE_URL = "https://chronicle-blogs.duckdns.org";
const MAX_COMMENT_LENGTH = 500;
const NOTICE_DURATION_MS = 3000;

/* =====================================================================
   Pure helpers
   ===================================================================== */

const isAuthError = (err) => [401, 403].includes(err?.response?.status);

const normalizeComment = (raw, index) => ({
  id: raw.id ?? `tmp-${index}`,
  author: raw.username || raw.authorName || raw.userName || "Reader",
  body: raw.content || raw.comment || "",
  createdAt: raw.createdAt || null,
});

const timeAgo = (iso) => {
  if (!iso) return "";
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "just now";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, size] of units) {
    const value = Math.floor(seconds / size);
    if (value >= 1) return `${value} ${name}${value > 1 ? "s" : ""} ago`;
  }
  return "";
};

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "R";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const calculateReadTime = (text) => {
  if (!text) return "5 min read";
  const words = text.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};

/* =====================================================================
   Icons
   ===================================================================== */

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
       fill={filled ? "currentColor" : "none"} stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const CommentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none"
       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* =====================================================================
   SocialSection: like, share, comments (self-contained)
   ===================================================================== */

function SocialSection({ blogId, title }) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState(null); // { type, text }

  const noticeTimer = useRef(null);
  const copiedTimer = useRef(null);

  const showNotice = useCallback((text, type = "error") => {
    clearTimeout(noticeTimer.current);
    setNotice({ text, type });
    noticeTimer.current = setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(noticeTimer.current);
      clearTimeout(copiedTimer.current);
    },
    []
  );

  const loadLikeCount = useCallback(async () => {
    try {
      const res = await getLikeCount(blogId);
      const value = typeof res.data === "number" ? res.data : res.data?.count ?? 0;
      setLikeCount(value);
      if (typeof res.data?.likedByMe === "boolean") setLiked(res.data.likedByMe);
    } catch (err) {
      console.error("Error loading like count:", err);
    }
  }, [blogId]);

  const loadComments = useCallback(async () => {
    try {
      const res = await getComments(blogId);
      const list = Array.isArray(res.data) ? res.data.map(normalizeComment) : [];
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setComments(list);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  }, [blogId]);

  useEffect(() => {
    loadLikeCount();
    loadComments();
  }, [loadLikeCount, loadComments]);

  // Optimistic like with rollback on failure
  const handleLike = async () => {
    if (isLiking) return;

    const previous = { liked, likeCount };
    setLiked(!liked);
    setLikeCount((count) => Math.max(0, count + (liked ? -1 : 1)));
    setIsLiking(true);

    try {
      const res = await toggleLike(blogId);
      if (typeof res?.data?.liked === "boolean") setLiked(res.data.liked);
      await loadLikeCount();
    } catch (err) {
      console.error("Error toggling like:", err);
      setLiked(previous.liked);
      setLikeCount(previous.likeCount);
      showNotice(
        isAuthError(err)
          ? "Log in to like this story."
          : "Couldn't save your like. Try again."
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: title || "Story", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err?.name !== "AbortError") {
        showNotice("Couldn't share this story. Copy the link from the address bar.");
      }
    }
  };

  const trimmed = commentText.trim();
  const canPost = trimmed.length > 0 && !isPosting;

  const submitComment = async () => {
    if (!canPost) return;
    try {
      setIsPosting(true);
      await addComment(blogId, { content: trimmed });
      setCommentText("");
      await loadComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      showNotice(
        isAuthError(err)
          ? "Log in to join the discussion."
          : "Couldn't post your comment. Try again."
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitComment();
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submitComment();
    }
  };

  const likeLabel = useMemo(
    () => `${likeCount} ${likeCount === 1 ? "like" : "likes"}`,
    [likeCount]
  );

  return (
    <section className="social" aria-label="Reactions and comments">
      <div className="social-bar">
        <button
          type="button"
          className={`social-btn social-btn--like ${liked ? "is-active" : ""}`}
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? `Unlike this story, ${likeLabel}` : `Like this story, ${likeLabel}`}
        >
          <HeartIcon filled={liked} />
          <span className="social-count">{likeCount}</span>
          <span className="social-btn-text">{likeCount === 1 ? "Like" : "Likes"}</span>
        </button>

        <a className="social-btn" href="#comments">
          <CommentIcon />
          <span className="social-count">{comments.length}</span>
          <span className="social-btn-text">
            {comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </a>

        <button
          type="button"
          className={`social-btn social-btn--share ${copied ? "is-active" : ""}`}
          onClick={handleShare}
        >
          {copied ? <CheckIcon /> : <ShareIcon />}
          <span className="social-btn-text">{copied ? "Link copied" : "Share"}</span>
        </button>
      </div>

      <div className="social-notice-slot" role="status" aria-live="polite">
        {notice && (
          <p className={`social-notice social-notice--${notice.type}`}>{notice.text}</p>
        )}
      </div>

      <div className="comments" id="comments">
        <h3 className="comments-title">Discussion</h3>

        <form className="comment-form" onSubmit={handleSubmit}>
          <label htmlFor="comment-input" className="visually-hidden">
            Write a comment
          </label>
          <textarea
            id="comment-input"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder="Share what this story made you think about"
            rows={3}
          />
          <div className="comment-form-footer">
            <span className="comment-hint">
              {commentText.length}/{MAX_COMMENT_LENGTH}
              <span className="comment-hint-keys"> · Ctrl+Enter to post</span>
            </span>
            <button type="submit" className="comment-submit" disabled={!canPost}>
              {isPosting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="comments-empty">No comments yet. Start the conversation.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((c) => (
              <li className="comment" key={c.id}>
                <span className="comment-avatar" aria-hidden="true">
                  {initialsOf(c.author)}
                </span>
                <div className="comment-main">
                  <div className="comment-head">
                    <span className="comment-author">{c.author}</span>
                    {c.createdAt && (
                      <time className="comment-time" dateTime={c.createdAt}>
                        {timeAgo(c.createdAt)}
                      </time>
                    )}
                  </div>
                  <p className="comment-body">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* =====================================================================
   BlogDetail page
   ===================================================================== */

export default function BlogDetail() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [flashUpdate, setFlashUpdate] = useState(false);

  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Load blog via REST
  const loadBlog = useCallback(async () => {
    try {
      const res = await getBlogById(id);
      setBlog(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (err) {
      console.error("Error loading blog:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Connect WebSocket
  const connectSocket = useCallback(() => {
    const socket = new SockJS(`${BASE_URL}/ws`);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);

      subscriptionRef.current = client.subscribe(`/topic/blog/${id}`, (message) => {
        const updatedBlog = JSON.parse(message.body);
        console.log("Realtime update received");
        setBlog(updatedBlog);
        setTitle(updatedBlog.title);
        setContent(updatedBlog.content);
        setFlashUpdate(true);
        setTimeout(() => setFlashUpdate(false), 600);
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.activate();
    stompClientRef.current = client;
  }, [id]);

  // Publish update via WebSocket
  const handleSave = () => {
    if (!stompClientRef.current || !title.trim() || !content.trim()) return;

    setIsSaving(true);

    stompClientRef.current.publish({
      destination: "/app/edit-blog",
      body: JSON.stringify({ id: blog.id, title, content }),
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 500);
  };

  const handleCancel = () => {
    setTitle(blog.title);
    setContent(blog.content);
    setIsEditing(false);
  };

  const disconnectSocket = () => {
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    if (stompClientRef.current) stompClientRef.current.deactivate();
  };

  useEffect(() => {
    loadBlog();
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [id, loadBlog, connectSocket]);

  // UI states
  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="error-state">
          <div className="error-icon">📖</div>
          <h2 className="error-title">Story Not Found</h2>
          <p className="error-message">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blogs" className="back-button">
            ← Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(blog.content);
  const publishDate = formatDate(blog.createdAt || blog.publishedAt);

  return (
    <div className="blog-detail-page">
      <article className="article-container">
        {/* ── HEADER ── */}
        <header className="article-header">
          <Link to="/blogs" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All Stories
          </Link>

          <div className="article-meta">
            <span className="article-category">Story</span>
            <span className="meta-divider">•</span>
            <span className="article-read-time">{readTime}</span>
            <span className="meta-divider">•</span>
            <span className="article-date">{publishDate}</span>
            <span className="meta-divider">•</span>

            {isConnected ? (
              <span className="live-indicator">
                <span className="live-dot" />
                Live
              </span>
            ) : (
              <span className="live-indicator live-indicator--offline">
                <span className="live-dot live-dot--offline" />
                Offline
              </span>
            )}
          </div>

          {isEditing && (
            <div className="edit-mode-banner">
              <span className="edit-mode-banner-icon">✏️</span>
              <span className="edit-mode-banner-text">Editing Mode</span>
              <span className="edit-mode-banner-sub">Changes will broadcast in real-time</span>
            </div>
          )}

          {isEditing ? (
            <input
              className="edit-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Story title..."
              autoFocus
            />
          ) : (
            <>
              <h1 className="article-title">{blog.title}</h1>
              <div className="title-underline" />
            </>
          )}
        </header>

        {/* ── CONTENT ── */}
        <div className={`article-content ${flashUpdate ? "realtime-flash" : ""}`}>
          {isEditing ? (
            <div className="edit-content-wrapper">
              <div className="edit-toolbar">
                <span className="edit-toolbar-label">Content</span>
                <span className="edit-toolbar-hint">Each new line becomes a paragraph</span>
              </div>
              <textarea
                className="edit-content-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell your story..."
                rows="14"
              />
            </div>
          ) : (
            <div className="content-body">
              {blog.content?.split("\n").map((paragraph, index) =>
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
              )}
            </div>
          )}
        </div>

        {/* ── LIKE / COMMENTS / SHARE ── */}
        <SocialSection blogId={id} title={blog.title} />

        {/* ── FOOTER ACTIONS ── */}
        <footer className="article-footer">
          <div className="footer-actions">
            <button
              className="btn-edit"
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Story
                </>
              )}
            </button>

            {isEditing && (
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={isSaving || !title.trim() || !content.trim()}
              >
                {isSaving ? (
                  <>
                    <span className="btn-spinner" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Save & Publish
                  </>
                )}
              </button>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}
