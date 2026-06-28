import { useState } from "react";
import { APPS } from "../registry/apps";
import { useWindowManager } from "../context/WindowManagerContext";
import { useShell } from "../context/ShellContext";

const accentClass: Record<string, string> = {
  green: "from-[oklch(0.72_0.17_150)] to-[oklch(0.5_0.2_160)]",
  blue: "from-[oklch(0.65_0.16_240)] to-[oklch(0.45_0.22_260)]",
  yellow: "from-[oklch(0.86_0.16_95)] to-[oklch(0.7_0.2_70)]",
  neutral: "from-[oklch(0.45_0.03_250)] to-[oklch(0.3_0.03_250)]",
};

export function Dock() {
  const { windows, openApp, focus } = useWindowManager();
  const { breakpoint } = useShell();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (breakpoint !== "desktop") return null;

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3">
      <div className="pointer-events-auto relative">
        {/* flag accent line */}
        <div className="absolute -top-px left-4 right-4 flex h-[2px] overflow-hidden rounded-full opacity-60">
          <div className="flex-1 bg-[oklch(0.72_0.17_150)]" />
          <div className="flex-1 bg-[oklch(0.65_0.16_240)]" />
          <div className="flex-1 bg-[oklch(0.86_0.16_95)]" />
        </div>

        <div
          className="flex items-end gap-1.5 rounded-2xl px-3 py-2 shadow-2xl"
          style={{
            background: "oklch(0.12 0.012 260 / 0.75)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            border: "1px solid oklch(1 0 0 / 0.06)",
            boxShadow: "0 10px 40px -8px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(1 0 0 / 0.05)",
          }}
        >
          {APPS.map((app) => {
            const open = windows.find((w) => w.appId === app.id);
            const isHovered = hoveredId === app.id;
            const isMinimized = open?.state === "minimized";

            return (
              <button
                key={app.id}
                title={app.name}
                onClick={() =>
                  open
                    ? focus(open.id)
                    : openApp(app.id, {
                        title: app.name,
                        icon: app.icon,
                        width: app.defaultSize?.width,
                        height: app.defaultSize?.height,
                      })
                }
                onMouseEnter={() => setHoveredId(app.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex flex-col items-center transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110"
                style={{
                  transform: isHovered ? "translateY(-4px) scale(1.1)" : "translateY(0) scale(1)",
                  filter: isMinimized ? "grayscale(0.6) opacity(0.5)" : "none",
                }}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-base font-bold text-black/85 shadow-md transition-all duration-200 ${
                    accentClass[app.accent]
                  } ${open && !isMinimized ? "ring-2 ring-white/20" : ""}`}
                >
                  <span aria-hidden className="drop-shadow-sm">
                    {app.icon}
                  </span>
                </div>

                {/* tooltip */}
                <span
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-semibold text-white/80 transition-all duration-150 ${
                    isHovered
                      ? "scale-100 opacity-100 translate-y-0"
                      : "scale-75 opacity-0 translate-y-1 pointer-events-none"
                  }`}
                  style={{ background: "oklch(0.08 0.01 260 / 0.9)" }}
                >
                  {app.name}
                </span>

                {/* running dot */}
                {open && (
                  <span
                    className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all ${
                      isMinimized ? "bg-[oklch(0.86_0.16_95)]" : "bg-white/60"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
