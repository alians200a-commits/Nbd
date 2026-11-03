#!/usr/bin/env python3
"""Import the real, animated anatomical heart (photogrammetry) legally from Commons.

Original: DrJanaOfficial, Animated Heart.gif, CC BY-SA 4.0.
Only the two derivative WebP files are licensed CC BY-SA 4.0. Other NABD
source and visual assets retain their own licenses.
"""
from __future__ import annotations
import io
import json
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageChops, ImageSequence, features

SOURCE_PAGE = "https://commons.wikimedia.org/wiki/File:Animated_Heart.gif"
SOURCE_FILE = "https://upload.wikimedia.org/wikipedia/commons/6/62/Animated_Heart.gif"
LICENSE = "https://creativecommons.org/licenses/by-sa/4.0/"
OUT = Path("public/nabd-3d")
ANIM = OUT / "heart-anatomical-motion.webp"
STILL = OUT / "heart-anatomical-still.webp"
CREDIT = OUT / "heart-anatomical-credits.json"

def fetch_gif() -> bytes:
    urls = [
        SOURCE_FILE,
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Animated_Heart.gif",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Animated_Heart.gif/480px-Animated_Heart.gif",
    ]
    failures = []
    for url in urls:
        for attempt in range(2):
            try:
                req = urllib.request.Request(
                    url,
                    headers={"User-Agent": "NABD-Educational-Biology/1.0 (https://github.com/alians200a-commits/Nbd; public educational site)",
                             "Accept": "image/gif,image/*;q=0.9"}
                )
                with urllib.request.urlopen(req, timeout=20) as resp:
                    data = resp.read(10_000_001)
                if not data.startswith((b"GIF89a", b"GIF87a")):
                    raise ValueError(f"Source is not GIF: {data[:20]!r}")
                if len(data) > 10_000_000:
                    raise ValueError("Original GIF unexpectedly large")
                print(f"Downloaded {len(data)} bytes from {url}", flush=True)
                return data
            except Exception as e:
                failures.append(f"{url}: {e}")
                time.sleep(1 + attempt)
    raise RuntimeError("Unable to fetch CC-BY-SA real heart: " + " | ".join(failures))

def main() -> None:
    if not features.check("webp_anim"):
        raise RuntimeError("Pillow in this runner lacks animated WebP support")
    data = fetch_gif()
    with Image.open(io.BytesIO(data)) as gif:
        if gif.format != "GIF" or gif.n_frames < 10:
            raise ValueError(f"Unexpected heart media: {gif.format}, frames={gif.n_frames}")
        print(f"Original heart: {gif.size}, frames={gif.n_frames}", flush=True)
        frames = [frame.copy().convert("RGBA") for frame in ImageSequence.Iterator(gif)]
        durations = [max(30,int(frame.info.get("duration",40))) for frame in ImageSequence.Iterator(gif)]

    # Remove empty surrounding canvas, retaining its transparent background.
    nonempty = []
    for frame in frames:
        alpha = frame.getchannel("A").point(lambda n: 255 if n >= 12 else 0)
        area = alpha.getbbox()
        if area: nonempty.append(area)
    if len(nonempty) < 10:
        raise ValueError("Source animated heart doesn't have usable foreground")
    left = min(a[0] for a in nonempty)
    top = min(a[1] for a in nonempty)
    right = max(a[2] for a in nonempty)
    bottom = max(a[3] for a in nonempty)
    padding = round(max(right-left,bottom-top)*.075)
    left = max(0,left-padding)
    top = max(0,top-padding)
    right = min(frames[0].width,right+padding)
    bottom = min(frames[0].height,bottom+padding)
    crop = (left,top,right,bottom)
    target = 196
    result = []
    for frame in frames:
        cut=frame.crop(crop)
        cut.thumbnail((target,target),Image.Resampling.LANCZOS)
        square=Image.new("RGBA",(target,target),(0,0,0,0))
        square.alpha_composite(cut,((target-cut.width)//2,(target-cut.height)//2))
        result.append(square)

    OUT.mkdir(parents=True,exist_ok=True)
    result[0].save(STILL,"WEBP",quality=87,method=6)
    # Keep the true beating frames; this is not a CSS-scale approximation.
    result[0].save(ANIM,"WEBP",save_all=True,append_images=result[1:],
                   duration=durations,loop=0,quality=78,method=5,kmin=1,kmax=15)
    with Image.open(ANIM) as check:
        if not getattr(check,"is_animated",False) or check.n_frames < 10:
            raise ValueError("Animation frames were lost while converting")
        print(f"Output: {check.n_frames} true-heartbeat frames, {ANIM.stat().st_size} bytes",flush=True)
    with Image.open(STILL) as check:
        if check.mode not in ("RGBA","RGB"): raise ValueError("Invalid static WebP")
    if ANIM.stat().st_size>1_100_000:
        raise ValueError("Logo output too large for mobile app")
    CREDIT.write_text(json.dumps({
        "title":"Animated Heart (photogrammetry, actual pulsation)",
        "author":"DrJanaOfficial",
        "original":SOURCE_PAGE,
        "original_file":SOURCE_FILE,
        "license":"CC BY-SA 4.0",
        "license_url":LICENSE,
        "changes":"Cropped transparent canvas, resized and converted GIF frames to animated WebP; exported a still WebP for reduced motion",
        "files":[ANIM.name,STILL.name],
        "note":"These derivative image files are shared under CC BY-SA 4.0. This license does not apply to other NABD application source files."
    },ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Heart source attribution and license recorded",flush=True)

if __name__=="__main__":
    main()
