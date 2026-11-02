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
# the arm (its outline and the cream inside it). Rebuild them from the outline
# the artist drew either side of the grip:
#   1. sample the outline in polar coordinates around the paw (inner and outer
#      edge radius per angle, sub-pixel, from the untouched artwork),
#   2. fit a smooth curve through the stroke's centre line and its width on both
#      sides of the gap and bridge the hidden stretch with it — the fit matches
#      the drawn edge to ~0.1 px at the hand-off, so there is no step,
#   3. paint ink / cream / transparency from that curve with the same edge
#      anti-aliasing as the art, blending in over a few degrees, and fill the
#      rest of what the grip covered inside the paw with the paw's cream.
lost = remove & opaque
dark = (rgb.sum(axis=2) < 200) & opaque
ends = dark & ndi.binary_dilation(brown, iterations=4)
ey, ex = np.where(ends)
CROSS = (float(ex.mean()), float(ey.mean()))     # middle of the gap in the outline
WIN = 240
x0, x1 = int(CROSS[0]) - WIN, int(CROSS[0]) + WIN
y0, y1 = int(CROSS[1]) - WIN, int(CROSS[1]) + WIN
sl = (slice(y0, y1), slice(x0, x1))

# polar centre: circle fitted to the paw's outer edge near the crossing
sub = body_alpha[sl]
local_r = np.hypot(X[sl] - CROSS[0], Y[sl] - CROSS[1])
outer = sub & ~ndi.binary_erosion(sub) & ndi.binary_dilation(~opaque[sl], iterations=2)
py_, px_ = np.where(outer & (local_r > 40) & (local_r < 160))
pts = np.stack([px_ + x0, py_ + y0], 1).astype(float)
for _ in range(5):
    M = np.stack([pts[:, 0], pts[:, 1], np.ones(len(pts))], 1)
    D_, E_, F_ = np.linalg.lstsq(M, -(pts ** 2).sum(1), rcond=None)[0]
    ccx, ccy = -D_ / 2, -E_ / 2
    crad = np.sqrt(ccx ** 2 + ccy ** 2 - F_)
    resid = np.abs(np.hypot(pts[:, 0] - ccx, pts[:, 1] - ccy) - crad)
    pts = pts[resid < max(4.0, np.percentile(resid, 80))]

# 1: radial edge profile of the outline, skipping any ray the grip touches
A0 = np.where(body_alpha, alpha / 255.0, 0.0)
L0 = rgb.mean(axis=2) / 255.0
th = np.arange(90.0, 290.0, 0.25)
rs = np.arange(max(5.0, crad - 90), crad + 50, 0.1)
r_in = np.full(len(th), np.nan); r_out = r_in.copy()
xing = lambda v, j: rs[j - 1] + (v[j - 1] - 0.5) / (v[j - 1] - v[j]) * (rs[j] - rs[j - 1])
for i, t in enumerate(np.radians(th)):
    xs, ys = ccx + rs * np.cos(t), ccy + rs * np.sin(t)
    A = ndi.map_coordinates(A0, [ys, xs], order=1)
    Lm = ndi.map_coordinates(L0, [ys, xs], order=1)
    Lo = ndi.map_coordinates(lost.astype(float), [ys, xs], order=1) > 0
    ink = (Lm < 0.5) & (A > 0.5)
    if not ink.any():
        continue
    ji = int(np.argmax(ink))
    after = np.where((A < 0.5) & (np.arange(len(rs)) > ji))[0]
    if ji == 0 or not len(after):
        continue
    jo = int(after[0])
    if Lo[max(0, ji - 60):jo + 60].any() or Lm[ji - 1] < 0.5 or A[ji - 1] < 0.5:
        continue
    r_in[i], r_out[i] = xing(Lm, ji), xing(A, jo)
okp = ~np.isnan(r_in)
near_cross = np.degrees(np.arctan2(CROSS[1] - ccy, CROSS[0] - ccx)) % 360
gap_th = th[~okp & (np.abs(th - near_cross) < 40)]
G0, G1 = float(gap_th.min()), float(gap_th.max())

# 2: smooth bridge (centre line cubic, width linear) fitted 20° either side
SPAN = 20.0
fit = okp & (th > G0 - SPAN) & (th < G1 + SPAN)
tm = (G0 + G1) / 2
pc = np.polyfit(th[fit] - tm, ((r_in + r_out) / 2)[fit], 3)
pw = np.polyfit(th[fit] - tm, (r_out - r_in)[fit], 1)
STROKE = float(np.polyval(pw, 0))

# 3: paint it
rr = np.hypot(X[sl] - ccx, Y[sl] - ccy)
tt = np.degrees(np.arctan2(Y[sl] - ccy, X[sl] - ccx)) % 360
rc = np.polyval(pc, tt - tm); hw = np.polyval(pw, tt - tm) / 2
ri_, ro_ = rc - hw, rc + hw
cover = np.clip(ro_ - rr + 0.5, 0, 1)
inkc = np.clip(rr - ri_ + 0.5, 0, 1) * cover
paw = opaque & ~dark & (L0 > 0.9)
CREAM = np.median(rgb[sl][paw[sl] & (rr < crad - 40) & ~lost[sl]], axis=0)
FEATHER = 4.0
ang = np.clip(np.minimum(tt - (G0 - FEATHER), (G1 + FEATHER) - tt) / FEATHER, 0, 1)
ang = 0.5 - 0.5 * np.cos(np.pi * ang)               # smooth 0→1 ramp into the gap
w = ang * ((rr > ri_ - 10) & (rr < ro_ + 6))

# everything else the grip covered inside the paw → cream
done = body_alpha.copy()
done[sl] |= (w > 0) & (cover > 0.5)
inside = ndi.binary_fill_holes(done)
fill = (lost & inside)[sl] & (w == 0)

body = im.astype(np.uint8).copy()
body[~body_alpha] = 0
win = body[sl].astype(float)
a_old = win[..., 3:] / 255.0
pre_old = win[..., :3] * a_old                        # premultiplied
pre_new = ((1 - inkc) * cover)[..., None] * CREAM
a_new = cover[..., None]
w_c = w[..., None]
a = w_c * a_new + (1 - w_c) * a_old
pre = w_c * pre_new + (1 - w_c) * pre_old
win[..., :3] = np.where(a > 0, pre / np.maximum(a, 1e-6), 0)
win[..., 3] = a[..., 0] * 255
win[fill, :3] = CREAM; win[fill, 3] = 255
touch = (w > 0) | fill                                # leave every other pixel as drawn
body_win = body[sl]
body_win[touch] = np.clip(np.round(win[touch]), 0, 255).astype(np.uint8)

print('patch: gap %.1f°–%.1f°, stroke %.2f px, paw r %.1f' % (G0, G1, STROKE, crad))

new_alpha = body[..., 3] > 0

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
