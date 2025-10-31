# Spark Vault - iOS開発計画

Phase 2でのiOSネイティブアプリ開発に向けた計画書

---

## 🎯 iOS展開の戦略

### Phase 1完了後（PC Web版）→ Phase 2（iOS展開）

**選択肢:**
1. **iOSネイティブアプリ（Xcode + Swift/SwiftUI）** ← 推奨
2. React Native（クロスプラットフォーム）
3. PWA（Progressive Web App）

---

## 🍎 iOSネイティブアプリ開発（Xcode）

### 技術スタック

#### フロントエンド
- **言語**: Swift 5.10+
- **UIフレームワーク**: SwiftUI
- **最小iOS**: iOS 17.0+
- **アーキテクチャ**: MVVM + Combine

#### バックエンド
- **Supabase Swift SDK**: 既存のPostgreSQLデータベースを再利用
- **認証**: Supabase Auth（Web版と共通）
- **データ同期**: 自動同期・リアルタイム更新対応

#### データ永続化
- **ローカルDB**: SwiftData (iOS 17+)
- **キャッシュ**: オフライン対応のためローカルにキャッシュ
- **同期戦略**: Optimistic UI + バックグラウンド同期

---

## 📱 機能対応表

| 機能 | Web版 | iOS版 | 備考 |
|------|------|-------|------|
| アイデアメモ | ✅ | ✅ | ウィジェット対応 |
| DJ成長記録 | ✅ | ✅ | - |
| エンジニア管理 | ✅ | ✅ | - |
| 健康管理 | ✅ | ✅ | HealthKit連携検討 |
| 思考法記録 | ✅ | ✅ | - |
| データ可視化 | ✅ | ✅ | Swift Charts使用 |
| オフライン対応 | ❌ | ✅ | iOS版の強み |
| プッシュ通知 | ❌ | ✅ | iOS版の強み |
| ウィジェット | N/A | ✅ | iOS版の強み |

---

## 🛠️ プロジェクト構成

### Xcodeプロジェクト構造

```
SparkVault/
├── SparkVaultApp.swift           # アプリエントリーポイント
├── Models/                       # データモデル
│   ├── Idea.swift
│   ├── DJRecord.swift
│   ├── EngineerRecord.swift
│   ├── HealthRecord.swift
│   └── ThinkingRecord.swift
├── ViewModels/                   # ビューモデル（MVVM）
│   ├── IdeaViewModel.swift
│   ├── DJViewModel.swift
│   ├── EngineerViewModel.swift
│   ├── HealthViewModel.swift
│   └── ThinkingViewModel.swift
├── Views/                        # SwiftUIビュー
│   ├── Dashboard/
│   │   └── DashboardView.swift
│   ├── Idea/
│   │   ├── IdeaListView.swift
│   │   ├── IdeaDetailView.swift
│   │   └── IdeaFormView.swift
│   ├── DJ/
│   ├── Engineer/
│   ├── Health/
│   └── Thinking/
├── Services/                     # API・データサービス
│   ├── SupabaseService.swift
│   ├── AuthService.swift
│   └── SyncService.swift
├── Utilities/                    # ヘルパー・拡張
│   ├── Extensions/
│   └── Constants.swift
├── Widgets/                      # ホーム画面ウィジェット
│   └── IdeaWidget.swift
└── Resources/                    # アセット・設定
    ├── Assets.xcassets
    └── Info.plist
```

---

## 🔄 データ同期戦略

### Supabase統合

Web版とiOS版でデータベースを共有：

```swift
import Supabase

class SupabaseService {
    static let shared = SupabaseService()

    let client = SupabaseClient(
        supabaseURL: URL(string: "YOUR_SUPABASE_URL")!,
        supabaseKey: "YOUR_SUPABASE_ANON_KEY"
    )

    // アイデア取得
    func fetchIdeas() async throws -> [Idea] {
        let response: [Idea] = try await client
            .from("ideas")
            .select()
            .order("created_at", ascending: false)
            .execute()
            .value

        return response
    }

    // アイデア作成
    func createIdea(_ idea: IdeaInput) async throws -> Idea {
        let response: Idea = try await client
            .from("ideas")
            .insert(idea)
            .select()
            .single()
            .execute()
            .value

        return response
    }
}
```

### オフライン対応

```swift
import SwiftData

@Model
class CachedIdea {
    var id: String
    var title: String
    var content: String
    var category: String
    var synced: Bool = false

    // ローカルでキャッシュ、ネット接続時に同期
}
```

