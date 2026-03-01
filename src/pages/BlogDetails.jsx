import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogById } from "../api/blogApi";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./styles.css";

const BASE_URL = "https://demo-cicd-latest-6p2b.onrender.com";

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

  // -----------------------------------
  // Load Blog via REST
  // -----------------------------------
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

  // -----------------------------------
  // Connect WebSocket
  // -----------------------------------
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

      subscriptionRef.current = client.subscribe(
        `/topic/blog/${id}`,
        (message) => {
          const updatedBlog = JSON.parse(message.body);
          console.log("Realtime update received");
          setBlog(updatedBlog);
          setTitle(updatedBlog.title);
          setContent(updatedBlog.content);
          // Flash the content on real-time update
          setFlashUpdate(true);
          setTimeout(() => setFlashUpdate(false), 600);
        }
      );
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.activate();
    stompClientRef.current = client;
  }, [id]);

  // -----------------------------------
  // Publish Update via WebSocket
  // -----------------------------------
  const handleSave = () => {
    if (!stompClientRef.current || !title.trim() || !content.trim()) return;

    setIsSaving(true);

    stompClientRef.current.publish({
      destination: "/app/edit-blog",
      body: JSON.stringify({
        id: blog.id,
        title,
        content,
      }),
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 500);
  };

  const handleCancel = () => {
    // Revert to current blog data
    setTitle(blog.title);
    setContent(blog.content);
    setIsEditing(false);
  };

  // -----------------------------------
  // Cleanup
  // -----------------------------------
  const disconnectSocket = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  };

  // -----------------------------------
  // Lifecycle
  // -----------------------------------
  useEffect(() => {
    loadBlog();
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [id, loadBlog, connectSocket]);

  // -----------------------------------
  // Helpers
  // -----------------------------------
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
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // -----------------------------------
  // UI States
  // -----------------------------------
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

          {/* Back Navigation */}
          <Link to="/blogs" className="back-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All Stories
          </Link>

          {/* Meta Row */}
          <div className="article-meta">
            <span className="article-category">Story</span>
            <span className="meta-divider">•</span>
            <span className="article-read-time">{readTime}</span>
            <span className="meta-divider">•</span>
            <span className="article-date">{publishDate}</span>
            <span className="meta-divider">•</span>

            {/* Live WebSocket Indicator */}
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

          {/* Edit Mode Banner */}
          {isEditing && (
            <div className="edit-mode-banner">
              <span className="edit-mode-banner-icon">✏️</span>
              <span className="edit-mode-banner-text">Editing Mode</span>
              <span className="edit-mode-banner-sub">
                Changes will broadcast in real-time
              </span>
            </div>
          )}

          {/* Title — View vs Edit */}
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
                <span className="edit-toolbar-hint">
                  Each new line becomes a paragraph
                </span>
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
                paragraph.trim() ? (
                  <p key={index}>{paragraph}</p>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <footer className="article-footer">
          <div className="footer-actions">

            {/* Edit / Cancel Toggle */}
            <button
              className="btn-edit"
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Story
                </>
              )}
            </button>

            {/* Save — only in edit mode */}
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
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
