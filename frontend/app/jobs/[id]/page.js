"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchJob, updateJobStatus, deleteJob } from "../../lib/api";
import { isLoggedIn } from "../../lib/auth";

const CATEGORY_ICONS = {
  Plumbing: "🔧",
  Electrical: "⚡",
  Painting: "🎨",
  Joinery: "🪚",
  General: "🔨",
};

const STATUS_OPTIONS = ["Open", "In Progress", "Closed"];

function getStatusClass(status) {
  switch (status) {
    case "Open":
      return "status-open";
    case "In Progress":
      return "status-in-progress";
    case "Closed":
      return "status-closed";
    default:
      return "";
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function JobDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchJob(id);
        setJob(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusChange(newStatus) {
    if (newStatus === job.status) return;
    try {
      setUpdatingStatus(true);
      const data = await updateJobStatus(id, newStatus);
      setJob(data.data);
      showToast(`Status updated to "${newStatus}"`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteJob(id);
      showToast("Job request deleted");
      setTimeout(() => router.push("/"), 800);
    } catch (err) {
      showToast(err.message, "error");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p className="loading-text">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">Job Not Found</h3>
          <p className="empty-state-text">{error}</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>
            ← Back to All Jobs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title">Delete this job request?</h3>
            <p className="modal-text">
              This action cannot be undone. The request &ldquo;{job.title}&rdquo; will
              be permanently removed.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="job-detail">
        <div className="page-header">
          <a href="/" className="back-link">
            ← Back to all requests
          </a>
        </div>

        <div className="job-detail-card">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
            >
              {job.category && (
                <span className="category-badge">
                  <span>{CATEGORY_ICONS[job.category] || "📌"}</span>
                  {job.category}
                </span>
              )}
              <span className={`status-badge ${getStatusClass(job.status)}`}>
                {job.status}
              </span>
            </div>
          </div>

          <h1 className="job-detail-title">{job.title}</h1>
          <p className="job-detail-description">{job.description}</p>

          <div className="job-detail-grid">
            {job.location && (
              <div className="detail-item">
                <span className="detail-label">📍 Location</span>
                <span className="detail-value">{job.location}</span>
              </div>
            )}
            {job.contactName && (
              <div className="detail-item">
                <span className="detail-label">👤 Contact Name</span>
                <span className="detail-value">{job.contactName}</span>
              </div>
            )}
            {job.contactEmail && (
              <div className="detail-item">
                <span className="detail-label">✉️ Contact Email</span>
                <span className="detail-value">{job.contactEmail}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">📅 Created</span>
              <span className="detail-value">{formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>

        {isLoggedIn() ? (
          <div className="job-actions-card">
            <div className="job-actions">
              <label
                htmlFor="status-select"
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                Update Status:
              </label>
              <select
                id="status-select"
                className="filter-select"
                value={job.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {updatingStatus && (
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Updating...
                </span>
              )}
            </div>

            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️ Delete Request
            </button>
          </div>
        ) : (
          <div className="auth-prompt">
            <button
              className="btn btn-primary"
              onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
            >
              Sign in to manage this request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
