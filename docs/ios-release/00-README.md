# Spark Vault - iOS App Store審査申請ガイド

## 概要

このドキュメント群は、Spark Vault iOSアプリをApp Storeに申請するための完全な手順書です。

## アプリ情報

- **アプリ名**: Spark Vault
- **Bundle ID**: com.ogadix.sparkvault
- **バージョン**: 1.0 (ビルド番号: 1)
- **カテゴリ**: 生産性
- **対象デバイス**: iPhone, iPad

## ドキュメント構成

### フェーズ1: 技術的検証（所要時間: 30-45分）

1. **[01-xcode-build-test.md](./01-xcode-build-test.md)**
   - Xcodeでのビルドテスト手順
   - エラー対処方法

2. **[02-device-testing.md](./02-device-testing.md)**
   - 実機での動作確認手順
   - テストチェックリスト

### フェーズ2: App Store準備（所要時間: 1.5-3時間）

3. **[03-privacy-policy-hosting.md](./03-privacy-policy-hosting.md)**
   - プライバシーポリシーの公開手順

4. **[04-app-store-connect-setup.md](./04-app-store-connect-setup.md)**
   - App Store Connectでの設定手順
   - 必要情報の入力ガイド

5. **[05-screenshot-guide.md](./05-screenshot-guide.md)**
   - スクリーンショット作成ガイド
   - 各デバイスサイズの要件

6. **[06-archive-and-upload.md](./06-archive-and-upload.md)**
   - Xcodeでのアーカイブ作成
   - App Store Connectへのアップロード

### ツール

7. **[07-checklist.md](./07-checklist.md)**
   - 全体チェックリスト
   - 進捗管理

## 推奨スケジュール

### Day 1（技術的検証）
- 08:00-08:10: Xcodeビルドテスト
- 08:10-08:40: 実機テスト
- 08:40-08:45: 問題点の記録

### Day 2（App Store準備）
- プライバシーポリシー公開: 15分
- App Store Connect設定: 30分
- スクリーンショット作成: 60分
- アーカイブとアップロード: 30分

## 前提条件

### 必須アカウント
- [ ] Apple Developer Program（年額 ¥12,980 または $99）
- [ ] App Store Connect アクセス

### 必須ツール
- [ ] Xcode（最新版推奨）
- [ ] macOS（Ventura 13.0以降推奨）
- [ ] 実機のiPhoneまたはiPad

### 準備済み項目（確認済み）
- ✅ アプリアイコン（全サイズ）
- ✅ プライバシーポリシー（HTML）
- ✅ Info.plist設定
- ✅ Capacitorプラグイン統合
- ✅ Bundle ID設定

## 注意事項

### 審査で重視されるポイント
1. **プライバシー**: 個人情報の取り扱いが明確か
2. **機能性**: アプリが正常に動作するか
3. **コンテンツ**: 適切な内容か
4. **デザイン**: iOSデザインガイドラインに準拠しているか

### よくある却下理由
- プライバシーポリシーのURLが無効
- スクリーンショットが不適切
- アプリがクラッシュする
- 機能が不完全

## サポート

### トラブルシューティング
問題が発生した場合は、各ドキュメントの「トラブルシューティング」セクションを参照してください。

### 参考リンク
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 進捗状況

最新の進捗状況は [07-checklist.md](./07-checklist.md) で確認してください。
