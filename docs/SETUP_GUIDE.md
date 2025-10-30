# Spark Vault - セットアップガイド

週末開発を始める前の準備手順をまとめています。

---

## 🚀 クイックスタート（土曜日朝に実行）

### 前提条件
- Node.js 18以上インストール済み
- npm または pnpm インストール済み
- GitHubアカウント
- Supabaseアカウント（無料プラン）
- Vercelアカウント（無料プラン）

---

## Step 1: プロジェクト初期化

### 1-1. リポジトリクローン
```bash
cd /Users/gaku
cd spark-vault
```

### 1-2. Vite + React + TypeScript セットアップ
```bash
# すでに存在する場合はスキップ
npm create vite@latest . -- --template react-ts

# 依存関係インストール
npm install
```

### 1-3. 開発サーバー起動確認
```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作確認。

---

## Step 2: TailwindCSS + shadcn/ui セットアップ

### 2-1. TailwindCSSインストール
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2-2. tailwind.config.js 設定
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 2-3. src/index.css 更新
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 262 83% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217 91% 60%;
    --secondary-foreground: 0 0% 100%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262 83% 58%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 2-4. shadcn/ui 初期化
```bash
npx shadcn@latest init

# プロンプトに従って選択:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
```

### 2-5. 必要なコンポーネントインストール
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add label
npx shadcn@latest add separator
npx shadcn@latest add tabs
npx shadcn@latest add dropdown-menu
npx shadcn@latest add calendar
npx shadcn@latest add popover
```

---

## Step 3: 必要なパッケージインストール

```bash
# ルーティング
npm install react-router-dom

# フォーム管理
npm install react-hook-form zod @hookform/resolvers

# データ可視化
npm install recharts

# アイコン
npm install lucide-react

# 日付処理
npm install date-fns

# Supabase
npm install @supabase/supabase-js

# ユーティリティ
npm install clsx tailwind-merge
```

---

## Step 4: Supabase プロジェクト作成

### 4-1. Supabase ダッシュボード
1. https://supabase.com にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名: `spark-vault`
4. データベースパスワードを設定（安全な場所に保存）
5. リージョン選択: `Northeast Asia (Tokyo)`

### 4-2. データベーステーブル作成

Supabase SQL Editorで以下を実行：

```sql
-- ideas テーブル
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- dj_records テーブル
CREATE TABLE dj_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill_ratings JSONB,
  equipment TEXT[],
  track_list TEXT[],
  venue TEXT,
  reflections TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- engineer_records テーブル
CREATE TABLE engineer_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  hours INTEGER,
  proficiency INTEGER,
  status TEXT,
  resources TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- health_records テーブル
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  sleep_hours DECIMAL,
  sleep_quality INTEGER,
  energy_level INTEGER,
  mental_state TEXT,
  exercise_type TEXT,
  exercise_duration INTEGER,
  exercise_intensity INTEGER,
  meal_content TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- thinking_records テーブル
CREATE TABLE thinking_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  iq_level INTEGER,
  factors JSONB,
  outcome TEXT,
  learnings TEXT,
  action_items TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4-3. Row Level Security (RLS) 設定

各テーブルに対して以下を実行：

```sql
-- ideas テーブル
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- 同様のポリシーを他の4テーブルにも適用
-- (dj_records, engineer_records, health_records, thinking_records)
```

### 4-4. インデックス作成

```sql
-- パフォーマンス最適化のためのインデックス
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);

CREATE INDEX idx_dj_records_user_id ON dj_records(user_id);
CREATE INDEX idx_dj_records_date ON dj_records(date DESC);

CREATE INDEX idx_engineer_records_user_id ON engineer_records(user_id);
CREATE INDEX idx_engineer_records_status ON engineer_records(status);

CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_date ON health_records(date DESC);

CREATE INDEX idx_thinking_records_user_id ON thinking_records(user_id);
CREATE INDEX idx_thinking_records_date ON thinking_records(date DESC);
```

### 4-5. API キー取得

1. Supabase ダッシュボード > Settings > API
2. `Project URL` をコピー
3. `anon public` キーをコピー

---

## Step 5: 環境変数設定

### 5-1. .env.local ファイル作成

```bash
touch .env.local
```

### 5-2. 環境変数を追加

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5-3. .gitignore 確認

`.env.local` が含まれていることを確認：

```
.env.local
```

---

## Step 6: Supabaseクライアント設定

### 6-1. src/lib/supabase.ts 作成

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Step 7: プロジェクト構造作成

ディレクトリとファイルを作成：

```bash
# src配下のディレクトリ作成（すでに作成済みの場合はスキップ）
mkdir -p src/components/{common,idea,dj,engineer,health,thinking}
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/types

# .gitkeep ファイル追加（空ディレクトリをGit管理下に）
touch src/components/common/.gitkeep
touch src/components/idea/.gitkeep
touch src/components/dj/.gitkeep
touch src/components/engineer/.gitkeep
touch src/components/health/.gitkeep
touch src/components/thinking/.gitkeep
touch src/hooks/.gitkeep
touch src/services/.gitkeep
touch src/types/.gitkeep
```

---

## Step 8: 動作確認

### 8-1. 開発サーバー起動

```bash
npm run dev
```

### 8-2. ブラウザで確認

`http://localhost:5173` にアクセスして、正常に表示されることを確認。

### 8-3. Supabase接続テスト

簡単なコンポーネントで接続テスト：

```typescript
// src/App.tsx
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Supabase接続テスト
    supabase.from('ideas').select('count').then(({ error }) => {
      if (error) {
        console.error('Supabase connection error:', error)
      } else {
        setConnected(true)
        console.log('Supabase connected!')
      }
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary">Spark Vault</h1>
      <p className="mt-4">
        Supabase Status: {connected ? '✅ Connected' : '❌ Not Connected'}
      </p>
    </div>
  )
}

export default App
```

---

## Step 9: Git コミット

初期セットアップをコミット：

```bash
git add .
git commit -m "Initial project setup with Vite, React, TypeScript, TailwindCSS, shadcn/ui, and Supabase

- Added TailwindCSS configuration
- Installed shadcn/ui components
- Set up Supabase client
- Created project directory structure
- Configured environment variables

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

## 🎉 セットアップ完了！

これで週末開発を始める準備が整いました。

### 次のステップ
1. [実装ガイド](./IMPLEMENTATION_GUIDE.md) を参照
2. 認証フローの実装から開始
3. アイデアメモ機能を最初に完成させる

---

## トラブルシューティング

### npm install でエラーが出る
```bash
# キャッシュクリア
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Supabase接続エラー
- `.env.local` のURLとキーを再確認
- ブラウザのコンソールでエラーメッセージを確認
- Supabaseダッシュボードでプロジェクトが起動しているか確認

### TailwindCSS が効かない
- `tailwind.config.js` の `content` パスを確認
- 開発サーバーを再起動

### shadcn/ui コンポーネントが見つからない
```bash
# 再インストール
npx shadcn@latest add [component-name]
```

---

頑張ってください！週末で完成させましょう！
