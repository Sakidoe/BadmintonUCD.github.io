/**
 * Scroll-driven hero animation — the cow smashes the shuttle.
 *
 * The .hero section is 320vh tall with a sticky 100vh stage inside it, so the
 * stage stays on screen while the user scrolls ~2 screens. GSAP ScrollTrigger
 * scrubs one timeline (0 → 1) across that distance.
 *
 * Beats (fractions of the scroll):
 *   0.00–0.38  shuttle drops in from above; cow crouches, racket winds down
 *   0.30–0.40  cow jumps and whips the racket up; contact at 0.40
 *   0.40–0.55  small flash + a few sparkles; intro copy is gone,
 *              the banner photo behind everything brightens
 *   0.40–0.80  shuttle rockets up and to the right with speed lines
 *   0.55–1.00  punchline + CTA hold; the stage fades into the page
 *
 * SVG groups are positioned by writing their `transform` attribute directly
 * (translate + rotate + scale about the group's own origin).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cow } from './cowLayers';
import { headCenterInScene, layoutFor, rallySceneSVG, visibleSceneWidth } from './rallyScene';

gsap.registerPlugin(ScrollTrigger);

const HIT = 0.4; // fraction of the timeline where contact happens

/** Cow poses in the artwork's frame (art units / degrees). dy < 0 = up. */
const HIT_POSE = { rot: -9, dx: -40, dy: -230 }; // airborne at contact
const WINDUP_POSE = { rot: 8, dx: 30, dy: 40 }; // crouched, leaning back

interface Pose {
  x: number;
  y: number;
  rot: number;
  /** uniform scale — setting it sets both scaleX and scaleY */
  scale: number;
  scaleX: number;
  scaleY: number;
}

/** Binds a plain object to an SVG element's transform attribute. */
function poseFor(el: Element | null, initial: Partial<Pose>): Pose {
  const pose = { x: 0, y: 0, rot: 0, scaleX: 1, scaleY: 1 } as Pose;
  Object.defineProperty(pose, 'scale', {
    get: () => pose.scaleX,
    set: (v: number) => {
      pose.scaleX = v;
      pose.scaleY = v;
    },
    enumerable: false,
  });
  Object.assign(pose, initial);
  const apply = () => {
    el?.setAttribute(
      'transform',
      `translate(${pose.x.toFixed(2)} ${pose.y.toFixed(2)}) rotate(${pose.rot.toFixed(2)}) scale(${pose.scaleX.toFixed(3)} ${pose.scaleY.toFixed(3)})`,
    );
  };
  apply();
  Object.defineProperty(pose, '__apply', { value: apply, enumerable: false });
  return pose;
}

const applyPose = (p: Pose) => (p as unknown as { __apply: () => void }).__apply();

