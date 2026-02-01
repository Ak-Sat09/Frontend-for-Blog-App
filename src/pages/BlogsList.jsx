import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../api/blogApi";
import "./styles.css";

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

  /**
   * Calculate reading time based on content length
   */
  const calculateReadTime = (content) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  /**
   * Truncate content for excerpt
   */
  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return "Discover insights and learn best practices from industry experts.";
    const text = content.trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) {
      const date = new Date();
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="blog-list-page">
        <div className="loading-state">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">Curating your stories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list-page">
        <div className="error-state">
          <div className="error-content">
            <div className="error-icon">⚠</div>
            <h3 className="error-title">Unable to Load Stories</h3>
            <p className="error-message">{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="blog-list-page">
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">No Stories Yet</h3>
            <p className="empty-message">Be the first to share your story with the community.</p>
            <Link to="/create" className="create-first-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Write Your First Story
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">Latest Stories</span>
          </div>
          <h1 className="hero-title">
            Discover Stories That
            <span className="hero-title-accent"> Inspire</span>
          </h1>
          <p className="hero-subtitle">
            Explore thought-provoking articles, personal journeys, and creative narratives from our community of writers.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{blogs.length}</span>
              <span className="stat-label">Stories</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blog-container">
        <div className="blog-grid">
          {blogs.map((blog, index) => {
            const isHovered = hoveredId === blog.id;
            const readTime = calculateReadTime(blog.content);
            const excerpt = getExcerpt(blog.content);
            const publishDate = formatDate(blog.createdAt || blog.publishedAt);

            return (
              <article
                key={blog.id}
                className={`blog-card ${isHovered ? "blog-card--hovered" : ""}`}
                onMouseEnter={() => setHoveredId(blog.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header */}
                <div className="card-header">
                  <div className="card-meta">
                    <span className="card-category">Story</span>
                    <span className="card-read-time">{readTime}</span>
                  </div>
                  <div className="card-bookmark">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-body">
                  <h3 className="card-title">
                    <Link to={`/blogs/${blog.id}`} className="card-title-link">
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="card-excerpt">{excerpt}</p>
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <div className="card-author">
                    <div className="author-avatar">
                      {blog.author?.name?.charAt(0).toUpperCase() || blog.title?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="author-info">
                      <span className="author-name">{blog.author?.name || "Anonymous"}</span>
                      <span className="publish-date">{publishDate}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/blogs/${blog.id}`} 
                    className="read-more-link"
                    aria-label={`Read ${blog.title}`}
                  >
                    <span>Read</span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="arrow-icon"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More Section */}
        <div className="load-more-section">
          <div className="load-more-divider"></div>
          <p className="load-more-text">You've reached the end of the stories</p>
          <Link to="/create" className="write-story-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Write Your Story
          </Link>
        </div>
      </div>
    </div>
  );
}
