# GitHub Secrets 設定ガイド

GitHub ActionsでVercelに自動デプロイするために、以下のSecretsを設定してください。

## 設定手順

1. GitHubリポジトリページを開く
2. **Settings** → **Secrets and variables** → **Actions** に移動
3. **New repository secret** をクリック
4. 以下の各Secretを追加

---

## 必要なSecrets

### 1. VERCEL_TOKEN
Vercelの認証トークン

**取得方法**:
1. Vercel Dashboard → Account Settings → Tokens
2. "Create Token" をクリック
3. トークン名を入力（例: `github-actions`）
4. Scopeは "Full Account" を選択
5. 生成されたトークンをコピー

**GitHub Secretに追加**:
- Name: `VERCEL_TOKEN`
- Value: 生成したトークン

---

### 2. VERCEL_ORG_ID
Vercel組織ID

**取得方法**:
1. プロジェクトルートの `.vercel/project.json` を確認
2. `orgId` の値をコピー

または、以下のコマンドで確認:
```bash
cat .vercel/project.json | grep orgId
```

**GitHub Secretに追加**:
- Name: `VERCEL_ORG_ID`
- Value: orgIdの値

---

### 3. VERCEL_PROJECT_ID
Vercelプロジェクトリンク ID

**取得方法**:
1. プロジェクトルートの `.vercel/project.json` を確認
2. `projectId` の値をコピー

または、以下のコマンドで確認:
```bash
cat .vercel/project.json | grep projectId
```

**GitHub Secretに追加**:
- Name: `VERCEL_PROJECT_ID`
- Value: projectIdの値

---

### 4. VITE_SUPABASE_URL
SupabaseプロジェクトURL

**取得方法**:
1. Supabase Dashboard → Settings → API
2. "Project URL" をコピー

**GitHub Secretに追加**:
- Name: `VITE_SUPABASE_URL`
- Value: Project URL（例: `https://xxxxx.supabase.co`）

---

### 5. VITE_SUPABASE_ANON_KEY
Supabase匿名キー

**取得方法**:
1. Supabase Dashboard → Settings → API
2. "anon public" キーをコピー

**GitHub Secretに追加**:
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: anon public キー

---

## Vercel環境変数の設定

Vercel側でも環境変数を設定してください:

1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. 以下を追加:
   - `VITE_SUPABASE_URL`: Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase anon key
3. Environment: **Production**, **Preview**, **Development** すべてにチェック

---

## 確認

すべてのSecretsを設定後、mainブランチにpushすると自動的にデプロイが実行されます。

GitHub Actions の実行状況は以下で確認できます:
- リポジトリページ → **Actions** タブ
