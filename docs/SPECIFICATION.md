# Spark Vault - 仕様書

## プロジェクト概要

**Spark Vault（スパークヴォルト）** は、思いついたアイデアを即座に記録し、自己成長を多角的に管理するためのWebアプリケーションです。

### コンセプト
「ひらめき（Spark）を保管庫（Vault）に」

DJとしてのスキル向上、エンジニアとしての自己管理、健康維持、思考パターンの最適化など、人生の様々な側面での成長を一元管理します。

### 目標
- IQの波を一定に保つことで生産性を向上
- 自己認識を深めることで年収向上に貢献
- 継続的な自己改善のサイクルを確立

---

## 機能要件

### 1. アイデアメモ機能
**目的**: 思いついたアイデアを瞬時に記録

#### 機能詳細
- **クイック入力**: ホーム画面から1クリックでメモ追加
- **カテゴリ分類**: DJ、エンジニア、健康、思考、その他
- **タグ付け**: 複数タグで横断的に管理
- **優先度設定**: 重要度を3段階で管理
- **検索機能**: キーワード、タグ、カテゴリで検索

#### データ項目
```typescript
{
  id: string
  title: string
  content: string
  category: 'dj' | 'engineer' | 'health' | 'thinking' | 'other'
  tags: string[]
  priority: 'high' | 'medium' | 'low'
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

### 2. DJ成長記録
**目的**: DJ活動の進捗を可視化し、スキル向上を促進

#### 機能詳細
- **スキルトラッキング**:
  - ミキシング技術
  - 機材操作
  - 選曲センス
  - プレイバック能力
  - オーディエンスリーディング

- **ミックス記録**:
  - 練習セッションの記録
  - 使用した機材
  - トラックリスト
  - 反省点・改善点

- **パフォーマンスメモ**:
  - イベント情報
  - 会場の雰囲気
  - オーディエンスの反応
  - 学んだこと

#### データ項目
```typescript
{
  id: string
  type: 'skill' | 'mix' | 'performance'
  date: date
  title: string
  description: string
  skillRatings: {
    mixing: number
    equipment: number
    selection: number
    playback: number
    audienceReading: number
  }
  equipment: string[]
  trackList?: string[]
  venue?: string
  reflections: string
  createdAt: timestamp
}
```

---

### 3. エンジニア自己管理
**目的**: 技術学習とプロジェクト進捗を管理

#### 機能詳細
- **学習記録**:
  - 学んだ技術・フレームワーク
  - 学習時間
  - 理解度の自己評価
  - 参考資料リンク

- **プロジェクトトラッカー**:
  - 個人/仕事プロジェクト
  - 進捗状況
  - 使用技術
  - 課題・ブロッカー

- **スキルマトリックス**:
  - 技術スタックの可視化
  - 習熟度レベル
  - 次に学ぶべき技術

#### データ項目
```typescript
{
  id: string
  type: 'learning' | 'project' | 'skill'
  date: date
  title: string
  description: string
  technologies: string[]
  hours?: number
  proficiency?: number
  status?: 'planning' | 'in_progress' | 'completed' | 'blocked'
  resources?: string[]
  notes: string
  createdAt: timestamp
}
```

---

### 4. 健康管理
**目的**: 身体的・精神的健康を維持し、パフォーマンスを最適化

#### 機能詳細
- **健康ログ**:
  - 睡眠時間・質
  - 体調評価（1-10）
  - エネルギーレベル
  - メンタル状態

- **運動記録**:
  - 運動種類
  - 時間・強度
  - 感想・効果

- **食事記録**:
  - 食事内容
  - 栄養バランス
  - 満足度

#### データ項目
```typescript
{
  id: string
  type: 'health' | 'exercise' | 'meal'
  date: date
  sleepHours?: number
  sleepQuality?: number
  energyLevel?: number
  mentalState?: string
  exerciseType?: string
  exerciseDuration?: number
  exerciseIntensity?: number
  mealContent?: string
  notes: string
  createdAt: timestamp
}
```

---

### 5. 思考法記録
**目的**: 思考パターンを分析し、IQの波を平準化

#### 機能詳細
- **思考パターン分析**:
  - 良い決断をした時の思考プロセス
  - 失敗した時の思考パターン
  - 生産性の高い時間帯
  - 集中力の波

- **意思決定記録**:
  - 重要な決断の内容
  - 決断理由
  - 結果の振り返り

- **IQトラッカー**:
  - 自己評価によるIQ状態（1-10）
  - 影響要因（睡眠、食事、運動、ストレス）
  - 改善アクション

#### データ項目
```typescript
{
  id: string
  type: 'pattern' | 'decision' | 'iq_tracking'
  date: date
  title: string
  description: string
  iqLevel?: number
  factors?: {
    sleep: number
    nutrition: number
    exercise: number
    stress: number
  }
  outcome?: string
  learnings: string
  actionItems: string[]
  createdAt: timestamp
}
```

---

## 技術スタック

### フロントエンド
- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: TailwindCSS（予定）
- **状態管理**: React Hooks + Context API
- **ルーティング**: React Router（予定）

### バックエンド
- **BaaS**: Supabase
  - データベース: PostgreSQL
  - 認証: Supabase Auth
  - ストレージ: Supabase Storage（画像保存用）
  - リアルタイム: Supabase Realtime（将来的な拡張用）

### デプロイ
- **ホスティング**: Vercel
- **CI/CD**: GitHub Actions（予定）

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
  category TEXT NOT NULL,
  tags TEXT[],
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `dj_records` テーブル
```sql
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
```

#### `engineer_records` テーブル
```sql
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
```

#### `health_records` テーブル
```sql
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
```

#### `thinking_records` テーブル
```sql
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

