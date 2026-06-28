import { useState, useEffect } from "react";
import { APPS } from "../../registry/apps";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useTheme } from "../../context/ThemeContext";
import { useShell } from "../../context/ShellContext";
import { Win11StartMenu } from "./Win11StartMenu";

export function Win11Taskbar() {
  const { windows, focusId, openApp, toggleMinimize } = useWindowManager();
  const { osTheme } = useTheme();
  const { breakpoint } = useShell();
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const isMobile = breakpoint === "mobile";

  if (osTheme !== "win11") return null;

  const startApp = (appId: string) => {
    const app = APPS.find((a) => a.id === appId);
    if (!app) return;
    const existing = windows.find((w) => w.appId === appId);
    openApp(appId, {
      title: app.name,
      icon: app.icon,
      width: existing?.width ?? app.defaultSize?.width,
      height: existing?.height ?? app.defaultSize?.height,
    });
  };

  return (
    <>
      {menuOpen && <Win11StartMenu onClose={() => setMenuOpen(false)} />}

      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex h-12 items-center px-2 select-none"
        style={{
          background: "oklch(0.08 0.01 260 / 0.88)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderTop: "1px solid oklch(1 0 0 / 0.06)",
        }}
      >
        {isMobile ? (
          <>
            {/* Mobile Win11 taskbar: 3 icons */}
            {/* Left: ChatIA (TextAI) */}
            <button
              onClick={() => startApp("text-ai")}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10"
              aria-label="ChatIA"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Center: Start button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              style={menuOpen ? { background: "oklch(1 0 0 / 0.12)" } : undefined}
              aria-label="Iniciar"
            >
              <svg viewBox="0 0 28 28" className="h-5 w-5">
                <defs>
                  <linearGradient id="win11-logo-mob" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.16 240)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.18 260)" />
                  </linearGradient>
                </defs>
                <rect x="3" y="3" width="9" height="9" rx="1.5" fill="url(#win11-logo-mob)" />
                <rect x="16" y="3" width="9" height="9" rx="1.5" fill="url(#win11-logo-mob)" />
                <rect x="3" y="16" width="9" height="9" rx="1.5" fill="url(#win11-logo-mob)" />
                <rect x="16" y="16" width="9" height="9" rx="1.5" fill="url(#win11-logo-mob)" />
              </svg>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right: Settings */}
            <button
              onClick={() => startApp("settings")}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/60"
              aria-label="Configurações"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Desktop Win11 taskbar */}
            {/* Start button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              style={menuOpen ? { background: "oklch(1 0 0 / 0.12)" } : undefined}
            >
              <svg viewBox="0 0 28 28" className="h-5 w-5">
                <defs>
                  <linearGradient id="win11-logo-desk" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.16 240)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.18 260)" />
                  </linearGradient>
                </defs>
                <rect x="3" y="3" width="9" height="9" rx="1.5" fill="url(#win11-logo-desk)" />
                <rect x="16" y="3" width="9" height="9" rx="1.5" fill="url(#win11-logo-desk)" />
                <rect x="3" y="16" width="9" height="9" rx="1.5" fill="url(#win11-logo-desk)" />
                <rect x="16" y="16" width="9" height="9" rx="1.5" fill="url(#win11-logo-desk)" />
              </svg>
            </button>

            {/* Running apps */}
            <div className="ml-1 flex flex-1 items-center gap-0.5 overflow-hidden">
              {APPS.map((app) => {
                const win = windows.find((w) => w.appId === app.id);
                if (!win) return null;
                const isActive = focusId === win.id;
                return (
                  <button
                    key={win.id}
                    onClick={() => toggleMinimize(win.id)}
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/8"
                  >
                    <span className="text-base font-bold text-white/70">{app.icon}</span>
                    <span
                      className="absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-200"
                      style={{
                        width: isActive ? 20 : 12,
                        background: isActive ? "oklch(0.62 0.18 240)" : "oklch(1 0 0 / 0.25)",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* System tray */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => startApp("settings")}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/8 hover:text-white/60"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <div className="flex h-10 items-center rounded-lg px-2 text-[11px] font-medium text-white/50 tabular-nums tracking-wide">
                {time}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
