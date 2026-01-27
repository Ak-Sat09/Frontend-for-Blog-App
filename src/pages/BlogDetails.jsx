import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../api/blogApi";
import { toggleLike, getLikeCount } from "../api/likeApi";
import { getComments, addComment } from "../api/commentApi";

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);

    const refreshLikes = useCallback(async () => {
        try {
            const r = await getLikeCount(id);
            setLikes(r.data.likes);
        } catch (err) {
            console.error("Error fetching likes:", err);
        }
    }, [id]);

    const loadComments = useCallback(async () => {
        try {
            const r = await getComments(id);
            setComments(r.data.comments.content);
        } catch (err) {
            console.error("Error loading comments:", err);
        }
    }, [id]);

    const fetchBlog = useCallback(async () => {
        setLoading(true);
        try {
            const blogRes = await getBlogById(id);
            setBlog(blogRes.data);
            await refreshLikes();
            await loadComments();
        } catch (err) {
            console.error("Error fetching blog:", err);
        } finally {
            setLoading(false);
        }
    }, [id, refreshLikes, loadComments]);

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    const onLike = async () => {
        try {
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);

            if (newLikedState) {
                setShowLikeAnimation(true);
                setTimeout(() => setShowLikeAnimation(false), 600);
            }

            await toggleLike(id);
            refreshLikes();
        } catch (err) {
            console.error("Error toggling like:", err);
            setIsLiked(!isLiked);
        }
    };

    const onComment = async () => {
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(id, text);
            setText("");
            await loadComments();
        } catch (err) {
            console.error("Error adding comment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        pageContainer: {
            minHeight: "100vh",
            background: "#FAFAFA",
            padding: "20px 0",
        },
        loadingContainer: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        spinner: {
            width: "50px",
            height: "50px",
            border: "3px solid #DBDBDB",
            borderTop: "3px solid #262626",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
        },
        container: {
            maxWidth: "615px",
            margin: "0 auto",
        },
        backButton: {
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: "20px",
            fontWeight: "600",
        },
        postCard: {
            background: "#FFFFFF",
            border: "1px solid #DBDBDB",
            borderRadius: "8px",
        },
        postHeader: {
            display: "flex",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: "1px solid #EFEFEF",
        },
        avatar: {
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#262626",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
            fontWeight: "700",
        },
        postContent: {
            padding: "16px",
        },
        title: {
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "12px",
        },
        content: {
            fontSize: "14px",
            lineHeight: "1.6",
        },
        actionsBar: {
            padding: "8px 16px",
            borderTop: "1px solid #EFEFEF",
            borderBottom: "1px solid #EFEFEF",
        },
        actionButton: (active) => ({
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            color: active ? "#ED4956" : "#262626",
        }),
        likesCount: {
            padding: "8px 16px",
            fontWeight: "600",
        },
        commentsSection: {
            padding: "16px",
        },
        comment: {
            marginBottom: "12px",
            fontSize: "14px",
        },
        commentInputSection: {
            padding: "16px",
            borderTop: "1px solid #EFEFEF",
        },
        commentInput: {
            width: "100%",
            border: "none",
            outline: "none",
        },
        likeAnimation: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "100px",
        },
    };

    if (loading || !blog) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            {showLikeAnimation && <div style={styles.likeAnimation}>❤️</div>}

            <div style={styles.container}>
                <button style={styles.backButton} onClick={() => window.history.back()}>
                    ← Back
                </button>

                <div style={styles.postCard}>
                    <div style={styles.postHeader}>
                        <div style={styles.avatar}>B</div>
                        <strong>Blog Author</strong>
                    </div>

                    <div style={styles.postContent}>
                        <h1 style={styles.title}>{blog.title}</h1>
                        <p style={styles.content}>{blog.content}</p>
                    </div>

                    <div style={styles.actionsBar}>
                        <button
                            style={styles.actionButton(isLiked)}
                            onClick={onLike}
                        >
                            {isLiked ? "❤️" : "🤍"}
                        </button>
                    </div>

                    {likes > 0 && (
                        <div style={styles.likesCount}>
                            {likes} {likes === 1 ? "like" : "likes"}
                        </div>
                    )}

                    <div style={styles.commentsSection}>
                        {comments.map((c) => (
                            <div key={c.id} style={styles.comment}>
                                <strong>user</strong> {c.text}
                            </div>
                        ))}
                    </div>

                    <div style={styles.commentInputSection}>
                        <input
                            style={styles.commentInput}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button
                            disabled={isSubmitting || !text.trim()}
                            onClick={onComment}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
