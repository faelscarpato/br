import { useTheme } from "../context/ThemeContext";

export function Desktop() {
  const { osTheme } = useTheme();

  if (osTheme === "win11") {
    return (
      <>
        {/* Win11 dark bloom wallpaper */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, oklch(0.2 0.06 260 / 0.6), transparent 55%),
              radial-gradient(ellipse at 80% 70%, oklch(0.15 0.04 280 / 0.3), transparent 45%),
              radial-gradient(ellipse at 20% 80%, oklch(0.12 0.03 240 / 0.2), transparent 40%),
              linear-gradient(180deg, oklch(0.09 0.01 260) 0%, oklch(0.07 0.01 260) 100%)
            `,
          }}
        />
        {/* noise overlay */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10" style={{ background: "var(--gradient-desktop)" }} />

      {/* diagonal flag streak */}
      <div
        className="pointer-events-none fixed -z-10 opacity-[0.04]"
        style={{
          position: "fixed",
          inset: 0,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 60px,
            oklch(0.72 0.17 150) 60px,
            oklch(0.72 0.17 150) 61px,
            oklch(0.86 0.16 95) 61px,
            oklch(0.86 0.16 95) 62px,
            transparent 62px,
            transparent 120px
          )`,
        }}
      />

      {/* noise */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />
    </>
  );
}
