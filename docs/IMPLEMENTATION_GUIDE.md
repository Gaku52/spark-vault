# Spark Vault - 実装ガイド

## 🎯 週末完成のための実装戦略

このガイドは、週末で5つの機能すべてを実装しきるための具体的な手順とベストプラクティスをまとめています。

---

## 📦 推奨技術スタック（開発速度重視）

### フロントエンド
```json
{
  "react": "^18.3.1",
  "typescript": "^5.6.2",
  "vite": "^6.0.1",
  "react-router-dom": "^6.28.0",
  "tailwindcss": "^3.4.15"
}
```

### UI コンポーネント（開発速度UP）
**推奨: shadcn/ui + Radix UI**
- コピペで使える高品質コンポーネント
- アクセシビリティ対応済み
- カスタマイズ容易

```bash
npx shadcn@latest init
npx shadcn@latest add button input textarea card dialog select badge
```

### フォーム管理
**React Hook Form + Zod**
```bash
npm install react-hook-form zod @hookform/resolvers
```

### データ可視化
**Recharts**
```bash
npm install recharts
```

### アイコン
**Lucide React**
```bash
npm install lucide-react
```

### 日付処理
**date-fns**
```bash
npm install date-fns
```

### Supabase
```bash
npm install @supabase/supabase-js
```

---

## 🏗️ 実装優先順位（土日2日間）

### 土曜日AM: 基盤構築
1. ✅ Vite + React + TypeScript プロジェクト初期化
2. ✅ TailwindCSS + shadcn/ui セットアップ
3. ✅ React Router セットアップ
4. ✅ Supabase プロジェクト作成・接続
5. ✅ 認証フロー実装（ログイン/サインアップ）

### 土曜日PM: コア機能実装（Part 1）
6. ✅ 共通レイアウト・ナビゲーション
7. ✅ アイデアメモ機能（CRUD完全実装）
8. ✅ DJ成長記録機能（基本CRUD）

### 日曜日AM: コア機能実装（Part 2）
9. ✅ エンジニア自己管理機能（基本CRUD）
10. ✅ 健康管理機能（基本CRUD）
11. ✅ 思考法記録機能（基本CRUD）

### 日曜日PM: 仕上げ
12. ✅ データ可視化（各機能の基本グラフ）
13. ✅ 検索・フィルター機能
14. ✅ レスポンシブ調整（デスクトップ最適化）
15. ✅ Vercel デプロイ

---

## 📐 画面構成（デスクトップ最適化）

### レイアウト構造
```
┌─────────────────────────────────────────┐
│  Header (Logo + User Menu)              │
├──────┬──────────────────────────────────┤
│      │                                  │
│ Side │                                  │
│ bar  │      Main Content Area           │
│      │                                  │
│ Nav  │                                  │
│      │                                  │
├──────┴──────────────────────────────────┤
│  Footer (Optional)                      │
└─────────────────────────────────────────┘
```

### サイドバーナビゲーション
- 🏠 ダッシュボード
- 💡 アイデア
- 🎧 DJ成長記録
- 💻 エンジニア管理
- 🏃 健康管理
- 🧠 思考法記録

---

## 🎨 デザインシステム

### カラーパレット
```css
/* Primary - 創造性を象徴する紫 */
--primary: 262 83% 58%;  /* #8b5cf6 */
--primary-foreground: 0 0% 100%;

/* Secondary - 落ち着きのある青 */
--secondary: 217 91% 60%; /* #3b82f6 */

/* Success - 成長を示す緑 */
--success: 142 76% 36%;

/* Warning - 注意を促す黄 */
--warning: 38 92% 50%;

/* Destructive - 削除などの赤 */
--destructive: 0 84% 60%;

/* Background */
--background: 0 0% 100%;
--foreground: 222 84% 5%;

/* Muted */
--muted: 210 40% 96%;
--muted-foreground: 215 16% 47%;

/* Border */
--border: 214 32% 91%;
```

### タイポグラフィ
```css
/* Headings */
h1: text-4xl font-bold (36px)
h2: text-3xl font-semibold (30px)
h3: text-2xl font-semibold (24px)
h4: text-xl font-medium (20px)

/* Body */
body: text-base (16px)
small: text-sm (14px)
```

