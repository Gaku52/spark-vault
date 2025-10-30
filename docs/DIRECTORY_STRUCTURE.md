# ディレクトリ構成

```
spark-vault/
├── .git/                      # Git管理ディレクトリ
├── docs/                      # ドキュメント
│   ├── DIRECTORY_STRUCTURE.md # ディレクトリ構成説明
│   └── SPECIFICATION.md       # 仕様書
├── public/                    # 静的ファイル
│   └── assets/               # 画像・アイコンなど
├── src/                       # ソースコード
│   ├── components/           # Reactコンポーネント
│   │   ├── common/          # 共通コンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── idea/            # アイデアメモ関連
│   │   │   ├── IdeaForm.tsx
│   │   │   ├── IdeaList.tsx
│   │   │   └── IdeaCard.tsx
│   │   ├── dj/              # DJ成長記録
│   │   │   ├── DJSkillTracker.tsx
│   │   │   ├── MixLog.tsx
│   │   │   └── PerformanceNotes.tsx
│   │   ├── engineer/        # エンジニア自己管理
│   │   │   ├── LearningLog.tsx
│   │   │   ├── ProjectTracker.tsx
│   │   │   └── SkillMatrix.tsx
│   │   ├── health/          # 健康管理
│   │   │   ├── HealthLog.tsx
│   │   │   ├── ExerciseTracker.tsx
│   │   │   └── MealLog.tsx
│   │   └── thinking/        # 思考法記録
│   │       ├── ThinkingPattern.tsx
│   │       ├── DecisionLog.tsx
│   │       └── IQTracker.tsx
│   ├── hooks/               # カスタムReact Hooks
│   │   ├── useIdea.ts
│   │   ├── useDJ.ts
│   │   ├── useEngineer.ts
│   │   ├── useHealth.ts
│   │   └── useThinking.ts
│   ├── lib/                 # ユーティリティ・ヘルパー関数
│   │   ├── supabase.ts     # Supabase クライアント
│   │   ├── utils.ts        # 汎用ヘルパー
│   │   └── validators.ts   # バリデーション関数
│   ├── pages/               # ページコンポーネント
│   │   ├── Home.tsx        # ダッシュボード・ホーム画面
│   │   ├── DJGrowth.tsx    # DJ成長記録画面
│   │   ├── EngineerSelf.tsx # エンジニア自己管理画面
│   │   ├── Health.tsx      # 健康管理画面
│   │   └── Thinking.tsx    # 思考法記録画面
│   ├── services/            # APIサービス層
│   │   ├── ideaService.ts
│   │   ├── djService.ts
│   │   ├── engineerService.ts
│   │   ├── healthService.ts
│   │   └── thinkingService.ts
│   ├── types/               # TypeScript型定義
│   │   ├── idea.ts
│   │   ├── dj.ts
│   │   ├── engineer.ts
│   │   ├── health.ts
│   │   └── thinking.ts
│   ├── App.tsx              # メインAppコンポーネント
│   ├── App.css              # Appスタイル
│   ├── index.css            # グローバルスタイル
│   ├── main.tsx             # エントリーポイント
│   └── vite-env.d.ts        # Vite型定義
├── .env.local               # 環境変数（Git管理外）
├── .gitignore               # Git除外設定
├── index.html               # HTMLエントリーポイント
├── package.json             # npm設定・依存関係
├── README.md                # プロジェクト説明
├── tsconfig.json            # TypeScript設定
└── vite.config.ts           # Vite設定
```

## 主要ディレクトリの役割

### `/src/components`
UIコンポーネントを機能別に分類

- **common/**: ボタン、入力フォーム、モーダル、カードなど再利用可能なUIコンポーネント
- **idea/**: アイデアメモの追加・編集・一覧表示コンポーネント
- **dj/**: DJ活動の記録、スキルトラッキング、ミックス記録、パフォーマンスメモ
- **engineer/**: 学習記録、プロジェクト管理、スキルマトリックス
- **health/**: 健康状態、運動記録、食事記録
- **thinking/**: 思考パターン分析、意思決定記録、IQ変動トラッキング

### `/src/hooks`
各機能領域のカスタムフック
- データ取得・更新のロジックをカプセル化
- Supabaseとの通信処理を抽象化

### `/src/lib`
- **supabase.ts**: Supabaseクライアントの初期化と設定
- **utils.ts**: 日付フォーマット、文字列処理などの汎用関数
- **validators.ts**: 入力検証、データバリデーション

### `/src/pages`
ルーティング可能なページコンポーネント
- 各機能領域の独立した画面
- 複数のコンポーネントを組み合わせて構築

### `/src/services`
APIとの通信を担当するサービス層
- CRUD操作の実装
- エラーハンドリング
- データの正規化

### `/src/types`
TypeScript型定義
- データモデル
- APIレスポンス
- コンポーネントProps

### `/docs`
プロジェクトドキュメント
- 仕様書
- 設計書
- 開発ガイド
