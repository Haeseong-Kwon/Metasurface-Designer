import imageio
import numpy as np
import sys
import os
from PIL import Image, ImageDraw

def convert_webp_to_gif(input_path, output_path, bar_height=10, bar_color=(59, 130, 246)): # Blue-500
    print(f"Reading {input_path}...")
    try:
        from PIL import ImageSequence
        img = Image.open(input_path)
        
        # Read all frames with Pillow
        frames_pil = [frame.copy() for frame in ImageSequence.Iterator(img)]
        
        # Extract fps or duration
        # WebP duration is mostly in ms per frame
        duration = img.info.get('duration', 33) 
        fps = 1000.0 / duration if duration > 0 else 30.0
        
        # Convert to numpy arrays for consistency
        frames = [np.array(f.convert('RGB')) for f in frames_pil]
        
        print(f"Loaded {len(frames)} frames. Calculated FPS: {fps:.1f}")
    except Exception as e:
        print(f"Error reading {input_path}: {e}")
        return

    # To optimize GIF size and quality, resize frames if they are too large
    max_width = 1000
    if frames and frames[0].shape[1] > max_width:
        scale_factor = max_width / frames[0].shape[1]
        print(f"Resizing frames by {scale_factor:.2f}x to optimize GIF...")
        new_frames = []
        for frame in frames:
            img = Image.fromarray(frame)
            new_size = (int(img.width * scale_factor), int(img.height * scale_factor))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
            new_frames.append(np.array(img))
        frames = new_frames

    total_frames = len(frames)
    processed_frames = []

    print("Adding progress bar and processing frames...")
    for i, frame in enumerate(frames):
        img = Image.fromarray(frame)
        width, height = img.size
        
        # Calculate progress width
        progress_width = int((i / (total_frames - 1)) * width) if total_frames > 1 else width
        
        # Draw progress bar
        draw = ImageDraw.Draw(img)
        # Background bar (dark)
        draw.rectangle([0, height - bar_height, width, height], fill=(30, 41, 59)) # Slate-800
        # Progress bar (blue)
        draw.rectangle([0, height - bar_height, progress_width, height], fill=bar_color)
        
        processed_frames.append(np.array(img))
    
    # Optional: reduce framerate slightly to save size
    target_fps = min(fps, 15)
    step = int(max(1, fps / target_fps))
    if step > 1:
        print(f"Subsampling frames to reduce size (taking 1 every {step} frames)...")
        processed_frames = processed_frames[::step]
        fps = target_fps

    print(f"Saving to {output_path} (this might take a while)...")
    try:
        # Saving as GIF with optimization
        imageio.mimsave(output_path, processed_frames, fps=fps, loop=0)
        file_size = os.path.getsize(output_path) / (1024 * 1024)
        print(f"Successfully saved {output_path} (Size: {file_size:.2f} MB)")
    except Exception as e:
        print(f"Error saving {output_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_webp_to_gif.py <input.webp> <output.gif>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    convert_webp_to_gif(input_file, output_file)