### スペーシング
```css
Container padding: p-6 (24px)
Card padding: p-4 (16px)
Button padding: px-4 py-2
Gap between items: gap-4 (16px)
```

---

## 🗄️ データベーススキーマ（Supabase）

### Row Level Security（RLS）ポリシー

すべてのテーブルに以下のポリシーを適用：

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみ閲覧可能
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- ユーザーは自分のデータのみ挿入可能
CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のデータのみ更新可能
CREATE POLICY "Users can update own data" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザーは自分のデータのみ削除可能
CREATE POLICY "Users can delete own data" ON table_name
  FOR DELETE USING (auth.uid() = user_id);
```

### インデックス設定（パフォーマンス最適化）

```sql
-- ideas テーブル
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);

-- dj_records テーブル
CREATE INDEX idx_dj_records_user_id ON dj_records(user_id);
CREATE INDEX idx_dj_records_type ON dj_records(type);
CREATE INDEX idx_dj_records_date ON dj_records(date DESC);

-- engineer_records テーブル
CREATE INDEX idx_engineer_records_user_id ON engineer_records(user_id);
CREATE INDEX idx_engineer_records_type ON engineer_records(type);
CREATE INDEX idx_engineer_records_status ON engineer_records(status);

-- health_records テーブル
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_date ON health_records(date DESC);

-- thinking_records テーブル
CREATE INDEX idx_thinking_records_user_id ON thinking_records(user_id);
CREATE INDEX idx_thinking_records_type ON thinking_records(type);
CREATE INDEX idx_thinking_records_date ON thinking_records(date DESC);
```

---

## 🔧 コンポーネント設計

### 共通コンポーネント構造

```typescript
// src/components/common/
- Button.tsx           // shadcn/ui
- Input.tsx            // shadcn/ui
- Textarea.tsx         // shadcn/ui
- Card.tsx             // shadcn/ui
- Dialog.tsx           // shadcn/ui
- Select.tsx           // shadcn/ui
- Badge.tsx            // shadcn/ui
- LoadingSpinner.tsx   // カスタム
- EmptyState.tsx       // カスタム
- ErrorMessage.tsx     // カスタム
```

### 機能別コンポーネント（パターン統一）

各機能で以下の構造を再利用：

```typescript
// 例: src/components/idea/
- IdeaList.tsx         // 一覧表示
- IdeaCard.tsx         // カード表示
- IdeaForm.tsx         // 作成・編集フォーム
- IdeaDetail.tsx       // 詳細表示
- IdeaFilters.tsx      // フィルター・検索
```

---

## 🎣 カスタムフック設計

### データ取得フック（共通パターン）

```typescript
// src/hooks/useIdea.ts
export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    // Supabase fetch logic
  }

  const createIdea = async (data: IdeaInput) => {
    // Supabase insert logic
  }

  const updateIdea = async (id: string, data: Partial<IdeaInput>) => {
    // Supabase update logic
  }

  const deleteIdea = async (id: string) => {
    // Supabase delete logic
  }

  return { ideas, loading, error, createIdea, updateIdea, deleteIdea, refetch: fetchIdeas }
}
```

このパターンを5つの機能すべてに適用。

---

## 📊 データ可視化（最小実装）

### ダッシュボード
- 各カテゴリの記録数（棒グラフ）
- 今週の活動サマリー（数値カード）
- 最近の記録タイムライン

### DJ成長記録
- スキルレーダーチャート（Recharts Radar）
- 練習時間の推移（Recharts LineChart）

### エンジニア自己管理
- プロジェクトステータス（円グラフ）
- 学習時間の推移（棒グラフ）

### 健康管理
- 睡眠時間の推移（折れ線グラフ）
- エネルギーレベルの推移（エリアチャート）

### 思考法記録
- IQ変動グラフ（折れ線グラフ）
- 影響要因の相関（散布図 - オプション）

---

## 🚀 開発効率化テクニック

### 1. コンポーネントテンプレート作成
最初に1つの機能（アイデアメモ）を完璧に実装し、それをテンプレートとして他の4機能にコピー＆カスタマイズ。

### 2. 型定義の統一
```typescript
// src/types/common.ts
export interface BaseRecord {
  id: string
  user_id: string
  created_at: string
  updated_at?: string
}

