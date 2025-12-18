# Supabase セットアップ手順

このドキュメントでは、Spark VaultアプリのSupabase設定について説明します。

## アカウント削除機能の設定

App Storeのガイドラインに準拠するため、ユーザーが自分のアカウントを削除できる機能が必要です。

### 必須: データベース関数の作成

1. **Supabase Dashboardを開く**
   - https://supabase.com/dashboard にアクセス
   - Spark Vaultプロジェクトを選択

2. **SQL Editorを開く**
   - 左側のメニューから「SQL Editor」をクリック
   - 「New query」をクリック

3. **関数を作成**
   - `delete_user_function.sql` の内容をコピー＆ペースト
   - 「Run」ボタンをクリックして実行

4. **確認**
   - 「Success. No rows returned」と表示されれば成功
   - これで、ユーザーが自分のアカウントを削除できるようになります

### 動作の仕組み

1. ユーザーがアプリ内で「アカウントを削除」をタップ
2. クライアント側から `supabase.rpc('delete_user')` を呼び出し
3. データベース関数が実行され：
   - ユーザーのすべてのメモを削除
   - Supabase Authのユーザーアカウントを削除
4. ログアウトしてアプリを再起動

### セキュリティ

- 関数は `SECURITY DEFINER` で定義されているため、安全に実行されます
- 認証済みユーザーのみが実行可能
- 各ユーザーは自分自身のアカウントのみ削除可能（`auth.uid()` を使用）

## トラブルシューティング

### エラー: "function delete_user() does not exist"

関数がまだ作成されていません。上記の手順で `delete_user_function.sql` を実行してください。

### エラー: "permission denied"

関数の権限設定に問題があります。以下のSQLを実行してください：

```sql
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
```

## 参考資料

- [Supabase RPC Documentation](https://supabase.com/docs/reference/javascript/rpc)
- [Supabase Auth: Delete User](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser)
