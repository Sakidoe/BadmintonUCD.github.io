/**
 * ─────────────────────────────────────────────────────────────
 *  DAVIS FALL OPEN — PROMO CONTENT
 *  Everything on /fall-open.html and the promo card on the
 *  Home page comes from this file.
 *
 *  ▶ Fill in the PLACEHOLDER values below when details are set.
 *    Set `registrationOpen: true` once sign-ups go live.
 * ─────────────────────────────────────────────────────────────
 */

export interface FallOpenEventCategory {
  name: string;
  /** e.g. "Men's · Women's · Mixed" or "A / B / C / D" */
  detail: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const fallOpen = {
  /** Short name used in the nav button & cards */
  name: 'Aggie Open',
  /** Big headline on the promo page */
  headline: 'Aggie Open',
  year: '2026',
  tagline: 'Northern California’s biggest collegiate badminton weekend is back.',

  // ── PLACEHOLDERS ──────────────────────────────────────────
  date: '11/14/2026-11/15/2026',        // e.g. 'November 14–15, 2026'
  venue: 'Elite Badminton Center',         // venue name
  venueAddress: '33540 Central Ave, Union City, CA 94587',
  venueMapUrl: 'https://www.google.com/maps/place/Elite+Badminton+Center/@37.5931763,-122.0404831,17z/data=!3m1!4b1!4m6!3m5!1s0x808f954c291a78f7:0xae0f1ba2232116c5!8m2!3d37.5931763!4d-122.0379082!16s%2Fg%2F11jpxvx48z?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D', // Google Maps — venue name links here
  registrationOpen: true,                 // flip to true when live
  registrationUrl: 'https://www.tournamentsoftware.com/tournament/9CF3936E-F229-4A6B-9BAF-029715F36D92', // Tournament Software sign-up
  registrationDeadline: 'November 8, 2026',             // e.g. 'November 1, 2026'
  entryFee: '$35 for first event, $30 for each additional event',                         // e.g. '$25 per event'
  // ─────────────────────────────────────────────────────────

  /** Quick facts row under the headline */
  stats: [
    { value: '400+', label: 'Entries' },
    { value: '20', label: 'Events' },
    { value: '13', label: 'Courts' },
    { value: '$', label: 'Cash prizes' },
  ],

  /** Event categories — update as the bracket list is finalised */
  categories: [
    { name: 'Singles', detail: 'Men’s · Women’s — A / B / C / D (A/B may combine)' },
    { name: 'Doubles', detail: 'Men’s · Women’s — A / B / C / D (A/B may combine)' },
    { name: 'Mixed Doubles', detail: 'A / B / C / D (A/B may combine)' },
  ] satisfies FallOpenEventCategory[],

  /** Placeholder schedule — replace with real times */
  schedule: [
    { time: 'Day 1 ', title: 'Singles and Mixed' },
    { time: 'Day 2', title: 'Doubles' },
  ] satisfies ScheduleItem[],

  faq: [
    { q: 'Who can play?', a: 'The Davis Open is open to all players, hosted on Tournament Software' },
    { q: 'Do I need a partner?', a: 'For doubles and mixed, yes.' },
    { q: 'Are birds provided?', a: 'Feather shuttles are provided for A flight matches, else no.' },
    { q: 'How do I get updates?', a: 'Follow @badminton_ucd on Instagram and join the Discord.' },
  ] satisfies FaqItem[],

  /** Photos from previous Davis Opens, shown in the gallery strip */
  gallery: [
    { src: '/img/davis_open/davis-open-1.jpg', alt: 'Player lunging for a shot at the Davis Open' },
    { src: '/img/davis_open/davis-open-bianca-justin.jpg', alt: 'Mixed doubles rally at the Davis Open' },
    { src: '/img/davis_open/davis-open-tiff.jpg', alt: 'Women’s singles at the Davis Open' },
    { src: '/img/davis_open/davis-open-steffi-josh.jpg', alt: 'Doubles jump smash at the Davis Open' },
    { src: '/img/davis_open/davis-open-charlie.jpg', alt: 'Trophy winners at the Davis Open' },
    { src: '/img/davis_open/davis-open-xin.jpg', alt: 'Singles rally at the Davis Open' },
    { src: '/img/davis_open/davis-open-team.jpg', alt: 'Volunteers and organisers at the Davis Open' },
  ],

  /** Sponsor logos — add { name, logo, href } entries when you have them */
  sponsors: [
    { name: 'HNDRD', logo: '/img/art/HNDRD_logo_2.jpg'}
  ] as { name: string; logo: string; href?: string }[],
};
