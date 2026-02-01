import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/userService";
import "../styles.css";

export default function Register() {
  // Form state management
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Refs for accessibility
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Focus name input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  /**
   * Calculate password strength
   */
  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(100, strength);
  }, []);

  /**
   * Email validation
   */
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Password validation
   */
  const validatePassword = useCallback((password) => {
    return password.length >= 8;
  }, []);

  /**
   * Name validation
   */
  const validateName = useCallback((name) => {
    return name.trim().length >= 2;
  }, []);

  /**
   * Handle input changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Calculate password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    // Clear general message
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  }, [message.text, calculatePasswordStrength]);

  /**
   * Validate all form fields
   */
  const validateForm = useCallback(() => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    // Name validation
    if (!form.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (!validateName(form.name)) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(form.password)) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [form, validateEmail, validatePassword, validateName]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validateForm()) {
      // Focus on first error field
      if (errors.name && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (errors.email && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (errors.password && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = form;
      const res = await registerUser(registrationData);

      if (res.success || res.message?.includes("success")) {
        setMessage({
          text: "Registration successful! Redirecting to login...",
          type: "success",
        });

        // Clear form
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        setPasswordStrength(0);

        // Redirect to login after success
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorMessage = res.message || "Registration failed. Please try again.";
        
        setMessage({
          text: errorMessage,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      setMessage({
        text: "An unexpected error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [form, isLoading, validateForm, errors]);

  /**
   * Get password strength color and label
   */
  const getPasswordStrengthInfo = () => {
    if (passwordStrength === 0) return { color: 'transparent', label: '' };
    if (passwordStrength < 40) return { color: '#ef4444', label: 'Weak' };
    if (passwordStrength < 70) return { color: '#f59e0b', label: 'Fair' };
    if (passwordStrength < 90) return { color: '#10b981', label: 'Good' };
    return { color: '#059669', label: 'Strong' };
  };

  const strengthInfo = getPasswordStrengthInfo();

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
              Start your writing journey today. Join thousands of writers sharing their stories.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <div className="feature-text">
                  <strong>Quick Start</strong>
                  <span>Create your account in seconds</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <strong>No Limits</strong>
                  <span>Unlimited stories and reads</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤝</div>
                <div className="feature-text">
                  <strong>Community</strong>
                  <span>Connect with fellow writers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Begin your storytelling adventure</p>
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* Name Input */}
              <div className="form-field">
                <label htmlFor="name" className="field-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    ref={nameInputRef}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    autoComplete="name"
                    disabled={isLoading}
                    className={`field-input ${errors.name ? "field-input--error" : ""}`}
                  />
                </div>
                {errors.name && (
                  <span id="name-error" className="field-error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

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
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    autoComplete="new-password"
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
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${passwordStrength}%`,
                          backgroundColor: strengthInfo.color 
                        }}
                      ></div>
                    </div>
                    {strengthInfo.label && (
                      <span className="strength-label" style={{ color: strengthInfo.color }}>
                        {strengthInfo.label}
                      </span>
                    )}
                  </div>
                )}
                
                {errors.password && (
                  <span id="password-error" className="field-error" role="alert">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="form-field">
                <label htmlFor="confirmPassword" className="field-label">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    autoComplete="new-password"
                    disabled={isLoading}
                    className={`field-input ${errors.confirmPassword ? "field-input--error" : ""}`}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <span id="confirm-password-error" className="field-error" role="alert">
                    {errors.confirmPassword}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
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
                Already have an account?{" "}
                <Link to="/login" className="footer-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}