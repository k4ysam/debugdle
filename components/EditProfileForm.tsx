"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const ICONS = ["💻", "🐛", "🔧", "🧠", "⚡", "🎯", "👾", "🦾", "🔍", "📡", "🚀", "🎮"];

interface EditProfileFormProps {
  onClose: () => void;
}

export function EditProfileForm({ onClose }: EditProfileFormProps) {
  const { user } = useAuth();
  const supabase = createClient();

  const currentAvatar = user?.user_metadata?.avatar as string | undefined;
  const currentName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.[0]?.toUpperCase() ??
    "";
  const isEmailUser = user?.app_metadata?.provider === "email";

  const [avatar, setAvatar] = useState(currentAvatar ?? "");
  const [username, setUsername] = useState(currentName);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    setSaving(true);

    const updates: { data?: Record<string, string>; password?: string } = {};
    updates.data = { display_name: username || currentName, avatar };
    if (isEmailUser && password) updates.password = password;

    const { error } = await supabase.auth.updateUser(updates);
    if (error) setError(error.message);
    else onClose();

    setSaving(false);
  };

  return (
    <div className="edit-profile-form">
      <p className="edit-profile-heading">edit profile</p>

      <label className="edit-profile-label">icon</label>
      <div className="edit-icon-grid">
        {ICONS.map((icon) => (
          <button
            key={icon}
            type="button"
            className={`edit-icon-btn${avatar === icon ? " selected" : ""}`}
            onClick={() => setAvatar((prev) => (prev === icon ? "" : icon))}
            aria-label={`Select ${icon}`}
          >
            {icon}
          </button>
        ))}
      </div>

      <label className="edit-profile-label">username</label>
      <input
        className="edit-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="display name"
        autoComplete="off"
        spellCheck={false}
      />

      {isEmailUser && (
        <>
          <label className="edit-profile-label">new password</label>
          <input
            className="edit-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="leave blank to keep current"
            autoComplete="new-password"
          />
        </>
      )}

      {error && <p className="edit-error">{error}</p>}

      <div className="edit-actions">
        <button className="edit-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "saving…" : "save"}
        </button>
        <button className="edit-cancel-btn" onClick={onClose}>
          cancel
        </button>
      </div>
    </div>
  );
}
