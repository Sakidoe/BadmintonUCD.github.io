/**
 * Hero illustration: the club's cow mascot smashing a shuttle, built from
 * pixel layers of the original artwork (public/img/hero/, cut by
 * scripts/cut_cow.py → src/hero/cowLayers.ts).
 *
 * The scene is a 1600×900 SVG. Groups the animation drives (by id):
 *   #cowPose  – whole cow; origin at the feet (lean / jump / squash).
 *               Pose angles are in the artwork's frame; the mirror flips them.
 *   #racket   – racket only; origin at the grip so it swings in the paw
 *   #swoosh   – the blue motion arcs from the artwork (fades in on the swing)
 *   #shuttle  – origin at the cork, "pointing" in the +x direction
 *   #burst    – white flash at the contact point
 *   .spark    – the artwork's yellow sparkles, scattered on impact
 */
import { cow } from './cowLayers';

export interface Layout {
  /** art px → scene units */
  scale: number;
  /** where the art's (0,0) lands in the scene */
  tx: number;
  ty: number;
}

/**
 * Cow placement. The artwork is mirrored (scale(-1, 1)) so the racket is on
 * the cow's right and the smash travels left → right across the screen.
 * Bottom-left on wide screens, bottom-centre on phones.
 * Art x maps to scene x as: tx - x * scale.
 */
export function layoutFor(aspect: number): Layout {
  // The SVG uses `xMinYMax slice`, so scene x=0 is always the left edge of the
  // viewport and y=900 the bottom. Only this much of the 1600 width is visible:
  const visibleW = Math.min(1600, 900 * aspect);
  if (aspect < 0.8) {
    const scale = 0.22;
    return { scale, tx: visibleW / 2 + cow.feet.x * scale, ty: 940 - cow.feet.y * scale };
  }
  const scale = 0.46;
  return { scale, tx: 24 + (cow.body.x + cow.body.w) * scale, ty: 905 - cow.feet.y * scale };
}

/** Visible scene width for the current viewport (see layoutFor). */
export const visibleSceneWidth = (aspect: number): number => Math.min(1600, 900 * aspect);

/** Racket head centre in scene units for a given cow pose (used as the contact point). */
export function headCenterInScene(
  L: Layout,
  bodyRotDeg: number,
  bodyDx: number,
  bodyDy: number,
): { x: number; y: number } {
  const r = (bodyRotDeg * Math.PI) / 180;
  const px = cow.headCenter.x - cow.feet.x;
  const py = cow.headCenter.y - cow.feet.y;
  const rx = px * Math.cos(r) - py * Math.sin(r);
  const ry = px * Math.sin(r) + py * Math.cos(r);
  return {
    x: L.tx - (cow.feet.x + rx + bodyDx) * L.scale,
    y: L.ty + (cow.feet.y + ry + bodyDy) * L.scale,
  };
}

const img = (l: { src: string; x: number; y: number; w: number; h: number }, ox = 0, oy = 0) =>
  `<image href="${l.src}" x="${l.x - ox}" y="${l.y - oy}" width="${l.w}" height="${l.h}"/>`;

export function rallySceneSVG(L: Layout): string {
  const { feet, pivot, body, racket, swoosh, shuttle, shuttleCork, shuttleAngle, sparkles } = cow;

  const sparks = sparkles
    .slice(0, 4)
    .map(
      (s) =>
        `<g class="spark" opacity="0"><image href="${s.src}" x="${-s.w / 2}" y="${-s.h / 2}" width="${s.w}" height="${s.h}"/></g>`,
    )
    .join('');

  return `
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMinYMax slice" role="img"
     aria-label="The club's cow mascot smashing a shuttlecock">

  <!-- ── Shuttlecock: cork at origin, cork-first along +x ── -->
  <g id="shuttle" transform="translate(-300 60)">
    <g id="speed" opacity="0">
      <line x1="-60" y1="-14" x2="-130" y2="-14" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
      <line x1="-50" y1="0" x2="-150" y2="0" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".85"/>
      <line x1="-60" y1="14" x2="-120" y2="14" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
    </g>
    <g transform="rotate(${-shuttleAngle}) scale(${L.scale * 1.15}) translate(${-shuttleCork.x} ${-shuttleCork.y})">
      ${img(shuttle)}
    </g>
  </g>

  <!-- ── Cow ── -->
  <g id="cow" transform="translate(${L.tx} ${L.ty}) scale(${-L.scale} ${L.scale})">
    <g id="cowPose" transform="translate(${feet.x} ${feet.y})">
      <g transform="translate(${-feet.x} ${-feet.y})">
        <g id="swoosh" opacity="0">${img(swoosh)}</g>
        ${img(body)}
        <g id="racket" transform="translate(${pivot.x} ${pivot.y})">
          ${img(racket, pivot.x, pivot.y)}
        </g>
      </g>
    </g>
  </g>

  <!-- ── Impact ── -->
  <g id="burst" opacity="0">
    <circle id="burstRing" r="60" fill="none" stroke="#ffffff" stroke-width="10"/>
    <circle id="burstCore" r="34" fill="#ffffff"/>
  </g>
  <g id="sparks">${sparks}</g>
</svg>`;
}
