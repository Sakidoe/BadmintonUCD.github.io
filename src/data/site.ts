/**
 * ─────────────────────────────────────────────────────────────
 *  SITE-WIDE SETTINGS
 *  Club name, contact email, social links, navigation.
 *  Edit here and every page (nav + footer) updates.
 * ─────────────────────────────────────────────────────────────
 */

export interface NavLink {
  label: string;
  href: string;
}

export const site = {
  name: 'Badminton Club at UC Davis',
  shortName: 'BUCD',
  /** Used in <title> tags: "Page — Badminton Club at UC Davis" */
  titleSuffix: 'Badminton Club at UC Davis',
  email: 'davisbadminton@gmail.com',
  /** Where we practice — shown in the footer and on the Events page. */

  socials: {
    instagram: 'https://www.instagram.com/badminton_ucd/',
    discord: 'https://discord.gg/bssTuRwBZx',
    facebook: 'https://www.facebook.com/groups/ucdavisbadminton',
  },

  /** Left and right halves of the nav bar. The Fall Open button sits in the middle. */
  navLeft: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about.html' },
    { label: 'Events', href: '/events.html' },
  ] satisfies NavLink[],
  navRight: [
    { label: 'Board', href: '/board.html' },
    { label: 'Join', href: '/join.html' },
  ] satisfies NavLink[],

  /** The highlighted centre button. `shortLabel` is used on phones. */
  navCta: { label: 'Aggie Open', shortLabel: 'Aggie Open', href: '/fall-open.html' },

  footer: {
    credit: 'Developed by Richard Huang',
    creditHref: 'https://www.linkedin.com/in/ridhuang/',
    note: 'With 💙 from the officers of the Badminton Club at UC Davis',
  },
} as const;
