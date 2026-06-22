export interface Base {
  name: string;
  type: string;
  title: string;
  description: string;
  meta?: {
    logo?: string;
  };
}

export const BASES: Base[] = [
  {
    description:
      "Optimized for fast development, easy maintenance, and accessibility.",
    meta: {
      logo: '<svg aria-label="eve" fill="none" height="24" role="img" viewBox="0 0 78 25" width="74.88" xmlns="http://www.w3.org/2000/svg"><path d="M77.7002 3.89551H54.0762L37.5781 24.3818H32.3486L36.5322 19.1729L51.958 0H77.7002V3.89551ZM21.0898 24.3721H0V20.4766H21.0898V24.3721ZM77.7012 20.4766V24.3721H56.6104V20.4766H77.7012ZM17.7744 14.0537H0V10.1582H17.7744V14.0537ZM77.7012 14.0537H59.9268V10.1582H77.7012V14.0537ZM34.7197 3.89551H0V0H34.7197V3.89551Z" fill="var(--foreground)"></path></svg>',
    },
    name: "eve",
    title: "Eve",
    type: "registry:style",
  },
  {
    description:
      "Components for building accessible web apps and design systems.",
    meta: {
      logo: '<svg class="size-6 shrink-0" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="108" height="108" transform="matrix(-1 0 0 1 108 0)" fill="var(--foreground)"></rect><rect width="18" height="18" transform="matrix(-1 0 0 1 72 18)" fill="var(--background)"></rect> <rect width="18" height="18" transform="matrix(-1 0 0 1 54 72)" fill="var(--background)"></rect> <rect width="18" height="18" transform="matrix(-1 0 0 1 54 36)" fill="var(--background)"></rect> <rect width="18" height="18" transform="matrix(-1 0 0 1 72 54)" fill="var(--background)"></rect></svg>',
    },
    name: "flue",
    title: "Flue",
    type: "registry:style",
  },
];
