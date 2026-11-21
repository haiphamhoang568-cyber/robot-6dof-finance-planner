"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import NeonOrbs from "./neon-orbs";

const STARS = [
  { top: "12%", left: "20%", size: 6, delay: "0s" },
  { top: "8%", left: "45%", size: 4, delay: "0.6s" },
  { top: "20%", left: "60%", size: 5, delay: "1.2s" },
  { top: "30%", left: "15%", size: 4, delay: "0.3s" },
  { top: "18%", left: "85%", size: 6, delay: "0.9s" },
  { top: "40%", left: "75%", size: 4, delay: "1.5s" },
  { top: "6%", left: "70%", size: 5, delay: "0.2s" },
  { top: "35%", left: "35%", size: 4, delay: "1.1s" },
  { top: "55%", left: "8%", size: 5, delay: "0.7s" },
  { top: "48%", left: "90%", size: 4, delay: "1.8s" },
];

const TREES = [
  { left: "3%", size: 46, color: "#34d399" },
  { left: "10%", size: 62, color: "#10b981" },
  { left: "18%", size: 38, color: "#2dd4bf" },
  { left: "80%", size: 54, color: "#34d399" },
  { left: "88%", size: 40, color: "#22d3ee" },
  { left: "94%", size: 60, color: "#10b981" },
];

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPassword(v: string) {
  return v.length >= 8;
}

function NeonSun() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-12 rounded-full bg-orange-500/40 blur-3xl" />
      <div className="relative h-32 w-32 rounded-full bg-gradient-to-b from-yellow-300 via-orange-500 to-fuchsia-600 shadow-[0_0_70px_20px_rgba(249,115,22,0.45)]" />
      <div className="absolute inset-0 -m-4 rounded-full border border-orange-400/40" />
    </div>
  );
}

function NeonMoon() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-12 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-slate-100 via-cyan-100 to-blue-300 shadow-[0_0_70px_20px_rgba(34,211,238,0.4)]">
        <span className="absolute left-6 top-8 h-4 w-4 rounded-full bg-slate-300/70" />
        <span className="absolute right-7 top-14 h-3 w-3 rounded-full bg-slate-300/60" />
        <span className="absolute bottom-8 left-10 h-2.5 w-2.5 rounded-full bg-slate-300/60" />
      </div>
      <div className="absolute inset-0 -m-4 rounded-full border border-cyan-300/40" />
    </div>
  );
}

