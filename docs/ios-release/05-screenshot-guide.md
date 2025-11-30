# スクリーンショット準備ガイド

## 概要

App Storeで表示されるスクリーンショットを作成します。

**所要時間**: 30-60分

## 必要なスクリーンショット

### 必須

**iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max)**
- **解像度**: 1290 x 2796 pixels
- **枚数**: 3-10枚（推奨: 5枚）

### 推奨（審査を早めるため）

**iPhone 6.5" (iPhone 11 Pro Max, 12 Pro Max, 13 Pro Max)**
- **解像度**: 1284 x 2778 pixels
- **枚数**: 3-10枚（推奨: 5枚）

### オプション

**iPad Pro 12.9" (第6世代)**
- **解像度**: 2048 x 2732 pixels
- **枚数**: 3-10枚（推奨: 5枚）

## スクリーンショット撮影方法

### 方法1: Xcodeシミュレータ（推奨）

#### 1.1 シミュレータの起動

```bash
cd /Users/gaku/spark-vault
npm run build:ios
```

Xcodeで:
1. デバイスターゲットを **iPhone 15 Pro Max** に設定
2. `⌘R` でシミュレータを起動

#### 1.2 スクリーンショットの撮影

1. アプリでスクリーンショット撮りたい画面を表示
2. `⌘S` を押す
3. デスクトップに PNG ファイルが保存される

**注意**: ステータスバーの時刻を 9:41 AM にするため、以下を実行:
```bash
# シミュレータのステータスバーをクリーンに
xcrun simctl status_bar booted override --time "9:41"
```

#### 1.3 必要な画面

推奨される5枚のスクリーンショット:

1. **ログイン/ウェルカム画面**
   - アプリの第一印象
   - 「Spark Vault」のロゴ/名前が見える

2. **アイデア一覧画面**
   - いくつかのアイデアが表示されている状態
   - カテゴリやタグが見える

3. **アイデア作成画面**
   - 新規作成フォーム
   - タイトル、内容、カテゴリ、タグの入力欄

4. **アイデア詳細画面**
   - 完成されたアイデアの表示
   - 編集・削除ボタンも表示

5. **検索/フィルター画面** (オプション)
   - 検索機能またはフィルター機能を使用している様子

### 方法2: 実機で撮影

#### 2.1 実機での撮影

1. アプリを実機で起動
2. iPhone 15 Pro Max または 14 Pro Max を使用
3. スクリーンショットを撮影:
   - 音量上ボタン + サイドボタン を同時押し

4. Macに転送:
   - AirDrop を使用
   - または USBケーブルで接続して写真アプリから転送

#### 2.2 解像度の確認

```bash
# 画像のサイズを確認
sips -g pixelWidth -g pixelHeight screenshot.png
```

**正しい解像度**:
- iPhone 6.7": 1290 x 2796
- iPhone 6.5": 1284 x 2778

### 方法3: デザインツールで作成（プロフェッショナル）

Figma, Sketch, Adobe XD などを使用して、スクリーンショットをデザイン。

#### テンプレート使用

