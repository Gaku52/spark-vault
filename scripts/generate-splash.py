#!/usr/bin/env python3
"""
Spark Vault スプラッシュスクリーン生成スクリプト
背景色の上に適切なサイズのアイコンを配置します
"""

import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("エラー: Pillow がインストールされていません")
    print("インストール: pip3 install Pillow")
    sys.exit(1)

def create_splash_screen(icon_path, output_dir, bg_color='#8b5cf6', icon_size=1024):
    """
    スプラッシュスクリーン画像を生成

    Args:
        icon_path: アイコン画像のパス
        output_dir: 出力ディレクトリ
        bg_color: 背景色（hex）
        icon_size: アイコンのサイズ（ピクセル）
    """
    # 背景サイズ
    splash_size = 2732

    # アイコン画像を読み込み
    icon = Image.open(icon_path)

    # アイコンをリサイズ
    icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)

    # 3つのスケールで生成
    filenames = [
        'splash-2732x2732-2.png',
        'splash-2732x2732-1.png',
        'splash-2732x2732.png'
    ]

    for filename in filenames:
        # 背景画像を作成
        splash = Image.new('RGB', (splash_size, splash_size), bg_color)

        # アイコンを中央に配置
        x = (splash_size - icon_size) // 2
        y = (splash_size - icon_size) // 2

        # アイコンに透明度がある場合は適切に合成
        if icon.mode == 'RGBA':
            splash.paste(icon, (x, y), icon)
        else:
            splash.paste(icon, (x, y))

        # 保存
        output_path = Path(output_dir) / filename
        splash.save(output_path, 'PNG')
        print(f"✓ 生成完了: {filename}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("使い方: python3 generate-splash.py <アイコン画像のパス> [アイコンサイズ]")
        print("例: python3 generate-splash.py icon.png 1024")
        sys.exit(1)

    icon_path = sys.argv[1]
    icon_size = int(sys.argv[2]) if len(sys.argv) > 2 else 1024

    # 出力ディレクトリ
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    output_dir = project_dir / 'ios/App/App/Assets.xcassets/Splash.imageset'

    print("==========================================")
    print("Spark Vault スプラッシュスクリーン生成")
    print("==========================================")
    print(f"アイコン: {icon_path}")
    print(f"アイコンサイズ: {icon_size}x{icon_size}")
    print(f"背景色: #8b5cf6")
    print(f"出力先: {output_dir}")
    print("")

    create_splash_screen(icon_path, output_dir, icon_size=icon_size)

    print("")
    print("==========================================")
    print("スプラッシュスクリーンを生成しました！")
    print("==========================================")
