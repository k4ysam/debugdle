"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useAuthPanel } from "@/context/AuthPanelContext";
import { useState } from "react";

type Mode = "signin" | "signup";

export function AuthMenu() {
  const { user } = useAuth();
  const { open, setOpen } = useAuthPanel();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth_error")) {
      setOpen(true);
      setError("Google sign-in failed. Make sure Google is enabled in Supabase and the redirect URI is set in Google Cloud Console.");
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [setOpen]);

  const reset = () => { setEmail(""); setPassword(""); setError(""); };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else { setOpen(false); reset(); }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else { setOpen(false); reset(); }
    }

    setLoading(false);
  };

  // Derive avatar/initial for the icon button
  const avatar = user?.user_metadata?.avatar as string | undefined;
  const initial = user ? (user.email?.[0] ?? "?").toUpperCase() : null;

  return (
    <div className="auth-menu">
      <button
        className={`auth-icon-btn${user ? " auth-icon-btn--signed-in" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={user ? "Account menu" : "Sign in"}
        title={user ? (user.email ?? "") : "Sign in"}
      >
        {user ? (avatar || initial) : "◯"}
      </button>

      {open && !user && (
        <div className="auth-panel" ref={panelRef} role="dialog" aria-label="Sign in">
          <button
            className="auth-panel-close"
            onClick={() => { setOpen(false); reset(); }}
            aria-label="Close"
          >
            ✕
          </button>

          <button
            className="auth-google-btn"
            onClick={handleGoogle}
            disabled={loading}
          >
            {loading ? "…" : "sign in with google"}
          </button>

          <div className="auth-divider"><span>or</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              className="auth-input"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="auth-input"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "…" : mode === "signin" ? "sign in" : "create account"}
            </button>
          </form>

          <button
            className="auth-mode-toggle"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
          >
            {mode === "signin" ? "need an account? sign up" : "already have an account? sign in"}
          </button>
        </div>
      )}
    </div>
  );
}
