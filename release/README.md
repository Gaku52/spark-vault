# Spark Vault - App Store リリース作業フォルダ

## フォルダ構成

```
release/
├── README.md                    # このファイル
├── demo-account.md              # デモアカウント情報
├── release-checklist.md         # 実作業用チェックリスト
├── screenshots/                 # スクリーンショット保存先
│   ├── iphone-6.7/             # iPhone 6.7" (1290x2796)
│   └── iphone-6.5/             # iPhone 6.5" (1284x2778)
└── app-store-assets/            # App Store用テキスト素材
    ├── description.txt          # アプリ説明文
    ├── keywords.txt             # キーワード
    └── whats-new.txt            # 新機能

```

## 使い方

### 1. プライバシーポリシー公開
既存ファイル: `public/privacy-policy.html`
→ GitHub Pages で公開

### 2. デモアカウント作成
`demo-account.md` に記録

### 3. スクリーンショット撮影
`screenshots/iphone-6.7/` に保存（5枚）

### 4. App Store Connect 入力
`app-store-assets/` のテキストをコピペ

### 5. アーカイブ & アップロード
Xcode から実施

### 6. 審査提出
App Store Connect で提出

## 参考ドキュメント

詳細な手順は `docs/ios-release/` を参照
