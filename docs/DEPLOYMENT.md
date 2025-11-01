# Spark Vault - デプロイガイド

Vercelへのデプロイとカスタムドメイン設定の手順

---

## 🚀 Vercelデプロイ手順

### 1. Vercel CLIインストール（オプション）

```bash
npm i -g vercel
```

### 2. GitHubとの連携（推奨）

#### 2-1. Vercelダッシュボードにアクセス
https://vercel.com/dashboard

#### 2-2. 新規プロジェクト作成
1. "Add New..." > "Project" をクリック
2. GitHubリポジトリを選択: `Gaku52/spark-vault`
3. Import をクリック

#### 2-3. プロジェクト設定

**Framework Preset**: Vite を選択

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables** (後で設定):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### 2-4. デプロイ
"Deploy" をクリック → 自動デプロイ開始

---

## 🌐 カスタムドメイン設定（spark.ogadix.com）

### 前提条件
- ogadix.com ドメインが既にVercelで管理されている

### 手順

#### 1. Vercelプロジェクトダッシュボード
spark-vault プロジェクトを開く

#### 2. Domains タブ
Settings > Domains に移動

#### 3. カスタムドメイン追加
```
spark.ogadix.com
```
を入力して "Add" をクリック

#### 4. DNS設定（自動）
ogadix.comが既にVercelで管理されている場合、DNSレコードは自動的に追加されます。

手動で確認する場合：
```
Type: CNAME
Name: spark
Value: cname.vercel-dns.com
```

#### 5. SSL証明書（自動）
Vercelが自動的にLet's EncryptのSSL証明書を発行します。
通常、数分以内に完了します。

---

## 🔒 環境変数の設定

### 1. Vercelダッシュボード
Settings > Environment Variables

### 2. 環境変数を追加

#### Production（本番環境）
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Preview（プレビュー環境・オプション）
同じ値、または別のSupabaseプロジェクトを使用

#### Development（開発環境）
ローカル開発は `.env.local` を使用

### 3. 再デプロイ
環境変数を追加したら、"Redeploy" をクリック

---

## 📊 デプロイ後の確認

### 1. URLにアクセス
```
https://spark.ogadix.com
```

### 2. チェック項目
- [ ] ページが正常に表示される
- [ ] HTTPSが有効（鍵マークを確認）
- [ ] Supabase接続が正常
- [ ] 認証機能が動作
- [ ] CRUD操作が正常

---

## 🔄 自動デプロイ設定

GitHubとの連携により、以下が自動化されます：

### main ブランチ
- `main` へのプッシュ → 自動的に本番環境（spark.ogadix.com）にデプロイ

### その他のブランチ
- プルリクエスト作成 → プレビュー環境が自動生成
- URL例: `spark-vault-git-feature-xyz.vercel.app`

---

## 🛠️ トラブルシューティング

### ビルドエラー

**症状**: デプロイが失敗する

**解決策**:
1. ローカルで `npm run build` が成功するか確認
2. `package.json` の依存関係を確認
3. Vercelのビルドログを確認

### 環境変数が反映されない

**症状**: Supabaseに接続できない

**解決策**:
1. 環境変数が正しく設定されているか確認
2. `VITE_` プレフィックスが付いているか確認
3. 再デプロイ

### カスタムドメインが反映されない

**症状**: spark.ogadix.com にアクセスできない

**解決策**:
1. DNSレコードが正しいか確認
2. DNS伝播を待つ（最大48時間、通常は数分）
3. `nslookup spark.ogadix.com` でDNS設定を確認

### SSL証明書エラー

**症状**: "Your connection is not private"

**解決策**:
1. VercelでSSL証明書の発行状況を確認
2. 数分待ってから再度アクセス
3. ブラウザのキャッシュをクリア

---

## 📈 パフォーマンス最適化

### Vercel Analytics（オプション）

```bash
npm install @vercel/analytics
```

```typescript
// src/main.tsx
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
)
```

### Speed Insights（オプション）

```bash
npm install @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/react'

// Appコンポーネントに追加
<SpeedInsights />
```

---

## 🎯 デプロイチェックリスト

週末デプロイ時に確認：

- [ ] Supabaseプロジェクト作成完了
- [ ] 環境変数をVercelに設定
- [ ] GitHubリポジトリをVercelにインポート
- [ ] 初回デプロイ成功
- [ ] spark.ogadix.com カスタムドメイン設定
- [ ] SSL証明書有効化確認
- [ ] 本番環境で動作確認
- [ ] 自動デプロイ動作確認（mainブランチにpush）

---

**デプロイ完了後、https://spark.ogadix.com で公開されます！**
