"use client";

import { useState } from "react";
import { loginUser, registerUser } from "./lib/api";
import { saveAuth } from "./lib/auth";

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function switchTab(newTab) {
    setTab(newTab);
    setErrors({});
    setToast(null);
  }

  function validate() {
    const newErrors = {};

    if (tab === "register" && (!form.name || !form.name.trim())) {
      newErrors.name = "Name is required";
    }

    if (!form.email || !form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      let data;

      if (tab === "login") {
        data = await loginUser({
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        data = await registerUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      }

      saveAuth(data.token, data.user);
      showToast(tab === "login" ? "Welcome back!" : "Account created!");
      setTimeout(() => {
        onClose();
        setForm({ name: "", email: "", password: "" });
        setTab("login");
        setErrors({});
      }, 600);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="auth-overlay" onClick={handleOverlayClick}>
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {tab === "login" ? "Welcome " : "Join "}
            <span className="page-title-gradient">
              {tab === "login" ? "Back" : "ServiceBoard"}
            </span>
          </h2>
          <p className="auth-modal-subtitle">
            {tab === "login"
              ? "Sign in to post and manage service requests"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "auth-tab-active" : ""}`}
            onClick={() => switchTab("login")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "auth-tab-active" : ""}`}
            onClick={() => switchTab("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {tab === "register" && (
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="auth-name"
                type="text"
                className="form-input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
            {errors.password && (
              <p className="form-error">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: 8 }}
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : tab === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
