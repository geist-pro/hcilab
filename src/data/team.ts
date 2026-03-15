export interface TeamMember {
  name: string;
  role: string;
  photo?: string;  // path relative to public/
  url?: string;
}

/**
 * Configure team members here.
 * Photos go in public/team/ (e.g. public/team/kai-kunze.jpg)
 */
export const team: TeamMember[] = [
  {
    name: 'Kai Kunze',
    role: 'Researcher',
    photo: '/team/kai-kunze.jpg',
    url: 'https://kaikunze.de',
  },
  {
    name: 'Matthias Hoppe',
    role: 'Researcher',
    photo: '/team/matthias-hoppe.jpg',
    url: 'https://scholar.google.com/citations?user=N2Bw-lMAAAAJ',
  },
];
