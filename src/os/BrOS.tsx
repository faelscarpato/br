import { useEffect, useRef } from "react";
import { ShellProvider, useShell } from "./context/ShellContext";
import { AIConfigProvider, useAIConfig } from "./context/AIConfigContext";
import { WindowManagerProvider, useWindowManager } from "./context/WindowManagerContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { BootScreen } from "./components/BootScreen";
import { LoginScreen } from "./components/LoginScreen";
import { Desktop } from "./components/Desktop";
import { Dock } from "./components/Dock";
import { StatusBar } from "./components/StatusBar";
import { Window } from "./components/Window";
import { MobileAppSwitcher } from "./components/MobileAppSwitcher";
import { MobileDock } from "./components/MobileDock";
import { NotificationToast } from "./components/NotificationToast";
import { DesktopIcons } from "./components/DesktopIcons";
import { Win11Taskbar } from "./components/win11/Win11Taskbar";
import { APPS, getApp } from "./registry/apps";
import { registerServiceWorker } from "./pwa/register-sw";

function WindowLayer() {
  const { windows } = useWindowManager();
  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {windows.map((w) => {
        const app = getApp(w.appId);
        const Comp = app?.component;
        if (!Comp) return null;
        return (
          <div key={w.id} className="pointer-events-auto">
            <Window win={w}>
              <Comp />
            </Window>
          </div>
        );
      })}
    </div>
  );
}

function Onboarding() {
  const { hasConfiguredProvider } = useAIConfig();
  const { notify } = useShell();
  const { openApp } = useWindowManager();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (!hasConfiguredProvider) {
      const app = APPS.find((a) => a.id === "settings")!;
      openApp(app.id, {
        title: app.name,
        icon: app.icon,
        width: app.defaultSize?.width,
        height: app.defaultSize?.height,
      });
      notify({
        title: "Bem-vindo ao BrOS",
        message: "Configure pelo menos um provider de IA para começar.",
        variant: "warning",
      });
    }
    registerServiceWorker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function Shell() {
  const { screen, breakpoint } = useShell();
  const { osTheme } = useTheme();

  if (screen === "boot") return <BootScreen />;
  if (screen === "login") return <LoginScreen />;

  const isMobile = breakpoint === "mobile";
  const isWin11 = osTheme === "win11";

  return (
    <div
      className="relative h-screen w-screen overflow-hidden text-foreground select-none"
      data-theme={osTheme}
    >
      <Desktop />
      <StatusBar />

      {isWin11 ? (
        <>
          <DesktopIcons />
          {isMobile ? (
            <>
              <MobileAppSwitcher />
              <Win11Taskbar />
            </>
          ) : (
            <>
              <WindowLayer />
              <Win11Taskbar />
            </>
          )}
        </>
      ) : (
        <>
          {isMobile ? (
            <>
              <MobileAppSwitcher />
              <MobileDock />
            </>
          ) : (
            <>
              <WindowLayer />
              <Dock />
            </>
          )}
        </>
      )}

      <NotificationToast />
      <Onboarding />
    </div>
  );
}

export function BrOS() {
  return (
    <ShellProvider>
      <AIConfigProvider>
        <WindowManagerProvider>
          <ThemeProvider>
            <Shell />
          </ThemeProvider>
        </WindowManagerProvider>
      </AIConfigProvider>
    </ShellProvider>
  );
}
