import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api/blogApi";
import "./styles.css";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(text.length);
  };

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBlog({ title, content });
      navigate("/blogs");
    } catch (error) {
      alert("Failed to create blog. Please try again.");
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    localStorage.setItem(
      "blog-draft",
      JSON.stringify({ title, content, timestamp: Date.now() })
    );
    alert("Draft saved locally");
  };

  return (
    <div className="create-blog-page">
      {/* Header Section */}
      <div className="create-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              Craft Your Story
              <span className="title-decoration"></span>
            </h1>
            <p className="page-subtitle">
              Every great story begins with a single word. What's yours?
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={saveDraft}
              disabled={isSubmitting}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 21V13H7V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 3V8H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="editor-container">
        <div className="editor-wrapper">
          {/* Title Input */}
          <div className="title-section">
            <div className="input-wrapper">
              <input
                type="text"
                className="title-input"
                placeholder="Enter your captivating title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                autoFocus
              />
              <div className="title-underline"></div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="content-section">
            <div className="editor-chrome">
              <div className="editor-toolbar">
                <div className="toolbar-group">
                  <span className="toolbar-label">Format</span>
                  <button className="toolbar-btn" title="Bold">
                    <strong>B</strong>
                  </button>
                  <button className="toolbar-btn" title="Italic">
                    <em>I</em>
                  </button>
                  <button className="toolbar-btn" title="Underline">
                    <u>U</u>
                  </button>
                </div>
                <div className="toolbar-divider"></div>
                <div className="toolbar-group">
                  <span className="toolbar-label">Insert</span>
                  <button className="toolbar-btn" title="Quote">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                  </button>
                  <button className="toolbar-btn" title="Link">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="textarea-wrapper">
              <textarea
                className="content-textarea"
                placeholder="Begin writing your story here... Let your thoughts flow freely."
                value={content}
                onChange={handleContentChange}
                rows={20}
              />
              <div className="textarea-gradient"></div>
            </div>

            {/* Stats Bar */}
            <div className="stats-bar">
              <div className="stat-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>{wordCount} words</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                </svg>
                <span>{charCount} characters</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>~{Math.ceil(wordCount / 200)} min read</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="action-bar">
            <div className="action-left">
              <button
                className="btn-text"
                onClick={() => navigate("/blogs")}
                disabled={isSubmitting}
              >
                ← Back to Stories
              </button>
            </div>
            <div className="action-right">
              <button
                className="btn-primary"
                onClick={submit}
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                    Publish Story
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tips */}
      <div className="writing-tips">
        <div className="tip-card">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <h4>Writing Tip</h4>
            <p>Start with a hook that captures attention within the first sentence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