---

## UI/UX設計

### レイアウト
- **レスポンシブデザイン**: モバイルファースト
- **ナビゲーション**: サイドバー（デスクトップ）、ボトムナビ（モバイル）
- **カラースキーム**: ダークモード対応

### 主要画面

#### 1. ホーム画面（ダッシュボード）
- クイックアイデア入力フォーム
- 最近の記録一覧
- 各機能へのショートカット
- 今日の統計サマリー

#### 2. アイデア一覧画面
- カード形式の一覧表示
- フィルター・ソート機能
- 検索バー
- 新規作成ボタン

#### 3. DJ成長記録画面
- タブ切り替え（スキル/ミックス/パフォーマンス）
- スキルレーダーチャート
- タイムライン表示

#### 4. エンジニア自己管理画面
- タブ切り替え（学習/プロジェクト/スキル）
- プロジェクトカンバン
- スキルマトリックス可視化

#### 5. 健康管理画面
- カレンダービュー
- 健康指標グラフ
- 記録入力フォーム

#### 6. 思考法記録画面
- IQ変動グラフ
- パターン分析
- 意思決定ログ

---

## セキュリティ

- **認証**: Supabase Auth（メール/パスワード）
- **認可**: Row Level Security（RLS）で個人データを保護
- **データ暗号化**: 通信はHTTPS、保存データはSupabaseが管理

---

## 今後の拡張予定

1. **データエクスポート**: CSV, PDF形式でのデータ出力
2. **レポート機能**: 週次・月次の成長レポート自動生成
3. **目標設定**: SMART目標の設定と進捗管理
4. **リマインダー**: 記録忘れ防止の通知機能
5. **AI分析**: パターン認識と改善提案（GPT連携）
6. **ソーシャル機能**: 同じ目標を持つ仲間とのつながり（オプション）

---

## 開発フェーズ

### Phase 1: MVP（現在）
- 基本的なアイデアメモ機能
- 5つの記録機能の基礎実装
- Supabase連携
- Vercelデプロイ

### Phase 2: 機能強化
- データ可視化（グラフ・チャート）
- 検索・フィルター機能の充実
- ダークモード実装

### Phase 3: 高度な機能
- レポート自動生成
- AIによる分析・提案
- モバイルアプリ化（PWA）

---

## まとめ

Spark Vaultは、単なるメモアプリではなく、自己成長の全体像を把握し、IQの波を平準化することで年収向上を目指す総合的な自己管理ツールです。

**キーポイント**:
- 即座にアイデアを記録
- 多角的な自己成長を可視化
- データに基づく自己改善
- 長期的なパフォーマンス向上
