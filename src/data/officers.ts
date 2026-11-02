/**
 * ─────────────────────────────────────────────────────────────
 *  EXECUTIVE BOARD
 *  One entry per officer. Photos live in /public/img/.
 *  To add a new officer: drop a photo in public/img (portrait,
 *  ~700×900 px works well), then add an object below.
 *  `instagram` is optional — omit it and no link is shown.
 * ─────────────────────────────────────────────────────────────
 */

export interface Officer {
  name: string;
  role: string;
  photo: string;
  instagram?: string;
}

/** Shown as the heading on the Board page, e.g. "2025–2026 Executive Board". */
export const boardYear = '2025–2026';

export const officers: Officer[] = [
  { name: 'Bill Wong', role: 'President', photo: '/img/officers/Bill.jpg', instagram: 'https://www.instagram.com/pillpong54/' },
  { name: 'Kristine Ngo', role: 'Vice President', photo: '/img/officers/Kristine.jpg', instagram: 'https://www.instagram.com/kristinnngo/' },
  { name: 'Sidney Wang', role: 'Secretary', photo: '/img/officers/Sidney.png', instagram: 'https://www.instagram.com/sidneyy.wang/' },
  { name: 'Livia Rice', role: 'Event Coordinator', photo: '/img/officers/Livia.jpg', instagram: 'https://www.instagram.com/queen_schadenfreude/' },
  { name: 'Emily Chen', role: 'Event Coordinator', photo: '/img/officers/Emily.jpg', instagram: 'https://www.instagram.com/_e.c_16/' },
  { name: 'Jon Moser', role: 'Treasurer', photo: '/img/officers/Jon.jpg', instagram: 'https://www.instagram.com/breaded.banana/' },
  { name: 'Sean Tan', role: 'Treasurer', photo: '/img/officers/Sean.jpg', instagram: 'https://www.instagram.com/sean.tan06/' },
  { name: 'Erika Lai', role: 'Fundraiser Coordinator', photo: '/img/officers/Erika.jpg', instagram: 'https://www.instagram.com/the_restroom_is_fishball_soup/' },
  { name: 'Justin Larson', role: 'Travel Coordinator', photo: '/img/officers/Justin.jpg', instagram: 'https://www.instagram.com/_justinlarson_/' },
  { name: 'Jonathan Li', role: 'Publicity Coordinator', photo: '/img/officers/Jonathan.jpg', instagram: 'https://www.instagram.com/jonathan_li_/' },
  { name: 'Adrian Luo', role: 'Historian', photo: '/img/officers/Adrian.jpg', instagram: 'https://www.instagram.com/disconnectedorange_6/' },
];
