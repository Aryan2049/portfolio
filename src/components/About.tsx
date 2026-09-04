import { useState } from "react";
import { GraduationCap, Mail, Download } from "lucide-react";
import { profile } from "../content/profile";
import { EmberSwarm, Twinkles } from "./Ambience";
import { Reveal } from "./Reveal";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from "./icons";

/* ── Double-flame wall torch (reused left & right of the cave) ── */

function Torch({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 80 100" className="w-16 lg:w-20" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      {/* bracket */}
      <rect x="28" y="58" width="24" height="5" rx="1.5" fill="#3A302A" />
      <rect x="32" y="62" width="16" height="3" rx="1" fill="#2E2622" />
      {/* arm + head (left tilt) */}
      <g transform="rotate(-25 40 60)">
        <rect x="37" y="30" width="6" height="35" rx="2" fill="#5C4A3A" />
        <rect x="36" y="28" width="8" height="5" rx="1.5" fill="#4A3A2E" />
        <rect x="36.5" y="42" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.7" />
        <rect x="36.5" y="48" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.5" />
        <path
          className="torch-flame-1"
          d="M40,6 C43,13 50,20 48,27 C47,30 44,31 40,31 C36,31 33,30 32,27 C30,20 37,13 40,6Z"
          fill="#FF8236"
        />
        <path
          className="torch-flame-2"
          d="M40,12 C42,16 47,22 46,27 C45,29 43,30 40,30 C37,30 35,29 34,27 C33,22 38,16 40,12Z"
          fill="#FFB800"
        />
        <path
          className="torch-flame-3"
          d="M40,18 C41,21 44,24 43,27 C43,28 41,29 40,29 C39,29 37,28 37,27 C36,24 39,21 40,18Z"
          fill="#FFF0D0"
        />
      </g>
      {/* arm + head (right tilt) */}
      <g transform="rotate(25 40 60)">
        <rect x="37" y="30" width="6" height="35" rx="2" fill="#5C4A3A" />
        <rect x="36" y="28" width="8" height="5" rx="1.5" fill="#4A3A2E" />
        <rect x="36.5" y="42" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.7" />
        <rect x="36.5" y="48" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.5" />
        <path
          className="torch-flame-4"
          d="M40,6 C43,13 50,20 48,27 C47,30 44,31 40,31 C36,31 33,30 32,27 C30,20 37,13 40,6Z"
          fill="#FF8236"
        />
        <path
          className="torch-flame-5"
          d="M40,12 C42,16 47,22 46,27 C45,29 43,30 40,30 C37,30 35,29 34,27 C33,22 38,16 40,12Z"
          fill="#FFB800"
        />
        <path
          className="torch-flame-6"
          d="M40,18 C41,21 44,24 43,27 C43,28 41,29 40,29 C39,29 37,28 37,27 C36,24 39,21 40,18Z"
          fill="#FFF0D0"
        />
      </g>
    </svg>
  );
}

