"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "../lib/api";
import { isLoggedIn } from "../lib/auth";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "General"];

export default function NewJobPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/");
      setTimeout(() => window.dispatchEvent(new Event("open-auth-modal")), 300);
    }
  }, [router]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (form.contactEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contactEmail.trim())) {
        newErrors.contactEmail = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await createJob({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
      });
      showToast("Job request created successfully!");
      setTimeout(() => router.push("/"), 1000);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <div className="form-page">
        <div className="page-header">
          <a href="/" className="back-link">
            ← Back to all requests
          </a>
          <h1 className="page-title">
            New <span className="page-title-gradient">Service Request</span>
          </h1>
          <p className="page-subtitle">
            Describe the job you need done and we&apos;ll connect you with tradespeople
          </p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder='e.g. "Need a plumber for a leaking kitchen tap"'
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Describe the issue in detail — what needs fixing, the scope of work, etc."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              {errors.description && (
                <p className="form-error">{errors.description}</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  className="form-select"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Glasgow"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactName" className="form-label">
                  Contact Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail" className="form-label">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                />
                {errors.contactEmail && (
                  <p className="form-error">{errors.contactEmail}</p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Submit Request"}
              </button>
              <a href="/" className="btn btn-secondary btn-lg">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
