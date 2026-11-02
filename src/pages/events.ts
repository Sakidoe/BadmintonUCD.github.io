/**
 * EVENTS PAGE — practice schedule + all events (from src/data/events.ts).
 */
import { events, practiceSchedule } from '../data/events';
import { springOpen } from '../data/springOpen';
import { icon } from '../components/icons';
import { html, mount } from '../lib/html';

export function init(): void {
  mount(
    'schedule',
    html`
      <div class="schedule__tile schedule__tile--blue">
        <span class="schedule__icon">${icon('calendar')}</span>
        <div class="schedule__label">Days</div>
        <div class="schedule__value">${practiceSchedule.days}</div>
      </div>
      <div class="schedule__tile schedule__tile--pink">
        <span class="schedule__icon">${icon('clock')}</span>
        <div class="schedule__label">Time</div>
        <div class="schedule__value">${practiceSchedule.time}</div>
      </div>
      <div class="schedule__tile">
        <span class="schedule__icon">${icon('pin')}</span>
        <div class="schedule__label">Where</div>
        <div class="schedule__value">${practiceSchedule.location}</div>
      </div>
      <div class="schedule__foot">
        <p>${practiceSchedule.note}</p>
        <div class="btn-row">
          <a class="btn btn--gold" href="/event.html?e=weekly-practices">Practice details ${icon('arrow')}</a>
          <a class="btn btn--ghost" href="https://discord.gg/bssTuRwBZx" target="_blank" rel="noopener">This week's times on Discord</a>
        </div>
      </div>
    `,
  );

  mount(
    'events',
    html`${events.map(
      (e) => html`
        <a class="card card--link" href="/event.html?e=${e.slug}">
          <div class="card__media"><img src="${e.photo}" alt="" loading="lazy" /></div>
          <div class="card__body">
            <span class="card__meta">${e.meta}</span>
            <h3>${e.title}</h3>
            <p>${e.description}</p>
            <span class="card__more">Details ${icon('arrow')}</span>
          </div>
        </a>`,
    )}`,
  );

  // Davis Spring Open poster (src/data/springOpen.ts)
  const so = springOpen;
  mount(
    'spring-open',
    html`
      <div class="promo promo--spring" data-reveal="scale">
        <img class="promo__art" src="${so.art}" alt="" aria-hidden="true" loading="lazy" />
        <div>
          <span class="promo__badge">Tournament · Spring</span>
          <h2>${so.headline} ${so.year}</h2>
          <p>${so.tagline}</p>
          <div class="btn-row mt-6">
            <a class="btn btn--gold btn--lg" href="/event.html?e=${so.slug}">Spring Open details ${icon('arrow')}</a>
          </div>
        </div>
        <div class="promo__facts">
          <div class="promo__fact">
            <div class="promo__fact-label">${icon('calendar')} When</div>
            <div class="promo__fact-value">${so.date}</div>
          </div>
          <div class="promo__fact">
            <div class="promo__fact-label">${icon('pin')} Where</div>
            <div class="promo__fact-value">${so.venue}</div>
          </div>
          <div class="promo__fact">
            <div class="promo__fact-label">${icon('clock')} Registration</div>
            <div class="promo__fact-value">${so.registrationOpen ? 'Open now' : 'Opening soon'}</div>
          </div>
          <div class="promo__fact">
            <div class="promo__fact-label">${icon('shuttle')} Events</div>
            <div class="promo__fact-value">Singles · Doubles · Mixed</div>
          </div>
        </div>
      </div>`,
  );
}
