#!/bin/bash
FILES=(
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_01_1771808950727.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_02_1771808986344.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_03_1771808989688.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_04_1771808992787.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_05_1771809022259.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_06_1771809055652.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_07_1771809097038.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_08_1771809105639.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_09_1771809114331.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_10_1771809122999.png"
"/Users/haeseong/.gemini/antigravity/brain/74e52d2c-9cbe-43f8-8a56-8fbfb63d8b08/frame_11_1771809126201.png"
)

# Create input list for ffmpeg with durations
echo "file '${FILES[0]}'" > input.txt
echo "duration 1.0" >> input.txt
echo "file '${FILES[1]}'" >> input.txt
echo "duration 0.8" >> input.txt
echo "file '${FILES[2]}'" >> input.txt
echo "duration 0.8" >> input.txt
echo "file '${FILES[3]}'" >> input.txt
echo "duration 0.8" >> input.txt
echo "file '${FILES[4]}'" >> input.txt
echo "duration 1.5" >> input.txt
echo "file '${FILES[5]}'" >> input.txt
echo "duration 0.5" >> input.txt
echo "file '${FILES[6]}'" >> input.txt
echo "duration 0.5" >> input.txt
echo "file '${FILES[7]}'" >> input.txt
echo "duration 0.5" >> input.txt
echo "file '${FILES[8]}'" >> input.txt
echo "duration 0.5" >> input.txt
echo "file '${FILES[9]}'" >> input.txt
echo "duration 1.5" >> input.txt
echo "file '${FILES[10]}'" >> input.txt
echo "duration 2.0" >> input.txt
# Last frame duration needs to be repeated or handled carefully in ffmpeg concat
echo "file '${FILES[10]}'" >> input.txt

ffmpeg -f concat -safe 0 -i input.txt -vf "scale=1024:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -y /Users/haeseong/Desktop/Developing/metasurface-designer/metasurface_demo.gif
