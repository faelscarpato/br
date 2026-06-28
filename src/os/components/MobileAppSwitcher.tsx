import { useState, useEffect } from "react";
import { APPS } from "../registry/apps";
import { useWindowManager } from "../context/WindowManagerContext";
import { useTheme } from "../context/ThemeContext";

export function MobileAppSwitcher() {
  const { windows, focusId, close } = useWindowManager();
  const { osTheme } = useTheme();
  const [animIn, setAnimIn] = useState(false);

  const activeWindow = windows.find((w) => w.id === focusId) ?? windows[windows.length - 1];
  const app = activeWindow ? APPS.find((a) => a.id === activeWindow.appId) : null;
  const Comp = app?.component;

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimIn(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const isWin11 = osTheme === "win11";

  if (!app || !Comp || !activeWindow) {
    return (
      <div
        className={`absolute inset-x-0 flex flex-col items-center justify-center px-6 text-center transition-all duration-500 ${
          isWin11 ? "top-0 bottom-12" : "top-7 bottom-20"
        }`}
        style={{
          opacity: animIn ? 1 : 0,
          transform: animIn ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <div
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center shadow-2xl"
          style={{
            borderRadius: isWin11 ? "18px" : "28px",
            background: isWin11
              ? "linear-gradient(135deg, oklch(0.62 0.18 240), oklch(0.5 0.2 260))"
              : "linear-gradient(135deg, oklch(0.72 0.17 150), oklch(0.65 0.16 240), oklch(0.86 0.16 95))",
          }}
        >
          <span className="text-3xl font-black text-white drop-shadow-lg">
            {isWin11 ? "⊞" : "B"}
          </span>
        </div>
        <h1 className="text-xl font-bold text-white/70">{isWin11 ? "Windows 11" : "BrOS"}</h1>
        <p className="mt-1 text-sm text-white/30">
          {isWin11 ? "Toque Iniciar na barra de tarefas" : "Toque um app na dock"}
        </p>
      </div>
    );
  }

  const headerBg = isWin11 && activeWindow ? "oklch(0.55 0.2 250 / 0.25)" : "oklch(1 0 0 / 0.03)";

  return (
    <div
      className={`absolute inset-x-0 flex flex-col overflow-hidden transition-all duration-300 ${
        isWin11 ? "top-0 bottom-12" : "top-7 bottom-20"
      }`}
      style={{
        opacity: animIn ? 1 : 0,
        transform: animIn ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
      }}
    >
      <div
        className="flex flex-1 flex-col overflow-hidden"
        style={{
          background: isWin11 ? "oklch(0.12 0.01 260 / 0.9)" : "oklch(0.14 0.015 260 / 0.85)",
          backdropFilter: isWin11 ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: isWin11 ? "blur(24px) saturate(180%)" : "none",
          borderTopLeftRadius: isWin11 ? 12 : 0,
          borderTopRightRadius: isWin11 ? 12 : 0,
          marginTop: isWin11 ? 0 : 0,
        }}
      >
        {/* header */}
        <header
          className={`flex h-11 shrink-0 items-center justify-between px-4 ${
            isWin11 ? "border-b border-white/5" : "border-b border-white/5"
          }`}
          style={{ background: headerBg }}
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold text-white/80">
            <div
              className="grid h-7 w-7 place-items-center rounded-lg text-xs font-bold text-black/85 shadow-sm"
              style={{
                background:
                  app.accent === "green"
                    ? "oklch(0.72 0.17 150)"
                    : app.accent === "blue"
                      ? "oklch(0.65 0.16 240)"
                      : app.accent === "yellow"
                        ? "oklch(0.86 0.16 95)"
                        : "oklch(0.45 0.03 250)",
              }}
            >
              {app.icon}
            </div>
            <span>{app.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => close(activeWindow.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white/60 active:scale-90"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          </div>
        </header>

        {/* app content */}
        <div className="min-h-0 flex-1 overflow-auto bg-white/[0.015]">
          <Comp />
        </div>
      </div>
    </div>
  );
}
