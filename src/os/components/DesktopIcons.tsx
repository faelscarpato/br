import { APPS } from "../registry/apps";
import { useWindowManager } from "../context/WindowManagerContext";
import { useTheme } from "../context/ThemeContext";
import { useShell } from "../context/ShellContext";

export function DesktopIcons() {
  const { openApp, windows } = useWindowManager();
  const { osTheme } = useTheme();
  const { breakpoint } = useShell();

  if (osTheme !== "win11") return null;
  if (breakpoint === "mobile") return null;

  return (
    <div className="absolute left-4 top-10 z-10 flex flex-col gap-2">
      {APPS.map((app) => {
        const isOpen = !!windows.find((w) => w.appId === app.id);
        return (
          <button
            key={app.id}
            onClick={() => {
              const existing = windows.find((w) => w.appId === app.id);
              openApp(app.id, {
                title: app.name,
                icon: app.icon,
                width: existing?.width ?? app.defaultSize?.width,
                height: existing?.height ?? app.defaultSize?.height,
              });
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/8 active:scale-95"
          >
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-base font-bold text-black/85 shadow-sm"
              style={{
                background:
                  app.accent === "green"
                    ? "oklch(0.72 0.17 150)"
                    : app.accent === "blue"
                      ? "oklch(0.65 0.16 240)"
                      : app.accent === "yellow"
                        ? "oklch(0.86 0.16 95)"
                        : "oklch(0.45 0.03 250)",
                boxShadow: `0 2px 8px oklch(0 0 0 / 0.2)`,
              }}
            >
              {app.icon}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white/80 drop-shadow-sm">{app.name}</span>
              <span className="text-[10px] text-white/40">{app.description}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
