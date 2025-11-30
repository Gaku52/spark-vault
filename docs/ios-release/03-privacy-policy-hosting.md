# プライバシーポリシーのホスティング

## 概要

App Storeの審査には、公開されたプライバシーポリシーのURLが必要です。

**所要時間**: 10-15分

## 前提条件

- [ ] プライバシーポリシーが作成済み (`public/privacy-policy.html`)
- [ ] GitHub Pages または他のホスティングサービスのアカウント

## オプション1: GitHub Pages（推奨・無料）

### 手順

#### 1. GitHub Pagesの有効化

1. GitHubでリポジトリ `spark-vault` を開く
   - https://github.com/Gaku52/spark-vault

2. `Settings` → `Pages` を選択

3. Source セクションで:
   - **Branch**: `main`
   - **Folder**: `/root` または `/docs`
   - **Save** をクリック

4. 数分後、URLが表示される:
   - 例: `https://gaku52.github.io/spark-vault/`

#### 2. プライバシーポリシーの配置

**方法A: publicフォルダを使用**

1. `public/privacy-policy.html` がすでに存在することを確認

2. Viteの設定で public フォルダがビルドに含まれることを確認
   - `vite.config.ts` の `publicDir` 設定

3. ビルド実行:
   ```bash
   npm run build
   ```

4. `dist/privacy-policy.html` が生成されることを確認

5. GitHub Pagesにデプロイ:
   ```bash
   # distフォルダをgh-pagesブランチにデプロイ
   npm install -D gh-pages
   npx gh-pages -d dist
   ```

**方法B: docsフォルダを使用**

1. プライバシーポリシーをdocsフォルダにコピー:
   ```bash
   mkdir -p docs
   cp public/privacy-policy.html docs/
   ```

2. GitHub Pagesの設定で `/docs` を選択

3. Git にコミット:
   ```bash
   git add docs/privacy-policy.html
   git commit -m "Add privacy policy for GitHub Pages"
   git push
   ```

#### 3. URLの確認

1. GitHub Pages の URL にアクセス:
   - `https://gaku52.github.io/spark-vault/privacy-policy.html`

2. プライバシーポリシーが表示されることを確認

3. このURLをApp Store Connectで使用

**最終URL例**:
```
https://gaku52.github.io/spark-vault/privacy-policy.html
```

## オプション2: Vercel（代替案・無料）

### 手順

1. [Vercel](https://vercel.com/) にサインアップ

2. GitHubリポジトリを接続

3. プロジェクト設定:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. デプロイ

5. カスタムドメインまたはVercel提供のURL:
   - 例: `https://spark-vault.vercel.app/privacy-policy.html`

## オプション3: 既存のウェブサイト

既にウェブサイトを持っている場合:

1. FTP/SFTPでサーバーに接続

2. `public/privacy-policy.html` をアップロード

3. URL:
   - 例: `https://yourdomain.com/spark-vault/privacy-policy.html`

## プライバシーポリシーの内容確認

公開前に、以下の項目が含まれているか確認:

### 必須項目

- [ ] 収集する情報の種類
  - メールアドレス
  - アイデアのテキスト
  - 画像（添付する場合）

- [ ] 情報の使用目的
  - アプリ機能の提供
  - ユーザーサポート

- [ ] 情報の保存場所
  - Supabase（クラウドデータベース）

- [ ] ユーザーの権利
  - データのアクセス権
  - データの削除権

- [ ] 第三者との共有
  - 共有しないことを明記

- [ ] セキュリティ対策
  - 暗号化の使用

- [ ] 連絡先
  - メールアドレスまたは問い合わせフォーム

### 言語

- 日本語と英語の両方が含まれていることを確認
- App Storeは主要市場の言語を要求

## カスタムドメインの設定（オプション）

より専門的な印象を与えるため、カスタムドメインを使用:

### GitHub Pages + カスタムドメイン

1. ドメインを取得（例: `sparkvault.app`）

2. DNSレコードを設定:
   ```
   Type: CNAME
   Name: @
   Value: gaku52.github.io
   ```

3. GitHub Pages設定で Custom domain を入力

4. HTTPS を有効化

5. 最終URL:
   - `https://sparkvault.app/privacy-policy.html`

## チェックリスト

プライバシーポリシーの公開が完了したら:

- [ ] URLにアクセスして表示を確認
- [ ] HTTPSが有効（鍵マークが表示）
- [ ] モバイルでも適切に表示される
- [ ] 日本語と英語の両方が表示される
- [ ] 必須項目がすべて含まれている
- [ ] URLをメモ（App Store Connectで使用）

## App Store Connectでの使用

このURLを以下の場所で入力:

1. App Store Connect → My Apps → Spark Vault
2. App Information → Privacy Policy URL
3. 公開したURLを入力
4. Save

## トラブルシューティング

### 問題1: GitHub Pages URLにアクセスできない

**原因**: デプロイが完了していない、または設定ミス

**対処法**:
1. GitHub Settings → Pages でステータスを確認
2. 「Your site is published at...」と表示されるまで待つ（最大10分）
3. ブランチと folder が正しいか確認

### 問題2: 404 Not Found

**原因**: ファイルが正しい場所に配置されていない

**対処法**:
1. ファイル名が正確か確認（`privacy-policy.html`）
2. ファイルがdistまたはdocsフォルダにあるか確認
3. GitHubにプッシュされているか確認

### 問題3: HTTPSが有効にならない

**原因**: GitHub Pages の HTTPS 設定が無効

**対処法**:
1. GitHub Settings → Pages
2. "Enforce HTTPS" にチェック
3. 数分待ってから再度アクセス

## 次のステップ

プライバシーポリシーのURLが準備できたら、App Store Connectの設定に進みます。

→ [04-app-store-connect-setup.md](./04-app-store-connect-setup.md)

## 参考資料

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [App Store Review Guidelines - Privacy](https://developer.apple.com/app-store/review/guidelines/#privacy)
