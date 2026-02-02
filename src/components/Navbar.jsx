import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../utils/auth";
import "./navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const authLinks = [
    { path: "/blogs", label: "Stories", icon: "📚" },
    { path: "/create", label: "Write", icon: "✍️" },
  ];

  return (
    <nav className={`modern-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/blogs" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 12C8 9.79086 9.79086 8 12 8H28C30.2091 8 32 9.79086 32 12V28C32 30.2091 30.2091 32 28 32H12C9.79086 32 8 30.2091 8 28V12Z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M14 16H26M14 20H26M14 24H22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="logo-text">Chronicle<span className="logo-accent">.</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {/* Public Stories button */}
          <Link
            to="/blogs"
            className={`nav-link ${isActive("/blogs") ? "active" : ""}`}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-label">Stories</span>
            {isActive("/blogs") && <span className="active-indicator" />}
          </Link>

          {/* Auth Links */}
          {isAuthenticated() &&
            authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
                {isActive(link.path) && <span className="active-indicator" />}
              </Link>
            ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {!isAuthenticated() && (
            <>
              <Link to="/login" className="action-btn">Login</Link>
              <Link to="/register" className="action-btn">Register</Link>
            </>
          )}

          {isAuthenticated() && (
            <button className="action-btn logout-btn" onClick={handleLogout}>
              Exit
            </button>
          )}

          {/* Mobile Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          {/* Public Stories */}
          <Link
            to="/blogs"
            className={`mobile-nav-link ${isActive("/blogs") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-label">Stories</span>
          </Link>

          {/* Auth Links */}
          {isAuthenticated() &&
            authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive(link.path) ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            ))}

          {/* Auth Buttons */}
          {!isAuthenticated() ? (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <button className="mobile-logout" onClick={handleLogout}>Sign Out</button>
          )}
        </div>
      </div>
    </nav>
  );
}
