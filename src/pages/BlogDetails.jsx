import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../api/blogApi";
import { toggleLike, getLikeCount } from "../api/likeApi";
import { getComments, addComment } from "../api/commentApi";

export default function BlogDetail() {
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [showShareBox, setShowShareBox] = useState(false);

    const shareUrl = `${window.location.origin}/share/blogs/${id}`;

    const loadLikes = useCallback(async () => {
        const res = await getLikeCount(id);
        setLikes(res.data.likes);
    }, [id]);

    const loadComments = useCallback(async () => {
        const res = await getComments(id);
        setComments(res.data.comments.content);
    }, [id]);

    const loadBlog = useCallback(async () => {
        try {
            const res = await getBlogById(id);
            setBlog(res.data);
            await loadLikes();
            await loadComments();
        } finally {
            setLoading(false);
        }
    }, [id, loadLikes, loadComments]);

    useEffect(() => {
        loadBlog();
    }, [loadBlog]);

    const handleLike = async () => {
        setIsLiked(prev => !prev);
        await toggleLike(id);
        loadLikes();
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        await addComment(id, { text: commentText });
        setCommentText("");
        loadComments();
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied");
    };

    if (loading) return <div>Loading...</div>;
    if (!blog) return <div>Blog not found</div>;

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2>{blog.title}</h2>
                <p>{blog.content}</p>

                {/* ACTIONS */}
                <div style={styles.actions}>
                    <button onClick={handleLike} style={styles.button}>
                        {isLiked ? "Liked" : "Like"}
                    </button>

                    <button
                        onClick={() => setShowShareBox(!showShareBox)}
                        style={styles.button}
                    >
                        Share
                    </button>
                </div>

                <div style={styles.likes}>{likes} likes</div>

                {/* SHARE BOX */}
                {showShareBox && (
                    <div style={styles.shareBox}>
                        <p><b>Share this blog</b></p>

                        <input
                            value={shareUrl}
                            readOnly
                            style={styles.shareInput}
                        />

                        <div style={styles.shareActions}>
                            <button onClick={copyLink} style={styles.button}>
                                Copy URL
                            </button>

                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                WhatsApp
                            </a>

                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Twitter
                            </a>
                        </div>

                        <button
                            onClick={() => setShowShareBox(false)}
                            style={{ marginTop: "10px" }}
                        >
                            Close
                        </button>
                    </div>
                )}

                {/* COMMENTS */}
                <div style={{ marginTop: "20px" }}>
                    <h4>Comments</h4>
                    {comments.length === 0 && <p>No comments yet</p>}
                    {comments.map(c => (
                        <div key={c.id} style={{ marginBottom: "6px" }}>
                            <b>User:</b> {c.text}
                        </div>
                    ))}
                </div>

                {/* ADD COMMENT */}
                <div style={styles.addComment}>
                    <input
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment"
                        style={styles.input}
                    />
                    <button onClick={handleAddComment} style={styles.button}>
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

/* STYLES */
const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        marginTop: "30px"
    },
    card: {
        width: "600px",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "6px"
    },
    actions: {
        display: "flex",
        gap: "12px"
    },
    button: {
        padding: "6px 12px",
        cursor: "pointer"
    },
    likes: {
        marginTop: "8px",
        fontWeight: "600"
    },
    shareBox: {
        marginTop: "15px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "#f9f9f9"
    },
    shareInput: {
        width: "100%",
        padding: "6px",
        marginTop: "6px"
    },
    shareActions: {
        display: "flex",
        gap: "12px",
        marginTop: "10px"
    },
    addComment: {
        display: "flex",
        gap: "10px",
        marginTop: "15px"
    },
    input: {
        flex: 1,
        padding: "6px"
    }
};
