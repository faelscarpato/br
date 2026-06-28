import { useEffect, useRef, useState, type ReactNode } from "react";
import type { WindowState } from "../context/WindowManagerContext";
import { useWindowManager } from "../context/WindowManagerContext";
import { useTheme } from "../context/ThemeContext";

const MIN_W = 360;
const MIN_H = 240;

const win11Accent = "oklch(0.55 0.2 250)";

export function Window({ win, children }: { win: WindowState; children: ReactNode }) {
  const { focus, close, minimize, toggleMaximize, move, resize, focusId } = useWindowManager();
  const { osTheme } = useTheme();
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null,
  );
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    w: number;
    h: number;
    x: number;
    y: number;
    dir: string;
  } | null>(null);
  const [active, setActive] = useState(focusId === win.id);
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => setActive(focusId === win.id), [focusId, win.id]);
  useEffect(() => {
    const t = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function onMouseDownHeader(e: React.MouseEvent) {
    if (win.state === "maximized") return;
    focus(win.id);
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y };
    const onMove = (ev: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      move(
        win.id,
        Math.max(0, d.origX + ev.clientX - d.startX),
        Math.max(0, d.origY + ev.clientY - d.startY),
      );
    };
    const onUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function startResize(dir: string) {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      if (win.state === "maximized") return;
      focus(win.id);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        w: win.width,
        h: win.height,
        x: win.x,
        y: win.y,
        dir,
      };
      const onMove = (ev: MouseEvent) => {
        const r = resizeRef.current;
        if (!r) return;
        const dx = ev.clientX - r.startX;
        const dy = ev.clientY - r.startY;
        let { w, h, x, y } = r;
        if (dir.includes("e")) w = Math.max(MIN_W, r.w + dx);
        if (dir.includes("s")) h = Math.max(MIN_H, r.h + dy);
        if (dir.includes("w")) {
          w = Math.max(MIN_W, r.w - dx);
          x = r.x + (r.w - w);
        }
        if (dir.includes("n")) {
          h = Math.max(MIN_H, r.h - dy);
          y = r.y + (r.h - h);
        }
        resize(win.id, w, h, x, y);
      };
      const onUp = () => {
        resizeRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
  }

  if (win.state === "minimized") return null;

  const isFull = win.state === "maximized";
  const isWin11 = osTheme === "win11";
  const radius = isWin11 ? "rounded-[8px]" : "rounded-2xl";

  return (
    <div
      onMouseDown={() => focus(win.id)}
      className={`absolute flex flex-col overflow-hidden transition-all duration-200 ${
        isFull ? "rounded-none" : radius
      } ${isDragging ? "scale-[1.015]" : ""}`}
      style={{
        left: isFull ? 0 : win.x,
        top: isFull ? 28 : win.y,
        width: isFull ? "100%" : win.width,
        height: isFull ? (isWin11 ? "calc(100% - 28px - 48px)" : "calc(100% - 28px - 88px)") : win.height,
        zIndex: win.z,
        background: isWin11 ? "oklch(0.14 0.01 260 / 0.96)" : "oklch(0.14 0.015 260 / 0.82)",
        backdropFilter: isWin11 ? "none" : "blur(36px) saturate(140%)",
        WebkitBackdropFilter: isWin11 ? "none" : "blur(36px) saturate(140%)",
        border: active
          ? `1px solid ${isWin11 ? `${win11Accent} / 0.4` : "oklch(1 0 0 / 0.12)"}`
          : "1px solid oklch(1 0 0 / 0.04)",
        boxShadow: active
          ? `0 16px 48px -12px oklch(0 0 0 / 0.6), 0 2px 8px -4px oklch(0 0 0 / 0.3), inset 0 1px 0 oklch(1 0 0 / ${isWin11 ? "0.08" : "0.06"})`
          : "0 4px 24px -12px oklch(0 0 0 / 0.5)",
        opacity: isReady ? 1 : 0,
        transform: isReady ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
      }}
    >
      {/* title bar */}
      <header
        onMouseDown={onMouseDownHeader}
        onDoubleClick={() => toggleMaximize(win.id)}
        className={`flex h-9 shrink-0 cursor-grab items-center px-3 active:cursor-grabbing select-none ${
          isWin11 ? "border-b border-white/5" : "border-b border-white/5"
        }`}
        style={
          isWin11
            ? {
                background: active
                  ? `linear-gradient(135deg, ${win11Accent}, oklch(0.48 0.22 260))`
                  : "oklch(0.12 0.01 260 / 0.9)",
              }
            : undefined
        }
      >
        {isWin11 ? (
          <>
            {/* Win11: icon + title on left */}
            <div
              className="flex items-center gap-2 text-xs font-medium select-none"
              style={{ color: active ? "oklch(0.95 0.01 250)" : "oklch(0.6 0.01 250)" }}
            >
              <span className="opacity-80 text-sm">{win.icon}</span>
              <span className="tracking-wide">{win.title}</span>
            </div>

            {/* Win11: buttons on right */}
            <div className="ml-auto flex items-center">
              <Win11Btn
                onClick={() => minimize(win.id)}
                label="Minimizar"
                icon={
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <rect x="1" y="4.5" width="8" height="1" rx="0.3" fill="currentColor" />
                  </svg>
                }
                active={active}
              />
              <Win11Btn
                onClick={() => toggleMaximize(win.id)}
                label={isFull ? "Restaurar" : "Maximizar"}
                icon={
                  isFull ? (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <rect
                        x="2.5"
                        y="0.5"
                        width="7"
                        height="7"
                        rx="0.5"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        fill="none"
                      />
                      <rect
                        x="0.5"
                        y="2.5"
                        width="7"
                        height="7"
                        rx="0.5"
                        fill="currentColor"
                        opacity="0.8"
                      />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <rect
                        x="1"
                        y="1"
                        width="8"
                        height="8"
                        rx="0.8"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        fill="none"
                      />
                    </svg>
                  )
                }
                active={active}
              />
              <Win11Btn
                onClick={() => close(win.id)}
                label="Fechar"
                isClose
                icon={
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path
                      d="M1.5 1.5l7 7M8.5 1.5l-7 7"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                active={active}
              />
            </div>
          </>
        ) : (
          <>
            {/* macOS traffic light buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  close(win.id);
                }}
                aria-label="close"
                className="h-3 w-3 rounded-full bg-[oklch(0.65_0.23_25)] transition-all hover:brightness-125 active:scale-85"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  minimize(win.id);
                }}
                aria-label="minimize"
                className="h-3 w-3 rounded-full bg-[oklch(0.86_0.16_95)] transition-all hover:brightness-125 active:scale-85"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize(win.id);
                }}
                aria-label="maximize"
                className="h-3 w-3 rounded-full bg-[oklch(0.72_0.17_150)] transition-all hover:brightness-125 active:scale-85"
              />
            </div>
            {/* centered title */}
            <div className="absolute left-0 right-0 flex items-center justify-center gap-2 text-xs font-medium text-white/50 pointer-events-none">
              <span className="opacity-60">{win.icon}</span>
              <span>{win.title}</span>
            </div>
          </>
        )}
      </header>

      {/* content */}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>

      {/* resize handles */}
      {!isFull && (
        <>
          <div
            onMouseDown={startResize("e")}
            className="absolute right-0 top-2 bottom-2 w-1.5 cursor-ew-resize hover:bg-white/5 transition-colors"
          />
          <div
            onMouseDown={startResize("w")}
            className="absolute left-0 top-2 bottom-2 w-1.5 cursor-ew-resize hover:bg-white/5 transition-colors"
          />
          <div
            onMouseDown={startResize("s")}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize hover:bg-white/5 transition-colors"
          />
          <div
            onMouseDown={startResize("n")}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize hover:bg-white/5 transition-colors"
          />
          <div
            onMouseDown={startResize("se")}
            className="absolute bottom-0 right-0 h-3.5 w-3.5 cursor-nwse-resize hover:bg-white/5 transition-colors"
          />
          <div
            onMouseDown={startResize("sw")}
            className="absolute bottom-0 left-0 h-3.5 w-3.5 cursor-nesw-resize hover:bg-white/5 transition-colors"
          />
          <div
            onMouseDown={startResize("ne")}
            className="absolute top-0 right-0 h-3.5 w-3.5 cursor-nesw-resize hover:bg-white/5 transition-colors"
          />
          <div
            onMouseDown={startResize("nw")}
            className="absolute top-0 left-0 h-3.5 w-3.5 cursor-nwse-resize hover:bg-white/5 transition-colors"
          />
        </>
      )}
    </div>
  );
}

function Win11Btn({
  icon,
  onClick,
  label,
  isClose,
  active,
}: {
  icon: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  isClose?: boolean;
  active: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      title={label}
      className="flex h-9 w-11 items-center justify-center transition-colors active:scale-90"
      style={{
        background:
          isClose && hover
            ? "oklch(0.55 0.25 25 / 0.8)"
            : hover
              ? active
                ? "oklch(1 0 0 / 0.12)"
                : "oklch(1 0 0 / 0.08)"
              : "transparent",
        color: active ? "oklch(0.9 0.01 250)" : "oklch(0.5 0.01 250)",
      }}
    >
      {icon}
    </button>
  );
}
