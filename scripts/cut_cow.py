"""Cut the cow illustration into animatable layers.
Outputs PNGs into public/img/hero/ and a TS constants file src/hero/cowLayers.ts
(all coordinates in the original 2100x2100 art space)."""
import json, os
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi

SRC = os.path.join(os.path.dirname(__file__), 'cow-source.png')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public/img/hero')
TS = os.path.join(ROOT, 'src/hero/cowLayers.ts')
os.makedirs(OUT, exist_ok=True)

im = np.array(Image.open(SRC).convert('RGBA')).astype(np.int16)
H, W = im.shape[:2]
rgb, alpha = im[..., :3], im[..., 3]
opaque = alpha > 40
Y, X = np.mgrid[0:H, 0:W]

def near(color, tol):
    d = np.abs(rgb - np.array(color)).sum(axis=2)
    return (d < tol) & opaque

BLUE, GRAY, YELLOW = (158, 206, 238), (228, 235, 240), (255, 182, 55)
BROWN1, BROWN2 = (188, 124, 101), (170, 100, 70)
blue = near(BLUE, 70)
gray = near(GRAY, 45)
yellow = near(YELLOW, 90) & ~((X > 1600) & (Y > 880) & (Y < 1320))  # not the boba cup
brown = (near(BROWN1, 70) | near(BROWN2, 70)) & (X > 540) & (X < 900) & (Y > 1260) & (Y < 1520)

racket_region = (X < 780) & (Y > 860) & (Y < 1425)
frame = blue & racket_region
strings = gray & (X < 600) & (Y > 930) & (Y < 1390)
# fill the head interior so gaps between strings stay inside the racket layer
head = ndi.binary_fill_holes(ndi.binary_dilation(frame & (X < 620), iterations=3))
racket_mask = frame | (strings & head) | brown
racket_mask = ndi.binary_dilation(racket_mask, iterations=2) & opaque
racket_mask &= ~(rgb.sum(axis=2) < 200)  # the racket has no black — drop bits of the arm outline

swoosh = blue & (X < 720) & (Y > 1425)
swoosh = ndi.binary_dilation(swoosh, iterations=2) & opaque
shuttle = (blue | gray | near((255, 255, 255), 12)) & (X > 1540) & (Y < 540)  # pure white only — the cow's cream ear lives here too
shuttle = ndi.binary_dilation(shuttle, iterations=2) & opaque & ~yellow
shuttle &= ~(rgb.sum(axis=2) < 200)  # no black outline fragments from the ear
_lab, _n = ndi.label(shuttle)
if _n > 1:  # keep only the shuttle itself, not stray specks
    _sizes = ndi.sum(np.ones_like(_lab), _lab, range(1, _n + 1))
    shuttle = _lab == (int(np.argmax(_sizes)) + 1)
sparkle = ndi.binary_dilation(yellow, iterations=2) & opaque

