import { ArrowUp, Mail } from "lucide-react";
import { profile } from "../content/profile";
import { Twinkles } from "./Ambience";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from "./icons";

const SOCIALS = [
  { label: "LinkedIn", href: profile.socials.linkedin, Icon: LinkedinIcon },
  { label: "Email", href: `mailto:${profile.email}`, Icon: Mail },
  { label: "GitHub", href: profile.socials.github, Icon: GithubIcon },
  { label: "YouTube", href: profile.socials.youtube, Icon: YoutubeIcon },
  { label: "X", href: profile.socials.x, Icon: XIcon },
  { label: "Instagram", href: profile.socials.instagram, Icon: InstagramIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  const firstName = profile.name.split(" ")[0];
  const initial = profile.name.charAt(0);

  return (
    <footer className="relative overflow-hidden bg-night pt-20 pb-12 px-6">
      <Twinkles count={15} />
      {/* fireflies */}
      {[
        { l: "12%", t: "30%" },
        { l: "30%", t: "62%" },
        { l: "62%", t: "26%" },
        { l: "82%", t: "48%" },
        { l: "48%", t: "70%" },
      ].map((f, i) => (
        <span
          key={i}
          className={`firefly firefly-d${i % 7} absolute h-1.5 w-1.5 rounded-full bg-gold/70`}
          style={{ left: f.l, top: f.t, boxShadow: "0 0 6px #FFB800" }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* monogram */}
        <a href="#top" aria-label="Back to top" className="group inline-flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/40 bg-gold/10 font-heading text-xl font-extrabold text-gold transition-all group-hover:scale-105 group-hover:bg-gold/20">
            {initial}
          </span>
          <span className="mt-2 text-[10px] tracking-[0.25em] text-white/40 uppercase transition-colors group-hover:text-gold/80">
            {firstName.toLowerCase()} · dev
          </span>
        </a>

        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-white/45">
          {profile.tagline}
        </p>

        {/* socials */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 border-t border-white/[0.07] pt-6">
          <p className="text-xs text-white/35">
            © {year} {profile.name} · forged with React, Tailwind &amp; Framer Motion
          </p>
          <a
            href="#top"
            aria-label="Back to top"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
