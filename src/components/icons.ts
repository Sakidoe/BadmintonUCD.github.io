/**
 * Inline SVG icons (24×24 grid, stroke based). Add a new one and it becomes
 * available as an `icon` value in the data files via the `IconName` type.
 */
import { raw, type Raw } from '../lib/html';

const wrap = (paths: string, extra = ''): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${paths}</svg>`;

const icons = {
  shuttle: wrap(
    '<path d="M13.5 10.5 20 4"/><path d="m9 15 3.5-4.5 4.5 3.5L9 15Z"/><path d="M4 20c1.5-4 3-6 5-5s.9 3.5-3 5c-1 .4-2 .4-2 0Z"/><path d="M14 4l-1.5 2.5M20 10l-2.5 1.5"/>',
  ),
  racket: wrap(
    '<ellipse cx="14.5" cy="9.5" rx="6" ry="7.5" transform="rotate(35 14.5 9.5)"/><path d="m10 15-6.5 6.5"/><path d="M12 6l4 6M15 5l2 8M10.5 8.5l7 3.5M9.5 11.5l8.5 1"/>',
  ),
  trophy: wrap(
    '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 6h2a2 2 0 0 1 0 4h-2M7 6H5a2 2 0 0 0 0 4h2"/>',
  ),
  heart: wrap(
    '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  ),
  people: wrap(
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5A5 5 0 0 1 21.5 20"/>',
  ),
  car: wrap(
    '<path d="M4 16 5.5 9.5A2 2 0 0 1 7.5 8h9a2 2 0 0 1 2 1.5L20 16"/><rect x="3" y="14" width="18" height="5" rx="1.5"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
  ),
  flag: wrap('<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>'),
  sparkle: wrap(
    '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M12 8l1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2Z"/>',
  ),
  arrow: wrap('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  external: wrap('<path d="M7 17 17 7M9 7h8v8"/>'),
  download: wrap('<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>'),
  pin: wrap('<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Z"/><circle cx="12" cy="10" r="2"/>'),
  calendar: wrap('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  clock: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  instagram: wrap(
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  ),
  discord: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.6 5.6A16 16 0 0 0 15.7 4.4l-.5 1a15 15 0 0 0-6.4 0l-.5-1a16 16 0 0 0-3.9 1.2C1.9 9.3 1.2 12.9 1.5 16.4a16 16 0 0 0 4.8 2.4l1-1.6a10 10 0 0 1-1.6-.8l.4-.3a11.5 11.5 0 0 0 11.8 0l.4.3-1.6.8 1 1.6a16 16 0 0 0 4.8-2.4c.4-4-.7-7.6-2.9-10.8ZM8.7 14.3c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Zm6.6 0c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.6v7h2.9Z"/></svg>`,
  mail: wrap('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
} as const;

export type IconName = keyof typeof icons;

export function icon(name: IconName): Raw {
  return raw(icons[name]);
}