def save_layer(name, mask):
    ys, xs = np.where(mask)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    layer = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    sub = im[y0:y1, x0:x1].astype(np.uint8)
    m = mask[y0:y1, x0:x1]
    layer[m] = sub[m]
    Image.fromarray(layer).save(f'{OUT}/{name}.png', optimize=True)
    return {'src': f'/img/hero/{name}.png', 'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)}

meta = {}
meta['racket'] = save_layer('cow-racket', racket_mask)
meta['swoosh'] = save_layer('cow-swoosh', swoosh)
meta['shuttle'] = save_layer('cow-shuttle', shuttle)

# ── sparkle pieces (connected components) ──
lab, n = ndi.label(sparkle)
pieces = []
for i in range(1, n + 1):
    m = lab == i
    if m.sum() < 400:
        continue
    pieces.append(save_layer(f'cow-spark-{len(pieces)}', m))
meta['sparkles'] = pieces

# ── body: everything else, with the handle hole repaired ──
remove = racket_mask | swoosh | shuttle | sparkle
body_alpha = opaque & ~remove
# Where the grip crosses the paw, the racket layer takes pixels that belong to
# the arm. Repair it geometrically:
#   1. find where the handle cuts the arm's outline,
#   2. bridge that notch with a disc closing, which meets the surrounding edge
#      tangentially — the channel the handle carved inside the paw then becomes
#      an enclosed hole, so filling holes closes it too,
#   3. re-render outline + fill from the signed distance field of the completed
#      silhouette, giving the stroke the same weight and anti-aliasing as the
#      rest of the artwork.
# Only pixels the racket actually removed get repainted, so nothing the artist
# drew is touched and the repair leaves no seam.
dark = (rgb.sum(axis=2) < 200) & opaque
ends = dark & ndi.binary_dilation(brown, iterations=4)
ey, ex = np.where(ends)
CROSS = (int(ex.mean()), int(ey.mean()))     # middle of the gap in the outline
WIN, GUARD = 240, 78

x0, x1 = CROSS[0] - WIN, CROSS[0] + WIN
y0, y1 = CROSS[1] - WIN, CROSS[1] + WIN
sl = (slice(y0, y1), slice(x0, x1))
local_r = np.hypot(X[sl] - CROSS[0], Y[sl] - CROSS[1])

# stroke weight, measured off the artwork itself either side of the gap
probe = dark[sl] & ~ndi.binary_dilation(brown, iterations=10)[sl] & (local_r < 150)
STROKE = 2 * np.percentile(ndi.distance_transform_edt(probe)[probe], 97)

# 1 + 2: complete the silhouette. The arm's edge is convex here, so a disc
# closing would cut a chord across the gap and pull the outline inward; fit the
# real boundary arc instead (robust circle fit, outliers dropped) and complete
# along it. The channel the handle carved inside the paw is then enclosed, so
# filling holes closes it as well.
sub = body_alpha[sl]
edge = sub & ~ndi.binary_erosion(sub)
outer = edge & ndi.binary_dilation(~(opaque[sl] | remove[sl]), iterations=2)
band = outer & (local_r > 40) & (local_r < 130)
py_, px_ = np.where(band)
pts = np.stack([px_ + x0, py_ + y0], 1).astype(float)
for _ in range(4):
    M = np.stack([pts[:, 0], pts[:, 1], np.ones(len(pts))], 1)
    D_, E_, F_ = np.linalg.lstsq(M, -(pts[:, 0] ** 2 + pts[:, 1] ** 2), rcond=None)[0]
    ccx, ccy = -D_ / 2, -E_ / 2
    crad = np.sqrt(ccx ** 2 + ccy ** 2 - F_)
    resid = np.abs(np.hypot(pts[:, 0] - ccx, pts[:, 1] - ccy) - crad)
    keep = resid < max(6.0, np.percentile(resid, 75))
    if keep.sum() < 30:
        break
    pts = pts[keep]
inside = np.hypot(X[sl] - ccx, Y[sl] - ccy) <= crad
bridged = sub | (inside & (local_r < GUARD))
full = body_alpha.copy()
full[sl] = bridged
full = ndi.binary_fill_holes(full)
bridged = full[sl]

# 3: render outline + fill from the signed distance field
d = ndi.distance_transform_edt(bridged) - ndi.distance_transform_edt(~bridged)
cover = np.clip(d + 0.5, 0, 1)
ink = np.clip(STROKE - d + 0.5, 0, 1) * cover
ink_c = ink[..., None]
rebuilt = ink_c * np.array([8.0, 8.0, 8.0]) + (1 - ink_c) * np.array([255.0, 248.0, 236.0])

lost = (remove & opaque & ~body_alpha)[sl] | (bridged & ~sub)
# wide, soft hand-off so any sub-pixel difference in stroke weight between
# the rebuilt band and the artist's leans in gradually instead of stepping
w = np.clip(ndi.gaussian_filter(ndi.binary_dilation(lost, iterations=3).astype(float), 3.6) * 1.55, 0, 1)
w_c = w[..., None]

body = im.astype(np.uint8).copy()
body[~body_alpha] = 0
win = body[sl].astype(float)
win[..., :3] = w_c * rebuilt + (1 - w_c) * win[..., :3]
win[..., 3] = w * cover * 255 + (1 - w) * win[..., 3]
body[sl] = np.clip(win, 0, 255).astype(np.uint8)

new_alpha = body[..., 3] > 0
print('patch: cross', CROSS, 'stroke', round(STROKE, 1), 'px, arc r', round(crad, 1))

ys, xs = np.where(new_alpha)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
Image.fromarray(body[y0:y1, x0:x1]).save(f'{OUT}/cow-body.png', optimize=True)
meta['body'] = {'src': '/img/hero/cow-body.png', 'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)}

# ── anchors ──
by, bx = np.where(brown)
pts = np.stack([bx, by], 1).astype(float)
c = pts.mean(0)
u, s, vt = np.linalg.svd(pts - c, full_matrices=False)
axis = vt[0]
if axis[0] < 0: axis = -axis          # point toward lower-right (grip end)
proj = (pts - c) @ axis
grip_end = c + axis * proj.max()
pivot = c + axis * (proj.max() - 40)   # a little inside the grip end
meta['pivot'] = {'x': float(pivot[0]), 'y': float(pivot[1])}
hy, hx = np.where(strings & head)
meta['headCenter'] = {'x': float(hx.mean()), 'y': float(hy.mean())}
# shuttle cork = solid blue blob in the lower-left of the shuttle region
cork = blue & shuttle & (Y > 380)
cy_, cx_ = np.where(cork)
meta['shuttleCork'] = {'x': float(cx_.mean()), 'y': float(cy_.mean())}
# direction the shuttle points (cork-first): from feather centroid to cork
fy, fx = np.where(shuttle & ~cork)
import math
meta['shuttleAngle'] = math.degrees(math.atan2(cy_.mean() - fy.mean(), cx_.mean() - fx.mean()))
# feet: bottom-centre of body
meta['feet'] = {'x': float(xs.mean()), 'y': float(y1)}
meta['artSize'] = W

with open(TS, 'w') as f:
    f.write('/**\n * Generated by scripts/cut_cow.py — pixel layers of the cow mascot.\n'
            ' * All coordinates are in the original 2100×2100 art space.\n */\n')
    f.write('export interface Layer { src: string; x: number; y: number; w: number; h: number }\n\n')
    f.write('export const cow = ' + json.dumps(meta, indent=2) + ' as const;\n')
print(json.dumps({k: v for k, v in meta.items() if k != 'sparkles'}, indent=1), 'sparkles:', len(pieces))
