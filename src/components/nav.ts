/**
 * Floating glass navigation bar.
 * Content comes from src/data/site.ts (navLeft / navCta / navRight).
 */
import { site, type NavLink } from '../data/site';
import { html, $ } from '../lib/html';

const isActive = (href: string): boolean => {
  const path = location.pathname.replace(/index\.html$/, '');
  const target = href.replace(/index\.html$/, '');
  return path === target;
};

const linkList = (links: readonly NavLink[]) =>
  links.map(
    (l) => html`<a class="nav__link${isActive(l.href) ? ' is-active' : ''}" href="${l.href}"
      ${isActive(l.href) ? 'aria-current="page"' : ''}>${l.label}</a>`,
  );

function template() {
  const cta = site.navCta;
  return html`
    <div class="nav-wrap">
      <nav class="nav" aria-label="Main">
        <a class="nav__brand" href="/">
          <span class="nav__brand-mark"><img src="/img/art/cow-mark.png" alt="" /></span>
          <span class="nav__brand-text">${site.shortName}</span>
        </a>

        <div class="nav__links" data-nav-group>
          <span class="nav__pill" aria-hidden="true"></span>
          ${linkList(site.navLeft)}
        </div>

        <a class="nav__cta" href="${cta.href}">
          <span class="nav__cta-dot" aria-hidden="true"></span>
          <span class="nav__cta-label-long">${cta.label}</span>
          <span class="nav__cta-label-short">${cta.shortLabel}</span>
          <img class="nav__cta-logo nav__cta-logo--full" src="/img/art/hndrd-wordmark-navy.png" alt="HNDRD" />
          <img class="nav__cta-logo nav__cta-logo--mark" src="/img/art/hndrd-mark-navy.png" alt="" aria-hidden="true" />
        </a>

        <div class="nav__links" data-nav-group>
          <span class="nav__pill" aria-hidden="true"></span>
          ${linkList(site.navRight)}
        </div>

        <button class="nav__burger" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>

        <div class="nav__menu" id="nav-menu">
          ${linkList([...site.navLeft, ...site.navRight])}
          <a class="nav__link" href="${cta.href}">${cta.label} ↗</a>
        </div>
      </nav>
    </div>
  `;
}

/**
 * Sliding highlight pills. Each link group has its own pill, but they share one
 * hover state: hovering a link in either group lights only that link; when the
 * pointer leaves, the pill returns to the active page link (and the other
 * group's pill hides).
 */
function initSlidingPills(groups: HTMLElement[]): void {
  type Group = { el: HTMLElement; pill: HTMLElement; links: HTMLElement[]; active: HTMLElement | null };
  const gs: Group[] = groups.map((el) => {
    const links = [...el.querySelectorAll<HTMLElement>('.nav__link')];
    return {
      el,
      pill: $<HTMLElement>('.nav__pill', el),
      links,
      active: links.find((l) => l.classList.contains('is-active')) ?? null,
    };
  });

  const place = (g: Group, el: HTMLElement | null) => {
    if (!el) {
      g.pill.style.opacity = '0';
      return;
    }
    g.pill.style.opacity = '1';
    g.pill.style.width = `${el.offsetWidth}px`;
    g.pill.style.transform = `translateX(${el.offsetLeft}px)`;
  };

  /** Light exactly one link (or fall back to the active page link). */
  const highlight = (target: HTMLElement | null) => {
    for (const g of gs) {
      if (target && g.links.includes(target)) place(g, target);
      else if (target) place(g, null);
      else place(g, g.active);
    }
  };

  // Jump (no animation) to the active link on load.
  gs.forEach((g) => (g.pill.style.transition = 'none'));
  highlight(null);
  gs.forEach((g) => {
    void g.pill.offsetWidth; // reflow
    g.pill.style.transition = '';
  });

  for (const g of gs) {
    g.links.forEach((l) => {
      l.addEventListener('mouseenter', () => highlight(l));
      l.addEventListener('focus', () => highlight(l));
    });
    g.el.addEventListener('mouseleave', () => highlight(null));
    g.el.addEventListener('focusout', (e) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!gs.some((x) => to && x.el.contains(to))) highlight(null);
    });
  }
  window.addEventListener('resize', () => highlight(null));
  document.fonts?.ready.then(() => highlight(null));
}

function initMobileMenu(nav: HTMLElement): void {
  const burger = $<HTMLButtonElement>('.nav__burger', nav);
  const menu = $<HTMLElement>('.nav__menu', nav);

  const setOpen = (open: boolean) => {
    nav.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target as Node)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

function initScrollState(nav: HTMLElement): void {
  let ticking = false;
  const update = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
}

export function mountNav(): void {
  const host = document.querySelector<HTMLElement>('[data-mount="nav"]');
  if (!host) return;
  host.outerHTML = template().value;

  const nav = $<HTMLElement>('.nav');
  initSlidingPills([...nav.querySelectorAll<HTMLElement>('[data-nav-group]')]);
  initMobileMenu(nav);
  initScrollState(nav);

}
