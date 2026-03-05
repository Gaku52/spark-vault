-- ユーザーが自分自身のアカウントを削除するための関数 (修正版)
-- Supabase Dashboard > SQL Editor で実行してください

-- まず古い関数を削除
DROP FUNCTION IF EXISTS delete_user();

-- 新しい関数を作成（auth schema を使用）
CREATE OR REPLACE FUNCTION delete_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
  user_uuid uuid;
BEGIN
  -- 現在のユーザーIDを取得
  user_uuid := auth.uid();

  -- ユーザーが認証されているか確認
  IF user_uuid IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not authenticated'
    );
  END IF;

  -- ユーザーのすべてのアイデアを削除
  DELETE FROM public.ideas WHERE user_id = user_uuid;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- 成功を返す（auth.usersの削除はSupabase Authが自動処理）
  RETURN json_build_object(
    'success', true,
    'ideas_deleted', deleted_count,
    'user_id', user_uuid
  );
END;
$$;

-- 権限を付与
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- 説明を追加
COMMENT ON FUNCTION delete_user() IS 'ユーザーが自分自身のアイデアデータを削除する関数';

-- 確認用クエリ（実行後にこれを実行して関数が作成されたか確認）
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'delete_user';
