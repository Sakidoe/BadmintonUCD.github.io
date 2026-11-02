/**
 * HOME PAGE — hero animation + data-driven sections.
 * Static copy lives in index.html; the lists below come from src/data/*.
 */
import { initHero } from '../hero/rallyAnimation';
import { stats, gallery } from '../data/about';
import { events } from '../data/events';
import { fallOpen } from '../data/fallOpen';
import { html, mount } from '../lib/html';
import { icon } from '../components/icons';

export function init(): void {
  initHero();

  // Stats strip
  mount(
    'stats',
    html`${stats.map(
      (s) => html`
        <div class="stat">
          <div class="stat__value">${s.value}</div>
          <div class="stat__label">${s.label}</div>
        </div>`,
    )}`,
  );

  // Featured programs (events with featured: true)
  mount(
    'featured-events',
    html`${events
      .filter((e) => e.featured)
      .map(
        (e) => html`
          <article class="card">
            <div class="card__media"><img src="${e.photo}" alt="" loading="lazy" /></div>
            <div class="card__body">
              <span class="card__meta">${e.meta}</span>
              <h3>${e.title}</h3>
              <p>${e.description}</p>
            </div>
          </article>`,
      )}`,
  );

  // Fall Open promo facts
  mount(
    'promo-facts',
    html`
      <div class="promo__fact">
        <div class="promo__fact-label">When</div>
        <div class="promo__fact-value">${fallOpen.date}</div>
      </div>
      <div class="promo__fact">
        <div class="promo__fact-label">Where</div>
        <div class="promo__fact-value"><a class="promo__fact-link" href="${fallOpen.venueMapUrl}" target="_blank" rel="noopener">${fallOpen.venue}${icon('external')}</a></div>
      </div>
      <div class="promo__fact">
        <div class="promo__fact-label">Events</div>
        <div class="promo__fact-value">${fallOpen.stats[1].value} across all levels</div>
      </div>
      <div class="promo__fact">
        <div class="promo__fact-label">Registration</div>
        <div class="promo__fact-value">${fallOpen.registrationOpen && fallOpen.registrationUrl !== '#'
          ? html`<a class="promo__fact-link" href="${fallOpen.registrationUrl}" target="_blank" rel="noopener">Register!${icon('external')}</a>`
          : 'Opening soon'}</div>
      </div>`,
  );
  const promoTitle = document.querySelector('[data-promo-title]');
  if (promoTitle) promoTitle.textContent = `${fallOpen.headline} ${fallOpen.year}`;
  const promoTag = document.querySelector('[data-promo-tagline]');
  if (promoTag) promoTag.textContent = fallOpen.tagline;

  // Gallery preview (first 6 photos)
  mount(
    'gallery',
    html`${gallery.slice(0, 6).map(
      (p) => html`
        <figure class="gallery__item${p.shape ? ` gallery__item--${p.shape}` : ''}">
          <img src="${p.src}" alt="${p.alt}" loading="lazy" />
          ${p.caption ? html`<figcaption class="gallery__caption">${p.caption}</figcaption>` : ''}
        </figure>`,
    )}`,
  );

  // Arrow icons in buttons marked data-icon="arrow"
  document.querySelectorAll<HTMLElement>('[data-icon]').forEach((el) => {
    el.insertAdjacentHTML('beforeend', icon(el.dataset.icon as 'arrow').value);
  });
}
