import { useEffect, useState } from "react";
import { getAllBlogs } from "../api/blogApi";
import { Link } from "react-router-dom";

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await getAllBlogs();
                setBlogs(response.data);
                setError(null);
            } catch (err) {
                setError(err.message || "Failed to fetch blogs");
                console.error("Error fetching blogs:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const styles = {
        container: {
            minHeight: '100vh',
            background: '#FFFFFF',
            padding: '60px 5%',
        },
        loadingContainer: {
            minHeight: '100vh',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        spinner: {
            width: '50px',
            height: '50px',
            border: '3px solid #F1F5F9',
            borderTop: '3px solid #3B82F6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
        },
        loadingText: {
            color: '#64748B',
            fontSize: '15px',
            fontWeight: '500',
        },
        errorContainer: {
            minHeight: '100vh',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        },
        errorBox: {
            background: '#FEF2F2',
            border: '1px solid #FEE2E2',
            padding: '24px 32px',
            borderRadius: '8px',
            maxWidth: '500px',
        },
        errorText: {
            color: '#DC2626',
            fontSize: '15px',
            fontWeight: '500',
        },
        maxWidth: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        header: {
            marginBottom: '48px',
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '24px',
        },
        title: {
            fontSize: '36px',
            fontWeight: '700',
            color: '#0F172A',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
        },
        subtitle: {
            color: '#64748B',
            fontSize: '16px',
            fontWeight: '400',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '32px',
        },
        card: (isHovered) => ({
            background: '#FFFFFF',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: isHovered
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
        }),
        cardContent: {
            padding: '24px',
        },
        cardMeta: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
        },
        category: {
            background: '#EFF6FF',
            color: '#3B82F6',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        date: {
            color: '#94A3B8',
            fontSize: '13px',
            fontWeight: '500',
        },
        cardTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#1E293B',
            marginBottom: '12px',
            lineHeight: '1.5',
        },
        excerpt: {
            color: '#64748B',
            fontSize: '15px',
            lineHeight: '1.6',
            marginBottom: '20px',
        },
        buttonContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #F1F5F9',
        },
        button: (isHovered) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            background: isHovered ? '#3B82F6' : '#FFFFFF',
            color: isHovered ? '#FFFFFF' : '#3B82F6',
            border: `2px solid ${isHovered ? '#3B82F6' : '#3B82F6'}`,
            cursor: 'pointer',
        }),
        arrow: (isHovered) => ({
            transition: 'transform 0.2s ease',
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
            fontSize: '14px',
        }),
        readTime: {
            color: '#94A3B8',
            fontSize: '13px',
            fontWeight: '500',
        },
    };

    if (isLoading) {
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
                    <p style={styles.loadingText}>Loading articles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorBox}>
                    <p style={styles.errorText}>{error}</p>
                </div>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ ...styles.loadingText, fontSize: '16px' }}>No articles available</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.maxWidth}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Latest Articles</h2>
                    <p style={styles.subtitle}>Insights, tutorials, and stories from our team</p>
                </div>

                <div style={styles.grid}>
                    {blogs.map((blog, index) => {
                        const isHovered = hoveredId === blog.id;

                        return (
                            <article
                                key={blog.id}
                                style={styles.card(isHovered)}
                                onMouseEnter={() => setHoveredId(blog.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div style={styles.cardContent}>
                                    <div style={styles.cardMeta}>
                                        <span style={styles.category}>Article</span>
                                        <span style={styles.date}>5 min read</span>
                                    </div>

                                    <h3 style={styles.cardTitle}>
                                        {blog.title}
                                    </h3>

                                    <p style={styles.excerpt}>
                                        Discover insights and learn best practices from industry experts.
                                    </p>

                                    <div style={styles.buttonContainer}>
                                        <Link
                                            to={`/blogs/${blog.id}`}
                                            style={styles.button(isHovered)}
                                        >
                                            <span>Read More</span>
                                            <span style={styles.arrow(isHovered)}>→</span>
                                        </Link>
                                        <span style={styles.readTime}>Jan {15 + index}, 2025</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}