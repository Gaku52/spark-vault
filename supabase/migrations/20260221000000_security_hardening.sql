-- ============================================================
-- Security Hardening Migration
-- Date: 2026-02-21
-- Description: RLSポリシーの整理と最小権限の適用
-- ============================================================

-- ------------------------------------------------------------
-- 1. RLS有効化（冪等: 既に有効でもエラーにならない）
-- ------------------------------------------------------------
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 2. 重複ポリシーの削除
--    {public}ロール向けの重複ポリシーを削除し、
--    {authenticated}ロール向けの4ポリシーのみ残す。
--    ゲストユーザーもsignInAnonymously()でauthenticated扱い。
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Users can create own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can create their own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can delete own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can update own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can view own ideas" ON public.ideas;

-- ------------------------------------------------------------
-- 3. 正規ポリシー（冪等: IF NOT EXISTS相当の処理）
--    全操作で auth.uid() = user_id を強制
-- ------------------------------------------------------------
DO $$
BEGIN
  -- SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ideas'
      AND policyname = 'Users can view their own ideas'
  ) THEN
    CREATE POLICY "Users can view their own ideas" ON public.ideas
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ideas'
      AND policyname = 'Users can insert their own ideas'
  ) THEN
    CREATE POLICY "Users can insert their own ideas" ON public.ideas
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ideas'
      AND policyname = 'Users can update their own ideas'
  ) THEN
    CREATE POLICY "Users can update their own ideas" ON public.ideas
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ideas'
      AND policyname = 'Users can delete their own ideas'
  ) THEN
    CREATE POLICY "Users can delete their own ideas" ON public.ideas
      FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- ------------------------------------------------------------
-- 4. 最小権限の適用
--    anonロール: テーブルアクセス不要（全剥奪）
--    authenticatedロール: CRUD のみ（TRUNCATE等は不要）
-- ------------------------------------------------------------
REVOKE ALL ON public.ideas FROM anon;
REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.ideas FROM authenticated;
