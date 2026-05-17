"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchJobs } from "./lib/api";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "General"];
const STATUSES = ["All", "Open", "In Progress", "Closed"];

const CATEGORY_ICONS = {
  Plumbing: "🔧",
  Electrical: "⚡",
  Painting: "🎨",
  Joinery: "🪚",
  General: "🔨",
};

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
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (category !== "All") params.category = category;
      if (status !== "All") params.status = status;
      if (searchDebounce.trim()) params.search = searchDebounce.trim();
      const data = await fetchJobs(params);
      setJobs(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, status, searchDebounce]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Compute stats
  const openCount = jobs.filter((j) => j.status === "Open").length;
  const progressCount = jobs.filter((j) => j.status === "In Progress").length;
  const closedCount = jobs.filter((j) => j.status === "Closed").length;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          Service <span className="page-title-gradient">Requests</span>
        </h1>
        <p className="page-subtitle">
          Browse open service requests or post a new one
        </p>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--status-open)" }}>
              {openCount}
            </div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--status-progress)" }}>
              {progressCount}
            </div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--status-closed)" }}>
              {closedCount}
            </div>
            <div className="stat-label">Closed</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <select
          id="category-filter"
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>

        <select
          id="status-filter"
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Statuses" : s}
            </option>
          ))}
        </select>

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p className="loading-text">Loading job requests...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h3 className="empty-state-title">Something went wrong</h3>
          <p className="empty-state-text">{error}</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            onClick={loadJobs}
          >
            Try Again
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No job requests found</h3>
          <p className="empty-state-text">
            {category !== "All" || status !== "All" || searchDebounce
              ? "Try adjusting your filters or search query"
              : "Be the first to post a service request!"}
          </p>
          <a href="/new" className="btn btn-primary" style={{ marginTop: 16 }}>
            + Post a Request
          </a>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <a href={`/jobs/${job._id}`} key={job._id} className="card">
              <div className="card-header">
                <h2 className="card-title">{job.title}</h2>
                <span className={`status-badge ${getStatusClass(job.status)}`}>
                  {job.status}
                </span>
              </div>
              <p className="card-description">{job.description}</p>
              <div className="card-meta">
                {job.category && (
                  <span className="category-badge">
                    <span>{CATEGORY_ICONS[job.category] || "📌"}</span>
                    {job.category}
                  </span>
                )}
                {job.location && (
                  <span className="card-meta-item">
                    <span className="card-meta-icon">📍</span>
                    {job.location}
                  </span>
                )}
                <span className="card-meta-item">
                  <span className="card-meta-icon">📅</span>
                  {formatDate(job.createdAt)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
