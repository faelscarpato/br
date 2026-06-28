import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useBreakpoint, type Breakpoint } from "../hooks/useBreakpoint";

type Theme = "dark" | "light";

interface Toast {
  id: string;
  title: string;
  message?: string;
  variant?: "default" | "warning" | "error" | "success";
}

type Screen = "boot" | "login" | "desktop";

interface ShellContextValue {
  screen: Screen;
  setScreen: (s: Screen) => void;
  theme: Theme;
  toggleTheme: () => void;
  breakpoint: Breakpoint;
  toasts: Toast[];
  notify: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const Ctx = createContext<ShellContextValue | null>(null);

const BOOT_DURATION = 2500;

export function ShellProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("bros.theme") as Theme) || "dark";
  });
  const [screen, setScreen] = useState<Screen>("boot");
  const breakpoint = useBreakpoint();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("bros.theme", theme);
  }, [theme]);

  useEffect(() => {
    if (screen !== "boot") return;
    const t = setTimeout(() => setScreen("login"), BOOT_DURATION);
    return () => clearTimeout(t);
  }, [screen]);

  const notify = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((s) => [...s, { ...t, id }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 5000);
  }, []);
  const dismiss = useCallback((id: string) => setToasts((s) => s.filter((x) => x.id !== id)), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const value = useMemo<ShellContextValue>(
    () => ({ screen, setScreen, theme, toggleTheme, breakpoint, toasts, notify, dismiss }),
    [screen, theme, toggleTheme, breakpoint, toasts, notify, dismiss],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShell() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShell must be used inside ShellProvider");
  return v;
}
