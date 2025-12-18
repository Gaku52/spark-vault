# Universal Links セットアップ - Xcode設定

## Xcodeで実行する手順

### 1. Xcodeプロジェクトを開く
```bash
open ~/spark-vault/ios/App/App.xcworkspace
```

### 2. Associated Domainsを追加

1. 左のプロジェクトナビゲーターで **App** プロジェクトを選択
2. **TARGETS** → **App** を選択
3. **Signing & Capabilities** タブをクリック
4. **+ Capability** ボタンをクリック
5. **Associated Domains** を検索して追加

### 3. ドメインを設定

Associated Domainsセクションに以下を追加：

```
applinks:spark.ogadix.com
```

**重要**: `applinks:` プレフィックスが必要です。`https://` は付けません。

### 4. 保存して閉じる

⌘ + S で保存

## 確認方法

1. **Capabilities** タブに **Associated Domains** が表示されている
2. ドメイン `applinks:spark.ogadix.com` が追加されている

## トラブルシューティング

### エラー: "Failed to register bundle identifier"

Apple Developer Portal で App ID が正しく設定されているか確認してください。

### Universal Linksが動作しない

1. AASAファイルが正しくデプロイされているか確認:
   ```
   https://spark.ogadix.com/.well-known/apple-app-site-association
   ```
   ブラウザで開いてJSONが表示されればOK

2. Apple's AASA Validatorで確認:
   https://branch.io/resources/aasa-validator/

3. デバイスを再起動
