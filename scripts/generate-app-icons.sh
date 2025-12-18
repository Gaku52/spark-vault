#!/bin/bash

# Spark Vault アプリアイコン生成スクリプト
# 使い方: ./generate-app-icons.sh <元画像のパス>

set -e

if [ $# -eq 0 ]; then
    echo "使い方: $0 <元画像のパス>"
    echo "例: $0 ~/Downloads/spark-vault-icon.png"
    exit 1
fi

SOURCE_IMAGE="$1"
ASSETS_DIR="$PWD/ios/App/App/Assets.xcassets/AppIcon.appiconset"

# 元画像の存在確認
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "エラー: 画像ファイルが見つかりません: $SOURCE_IMAGE"
    exit 1
fi

echo "=========================================="
echo "Spark Vault アプリアイコン生成"
echo "=========================================="
echo "元画像: $SOURCE_IMAGE"
echo "出力先: $ASSETS_DIR"
echo ""

# 各サイズのアイコンを生成（配列を使わない方法）
generate_icon() {
    local filename="$1"
    local size="$2"
    local output_path="$ASSETS_DIR/$filename"

    echo "生成中: $filename (${size}x${size})"

    sips -z "$size" "$size" "$SOURCE_IMAGE" --out "$output_path" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "✓ 完了: $filename"
    else
        echo "✗ エラー: $filename の生成に失敗しました"
    fi
}

# 必要なサイズごとに生成
generate_icon "AppIcon-60@2x.png" 120
generate_icon "AppIcon-60@3x.png" 180
generate_icon "AppIcon-76@1x.png" 76
generate_icon "AppIcon-76@2x.png" 152
generate_icon "AppIcon-83.5@2x.png" 167
generate_icon "AppIcon-512@2x.png" 1024

echo ""
echo "=========================================="
echo "すべてのアイコンを生成しました！"
echo "=========================================="
echo ""
echo "次のステップ:"
echo "1. Xcodeでプロジェクトを開く"
echo "2. Assets.xcassets > AppIcon でアイコンを確認"
echo "3. ビルドして確認"
