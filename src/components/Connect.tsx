import { Download, Mail } from "lucide-react";
import { profile } from "../content/profile";
import { Reveal } from "./Reveal";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./icons";

const CARDS = [
  {
    title: "Resume",
    note: "Full adventure log.",
    cta: "Loot →",
    color: "#b45309",
    href: profile.resume,
    Icon: Download,
    external: true,
  },
  {
    title: "LinkedIn",
    note: "Join the party.",
    cta: "Connect →",
    color: "#0A66C2",
    href: profile.socials.linkedin,
    Icon: LinkedinIcon,
    external: true,
  },
  {
    title: "Email",
    note: "Send a raven.",
    cta: "Message →",
    color: "#c2410c",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`,
    Icon: Mail,
    external: true,
  },
  {
    title: "GitHub",
    note: "Read the source.",
    cta: "Fork →",
    color: "#27272a",
    href: profile.socials.github,
    Icon: GithubIcon,
    external: true,
  },
  {
    title: "Instagram",
    note: "Building in public.",
    cta: "Follow →",
    color: "#E1306C",
    href: profile.socials.instagram,
    Icon: InstagramIcon,
    external: true,
  },
];

export function Connect() {
  return (
    <section
      id="connect"
      className="relative overflow-hidden py-20 px-6 lg:py-24"
      style={{ background: "linear-gradient(180deg, #eef6dd 0%, #f4f9e9 55%, #e6efd5 100%)" }}
    >
      {/* soft golden light + meadow floor line */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,184,0,0.09) 0%, transparent 62%)" }}
      />
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-90">
        <path
          d="M0,220 L0,150 C120,120 240,150 360,130 C520,105 640,140 800,125 C960,110 1120,140 1290,120 C1350,112 1400,125 1440,118 L1440,220 Z"
          fill="#dce9c6"
        />
        <ellipse cx="120" cy="218" rx="60" ry="16" fill="#1a3a0a" opacity="0.9" />
        <ellipse cx="1360" cy="218" rx="70" ry="16" fill="#1a3a0a" opacity="0.9" />
      </svg>

      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.32em] text-earth uppercase">Treasure Found</p>
            <h2 className="font-heading mb-3 text-4xl font-bold text-forest-deep sm:text-5xl">Let&apos;s Connect</h2>
            <p className="mx-auto max-w-sm text-sm text-forest/50">take what you need, adventurer.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={0.05 * i} y={20}>
              <a
                href={card.href}
                {...(card.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group block h-full"
              >
                <div className="flex h-full flex-col items-center rounded-2xl border-2 border-forest/10 bg-white p-5 text-center transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl sm:p-6">
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${card.color}14`, color: card.color }}
                  >
                    <card.Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading mb-1 text-base font-bold text-forest-deep sm:text-lg">{card.title}</h3>
                  <p className="mb-4 hidden flex-1 text-xs text-forest/40 sm:block">{card.note}</p>
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-transform duration-200 group-hover:scale-105"
                    style={{ color: card.color, background: `${card.color}14` }}
                  >
                    {card.cta}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
