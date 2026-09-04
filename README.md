# Portfolio — a quest-themed single-page site

A dark, fantasy "adventure quest" portfolio for a CS student & full-stack
developer — inspired by the legendary shubhamgl.com design. One scroll takes a
visitor from a starry night jungle, through your character sheet in a torch-lit
cave, along a parchment trail-map of your journey, into a fire-lit quest log of
projects, and finally to a sunlit clearing where they can connect with you.

Built with **React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion** — no
backend.

## Run locally

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # typecheck + production build → dist/
bun run typecheck  # tsc --noEmit
```

## Make it yours

**Every word on the site lives in `src/content/profile.ts`.** Your name is set
to "Aryan Srivastava"; the rest is still *realistic placeholder* material
(companies, projects, achievements, links) — swap it for your real details:

| To change                    | Edit in `profile.ts`                                                    |
| ---------------------------- | ----------------------------------------------------------------------- |
| Your name & hero             | `name` (first name shows ember-orange, last name white)                 |
| Class line + XP level        | `characterClass`, `level`                                               |
| Bio / education / skills     | `bio`, `education`, `skills`                                            |
| Character sheet footer line  | `loves`                                                                 |
| Journey trail stops          | `journey` — one entry per job/experience, **oldest first**; each stop has a `letter`, `org`, `role`, `period`, `lv`, `blurb`, `stack` and a map position (`x`/`y` in %) |
| Achievements                 | `achievements` — `medal` (e.g. `1st`) + `title`                          |
| Featured projects            | `projects` — add/remove quest entries (`numeral`, `year`, `hueA`/`hueB` tint the artifact thumbnail) |
| Small experiments            | `sideQuests`                                                             |
| Contact cards                | `resume`, `email`, `socials`                                             |
| What the chatbot knows       | `facts` + everything else in the file                                    |
| Suggested chat questions     | `suggestionPrompts`                                                      |

A few notes:

- **Placeholder data:** every company, project, achievement and link in the
  data file is a sample. Swap them for real ones before sharing the link.
- **Trail positions:** keep stop `y` values roughly descending (bottom → top)
  so the path reads upward — the trail path auto-winds through the stops.
- **Photo spot:** drop a photo at `public/me.jpg` and the character-sheet
  portrait uses it automatically (it gets a warm duotone filter to match the
  night-cave scene). Without the file it falls back to a generated "player
  card".
- Colors, fonts & animations live in `src/index.css` (`@theme` tokens +
  keyframes). Fonts are Bricolage Grotesque (headings) + Montserrat (body),
  loaded in `index.html`.

## AI chatbot

The floating leather quill (bottom-right) opens a chat companion that answers
visitors' questions about you. It streams from **Groq** (free tier, OpenAI
compatible) when a Groq key is present, otherwise from **Anthropic** (Claude),
and only answers from `profile.ts` — it never invents facts.

To enable it:

1. **Recommended — Groq:** get a free key at console.groq.com, then add it in
   **Settings → Environment** as `VITE_GROQ_API_KEY`.
   - (Optional) `VITE_GROQ_MODEL` picks the model — default `openai/gpt-oss-120b`.
2. **Alternative — Anthropic:** add `VITE_ANTHROPIC_API_KEY`; optionally
   `VITE_ANTHROPIC_MODEL` (default `claude-sonnet-4-5`).

**Using one key in many places is fine** — API keys are account-level. The same
Groq/Anthropic key can power this portfolio and any other apps; this project
reads it from its sandbox env (preview) and its production env (deploy)
separately.

> Note: `VITE_`-prefixed keys are visible in the browser bundle. Fine for a
> personal portfolio; keep the key out of git and rotate it in the provider
> console if it ever leaks.

## Project structure

```
src/
  content/profile.ts   ← all editable site content
  lib/chat.ts          ← Anthropic streaming client (SSE)
  components/
    Hero.tsx           ← night jungle + starfield canvas + giant name
    About.tsx          ← torch-lit cave character sheet + achievements
    Journey.tsx        ← parchment trail map + campsite cards
    Projects.tsx       ← quest log (projects) + side quests
    Connect.tsx        ← meadow "treasure found" contact cards
    Footer.tsx         ← night sky with fireflies
    ChatWidget.tsx     ← leather/quill AI chat launcher + panel
    Ambience.tsx       ← decorative Twinkles & EmberSwarm particles
    Reveal.tsx, icons.tsx
  index.css            ← theme tokens, keyframes, utilities
```
