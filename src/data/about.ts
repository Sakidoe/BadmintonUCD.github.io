/**
 * ─────────────────────────────────────────────────────────────
 *  ABOUT PAGE + HOME PAGE COPY
 *  Mission, goals, stats and the photo gallery.
 * ─────────────────────────────────────────────────────────────
 */

import type { IconName } from '../components/icons';

export const mission =
  'Provide access to badminton facilities for students to come together, fostering good sportsmanship and leadership skills at all levels.';

export const intro = {
  kicker: 'Student-run since day one',
  heading: 'A club for every UC Davis student who loves badminton.',
  body: 'The Badminton Club at UC Davis is a student-run sports club affiliated with the UC Davis Sport Club Program. It is open to all undergraduate and graduate students — no tryouts, every skill level welcome. We run practices three times a week, host the largest tournament in Northern California, and travel together to compete against schools across the state.',
};

export interface Goal {
  title: string;
  kicker: string;
  body: string;
  icon: IconName;
}

export const goals: Goal[] = [
  {
    title: 'Team Bonding',
    kicker: 'Camaraderie',
    body: 'We want every member to find lifelong friends here. Quarterly bonding events, meetups and many boba trips mean people learn and grow together as one team.',
    icon: 'heart',
  },
  {
    title: 'Community',
    kicker: 'Leadership & etiquette',
    body: 'We maintain strong relationships across the collegiate badminton community, hosting meets against SJSU, UCSC, Stanford and UC Berkeley and encouraging members to compete at tournaments.',
    icon: 'people',
  },
  {
    title: 'Victory',
    kicker: 'Training & competition',
    body: 'Our vision is to win the National Collegiate Championships. Weekly practices pair members by level so everyone improves while supporting each other.',
    icon: 'trophy',
  },
];

/** Big numbers shown on the Home page */
export const stats = [
  { value: '3rd', label: 'in the nation, 2026 Collegiate Nationals' },
  { value: '3×', label: 'practices every week' },
  { value: '100+', label: 'members 2026' },
  { value: '0', label: 'tryouts - everyone plays' },
];

export interface Photo {
  src: string;
  alt: string;
  /** Optional caption shown on hover */
  caption?: string;
  /** Frame override. 'tall' = vertical/portrait (1 col × 2 rows, ~2:3);
   *  'wide' = landscape strip (2 cols × 1 row). Leave out for the default pattern. */
  shape?: 'tall' | 'wide';
}

/** Photo gallery on the About page (and a subset on Home). Order = display order. */
export const gallery: Photo[] = [
  { src: '/img/team_photos/team-2024.jpg', alt: 'The 2025 team photo of the Badminton Club @ UCD', caption: 'Team 2025' },
  { src: '/img/collegiate/Collegiate_2026_1.jpeg', alt: '3rd Place at USA Collegiate Championships 2026', caption: 'Nationals, Chicago, 2026' },
  { src: '/img/team_photos/practice.jpg', alt: 'Funky Photo', caption: 'Practice Shenanigans' },
  { src: '/img/meets/SJSU_2025.jpeg', alt: 'School-to-school match with SJSU', caption: 'SJSU joint Match' },
  { src: '/img/banquet/banquet_2.jpg', alt: 'Banquet 2026', caption: 'Banquet 2026' },
  { src: '/img/collegiate/collegiate-ding.jpg', alt: 'Regionals 2025', caption: '2nd Place Regionals 2025' },
  { src: '/img/banquet/banquet_2026_1.JPG', alt: 'Banquet 2026', caption: 'Pool Party!' },
  { src: '/img/team_bonding/kickback.jpg', alt: 'the gang', caption: 'Fun get-togethers' },
  { src: '/img/team_bonding/boston_2024.webp', alt: 'Boston Trip 2024 Booth', caption: 'Boston 2024!', shape: 'tall' },
  { src: '/img/team_bonding/big_xin.jpeg', alt: 'Xin at the Feast', caption: 'Big Backing', shape: 'tall' },
  { src: '/img/grads/grad-throw.jpg', alt: 'Graduates 2025', caption: 'Grads 2025', shape: 'wide' },
];
