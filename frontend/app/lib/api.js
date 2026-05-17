import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function authHeaders() {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Fetch all jobs with optional filters
export async function fetchJobs(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);

  const url = `${API_URL}/jobs${query.toString() ? `?${query}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch jobs");
  }

  return res.json();
}

// Fetch a single job by ID
export async function fetchJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, { cache: "no-store" });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch job");
  }

  return res.json();
}

// Create a new job (requires auth)
export async function createJob(jobData) {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      data.messages?.join(", ") || data.error || "Failed to create job"
    );
  }

  return res.json();
}

// Update job status (requires auth)
export async function updateJobStatus(id, status) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update status");
  }

  return res.json();
}

// Delete a job (requires auth)
export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete job");
  }

  return res.json();
}

// Register a new user
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Registration failed");
  }

  return res.json();
}

// Login a user
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Login failed");
  }

  return res.json();
}
