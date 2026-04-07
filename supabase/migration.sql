-- ============================================================
-- Debugdle — Supabase migration
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles (display_name);

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS: profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── plays ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plays (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  played_date  DATE NOT NULL,
  scenario_id  TEXT NOT NULL,
  hints_used   SMALLINT NOT NULL CHECK (hints_used BETWEEN 1 AND 6),
  won          BOOLEAN NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, played_date)
);

-- Streak queries: user plays ordered by date
CREATE INDEX IF NOT EXISTS idx_plays_user_date ON plays (user_id, played_date DESC);

-- Leaderboard: most wins
CREATE INDEX IF NOT EXISTS idx_plays_won ON plays (user_id) WHERE won = true;

-- RLS: plays
ALTER TABLE plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plays_select_own"
  ON plays FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "plays_insert_own"
  ON plays FOR INSERT WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE policies — plays are immutable

-- ── compute_streak function ──────────────────────────────────
-- Used by leaderboard; also callable from client as RPC
CREATE OR REPLACE FUNCTION compute_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak    INTEGER := 0;
  prev_date DATE;
  rec       RECORD;
BEGIN
  FOR rec IN
    SELECT played_date FROM plays
    WHERE user_id = p_user_id AND won = true
    ORDER BY played_date DESC
  LOOP
    IF prev_date IS NULL THEN
      IF rec.played_date < CURRENT_DATE - INTERVAL '1 day' THEN
        RETURN 0;
      END IF;
      streak := 1;
    ELSIF prev_date - rec.played_date = 1 THEN
      streak := streak + 1;
    ELSE
      EXIT;
    END IF;
    prev_date := rec.played_date;
  END LOOP;
  RETURN streak;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
