/**
 * Scroll-reveal for any element with `data-reveal`.
 * Optional `data-reveal-delay="120"` staggers children (milliseconds).
 * Styles live in styles/base.css.
 */
export function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = el.dataset.revealDelay;
        if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  els.forEach((el) => io.observe(el));
}

/**
 * Convenience: stagger every direct child of a container.
 *   <div data-stagger="90"> ...children get data-reveal + increasing delay
 */
export function applyStagger(): void {
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((parent) => {
    const step = Number(parent.dataset.stagger || 80);
    [...parent.children].forEach((child, i) => {
      const el = child as HTMLElement;
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
      el.dataset.revealDelay = String(i * step);
    });
  });
}
