#!/usr/bin/env python3
"""Import official Servier Medical Art PNG images as transparent, small WEBP chapter artwork.

Source: https://smart.servier.com/; CC BY 4.0 (attribution REQUIRED).
Keep originals in upstream, publish only optimized, properly credited educational derivatives.
"""
from __future__ import annotations
import io
import json
import time
import urllib.request
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter

PREFIX = "https://smart.servier.com/wp-content/uploads/2016/10/"
ROOT = Path("public/nabd-anatomy")
ROOT.mkdir(parents=True, exist_ok=True)
# All URLs below came from the official 'Download the image' link on a Servier image page.
IMAGES = [
 {"id":1, "name":"الجهاز العصبي", "file":"cerveau_tronc.png", "slug":"brain", "page":"https://smart.servier.com/smart_image/smart-brain/"},
 {"id":2, "name":"الجهاز الهيكلي", "file":"squelette_03.png", "slug":"skeleton", "page":"https://smart.servier.com/smart_image/skeleton-face/"},
 {"id":3, "name":"الجهاز العضلي", "file":"Monsieur_muscles_face.png", "slug":"muscles", "page":"https://smart.servier.com/smart_image/musculature-front/"},
 {"id":4, "name":"الجهاز الهضمي", "file":"syst_dig_complet.png", "slug":"digestive", "page":"https://smart.servier.com/smart_image/complete-digestive-apparatus/"},
 {"id":5, "name":"جهاز الدوران", "file":"coeur.png", "slug":"circulation", "page":"https://smart.servier.com/smart_image/heart/"},
 {"id":6, "name":"جهاز التنفس", "file":"poumons_01.png", "slug":"lungs", "page":"https://smart.servier.com/smart_image/lungs-11/"},
 {"id":7, "name":"الجهاز البولي والإخراج", "file":"rein_02.png", "slug":"kidney", "page":"https://smart.servier.com/smart_image/smart-kidney/"},
 {"id":9, "name":"أعضاء الحس", "file":"oeil_02.png", "slug":"eye", "page":"https://smart.servier.com/smart_image/eye-view/"},
 {"id":10, "name":"الإفراز", "file":"thyroide_face.png", "slug":"thyroid", "page":"https://smart.servier.com/smart_image/thyroid/"},
 {"id":0, "name":"السن - صورة داعمة للجهاز الهضمي", "file":"dent.png", "slug":"tooth", "page":"https://smart.servier.com/smart_image/tooth/"},
]
UA="NABD educational biology app image sync; https://github.com/alians200a-commits/Nbd"
def get_image(src: str) -> Image.Image:
    url=PREFIX+src
    req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0 (compatible; NABD educational asset sync)","Accept":"image/png,image/*;q=0.9"})
    last=None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req,timeout=30) as response:
                raw=response.read(8_000_001)
            if len(raw)>8_000_000: raise ValueError("Oversize PNG")
            with Image.open(io.BytesIO(raw)) as im:
                if im.format!="PNG" or im.width<100 or im.height<100: raise ValueError("Wrong format/size")
                im=im.convert("RGBA")
                print(src,im.size,len(raw),flush=True)
                return im
        except Exception as e:
            last=e
            time.sleep(attempt+1)
    raise RuntimeError(f"Cannot retrieve official Servier image {src}: {last}")

def remove_border_white(im: Image.Image) -> Image.Image:
    """Clear *exterior connected* white only: preserve whitish organs and pale internal details."""
    import collections
    if im.getchannel("A").getextrema()[0]<240:
        return im
    px=im.load()
    w,h=im.size
    # The official PNGs usually already have transparent backgrounds; only floodfill
    # any truly white canvas that touches the outer edges.
    if w*h>4_000_000: return im
    mask=Image.new("L",(w,h),0)
    mp=mask.load()
    q=collections.deque()
    for x in range(w):
        q.append((x,0));q.append((x,h-1))
    for y in range(h):
        q.append((0,y));q.append((w-1,y))
    while q:
        x,y=q.popleft()
        if not (0<=x<w and 0<=y<h) or mp[x,y]: continue
        r,g,b,a=px[x,y]
        if min(r,g,b)<247 or max(r,g,b)-min(r,g,b)>8: continue
        mp[x,y]=255
        q.extend(((x-1,y),(x+1,y),(x,y-1),(x,y+1)))
    im.putalpha(ImageOps.invert(mask))
    return im

def process(im:Image.Image,slug:str) -> tuple[int,int,int]:
    im=remove_border_white(im)
    im=ImageOps.exif_transpose(im)
    bbox=im.getchannel("A").getbbox()
    if not bbox: raise ValueError("No visible image pixels")
    im=im.crop(bbox)
    im.thumbnail((472,472),Image.Resampling.LANCZOS)
    # Transparent square canvas lets every chapter image align consistently in the same cards.
    square=Image.new("RGBA",(512,512),(0,0,0,0))
    square.alpha_composite(im,((512-im.width)//2,(512-im.height)//2))
    out=ROOT/(slug+".webp")
    square.save(out,"WEBP",quality=86,method=6)
    if out.stat().st_size>400_000: raise ValueError(f"WebP too big: {slug}")
    with Image.open(out) as chk:
        if chk.size!=(512,512): raise ValueError("WEBP decode failed")
    return im.width,im.height,out.stat().st_size

def main():
    manifest=[]
    for item in IMAGES:
        im=get_image(item["file"])
        w,h,size=process(im,item["slug"])
        manifest.append({**item,"file":"nabd-anatomy/"+item["slug"]+".webp","original":PREFIX+item["file"],"dimensions":[w,h],"size":size,"credit":"Servier Medical Art","license":"CC BY 4.0"})
        print("READY",item["slug"],size,flush=True)
    (ROOT/"attribution.json").write_text(json.dumps({
        "source":"Servier Medical Art (Les Laboratoires Servier)",
        "website":"https://smart.servier.com/",
        "license":"Creative Commons Attribution 4.0 International (CC BY 4.0)",
        "license_url":"https://creativecommons.org/licenses/by/4.0/",
        "modifications":"Resized, externally cropped and optimized as transparent WebP without changing anatomy",
        "usage":"Educational chapter art; not branding or logos",
        "entries":manifest
    },ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("ALL DONE",len(manifest),"legally sourced visual files",flush=True)

if __name__=="__main__":main()
