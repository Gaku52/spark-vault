# Spark Vault

ひらめき（Spark）を保管庫（Vault）に - アイデアを即座に記録し、実装方法を明確化するシンプルなWebアプリケーション

## プロジェクト概要

**Spark Vault**は、思いついたアイデアを瞬時にメモし、「どう実現するか」を明確にすることで、頭の中を整理し、行動につなげるアプリケーションです。

### 他のメモアプリとの違い

- **アイデアに特化** → 余計なメモをしなくて済む
- **実装方法を明確化** → 「アプリ化する」「既存ツールで補完」「保留」の3択で整理
- **即座に記録・すぐ見返せる** → ストレスフリーなUI

### 主な目的

- アイデアを即座に記録（速度）
- シンプルで軽快な操作性（軽快さ）
- すぐに見返せる（アクセス性）
- 実装方法を明確化することで行動につながる

## 主要機能

### アイデアメモ + 実装方法の分類

思いついたアイデアを記録し、実装方法を選択：
- **アプリ化する** - このアイデアをアプリケーションとして開発
- **既存ツールで補完** - 既存のツールや方法で実現可能
- **保留** - まだ決めていない

その他の機能：
- タグ付け
- 検索・フィルター
- 編集・削除

## 技術スタック

- **フロントエンド**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui
- **ルーティング**: React Router
- **フォーム**: React Hook Form + Zod
- **バックエンド**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **デプロイ**: Vercel

## 🌐 デプロイURL

- **本番環境**: https://spark.ogadix.com
- **Vercelプレビュー**: spark-vault.vercel.app

## ドキュメント

- 📖 [仕様書](./docs/SPECIFICATION.md) - 機能要件とデータベース設計
- 📁 [ディレクトリ構成](./docs/DIRECTORY_STRUCTURE.md) - プロジェクト構造の説明
- 🚀 [セットアップガイド](./docs/SETUP_GUIDE.md) - 開発環境構築手順
- 💻 [実装ガイド](./docs/IMPLEMENTATION_GUIDE.md) - 週末完成のための実装戦略
- 🔌 [API設計](./docs/API_DESIGN.md) - Supabase API設計
- 📱 [iOS開発計画](./docs/IOS_DEVELOPMENT_PLAN.md) - Phase 2 iOS展開

## クイックスタート

詳細は [セットアップガイド](./docs/SETUP_GUIDE.md) を参照してください。

```bash
# 依存関係のインストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.local にSupabaseのURLとキーを設定

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

### 環境変数

`.env.local` に以下の環境変数を設定してください：

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:5173  # ローカル開発用
```

**Vercelでのデプロイ時**は、Vercelの環境変数に以下を設定：

1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
2. 以下の環境変数を追加：
   - `VITE_SUPABASE_URL`: SupabaseのプロジェクトURL
   - `VITE_SUPABASE_ANON_KEY`: Supabaseの匿名キー
   - `VITE_APP_URL`: 本番環境のURL (例: `https://spark.ogadix.com`)

> **重要**: `VITE_APP_URL`は、メール認証のリダイレクト先として使用されます。本番環境では必ず正しいドメインを設定してください。

## 開発ロードマップ

### Phase 1: PC Web版 MVP（週末完成目標） 🎯
- [x] プロジェクト初期設定
- [x] 詳細仕様書作成
- [x] セットアップ・実装ガイド作成
- [ ] Supabase設定（土曜AM）
- [ ] 認証フロー実装（土曜AM）
- [ ] アイデアメモ機能実装（土曜PM - 日曜AM）
  - CRUD操作（作成・読取・更新・削除）
  - 実装方法の分類
  - フィルター・検索
- [ ] UI/UX仕上げ（日曜PM）
- [ ] Vercelデプロイ（日曜PM）
- [ ] カスタムドメイン設定（spark.ogadix.com）

**対応環境**: PC Webブラウザ（Chrome, Firefox, Safari, Edge）

### Phase 2: iOS/モバイル展開 📱
- [ ] レスポンシブデザイン強化
- [ ] PWA対応（オフライン機能）
- [ ] iOS Safari最適化
- [ ] ホーム画面追加対応
- [ ] プッシュ通知（オプション）
- [ ] **iOSネイティブアプリ開発（Xcode + Swift/SwiftUI）**
- [ ] React Native版も選択肢として検討
- [ ] App Storeリリース準備

### Phase 3: 機能拡張 🚀
- [ ] ダークモード実装
- [ ] データエクスポート（CSV, JSON）
- [ ] アイデアの並び替え（ドラッグ&ドロップ）
- [ ] アイデア同士のリンク機能
- [ ] リマインダー機能

### Phase 4: AI統合 🤖
- [ ] 自動タグ付け（GPT連携）
- [ ] 類似アイデアの検出
- [ ] 実装方法の提案
- [ ] アイデアの優先度自動判定

## ライセンス

MIT

## 作者

Gaku52

---

**Spark Vaultで、アイデアを忘れず、実現へつなげる。**

Generated with Claude Code
