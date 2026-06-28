import { useEffect, useState } from "react";
import { useShell } from "../context/ShellContext";
import { useWindowManager } from "../context/WindowManagerContext";
import { useTheme } from "../context/ThemeContext";

export function StatusBar() {
  const { breakpoint } = useShell();
  const { openApp } = useWindowManager();
  const { osTheme } = useTheme();
  const isMobile = breakpoint === "mobile";

  if (osTheme === "win11" && isMobile) return null;
  const [now, setNow] = useState(() => new Date());
  const [battery, setBattery] = useState(83);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const level = () => setBattery(Math.floor(Math.random() * 25) + 70);
    const t = setInterval(level, 60000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex h-7 items-center justify-between px-4 text-[11px] font-medium tracking-wide select-none"
      style={{
        background: isMobile ? "oklch(0.08 0.015 260 / 0.7)" : "oklch(0.1 0.01 260 / 0.5)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      {/* left: time */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white/80 tabular-nums">{time}</span>
      </div>

      {/* center: BrOS branding */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-xs font-black tracking-wider">
          <span className="text-[oklch(0.72_0.17_150)]">BR</span>
          <span className="text-white/30">/</span>
          <span className="text-[oklch(0.65_0.16_240)]">OS</span>
        </span>
      </div>

      {/* right: mobile status icons */}
      <div className="flex items-center gap-2">
        {/* signal */}
        <svg
          className="h-3 w-3.5 text-white/40"
          viewBox="0 0 16 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M1 10l2-3" />
          <path d="M5 8l2-3" opacity="0.6" />
          <path d="M9 6l2-3" opacity="0.4" />
          <path d="M13 4l2-3" opacity="0.25" />
        </svg>

        {/* wifi */}
        <svg
          className="h-3 w-3.5 text-white/40"
          viewBox="0 0 16 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 5.5a10 10 0 0 1 12 0" />
          <path d="M4.5 8a6.5 6.5 0 0 1 7 0" opacity="0.6" />
          <path d="M7 10.5a2.5 2.5 0 0 1 2 0" opacity="0.35" />
        </svg>

        {/* battery */}
        <div className="flex items-center gap-0.5">
          <svg
            className="h-3 w-4 text-white/40"
            viewBox="0 0 18 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="0.5" y="0.5" width="14" height="9" rx="2" />
            <rect x="16" y="2.5" width="1.8" height="5" rx="0.5" />
            <rect
              x="2"
              y="2"
              width={battery / 7}
              height="6"
              rx="1"
              fill="currentColor"
              opacity={battery > 20 ? 0.7 : 0.4}
            />
          </svg>
        </div>

        {!isMobile && (
          <button
            onClick={() => openApp("settings", { title: "Config", icon: "⚙" })}
            className="ml-1 flex h-5 items-center rounded px-1.5 text-white/40 transition-colors hover:bg-white/8 hover:text-white/60"
          >
            ⚙
          </button>
        )}
      </div>
    </div>
  );
}
