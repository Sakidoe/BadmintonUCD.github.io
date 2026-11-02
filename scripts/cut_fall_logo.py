"""Splits scripts/fall-logo-source.png (the brown Davis Open logo) into two clean
assets without the lettering: public/img/art/fall-cow.png and fall-croissant.png.
Lettering is detected by stroke thickness (letters are thick, art outlines are thin)."""
import os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'scripts', 'fall-logo-source.png')
OUT = os.path.join(ROOT, 'public', 'img', 'art')

im = np.array(Image.open(SRC).convert('RGBA'))
a = im[..., 3] > 0
rgb = im[..., :3].astype(int)
dark = a & (np.abs(rgb - np.array([139, 58, 31])).sum(2) < 90)
r = 24
yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
disk = (xx ** 2 + yy ** 2) <= r * r
text = ndi.binary_dilation(ndi.binary_opening(dark, structure=disk), iterations=8)
lab, n = ndi.label(a & ~text, structure=np.ones((3, 3)))
keep_cow = np.zeros_like(a)
keep_cro = np.zeros_like(a)
for i, sl in enumerate(ndi.find_objects(lab), 1):
    m = lab[sl] == i
    sz = int(m.sum())
    top, bot = sl[0].start, sl[0].stop
    cx = (sl[1].start + sl[1].stop) / 2
    if sz < 150:
        continue
    if (top < 765 or bot > 1478) and sz < 20000:
        continue  # crumbs of DAVIS / SPRING OPEN
    if cx < 960 and top < 895 and sz < 8000:
        continue  # bits of the D and A above the cow
    (keep_cow if cx < 960 else keep_cro)[sl][m] = True

def save(mask, name):
    out = im.copy()
    out[~mask] = 0
    o = Image.fromarray(out)
    o = o.crop(o.getbbox())
    o.thumbnail((1000, 1000))
    o.save(os.path.join(OUT, f'{name}.png'), optimize=True)
    print(name, o.size)

save(keep_cow, 'fall-cow')
save(keep_cro, 'fall-croissant')