function WallTorch({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`absolute top-[40%] z-20 hidden -translate-y-1/2 md:block ${
        side === "left" ? "left-2 sm:left-6 lg:left-10" : "right-2 sm:right-6 lg:right-10"
      }`}
    >
      {/* warm light pool on the wall */}
      <div
        className="pointer-events-none absolute -top-6 left-1/2 h-48 w-36 -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(255,130,54,0.16) 0%, rgba(255,184,0,0.05) 50%, transparent 75%)",
        }}
      />
      <Torch flip={side === "right"} />
    </div>
  );
}

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: profile.socials.linkedin, Icon: LinkedinIcon },
  { label: "Email", href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`, Icon: Mail },
  { label: "GitHub", href: profile.socials.github, Icon: GithubIcon },
  { label: "YouTube", href: profile.socials.youtube, Icon: YoutubeIcon },
  { label: "X", href: profile.socials.x, Icon: XIcon },
  { label: "Instagram", href: profile.socials.instagram, Icon: InstagramIcon },
];

/* ── Vines hanging from the cave mouth (like shubhamgl.com) ──
   Four hand-drawn vines: two drop from the top corners, two creep in
   from the side edges, all swaying slowly. */

const LEAF = (cx: number, cy: number, rot: number, color: string) => (
  <ellipse cx={cx} cy={cy} rx="6" ry="3.5" fill={color} opacity="0.75" transform={`rotate(${rot} ${cx} ${cy})`} />
);

function CaveVines() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden lg:block" aria-hidden="true">
      {/* top-left vine */}
      <svg viewBox="78 0 66 300" className="vine-sway absolute top-0 left-[6%] h-[30vh] w-auto" style={{ animationDuration: "8.5s" }}>
        <path d="M100,0 Q95,50 110,100 Q120,150 105,200 Q95,240 112,280" fill="none" stroke="#2D5016" strokeWidth="2.5" strokeLinecap="round" />
        {LEAF(100, 55, -25, "#2D5016")}
        {LEAF(115, 120, 20, "#2D5016")}
        {LEAF(100, 195, -15, "#2D5016")}
        {LEAF(110, 260, 25, "#2D5016")}
      </svg>
      {/* top-right vine */}
      <svg viewBox="1050 0 66 300" className="vine-sway absolute top-0 right-[6%] h-[30vh] w-auto" style={{ animationDuration: "9.5s", animationDelay: "1.2s" }}>
        <path d="M1080,0 Q1090,50 1075,105 Q1065,150 1085,200 Q1095,245 1078,285" fill="none" stroke="#1A3A0A" strokeWidth="2.5" strokeLinecap="round" />
        {LEAF(1085, 55, 20, "#1A3A0A")}
        {LEAF(1070, 115, -15, "#1A3A0A")}
        {LEAF(1088, 210, 25, "#1A3A0A")}
        {LEAF(1080, 270, -20, "#1A3A0A")}
      </svg>
      {/* left-side vine */}
      <svg viewBox="0 100 110 230" className="vine-sway absolute top-[16%] left-0 h-[38vh] w-auto" style={{ animationDuration: "7.5s", animationDelay: "0.6s" }}>
        <path d="M0,120 Q40,125 75,160 Q100,195 85,240 Q70,275 90,310" fill="none" stroke="#2D5016" strokeWidth="2.5" strokeLinecap="round" />
        {LEAF(45, 130, 10, "#2D5016")}
        {LEAF(85, 175, 35, "#2D5016")}
        {LEAF(80, 250, 15, "#2D5016")}
        {LEAF(88, 295, 30, "#2D5016")}
      </svg>
      {/* right-side vine */}
      <svg viewBox="1100 135 110 205" className="vine-sway absolute top-[20%] right-0 h-[30vh] w-auto" style={{ animationDuration: "10s", animationDelay: "2s" }}>
        <path d="M1200,150 Q1160,155 1130,185 Q1110,215 1125,260 Q1140,295 1120,330" fill="none" stroke="#1A3A0A" strokeWidth="2.5" strokeLinecap="round" />
        {LEAF(1155, 160, -10, "#1A3A0A")}
        {LEAF(1120, 200, -35, "#1A3A0A")}
        {LEAF(1130, 270, -15, "#1A3A0A")}
        {LEAF(1122, 315, -30, "#1A3A0A")}
      </svg>
    </div>
  );
}

/* ── Portrait card ──
   Drops in a real photo from /me.jpg when present (drop the file in
   `public/me.jpg`). Until then it shows a generated "player card". The photo
   gets a warm duotone filter so it sits naturally in the night scene. */

function PortraitCard() {
  const [photoState, setPhotoState] = useState<"pending" | "ok" | "missing">("pending");
  const showPhoto = photoState === "ok";
  const initial = profile.name.charAt(0);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-ember/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* photo (when public/me.jpg exists) — warmed to match the cave */}
      <img
        src="/me.webp"
        alt={`${profile.name} — portrait`}
        onLoad={() => setPhotoState("ok")}
        onError={() => setPhotoState("missing")}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          showPhoto ? "opacity-100" : "opacity-0"
        }`}
        style={{ filter: "sepia(0.28) saturate(1.05) contrast(1.06) brightness(0.82)" }}
      />
      {/* warm torchlight tint over the photo */}
      {showPhoto && (
        <>
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(165deg, rgba(255,150,80,0.35) 0%, rgba(255,184,0,0.14) 45%, rgba(20,12,4,0.55) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)" }}
          />
        </>
      )}

      {/* generated player-card backdrop (used until a photo exists) */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${showPhoto ? "opacity-0" : "opacity-100"}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b16] via-[#0a130f] to-[#071009]" />
        <Twinkles count={22} />
        {/* moon */}
        <div
          className="absolute rounded-full"
          style={{ top: "10%", right: "14%", width: 46, height: 46, background: "#FFF8E8", boxShadow: "0 0 44px 12px rgba(255,248,232,0.16)" }}
        />
        {/* big initial watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-[11rem] font-extrabold text-gold/[0.07] select-none">{initial}</span>
        </div>
        {/* valley floor */}
        <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[38%] w-full">
          <path
            d="M0,300 L0,210 C60,180 110,215 170,190 C230,165 300,200 400,170 L400,300 Z"
            fill="#0e1a0e"
          />
          <path
            d="M0,300 L0,250 C80,225 150,260 240,240 C300,227 360,245 400,235 L400,300 Z"
            fill="#060f06"
          />
        </svg>
        {/* fireflies */}
        {[
          { l: "16%", b: "24%", d: 0.2 },
          { l: "74%", b: "34%", d: 1.4 },
          { l: "46%", b: "14%", d: 2.6 },
          { l: "86%", b: "12%", d: 3.2 },
        ].map((f, i) => (
          <span
            key={i}
            className="firefly absolute h-1 w-1 rounded-full bg-gold"
            style={{
              left: f.l,
              bottom: f.b,
              boxShadow: "0 0 6px #FFB800",
              animationDelay: `${f.d}s`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* gradient + caption */}
      <div
        className="absolute inset-x-0 bottom-0 p-5"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)" }}
      >
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="font-heading text-2xl leading-tight font-bold text-white">{profile.name}</h3>
            <p className="text-[11px] tracking-[0.2em] text-white/75 uppercase">{profile.characterClass}</p>
          </div>
          <div className="rounded-lg border border-gold/35 bg-gold/10 px-2.5 py-1 text-right">
            <span className="font-heading text-base font-bold text-gold">Lv. {profile.level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section ── */

export function About() {
  return (
    <section
      id="about"
      className="relative -mt-px overflow-hidden py-20 lg:py-24"
      style={{ background: "linear-gradient(180deg, #17110b 0%, #2A2218 18%, #241c12 60%, #1c150d 100%)" }}
    >
      {/* subtle warm center light + vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 12%, rgba(255,130,54,0.07) 0%, transparent 65%)",
        }}
      />
      <div className="vignette pointer-events-none absolute inset-0 z-[1]" />
      <EmberSwarm count={14} mode="rise" className="z-[1]" />

      <WallTorch side="left" />
      <WallTorch side="right" />

      {/* vines creeping down the cave walls */}
      <CaveVines />

      <div className="relative z-20 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.32em] text-ember uppercase">About</p>
          <h2 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">Character Sheet</h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <Reveal delay={0.08}>
            <PortraitCard />
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-mortar/95 px-6 py-6">
              <div className="space-y-4">
                {profile.bio.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-ash/80">
                    {para
                      .split(/(Java|DSA|Web Development|Core CS|AI|Machine Learning|Deep Learning|real applications)/g)
                      .map((part, j) =>
                        /^(Java|DSA|Web Development|Core CS|AI|Machine Learning|Deep Learning|real applications)$/.test(
                          part,
                        ) ? (
                          <span key={j} className="font-semibold text-white">
                            {part}
                          </span>
                        ) : (
                          part
                        ),
                      )}
                  </p>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-lg border-2 border-ember/25 bg-ember/10 px-3 py-1.5 text-xs font-semibold text-ash">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0 text-ember" />
                  <span>
                    {profile.education.school} · {profile.education.period}
                    <span className="mt-0.5 block text-[10px] font-normal text-ash/60">
                      {profile.education.degree}
                    </span>
                  </span>
                </span>
              </div>

              <div className="my-6 hidden h-px w-full bg-white/10 md:block" />
              <div className="hidden md:block">
                <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ember uppercase">Skills</p>
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-white/15 bg-white/[0.08] px-2.5 py-1 text-xs font-medium text-ash/90 transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="h-px w-full bg-white/10" />
                <p className="mb-3 mt-6 text-xs font-semibold tracking-[0.3em] text-ember uppercase">Connect</p>
                <div className="flex flex-wrap items-center gap-2">
                  {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-ash/60 transition-colors hover:border-ember/50 hover:text-ember"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-ember/35 bg-ember/10 px-3 py-1.5 text-[11px] font-semibold text-ember transition-colors hover:bg-ember/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Resume
                  </a>
                </div>
              </div>

              <p className="mt-6 border-t border-white/10 pt-4 text-center font-heading text-[12px] font-semibold tracking-wide text-gold/85 italic">
                {profile.motto}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Achievements */}
        <div className="mt-16">
          <Reveal>
            <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-ember uppercase">
              Achievements Unlocked
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {profile.achievements.map((a, i) => {
              const unlocked = (a as { unlocked?: boolean }).unlocked !== false;
              const glowColors = ["#FFB800", "#1A7A6D", "#FF8236", "#8B6F47", "#C0392B", "#5C4A3A"];
              const glowColor = glowColors[i % glowColors.length];

              return (
                <Reveal key={a.title} delay={0.05 * i}>
                  <div className="group flex cursor-default flex-col items-center text-center">
                    <div className="relative mb-3">
                      {/* hover halo */}
                      <div
                        className="absolute -inset-2 rounded-full opacity-0 blur-lg transition-all duration-300 group-hover:-inset-4 group-hover:opacity-100 group-hover:blur-xl"
                        style={{ background: `${glowColor}30` }}
                      />
                      <div
                        className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_${glowColor}]"
                        style={{ borderColor: unlocked ? `${glowColor}66` : `${glowColor}33` }}
                      >
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full border bg-mortar"
                          style={{ borderColor: unlocked ? `${glowColor}66` : `${glowColor}22` }}
                        >
                          <span className={`font-heading font-bold ${
                            unlocked ? "text-gold" : "text-white/40"
                          } ${a.medal.length > 6 ? "px-1 text-[8px]" : a.medal.length > 4 ? "px-1 text-[10px]" : "text-[11px]"}`}>
                            {a.medal}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] leading-tight text-ash/85 transition-colors group-hover:text-white">
                      {a.title}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
