/**
 * Shared entry point — included by every page.
 * Mounts the nav + footer, wires scroll reveals, then loads the
 * page-specific module based on <body data-page="...">.
 */
import './styles/index.css';
import { mountNav } from './components/nav';
import { mountFooter } from './components/footer';
import { applyStagger, initReveal } from './lib/reveal';

type PageModule = { init: () => void | Promise<void> };

const pages: Record<string, () => Promise<PageModule>> = {
  home: () => import('./pages/home'),
  about: () => import('./pages/about'),
  events: () => import('./pages/events'),
  board: () => import('./pages/board'),
  join: () => import('./pages/join'),
  'fall-open': () => import('./pages/fallOpen'),
  event: () => import('./pages/event'),
};

async function boot(): Promise<void> {
  mountNav();
  mountFooter();

  const page = document.body.dataset.page;
  if (page && pages[page]) {
    const mod = await pages[page]();
    await mod.init();
  }

  // Reveal after page content has been rendered so data-driven sections are observed too.
  applyStagger();
  initReveal();
}

boot();
