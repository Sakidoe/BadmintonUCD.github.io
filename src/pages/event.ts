/**
 * EVENT DETAIL PAGE — /event.html?e=<slug>
 * Loads src/content/events/<slug>.mdx, renders it with Preact, and shows a
 * persistent "Back to events" button. Unknown slugs show a friendly 404.
 */
import { h, render } from 'preact';
import { events } from '../data/events';
import { springOpen } from '../data/springOpen';
import { icon } from '../components/icons';
import { html, mount } from '../lib/html';
import { mdxComponents } from '../content/mdx-components';

interface Frontmatter {
  title?: string;
  subtitle?: string;
  hero?: string;
}
interface MdxModule {
  default: (props: { components?: Record<string, unknown> }) => unknown;
  frontmatter?: Frontmatter;
}

// Every .mdx in the events folder, keyed by slug, loaded on demand.
const modules = import.meta.glob<MdxModule>('../content/events/*.mdx');
const bySlug: Record<string, () => Promise<MdxModule>> = {};
for (const [path, load] of Object.entries(modules)) {
  const slug = path.split('/').pop()!.replace(/\.mdx$/, '');
  if (!slug.startsWith('_')) bySlug[slug] = load;
}

export async function init(): Promise<void> {
  const slug = new URLSearchParams(location.search).get('e') ?? '';
  const load = bySlug[slug];
  const heroEl = document.querySelector<HTMLElement>('[data-event-hero]');
  const bodyEl = document.querySelector<HTMLElement>('[data-event-body]');
  if (!heroEl || !bodyEl) return;

  if (!load) {
    mount(
      'event-hero',
      html`<span class="kicker kicker--pink">Not found</span>
        <h1>That event does not exist (yet).</h1>
        <p class="lede">Pick one from the events page.</p>`,
    );
    return;
  }

  const mod = await load();
  const fm = mod.frontmatter ?? {};
  const meta = events.find((e) => e.slug === slug);
  const title = fm.title ?? meta?.title ?? slug;
  const subtitle = fm.subtitle ?? meta?.meta ?? (slug === springOpen.slug ? springOpen.tagline : '');
  const hero = fm.hero ?? meta?.photo;

  document.title = `${title} — Badminton Club at UC Davis`;
  mount(
    'event-hero',
    html`<span class="kicker">Event</span>
      <h1>${title}</h1>
      ${subtitle ? html`<p class="lede">${subtitle}</p>` : ''}
      ${hero ? html`<div class="event-hero__media"><img src="${hero}" alt="" /></div>` : ''}`,
  );

  render(h(mod.default as never, { components: mdxComponents }), bodyEl);

  document.querySelectorAll<HTMLElement>('[data-icon]').forEach((el) => {
    el.insertAdjacentHTML('beforeend', icon(el.dataset.icon as 'arrow').value);
  });
}
