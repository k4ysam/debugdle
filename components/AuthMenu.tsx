"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

type Mode = "signin" | "signup";

export function AuthMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // Show error if redirected back from a failed OAuth attempt
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth_error")) {
      setOpen(true);
      setError("Google sign-in failed. Check that Google is enabled in the Supabase dashboard and the redirect URI is set correctly in Google Cloud Console.");
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const reset = () => {
    setEmail(""); setPassword(""); setDisplayName(""); setError(""); setInfo("");
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Don't setLoading(false) on success — browser is redirecting
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else { setOpen(false); reset(); }
    } else {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName || email.split("@")[0] } },
      });
      if (error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          setError("Email rate limit hit. Use Google sign-in instead, or try again later.");
        } else {
          setError(error.message);
        }
      } else if (data.session) {
        // Email confirmation disabled — signed in immediately
        setOpen(false); reset();
      } else {
        // Email confirmation required
        setInfo("Check your inbox to confirm your email, then sign in.");
        setPassword("");
      }
    }

    setLoading(false);
  };

  if (user) {
    const name = (user.user_metadata?.display_name as string | undefined)
      ?? (user.user_metadata?.full_name as string | undefined)
      ?? user.email?.split("@")[0]
      ?? "user";

    return (
      <div className="auth-menu">
        <span className="auth-name" title={user.email ?? ""}>
          {name.length > 12 ? name.slice(0, 12) + "…" : name}
        </span>
        <button className="auth-link" onClick={signOut}>
          sign out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-menu">
      <button
        className="auth-link"
        onClick={() => { setOpen((o) => !o); reset(); }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        sign in
      </button>

      {open && (
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
            sign in with google
          </button>

          <div className="auth-divider"><span>or</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <input
                className="auth-input"
                type="text"
                placeholder="display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            )}
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
            {info && <p className="auth-info">{info}</p>}

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "…" : mode === "signin" ? "sign in" : "create account"}
            </button>
          </form>

          <button
            className="auth-mode-toggle"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
          >
            {mode === "signin"
              ? "need an account? sign up"
              : "already have an account? sign in"}
          </button>
        </div>
      )}
    </div>
  );
}
