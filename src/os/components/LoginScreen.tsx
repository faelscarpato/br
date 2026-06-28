import { type FormEvent, useState, useRef } from "react";
import { useShell } from "../context/ShellContext";

const DEFAULT_PASSWORD = "1234";

export function LoginScreen() {
  const { setScreen } = useShell();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password === DEFAULT_PASSWORD) {
      setLoading(true);
      setTimeout(() => setScreen("desktop"), 400);
    } else {
      setError(true);
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(false), 2000);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[199] flex flex-col bg-[oklch(0.06_0.01_260)]">
      {/* diagonal flag splits */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-12 top-0 h-[120%] w-16 rotate-12 bg-[oklch(0.72_0.17_150)] opacity-[0.04]" />
        <div className="absolute -left-8 top-0 h-[120%] w-12 rotate-12 bg-[oklch(0.86_0.16_95)] opacity-[0.03]" />
        <div className="absolute left-4 top-0 h-[120%] w-20 rotate-12 bg-[oklch(0.65_0.16_240)] opacity-[0.03]" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* avatar */}
        <div className="mb-6">
          <div
            className="relative h-20 w-20 overflow-hidden rounded-[22px] shadow-2xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.72 0.17 150), oklch(0.65 0.16 240))",
              boxShadow: "0 0 60px oklch(0.72 0.17 150 / 0.15)",
            }}
          >
            <div
              className="absolute inset-[2px] flex items-center justify-center rounded-[20px]"
              style={{ background: "oklch(0.08 0.01 260)" }}
            >
              <span className="text-3xl font-black text-white/80">U</span>
            </div>
          </div>
        </div>

        <h2 className="mb-6 text-sm font-bold tracking-wider text-white/70">USUÁRIO</h2>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[240px] flex-col items-center gap-3"
        >
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="senha"
              autoFocus
              disabled={loading}
              className={`w-full rounded-lg border px-4 py-2.5 text-center text-sm font-mono tracking-widest text-white/80 transition-all placeholder:text-white/20 focus:outline-none disabled:opacity-50 ${
                error
                  ? "border-[oklch(0.65_0.23_25)] ring-1 ring-[oklch(0.65_0.23_25)]"
                  : "border-white/10 focus:border-white/30"
              } ${shaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
              style={{ background: "oklch(1 0 0 / 0.06)" }}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-[oklch(0.65_0.23_25)] animate-[fadeIn_0.3s_ease-out]">
              senha incorreta
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-lg font-bold text-sm tracking-wider text-white transition-all active:scale-[0.97] disabled:opacity-50 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, oklch(0.72 0.17 150), oklch(0.65 0.16 240))",
            }}
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.25"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="31.4 31.4"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              "entrar"
            )}
          </button>

          <p className="mt-2 text-[10px] text-white/12 font-mono">senha padrão: 1234</p>
        </form>
      </div>

      <div className="pb-6 text-center">
        <span className="text-[10px] font-mono text-white/10 tracking-wider">BrOS v1.0</span>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
