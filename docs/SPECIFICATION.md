# Spark Vault - 仕様書

## プロジェクト概要

**Spark Vault（スパークヴォルト）** は、思いついたアイデアを即座に記録し、実装方法を明確化するシンプルなWebアプリケーションです。

### コンセプト
「ひらめき（Spark）を保管庫（Vault）に」

普通のメモアプリとの違いは、**アイデアに特化**し、**実装方法を明確にする**ことで、頭の中が整理され、余計なメモをしなくて済むことです。

### 目標
- アイデアを即座に記録（速度）
- シンプルで軽快な操作性（軽快さ）
- すぐに見返せる（アクセス性）
- 実装方法を明確化することで行動につながる

---

## 機能要件

### アイデアメモ機能
**目的**: 思いついたアイデアを瞬時に記録し、実装方法を分類する

#### 機能詳細

**1. クイック入力**
- 最小限の項目で即座にメモ
- タイトルと内容のみで保存可能

**2. 実装方法の分類（アクションタイプ）**
アイデアをどう実現するかを選択：
- **アプリ化する** - このアイデアを実際にアプリケーションとして開発
- **既存ツールで補完** - 既存のツールや方法で実現可能
- **保留** - まだ決めていない、後で考える

**3. 一覧表示**
- すべてのアイデアを時系列で表示
- 実装方法でフィルター可能
- 検索機能

**4. 編集・削除**
- アイデアの修正
- 不要なアイデアの削除
- 実装方法の変更

**5. タグ付け（オプション）**
- 複数タグで横断的に管理
- タグでフィルター

#### データ項目
```typescript
type ActionType = 'build_app' | 'use_existing' | 'pending'

interface Idea {
  id: string
  user_id: string
  title: string
  content: string
  action_type: ActionType
  tags: string[]
  created_at: string
  updated_at: string
}
```

---

## 技術スタック

### フロントエンド
- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **UI**: TailwindCSS + shadcn/ui
- **ルーティング**: React Router
- **フォーム**: React Hook Form + Zod
- **アイコン**: Lucide React
- **日付処理**: date-fns

### バックエンド
- **BaaS**: Supabase
  - データベース: PostgreSQL
  - 認証: Supabase Auth
  - Row Level Security（セキュリティ）

### デプロイ
- **ホスティング**: Vercel

---

## データベース設計

### テーブル構成

#### `ideas` テーブル
```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  action_type TEXT NOT NULL DEFAULT 'pending',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- インデックス（パフォーマンス最適化）
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_action_type ON ideas(action_type);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
```

---

## UI/UX設計

### レイアウト
- **レスポンシブデザイン**: デスクトップ最適化（Phase 1）
- **ナビゲーション**: シンプルなヘッダー
- **カラースキーム**: ライトモード（ダークモードはPhase 3）

### 主要画面

#### 1. ホーム画面（メイン画面）
```
┌─────────────────────────────────────┐
│  Spark Vault                [ログアウト] │
├─────────────────────────────────────┤
│                                     │
│  [新しいアイデアを追加] ボタン          │
│                                     │
│  フィルター: [すべて] [アプリ化] [既存ツール] [保留]  │
│  検索: [___________]                │
│                                     │
│  ┌───────────────────────────┐     │
│  │ アイデアカード                │     │
│  │ タイトル: 〇〇アプリ           │     │
│  │ 内容: △△△...              │     │
│  │ 実装: アプリ化する            │     │
│  │ 作成日: 2025-10-30          │     │
│  │ [編集] [削除]               │     │
│  └───────────────────────────┘     │
│                                     │
│  ┌───────────────────────────┐     │
│  │ アイデアカード                │     │
│  │ ...                        │     │
│  └───────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

#### 2. アイデア追加/編集モーダル
```
┌─────────────────────────────┐
│  新しいアイデア              │
│                             │
│  タイトル*:                  │
│  [___________________]      │
│                             │
│  内容:                       │
│  [___________________]      │
│  [___________________]      │
│  [___________________]      │
│                             │
│  実装方法*:                  │
│  ○ アプリ化する              │
│  ○ 既存ツールで補完          │
│  ○ 保留                     │
│                             │
│  タグ（任意）:               │
│  [___________________]      │
│                             │
│  [キャンセル]  [保存]        │
└─────────────────────────────┘
```

### カラーパレット
```css
/* Primary - 創造性を象徴する紫 */
--primary: 262 83% 58%;  /* #8b5cf6 */

/* Secondary - 落ち着きのある青 */
--secondary: 217 91% 60%; /* #3b82f6 */

/* Success - 行動を促す緑 */
--success: 142 76% 36%;

/* Background */
--background: 0 0% 100%;
--foreground: 222 84% 5%;

/* Border */
--border: 214 32% 91%;
```

---

## セキュリティ

- **認証**: Supabase Auth（メール/パスワード）
- **認可**: Row Level Security（RLS）で個人データを保護
- **データ暗号化**: 通信はHTTPS、保存データはSupabaseが管理

---

## 開発フェーズ

### Phase 1: PC Web版 MVP（週末完成目標） 🎯
- ✅ プロジェクト初期設定
- ✅ 詳細仕様書作成
- ✅ セットアップ・実装ガイド作成
- [ ] Supabase設定（土曜AM）
- [ ] 認証フロー実装（土曜AM）
- [ ] アイデアメモ機能実装（土曜PM - 日曜AM）
  - CRUD操作（作成・読取・更新・削除）
  - 実装方法の分類
  - フィルター・検索
- [ ] UI/UX仕上げ（日曜PM）
- [ ] Vercelデプロイ（日曜PM）

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

---

## まとめ

Spark Vaultは、**シンプルさ**と**明確さ**に特化したアイデア管理ツールです。

**他のメモアプリとの違い**:
- アイデアに特化 → 余計なメモをしない
- 実装方法を明確化 → 行動につながる
- 即座に記録・すぐ見返せる → ストレスフリー

**キーポイント**:
- 速度（即座にメモ）
- 軽快さ（シンプルなUI）
- アクセス性（すぐ見返せる）
- 明確化（実装方法の分類）

---

**Spark Vaultで、アイデアを忘れず、実現へつなげる。**
