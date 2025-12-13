# App Store リリース実作業チェックリスト

このチェックリストを使って、実際のリリース作業を進めてください。

---

## ✅ フェーズ1: 技術的検証（完了済み）

- [x] Xcodeビルド成功
- [x] 実機インストール成功
- [ ] 機能テスト完了（明日）

---

## ⏳ フェーズ2: App Store準備

### Step 1: プライバシーポリシー公開 (10分)

**作業内容**:
```bash
cd /Users/gaku/spark-vault
git add public/privacy-policy.html
git commit -m "Add privacy policy for App Store"
git push origin main
```

**GitHub Pages 設定**:
1. GitHub リポジトリ → Settings → Pages
2. Source: `main` branch, `/` (root)
3. Save

**確認**:
- [ ] https://gaku52.github.io/spark-vault/privacy-policy.html にアクセス可能
- [ ] モバイルで表示確認

**公開URL**:
```
https://gaku52.github.io/spark-vault/privacy-policy.html
```

---

### Step 2: デモアカウント作成 (5分)

**作業内容**:
1. Spark Vault アプリでサインアップ
2. メール: `review@sparkvault.test`
3. パスワード: `Review2025!`
4. サンプルアイデアを5-10件作成

**チェック**:
- [ ] デモアカウント作成完了
- [ ] サンプルデータ作成完了
- [ ] ログイン動作確認
- [ ] アイデア作成・編集・削除の動作確認

**メモ**:
詳細は `release/demo-account.md` を参照

---

### Step 3: App Store Connect 登録 (30分)

**URL**: https://appstoreconnect.apple.com/

#### 3.1 アプリ作成
- [ ] 新規App作成
- [ ] アプリ名: `Spark Vault`
- [ ] Bundle ID: `com.ogadix.sparkvault`
- [ ] SKU: `spark-vault-001`

#### 3.2 App情報
- [ ] プライバシーポリシーURL: `https://gaku52.github.io/spark-vault/privacy-policy.html`
- [ ] カテゴリ: 仕事効率化
- [ ] サブタイトル: `アイデアと目標を一元管理`

#### 3.3 価格と配信
- [ ] 価格: 無料
- [ ] 配信国: すべて選択

#### 3.4 Appプライバシー
- [ ] メールアドレス（アカウント管理用）
- [ ] ユーザーコンテンツ（アイデアテキスト）
- [ ] 第三者と共有: いいえ

#### 3.5 バージョン情報
- [ ] 新機能: `release/app-store-assets/whats-new.txt` をコピペ
- [ ] 説明文: `release/app-store-assets/description.txt` をコピペ
- [ ] キーワード: `release/app-store-assets/keywords.txt` をコピペ
- [ ] サポートURL: `https://github.com/Gaku52/spark-vault`

#### 3.6 アプリレビュー情報
- [ ] 連絡先情報入力（名前、電話、メール）
- [ ] デモアカウント: `release/demo-account.md` を参照
- [ ] 審査担当者へのメモ: `release/demo-account.md` をコピペ

---

### Step 4: スクリーンショット準備 (30分)

#### 4.1 シミュレータ起動
```bash
cd /Users/gaku/spark-vault
npm run build:ios
npm run cap:open:ios
```

Xcodeで:
- デバイス: iPhone 15 Pro Max
- ⌘R で起動

#### 4.2 ステータスバー設定
```bash
xcrun simctl status_bar booted override --time "9:41" --batteryLevel 100 --batteryState charged
```

#### 4.3 スクリーンショット撮影

5枚撮影（⌘S）:
1. [ ] ログイン/ウェルカム画面
2. [ ] アイデア一覧画面
3. [ ] アイデア作成画面
4. [ ] アイデア詳細画面
5. [ ] 検索/フィルター画面

**保存先**: `release/screenshots/iphone-6.7/`

デスクトップに保存されたファイルを移動:
```bash
mv ~/Desktop/Simulator*.png release/screenshots/iphone-6.7/
```

#### 4.4 解像度確認
```bash
sips -g pixelWidth -g pixelHeight release/screenshots/iphone-6.7/*.png
```

**正しいサイズ**: 1290 x 2796

#### 4.5 App Store Connect アップロード
- [ ] iPhone 6.7" セクションに5枚アップロード
- [ ] 順序を調整（最も魅力的なものを最初に）

---

### Step 5: アーカイブ & アップロード (20分)

#### 5.1 環境変数確認
```bash
cat .env.local
```

確認項目:
- [ ] VITE_SUPABASE_URL が本番環境
- [ ] VITE_SUPABASE_ANON_KEY が本番環境
- [ ] プレースホルダーではない

#### 5.2 本番ビルド
```bash
cd /Users/gaku/spark-vault
npm install
NODE_ENV=production npm run build
npm run cap:sync
```

#### 5.3 Xcodeでアーカイブ
```bash
npm run cap:open:ios
```

Xcodeで:
1. [ ] デバイスターゲット: `Any iOS Device (arm64)`
2. [ ] Build Configuration: Release（Edit Scheme で確認）
3. [ ] `Product` → `Archive`
4. [ ] アーカイブ成功

#### 5.4 検証
Organizer で:
1. [ ] 作成したアーカイブを選択
2. [ ] `Validate App` をクリック
3. [ ] Automatically manage signing
4. [ ] 検証成功

#### 5.5 App Store Connect アップロード
1. [ ] `Distribute App` → `App Store Connect`
2. [ ] Upload
3. [ ] Strip Swift symbols: ON
4. [ ] Upload symbols: ON
5. [ ] Automatically manage signing
6. [ ] Upload 実行
7. [ ] アップロード成功（5-15分）

#### 5.6 App Store Connect で確認
1. [ ] ビルドが表示されるまで待機（10-60分）
2. [ ] ビルドを選択
3. [ ] 輸出コンプライアンス: No

---

### Step 6: 審査提出 (5分)

#### 6.1 最終確認
- [ ] すべての情報が入力済み
- [ ] スクリーンショットがアップロード済み
- [ ] デモアカウントが動作する
- [ ] ビルドが選択されている

#### 6.2 提出
- [ ] 「審査に提出」をクリック
- [ ] ステータス: 審査待ち

**提出日時**: _______________

---

## 審査ステータス追跡

| 日時 | ステータス | メモ |
|------|-----------|------|
|      | 審査待ち   |      |
|      |           |      |

**審査期間**: 通常 24-48時間

---

## トラブルシューティング

### プライバシーポリシーが表示されない
→ GitHub Pages の設定を確認（10分程度かかる場合あり）

### デモアカウントでログインできない
→ Supabaseでメール認証が必要な場合は設定を確認

### スクリーンショットのサイズが合わない
→ シミュレータで `⌘1` (Physical Size) を押す

### アーカイブが失敗
→ `Product` → `Clean Build Folder` (⇧⌘K) してから再実行

### ビルドが App Store Connect に表示されない
→ 10-60分待つ。メールで通知が来る

---

## 完了！

すべてのチェック項目が完了したら、審査結果を待ちます。

**次のステップ**:
1. 審査結果を確認（24-48時間後）
2. 承認されたら App Store で公開
3. ユーザーからのフィードバックを収集
