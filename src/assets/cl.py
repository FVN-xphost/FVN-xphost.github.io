import numpy as np
from PIL import Image
from pathlib import Path

def trim_transparent(image_path, output_path=None, threshold=10):
    """
    裁剪图像四周 Alpha 值 <= threshold 的透明区域。
    如果 output_path 为 None，则覆盖原文件。
    """
    # 打开图像并转换为 RGBA（确保有 Alpha 通道）
    img = Image.open(image_path).convert('RGBA')
    img_array = np.array(img)

    # 提取 Alpha 通道
    alpha = img_array[:, :, 3]

    # 找到所有 Alpha > threshold 的像素
    mask = alpha > threshold
    coords = np.where(mask)
    if len(coords[0]) == 0:
        # 图像完全透明，无法裁剪，可选择跳过或保留原图
        print(f"警告：{image_path} 中没有不透明像素，跳过。")
        if output_path:
            img.save(output_path)
        else:
            img.save(image_path)
        return

    # 计算边界
    min_row, max_row = coords[0].min(), coords[0].max()
    min_col, max_col = coords[1].min(), coords[1].max()

    # 裁剪 (left, upper, right, lower)
    cropped_img = img.crop((min_col, min_row, max_col + 1, max_row + 1))

    # 保存
    if output_path is None:
        output_path = image_path
    cropped_img.save(output_path)
    print(f"已处理: {image_path} -> {output_path}")

def batch_trim_transparent(root_dir, output_dir=None, threshold=10):
    """
    递归处理 root_dir 下所有 PNG 文件。
    如果 output_dir 不为 None，则在 output_dir 中保持原目录结构保存裁剪后的图像。
    """
    root_path = Path(root_dir)
    png_files = list(root_path.rglob('*.png'))

    for src_path in png_files:
        if output_dir:
            # 计算相对路径，在输出目录中重建
            rel_path = src_path.relative_to(root_path)
            dst_path = Path(output_dir) / rel_path
            dst_path.parent.mkdir(parents=True, exist_ok=True)
        else:
            dst_path = None  # 覆盖原文件

        try:
            trim_transparent(src_path, dst_path, threshold)
        except Exception as e:
            print(f"处理 {src_path} 时出错: {e}")

if __name__ == "__main__":
    # 示例用法
    input_folder = input("输入文件夹：")            # 替换为你的图像文件夹路径
    output_folder = input("输出文件夹：")           # 输出文件夹（设为 None 则覆盖原文件）
    if output_folder == "": output_folder = None
    batch_trim_transparent(input_folder, output_folder, threshold=10)