export interface Skill {
  name: string;
  level: number; // 0-100 percentage
  icon: string;
}

export type DomainType = 'web' | 'cyber' | 'data';

export interface DomainInfo {
  id: DomainType;
  title: string;
  subtitle: string;
  mode: 'light' | 'dark';
  color: string; // Tailwind hex or descriptive color name
  description: string;
  aesthetic: string;
  skills: Skill[];
}

export interface Project {
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  type: DomainType;
  features: string[];
  metrics?: string;
  githubUrl?: string;
}

export const DOMAINS: DomainInfo[] = [
  {
    id: 'web',
    title: 'Web Development',
    subtitle: 'Full-Stack Web Developer',
    mode: 'light',
    color: '#2563EB', // Electric Blue
    aesthetic: 'Clean, High-Tech Corporate / Sci-Fi Lab',
    description: 'Constructing robust backend architectures paired with high-performance React client templates.',
    skills: [
      { name: 'React & Vite', level: 95, icon: 'React' },
      { name: 'Next.js', level: 90, icon: 'Next' },
      { name: 'TypeScript', level: 92, icon: 'TS' },
      { name: 'React Native (Expo)', level: 85, icon: 'Mobile' },
      { name: 'Tailwind CSS', level: 98, icon: 'Tailwind' },
      { name: 'Python & Django', level: 90, icon: 'Django' },
      { name: 'Django REST Framework (DRF)', level: 93, icon: 'DRF' },
      { name: 'PostgreSQL', level: 88, icon: 'Postgres' }
    ]
  },
  {
    id: 'cyber',
    title: 'Cyber Security',
    subtitle: 'Cyber Security Enthusiast',
    mode: 'dark',
    color: '#DC2626', // Blood Red
    aesthetic: 'Futuristic Cyber-Noir / Hacker Terminal',
    description: 'Auditing network perimeters, analyzing packets, and building secure cryptographic frameworks.',
    skills: [
      { name: 'Kali Linux System & Shell', level: 92, icon: 'Kali' },
      { name: 'Network Scanning (Nmap)', level: 88, icon: 'Nmap' },
      { name: 'Web App Security (Burp Suite)', level: 84, icon: 'Burp' },
      { name: 'Penetration Testing', level: 85, icon: 'Pen' }
    ]
  },
  {
    id: 'data',
    title: 'Data Analysis',
    subtitle: 'Data Analyst',
    mode: 'light',
    color: '#16A34A', // Data Green
    aesthetic: 'Precision Analytics / Futuristic Dashboard',
    description: 'Sifting through massive databases, visualizing performance counters, and optimizing intelligence reports.',
    skills: [
      { name: 'MySQL Database', level: 90, icon: 'MySQL' },
      { name: 'Python Analytics (Pandas/NumPy)', level: 88, icon: 'Python' },
      { name: 'PowerBI Dashboarding', level: 85, icon: 'PowerBI' },
      { name: 'Excel / Spreadsheet Ops', level: 94, icon: 'Excel' },
      { name: 'Google Sheets & Analytics', level: 90, icon: 'Sheets' }
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    title: "SkoolConnectNG",
    description: "Social media startup featuring a secure, role-based verification system for students and alumni.",
    longDescription: "A secure, robust social networking startup custom-tailored for higher education in Nigeria. It connects verified students and alumni under matching academic domains. Engineered with a highly resilient Django REST Framework backend and a modular React frontend featuring encrypted JSON web tokens, granular security policies, and rapid REST queries.",
    tech: ["React", "Django", "Django REST Framework", "PostgreSQL", "Tailwind CSS", "JWT Auth"],
    type: "web",
    features: [
      "Restricts registration strictly through institutional domain authentication protocols.",
      "Optimizes backend performance using indexed PostgreSQL relations and query caching.",
      "Maintains zero session leaks under high-concurrent socket requests."
    ],
    metrics: "99.9% verification fidelity, <200ms API response time",
    githubUrl: "#"
  },
  {
    title: "Prince & Princess Store",
    description: "High-performance luxury retail e-commerce suite meticulously optimized for Google Search indexing.",
    longDescription: "A performance-tuned storefront engineered to secure top-tier organic Google Search visibility. Features dynamic serverless generation, structured JSON-LD schema.org metadata injection, and pre-rendered layout scripts matching high-fidelity device bounds to minimize paint lag.",
    tech: ["Next.js (React)", "Vite Build System", "PostgreSQL", "Tailwind CSS", "Schema Markup / SEO"],
    type: "web",
    features: [
      "100/100 Google Lighthouse Core Web Vitals score.",
      "Automatic dynamic structured semantic tags to populate Rich Search snippets.",
      "Instantaneous checkout workflows with dynamic Client-Side Cart states."
    ],
    metrics: "100/100 Core Web Vitals, LCP < 1.0s",
    githubUrl: "#"
  },
  {
    title: "Desktop Typing Speed Test",
    description: "High-precision desktop application featuring dynamic theme toggles and custom performance metrics.",
    longDescription: "A custom desktop-native application engineered with Python and Tkinter. Includes high-frequency typing speed sensors, keypress latency logging, error analytics, and a dynamic configuration portal that morphs widgets based on selected theme templates.",
    tech: ["Python", "Tkinter GUI", "Custom Widgets", "Data Persist Layer", "Threaded Timers"],
    type: "data",
    features: [
      "Captures keystroke metrics with microsecond precision timers.",
      "Implements dynamic custom grid theme engines built natively on Python widgets.",
      "Generates exportable Excel sheet aggregates showing performance metrics over history."
    ],
    metrics: "Sub-millisecond input lag, standalone binary packaging",
    githubUrl: "#"
  }
];