1. [App Store Screenshot Templates](https://www.figma.com/community/search?model_type=files&q=app%20store%20screenshot) からテンプレートをダウンロード

2. Spark Vaultのスクリーンショットを配置

3. 説明文やキャッチコピーを追加（オプション）

4. PNG形式でエクスポート

## スクリーンショットの編集

### 推奨編集

1. **明るさとコントラストの調整**
   - 見やすく、魅力的に

2. **ステータスバーのクリーンアップ**
   - バッテリー: フル充電
   - 時刻: 9:41 AM（Appleの標準）
   - 電波: フル

3. **テストデータの準備**
   - サンプルアイデアを複数作成
   - 魅力的な内容（「新規ビジネスアイデア」「旅行計画」など）
   - 画像を添付（あれば）

### オプション編集

1. **説明文の追加**
   - 各スクリーンショットに簡潔な説明
   - 例: "アイデアを即座に記録"

2. **デバイスフレームの追加**
   - iPhoneのフレームを追加して見栄えを良く
   - ツール: [Mockup Generator](https://mockuphone.com/)

## スクリーンショットのアップロード

### App Store Connect でのアップロード

1. App Store Connect → My Apps → Spark Vault

2. **「1.0 リリースの準備」** → **「iPhoneスクリーンショット」**

3. **iPhone 6.7"** セクション:
   - ドラッグ&ドロップで5枚をアップロード
   - 順序を調整（最も魅力的なものを最初に）

4. **iPhone 6.5"** セクション（推奨）:
   - 同様にアップロード

5. **iPad Pro 12.9"** セクション（オプション）:
   - iPadサイズのスクリーンショットをアップロード

## スクリーンショットのベストプラクティス

### DO（推奨）

- ✅ 明るく、クリアな画像
- ✅ アプリの主要機能を強調
- ✅ 実際のUIを表示
- ✅ 一貫性のある外観
- ✅ 魅力的なサンプルデータ

### DON'T（避けるべき）

- ❌ ぼやけた画像
- ❌ 空白や意味のない画面
- ❌ 他社のロゴやブランド
- ❌ 誤解を招く内容
- ❌ 個人情報の表示

## サンプルデータの準備

スクリーンショット撮影前に、以下のサンプルデータを作成:

### アイデアの例

1. **新規ビジネスアイデア**
   - カテゴリ: ビジネス
   - タグ: スタートアップ, イノベーション
   - 内容: "オンライン学習プラットフォームの構築..."

2. **旅行計画**
   - カテゴリ: 個人
   - タグ: 旅行, 計画
   - 内容: "来年の夏休みに京都への旅行..."

3. **書籍アイデア**
   - カテゴリ: クリエイティブ
   - タグ: 執筆, 小説
   - 内容: "SFストーリーのプロット..."

4. **健康目標**
   - カテゴリ: 健康
   - タグ: フィットネス, ダイエット
   - 内容: "週3回のジョギングを習慣化..."

5. **学習計画**
   - カテゴリ: 学習
   - タグ: プログラミング, React
   - 内容: "Reactの基礎を3ヶ月で習得..."

## チェックリスト

スクリーンショットの準備が完了したら:

- [ ] iPhone 6.7" のスクリーンショット5枚
- [ ] 各スクリーンショットの解像度が正確
- [ ] ファイル形式が PNG または JPEG
- [ ] ファイルサイズが 500KB 以下
- [ ] ステータスバーがクリーン
- [ ] サンプルデータが魅力的
- [ ] 順序が適切（最も魅力的なものが最初）
- [ ] App Store Connect にアップロード済み

## ファイル名の例

わかりやすいファイル名を付ける:

```
01-welcome-screen-6.7.png
02-idea-list-6.7.png
03-create-idea-6.7.png
04-idea-detail-6.7.png
05-search-filter-6.7.png
```

## トラブルシューティング

### 問題1: スクリーンショットのサイズが合わない

**原因**: シミュレータのスケールが 100% でない

**対処法**:
1. シミュレータで `Window` → `Physical Size` を選択
2. または `⌘1` を押す

### 問題2: ステータスバーが乱れている

**対処法**:
```bash
xcrun simctl status_bar booted override --time "9:41" --batteryLevel 100 --batteryState charged
```

### 問題3: App Store Connect でアップロードできない

**原因**: ファイルサイズが大きすぎる、または形式が不正

**対処法**:
1. ファイルサイズを確認（500KB以下推奨）
2. PNG または JPEG 形式であることを確認
3. 解像度が正確か確認

### ファイルサイズの削減

```bash
# ImageMagick を使用（インストールが必要）
convert screenshot.png -quality 85 screenshot-compressed.png

# macOS の組み込みツール
sips -s format jpeg screenshot.png --out screenshot.jpg
```

## 次のステップ

スクリーンショットの準備が完了したら、アーカイブとアップロードに進みます。

→ [06-archive-and-upload.md](./06-archive-and-upload.md)

## 参考資料

- [Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
- [App Store Marketing Guidelines](https://developer.apple.com/app-store/marketing/guidelines/)
- [Creating Great Screenshots](https://developer.apple.com/design/human-interface-guidelines/app-icons)
