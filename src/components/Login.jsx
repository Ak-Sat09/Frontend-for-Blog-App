import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/userService";
import { setToken } from "../utils/auth";
import "../styles.css";

export default function Login() {
  // Form state management
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Refs for accessibility and focus management
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  
  // Track submission attempts for rate limiting
  const submissionAttempts = useRef(0);
  const lastSubmissionTime = useRef(0);

  // Focus email input on mount for better UX
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  /**
   * Email validation using RFC 5322 compliant regex
   */
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Password validation - ensures minimum security requirements
   */
  const validatePassword = useCallback((password) => {
    return password.length >= 8;
  }, []);

  /**
   * Handle input changes with real-time validation
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Clear error for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    // Clear general message when user starts typing
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  }, [message.text]);

  /**
   * Validate all form fields before submission
   */
  const validateForm = useCallback(() => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(form.password)) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [form.email, form.password, validateEmail, validatePassword]);

  /**
   * Rate limiting check to prevent brute force attacks
   */
  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;
    
    if (timeSinceLastSubmission > 60000) {
      submissionAttempts.current = 0;
    }
    
    if (submissionAttempts.current >= 5 && timeSinceLastSubmission < 60000) {
      setMessage({
        text: "Too many login attempts. Please try again in a minute.",
        type: "error",
      });
      return false;
    }
    
    return true;
  }, []);

  /**
   * Handle form submission with comprehensive error handling
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validateForm()) {
      if (errors.email && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (errors.password && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }

    if (!checkRateLimit()) {
      return;
    }

    submissionAttempts.current += 1;
    lastSubmissionTime.current = Date.now();

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await loginUser(form);

      if (res.success) {
        setToken(res.data);
        
        setMessage({
          text: "Login successful! Redirecting...",
          type: "success",
        });

        setForm({ email: "", password: "" });
        submissionAttempts.current = 0;

        // Redirect happens via router
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorMessage = res.message || "Login failed. Please check your credentials.";
        
        setMessage({
          text: errorMessage,
          type: "error",
        });

        passwordInputRef.current?.select();
      }
    } catch (error) {
      console.error("Login error:", error);
      
      setMessage({
        text: "An unexpected error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [form, isLoading, validateForm, checkRateLimit, errors]);

  /**
   * Handle Enter key press for form submission
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e);
    }
  }, [handleSubmit, isLoading]);

  return (
    <div className="auth-page" role="main">
      {/* Background Decoration */}
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Auth Container */}
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 18C12 14.6863 14.6863 12 18 12H42C45.3137 12 48 14.6863 48 18V42C48 45.3137 45.3137 48 42 48H18C14.6863 48 12 45.3137 12 42V18Z"
                  fill="currentColor"
                  opacity="0.1"
                />
                <path
                  d="M21 24H39M21 30H39M21 36H33"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="brand-title">
              Chronicle
              <span className="brand-accent">.</span>
            </h1>
            <p className="brand-tagline">
              Where stories come to life. Join our community of writers and readers.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">✍️</div>
                <div className="feature-text">
                  <strong>Write</strong>
                  <span>Share your stories</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📚</div>
                <div className="feature-text">
                  <strong>Read</strong>
                  <span>Discover new voices</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💡</div>
                <div className="feature-text">
                  <strong>Inspire</strong>
                  <span>Connect with others</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to continue your journey</p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                className={`message-banner message-banner--${message.type}`}
                role={message.type === "error" ? "alert" : "status"}
                aria-live={message.type === "error" ? "assertive" : "polite"}
              >
                <div className="message-icon">
                  {message.type === "success" ? "✓" : message.type === "error" ? "⚠" : "ℹ"}
                </div>
                <p className="message-text">{message.text}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* Email Input */}
              <div className="form-field">
                <label htmlFor="email" className="field-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    ref={emailInputRef}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                    disabled={isLoading}
                    className={`field-input ${errors.email ? "field-input--error" : ""}`}
                  />
                </div>
                {errors.email && (
                  <span id="email-error" className="field-error" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password Input */}
              <div className="form-field">
                <label htmlFor="password" className="field-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    ref={passwordInputRef}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={`field-input ${errors.password ? "field-input--error" : ""}`}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span id="password-error" className="field-error" role="alert">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className={`submit-btn ${isLoading ? "submit-btn--loading" : ""}`}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="form-footer">
              <p className="footer-text">
                Don't have an account?{" "}
                <Link to="/register" className="footer-link">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
