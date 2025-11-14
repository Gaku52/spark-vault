# Spark Vault - Capacitor iOS アプリ仕様書

Capacitorを使用したiOSアプリ開発の完全ガイド

---

## 📋 目次

1. [概要](#概要)
2. [技術選定理由](#技術選定理由)
3. [技術スタック](#技術スタック)
4. [アーキテクチャ](#アーキテクチャ)
5. [セットアップ手順](#セットアップ手順)
6. [実装計画](#実装計画)
7. [iOS固有機能](#ios固有機能)
8. [ビルド・デプロイ](#ビルドデプロイ)
9. [ロードマップ](#ロードマップ)

---

## 🎯 概要

### Capacitorとは

**Capacitor**は、Ionic Teamが開発したクロスプラットフォームネイティブランタイムです。既存のWebアプリ（Next.js）をiOS/Androidアプリに変換できます。

### プロジェクト目標

- **最速でiOS版をリリース**（1週間以内）
- **既存のNext.jsコードを最大限活用**（95%以上の再利用）
- **ネイティブ機能へのアクセス**（カメラ、通知、ファイルシステムなど）
- **Web版との完全な機能同等性**

---

## 🤔 技術選定理由

### なぜCapacitorを選ぶのか？

| 要素 | Capacitor | Swift/SwiftUI | React Native | Flutter |
|------|-----------|---------------|--------------|---------|
| **開発期間** | 1週間 | 5週間 | 6-8週間 | 8-10週間 |
| **コード再利用** | 95% | 0% | 50% | 0% |
| **既存技術活用** | ⭐⭐⭐ | ❌ | ⭐⭐ | ❌ |
| **学習コスト** | 低 | 高 | 中 | 高 |
| **Web版同期** | 自動 | 手動実装 | 手動実装 | 手動実装 |
| **メンテナンス** | 容易 | 難 | 中 | 難 |

### メリット

✅ **既存のNext.jsアプリをそのまま使用**
- React、TypeScript、TailwindCSS、shadcn/uiをそのまま利用
- ビジネスロジック・UI・スタイルの完全再利用

✅ **Supabaseとの完全互換性**
- Supabase JavaScript SDKがそのまま動作
- 認証、データベース、ストレージすべて共通

✅ **超高速開発**
- 設定だけで1-3日でiOSアプリが完成
- デバッグもChrome DevToolsで可能

✅ **iOS/Android同時対応**
- 1つのコードベースで両プラットフォーム対応

✅ **メンテナンスコストの削減**
- Web版を更新すればiOS版も自動更新
- バグ修正が1箇所で済む

### デメリットと対策

❌ **ネイティブ感が若干劣る**
→ 対策: Capacitor Pluginsでネイティブ機能を追加

❌ **パフォーマンスがネイティブより劣る**
→ 影響: Spark Vaultはヘビーな処理がないため問題なし

❌ **App Storeの審査**
→ 対策: WebViewアプリでも問題なく承認される事例多数

---

## 🛠️ 技術スタック

### フロントエンド（既存）

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **UIライブラリ**: React 18
- **スタイリング**: TailwindCSS + shadcn/ui
- **状態管理**: React Context / Hooks
- **フォーム**: React Hook Form + Zod

### バックエンド（既存）

- **BaaS**: Supabase
- **データベース**: PostgreSQL
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage

### モバイル（新規追加）

- **ネイティブランタイム**: Capacitor 6.x
- **iOS最小バージョン**: iOS 13.0+
- **ビルドツール**: Xcode 15+
- **パッケージマネージャー**: npm

### Capacitorプラグイン

| プラグイン | 用途 | 優先度 |
|----------|------|-------|
| @capacitor/app | アプリライフサイクル | 必須 |
| @capacitor/haptics | 触覚フィードバック | 高 |
| @capacitor/status-bar | ステータスバー制御 | 高 |
| @capacitor/splash-screen | スプラッシュ画面 | 高 |
| @capacitor/keyboard | キーボード制御 | 高 |
| @capacitor/push-notifications | プッシュ通知 | 中 |
| @capacitor/share | 共有機能 | 中 |
| @capacitor/camera | カメラアクセス | 低 |
| @capacitor/filesystem | ファイルシステム | 低 |

---

## 🏗️ アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────┐
│         iOS Native Container            │
│  ┌───────────────────────────────────┐  │
│  │      Capacitor WebView            │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │     Next.js Application     │  │  │
│  │  │                             │  │  │
│  │  │  - React Components         │  │  │
│  │  │  - TailwindCSS Styles       │  │  │
│  │  │  - Supabase Client          │  │  │
│  │  │  - Business Logic           │  │  │
│  │  └─────────────────────────────┘  │  │
│  │              ↕                    │  │
│  │      Capacitor Bridge             │  │
│  └───────────────────────────────────┘  │
│              ↕                          │
│     Native iOS APIs                     │
│  (Camera, Notifications, etc.)          │
└─────────────────────────────────────────┘
                ↕
        Supabase Cloud
```

### ディレクトリ構造

```
spark-vault/
├── src/                        # Next.jsアプリ（既存）
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── public/                     # 静的ファイル
├── ios/                        # iOS Capacitorプロジェクト（新規）
│   ├── App/
│   │   ├── App/
│   │   │   ├── AppDelegate.swift
│   │   │   ├── Info.plist
│   │   │   └── Assets.xcassets/
│   │   ├── App.xcodeproj
│   │   └── Podfile
│   └── capacitor.config.ts
├── android/                    # Androidプロジェクト（将来）
├── capacitor.config.ts         # Capacitor設定
├── package.json
└── docs/
    └── CAPACITOR_IOS_SPECIFICATION.md  # 本ドキュメント
```

---

## 🚀 セットアップ手順

### 前提条件

- ✅ macOS（必須）
- ✅ Xcode 15+（App Storeからインストール）
- ✅ Node.js 18+
- ✅ CocoaPods（Xcodeの依存関係管理）
- ✅ Apple Developer Account（実機テスト・リリース用）

### 1. Capacitorのインストール

```bash
# プロジェクトルートで実行
cd /path/to/spark-vault

# Capacitorコアをインストール
npm install @capacitor/core @capacitor/cli

# Capacitorを初期化
npx cap init "Spark Vault" "com.ogadix.sparkvault" --web-dir=out

# iOSプラットフォームを追加
npm install @capacitor/ios
npx cap add ios
```

### 2. Next.jsのビルド設定

`next.config.js`を編集：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静的エクスポートを有効化
  images: {
    unoptimized: true, // 画像最適化を無効化（静的エクスポートのため）
  },
  trailingSlash: true, // URLの末尾にスラッシュを追加
}

module.exports = nextConfig
```

### 3. Capacitor設定ファイル

`capacitor.config.ts`を作成：

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ogadix.sparkvault',
  appName: 'Spark Vault',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8b5cf6', // Spark Vaultのプライマリカラー
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
```

### 4. 必須プラグインのインストール

```bash
# 基本プラグイン
npm install @capacitor/app
npm install @capacitor/haptics
npm install @capacitor/keyboard
npm install @capacitor/status-bar
npm install @capacitor/splash-screen

# アプリ機能拡張プラグイン
npm install @capacitor/push-notifications
npm install @capacitor/share
```

### 5. ビルドと同期

```bash
# Next.jsアプリをビルド
npm run build

# ビルド成果物をiOSプロジェクトに同期
npx cap sync ios

# Xcodeでプロジェクトを開く
npx cap open ios
```

### 6. Xcodeでの設定

Xcodeが開いたら：

1. **Team（開発チーム）の設定**
   - プロジェクト設定 → Signing & Capabilities
   - Team: あなたのApple Developer Account

2. **Bundle Identifierの確認**
   - `com.ogadix.sparkvault`

3. **Deployment Targetの設定**
   - iOS 13.0以上

4. **アプリアイコンの追加**
   - `App/App/Assets.xcassets/AppIcon.appiconset/`に配置

5. **実機またはシミュレータで実行**
   - 上部のデバイス選択 → Run（⌘R）

---

## 📝 実装計画

### Phase 1: 基本セットアップ（1-2日）

#### Day 1: 環境構築
- [x] Xcode インストール
- [ ] Capacitor インストール・初期化
- [ ] Next.js ビルド設定変更（static export）
- [ ] 初回ビルド・同期確認

#### Day 2: 基本機能確認
- [ ] iOSシミュレータで動作確認
- [ ] Supabase接続確認
- [ ] 認証フロー動作確認
- [ ] 画面遷移確認

**成果物:**
- ✅ iOS上で動作するSpark Vault
- ✅ 全Web機能が動作

---

### Phase 2: iOS最適化（2-3日）

#### ネイティブ感の向上

**タスク:**
- [ ] スプラッシュスクリーン追加
- [ ] ステータスバーのスタイル設定
- [ ] セーフエリアの調整
- [ ] キーボード挙動の最適化
- [ ] 触覚フィードバック追加
- [ ] スワイプジェスチャー対応

**実装例:**

```typescript
// src/lib/capacitor-utils.ts
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

export const capacitorUtils = {
  // 触覚フィードバック
  async hapticImpact(style: ImpactStyle = ImpactStyle.Medium) {
    await Haptics.impact({ style });
  },

  // ステータスバー設定
  async setupStatusBar() {
    await StatusBar.setStyle({ style: Style.Dark });
  },

  // キーボード表示時にスクロール
  setupKeyboard() {
    Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.style.paddingBottom = `${info.keyboardHeight}px`;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.style.paddingBottom = '0px';
    });
  },
};
```

**UIコンポーネントの調整:**

```typescript
// src/components/ui/button.tsx
import { capacitorUtils } from '@/lib/capacitor-utils';

export function Button({ onClick, ...props }) {
  const handleClick = async (e) => {
    // ボタンタップ時に触覚フィードバック
    await capacitorUtils.hapticImpact();
    onClick?.(e);
  };

  return <button onClick={handleClick} {...props} />;
}
```

---

### Phase 3: iOS固有機能（2-3日）

#### 3.1 プッシュ通知

```typescript
// src/lib/push-notifications.ts
import { PushNotifications } from '@capacitor/push-notifications';

export async function setupPushNotifications() {
  // 通知の許可をリクエスト
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('プッシュ通知が許可されていません');
  }

  // 登録
  await PushNotifications.register();

  // トークン受信
  PushNotifications.addListener('registration', (token) => {
    console.log('Push token: ', token.value);
    // Supabaseに保存
  });

  // 通知受信
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('通知受信: ', notification);
  });
}
```

#### 3.2 共有機能

```typescript
// src/components/idea-share-button.tsx
import { Share } from '@capacitor/share';

export function IdeaShareButton({ idea }) {
  const handleShare = async () => {
    await Share.share({
      title: idea.title,
      text: idea.content,
      url: `https://spark.ogadix.com/ideas/${idea.id}`,
      dialogTitle: 'アイデアを共有',
    });
  };

  return <Button onClick={handleShare}>共有</Button>;
}
```

#### 3.3 アプリバッジ（未読カウント）

```typescript
// src/lib/badge.ts
import { Capacitor } from '@capacitor/core';

export async function updateBadgeCount(count: number) {
  if (Capacitor.getPlatform() === 'ios') {
    // iOS専用プラグインを使用
    // 将来的に実装
  }
}
```

---

### Phase 4: テスト・最適化（1-2日）

#### パフォーマンステスト
- [ ] 起動時間計測（目標: 3秒以内）
- [ ] ページ遷移の速度確認
- [ ] メモリ使用量チェック
- [ ] バッテリー消費テスト

#### UIテスト
- [ ] 各画面の表示確認
- [ ] フォーム入力のテスト
- [ ] 画像表示の確認
- [ ] レスポンシブデザインの確認

#### 機能テスト
- [ ] 認証フロー（サインアップ・ログイン）
- [ ] アイデアのCRUD操作
- [ ] 検索・フィルター機能
- [ ] タグ付け機能
- [ ] データ同期確認

#### デバイステスト
- [ ] iPhone SE（小画面）
- [ ] iPhone 14 Pro（標準）
- [ ] iPhone 14 Pro Max（大画面）
- [ ] iPad（タブレット）

---

## 📱 iOS固有機能

### 1. スプラッシュスクリーン

**デザイン:**
- 背景色: `#8b5cf6`（Spark Vaultのプライマリカラー）
- ロゴ: 中央配置
- 表示時間: 2秒

**実装:**

`ios/App/App/Assets.xcassets/Splash.imageset/`にスプラッシュ画像を配置

**必要なサイズ:**
- 1x: 2048x2048px
- 2x: 2048x2048px
- 3x: 2048x2048px

---

### 2. アプリアイコン

**デザイン要件:**
- サイズ: 1024x1024px
- フォーマット: PNG（透過なし）
- スタイル: Spark Vaultブランドに準拠

**配置場所:**
`ios/App/App/Assets.xcassets/AppIcon.appiconset/`

---

### 3. セーフエリア対応

iOS特有のノッチ・ダイナミックアイランド対応

```css
/* src/app/globals.css */
@supports (padding: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
```

---

### 4. ダークモード対応

Capacitorは自動的にシステムのダークモードを検出

```typescript
// src/hooks/use-dark-mode.ts
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(prefersDark.matches);

      const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
      prefersDark.addEventListener('change', listener);

      return () => prefersDark.removeEventListener('change', listener);
    }
  }, []);

  return isDark;
}
```

---

## 🏗️ ビルド・デプロイ

### 開発ビルド

```bash
# Next.jsをビルド
npm run build

# Capacitorに同期
npx cap sync ios

# Xcodeで開く
npx cap open ios

# Xcodeから実機またはシミュレータで実行
```

---

### プロダクションビルド

#### 1. バージョン管理

`package.json`:
```json
{
  "version": "1.0.0"
}
```

`ios/App/App.xcodeproj/project.pbxproj`:
- Version: 1.0.0
- Build: 1

#### 2. App Store用にアーカイブ

Xcodeで:
1. Product → Archive
2. Distribute App
3. App Store Connect
4. Upload

---

### 継続的デプロイ（CI/CD）

GitHub Actionsを使った自動ビルド:

```yaml
# .github/workflows/ios-build.yml
name: iOS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build

      - name: Sync Capacitor
        run: npx cap sync ios

      - name: Build iOS
        run: |
          cd ios/App
          xcodebuild -workspace App.xcworkspace \
            -scheme App \
            -sdk iphoneos \
            -configuration Release \
            build
```

---

## 📊 ロードマップ

### Week 1: MVP リリース

**Day 1-2: 環境構築**
- [x] Xcode インストール
- [ ] Capacitor セットアップ
- [ ] 初回ビルド成功

**Day 3-4: iOS最適化**
- [ ] スプラッシュスクリーン
- [ ] ステータスバー設定
- [ ] 触覚フィードバック
- [ ] キーボード最適化

**Day 5-6: テスト**
- [ ] 機能テスト
- [ ] デバイステスト
- [ ] パフォーマンステスト

**Day 7: リリース準備**
- [ ] App Store スクリーンショット
- [ ] App Store Connect設定
- [ ] TestFlight ベータ配信

---

### Week 2-3: 機能拡張

**追加機能:**
- [ ] プッシュ通知
- [ ] 共有機能
- [ ] オフライン対応（Service Worker）
- [ ] ダークモード完全対応

---

### Week 4+: Android展開

- [ ] Android Studioセットアップ
- [ ] Androidビルド
- [ ] Google Play Console登録
- [ ] Android版リリース

---

## 🔍 よくある問題と解決策

### 1. ビルドエラー: "Command PhaseScriptExecution failed"

**原因:** CocoaPodsの依存関係の問題

**解決策:**
```bash
cd ios/App
pod deintegrate
pod install
```

---

### 2. Supabase接続エラー

**原因:** HTTPSでない、CORSの問題

**解決策:**
`capacitor.config.ts`で`https`スキームを使用：
```typescript
server: {
  iosScheme: 'https',
}
```

---

### 3. 画像が表示されない

**原因:** Next.jsの画像最適化

**解決策:**
`next.config.js`:
```javascript
images: {
  unoptimized: true,
}
```

---

### 4. ルーティングが動かない

**原因:** SPA設定の不足

**解決策:**
`next.config.js`:
```javascript
trailingSlash: true,
```

---

## 📚 参考リソース

### 公式ドキュメント
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

### プラグイン
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Capacitor Community Plugins](https://github.com/capacitor-community)

### チュートリアル
- [Building a Mobile App with Capacitor and Next.js](https://capacitorjs.com/blog/capacitor-nextjs)

---

## 🎯 成功の定義

### MVP（最小限の製品）
- ✅ App Storeにリリース
- ✅ Web版の全機能が動作
- ✅ クラッシュなく安定動作
- ✅ レビュー平均4.0以上

### フルリリース
- ✅ プッシュ通知実装
- ✅ オフライン対応
- ✅ iOS専用機能追加
- ✅ パフォーマンス最適化

---

## 📞 サポート・問い合わせ

- **開発者**: Gaku
- **リポジトリ**: https://github.com/Gaku52/spark-vault
- **Web版**: https://spark.ogadix.com

---

**Phase 1のWeb版完成後、このドキュメントに基づいてCapacitor iOS開発を開始します。**

最終更新: 2025-11-15
