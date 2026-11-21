"use client";

type Orb = {
  top: string;
  left: string;
  size: number;
  color: string;
  anim: "float" | "pulse";
  duration: string;
  delay: string;
};

const ORBS: Orb[] = [
  { top: "10%", left: "8%", size: 90, color: "rgba(34,211,238,0.35)", anim: "float", duration: "9s", delay: "0s" },
  { top: "20%", left: "85%", size: 70, color: "rgba(232,121,249,0.35)", anim: "pulse", duration: "4s", delay: "0.5s" },
  { top: "60%", left: "5%", size: 110, color: "rgba(168,85,247,0.30)", anim: "float", duration: "11s", delay: "1s" },
  { top: "75%", left: "88%", size: 80, color: "rgba(34,211,238,0.30)", anim: "pulse", duration: "5s", delay: "0.2s" },
  { top: "45%", left: "50%", size: 60, color: "rgba(232,121,249,0.25)", anim: "float", duration: "8s", delay: "1.5s" },
  { top: "85%", left: "30%", size: 100, color: "rgba(96,165,250,0.30)", anim: "pulse", duration: "4.5s", delay: "0.8s" },
  { top: "5%", left: "45%", size: 55, color: "rgba(34,211,238,0.25)", anim: "float", duration: "10s", delay: "0.4s" },
  { top: "35%", left: "92%", size: 65, color: "rgba(168,85,247,0.30)", anim: "pulse", duration: "3.5s", delay: "1.2s" },
  { top: "70%", left: "65%", size: 75, color: "rgba(232,121,249,0.25)", anim: "float", duration: "9.5s", delay: "0.7s" },
  { top: "28%", left: "25%", size: 50, color: "rgba(96,165,250,0.25)", anim: "pulse", duration: "4s", delay: "1.6s" },
];

export default function NeonOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((o, i) => (
        <span
          key={i}
          className={`absolute rounded-full blur-2xl ${o.anim === "float" ? "animate-neon-float" : "animate-neon-pulse"}`}
          style={{
            top: o.top,
            left: o.left,
            width: o.size,
            height: o.size,
            backgroundColor: o.color,
            animationDuration: o.duration,
            animationDelay: o.delay,
          }}
        />
      ))}
    </div>
  );
}
