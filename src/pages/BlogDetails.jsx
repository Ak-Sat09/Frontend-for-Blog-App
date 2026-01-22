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
            minHeight: '100vh',
            background: '#FAFAFA',
            padding: '20px 0',
        },
        loadingContainer: {
            minHeight: '100vh',
            background: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        spinner: {
            width: '50px',
            height: '50px',
            border: '3px solid #DBDBDB',
            borderTop: '3px solid #262626',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
        },
        container: {
            maxWidth: '615px',
            margin: '0 auto',
        },
        backButton: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#262626',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            marginBottom: '20px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '8px 0',
            marginLeft: '20px',
        },
        postCard: {
            background: '#FFFFFF',
            border: '1px solid #DBDBDB',
            borderRadius: '8px',
            marginBottom: '20px',
        },
        postHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid #EFEFEF',
        },
        avatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '14px',
            marginRight: '12px',
        },
        username: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#262626',
        },
        postContent: {
            padding: '16px',
        },
        title: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#262626',
            marginBottom: '12px',
            lineHeight: '1.4',
        },
        content: {
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#262626',
        },
        actionsBar: {
            padding: '6px 16px',
            borderTop: '1px solid #EFEFEF',
            borderBottom: '1px solid #EFEFEF',
        },
        actionButtons: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '8px 0',
        },
        actionButton: (active) => ({
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '24px',
            transition: 'transform 0.2s ease',
            color: active ? '#ED4956' : '#262626',
        }),
        likesCount: {
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#262626',
        },
        commentsSection: {
            padding: '16px',
            maxHeight: '400px',
            overflowY: 'auto',
        },
        comment: {
            marginBottom: '16px',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#262626',
        },
        commentUsername: {
            fontWeight: '600',
            marginRight: '8px',
        },
        emptyComments: {
            textAlign: 'center',
            padding: '40px 20px',
            color: '#8E8E8E',
            fontSize: '14px',
        },
        commentInputSection: {
            padding: '16px',
            borderTop: '1px solid #EFEFEF',
        },
        commentInputContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        commentInput: {
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#262626',
            padding: '8px 0',
        },
        postButton: (disabled) => ({
            background: 'none',
            border: 'none',
            color: disabled ? '#B2DFFC' : '#0095F6',
            fontSize: '14px',
            fontWeight: '600',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '0',
        }),
        likeAnimation: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '100px',
            animation: 'likePopup 0.6s ease-out',
            pointerEvents: 'none',
            zIndex: 1000,
        },
    };

    if (loading || !blog) {
        return (
            <div style={styles.loadingContainer}>
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <div style={{ textAlign: 'center' }}>
                    <div style={styles.spinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                    }
                @keyframes likePopup {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0;
                    }
                }
            `}</style>

            {showLikeAnimation && (
                <div style={styles.likeAnimation}>❤️</div>
            )}

            <div style={styles.container}>
                <button
                    style={styles.backButton}
                    onClick={() => window.history.back()}
                >
                    ← Back
                </button>

                <div style={styles.postCard}>
                    <div style={styles.postHeader}>
                        <div style={styles.avatar}>B</div>
                        <div>
                            <div style={styles.username}>Blog Author</div>
                        </div>
                    </div>

                    <div style={styles.postContent}>
                        <h1 style={styles.title}>{blog.title}</h1>
                        <p style={styles.content}>{blog.content}</p>
                    </div>

                    <div style={styles.actionsBar}>
                        <div style={styles.actionButtons}>
                            <button
                                style={styles.actionButton(isLiked)}
                                onClick={onLike}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                {isLiked ? '❤️' : '🤍'}
                            </button>
                            <button style={styles.actionButton(false)}>
                                💬
                            </button>
                            <button style={styles.actionButton(false)}>
                                📤
                            </button>
                        </div>
                    </div>

                    {likes > 0 && (
                        <div style={styles.likesCount}>
                            {likes} {likes === 1 ? 'like' : 'likes'}
                        </div>
                    )}

                    <div style={styles.commentsSection}>
                        {comments.length === 0 ? (
                            <div style={styles.emptyComments}>
                                No comments yet
                            </div>
                        ) : (
                            comments.map(c => (
                                <div key={c.id} style={styles.comment}>
                                    <span style={styles.commentUsername}>user</span>
                                    {c.text}
                                </div>
                            ))
                        )}
                    </div>

                    <div style={styles.commentInputSection}>
                        <div style={styles.commentInputContainer}>
                            <input
                                style={styles.commentInput}
                                type="text"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="Add a comment..."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !isSubmitting && text.trim()) {
                                        onComment();
                                    }
                                }}
                            />
                            <button
                                style={styles.postButton(isSubmitting || !text.trim())}
                                onClick={onComment}
                                disabled={isSubmitting || !text.trim()}
                            >
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}