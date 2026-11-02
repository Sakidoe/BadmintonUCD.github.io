/**
 * Components available inside every event .mdx file without importing:
 *   <Note>…</Note>                 pink callout box
 *   <Button href="…">…</Button>    sticker button (external links open in a new tab)
 * Add more here and they become available in all MDX pages.
 */
import type { ComponentChildren } from 'preact';

export function Note({ children }: { children?: ComponentChildren }) {
  return <div class="callout">{children}</div>;
}

export function Button({ href, children }: { href: string; children?: ComponentChildren }) {
  const external = /^https?:\/\//.test(href);
  return (
    <a class="btn btn--gold" href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>
      {children}
    </a>
  );
}

export const mdxComponents = { Note, Button };
