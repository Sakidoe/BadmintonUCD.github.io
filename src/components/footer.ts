/**
 * Site footer. Content comes from src/data/site.ts.
 */
import { site } from '../data/site';
import { html } from '../lib/html';
import { icon } from './icons';

export function mountFooter(): void {
  const host = document.querySelector<HTMLElement>('[data-mount="footer"]');
  if (!host) return;

  const links = [...site.navLeft, ...site.navRight, site.navCta];

  host.outerHTML = html`
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="footer__brand">
              <span class="nav__brand-mark"><img src="/img/art/cow-mark.png" alt="" /></span>
              ${site.name}
            </div>
            <p class="mt-4">
              One of the largest collegiate badminton clubs in the USA, open to all undergrads and grad students in UC Davis. 
              3rd competitively in the nation, and the best place to meet friends who love this sport.
            </p>
            <div class="socials">
              <a href="${site.socials.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
              <a href="${site.socials.discord}" target="_blank" rel="noopener" aria-label="Discord">${icon('discord')}</a>
              <a href="${site.socials.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
              <a href="mailto:${site.email}" aria-label="Email">${icon('mail')}</a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <div class="footer__links">
              ${links.map((l) => html`<a href="${l.href}">${l.label}</a>`)}
            </div>
          </div>

          <div>
            <h4>Get in touch</h4>
            <div class="footer__links">
              <a href="mailto:${site.email}">${site.email}</a>
              <a href="${site.socials.discord}" target="_blank" rel="noopener">Join the Discord</a>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} ${site.name}. ${site.footer.note}</span>
          <a href="${site.footer.creditHref}" target="_blank" rel="noopener">${site.footer.credit}</a>
        </div>
      </div>
    </footer>
  `.value;
}
