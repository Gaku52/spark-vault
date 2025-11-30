# アーカイブとApp Store へのアップロード

## 概要

Xcodeでアプリをアーカイブし、App Store Connectにアップロードします。

**所要時間**: 15-30分

## 前提条件

- [ ] Xcodeビルドテストが完了
- [ ] 実機テストが完了
- [ ] App Store Connect の設定が完了
- [ ] Distribution 証明書とプロビジョニングプロファイルの準備

## 手順

### 1. 証明書とプロビジョニングプロファイルの確認

#### 1.1 Xcodeでの確認

1. Xcode で `Preferences` (⌘,) を開く
2. `Accounts` タブを選択
3. Apple IDを選択
4. `Manage Certificates...` をクリック

**必要な証明書**:
- **Apple Development**: 開発用（すでにある）
- **Apple Distribution**: App Store配布用

**Distribution証明書がない場合**:
1. `+` → `Apple Distribution` をクリック
2. 自動的に作成される

#### 1.2 プロビジョニングプロファイルのダウンロード

1. `Download Manual Profiles` をクリック
2. Xcode が自動的にプロファイルをダウンロード

### 2. アーカイブの準備

#### 2.1 Webアプリの最終ビルド

```bash
cd /Users/gaku/spark-vault

# 依存関係の確認
npm install

# 本番用ビルド
NODE_ENV=production npm run build

# Capacitor sync
npm run cap:sync
```

**確認**:
```bash
ls -lh dist/
# distフォルダにindex.html, assets などが存在することを確認
```

#### 2.2 バージョン番号の確認

1. Xcodeで `ios/App/App.xcworkspace` を開く

2. プロジェクトナビゲータで `App` を選択

3. `General` タブで確認:
   - **Version**: `1.0`
   - **Build**: `1`

**注意**: 審査に再提出する場合は Build 番号を増やす（例: 2, 3, ...）

#### 2.3 ビルドコンフィギュレーションの設定

1. Xcodeの上部ツールバーでスキームを選択

2. `Product` → `Scheme` → `Edit Scheme...` (⌥⌘R)

3. 左側で `Archive` を選択

4. `Build Configuration`: **Release** に設定

5. `Close`

### 3. アーカイブの作成

#### 3.1 デバイスターゲットの選択

1. Xcodeの上部ツールバーで `Any iOS Device (arm64)` を選択

**注意**: シミュレータやspecificデバイスではなく、必ず "Any iOS Device" を選択

#### 3.2 アーカイブの実行

**方法1: メニューから**
1. `Product` → `Archive`

**方法2: ショートカット**
- ⇧⌘B (Shift + Command + B)

**処理時間**: 3-10分（初回は長い）

**成功した場合**:
- 自動的に Organizer ウィンドウが開く
- 作成したアーカイブが表示される