function NeonTree({ left, size, color }: { left: string; size: number; color: string }) {
  return (
    <div className="absolute bottom-24 flex flex-col items-center" style={{ left }}>
      <div
        className="rounded-[2px]"
        style={{
          width: size,
          height: size,
          clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(to bottom, " + color + ", #059669)",
          filter: "drop-shadow(0 0 10px " + color + ")",
        }}
      />
      <div className="h-2.5 w-1.5 bg-amber-900/90" />
    </div>
  );
}

function NeonCar({
  body,
  glow,
  flip = false,
}: {
  body: string;
  glow: string;
  flip?: boolean;
}) {
  return (
    <div className={"relative h-10 w-20" + (flip ? " scale-x-[-1]" : "")}>
      <div
        className={"absolute bottom-1 left-0 h-5 w-20 rounded-md bg-gradient-to-r " + body}
        style={{ boxShadow: "0 0 16px 2px " + glow }}
      />
      <div className="absolute bottom-[22px] left-5 h-4 w-9 rounded-t-md bg-slate-200/85" />
      <span className="absolute bottom-0 left-3 h-2.5 w-2.5 rounded-full bg-slate-950 ring-1 ring-slate-500" />
      <span className="absolute bottom-0 right-3 h-2.5 w-2.5 rounded-full bg-slate-950 ring-1 ring-slate-500" />
      <span className="absolute bottom-3 right-0 h-1.5 w-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_2px_rgba(254,240,138,0.9)]" />
      <span className="absolute bottom-3 left-0 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_2px_rgba(248,113,113,0.9)]" />
    </div>
  );
}

type PandaMood = "normal" | "happy" | "angry" | "sleeping";

function Panda({
  holdingBody,
  action,
  moving,
  grabbing,
  clinging,
  mood,
  orbRef,
  innerRef,
}: {
  holdingBody: "moon" | "sun" | null;
  action: "idle" | "holding" | "throwing";
  moving: boolean;
  grabbing: boolean;
  clinging: boolean;
  mood: PandaMood;
  orbRef: React.RefObject<HTMLSpanElement | null>;
  innerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const orbCls =
    holdingBody === "moon"
      ? "bg-cyan-100 shadow-[0_0_16px_4px_rgba(165,243,252,0.9)]"
      : "bg-amber-300 shadow-[0_0_16px_4px_rgba(251,191,36,0.9)]";
  const showOrb = action === "holding" && holdingBody !== null;
  const innerCls =
    mood === "happy" ? "animate-panda-happy" :
    mood === "angry" ? "animate-panda-angry" :
    mood === "sleeping" ? "animate-panda-sleep" :
    moving ? "animate-panda-run" : "animate-panda-idle";
  const armCls = clinging ? " arm-cling" : mood === "happy" ? " arm-happy" : grabbing ? " animate-arm-reach" : "";
  const blushCls = mood === "angry" ? "bg-red-500" : "bg-pink-300/90";
  return (
    <div ref={innerRef} className={innerCls + (mood === "angry" ? " panda-angry-glow" : "") + " relative h-20 w-16"}>
      <span className="absolute left-0.5 top-0 h-4 w-4 rounded-full bg-slate-900" />
      <span className="absolute right-0.5 top-0 h-4 w-4 rounded-full bg-slate-900" />
      <div className="absolute left-1/2 top-2 h-14 w-14 -translate-x-1/2 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.4)]" style={{ backgroundColor: "#ffffff" }}>
        <span className="absolute left-[9px] top-[14px] h-5 w-3 rotate-[25deg] rounded-full bg-slate-900" />
        <span className="absolute right-[9px] top-[14px] h-5 w-3 -rotate-[25deg] rounded-full bg-slate-900" />
        {mood === "happy" ? (
          <>
            <span className="absolute left-[12px] top-[16px] h-[5px] w-2.5 rounded-t-full border-t-[2.5px] border-white" />
            <span className="absolute right-[12px] top-[16px] h-[5px] w-2.5 rounded-t-full border-t-[2.5px] border-white" />
          </>
        ) : mood === "sleeping" ? (
          <>
            <span className="absolute left-[12px] top-[17px] h-[5px] w-2.5 rounded-b-full border-b-[2.5px] border-white" />
            <span className="absolute right-[12px] top-[17px] h-[5px] w-2.5 rounded-b-full border-b-[2.5px] border-white" />
          </>
        ) : (
          <>
            <span className="absolute left-[13px] top-[17px] h-1.5 w-1.5 rounded-full bg-white" />
            <span className="absolute right-[13px] top-[17px] h-1.5 w-1.5 rounded-full bg-white" />
          </>
        )}
        <span className="absolute left-1/2 top-[30px] h-2 w-3 -translate-x-1/2 rounded-full bg-slate-900" />
        {mood === "happy" && (
          <span className="absolute left-1/2 top-[37px] h-1.5 w-3 -translate-x-1/2 rounded-b-full border-b-2 border-slate-900" />
        )}
        <span className={"absolute left-[6px] top-[28px] h-2 w-2 rounded-full " + blushCls} />
        <span className={"absolute right-[6px] top-[28px] h-2 w-2 rounded-full " + blushCls} />
        {mood === "angry" && (
          <>
            <span className="absolute left-[9px] top-[11px] h-1 w-4 rotate-[24deg] rounded-full bg-slate-900" />
            <span className="absolute right-[9px] top-[11px] h-1 w-4 -rotate-[24deg] rounded-full bg-slate-900" />
          </>
        )}
      </div>
      <div className="absolute bottom-0 left-1/2 h-7 w-11 -translate-x-1/2 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.4)]" style={{ backgroundColor: "#ffffff" }} />
      <span className={"absolute bottom-1 left-1 h-3 w-3 rounded-full bg-slate-900 transition-transform duration-300" + armCls} />
      <span className={"absolute bottom-1 right-1 h-3 w-3 rounded-full bg-slate-900 transition-transform duration-300" + armCls} />
      <span className={"absolute bottom-0 left-[18px] h-2.5 w-3 rounded-full bg-slate-900" + (moving ? " animate-foot-run" : "")} />
      <span
        className={"absolute bottom-0 right-[18px] h-2.5 w-3 rounded-full bg-slate-900" + (moving ? " animate-foot-run" : "")}
        style={moving ? { animationDelay: "0.175s" } : undefined}
      />
      {showOrb && (
        <span
          ref={orbRef}
          className={"absolute bottom-3 h-5 w-5 rounded-full " + orbCls}
          style={{ left: "calc(50% - 10px)" }}
        />
      )}
      {mood === "sleeping" && (
        <>
          <span className="animate-z-float absolute -top-2 right-0 text-sm font-black text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">Z</span>
          <span className="animate-z-float absolute -top-5 right-3 text-base font-black text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" style={{ animationDelay: "0.9s" }}>Z</span>
          <span className="animate-z-float absolute -top-8 right-1 text-lg font-black text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" style={{ animationDelay: "1.8s" }}>Z</span>
        </>
      )}
    </div>
  );
}

export default function AuthCard({ initialMode }: { initialMode: "login" | "register" }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  const mainRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const pandaOuterRef = useRef<HTMLDivElement>(null);
  const pandaInnerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLSpanElement>(null);
  const projRef = useRef<HTMLDivElement>(null);
  const throwTimerRef = useRef<number | null>(null);
  const grabTimerRef = useRef<number | null>(null);
  const autoThrowTimerRef = useRef<number | null>(null);
  const moodTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const sleepTimerRef = useRef<number | null>(null);
  const speechTimerRef = useRef<number | null>(null);
  const failCountRef = useRef(0);
  const [pandaAction, setPandaAction] = useState<"idle" | "holding" | "throwing">("idle");
  const [holdingBody, setHoldingBody] = useState<"moon" | "sun" | null>(null);
  const [pandaMoving, setPandaMoving] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  const [clinging, setClinging] = useState(false);
  const [throwDir, setThrowDir] = useState<"left" | "right">("right");
  const [switchLocked, setSwitchLocked] = useState(false);
  const [mood, setMood] = useState<PandaMood>("normal");
  const [speech, setSpeech] = useState<string | null>(null);
  const [proj, setProj] = useState<{ cls: string } | null>(null);
  const actionRef = useRef(pandaAction);
  actionRef.current = pandaAction;
  const clingingRef = useRef(false);
  clingingRef.current = clinging;
  const switchLockedRef = useRef(false);
  const pendingToggleRef = useRef(false);
  const holdingBodyRef = useRef(holdingBody);
  holdingBodyRef.current = holdingBody;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const emailRef = useRef(email);
  emailRef.current = email;
  const passwordRef = useRef(password);
  passwordRef.current = password;

  const physRef = useRef({
    x: 192, y: -64, vx: 0, vy: 0,
    targetX: null as number | null, targetY: null as number | null,
    purpose: "none" as "none" | "grab" | "cling" | "home",
    grabBody: "moon" as "moon" | "sun",
    clingDir: 0,
    hy: 0, hvy: 0, airborne: false,
    squash: 0, squashVel: 0,
    orbX: 0, orbY: 0, orbVx: 0, orbVy: 0,
    orbS: 0, orbSv: 0,
    prevVx: 0, prevVy: 0,
    moving: false, lean: 0,
    proj: { active: false, x: 0, y: 0, vx: 0, vy: 0, t: 0, T: 0.85 },
  });
  const arriveRef = useRef<() => void>(() => {});

  function measureHome() {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { left: rect.width / 2 - 32, top: -64 };
  }

  function measureBodyCenter(body: "moon" | "sun") {
    const wrapRect = cardRef.current?.getBoundingClientRect();
    const mainRect = mainRef.current?.getBoundingClientRect();
    if (!wrapRect || !mainRect) return null;
    return {
      x: body === "moon"
        ? mainRect.left + mainRect.width * 0.06 + 64 - wrapRect.left
        : mainRect.left + mainRect.width * 0.94 - 64 - wrapRect.left,
      y: mainRect.top + mainRect.height * 0.08 + 64 - wrapRect.top,
    };
  }

  function measureClingSpot(body: "moon" | "sun") {
    const wrapRect = cardRef.current?.getBoundingClientRect();
    if (!wrapRect) return null;
    const center = measureBodyCenter(body);
    if (!center) return null;
    return {
      left: body === "moon" ? -wrapRect.left + 8 : window.innerWidth - wrapRect.left - 64 - 8,
      top: center.y - 40,
    };
  }

  function throwOrbTo(tx: number, ty: number, T: number, body: "moon" | "sun") {
    const p = physRef.current;
    const startX = p.x + 32;
    const startY = p.y + 58;
    const g = 1100;
    p.proj = {
      active: true,
      x: startX, y: startY,
      vx: (tx - startX) / T,
      vy: (ty - startY - 0.5 * g * T * T) / T,
      t: 0, T,
    };
    setProj({ cls: body === "moon" ? "bg-cyan-100 shadow-[0_0_16px_4px_rgba(165,243,252,0.9)]" : "bg-amber-300 shadow-[0_0_16px_4px_rgba(251,191,36,0.9)]" });
  }

  function showSpeech(text: string, ms = 3200) {
    setSpeech(text);
    if (speechTimerRef.current !== null) window.clearTimeout(speechTimerRef.current);
    speechTimerRef.current = window.setTimeout(() => setSpeech(null), ms);
  }

  function clearMoodTimer() {
    if (moodTimerRef.current !== null) {
      window.clearTimeout(moodTimerRef.current);
      moodTimerRef.current = null;
    }
  }

  function resetIdleTimer() {
    if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      const p = physRef.current;
      if (emailRef.current === "" && passwordRef.current === "" && actionRef.current === "idle" && p.purpose === "none" && !switchLockedRef.current) {
        showSpeech("ní tính đợi tới khi nào", 2500);
        if (sleepTimerRef.current !== null) window.clearTimeout(sleepTimerRef.current);
        sleepTimerRef.current = window.setTimeout(() => {
          setMood("sleeping");
        }, 2500);
      } else {
        resetIdleTimer();
      }
    }, 10000);
  }

  function wakeAndResetIdle() {
    if (sleepTimerRef.current !== null) {
      window.clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (mood === "sleeping") {
      setMood("normal");
      setSpeech(null);
    }
    resetIdleTimer();
  }

  function registerFail() {
    failCountRef.current += 1;
    const n = failCountRef.current;
    const msg = n === 1 ? "chán thế" : n === 2 ? "thật sự ní không biết à ?" : "đăng ký đi ní, nhìn ní tui thất vọng quá";
    clearMoodTimer();
    setMood("angry");
    showSpeech(msg, 3200);
    moodTimerRef.current = window.setTimeout(() => {
      setMood("normal");
    }, 3200);
  }

  function onEmailChange(v: string) {
    setEmail(v);
    wakeAndResetIdle();
    if (isValidEmail(v)) {
      failCountRef.current = 0;
      clearMoodTimer();
      setMood("happy");
    } else if (mood === "happy") {
      setMood("normal");
    }
  }

  function onPasswordChange(v: string) {
    setPassword(v);
    wakeAndResetIdle();
    if (isValidPassword(v)) {
      failCountRef.current = 0;
      clearMoodTimer();
      setMood("happy");
    } else if (mood === "happy") {
      setMood("normal");
    }
  }

  function onFieldBlur(kind: "email" | "password") {
    wakeAndResetIdle();
    const value = kind === "email" ? email : password;
    if (value.trim() === "") return;
    const valid = kind === "email" ? isValidEmail(value) : isValidPassword(value);
    if (valid) {
      failCountRef.current = 0;
      clearMoodTimer();
      setMood("happy");
    } else {
      registerFail();
    }
  }

  function lockSwitch() {
    switchLockedRef.current = true;
    setSwitchLocked(true);
  }

  function unlockSwitch() {
    switchLockedRef.current = false;
    setSwitchLocked(false);
  }

  function switchMode() {
    failCountRef.current = 0;
    const next = modeRef.current === "login" ? "register" : "login";
    setMode(next);
    setError("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", next === "login" ? "/login" : "/register");
    }
  }

  function startTravel(tx: number, ty: number, purpose: "grab" | "home") {
    const p = physRef.current;
    p.targetX = tx;
    p.targetY = ty;
    p.purpose = purpose;
    if (!p.airborne && p.hy === 0) {
      p.hvy = -380;
      p.airborne = true;
    }
  }

  function goHome() {
    const home = measureHome();
    if (home) startTravel(home.left, home.top, "home");
  }

  function startFetch() {
    const p = physRef.current;
    const wrapRect = cardRef.current?.getBoundingClientRect();
    const bodyRef = modeRef.current === "login" ? sunRef : moonRef;
    const rect = bodyRef.current?.getBoundingClientRect();
    if (!wrapRect || !rect || rect.width === 0) return false;
    p.grabBody = modeRef.current === "login" ? "sun" : "moon";
    startTravel(
      rect.left - wrapRect.left + rect.width / 2 - 32,
      rect.top - wrapRect.top + rect.height / 2 - 40,
      "grab"
    );
    return true;
  }

  function doThrowAndSwitch() {
    const p = physRef.current;
    if (actionRef.current !== "holding" || !holdingBodyRef.current) {
      pendingToggleRef.current = false;
      unlockSwitch();
      return;
    }
    pendingToggleRef.current = false;
    const body = holdingBodyRef.current;
    const newBody = modeRef.current === "login" ? "moon" : "sun";
    const target = measureBodyCenter(newBody);
    if (target) throwOrbTo(target.x, target.y, 0.85, body);
    setThrowDir(body === "moon" ? "right" : "left");
    setPandaAction("throwing");
    setClinging(false);
    p.clingDir = 0;
    if (!p.airborne && p.hy === 0) {
      p.hvy = -320;
      p.airborne = true;
    }
    if (throwTimerRef.current !== null) window.clearTimeout(throwTimerRef.current);
    throwTimerRef.current = window.setTimeout(() => {
      setHoldingBody(null);
      setPandaAction("idle");
      goHome();
    }, 900);
    switchMode();
  }

  function scheduleAutoThrow() {
    if (autoThrowTimerRef.current !== null) window.clearTimeout(autoThrowTimerRef.current);
    autoThrowTimerRef.current = window.setTimeout(() => {
      autoThrowTimerRef.current = null;
      doThrowAndSwitch();
    }, 300);
  }

  arriveRef.current = () => {
    const p = physRef.current;
    if (p.purpose === "grab") {
      p.purpose = "none";
      setHoldingBody(p.grabBody);
      setGrabbing(true);
      setPandaAction("holding");
      p.orbS = -1;
      p.orbSv = 9;
      p.orbX = 0;
      p.orbY = 0;
      p.orbVx = 0;
      p.orbVy = 0;
      if (grabTimerRef.current !== null) window.clearTimeout(grabTimerRef.current);
      grabTimerRef.current = window.setTimeout(() => setGrabbing(false), 380);
      if (!p.airborne && p.hy === 0) {
        p.hvy = -520;
        p.airborne = true;
      }
      const spot = measureClingSpot(p.grabBody);
      if (spot) {
        p.targetX = spot.left;
        p.targetY = spot.top;
        p.purpose = "cling";
        p.clingDir = p.grabBody === "moon" ? -1 : 1;
      } else if (pendingToggleRef.current) {
        scheduleAutoThrow();
      }
    } else if (p.purpose === "cling") {
      p.purpose = "none";
      setClinging(true);
      if (pendingToggleRef.current) scheduleAutoThrow();
    } else if (p.purpose === "home") {
      p.purpose = "none";
      setPandaAction("idle");
      pendingToggleRef.current = false;
      unlockSwitch();
    }
  };

  useEffect(() => {
    const home = measureHome();
    if (home) {
      const p = physRef.current;
      if (p.purpose === "none" && actionRef.current === "idle") {
        p.x = home.left;
        p.y = home.top;
      }
    }
    const remeasure = window.setTimeout(() => {
      const h2 = measureHome();
      const p2 = physRef.current;
      if (h2 && p2.purpose === "none" && actionRef.current === "idle") {
        p2.x = h2.left;
        p2.y = h2.top;
      }
    }, 400);
    function onResize() {
      const p = physRef.current;
      if (clingingRef.current) {
        const spot = measureClingSpot(p.grabBody);
        if (spot) {
          p.x = spot.left;
          p.y = spot.top;
        }
        return;
      }
      const h = measureHome();
      if (!h) return;
      if (p.purpose === "none" && actionRef.current === "idle") {
        p.x = h.left;
        p.y = h.top;
      }
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(remeasure);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
      if (sleepTimerRef.current !== null) window.clearTimeout(sleepTimerRef.current);
      if (moodTimerRef.current !== null) window.clearTimeout(moodTimerRef.current);
      if (speechTimerRef.current !== null) window.clearTimeout(speechTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const GRAV = 1500;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = physRef.current;
      const outer = pandaOuterRef.current;
      const inner = pandaInnerRef.current;
      const orb = orbRef.current;

      if (p.targetX !== null && p.targetY !== null) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.hypot(dx, dy);
        const maxSpeed = 540;
        const desired = Math.min(maxSpeed, (dist / 130) * maxSpeed);
        const inv = dist > 0.001 ? 1 / dist : 0;
        const dvx = dx * inv * desired;
        const dvy = dy * inv * desired;
        const accel = 2800;
        p.vx += Math.max(-accel * dt, Math.min(accel * dt, dvx - p.vx));
        p.vy += Math.max(-accel * dt, Math.min(accel * dt, dvy - p.vy));
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const speed = Math.hypot(p.vx, p.vy);
        if (dist < 4 && speed < 25 && p.hy === 0) {
          p.vx = 0;
          p.vy = 0;
          p.x = p.targetX;
          p.y = p.targetY;
          p.targetX = null;
          p.targetY = null;
          arriveRef.current();
        }
      } else {
        p.vx *= Math.max(0, 1 - 8 * dt);
        p.vy *= Math.max(0, 1 - 8 * dt);
      }

      if (p.airborne || p.hy !== 0) {
        p.hvy += GRAV * dt;
        p.hy += p.hvy * dt;
        if (p.hy >= 0) {
          p.hy = 0;
          p.hvy = 0;
          if (p.airborne) {
            p.airborne = false;
            p.squashVel = -5;
          }
        }
      }

      p.squashVel += (-160 * p.squash - 13 * p.squashVel) * dt;
      p.squash += p.squashVel * dt;

      const ax = dt > 0 ? (p.vx - p.prevVx) / dt : 0;
      const ay = dt > 0 ? (p.vy - p.prevVy) / dt : 0;
      p.prevVx = p.vx;
      p.prevVy = p.vy;

      if (orb) {
        const k = 190, c = 13;
        const oax = -k * p.orbX - c * p.orbVx - ax * 0.85;
        const oay = -k * p.orbY - c * p.orbVy - ay * 0.85;
        p.orbVx += oax * dt;
        p.orbVy += oay * dt;
        p.orbX += p.orbVx * dt;
        p.orbY += p.orbVy * dt;
        const om = Math.hypot(p.orbX, p.orbY);
        if (om > 12) {
          p.orbX *= 12 / om;
          p.orbY *= 12 / om;
        }
        p.orbSv += (-220 * p.orbS - 15 * p.orbSv) * dt;
        p.orbS += p.orbSv * dt;
        orb.style.transform = "translate(" + p.orbX.toFixed(1) + "px," + p.orbY.toFixed(1) + "px)";
        orb.style.scale = Math.max(0, 1 + p.orbS).toFixed(3);
      }

      const pr = p.proj;
      const projEl = projRef.current;
      if (pr.active && projEl) {
        pr.t += dt;
        pr.vy += 1100 * dt;
        pr.x += pr.vx * dt;
        pr.y += pr.vy * dt;
        const f = pr.t / pr.T;
        const op = f < 0.7 ? 1 : Math.max(0, 1 - (f - 0.7) / 0.3);
        projEl.style.transform = "translate(" + pr.x.toFixed(1) + "px," + pr.y.toFixed(1) + "px)";
        projEl.style.opacity = op.toFixed(2);
        if (pr.t >= pr.T) {
          pr.active = false;
          setProj(null);
        }
      }

      if (outer) {
        outer.style.transform = "translate(" + p.x.toFixed(1) + "px," + (p.y + p.hy).toFixed(1) + "px)";
      }

      const speed = Math.hypot(p.vx, p.vy);
      const isMoving = speed > 30;
      if (isMoving !== p.moving) {
        p.moving = isMoving;
        setPandaMoving(isMoving);
      }
      if (inner) {
        const targetLean = p.clingDir !== 0 && !isMoving ? p.clingDir * 12 : isMoving ? Math.max(-18, Math.min(18, p.vx * 0.04)) : 0;
        p.lean += (targetLean - p.lean) * Math.min(1, dt * 10);
        inner.style.rotate = p.lean.toFixed(2) + "deg";
        const dur = Math.max(0.18, Math.min(0.55, 0.55 - speed / 1600));
        inner.style.setProperty("--run-dur", dur.toFixed(2) + "s");
        const sy = 1 + p.squash * 0.16;
        const sx = 1 - p.squash * 0.09;
        inner.style.scale = sx.toFixed(3) + " " + sy.toFixed(3);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onSwitchHover() {
    wakeAndResetIdle();
    const p = physRef.current;
    if (switchLockedRef.current) return;
    if (p.purpose !== "none" || actionRef.current !== "idle") return;
    startFetch();
  }

  function onSwitchLeave() {
    if (pendingToggleRef.current) return;
    wakeAndResetIdle();
    const p = physRef.current;
    if (grabTimerRef.current !== null) {
      window.clearTimeout(grabTimerRef.current);
      grabTimerRef.current = null;
    }
    setGrabbing(false);
    if (actionRef.current === "holding" && holdingBodyRef.current) {
      const body = holdingBodyRef.current;
      const target = measureBodyCenter(body);
      if (target) throwOrbTo(target.x, target.y, 0.7, body);
      setThrowDir(body === "moon" ? "right" : "left");
      setPandaAction("throwing");
      setHoldingBody(null);
      setClinging(false);
      p.clingDir = 0;
      lockSwitch();
      if (throwTimerRef.current !== null) window.clearTimeout(throwTimerRef.current);
      throwTimerRef.current = window.setTimeout(() => {
        setPandaAction("idle");
        goHome();
      }, 700);
    } else if (p.purpose === "grab" || p.purpose === "cling") {
      goHome();
    }
  }

  function toggle() {
    wakeAndResetIdle();
    if (switchLockedRef.current) return;
    if (throwTimerRef.current !== null) {
      window.clearTimeout(throwTimerRef.current);
      throwTimerRef.current = null;
    }
    if (grabTimerRef.current !== null) {
      window.clearTimeout(grabTimerRef.current);
      grabTimerRef.current = null;
    }
    setGrabbing(false);
    const p = physRef.current;
    if (actionRef.current === "holding" && holdingBodyRef.current) {
      lockSwitch();
      doThrowAndSwitch();
    } else if (actionRef.current === "idle" && p.purpose === "none") {
      if (startFetch()) {
        pendingToggleRef.current = true;
        lockSwitch();
      } else {
        switchMode();
      }
    } else if (p.purpose === "grab" || p.purpose === "cling") {
      pendingToggleRef.current = true;
      lockSwitch();
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    wakeAndResetIdle();
    if (!isValidEmail(email) || !isValidPassword(password)) {
      registerFail();
      return;
    }
    if (!isLogin && name.trim() === "") {
      setError("Nhập tên của bạn đã");
      return;
    }
    if (isLogin) {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        setError(error.message ?? "Đăng nhập thất bại");
        registerFail();
        return;
      }
    } else {
      const { error } = await authClient.signUp.email({ name, email, password });
      if (error) {
        setError(error.message ?? "Đăng ký thất bại");
        registerFail();
        return;
      }
    }
    router.push("/");
    router.refresh();
  }

  const cardCls = isLogin
    ? "border-fuchsia-500/30 bg-slate-950/80 shadow-[0_0_50px_rgba(232,121,249,0.15)] backdrop-blur-md"
    : "border-cyan-500/30 bg-slate-950/80 shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur-md";
  const titleGlowCls = isLogin ? "neon-text-pink" : "neon-text-cyan";
  const subCls = isLogin ? "text-fuchsia-300" : "text-cyan-300";
  const labelCls = "text-slate-200";
  const inputCls = isLogin
    ? "rounded-xl border border-fuchsia-500/30 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30"
    : "rounded-xl border border-cyan-500/30 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";
  const btnCls = isLogin
    ? "rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 py-2.5 font-semibold text-white shadow-lg shadow-fuchsia-500/40 transition hover:from-fuchsia-400 hover:via-pink-400 hover:to-orange-300"
    : "rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/40 transition hover:from-cyan-300 hover:to-blue-500";
  const switchTextCls = "text-slate-400";
  const switchBtnCls = isLogin ? "text-fuchsia-300" : "text-cyan-300";
  const diamondCls = isLogin
    ? "bg-fuchsia-400 shadow-[0_0_12px_2px_rgba(232,121,249,0.8)]"
    : "bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.8)]";
  const skyDurCls = grabbing ? "duration-200 " : "duration-1000 ";

  return (
    <main ref={mainRef} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      <div
        className={"absolute inset-0 bg-gradient-to-b from-[#0a0618] via-[#1c0b33] to-[#0a0618] transition-opacity duration-1000 " + (isLogin ? "opacity-100" : "opacity-0")}
      />
      <div
        className={"absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1a33] to-[#0e2a4a] transition-opacity duration-1000 " + (isLogin ? "opacity-0" : "opacity-100")}
      />

      <div
        ref={sunRef}
        aria-hidden
        className={"absolute right-[6%] top-[8%] hidden transition-all sm:block " + skyDurCls + (isLogin ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0") + " " + (holdingBody === "sun" ? "scale-0" : "scale-100")}
      >
        <NeonSun />
      </div>

      <div
        ref={moonRef}
        aria-hidden
        className={"absolute left-[6%] top-[8%] hidden transition-all sm:block " + skyDurCls + (isLogin ? "-translate-y-32 opacity-0" : "translate-y-0 opacity-100") + " " + (holdingBody === "moon" ? "scale-0" : "scale-100")}
      >
        <NeonMoon />
      </div>

      <div
        aria-hidden
        className={"pointer-events-none absolute inset-0 transition-opacity duration-1000 " + (isLogin ? "opacity-0" : "opacity-100")}
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            className="animate-neon-pulse absolute rounded-full bg-cyan-100"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
          />
        ))}
      </div>

      <NeonOrbs />

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
        {TREES.map((t, i) => (
          <NeonTree key={i} left={t.left} size={t.size} color={t.color} />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-24 border-t border-cyan-500/20 bg-slate-900/90">
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,transparent_0_24px,rgba(34,211,238,0.55)_24px_48px)]" />
          <div className="animate-drive-right absolute left-0 top-2" style={{ animationDelay: "-4s" }}>
            <NeonCar body="from-cyan-400 to-blue-500" glow="rgba(34,211,238,0.6)" />
          </div>
          <div className="animate-drive-right absolute left-0 top-2" style={{ animationDelay: "-11s" }}>
            <NeonCar body="from-fuchsia-400 to-purple-600" glow="rgba(232,121,249,0.6)" />
          </div>
          <div className="animate-drive-left absolute left-0 top-[52px]" style={{ animationDelay: "-7s" }}>
            <NeonCar body="from-violet-400 to-purple-600" glow="rgba(168,85,247,0.6)" flip />
          </div>
          <div className="animate-drive-left absolute left-0 top-[52px]" style={{ animationDelay: "-14s" }}>
            <NeonCar body="from-amber-300 to-orange-500" glow="rgba(251,191,36,0.6)" flip />
          </div>
        </div>
      </div>

      <div ref={cardRef} className="relative w-full max-w-md">
        <div ref={pandaOuterRef} className="absolute z-10" style={{ left: 0, top: 0, transform: "translate(192px, -64px)" }}>
          {speech && (
            <div className="absolute bottom-full left-1/2 mb-3 max-w-[240px] -translate-x-1/2 rounded-2xl border border-cyan-400/50 bg-slate-900/95 px-3 py-1.5 text-center text-xs font-medium text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.35)]">
              {speech}
              <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-cyan-400/50 bg-slate-900" />
            </div>
          )}
          <div key={"panda-" + mode} className={(pandaAction === "throwing" ? (throwDir === "right" ? "animate-panda-throw-right" : "animate-panda-throw-left") : "animate-panda-jump") + " relative"}>
            <Panda holdingBody={holdingBody} action={pandaAction} moving={pandaMoving} grabbing={grabbing} clinging={clinging} mood={mood} orbRef={orbRef} innerRef={pandaInnerRef} />
          </div>
        </div>
        {proj && (
          <div ref={projRef} className={"absolute z-10 h-5 w-5 rounded-full " + proj.cls} style={{ left: 0, top: 0 }} />
        )}
        <div
          key={mode}
          className={"relative w-full rounded-[2rem] border p-8 shadow-xl " + (isLogin ? "animate-slide-from-right" : "animate-slide-from-left") + " " + cardCls}
        >
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className={"h-3 w-3 rotate-45 " + diamondCls} />
              <h1 className={"font-cyber text-xl text-white " + titleGlowCls}>Minh Ân</h1>
              <span className={"h-3 w-3 rotate-45 " + diamondCls} />
            </div>
            <p className={"mt-2 text-sm " + subCls}>mi nhìn cái gì</p>
          </div>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {!isLogin && (
              <div className="grid gap-1.5">
                <label htmlFor="name" className={"text-sm font-medium " + labelCls}>Tên</label>
                <input id="name" value={name} onChange={(e) => { setName(e.target.value); wakeAndResetIdle(); }} onFocus={wakeAndResetIdle} required className={inputCls} />
              </div>
            )}
            <div className="grid gap-1.5">
              <label htmlFor="email" className={"text-sm font-medium " + labelCls}>Email</label>
              <input id="email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} onBlur={() => onFieldBlur("email")} onFocus={wakeAndResetIdle} required className={inputCls} />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="password" className={"text-sm font-medium " + labelCls}>Mật khẩu</label>
              <input id="password" type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} onBlur={() => onFieldBlur("password")} onFocus={wakeAndResetIdle} required className={inputCls} />
            </div>
            {error && <p className="rounded-xl bg-rose-500/15 px-3 py-2 text-sm text-rose-300">{error}</p>}
            <button type="submit" className={btnCls}>
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>
          <p className={"mt-5 text-center text-sm " + switchTextCls}>
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              type="button"
              onClick={toggle}
              onMouseEnter={onSwitchHover}
              onMouseLeave={onSwitchLeave}
              disabled={switchLocked}
              className={"font-semibold underline disabled:cursor-wait disabled:opacity-50 " + switchBtnCls}
            >
              {switchLocked ? "Đợi gấu xíu..." : isLogin ? "Đăng ký" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
