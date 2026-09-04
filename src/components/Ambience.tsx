import { useMemo } from "react";

/* ────────────────────────────────────────────────────────────────────
   Deterministic decorative layers.
   Positions are derived from the index, so renders never flicker.
──────────────────────────────────────────────────────────────────── */

const TWINKLE_COLORS = ["#ffffff", "#ffe9c9", "#ffd9a8", "#ffffff"];

/** Softly twinkling star dots filling the parent (absolute inset-0). */
export function Twinkles({ count = 16, className = "" }: { count?: number; className?: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 61 + 17) % 97}%`,
        top: `${(i * 37 + 9) % 90}%`,
        size: 1 + (i % 3) * 0.5,
        color: TWINKLE_COLORS[i % TWINKLE_COLORS.length],
        duration: 2.6 + (i % 7) * 0.55,
        delay: (i * 0.53) % 4,
      })),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${4 + s.size}px ${s.color}`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const EMBER_COLORS = ["#FFB800", "#FF8236", "#FF6B18", "#FFD236", "#FF4444"];

/**
 * Rising/falling sparks.
 *  - "rise": anchored along the bottom edge, drifting up ~90vh.
 *  - "fall": anchored along the top edge, drifting down (e.g. embers shed
 *    as you enter a fire-lit section).
 */
export function EmberSwarm({
  count = 16,
  mode = "rise",
  className = "",
}: {
  count?: number;
  mode?: "rise" | "fall";
  className?: string;
}) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 43 + 11) % 96}%`,
        size: i % 4 === 0 ? 2.4 : i % 3 === 0 ? 1.8 : 1.2,
        color: EMBER_COLORS[i % EMBER_COLORS.length],
        duration: 4.6 + (i % 5) * 0.9,
        delay: (i % 8) * 0.62,
      })),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {embers.map((e, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${mode === "rise" ? "ember" : "ember-fall"} ember-d${i % 8}`}
          style={{
            left: e.left,
            top: mode === "rise" ? undefined : -12,
            bottom: mode === "rise" ? -10 : undefined,
            width: e.size,
            height: e.size,
            background: e.color,
            boxShadow: `0 0 ${4 + e.size * 2}px ${e.color}`,
            animationDuration: `${e.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
