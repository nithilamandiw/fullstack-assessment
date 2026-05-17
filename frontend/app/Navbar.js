"use client";

import { useState, useEffect } from "react";
import { getUser, clearAuth } from "./lib/auth";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getUser());

    function handleAuthChange() {
      setUser(getUser());
    }

    function handleOpenAuth() {
      setShowAuth(true);
    }

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("open-auth-modal", handleOpenAuth);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("open-auth-modal", handleOpenAuth);
    };
  }, []);

  function handleLogout() {
    clearAuth();
    window.location.href = "/";
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-brand">
            <span className="navbar-brand-icon">🔧</span>
            <span>ServiceBoard</span>
          </a>
          <div className="navbar-links">
            <a href="/" className="navbar-link">
              All Jobs
            </a>
            {mounted && user ? (
              <>
                <a href="/new" className="navbar-link navbar-link-primary">
                  + New Request
                </a>
                <span className="navbar-user">{user.name}</span>
                <button
                  className="navbar-link navbar-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : mounted ? (
              <button
                className="navbar-link navbar-link-primary"
                onClick={() => setShowAuth(true)}
              >
                Sign In
              </button>
            ) : null}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
