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
    role: 'Principal Investigator',
    photo: '/team/kai-kunze.jpg',
    url: 'https://kaikunze.de',
  },
  // Add members below:
  // { name: 'Jane Doe', role: 'PhD Student', photo: '/team/jane-doe.jpg' },
];
