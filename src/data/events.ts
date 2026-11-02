/**
 * ─────────────────────────────────────────────────────────────
 *  EVENTS & PROGRAMS
 *  Rendered on the Events page (full list) and the Home page
 *  (only the ones with `featured: true`).
 *  `icon` is one of the keys in src/components/icons.ts.
 *  Each event links to /event.html?e=<slug>, rendered from
 *  src/content/events/<slug>.mdx — add a card here AND an .mdx file.
 * ─────────────────────────────────────────────────────────────
 */

import type { IconName } from '../components/icons';

export interface ClubEvent {
  /** Matches src/content/events/<slug>.mdx — the event's own page */
  slug: string;
  title: string;
  /** Short tag line under the title, e.g. "Mon · Wed · Fri" */
  meta: string;
  description: string;
  icon: IconName;
  photo: string;
  featured?: boolean;
}

/** Weekly practice schedule — shown at the top of the Events page. Edit each quarter. */
export const practiceSchedule = {
  days: 'Monday · Wednesday · Friday',
  time: 'Evenings (times vary by quarter — check Discord)',
  location: 'Hickey Gym',
  note: 'Birds are provided. Courts are split by skill level and officers supervise play.',
};

export const events: ClubEvent[] = [
  {
    slug: 'weekly-practices',
    title: 'Weekly Practices',
    meta: 'Mon · Wed · Fri @ Hickey Gym',
    description:
      'Open-gym practices three times a week with courts for every skill level. Birds are provided and officers are on hand to supervise.',
    icon: 'racket',
    photo: '/img/team_photos/team-2025.jpg',
    featured: true,
  },
  {
    slug: 'school-meets',
    title: 'School Meets',
    meta: 'Home & away',
    description:
      'Several meets each quarter where our roster faces off against schools like SJSU, UCSC, Stanford and UC Berkeley in competitive matches for points.',
    icon: 'trophy',
    photo: '/img/meets/berkeley_2025_3.jpg',
    featured: true,
  },
  {
    slug: 'bonding-events',
    title: 'Bonding Events',
    meta: 'Every quarter',
    description:
      'From team trips to Irvine to weekly runs to boba outings, we prioritize any chance to make new memories together.',
    icon: 'heart',
    photo: '/img/team_bonding/picnic_2026.jpeg',
    featured: true,
  },
  {
    slug: 'irvine-trip',
    title: 'Irvine Trip',
    meta: 'Annual tradition',
    description:
      'A road trip to Irvine for the collegiate tournament, with coordinated travel, AirBnBs, food and a weekend of team bonding.',
    icon: 'car',
    photo: '/img/team_bonding/irvine_2022_team.jpg',
  },
  {
    slug: 'collegiate-nationals',
    title: 'Collegiate Nationals',
    meta: 'USA Badminton Collegiate Championships',
    description:
      'We represent Northern California at Nationals, defending our regional titles. In 2026 the team finished 3rd in the country.',
    icon: 'flag',
    photo: '/img/boston/boston-team.jpg',
  },
  {
    slug: 'year-end-banquet',
    title: 'Year-End Banquet',
    meta: 'Spring quarter',
    description:
      'Every year closes with a formal banquet to celebrate the season with catered food, awards, and a lot of photos.',
    icon: 'sparkle',
    photo: '/img/banquet/bucd_banquet_team.JPG',
  },
  {
    slug: 'davis-open',
    title: 'Davis Open',
    meta: 'One of the largest tournament in Northern California',
    description:
      'Our student-run tournament with 400+ entries across 20 events, hosted at the University Credit Union Center with 13 courts, trophies and cash prizes.',
    icon: 'shuttle',
    photo: '/img/davis_open/davis-open-xin.jpg',
  },
];
