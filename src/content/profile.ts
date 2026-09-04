/**
 * ─────────────────────────────────────────────────────────────────────────
 *  EDIT ME — every word on the site lives here.
 *
 *  Name, school & bio are real. `journey` stops, `achievements`, `projects`,
 *  `sideQuests` and links are still placeholders/examples — swap them for
 *  your real experience, medals and apps.
 *    - `journey` stops (oldest first — replace the learning chapters with
 *      real jobs/internships as you level up)
 *    - `achievements`, `projects`, `sideQuests`, `socials`, `resume`, `email`
 *  …and the whole site — including the AI assistant — updates automatically.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface JourneyStop {
  id: string;
  /** One-letter badge shown on the trail map + campsite card */
  letter: string;
  org: string;
  role: string;
  period: string;
  /** Fictional "level" — raise it as your XP grows 🙂 */
  lv: number;
  blurb: string;
  stack: string[];
  /** Position on the trail map, in % (oldest starts near the bottom) */
  x: number;
  y: number;
  current?: boolean;
}

export interface Project {
  name: string;
  numeral: string;
  year: string;
  blurb: string;
  stack: string[];
  /** Accent colors used for the artifact thumbnail */
  hueA: string;
  hueB: string;
  github?: string;
  live?: string;
}

export const profile = {
  name: "Aryan Srivastava",
  /** Class line on the character sheet card */
  characterClass: "Explorer",
  /** XP level shown on the character sheet */
  level: 20,
  tagline:
    "B.Tech Computer Science & Business System @ NIT — building, learning and solving problems, one project at a time.",
  location: "Kolkata, India",
  email: "aryankanak2006@gmail.com",
  resume: "/resume.pdf",
  availability: "Open to 2026 internships & collaborations",
  bio: [
    "I'm a Computer Science student passionate about building, learning, and solving problems.",
    "Right now I'm sharpening my skills in Java, DSA, Web Development and Core CS — building projects that turn ideas into real applications. I'm also exploring AI, Machine Learning and Deep Learning to understand how intelligent systems are built.",
    "I learn best by building. Every project is another chance to understand something new, break something, fix it, and come back better.",
  ],
  education: {
    school: "Narula Institute of Technology",
    degree: "B.Tech · Computer Science & Business System",
    period: "2025 — 2029",
  },
  /** Shown under the character card as flavor */
  motto: "Build → Learn → Improve → Repeat",
  /** The three "what I do" blurbs — also feeds the AI assistant */
  focus: [
    {
      icon: "code",
      title: "Java & DSA",
      blurb: "Data structures, algorithms and clean Java — grinding problems daily to build foundations that never crack.",
    },
    {
      icon: "server",
      title: "Web Development",
      blurb: "Turning ideas into real applications — HTML, CSS, JavaScript and React, shipped end to end.",
    },
    {
      icon: "book",
      title: "AI / ML",
      blurb: "Exploring machine and deep learning to understand how intelligent systems are actually built.",
    },
  ],
  skills: [
    "Java",
    "Python",
    "C",
    "JavaScript",
    "TypeScript",
    "React",
    "HTML/CSS",
    "SQL",
    "Data Structures & Algorithms",
    "OOP",
    "DBMS",
    "Operating Systems",
    "Git",
    "Machine Learning",
  ],
  /** Journey So Far — oldest first, so it reads bottom of the trail → top.
      Narula is Lv. 16 where the quest starts; every stop above it is a skill
      learned since. (Learning chapters for now — swap in real gigs as they
      happen.) */
  journey: [
    {
      id: "nit",
      letter: "N",
      org: "Narula Institute of Technology",
      role: "B.Tech · Computer Science & Business System",
      period: "2025 — 2029",
      lv: 16,
      blurb:
        "The quest begins here. Joined NIT's Computer Science & Business System program in 2025 — walking in curious, ready to build, learn and solve problems one project at a time.",
      stack: ["CS & Business System", "B.Tech"],
      x: 18,
      y: 90.67,
    },
    {
      id: "first-code",
      letter: "C",
      org: "First Code",
      role: "Where the spark caught",
      period: "2025 —",
      lv: 17,
      blurb:
        "First real programs in Java and C, first ugly-but-working web pages — and the moment it clicked that code can make a computer do almost anything you can imagine.",
      stack: ["Java", "C", "HTML"],
      x: 78,
      y: 73.33,
    },
    {
      id: "foundations",
      letter: "F",
      org: "Foundations",
      role: "Java · DSA · Core CS",
      period: "2025 —",
      lv: 18,
      blurb:
        "The grind: data structures and algorithms in Java, OOP, DBMS and operating systems. Solving problems daily so the harder quests later feel like second nature.",
      stack: ["Java", "DSA", "DBMS", "OS"],
      x: 22,
      y: 53.33,
    },
    {
      id: "webdev",
      letter: "W",
      org: "Web Development",
      role: "Ideas → real applications",
      period: "2025 —",
      lv: 19,
      blurb:
        "Building things that live on the internet — HTML, CSS, JavaScript and React — because a project you can open in a browser teaches more than ten tutorials.",
      stack: ["JavaScript", "React", "HTML/CSS"],
      x: 75,
      y: 33.33,
    },
    {
      id: "aiml",
      letter: "A",
      org: "AI & ML",
      role: "Learning intelligent systems",
      period: "2025 —",
      lv: 20,
      current: true,
      blurb:
        "You are here. Right now I'm exploring machine learning and deep learning — from how models learn to what 'intelligence' in a machine actually means, one experiment at a time.",
      stack: ["Python", "ML", "Deep Learning"],
      x: 35,
      y: 15.33,
    },
  ] satisfies JourneyStop[],

  /** Medals shown in Achievements Unlocked — real wins first, locked ones for future */
  achievements: [
    { medal: "82%", title: "PCM Board Score", unlocked: true },
    { medal: "128th", title: "Rank in CEE-APMAI", unlocked: true },
    { medal: "Participated", title: "Hack-O-NiT", unlocked: true },
    { medal: "🔒", title: "Future Quest", unlocked: false },
    { medal: "🔒", title: "Future Quest", unlocked: false },
    { medal: "🔒", title: "Future Quest", unlocked: false },
  ],

  /** Quest Log — the main showcase projects */
  projects: [
    {
      name: "Otakul.co",
      numeral: "I",
      year: "2025",
      blurb:
        "Anime discussion platform with a 14k+ title catalog, real-time community chat, GIF search via Giphy, per-country streaming availability (US/Japan from JustWatch), email verification, and episode thumbnails from TVmaze. Built as a full-stack Flask app with SQLite, WebSocket-ready chat, and a rich anime discovery experience.",
      stack: ["Python", "Flask", "SQLite", "Giphy API", "JustWatch", "TVmaze"],
      hueA: "#FF4444",
      hueB: "#1a0a0a",
      github: "https://github.com/harshwardhan-shrivastava/Anime-chat",
      live: "https://otakul.co",
    },
    {
      name: "Krishi AI",
      numeral: "II",
      year: "2025",
      blurb:
        "An AI-powered platform for farmers — leveraging machine learning to provide crop recommendations, disease detection, and agricultural insights to help modernize farming practices.",
      stack: ["Python", "Machine Learning", "AI", "Flask"],
      hueA: "#2d5016",
      hueB: "#0a130f",
      github: "https://github.com/Aryan2049/krishi-Ai",
      live: "",
    },
  ] satisfies Project[],

  /** Side Quests — smaller experiments worth a mention (sample entries) */
  sideQuests: [
    {
      title: "Regex Ranger",
      blurb: "A tiny visual playground that animates regex matches as you type — built to finally make the syntax click.",
      stack: ["TypeScript", "React"],
    },
    {
      title: "Discord Study Bot",
      blurb: "Server bot for focus rooms: pomodoro timers, streak pings, and gentle shaming when someone checks Twitter.",
      stack: ["Python", "PostgreSQL"],
    },
    {
      title: "Chess Engine",
      blurb: "A pet-project engine using alpha-beta pruning with a transposition table — still loses to Stockfish, beats me.",
      stack: ["C++"],
    },
    {
      title: "GradeGlimpse",
      blurb: "CLI that turns a messy marks export into a clean GPA projection with target-grade planning.",
      stack: ["Python", "SQL"],
    },
    {
      title: "Course Scout",
      blurb: "Watches the university course catalogue and pings you the second a full section opens up.",
      stack: ["Node.js", "Redis"],
    },
    {
      title: "PomoPeak",
      blurb: "A terminal pomodoro with stats, a streak graph made of pure ASCII, and zero notifications allowed.",
      stack: ["Go"],
    },
  ],

  socials: {
    github: "https://github.com/Aryan2049",
    instagram: "https://instagram.com/capt._aryashriva",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
    youtube: "https://youtube.com",
  },

  /** Facts the AI assistant uses to answer questions about you */
  facts: [
    "First-year B.Tech student in Computer Science & Business System at Narula Institute of Technology (2025–2029).",
    "Currently sharpening Java, DSA, web development and core CS.",
    "Exploring AI, machine learning and deep learning.",
    "Learns best by building — motto: Build → Learn → Improve → Repeat.",
    "Answers email within a day or two — the email address is in the contact section.",
    "Open to internships and collaborations for 2026.",
    "Loves turning ideas into real applications over just reading about them.",
  ],
};

/** Things visitors can tap to start a chat */
export const suggestionPrompts = [
  "What are you working on right now?",
  "Which tech stack do you use?",
  "Are you available for internships?",
  "How can I contact you?",
];
