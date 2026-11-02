/**
 * DAVIS FALL OPEN PAGE — everything comes from src/data/fallOpen.ts.
 * Values that are still placeholders (e.g. "TBA") are rendered with a
 * dashed outline so they are easy to spot while editing.
 */
import { fallOpen } from '../data/fallOpen';
import { icon } from '../components/icons';
import { html, mount, raw } from '../lib/html';

const isPlaceholder = (v: string) => /tba|tbd|^#?$/i.test(v.trim());
const val = (v: string) => (isPlaceholder(v) ? html`<span class="placeholder">${v || 'TBA'}</span>` : html`${v}`);

export function init(): void {
  const h = document.querySelector('[data-fo-headline]');
  if (h) h.innerHTML = html`${fallOpen.headline} <em>${fallOpen.year}</em>`.value;
  const t = document.querySelector('[data-fo-tagline]');
  if (t) t.textContent = fallOpen.tagline;

  mount(
    'fo-facts',
    html`
      <div class="promo__fact">
        <div class="promo__fact-label">${icon('calendar')} Date</div>
        <div class="promo__fact-value">${val(fallOpen.date)}</div>
      </div>
      <div class="promo__fact">
        <div class="promo__fact-label">${icon('pin')} Venue</div>
        <div class="promo__fact-value"><a class="promo__fact-link" href="${fallOpen.venueMapUrl}" target="_blank" rel="noopener">${fallOpen.venue}${icon('external')}</a><br /><small style="font-weight:500;color:var(--ink-3)">${fallOpen.venueAddress}</small></div>
      </div>
      <div class="promo__fact">
        <div class="promo__fact-label">${icon('clock')} Register by</div>
        <div class="promo__fact-value">${val(fallOpen.registrationDeadline)}</div>
      </div>
      <div class="promo__fact">
        <div class="promo__fact-label">${icon('sparkle')} Entry fee</div>
        <div class="promo__fact-value">${val(fallOpen.entryFee)}</div>
      </div>
    `,
  );

  // Registration button state
  const btn = document.querySelector<HTMLAnchorElement>('[data-fo-register]');
  if (btn) {
    if (fallOpen.registrationOpen && fallOpen.registrationUrl !== '#') {
      btn.href = fallOpen.registrationUrl;
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.innerHTML = `Register now ${icon('arrow').value}`;
    } else {
      btn.href = '#updates';
      btn.innerHTML = `Registration opening soon ${icon('arrow').value}`;
    }
  }

  mount(
    'fo-stats',
    html`${fallOpen.stats.map(
      (s) => html`
        <div class="stat">
          <div class="stat__value">${s.value}</div>
          <div class="stat__label">${s.label}</div>
        </div>`,
    )}`,
  );

  mount(
    'fo-categories',
    html`${fallOpen.categories.map(
      (c) => html`
        <article class="card goal">
          <span class="card__icon">${icon('shuttle')}</span>
          <h3>${c.name}</h3>
          <p>${c.detail}</p>
        </article>`,
    )}`,
  );

  mount(
    'fo-schedule',
    html`${fallOpen.schedule.map(
      (s) => html`
        <div class="timeline__item">
          <div class="timeline__time">${s.time}</div>
          <div class="timeline__title">${s.title}</div>
        </div>`,
    )}`,
  );

  mount(
    'fo-gallery',
    html`${fallOpen.gallery.map(
      (p) => html`<figure class="strip__item"><img src="${p.src}" alt="${p.alt}" loading="lazy" /></figure>`,
    )}`,
  );

  mount(
    'fo-faq',
    html`${fallOpen.faq.map(
      (f) => html`
        <details class="faq__item">
          <summary>${f.q}</summary>
          <p>${f.a}</p>
        </details>`,
    )}`,
  );

  // Sponsors: hidden until there are entries
  const sponsors = document.querySelector<HTMLElement>('[data-fo-sponsors]');
  if (sponsors) {
    if (fallOpen.sponsors.length) {
      sponsors.hidden = false;
      mount(
        'fo-sponsors',
        html`${fallOpen.sponsors.map(
          (s) => html`<a href="${s.href ?? '#'}" target="_blank" rel="noopener"><img src="${s.logo}" alt="${s.name}" /></a>`,
        )}`,
      );
    } else {
      sponsors.hidden = true;
    }
  }

  // Decorative shuttle in the page hero
  const deco = document.querySelector('[data-fo-deco]');
  if (deco) deco.innerHTML = raw(SHUTTLE_ART).value;
}

/** Flat shuttlecock illustration used as page decoration. */
const SHUTTLE_ART = `
<svg viewBox="-120 -80 260 160" aria-hidden="true">
  <path d="M-12 -16 L-96 -54 A10 54 0 0 0 -96 54 L-12 16 Z" fill="#f3f6ff"/>
  <path d="M-12 0 L-96 0 A10 54 0 0 0 -96 54 L-12 16 Z" fill="#d3def3"/>
  <g stroke="#a9bde0" stroke-width="2.5" stroke-linecap="round">
    <line x1="-14" y1="-11" x2="-92" y2="-40"/><line x1="-14" y1="-4" x2="-92" y2="-14"/>
    <line x1="-14" y1="4" x2="-92" y2="14"/><line x1="-14" y1="11" x2="-92" y2="40"/>
  </g>
  <ellipse cx="-96" cy="0" rx="10" ry="54" fill="#e6edfb"/>
  <rect x="-24" y="-19" width="16" height="38" rx="5" fill="#2f5aa6"/>
  <circle cx="0" cy="0" r="19" fill="#ff6b4a"/>
  <circle cx="-5" cy="-6" r="6" fill="#ff9d84"/>
</svg>`;
