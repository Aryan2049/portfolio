import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, type JourneyStop } from "../content/profile";
import { Reveal } from "./Reveal";

/* The trail map — a faithful replica of shubhamgl.com's Experience section.
   The map canvas is 1000 × 1500 user units; stop x/y in profile.ts are
   display percents (their px are /10 and /15). */

const TEAL = "#1A7A6D";

/* Main dashed trail (bottom → top, drawn through every stop) + the faint
   dashed spur that climbs from the current stop to the "next" treasure. */
const TRAIL_D =
  "M180,1360 C300,1230 700,1300 780,1100 C850,884 280,934 220,800 C160,650 700,634 750,500 C800,350 400,300 350,230";
const SPUR_D = "M350,230 C300,166 480,84 550,50";

/* Hand-drawn map scenery — same doodles as the original: sprouts, mountains,
   waves, a treasure chest, an anchor, a compass rose, "Terra Incognita"… */
function MapScenery() {
  return (
    <g>
      <g transform="translate(100, 1030)" opacity="0.25">
        <line x1="0" y1="0" x2="0" y2="30" stroke="#5C4A3A" strokeWidth="3" />
        <ellipse cx="-8" cy="-2" rx="12" ry="5" fill="#5C6B3A" transform="rotate(-30 -8 -2)" />
        <ellipse cx="8" cy="-4" rx="10" ry="4" fill="#5C6B3A" transform="rotate(25 8 -4)" />
        <ellipse cx="0" cy="-6" rx="11" ry="4.5" fill="#6B7B4A" transform="rotate(-5 0 -6)" />
      </g>
      <g transform="translate(900, 700)" opacity="0.2">
        <line x1="0" y1="0" x2="0" y2="25" stroke="#5C4A3A" strokeWidth="2.5" />
        <ellipse cx="-7" cy="-2" rx="10" ry="4" fill="#5C6B3A" transform="rotate(-25 -7 -2)" />
        <ellipse cx="6" cy="-3" rx="9" ry="3.5" fill="#5C6B3A" transform="rotate(30 6 -3)" />
      </g>
      <g opacity="0.15">
        <polygon points="50,500 80,400 110,500" fill="#8B6F47" />
        <polygon points="75,500 100,416 125,500" fill="#7A5F3A" />
        <polygon points="920,250 950,166 980,250" fill="#8B6F47" />
        <polygon points="940,250 965,184 990,250" fill="#7A5F3A" />
      </g>
      <g opacity="0.15">
        <path d="M0,1484 Q30,1466 60,1484 Q90,1500 120,1484 Q150,1466 180,1484 Q210,1500 240,1484 Q270,1466 300,1484 Q330,1500 360,1484 Q390,1466 420,1484 Q450,1500 480,1484 Q510,1466 540,1484 Q570,1500 600,1484 Q630,1466 660,1484 Q690,1500 720,1484 Q750,1466 780,1484 Q810,1500 840,1484 Q870,1466 900,1484 Q930,1500 960,1484 Q990,1466 1000,1484" fill="none" stroke="#6B8FBF" strokeWidth="2" />
        <path d="M0,1496 Q40,1480 80,1496 Q120,1510 160,1496 Q200,1480 240,1496 Q280,1510 320,1496 Q360,1480 400,1496 Q440,1510 480,1496 Q520,1480 560,1496 Q600,1510 640,1496 Q680,1480 720,1496 Q760,1510 800,1496 Q840,1480 880,1496 Q920,1510 960,1496 Q1000,1480 1000,1496" fill="none" stroke="#6B8FBF" strokeWidth="1.5" />
      </g>
      <g transform="translate(700, 1430)" opacity="0.2">
        <path d="M-15,0 Q-12,-8 0,-10 Q12,-8 15,0 Z" fill="#5C4A3A" />
        <line x1="0" y1="-10" x2="0" y2="-28" stroke="#5C4A3A" strokeWidth="1.5" />
        <path d="M0,-28 Q8,-22 0,-14" fill="#8B6F47" opacity="0.6" />
        <line x1="-10" y1="-2" x2="10" y2="-2" stroke="#5C4A3A" strokeWidth="1" />
      </g>
      <g opacity="0.12">
        <path d="M400,1450 Q420,1425 440,1444 Q460,1462 480,1440 Q500,1419 520,1444 Q530,1456 535,1444" fill="none" stroke="#5C6B3A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="535" cy="1438" r="4" fill="#5C6B3A" />
        <circle cx="533" cy="1435" r="1" fill="#3A2A1A" />
      </g>
      <g transform="translate(320, 1450)" opacity="0.15">
        <circle cx="0" cy="-12" r="4" fill="none" stroke="#5C4A3A" strokeWidth="1.5" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#5C4A3A" strokeWidth="1.5" />
        <path d="M-8,8 Q0,14 8,8" fill="none" stroke="#5C4A3A" strokeWidth="1.5" />
        <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#5C4A3A" strokeWidth="1.5" />
      </g>
      <g transform="translate(600, 84)" opacity="0.2">
        <rect x="-10" y="-4" width="20" height="12" rx="2" fill="#8B6F47" />
        <rect x="-10" y="-8" width="20" height="6" rx="2" fill="#A07850" />
        <line x1="-10" y1="-2" x2="10" y2="-2" stroke="#5C4A3A" strokeWidth="0.8" />
        <rect x="-2" y="-4" width="4" height="4" rx="1" fill="#FFB800" opacity="0.6" />
      </g>
      <g transform="translate(500, 970)" opacity="0.12">
        <line x1="-12" y1="-12" x2="12" y2="12" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="-12" x2="-12" y2="12" stroke="#5C4A3A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="0" r="3" fill="none" stroke="#5C4A3A" strokeWidth="1" />
      </g>
      <g opacity="0.1">
        <path d="M20,20 Q20,50 40,50 Q20,50 20,80" fill="none" stroke="#5C4A3A" strokeWidth="2" />
        <path d="M20,20 Q50,20 50,40 Q50,20 80,20" fill="none" stroke="#5C4A3A" strokeWidth="2" />
        <circle cx="20" cy="20" r="3" fill="#5C4A3A" />
        <path d="M980,1475 Q980,1434 960,1434 Q980,1434 980,1391" fill="none" stroke="#5C4A3A" strokeWidth="2" />
        <path d="M980,1475 Q950,1475 950,1450 Q950,1475 920,1475" fill="none" stroke="#5C4A3A" strokeWidth="2" />
        <circle cx="980" cy="1475" r="3" fill="#5C4A3A" />
      </g>
      <g transform="translate(180, 1460)" opacity="0.18">
        <ellipse cx="0" cy="0" rx="18" ry="6" fill="#C4A77D" />
        <line x1="2" y1="-2" x2="2" y2="-16" stroke="#5C4A3A" strokeWidth="1.5" />
        <ellipse cx="-3" cy="-14" rx="7" ry="3" fill="#5C6B3A" transform="rotate(-20 -3 -14)" />
        <ellipse cx="5" cy="-15" rx="6" ry="2.5" fill="#6B7B4A" transform="rotate(15 5 -15)" />
      </g>
      <g transform="translate(140, 900)" opacity="0.1">
        <circle cx="0" cy="0" r="8" fill="#8B6F47" />
        <circle cx="-3" cy="-1" r="2" fill="#C4A77D" />
        <circle cx="3" cy="-1" r="2" fill="#C4A77D" />
        <path d="M-2,4 L0,3 L2,4" fill="none" stroke="#C4A77D" strokeWidth="1" />
      </g>
      <g opacity="0.08">
        <circle cx="300" cy="1234" r="2" fill="#5C4A3A" />
        <circle cx="310" cy="1225" r="2" fill="#5C4A3A" />
        <circle cx="450" cy="1184" r="2" fill="#5C4A3A" />
        <circle cx="460" cy="1175" r="2" fill="#5C4A3A" />
        <circle cx="600" cy="1166" r="2" fill="#5C4A3A" />
        <circle cx="610" cy="1159" r="2" fill="#5C4A3A" />
        <circle cx="450" cy="866" r="2" fill="#5C4A3A" />
        <circle cx="440" cy="859" r="2" fill="#5C4A3A" />
        <circle cx="350" cy="816" r="2" fill="#5C4A3A" />
        <circle cx="340" cy="809" r="2" fill="#5C4A3A" />
        <circle cx="500" cy="584" r="2" fill="#5C4A3A" />
        <circle cx="510" cy="575" r="2" fill="#5C4A3A" />
        <circle cx="550" cy="400" r="2" fill="#5C4A3A" />
        <circle cx="540" cy="391" r="2" fill="#5C4A3A" />
      </g>
      <text x="800" y="916" fill="#8B6F47" fontSize="9" fontStyle="italic" opacity="0.12" transform="rotate(5 800 916)">
        Terra Incognita
      </text>
      <g transform="translate(850, 1200)" opacity="0.2">
        <line x1="0" y1="0" x2="0" y2="28" stroke="#5C4A3A" strokeWidth="2.5" />
        <ellipse cx="-7" cy="-2" rx="11" ry="4.5" fill="#5C6B3A" transform="rotate(-25 -7 -2)" />
        <ellipse cx="7" cy="-4" rx="9" ry="3.5" fill="#6B7B4A" transform="rotate(20 7 -4)" />
        <ellipse cx="0" cy="-5" rx="10" ry="4" fill="#5C6B3A" transform="rotate(-8 0 -5)" />
      </g>
      <g transform="translate(450, 1300)" opacity="0.18">
        <line x1="0" y1="0" x2="0" y2="22" stroke="#5C4A3A" strokeWidth="2" />
        <ellipse cx="-6" cy="-2" rx="9" ry="3.5" fill="#5C6B3A" transform="rotate(-30 -6 -2)" />
        <ellipse cx="5" cy="-3" rx="8" ry="3" fill="#6B7B4A" transform="rotate(25 5 -3)" />
      </g>
      <g transform="translate(650, 600)" opacity="0.22">
        <line x1="0" y1="0" x2="0" y2="26" stroke="#5C4A3A" strokeWidth="2.5" />
        <ellipse cx="-8" cy="-2" rx="11" ry="4" fill="#5C6B3A" transform="rotate(-28 -8 -2)" />
        <ellipse cx="7" cy="-4" rx="10" ry="4" fill="#5C6B3A" transform="rotate(22 7 -4)" />
        <ellipse cx="0" cy="-5" rx="9" ry="3.5" fill="#6B7B4A" transform="rotate(-5 0 -5)" />
      </g>
      <g transform="translate(50, 350)" opacity="0.18">
        <line x1="0" y1="0" x2="0" y2="24" stroke="#5C4A3A" strokeWidth="2" />
        <ellipse cx="-6" cy="-1" rx="9" ry="3.5" fill="#5C6B3A" transform="rotate(-20 -6 -1)" />
        <ellipse cx="6" cy="-3" rx="8" ry="3" fill="#6B7B4A" transform="rotate(30 6 -3)" />
      </g>
      <g transform="translate(930, 450)" opacity="0.15">
        <line x1="0" y1="0" x2="0" y2="20" stroke="#5C4A3A" strokeWidth="2" />
        <ellipse cx="-5" cy="-2" rx="8" ry="3" fill="#5C6B3A" transform="rotate(-22 -5 -2)" />
        <ellipse cx="5" cy="-3" rx="7" ry="2.5" fill="#6B7B4A" transform="rotate(28 5 -3)" />
      </g>
      <g opacity="0.15">
        <polygon points="800,650 830,560 860,650" fill="#8B6F47" />
        <polygon points="820,650 845,576 870,650" fill="#7A5F3A" />
      </g>
      <g opacity="0.12">
        <polygon points="30,200 55,130 80,200" fill="#8B6F47" />
        <polygon points="45,200 65,145 85,200" fill="#7A5F3A" />
      </g>
      <g opacity="0.14">
        <polygon points="700,150 725,80 750,150" fill="#8B6F47" />
        <polygon points="715,150 735,96 755,150" fill="#7A5F3A" />
      </g>
      <g opacity="0.13">
        <polygon points="500,1200 535,1110 570,1200" fill="#8B6F47" />
        <polygon points="520,1200 545,1126 575,1200" fill="#7A5F3A" />
      </g>
      <g transform="translate(550, 1470)" opacity="0.16">
        <ellipse cx="0" cy="0" rx="22" ry="7" fill="#C4A77D" />
        <line x1="-4" y1="-2" x2="-4" y2="-14" stroke="#5C4A3A" strokeWidth="1.5" />
        <ellipse cx="-8" cy="-12" rx="6" ry="2.5" fill="#5C6B3A" transform="rotate(-15 -8 -12)" />
        <ellipse cx="0" cy="-13" rx="5" ry="2" fill="#6B7B4A" transform="rotate(10 0 -13)" />
        <line x1="8" y1="-2" x2="8" y2="-10" stroke="#5C4A3A" strokeWidth="1" />
        <ellipse cx="5" cy="-9" rx="5" ry="2" fill="#5C6B3A" transform="rotate(-10 5 -9)" />
      </g>
      <g transform="translate(880, 1460)" opacity="0.14">
        <ellipse cx="0" cy="0" rx="15" ry="5" fill="#C4A77D" />
        <line x1="0" y1="-2" x2="0" y2="-12" stroke="#5C4A3A" strokeWidth="1.5" />
        <ellipse cx="-4" cy="-10" rx="6" ry="2.5" fill="#5C6B3A" transform="rotate(-18 -4 -10)" />
        <ellipse cx="4" cy="-11" rx="5" ry="2" fill="#6B7B4A" transform="rotate(12 4 -11)" />
      </g>
      <g transform="translate(60, 1470)" opacity="0.15">
        <ellipse cx="0" cy="0" rx="14" ry="5" fill="#C4A77D" />
        <line x1="0" y1="-2" x2="0" y2="-11" stroke="#5C4A3A" strokeWidth="1" />
        <ellipse cx="-3" cy="-9" rx="5" ry="2" fill="#5C6B3A" transform="rotate(-12 -3 -9)" />
        <ellipse cx="3" cy="-10" rx="4" ry="1.5" fill="#6B7B4A" transform="rotate(15 3 -10)" />
      </g>
      <g transform="translate(880, 1300)">
        <circle cx="0" cy="0" r="40" fill="none" stroke="#8B6F47" strokeWidth="1.5" opacity="0.4" />
        <circle cx="0" cy="0" r="35" fill="none" stroke="#8B6F47" strokeWidth="0.5" opacity="0.3" />
        <polygon points="0,-32 -4,-8 4,-8" fill="#8B6F47" opacity="0.6" />
        <polygon points="0,32 -4,8 4,8" fill="#8B6F47" opacity="0.3" />
        <polygon points="-32,0 -8,-4 -8,4" fill="#8B6F47" opacity="0.3" />
        <polygon points="32,0 8,-4 8,4" fill="#8B6F47" opacity="0.3" />
        <text x="0" y="-42" textAnchor="middle" fill="#8B6F47" fontSize="10" fontWeight="bold" opacity="0.5">
          N
        </text>
        <text x="0" y="52" textAnchor="middle" fill="#8B6F47" fontSize="10" fontWeight="bold" opacity="0.5">
          S
        </text>
        <text x="-48" y="4" textAnchor="middle" fill="#8B6F47" fontSize="10" fontWeight="bold" opacity="0.5">
          W
        </text>
        <text x="48" y="4" textAnchor="middle" fill="#8B6F47" fontSize="10" fontWeight="bold" opacity="0.5">
          E
        </text>
        <circle cx="0" cy="0" r="3" fill="#8B6F47" opacity="0.5" />
      </g>
    </g>
  );
}

