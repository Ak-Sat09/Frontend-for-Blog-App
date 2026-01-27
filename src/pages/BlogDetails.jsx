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

    const refreshLikes = useCallback(async () => {
        const r = await getLikeCount(id);
        setLikes(r.data.likes);
    }, [id]);

    const loadComments = useCallback(async () => {
        const r = await getComments(id);
        setComments(r.data.comments.content);
    }, [id]);

    const fetchBlog = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getBlogById(id);
            setBlog(res.data);
            await refreshLikes();
            await loadComments();
        } finally {
            setLoading(false);
        }
    }, [id, refreshLikes, loadComments]);

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    const onLike = async () => {
        setIsLiked(!isLiked);
        await toggleLike(id);
        refreshLikes();
    };

    const onShare = () => {
        const shareUrl = `${window.location.origin}/share/blogs/${id}`;
        navigator.clipboard.writeText(shareUrl);
        alert("Share link copied");
    };

    const onComment = async () => {
        if (!text.trim()) return;
        await addComment(id, text);
        setText("");
        loadComments();
    };

    if (loading || !blog) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>

            {/* ACTION BAR */}
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                <button onClick={onLike}>
                    {isLiked ? "Liked" : "Like"}
                </button>

                <button onClick={onShare}>
                    Share
                </button>
            </div>

            <div style={{ marginTop: "8px", fontWeight: "600" }}>
                {likes} likes
            </div>

            {/* COMMENTS */}
            <div style={{ marginTop: "20px" }}>
                {comments.map(c => (
                    <div key={c.id}>
                        <b>User:</b> {c.text}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "12px" }}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add comment"
                />
                <button onClick={onComment}>Post</button>
            </div>
        </div>
    );
}
