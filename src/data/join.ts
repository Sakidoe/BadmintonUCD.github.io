/**
 * ─────────────────────────────────────────────────────────────
 *  JOINING THE CLUB
 *  Steps, deadlines and links for the Join page.
 *  Update `schoolYear` and the deadlines every fall.
 * ─────────────────────────────────────────────────────────────
 */

export interface JoinLink {
  label: string;
  href: string;
  /** Opens in a new tab (default true). Set false for same-site downloads. */
  external?: boolean;
}

export interface JoinStep {
  title: string;
  subtitle: string;
  deadline?: string;
  body: string;
  links?: JoinLink[];
}

export const schoolYear = '2026–2027';

export const dues = {
  yearly: '$180 / year',
  quarterly: '$75 / quarter',
  payTo: 'Zelle to davisbadminton@gmail.com, or cash to a treasurer',
  note: 'Dues are non-refundable.',
};

export const joinSteps: JoinStep[] = [
  {
    title: 'UCD Physical Form',
    subtitle: 'Mandatory for all sport club members',
    deadline: 'Before your first practice',
    body: 'A completed physical form must be uploaded to DoSportsEasy. It can be completed by your primary care physician, another healthcare provider, or at the UC Davis Student Health Center.',
    links: [{ label: 'Download the physical form', href: '/static/UCD_Physical.pdf', external: false }],
  },
  {
    title: 'Membership Dues',
    subtitle: `${dues.yearly} or ${dues.quarterly}`,
    deadline: 'Before your first practice',
    body: `Membership is ${dues.yearly} or ${dues.quarterly}. ${dues.payTo}. ${dues.note}`,
  },
  {
    title: 'Fusion Insurance',
    subtitle: 'Required for every UC Davis sport club',
    body: 'Log into your UC Davis Campus Recreation account, navigate to “Sport Club (Badminton)”, and pay the insurance fee. A fee waiver is available if you need it.',
    links: [
      { label: 'Fusion insurance', href: 'https://rec.ucdavis.edu/' },
      { label: 'Fee waiver', href: 'https://campusrecreation.ucdavis.edu/fee-waiver' },
    ],
  },
  {
    title: 'Team Policy Acknowledgement',
    subtitle: 'Agree to the club conduct policy',
    body: 'Every member signs the acknowledgement form to confirm they have read and agree to the club constitution and member responsibilities.',
    links: [{ label: 'Acknowledgement form', href: 'https://forms.gle/FDYmvPhhVBPAFnF27' }],
  },
  {
    title: 'DoSportsEasy Registration',
    subtitle: 'Your official club membership',
    deadline: 'Before your first practice',
    body: 'Log in with your UC Davis account, scroll down to “Badminton”, and complete the registration.',
    links: [{ label: 'DoSportsEasy', href: 'https://campusrecreation.ucdavis.edu/dosportseasy' }],
  },
  {
    title: 'Questions?',
    subtitle: 'We will help you find a way to play',
    body: 'If dues or forms are a problem, reach out on Discord, Instagram, or by email. We will work something out so you can participate.',
  },
];