export function initHero(): void {
  const sceneHost = document.querySelector<HTMLElement>('.hero__scene');
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!sceneHost || !hero) return;

  const aspect = window.innerWidth / window.innerHeight;
  const L = layoutFor(aspect);
  const visW = visibleSceneWidth(aspect);
  sceneHost.innerHTML = rallySceneSVG(L);

  const q = (sel: string) => sceneHost.querySelector<SVGElement>(sel);

  // Where the racket head is at the instant of contact → the shuttle aims here.
  const contact = headCenterInScene(L, HIT_POSE.rot, HIT_POSE.dx, HIT_POSE.dy);
  // Drops in from above the cow, leaves toward the top-right corner.
  const shuttleStart = { x: contact.x - 260, y: -160, rot: 80 };
  const shuttleEnd = { x: visW + 300, y: -260, rot: -34 };

  const cowPose = poseFor(q('#cowPose'), { x: cow.feet.x, y: cow.feet.y });
  const racket = poseFor(q('#racket'), { x: cow.pivot.x, y: cow.pivot.y });
  const shuttle = poseFor(q('#shuttle'), shuttleStart);
  const burst = poseFor(q('#burst'), { x: contact.x, y: contact.y, scale: 0 });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    // Static composed frame: shuttle in flight, cow ready.
    shuttle.x = contact.x - 120;
    shuttle.y = contact.y - 260;
    shuttle.rot = 70;
    applyPose(shuttle);
    return;
  }

  const copy = document.querySelector<HTMLElement>('.hero__copy');
  const punch = document.querySelector<HTMLElement>('.hero__punch');
  const hint = document.querySelector<HTMLElement>('.hero__hint');
  const svg = sceneHost.querySelector('svg');
  const photo = document.querySelector<HTMLElement>('.hero__bg img');
  const veil = document.querySelector<HTMLElement>('.hero__veil');
  const fade = document.querySelector<HTMLElement>('.hero__fade');

  gsap.set('#burst', { opacity: 0 });
  if (photo) gsap.set(photo, { scale: 1.08, transformOrigin: '50% 40%' });
  if (fade) gsap.set(fade, { opacity: 0 });
  if (punch) gsap.set(punch, { opacity: 0, y: 40 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
    },
  });

  const onS = { onUpdate: () => applyPose(shuttle) };
  const onR = { onUpdate: () => applyPose(racket) };
  const onC = { onUpdate: () => applyPose(cowPose) };
  const onB = { onUpdate: () => applyPose(burst) };

  // 1. Shuttle drops in from above ----------------------------------------
  tl.to(shuttle, { x: contact.x, duration: HIT, ease: 'power1.out', ...onS }, 0)
    .to(shuttle, { y: contact.y, duration: HIT, ease: 'power1.in', ...onS }, 0)
    .to(shuttle, { rot: 95, duration: HIT, ease: 'power1.in', ...onS }, 0);

  // Cow winds up: crouches, leans back, racket drops
  tl.to(
    cowPose,
    {
      rot: WINDUP_POSE.rot,
      x: cow.feet.x + WINDUP_POSE.dx,
      y: cow.feet.y + WINDUP_POSE.dy,
      scaleX: 1.04,
      scaleY: 0.92,
      duration: 0.3,
      ease: 'power1.inOut',
      ...onC,
    },
    0,
  ).to(racket, { rot: -48, duration: 0.3, ease: 'power1.inOut', ...onR }, 0);

  // …then jumps and whips the racket up through contact
  tl.to(
    cowPose,
    {
      rot: HIT_POSE.rot,
      x: cow.feet.x + HIT_POSE.dx,
      y: cow.feet.y + HIT_POSE.dy,
      scaleX: 0.98,
      scaleY: 1.06,
      duration: 0.1,
      ease: 'power2.out',
      ...onC,
    },
    0.3,
  )
    .to(racket, { rot: 0, duration: 0.1, ease: 'power3.in', ...onR }, 0.3)
    .to(racket, { rot: 16, duration: 0.12, ease: 'power2.out', ...onR }, HIT)
    .to('#swoosh', { opacity: 1, duration: 0.06 }, 0.33)
    .to('#swoosh', { opacity: 0, duration: 0.1 }, HIT + 0.04);

  // …hangs for a beat, then lands with a little squash
  tl.to(
    cowPose,
    { rot: 0, x: cow.feet.x, y: cow.feet.y, scaleX: 1.03, scaleY: 0.96, duration: 0.2, ease: 'power2.in', ...onC },
    HIT + 0.1,
  )
    .to(cowPose, { scaleX: 1, scaleY: 1, duration: 0.1, ease: 'power2.out', ...onC }, HIT + 0.3)
    .to(racket, { rot: 4, duration: 0.25, ease: 'power2.out', ...onR }, HIT + 0.12);

  // Banner photo: slow drift the whole way, then the cream wash thins on impact
  if (photo) tl.to(photo, { scale: 1.0, duration: 1, ease: 'none' }, 0);
  if (veil) tl.to(veil, { opacity: 0.55, duration: 0.2, ease: 'power2.out' }, HIT);
  if (fade) tl.to(fade, { opacity: 1, duration: 0.15, ease: 'power1.in' }, 0.85);

  // Intro copy fades as the hit approaches; scroll hint goes early
  if (copy) tl.to(copy, { opacity: 0, y: -50, duration: 0.12, ease: 'power2.in' }, HIT - 0.14);
  if (hint) tl.to(hint, { opacity: 0, duration: 0.08 }, 0.05);

  // 2. Impact --------------------------------------------------------------
  tl.to(burst, { scale: 1, duration: 0.04, ease: 'power3.out', ...onB }, HIT)
    .to('#burst', { opacity: 1, duration: 0.02 }, HIT)
    .to('#burstRing', { scale: 1.8, opacity: 0, transformOrigin: '50% 50%', duration: 0.12, ease: 'power2.out' }, HIT)
    .to('#burstCore', { scale: 0.2, opacity: 0, transformOrigin: '50% 50%', duration: 0.05 }, HIT)
    .to('#burst', { opacity: 0, duration: 0.08 }, HIT + 0.06);

  if (svg) {
    tl.to(svg, { x: -8, y: 5, duration: 0.012 }, HIT)
      .to(svg, { x: 6, y: -4, duration: 0.012 }, HIT + 0.012)
      .to(svg, { x: -3, y: 2, duration: 0.012 }, HIT + 0.024)
      .to(svg, { x: 0, y: 0, duration: 0.012 }, HIT + 0.036);
  }

  // The artwork's sparkles burst out from the contact point
  const sparks = sceneHost.querySelectorAll<SVGGElement>('.spark');
  sparks.forEach((piece, i) => {
    const n = sparks.length;
    // fan out toward the top-right, the direction the bird leaves in
    const angle = -Math.PI * 0.85 + (i / (n - 1)) * Math.PI * 0.7;
    const dist = 150 + (i % 2) * 60;
    const p = poseFor(piece, { x: contact.x, y: contact.y, scale: L.scale * 0.6 });
    const onP = { onUpdate: () => applyPose(p) };
    tl.to(piece, { opacity: 1, duration: 0.01 }, HIT)
      .to(
        p,
        {
          x: contact.x + Math.cos(angle) * dist,
          y: contact.y + Math.sin(angle) * dist + 40,
          rot: (i % 2 ? 1 : -1) * (90 + i * 25),
          scale: L.scale * 1.5,
          duration: 0.24,
          ease: 'power2.out',
          ...onP,
        },
        HIT,
      )
      .to(piece, { opacity: 0, duration: 0.1 }, HIT + 0.14);
  });

  // 3. Shuttle rockets away ------------------------------------------------
  tl.to(shuttle, { rot: shuttleEnd.rot, duration: 0.004, ...onS }, HIT)
    .to('#speed', { opacity: 1, duration: 0.03 }, HIT)
    .to(shuttle, { x: shuttleEnd.x, y: shuttleEnd.y, duration: 0.4, ease: 'power1.out', ...onS }, HIT)
    .to('#speed', { opacity: 0, duration: 0.15 }, HIT + 0.25);

  // 4. Punchline -----------------------------------------------------------
  if (punch) tl.to(punch, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, HIT + 0.1);
}
