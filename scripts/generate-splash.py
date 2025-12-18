#!/usr/bin/env python3
"""
Spark Vault スプラッシュスクリーン生成スクリプト
背景色の上に適切なサイズのアイコンを配置します
"""

import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    print("エラー: Pillow がインストールされていません")
    print("インストール: pip3 install Pillow")
    sys.exit(1)

def add_rounded_corners(image, radius):
    """
    画像に角丸を追加

    Args:
        image: PIL Image
        radius: 角丸の半径（ピクセル）

    Returns:
        角丸を追加したRGBA画像
    """
    # RGBAモードに変換
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    # マスク画像を作成
    mask = Image.new('L', image.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), image.size], radius=radius, fill=255)

    # 角丸マスクを適用
    output = Image.new('RGBA', image.size, (0, 0, 0, 0))
    output.paste(image, (0, 0))
    output.putalpha(mask)

    return output

def add_shadow(icon, shadow_offset=20, shadow_blur=40):
    """
    アイコンに影を追加

    Args:
        icon: PIL Image (RGBA)
        shadow_offset: 影のオフセット
        shadow_blur: 影のぼかし

    Returns:
        影付きの画像
    """
    # 影用のレイヤーを作成（大きめのキャンバス）
    shadow_canvas_size = (
        icon.width + shadow_blur * 2,
        icon.height + shadow_blur * 2
    )
    shadow_layer = Image.new('RGBA', shadow_canvas_size, (0, 0, 0, 0))

    # 影を描画
    shadow = Image.new('RGBA', icon.size, (0, 0, 0, 100))
    shadow.putalpha(icon.split()[3])  # アイコンのアルファチャンネルを使用

    # 影を配置してぼかす
    shadow_x = shadow_blur + shadow_offset
    shadow_y = shadow_blur + shadow_offset
    shadow_layer.paste(shadow, (shadow_x, shadow_y))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(shadow_blur))

    # アイコンを影の上に配置
    icon_x = shadow_blur
    icon_y = shadow_blur
    shadow_layer.paste(icon, (icon_x, icon_y), icon)

    return shadow_layer

def create_splash_screen(icon_path, output_dir, bg_color='#F5F5F7', icon_size=1024):
    """
    スプラッシュスクリーン画像を生成（iOS標準の角丸アイコン＋影付き）

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

    # iOS標準の角丸を追加（約22.37%）
    corner_radius = int(icon_size * 0.2237)
    icon_rounded = add_rounded_corners(icon, corner_radius)

    # 影を追加
    icon_with_shadow = add_shadow(icon_rounded, shadow_offset=10, shadow_blur=30)

    # 3つのスケールで生成
    filenames = [
        'splash-2732x2732-2.png',
        'splash-2732x2732-1.png',
        'splash-2732x2732.png'
    ]

    for filename in filenames:
        # 背景画像を作成
        splash = Image.new('RGB', (splash_size, splash_size), bg_color)

        # アイコン（影付き）を中央に配置
        shadow_canvas_width, shadow_canvas_height = icon_with_shadow.size
        x = (splash_size - shadow_canvas_width) // 2
        y = (splash_size - shadow_canvas_height) // 2

        # アイコンを合成
        splash.paste(icon_with_shadow, (x, y), icon_with_shadow)

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
    print(f"角丸: iOS標準（約22%）")
    print(f"影: あり")
    print(f"背景色: #F5F5F7 (Apple標準グレー)")
    print(f"出力先: {output_dir}")
    print("")

    create_splash_screen(icon_path, output_dir, icon_size=icon_size)

    print("")
    print("==========================================")
    print("スプラッシュスクリーンを生成しました！")
    print("==========================================")