**失敗した場合**:
- エラーメッセージを確認
- [トラブルシューティング](#トラブルシューティング) を参照

### 4. アーカイブの検証

Organizer ウィンドウで:

1. 作成したアーカイブを選択

2. **Validate App** をクリック

3. Distribution オプション:
   - **App Store Connect** を選択
   - **Next**

4. Distribution certificate と Provisioning profile:
   - **Automatically manage signing** を選択（推奨）
   - **Next**

5. 検証が開始される（1-3分）

**成功した場合**:
- "Validation Successful" と表示
- **Done** をクリック

**警告が表示される場合**:
- 軽微な警告（Missing compliance など）は無視してOK
- 重大なエラーの場合は修正が必要

### 5. App Store Connect へのアップロード

#### 5.1 アップロードの開始

1. Organizer で同じアーカイブを選択

2. **Distribute App** をクリック

3. **App Store Connect** を選択
   - **Next**

4. **Upload** を選択
   - **Next**

5. Distribution オプション:
   - ☑ **Strip Swift symbols** （推奨）
   - ☑ **Upload your app's symbols to receive symbolicated reports** （推奨）
   - ☐ Include bitcode (iOS はデフォルトで無効)
   - **Next**

6. **Automatically manage signing** を選択
   - **Next**

7. 最終確認画面:
   - App name: Spark Vault
   - Bundle ID: com.ogadix.sparkvault
   - Version: 1.0 (1)
   - **Upload** をクリック

#### 5.2 アップロード処理

**処理時間**: 5-15分（ネットワーク速度による）

**プログレス表示**:
- Uploading... (50%)
- Processing... (75%)
- Upload Successful (100%)

**成功した場合**:
- "Upload Successful" メッセージ
- **Done** をクリック

### 6. App Store Connect での確認

#### 6.1 処理待機

1. [App Store Connect](https://appstoreconnect.apple.com/) にログイン

2. `My Apps` → `Spark Vault` を選択

3. **「1.0 リリースの準備」** → **「ビルド」** セクション

**注意**: アップロード直後は表示されません。処理に **10-60分** かかります。

#### 6.2 ビルドの選択

処理が完了したら:

1. **「ビルド」** セクションで **「+」** をクリック

2. アップロードしたビルド（1.0 (1)）を選択

3. **完了**

#### 6.3 輸出コンプライアンス

**App Uses Encryption** のダイアログが表示された場合:

- **No** を選択
- Info.plist で `ITSAppUsesNonExemptEncryption = false` と設定済み

### 7. 審査へ提出

#### 7.1 最終確認

すべての情報が入力されていることを確認:

- [ ] アプリ情報（名前、説明、キーワード）
- [ ] スクリーンショット
- [ ] プライバシーポリシーURL
- [ ] アプリレビュー情報（デモアカウント）
- [ ] ビルドが選択されている

#### 7.2 審査への提出

1. ページ上部の **「審査に提出」** をクリック

2. 最終確認ダイアログ:
   - **提出** をクリック

3. ステータスが **「審査待ち」** に変更

**完了！**

審査には通常 **24-48時間** かかります。

## 審査ステータスの確認

### ステータスの種類

1. **審査待ち** (Waiting for Review)
   - キューに入った状態
   - 通常 24-48時間

2. **審査中** (In Review)
   - Appleが実際に審査中
   - 通常 1-2日

3. **承認済み** (Ready for Sale)
   - 審査通過！
   - App Storeに公開

4. **却下** (Rejected)
   - 問題があり却下
   - Resolution Center でフィードバックを確認
   - 修正して再提出

### 通知設定

1. App Store Connect → `ユーザーとアクセス` → 自分のアカウント

2. `通知` で以下を有効化:
   - ☑ App が承認されました
   - ☑ App が却下されました
   - ☑ App のステータスが変更されました

## チェックリスト

アップロードが完了したら:

- [ ] アーカイブが成功した
- [ ] 検証が成功した
- [ ] App Store Connect にアップロード完了
- [ ] ビルドがApp Store Connectで表示された
- [ ] ビルドを選択した
- [ ] すべての情報が入力済み
- [ ] 審査に提出した
- [ ] ステータスが「審査待ち」

## トラブルシューティング

### エラー1: "No signing certificate found"

**原因**: Distribution証明書がない

**対処法**:
1. `Xcode` → `Preferences` → `Accounts`
2. `Manage Certificates...` → `+` → `Apple Distribution`
3. 再度アーカイブ

### エラー2: "Archive failed"

**原因**: ビルドエラー

**対処法**:
1. `Product` → `Clean Build Folder` (⇧⌘K)
2. プロジェクトナビゲータで `App` を選択
3. `Build Settings` で "Signing" を確認
4. 再度アーカイブ

### エラー3: "Invalid Swift Support"

**原因**: Swiftライブラリの問題

**対処法**:
1. `Build Settings` → `Always Embed Swift Standard Libraries` → `Yes`
2. 再度アーカイブ

### エラー4: "アップロードが失敗しました"

**原因**: ネットワークエラー、またはバージョン重複

**対処法**:
1. ネットワーク接続を確認
2. Build番号が重複していないか確認
3. 再度アップロード

### エラー5: "Missing Compliance"

**原因**: 暗号化コンプライアンス情報が不足

**対処法**:
1. Info.plistに `ITSAppUsesNonExemptEncryption = NO` が設定されているか確認
2. App Store Connectで "No" を選択

### ビルドが App Store Connect に表示されない

**原因**: 処理中

**対処法**:
1. 10-60分待つ
2. メールで通知が来る
3. それでも表示されない場合は、Xcodeから再アップロード

## コマンドラインでのアップロード（上級者向け）

### Transporter アプリを使用

1. App Store から [Transporter](https://apps.apple.com/app/transporter/id1450874784) をダウンロード

2. Xcodeでアーカイブを IPA ファイルにエクスポート:
   - Organizer → `Export` → `App Store Connect` → `Export`

3. Transporter で IPA ファイルをアップロード

### altool を使用（非推奨）

```bash
xcrun altool --upload-app \
  --type ios \
  --file /path/to/App.ipa \
  --username "your@email.com" \
  --password "app-specific-password"
```

## 次のステップ

審査提出が完了したら、チェックリストで最終確認を行います。

→ [07-checklist.md](./07-checklist.md)

## 参考資料

- [Distributing Apps](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Xcode Organizer](https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices)
