import { useState } from "react";
import { APPS } from "../../registry/apps";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useTheme } from "../../context/ThemeContext";
import { useShell } from "../../context/ShellContext";

interface Props {
  onClose: () => void;
}

export function Win11StartMenu({ onClose }: Props) {
  const { openApp, windows } = useWindowManager();
  const { user, setOsTheme } = useTheme();
  const { breakpoint } = useShell();
  const [query, setQuery] = useState("");

  const filtered = APPS.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase()),
  );

  const handleOpen = (appId: string) => {
    const app = APPS.find((a) => a.id === appId);
    if (!app) return;
    openApp(appId, {
      title: app.name,
      icon: app.icon,
      width: app.defaultSize?.width,
      height: app.defaultSize?.height,
    });
    onClose();
  };

  const isMobile = breakpoint === "mobile";

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />

      <div
        className={`fixed z-50 flex flex-col overflow-hidden shadow-2xl ${
          isMobile
            ? "inset-x-2 bottom-16 rounded-2xl max-h-[60vh]"
            : "bottom-14 left-3 w-[360px] rounded-2xl max-h-[70vh]"
        }`}
        style={{
          background: "oklch(0.1 0.01 260 / 0.92)",
          backdropFilter: "blur(50px) saturate(200%)",
          WebkitBackdropFilter: "blur(50px) saturate(200%)",
          border: "1px solid oklch(1 0 0 / 0.08)",
          boxShadow: "0 24px 80px -16px oklch(0 0 0 / 0.7), 0 4px 16px -4px oklch(0 0 0 / 0.4)",
        }}
      >
        {/* Search */}
        <div className="p-3 pb-1">
          <div
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 focus-within:ring-1 focus-within:ring-[oklch(0.62_0.18_240_/_0.4)]"
            style={{ background: "oklch(1 0 0 / 0.06)" }}
          >
            <svg
              className="h-4 w-4 shrink-0 text-white/30"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3 3" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar aplicativos"
              className="flex-1 bg-transparent text-white/80 outline-none placeholder:text-white/20 text-[13px]"
            />
          </div>
        </div>

        {/* Pinned / All apps header */}
        <div className="px-3 pb-1 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
            {query ? "Resultados" : "Aplicativos"}
          </span>
        </div>

        {/* App grid */}
        <div className="grid grid-cols-3 gap-0.5 overflow-auto px-2 pb-2">
          {filtered.slice(0, 18).map((app) => (
            <button
              key={app.id}
              onClick={() => handleOpen(app.id)}
              className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-colors hover:bg-white/8 active:scale-95"
            >
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl text-base font-bold text-black/85 shadow-sm"
                style={{
                  background:
                    app.accent === "green"
                      ? "oklch(0.72 0.17 150)"
                      : app.accent === "blue"
                        ? "oklch(0.65 0.16 240)"
                        : app.accent === "yellow"
                          ? "oklch(0.86 0.16 95)"
                          : "oklch(0.45 0.03 250)",
                  boxShadow: "0 2px 8px oklch(0 0 0 / 0.2)",
                }}
              >
                {app.icon}
              </div>
              <span className="text-[11px] font-medium text-white/60 line-clamp-1 leading-tight">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-base">
              {user.avatar}
            </span>
            <span className="text-xs font-medium text-white/70">{user.name}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setOsTheme("bros")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
              title="Mudar para BrOS"
            >
              <span className="text-sm font-bold">B</span>
            </button>
            <button
              onClick={() => {
                openApp("settings", { title: "Configurações", icon: "⚙" });
                onClose();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
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
          </div>
        </div>
      </div>
    </>
  );
}
