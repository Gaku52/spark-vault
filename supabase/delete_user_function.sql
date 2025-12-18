-- ユーザーが自分自身のアカウントを削除するための関数
-- Supabase Dashboard > SQL Editor で実行してください

CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 現在のユーザーのメモを削除
  DELETE FROM notes WHERE user_id = auth.uid();

  -- 現在のユーザーを削除
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- この関数を認証済みユーザーが実行できるように権限を付与
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- 説明を追加
COMMENT ON FUNCTION delete_user() IS 'ユーザーが自分自身のアカウントとすべてのデータを削除する関数';
