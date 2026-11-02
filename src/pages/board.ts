/**
 * BOARD PAGE — officer grid (from src/data/officers.ts).
 */
import { boardYear, officers } from '../data/officers';
import { icon } from '../components/icons';
import { html, mount } from '../lib/html';

export function init(): void {
  const y = document.querySelector('[data-board-year]');
  if (y) y.textContent = boardYear;

  mount(
    'officers',
    html`${officers.map(
      (o) => html`
        <article class="officer">
          <img src="${o.photo}" alt="${o.name}, ${o.role}" loading="lazy" />
          ${o.instagram
            ? html`<a class="officer__ig" href="${o.instagram}" target="_blank" rel="noopener"
                aria-label="${o.name} on Instagram">${icon('instagram')}</a>`
            : ''}
          <div class="officer__info">
            <div class="officer__role">${o.role}</div>
            <div class="officer__name">${o.name}</div>
          </div>
        </article>`,
    )}`,
  );
}