/* The little boat — the same silhouette as the original: brown hull, deck
   trim, mast, cream sail and a red pennant. It sails upright along the
   trail (never rotates). */
function Boat() {
  return (
    <svg viewBox="0 0 40 40" className="h-12 w-12 drop-shadow-[0_0_14px_rgba(255,184,150,0.45)]">
      <ellipse cx="20" cy="27" rx="9" ry="3.2" fill="#0F2A3A" opacity="0.7" />
      <path d="M10 23 C12 27 15 30 20 30 C25 30 28 27 30 23 Z" fill="#5C4A3A" />
      <path
        d="M11 23.5 C13 26 16 27.5 20 27.5 C24 27.5 27 26 29 23.5"
        stroke="#D4B896"
        strokeWidth="0.7"
        fill="none"
        opacity="0.7"
      />
      <rect x="19" y="11.5" width="2" height="11.5" rx="0.7" fill="#3A2A1A" />
      <path d="M21 13 L28 17 L21 19 Z" fill="#F5E6D0" />
      <path d="M19 11.5 L15 11 L19 9.3 Z" fill="#C0392B" />
    </svg>
  );
}

function TrailMarker({
  stop,
  active,
  onSelect,
}: {
  stop: JourneyStop;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
    >
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-[#3A2A1A]/80 px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-[#D4B896] pointer-events-none lg:text-[10px]">
        Lv. {stop.lv}
      </span>
      {/* soft shadow sitting under the medallion */}
      <div
        className="absolute top-1 left-1/2 hidden h-3 w-8 -translate-x-1/2 rounded-full blur-sm pointer-events-none lg:block"
        style={{ background: "rgba(60,40,20,0.25)" }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(stop.id);
        }}
        aria-label={`${stop.org} — ${stop.role}`}
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-heading text-lg font-bold transition-all duration-200 lg:h-11 lg:w-11 lg:text-base ${
          stop.current
            ? `border-[${TEAL}] text-[${TEAL}]`
            : "border-[#8B6F47] bg-[#5C4A3A] text-[#FFF8F0] hover:scale-110"
        } ${active ? "scale-125 ring-2 ring-[#FFB800]/50 ring-offset-1 ring-offset-transparent" : ""}`}
        style={
          stop.current
            ? {
                background: "rgba(26,122,109,0.15)",
                borderColor: TEAL,
                color: TEAL,
                boxShadow: "0 0 12px rgba(26,122,109,0.25)",
              }
            : undefined
        }
      >
        {stop.letter}
      </button>
      <div className="pointer-events-none absolute top-full left-1/2 mt-1.5 flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
        <span className="text-xs font-semibold text-[#3A2A1A] lg:text-[11px] lg:text-[#5C4A3A]/70">{stop.org}</span>
        <span className="text-[10px] font-medium text-[#3A2A1A]/70 lg:text-[#3A2A1A]/55">{stop.period}</span>
        {stop.current && (
          <span className="mt-0.5 text-[10px] font-bold text-[#1A7A6D] italic lg:text-[9px]">You are here</span>
        )}
      </div>
    </div>
  );
}

function TreasureMarker() {
  return (
    <div
      className="absolute z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center pointer-events-none"
      style={{ left: "55%", top: `${50 / 15}%` }}
    >
      <div className="relative h-14 w-14 lg:h-12 lg:w-12">
        <div className="treasure-glow absolute -inset-3 rounded-full bg-[#FFB800]/15" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-[3px] w-[80%] rotate-45 rounded-full bg-[#C0392B]" />
          <div className="absolute h-[3px] w-[80%] -rotate-45 rounded-full bg-[#C0392B]" />
        </div>
        <span className="font-heading absolute inset-0 flex items-center justify-center text-xl font-bold text-[#FFB800] drop-shadow-sm lg:text-lg">
          ?
        </span>
      </div>
      <span className="mt-1.5 text-xs font-bold whitespace-nowrap text-[#8B6F47] italic lg:text-[11px]">
        What&apos;s next?
      </span>
    </div>
  );
}

function CampCard({
  stop,
  active,
  onEnter,
  onLeave,
}: {
  stop: JourneyStop;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className={`cursor-default rounded-xl border p-4 transition-all duration-200 ${
        active
          ? "scale-[1.03] border-[#8B6F47] bg-[#FFF8F0] shadow-lg"
          : "border-[#D4B896]/50 bg-[#FFF8F0]/85 hover:bg-[#FFF8F0]"
      }`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-heading text-[10px] font-bold ${
              stop.current ? "" : "border-[#8B6F47]/30 bg-[#5C4A3A]/10 text-[#5C4A3A]"
            }`}
            style={
              stop.current
                ? { background: "rgba(26,122,109,0.06)", borderColor: `${TEAL}66`, color: TEAL }
                : undefined
            }
          >
            {stop.letter}
          </div>
          <h4 className="font-heading min-w-0 truncate text-base font-bold text-[#3A2A1A]">
            {stop.org}
            {stop.current && (
              <span className="ml-1.5 text-[9px] font-normal text-[#1A7A6D] italic">current</span>
            )}
          </h4>
        </div>
        <span className="shrink-0 rounded-full bg-[#8B6F47]/10 px-2 py-0.5 text-[8px] font-bold text-[#8B6F47]">
          Lv. {stop.lv}
        </span>
      </div>
      <p className="ml-8 text-sm font-semibold text-[#3A2A1A]">{stop.role}</p>
      <p className="mb-1.5 ml-8 text-xs text-[#8B6F47]">{stop.period}</p>
      <p className="ml-8 text-sm leading-relaxed text-[#3A2A1A]/80">{stop.blurb}</p>
      <div className="mt-2 ml-8 flex flex-wrap gap-1.5">
        {stop.stack.map((t) => (
          <span
            key={t}
            className="rounded-full border border-[#D4B896] bg-[#F4E3C3] px-2 py-0.5 text-[11px] font-medium text-[#3A2A1A]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Journey() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const select = (id: string) => setActiveId(id);
  const active = activeId ? profile.journey.find((s) => s.id === activeId) : undefined;

  /* The boat sails the trail with your scroll — exactly like the original:
     it starts at the current stop ("You are here") and cruises down the
     dashed path toward the earliest stop as the section scrolls past.
     Scroll back up and it sails back up. */
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const total = path.getTotalLength();
    const stopYs = profile.journey.map((s) => Math.round(s.y * 15)); // % → 1500-space px
    const topY = Math.min(...stopYs);
    const bottomY = Math.max(...stopYs);
    const top = { len: 0, dy: Infinity };
    const bottom = { len: 0, dy: Infinity };
    for (let o = 0; o <= 600; o++) {
      const a = (total * o) / 600;
      const l = path.getPointAtLength(a);
      const dTop = Math.abs(l.y - topY);
      const dBottom = Math.abs(l.y - bottomY);
      if (dTop < top.dy) {
        top.len = a;
        top.dy = dTop;
      }
      if (dBottom < bottom.dy) {
        bottom.len = a;
        bottom.dy = dBottom;
      }
    }
    const startPt = path.getPointAtLength(top.len);
    setPos({ x: startPt.x, y: startPt.y });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // scroll progress of the section (≈ framer offset ["start end","end start"])
      const t = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const r = Math.min(1, Math.max(0, (t - 0.3) / 0.5));
      const len = top.len + (bottom.len - top.len) * r;
      const pt = path.getPointAtLength(len);
      setPos({ x: pt.x, y: pt.y });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="map-surface relative -mt-px overflow-hidden pb-16 sm:pb-0"
    >
      {/* soft vignette pressed into the parchment */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          boxShadow:
            "inset 0 0 120px 40px rgba(60,40,20,0.7), inset 0 0 60px 20px rgba(30,20,10,0.4)",
        }}
      />

      {/* heading */}
      <div className="relative z-20 mx-auto max-w-4xl px-6 pt-16 pb-6 lg:pb-2">
        <Reveal>
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-[#3A2A1A] uppercase">Journey So Far</p>
          <h2 className="mb-2 font-heading text-4xl font-bold text-[#3A2A1A] sm:text-5xl lg:text-6xl">
            Experience
          </h2>
          <p className="mb-2 text-lg text-[#5C4A3A]/60">Every stop, a story. Every role, a relic.</p>
          <p className="mb-4 text-sm text-[#3A2A1A] italic lg:hidden">tap a stop to explore</p>
        </Reveal>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 pb-8 lg:pb-16">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[3fr_2fr] lg:gap-10">
          {/* ── the map ── */}
          <div className="relative">
            <div className="relative" style={{ aspectRatio: "1000 / 1500" }} onClick={() => setActiveId(null)}>
              {/* scenery doodles */}
              <svg viewBox="0 0 1000 1500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
                <MapScenery />
              </svg>
              {/* dashed trail */}
              <svg viewBox="0 0 1000 1500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
                <path
                  ref={pathRef}
                  d={TRAIL_D}
                  fill="none"
                  stroke="#8B6F47"
                  strokeWidth="3"
                  strokeDasharray="12 6"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d={SPUR_D}
                  fill="none"
                  stroke="#8B6F47"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  opacity="0.25"
                />
              </svg>

              <div className="absolute inset-0">
                {/* the sailboat riding the trail */}
                {pos && (
                  <div
                    className="pointer-events-none absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                    style={{ left: `${pos.x / 10}%`, top: `${(pos.y / 1500) * 100}%` }}
                  >
                    <Boat />
                  </div>
                )}

                {/* stops along the trail */}
                {profile.journey.map((stop) => (
                  <TrailMarker
                    key={stop.id}
                    stop={stop}
                    active={activeId === stop.id}
                    onSelect={select}
                  />
                ))}

                {/* the treasure at the end of the trail */}
                <TreasureMarker />
              </div>
            </div>
          </div>

          {/* ── campsites column (desktop) ── */}
          <div className="hidden flex-col gap-3 lg:flex">
            <p className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-[#8B6F47] uppercase">
              Campsites Along the Trail
            </p>
            {profile.journey.map((stop) => (
              <CampCard
                key={stop.id}
                stop={stop}
                active={activeId === stop.id}
                onEnter={() => select(stop.id)}
                onLeave={() => setActiveId(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── mobile: stop details in a bottom sheet ── */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/25 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
            />
            <motion.div
              key="sheet"
              className="fixed right-0 bottom-0 left-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-[#FFF8F0] p-5 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D4B896]" />
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-heading text-sm font-bold ${
                      active.current ? "" : "border-[#8B6F47] bg-[#5C4A3A] text-[#FFF8F0]"
                    }`}
                    style={
                      active.current
                        ? { background: "rgba(26,122,109,0.15)", borderColor: TEAL, color: TEAL }
                        : undefined
                    }
                  >
                    {active.letter}
                  </div>
                  <h4 className="font-heading min-w-0 truncate text-lg font-bold text-[#3A2A1A]">{active.org}</h4>
                </div>
                <span className="shrink-0 rounded-full bg-[#8B6F47]/15 px-2.5 py-1 text-[10px] font-bold text-[#8B6F47]">
                  Lv. {active.lv}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#5C4A3A]">{active.role}</p>
              <p className="mb-3 text-xs text-[#8B6F47]">{active.period}</p>
              <p className="text-sm leading-relaxed text-[#5C4A3A]/80">{active.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {active.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#D4B896] bg-[#F4E3C3] px-2 py-0.5 text-[11px] font-medium text-[#3A2A1A]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
