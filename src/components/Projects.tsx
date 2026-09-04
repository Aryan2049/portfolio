import { ArrowUpRight } from "lucide-react";
import { profile, type Project } from "../content/profile";
import { EmberSwarm } from "./Ambience";
import { Reveal } from "./Reveal";
import { GithubIcon } from "./icons";

/* Abstract "artifact" thumbnail — swap for real screenshots if you like */
function Artifact({ project }: { project: Project }) {
  const monogram = project.name.slice(0, 2).toUpperCase();
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg"
      style={{ background: `linear-gradient(140deg, ${project.hueA} 0%, ${project.hueB} 78%)` }}
    >
      {/* light shaft */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 30% 0%, rgba(255,255,255,0.16) 0%, transparent 55%), radial-gradient(ellipse 80% 70% at 90% 110%, rgba(0,0,0,0.35) 0%, transparent 60%)",
        }}
      />
      {/* rune ring */}
      <div className="absolute h-[78%] w-[78%] rounded-full border border-white/15" />
      <div className="absolute h-[58%] w-[58%] rounded-full border border-dashed border-white/20" />
      <span className="font-heading relative text-4xl font-extrabold text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        {monogram}
      </span>
      {/* year */}
      <span className="absolute right-2.5 bottom-2 font-mono text-[10px] font-medium tracking-widest text-white/60">
        {project.year}
      </span>
      {/* corner pin */}
      <span className="absolute top-2.5 left-2.5 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(255,184,0,0.9)]" />
    </div>
  );
}

function QuestCard({ project }: { project: Project }) {
  return (
    <div className="group relative cursor-pointer rounded-xl border border-white/10 p-6 backdrop-blur-sm transition-colors hover:border-white/25 sm:p-10"
      style={{
        background: "linear-gradient(135deg, rgba(30,15,15,0.9) 0%, rgba(20,10,10,0.95) 50%, rgba(30,15,15,0.9) 100%)",
        boxShadow:
          "0 0 60px rgba(180,30,30,0.06), 0 0 120px rgba(255,140,0,0.03), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* top shine line — brightens on hover */}
      <div
        className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 opacity-100 transition-opacity duration-300 group-hover:opacity-0"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,160,50,0.3), transparent)" }}
      />
      <div
        className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,160,50,0.55), transparent)" }}
      />
      {/* corner brackets */}
      <div className="absolute top-3 left-3 h-4 w-4 rounded-tl-sm border-t border-l border-amber-700/45 transition-colors group-hover:border-amber-500/70" />
      <div className="absolute top-3 right-3 h-4 w-4 rounded-tr-sm border-t border-r border-amber-700/45 transition-colors group-hover:border-amber-500/70" />
      <div className="absolute bottom-3 left-3 h-4 w-4 rounded-bl-sm border-b border-l border-amber-700/45 transition-colors group-hover:border-amber-500/70" />
      <div className="absolute right-3 bottom-3 h-4 w-4 rounded-br-sm border-r border-b border-amber-700/45 transition-colors group-hover:border-amber-500/70" />

      <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:gap-8">
        <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg border border-white/15 sm:h-36 sm:w-52">
          <Artifact project={project} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="font-heading text-2xl font-bold text-white transition-colors group-hover:text-amber-200 sm:text-3xl">
              {project.name}
            </h3>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">{project.blurb}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {project.stack.map((t) => (
          <span
            key={t}
            className="rounded-lg border border-red-800/30 bg-red-950/50 px-3 py-1 text-sm font-medium text-red-200/70"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-amber-500/70 hover:text-amber-300"
          >
            Link <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.name} on GitHub`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-amber-500/60 hover:text-amber-200"
          >
            <GithubIcon className="h-4 w-4" />
            Source
          </a>
        )}
      </div>

      {/* bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(180,30,30,0.3), transparent)" }}
      />
    </div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden py-24 px-6 lg:py-28"
      style={{ background: "linear-gradient(180deg, #1A0A0A 0%, #0D0808 50%, #1A0A0A 100%)" }}
    >
      {/* grain + red ambience */}
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,60,30,0.05) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 50% 100%, rgba(120,20,20,0.12) 0%, transparent 70%)",
        }}
      />
      {/* embers shed into the lair */}
      <EmberSwarm count={16} mode="fall" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="text-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.32em] text-red-400/70 uppercase">Quest Log</p>
            <h2 className="mt-2 font-heading text-4xl font-bold text-red-50 sm:text-5xl">Projects</h2>
            <p className="mx-auto mt-3 max-w-lg text-red-200/50">
              legendary encounters conquered, each worth remembering.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 space-y-12 sm:mt-16 sm:space-y-14">
          {profile.projects.map((project) => (
            <div key={project.name}>
              {/* numeral divider */}
              <div className="relative mb-6">
                <div
                  className="pointer-events-none absolute -top-10 left-1/2 h-20 w-44 -translate-x-1/2"
                  style={{
                    background:
                      "conic-gradient(from 180deg at 50% 0%, transparent 30%, rgba(255,180,60,0.07) 45%, rgba(255,180,60,0.12) 50%, rgba(255,180,60,0.07) 55%, transparent 70%)",
                  }}
                />
                <Reveal y={12}>
                  <div className="flex items-center justify-center gap-3">
                    <span className="h-px w-12 bg-amber-700/45" />
                    <span className="font-heading text-sm font-bold tracking-[0.35em] text-amber-500/90">
                      {project.numeral}
                    </span>
                    <span className="h-px w-12 bg-amber-700/45" />
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.05}>
                <QuestCard project={project} />
              </Reveal>
            </div>
          ))}
        </div>

        {/* Side quests */}
        <div className="mt-24">
          <Reveal>
            <div className="mb-10 flex items-center gap-4">
              <span className="h-px flex-1 bg-red-900/35" />
              <p className="text-xs font-semibold tracking-[0.32em] text-red-400/70 uppercase">Side Quests</p>
              <span className="h-px flex-1 bg-red-900/35" />
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.sideQuests.map((q, i) => (
              <Reveal key={q.title} delay={0.04 * i} y={20}>
                <div
                  className="group h-full rounded-xl border border-white/10 p-5 text-left transition-colors hover:border-white/25"
                  style={{ background: "linear-gradient(135deg, rgba(30,15,15,0.7) 0%, rgba(20,10,10,0.85) 100%)" }}
                >
                  <p className="mb-1.5 text-[10px] font-semibold tracking-[0.22em] text-amber-500 uppercase">
                    Side Quest
                  </p>
                  <h4 className="font-heading mb-2 text-lg font-bold text-white transition-colors group-hover:text-amber-300">
                    {q.title}
                  </h4>
                  <p className="mb-4 line-clamp-2 text-sm text-white/70">{q.blurb}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {q.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-red-900/30 bg-red-950/50 px-2 py-0.5 text-xs font-medium text-red-200/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
