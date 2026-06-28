import { useEffect, useState } from "react";

const bootLines = [
  { msg: "bios: BrOS kernel 1.0.0 (build 2026)", t: 200 },
  { msg: "bios: cpu @ 2.4ghz · mem 8192mb", t: 600 },
  { msg: "init: montando sistema de arquivos...", t: 1000 },
  { msg: "init: carregando módulos de IA", t: 1350 },
  { msg: "init: serviços de rede ativados", t: 1650 },
  { msg: "bios: iniciando window manager...", t: 1950 },
];

export function BootScreen() {
  const [visible, setVisible] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    bootLines.forEach((l) => {
      setTimeout(() => setVisible((v) => v + 1), l.t);
    });
    const total = bootLines[bootLines.length - 1].t + 800;
    setTimeout(() => setDone(true), total);
    setTimeout(() => setFade(true), total + 300);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col bg-[oklch(0.06_0.01_260)] transition-opacity duration-700 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      {/* rough ascii logo */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <pre className="mb-8 text-center text-[10px] leading-tight text-white/15 font-mono tracking-wider">
          {`
    ██████   ██████   ██████
   ██  ████ ██  ████ ██  ████
   ██████  ██████  ██████
   ██  ████ ██  ████ ██  ████
   ██████   ██████   ██████
          `}
        </pre>

        {/* pill logo */}
        <div
          className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xl"
          style={{
            background: "linear-gradient(135deg, oklch(0.72 0.17 150), oklch(0.65 0.16 240))",
            boxShadow: "0 0 60px oklch(0.72 0.17 150 / 0.2), 0 0 120px oklch(0.65 0.16 240 / 0.1)",
          }}
        >
          <span className="text-2xl font-black text-white">B</span>
        </div>

        <h1 className="mt-3 text-sm font-black tracking-[0.3em] text-white/20 font-mono">
          BrOS 1.0
        </h1>

        {/* boot terminal */}
        <div className="mt-10 w-full max-w-xs">
          <div
            className="rounded-lg border border-white/5 px-4 py-3"
            style={{ background: "oklch(0 0 0 / 0.4)" }}
          >
            {bootLines.slice(0, visible).map((l, i) => (
              <div key={i} className="flex gap-2 text-[11px] font-mono leading-5">
                <span className="text-white/15 shrink-0">
                  [{"0".repeat(2 - String(i + 1).length)}
                  {i + 1}]
                </span>
                <span className={done ? "text-[oklch(0.72_0.17_150)]" : "text-white/40"}>
                  {done ? "✓" : ">"} {l.msg}
                </span>
              </div>
            ))}
            {!done && (
              <div className="flex gap-2 text-[11px] font-mono leading-5">
                <span className="text-white/15 shrink-0">[ ]</span>
                <span className="text-white/20">
                  <span className="animate-pulse">_</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* bottom-right progress indicator */}
        <div className="mt-6 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full transition-all duration-300 ${
                  visible > i ? "bg-[oklch(0.72_0.17_150)]" : "bg-white/5"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-white/15">
            {Math.round((visible / bootLines.length) * 100)}%
          </span>
        </div>
      </div>

      {/* footer */}
      <div className="pb-4 text-center text-[10px] font-mono text-white/8">
        {done ? "pronto." : "carregando..."}
      </div>
    </div>
  );
}