// 各機能の型はこれを継承
export interface Idea extends BaseRecord {
  title: string
  content: string
  category: string
  tags: string[]
  priority: 'high' | 'medium' | 'low'
}
```

### 3. Supabaseクライアント抽象化
```typescript
// src/lib/supabase.ts
export const supabase = createClient(url, key)

// 共通CRUD関数
export const db = {
  async getAll<T>(table: string): Promise<T[]> { /* ... */ },
  async getById<T>(table: string, id: string): Promise<T> { /* ... */ },
  async create<T>(table: string, data: Partial<T>): Promise<T> { /* ... */ },
  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> { /* ... */ },
  async delete(table: string, id: string): Promise<void> { /* ... */ }
}
```

### 4. フォームバリデーション（Zod）
```typescript
// src/lib/validators.ts
import { z } from 'zod'

export const ideaSchema = z.object({
  title: z.string().min(1, '必須項目です').max(100, '100文字以内で入力してください'),
  content: z.string().optional(),
  category: z.enum(['dj', 'engineer', 'health', 'thinking', 'other']),
  tags: z.array(z.string()).default([]),
  priority: z.enum(['high', 'medium', 'low']).default('medium')
})

export type IdeaInput = z.infer<typeof ideaSchema>
```

---

## ⚡ パフォーマンス最適化

### 1. 遅延読み込み
```typescript
import { lazy, Suspense } from 'react'

const DJGrowthPage = lazy(() => import('./pages/DJGrowth'))
const EngineerPage = lazy(() => import('./pages/EngineerSelf'))
```

### 2. メモ化
```typescript
import { useMemo, useCallback } from 'react'

const filteredIdeas = useMemo(() => {
  return ideas.filter(idea => idea.category === selectedCategory)
}, [ideas, selectedCategory])
```

### 3. 楽観的更新
```typescript
const deleteIdea = async (id: string) => {
  // UI即座更新
  setIdeas(prev => prev.filter(idea => idea.id !== id))

  try {
    await supabase.from('ideas').delete().eq('id', id)
  } catch (error) {
    // エラー時はロールバック
    refetch()
  }
}
```

---

## 🔒 セキュリティチェックリスト

- ✅ Supabase RLS 有効化
- ✅ 環境変数 (.env.local) を .gitignore に追加
- ✅ フロントエンドでのバリデーション
- ✅ XSS対策（Reactのデフォルトで対応済み）
- ✅ HTTPS通信（Vercelのデフォルト）

---

## 🌐 Vercel デプロイ手順

### 1. 環境変数設定
Vercelダッシュボードで以下を設定：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. ビルド設定
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### 3. デプロイコマンド
```bash
# Vercel CLIインストール
npm i -g vercel

# デプロイ
vercel --prod
```

---

## 🐛 トラブルシューティング

### Supabase接続エラー
```typescript
// エラーハンドリング例
const { data, error } = await supabase.from('ideas').select('*')

if (error) {
  console.error('Supabase error:', error.message)
  // ユーザーにフレンドリーなエラーメッセージ表示
}
```

### 型エラー
```typescript
// Supabaseの型定義生成
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

---

## 📝 実装チェックリスト

### 土曜日
- [ ] プロジェクトセットアップ
- [ ] shadcn/ui インストール
- [ ] Supabase プロジェクト作成
- [ ] データベーステーブル作成
- [ ] RLS ポリシー設定
- [ ] 認証フロー実装
- [ ] 共通レイアウト実装
- [ ] アイデアメモ機能完成
- [ ] DJ成長記録機能完成

### 日曜日
- [ ] エンジニア自己管理機能完成
- [ ] 健康管理機能完成
- [ ] 思考法記録機能完成
- [ ] ダッシュボード実装
- [ ] グラフ実装
- [ ] 検索・フィルター実装
- [ ] デスクトップ最適化
- [ ] Vercel デプロイ
- [ ] 動作確認

---

## 🎉 完成後のNext Steps

1. **使ってみる**: 実際に1週間使ってフィードバック収集
2. **改善**: 使いにくい部分を洗い出し
3. **拡張**: AI分析、データエクスポートなど高度な機能追加

---

このガイドに従えば、週末で確実に完成できます！頑張ってください！
