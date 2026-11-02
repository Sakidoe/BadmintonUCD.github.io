/**
 * JOIN PAGE — membership steps (from src/data/join.ts).
 */
import { dues, joinSteps, schoolYear } from '../data/join';
import { icon } from '../components/icons';
import { html, mount } from '../lib/html';

export function init(): void {
  const y = document.querySelector('[data-school-year]');
  if (y) y.textContent = schoolYear;

  mount(
    'dues',
    html`
      <div class="dues__item">
        <div class="dues__value">${dues.yearly}</div>
        <div class="dues__label">Full year membership</div>
      </div>
      <div class="dues__item">
        <div class="dues__value">${dues.quarterly}</div>
        <div class="dues__label">Single quarter</div>
      </div>
      <div class="dues__item">
        <div class="dues__value">Zelle / cash</div>
        <div class="dues__label">${dues.payTo}. ${dues.note}</div>
      </div>
    `,
  );

  mount(
    'steps',
    html`${joinSteps.map(
      (s) => html`
        <article class="step">
          <span class="step__num" aria-hidden="true"></span>
          <div>
            <div class="step__head">
              <h3>${s.title}</h3>
              <span class="step__subtitle">${s.subtitle}</span>
            </div>
            ${s.deadline ? html`<span class="step__deadline">${icon('clock')} ${s.deadline}</span>` : ''}
            <p>${s.body}</p>
            ${s.links?.length
              ? html`<div class="step__links">
                  ${s.links.map(
                    (l) => html`<a class="chip" href="${l.href}"
                      ${l.external === false ? '' : 'target="_blank" rel="noopener"'}>
                      ${l.label} ${icon(l.external === false ? 'download' : 'external')}
                    </a>`,
                  )}
                </div>`
              : ''}
          </div>
        </article>`,
    )}`,
  );
}