---

## 📊 iOS専用機能

### 1. ホーム画面ウィジェット

**アイデアクイック入力ウィジェット**
- ホーム画面から1タップでアイデア入力画面を開く
- 最近のアイデアをプレビュー表示

```swift
struct IdeaWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: "IdeaWidget",
            provider: Provider()
        ) { entry in
            IdeaWidgetView(entry: entry)
        }
        .configurationDisplayName("アイデアメモ")
        .description("最近のアイデアを表示")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
```

### 2. プッシュ通知

- 毎日の記録リマインダー
- 目標達成通知
- 週次サマリー

### 3. HealthKit連携（オプション）

健康管理機能でiOSのHealthKitと連携：
- 睡眠時間の自動取得
- 運動データの自動記録
- 心拍数・歩数の統合

```swift
import HealthKit

class HealthKitService {
    let healthStore = HKHealthStore()

    func requestAuthorization() async throws {
        let types: Set = [
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!
        ]

        try await healthStore.requestAuthorization(
            toShare: [],
            read: types
        )
    }
}
```

---

## 🎨 デザインガイドライン

### iOS Human Interface Guidelines準拠

- **ナビゲーション**: TabView（下部タブバー）
- **カラー**: システムカラー使用（ダークモード自動対応）
- **タイポグラフィ**: SF Pro（システムフォント）
- **アニメーション**: スムーズなトランジション
- **アクセシビリティ**: VoiceOver対応

### カラーパレット（iOS版）

```swift
extension Color {
    static let sparkPrimary = Color("Primary") // 紫 #8b5cf6
    static let sparkSecondary = Color("Secondary") // 青 #3b82f6
    static let sparkSuccess = Color.green
    static let sparkWarning = Color.orange
    static let sparkError = Color.red
}
```

---

## 🚀 開発ロードマップ

### Phase 2-1: 基盤構築（1週間）
- [ ] Xcodeプロジェクト作成
- [ ] Supabase Swift SDK統合
- [ ] 認証フロー実装
- [ ] データモデル定義
- [ ] MVVM アーキテクチャ構築

### Phase 2-2: コア機能実装（2週間）
- [ ] アイデアメモ機能（CRUD）
- [ ] DJ成長記録機能
- [ ] エンジニア自己管理機能
- [ ] 健康管理機能
- [ ] 思考法記録機能

### Phase 2-3: iOS専用機能（1週間）
- [ ] オフライン対応
- [ ] ホーム画面ウィジェット
- [ ] プッシュ通知
- [ ] Swift Charts統合

### Phase 2-4: リリース準備（1週間）
- [ ] デザイン最適化
- [ ] パフォーマンステスト
- [ ] App Store スクリーンショット作成
- [ ] App Store リリース申請
- [ ] TestFlightベータテスト

**合計: 約5週間でiOS版完成**

---

## 📝 App Store リリース情報

### App Store Connect準備

**アプリ情報:**
- **名前**: Spark Vault
- **サブタイトル**: アイデア管理と自己成長の記録
- **カテゴリ**: 仕事効率化
- **価格**: 無料（将来的にプレミアム機能追加検討）

**必要なアセット:**
- アプリアイコン（1024x1024）
- スクリーンショット（iPhone, iPad）
- プレビュー動画（オプション）
- プライバシーポリシー
- サポートURL

---

## 🔒 セキュリティ・プライバシー

### Appleプライバシー要件

- Supabase認証情報の安全な保存（Keychain使用）
- データ収集の透明性（App Tracking Transparency対応）
- ユーザーデータの暗号化
- GDPR・プライバシーポリシー準拠

---

## 💡 将来的な拡張

- **Apple Watch対応**: クイックメモ、健康データ表示
- **Siri Shortcuts**: 音声でアイデア記録
- **Share Extension**: 他アプリからのコンテンツ保存
- **iCloud同期**: デバイス間でのデータ同期
- **iPad最適化**: Split View、マルチタスク対応
- **macOS版**: Mac Catalystまたはネイティブ

---

## 📚 参考リソース

### 公式ドキュメント
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui/)
- [Supabase Swift SDK](https://github.com/supabase/supabase-swift)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)

### 学習リソース
- [100 Days of SwiftUI](https://www.hackingwithswift.com/100/swiftui)
- [iOS App Dev Tutorials](https://developer.apple.com/tutorials/app-dev-training)

---

**Phase 1のWeb版完成後、このドキュメントに基づいてiOS開発を開始します。**
