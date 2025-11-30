# Xcodeビルドテスト

## 概要

Xcodeでプロジェクトをビルドし、技術的な問題がないか確認します。

**所要時間**: 5-10分

## 前提条件

- [ ] Xcode がインストールされている（最新版推奨）
- [ ] プロジェクトが最新の状態（`git pull`済み）

## 手順

### 1. 環境変数の確認

アプリがSupabaseに接続するために、環境変数が正しく設定されていることを確認します。

#### 1.1 環境変数ファイルの確認

```bash
cd /Users/gaku/spark-vault
cat .env.local
```

**必須の環境変数**:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_URL=http://localhost:5173
```

**確認項目**:
- [ ] `.env.local` ファイルが存在する
- [ ] `VITE_SUPABASE_URL` が設定されている
- [ ] `VITE_SUPABASE_ANON_KEY` が設定されている
- [ ] 値が `your_*` などのプレースホルダーではない

**ファイルがない場合**:
```bash
cp .env.example .env.local
# .env.local を編集して実際の値を入力
```

### 2. Webアプリのビルド

Reactアプリをビルドします。

```bash
cd /Users/gaku/spark-vault
npm run build:ios
```

**期待される出力**:
```
✓ built in XXXms
Capacitor sync completed!
```

**エラーが発生した場合**:
- TypeScriptエラー → `npm run type-check` で確認
- Lintエラー → `npm run lint` で確認
- 依存関係エラー → `npm install` を再実行

### 3. Xcodeでプロジェクトを開く

```bash
npm run cap:open:ios
```

または手動で:
```bash
open ios/App/App.xcworkspace
```

**注意**: `.xcodeproj` ではなく `.xcworkspace` を開くこと

### 4. ビルド設定の確認

#### 4.1 ターゲット設定

1. 左側のナビゲータで `App` プロジェクトを選択
2. `TARGETS` → `App` を選択
3. `General` タブで確認:
   - **Display Name**: `Spark Vault`
   - **Bundle Identifier**: `com.ogadix.sparkvault`
   - **Version**: `1.0`
   - **Build**: `1`
   - **Deployment Target**: `iOS 13.0` 以上

#### 4.2 Signing & Capabilities

1. `Signing & Capabilities` タブを選択
2. **Automatically manage signing** にチェック
3. **Team**: 自分のApple Developer Team を選択
4. **Signing Certificate**: 自動的に設定される

**初回の場合**: Xcodeが自動的に開発用証明書を作成します

### 5. ビルドの実行

#### 5.1 ビルドスキームの選択

1. 上部ツールバーで `App` スキームが選択されていることを確認
2. デバイスとして `Any iOS Device (arm64)` を選択

#### 5.2 ビルド実行

**方法1: メニューから**
- `Product` → `Build` (⌘B)

**方法2: ショートカット**
- `⌘B` (Command + B)

#### 5.3 ビルド結果の確認

**成功した場合**:
- 画面上部に "Build Succeeded" と表示
- ビルド時間が表示される（例: "Build Succeeded in 45.3 seconds"）

**失敗した場合**:
- 画面上部に "Build Failed" と表示
- 左側の Issue Navigator（⚠️アイコン）にエラー一覧が表示される

### 6. ビルドログの確認

1. 右上の `Report Navigator` アイコン（時計マーク）をクリック
2. 最新のビルドログを選択
3. 警告やエラーがないか確認

**許容される警告**:
- Capacitorプラグインの軽微な警告
- CocoaPodsの互換性警告

**対処が必要なエラー**:
- コード署名エラー
- 依存関係の不足
- Swift/Objective-Cのコンパイルエラー

## よくあるエラーと対処法

### エラー1: "No signing certificate found"

**原因**: 開発用証明書が設定されていない

**対処法**:
1. `Signing & Capabilities` で Team を選択
2. Xcodeが自動的に証明書を作成するのを待つ
3. それでも解決しない場合:
   - Apple Developer サイトで証明書を手動作成
   - Xcodeで `Preferences` → `Accounts` → Download Manual Profiles

### エラー2: "Command PhaseScriptExecution failed"

**原因**: Capacitor syncが正しく実行されていない

**対処法**:
```bash
cd /Users/gaku/spark-vault
npm run cap:sync
```

### エラー3: "Module 'Capacitor' not found"

**原因**: CocoaPodsの依存関係が不足

**対処法**:
```bash
cd ios/App
pod install
```

### エラー4: "Build input file cannot be found"

**原因**: Webアプリがビルドされていない

**対処法**:
```bash
cd /Users/gaku/spark-vault
npm run build
npm run cap:sync
```

## チェックリスト

ビルドテストが完了したら、以下を確認:

- [ ] 環境変数が正しく設定されている
- [ ] `.env.local` ファイルが存在する
- [ ] ビルドが成功した（"Build Succeeded"）
- [ ] エラーが0件
- [ ] 重大な警告がない
- [ ] Bundle IDが正しい（`com.ogadix.sparkvault`）
- [ ] バージョンが正しい（`1.0 (1)`）
- [ ] Signingが設定されている

## 次のステップ

ビルドが成功したら、次は実機テストに進みます。

→ [02-device-testing.md](./02-device-testing.md)

## トラブルシューティング

### ビルドが遅い場合

1. `Product` → `Clean Build Folder` (⇧⌘K)
2. Xcodeを再起動
3. Derived Data を削除:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

### CocoaPodsの問題

```bash
cd ios/App
pod deintegrate
pod install
```

### Capacitorプラグインの問題

```bash
npm uninstall @capacitor/ios
npm install @capacitor/ios@latest
npm run cap:sync
```

## 参考資料

- [Xcode Build Settings Reference](https://developer.apple.com/documentation/xcode/build-settings-reference)
- [Code Signing Guide](https://developer.apple.com/support/code-signing/)
