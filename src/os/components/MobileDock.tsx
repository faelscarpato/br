import { APPS } from "../registry/apps";
import { useWindowManager } from "../context/WindowManagerContext";

const accentBg: Record<string, string> = {
  green: "from-[oklch(0.72_0.17_150)] to-[oklch(0.5_0.2_160)]",
  blue: "from-[oklch(0.65_0.16_240)] to-[oklch(0.45_0.22_260)]",
  yellow: "from-[oklch(0.86_0.16_95)] to-[oklch(0.7_0.2_70)]",
  neutral: "from-[oklch(0.45_0.03_250)] to-[oklch(0.3_0.03_250)]",
};

export function MobileDock() {
  const { windows, focusId, openApp, toggleMinimize } = useWindowManager();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* flag accent line */}
      <div className="flex h-0.5">
        <div className="flex-1 bg-[oklch(0.72_0.17_150)]" />
        <div className="flex-1 bg-[oklch(0.65_0.16_240)]" />
        <div className="flex-1 bg-[oklch(0.86_0.16_95)]" />
        <div className="flex-1 bg-[oklch(0.72_0.17_150)]" />
        <div className="flex-1 bg-[oklch(0.65_0.16_240)]" />
      </div>

      <div
        className="flex items-end justify-around px-1 pb-2 pt-1"
        style={{
          background: "oklch(0.1 0.015 260 / 0.92)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {APPS.map((a) => {
          const win = windows.find((w) => w.appId === a.id);
          const isOpen = !!win;
          const isActive = win && focusId === win.id;
          const isMinimized = win?.state === "minimized";

          const handleTap = () => {
            if (!win) {
              openApp(a.id, {
                title: a.name,
                icon: a.icon,
                width: a.defaultSize?.width,
                height: a.defaultSize?.height,
              });
            } else {
              toggleMinimize(win.id);
            }
          };

          return (
            <button
              key={a.id}
              onClick={handleTap}
              className="relative flex flex-col items-center px-2 pt-1 transition-all duration-200 active:scale-90"
            >
              <div className="relative">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold text-black/85 shadow-lg transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${accentBg[a.accent]} scale-110 shadow-[0_4px_16px_oklch(0_0_0_/_0.4)]`
                      : isOpen
                        ? `bg-gradient-to-br ${accentBg[a.accent]} opacity-80`
                        : "bg-white/8 text-white/40"
                  }`}
                  style={!isOpen ? { background: "oklch(1 0 0 / 0.08)" } : undefined}
                >
                  {a.icon}
                </div>

                {/* running indicator - only for minimized apps */}
                {isMinimized && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[oklch(0.1_0.015_260)] bg-[oklch(0.86_0.16_95)]" />
                )}
              </div>

              <span
                className={`mt-0.5 text-[9px] font-semibold tracking-wide transition-all duration-200 ${
                  isActive ? "text-white/90 scale-105" : isOpen ? "text-white/50" : "text-white/20"
                }`}
              >
                {a.name}
              </span>

              {/* active underline */}
              {isActive && (
                <span className="mt-0.5 h-0.5 w-4 rounded-full bg-white/60 transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
