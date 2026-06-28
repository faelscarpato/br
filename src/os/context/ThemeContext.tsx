import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type OsTheme = "bros" | "win11";

export interface UserAccount {
  name: string;
  avatar: string;
  email: string;
}

interface ThemeContextValue {
  osTheme: OsTheme;
  setOsTheme: (t: OsTheme) => void;
  user: UserAccount;
  updateUser: (partial: Partial<UserAccount>) => void;
}

const Ctx = createContext<ThemeContextValue | null>(null);

const DEFAULT_USER: UserAccount = { name: "Admin", avatar: "🦊", email: "admin@bros.local" };

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [osTheme, setOsThemeState] = useState<OsTheme>(() =>
    load<OsTheme>("bros.os-theme", "win11"),
  );
  const [user, setUser] = useState<UserAccount>(() => load<UserAccount>("bros.user", DEFAULT_USER));

  const setOsTheme = useCallback((t: OsTheme) => {
    setOsThemeState(t);
    localStorage.setItem("bros.os-theme", t);
  }, []);

  const updateUser = useCallback((partial: Partial<UserAccount>) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("bros.user", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ osTheme, setOsTheme, user, updateUser }),
    [osTheme, setOsTheme, user, updateUser],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
