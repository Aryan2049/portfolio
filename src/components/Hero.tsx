import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { profile } from "../content/profile";

/* ── Dense twinkling starfield + falling stars, with mouse parallax ── */

interface StarSpec {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  major: boolean;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t0: number;
  life: number;
  tail: number;
  dead?: boolean;
}

function makeStars(n: number, w: number, h: number): StarSpec[] {
  const stars: StarSpec[] = [];
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < n; i++) {
    stars.push({
      x: rand() * w,
      y: rand() * h * 0.92,
      r: 0.4 + rand() * 1.15,
      phase: rand() * Math.PI * 2,
      speed: 0.6 + rand() * 1.6,
      major: i % 23 === 0, // occasional brighter star with a soft halo
    });
  }
  return stars;
}

function StarCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: StarSpec[] = [];
    let meteors: Meteor[] = [];
    let nextMeteorAt = 0;
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // dense field — feels like a real night sky
      stars = makeStars(w < 640 ? 240 : 520, w, h);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };

    const spawnMeteor = (t: number) => {
      const dir = Math.random() < 0.28 ? -1 : 1; // most fall to the right
      const life = 1100 + Math.random() * 900;
      meteors.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.32,
        vx: (dir * w * (0.12 + Math.random() * 0.2)) / life,
        vy: (h * (0.1 + Math.random() * 0.16)) / life,
        t0: t,
        life,
        tail: 70 + Math.random() * 110,
      });
    };

    const drawMeteor = (m: Meteor, t: number) => {
      const p = Math.min(1, (t - m.t0) / m.life);
      const x = m.x + m.vx * p * m.life;
      const y = m.y + m.vy * p * m.life;
      // fade out before slipping behind the treeline
      if (y > h * 0.58) {
        m.dead = true;
        return;
      }
      const fade =
        Math.sin(Math.PI * p) * (y > h * 0.5 ? Math.max(0, 1 - (y - h * 0.5) / (h * 0.08)) : 1);
      if (fade <= 0.02) {
        m.dead = true;
        return;
      }
      const len = Math.hypot(m.vx, m.vy) || 1;
      const ux = m.vx / len;
      const uy = m.vy / len;
      const g = ctx.createLinearGradient(x, y, x - ux * m.tail, y - uy * m.tail);
      g.addColorStop(0, `rgba(255,247,222,${0.95 * fade})`);
      g.addColorStop(0.3, `rgba(255,196,120,${0.45 * fade})`);
      g.addColorStop(1, "rgba(255,196,120,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - ux * m.tail, y - uy * m.tail);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,251,238,${fade})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const px = (pointer.current.x - 0.5) * 10;
      const py = (pointer.current.y - 0.5) * 6;

      for (const s of stars) {
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t / 1000) * s.speed + s.phase));
        if (s.major) {
          ctx.globalAlpha = tw * 0.16;
          ctx.fillStyle = "#ffe9c9";
          ctx.beginPath();
          ctx.arc(s.x - px * s.r * 2.2, s.y - py * s.r * 2.2, s.r * 4.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = tw;
        ctx.fillStyle = s.major ? "#ffe9c9" : s.r > 1.15 ? "#ffe9c9" : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x - px * s.r * 2.2, s.y - py * s.r * 2.2, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // falling stars
      if (!reduce && t >= nextMeteorAt && meteors.length < 2) {
        spawnMeteor(t);
        nextMeteorAt = t + 2400 + Math.random() * 3600;
      }
      if (meteors.length) {
        ctx.globalAlpha = 1;
        meteors = meteors.filter((m) => !m.dead);
        for (const m of meteors) drawMeteor(m, t);
      }

      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    if (!reduce) {
      nextMeteorAt = performance.now() + 1600; // first streak shortly after load
      raf = requestAnimationFrame(draw);
    } else {
      draw(0);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 z-[1] h-full w-full" aria-hidden="true" />;
}

/* ── Jungle silhouettes (layered hills + treeline) ── */

function JungleSilhouette() {
  const treeCx = useMemo(
    () => Array.from({ length: 10 }, (_, i) => 80 + i * 150 + (i % 3) * 20),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[54%] select-none sm:h-[60%] lg:h-[66%]">
      {/* distant hills */}
      <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 h-full w-full">
        <path
          d="M0,320 C60,280 100,220 180,240 C260,260 300,180 400,200 C500,220 540,160 640,180 C740,200 780,140 880,170 C980,200 1020,150 1100,175 C1180,200 1220,160 1300,190 C1380,220 1420,180 1440,200 L1440,500 L0,500Z"
          fill="#15221A"
        />
        <path
          d="M0,360 C80,330 140,270 240,290 C340,310 380,240 500,260 C620,280 660,220 780,240 C900,260 940,210 1060,235 C1180,260 1220,210 1340,240 C1400,255 1440,230 1440,240 L1440,500 L0,500Z"
          fill="#112018"
          opacity="0.85"
        />
      </svg>
      {/* mid ridge */}
      <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 h-[92%] w-full">
        <path
          d="M0,400 L0,300 C50,280 100,250 160,265 C220,280 260,240 330,235 C400,230 440,260 510,248 C580,236 620,210 700,220 C780,230 820,200 900,195 C980,190 1020,220 1100,210 C1180,200 1220,180 1300,195 C1380,210 1420,195 1440,200 L1440,500 L0,500Z"
          fill="#0E1A0E"
        />
      </svg>
      {/* treeline */}
      <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 h-[76%] w-full">
        {treeCx.map((cx, i) => (
          <ellipse
            key={cx}
            cx={cx}
            cy={358 + (i % 3) * 10}
            rx={78 + (i % 3) * 10}
            ry={48 + (i % 2) * 7}
            fill="#051403"
          />
        ))}
        <rect x="0" y="430" width="1440" height="70" fill="#051403" />
      </svg>
      {/* front bushes */}
      <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute bottom-0 h-[84%] w-full">
        <path
          d="M0,400 L0,310 C30,295 70,270 120,280 C170,290 200,255 260,248 C320,241 350,265 410,253 C470,241 510,260 570,248 C630,236 670,215 740,225 C810,235 840,208 910,200 C980,192 1010,220 1080,210 C1150,200 1190,180 1260,192 C1330,204 1380,188 1440,198 L1440,400Z"
          fill="#051403"
        />
      </svg>

      {/* campfire glowing at the heart of the clearing */}
      <Campfire />

      {/* fireflies hovering over the undergrowth */}
      {[
        { l: "12%", b: "42%", s: 5, d: "firefly-d0", o: 0.8 },
        { l: "26%", b: "54%", s: 3, d: "firefly-d1", o: 0.6 },
        { l: "41%", b: "36%", s: 5, d: "firefly-d2", o: 0.7 },
        { l: "58%", b: "48%", s: 3, d: "firefly-d3", o: 0.5 },
        { l: "73%", b: "38%", s: 5, d: "firefly-d4", o: 0.65 },
        { l: "88%", b: "50%", s: 3, d: "firefly-d5", o: 0.7 },
        { l: "96%", b: "34%", s: 5, d: "firefly-d6", o: 0.6 },
      ].map((f, i) => (
        <span
          key={i}
          className={`firefly ${f.d} absolute rounded-full bg-gold/80`}
          style={{
            left: f.l,
            bottom: f.b,
            width: f.s / 3.3,
            height: f.s / 3.3,
            boxShadow: "0 0 6px #FFB800",
            opacity: f.o,
          }}
        />
      ))}

      {/* hidden creatures peeking from the undergrowth */}
      <JungleEyes />
    </div>
  );
}

/* ── Campfire — layered flickering flames over crossed logs ── */

function Campfire() {
  return (
    <div className="pointer-events-none absolute bottom-[0.75%] left-1/2 z-[7] w-[150px] -translate-x-1/2 select-none sm:w-[180px] lg:w-[200px]">
      <svg viewBox="0 0 200 150" className="block h-auto w-full">
        {/* warm light pooling across the ground */}
        <ellipse cx="100" cy="140" rx="94" ry="13" fill="#FF8236" opacity="0.09" />
        <ellipse cx="100" cy="140" rx="58" ry="8" fill="#FFB800" opacity="0.13" />
        <g transform="translate(-548 -272) scale(0.9)">
          {/* breathing glow right behind the logs */}
          <ellipse
            className="campfire-glow"
            cx="720"
            cy="420"
            rx="30"
            ry="8"
            fill="#FF8236"
            opacity="0.35"
            style={{ animationDuration: "2.2s" }}
          />
          {/* crossed logs + knots */}
          <line x1="672" y1="440" x2="768" y2="432" stroke="#5C3D1E" strokeWidth="9" strokeLinecap="round" />
          <line x1="668" y1="431" x2="772" y2="440" stroke="#5C3D1E" strokeWidth="9" strokeLinecap="round" />
          <line x1="690" y1="444" x2="750" y2="444" stroke="#4A3018" strokeWidth="8" strokeLinecap="round" />
          <circle cx="672" cy="440" r="5" fill="#4A3018" />
          <circle cx="768" cy="432" r="5" fill="#4A3018" />
          <circle cx="668" cy="431" r="4.5" fill="#4A3018" />
          <circle cx="772" cy="440" r="4.5" fill="#4A3018" />
          {/* flame layers (each flickers on its own beat) */}
          <path
            className="campfire-flame"
            style={{ animationDuration: "1.3s", animationDelay: "0.3s" }}
            d="M720,394 C730,406 750,420 747,434 C744,440 734,444 720,444 C706,444 696,440 693,434 C690,420 710,406 720,394Z"
            fill="#FF8236"
          />
          <path
            className="campfire-flame"
            style={{ animationDuration: "1.2s", animationDelay: "0.1s" }}
            d="M720,402 C728,411 743,423 740,434 C738,439 730,442 720,442 C710,442 702,439 700,434 C697,423 712,411 720,402Z"
            fill="#FFB800"
          />
          <path
            className="campfire-flame"
            style={{ animationDuration: "1.05s", animationDelay: "0.45s" }}
            d="M720,410 C726,416 736,425 734,434 C733,438 727,440 720,440 C713,440 707,438 706,434 C704,425 714,416 720,410Z"
            fill="#FFD966"
          />
          <path
            className="campfire-flame"
            style={{ animationDuration: "1.15s", animationDelay: "0.25s" }}
            d="M720,418 C724,423 730,428 729,434 C728,437 725,439 720,439 C715,439 712,437 711,434 C710,428 716,423 720,418Z"
            fill="#FFF0D0"
          />
          {/* stones ringing the pit */}
          <ellipse cx="685" cy="442" rx="6" ry="3.5" fill="#2D2D2D" opacity="0.45" />
          <ellipse cx="755" cy="441" rx="5" ry="3" fill="#2D2D2D" opacity="0.4" />
          <ellipse cx="695" cy="446" rx="4" ry="2.5" fill="#2D2D2D" opacity="0.35" />
          <ellipse cx="748" cy="445" rx="5" ry="2.5" fill="#2D2D2D" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}

/* ── Glowing eyes that wake up as the cursor wanders the forest ── */

interface EyeSpot {
  l: number; // left %
  b: number; // bottom %
  size: number; // eye diameter px
  gap: number; // px between the two eyes
  tilt: number; // deg
  gain: number; // how eagerly this pair responds
  blink: string; // animation shorthand
  delay: number;
}

const EYE_COLORS = ["#ffd236", "#ffb800", "#ffce6b", "#ffe9a3"];

const EYE_SPOTS: EyeSpot[] = [
  { l: 6, b: 34, size: 3.6, gap: 5, tilt: -6, gain: 1, blink: "4.2s", delay: 0.4 },
  { l: 14, b: 23, size: 3, gap: 4, tilt: 8, gain: 0.7, blink: "3.6s", delay: 1.7 },
  { l: 23, b: 37, size: 4.2, gap: 6, tilt: -10, gain: 1, blink: "5s", delay: 0.9 },
  { l: 33, b: 25, size: 3, gap: 4, tilt: 12, gain: 0.65, blink: "3.1s", delay: 2.6 },
  { l: 44, b: 39, size: 3.4, gap: 5, tilt: -4, gain: 0.9, blink: "4.7s", delay: 1.1 },
  { l: 54, b: 26, size: 3, gap: 4, tilt: 6, gain: 0.7, blink: "3.9s", delay: 3.2 },
  { l: 64, b: 35, size: 4, gap: 5, tilt: -8, gain: 1, blink: "4.4s", delay: 0.2 },
  { l: 74, b: 22, size: 3.2, gap: 4, tilt: 9, gain: 0.75, blink: "3.4s", delay: 2 },
  { l: 84, b: 31, size: 3.8, gap: 5, tilt: -12, gain: 0.95, blink: "4.9s", delay: 1.4 },
  { l: 93, b: 38, size: 3, gap: 4, tilt: 5, gain: 0.7, blink: "3.7s", delay: 2.9 },
];

function JungleEyes() {
  const eyeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const zoneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    const apply = (clientX: number, clientY: number) => {
      const rect = zone.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const radius = Math.min(Math.max(rect.width * 0.11, 110), 210);
      for (let i = 0; i < EYE_SPOTS.length; i++) {
        const el = eyeRefs.current[i];
        if (!el) continue;
        const s = EYE_SPOTS[i];
        const ex = (rect.width * s.l) / 100;
        const ey = rect.height - (rect.height * s.b) / 100;
        const d = Math.hypot(ex - x, ey - y);
        const falloff = Math.max(0, 1 - d / radius);
        const intensity = s.gain * Math.pow(falloff, 1.6);
        el.style.opacity = intensity <= 0.04 ? "0" : String(0.12 + 0.88 * intensity);
      }
    };

    const onMove = (e: PointerEvent) => apply(e.clientX, e.clientY);
    const onLeave = () => {
      for (const el of eyeRefs.current) {
        if (el) el.style.opacity = "0";
      }
    };

    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={zoneRef}
      className="pointer-events-auto absolute inset-0 z-[8] cursor-default"
      aria-hidden="true"
    >
      {EYE_SPOTS.map((s, i) => (
        <span
          key={i}
          ref={(el) => {
            eyeRefs.current[i] = el;
          }}
          className="pointer-events-none absolute flex items-center transition-opacity duration-300 ease-out"
          style={{ left: `${s.l}%`, bottom: `${s.b}%`, opacity: 0, transform: `rotate(${s.tilt}deg)` }}
        >
          <span
            className="eye-blink rounded-full"
            style={{
              width: s.size,
              height: s.size,
              background: EYE_COLORS[i % EYE_COLORS.length],
              boxShadow: "0 0 5px 1px rgba(255,184,0,0.85), 0 0 12px 3px rgba(255,130,54,0.35)",
              animationDuration: s.blink,
              animationDelay: `${s.delay}s`,
            }}
          />
          <span style={{ width: s.gap }} />
          <span
            className="eye-blink rounded-full"
            style={{
              width: s.size,
              height: s.size,
              background: EYE_COLORS[(i + 2) % EYE_COLORS.length],
              boxShadow: "0 0 5px 1px rgba(255,184,0,0.85), 0 0 12px 3px rgba(255,130,54,0.35)",
              animationDuration: s.blink,
              animationDelay: `${s.delay}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}

/* ── Hero ── */

export function Hero() {
  const [first, last] = profile.name.split(" ");

  return (
    <section
      id="top"
      className="relative flex h-svh min-h-[620px] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#080E1C] via-[#0B1420] to-[#0E1A16]"
    >
      {/* night sky */}
      <StarCanvas />

      {/* moon */}
      <div className="absolute z-[2] rounded-full" style={{ top: "9%", right: "13%" }}>
        <div
          className="h-11 w-11 rounded-full bg-[#FFF8E8]"
          style={{ boxShadow: "0 0 40px 10px rgba(255,248,232,0.22), 0 0 90px 34px rgba(255,248,232,0.08)" }}
        />
      </div>

      {/* halo behind the name */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[3] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-[70%] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(255,130,54,0.16) 0%, rgba(255,184,0,0.06) 40%, transparent 68%)",
        }}
      />

      {/* name */}
      <div className="relative z-10 -mt-[10vh] px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 text-[13px] font-medium tracking-[0.32em] text-white/35 uppercase"
        >
          a new quest begins
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-[clamp(4rem,15vw,10.5rem)] leading-[0.88] font-extrabold tracking-tight"
        >
          <span
            className="block text-ember"
            style={{ textShadow: "0 0 60px rgba(255,130,54,0.35), 0 0 140px rgba(255,130,54,0.15)" }}
          >
            {first}
          </span>
          <span className="block text-white">{last}</span>
        </motion.h1>
      </div>

      {/* jungle */}
      <JungleSilhouette />

      {/* venture forth */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-[19%] left-1/2 z-20 -translate-x-1/2"
      >
        <a href="#about" className="group flex cursor-pointer flex-col items-center gap-2.5">
          <span className="text-[10px] font-medium tracking-[0.26em] text-white/45 uppercase transition-colors group-hover:text-white/75">
            venture forth
          </span>
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M9 3 L9 13 M4 9 L9 14 L14 9" stroke="#FF8236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </a>
      </motion.div>
    </section>
  );
}
