"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CheckCircle2, Eye, EyeOff, LogOut, Moon, Sparkles, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Point = {
  x: number;
  y: number;
};

type CharacterMotion = {
  faceX: number;
  faceY: number;
  bodySkew: number;
};

type EyeBallProps = {
  size: number;
  pupilSize: number;
  offset: Point;
  isBlinking?: boolean;
};

type PupilProps = {
  size: number;
  offset: Point;
  color?: string;
};

const DEFAULT_PASSWORD_ERROR = "密码不正确，请重试。";
const STAGE_CENTER = { x: 275, y: 200 };

function getLookOffset(mouse: Point, origin: Point, maxDistance: number): Point {
  const deltaX = mouse.x - origin.x;
  const deltaY = mouse.y - origin.y;
  const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
  const angle = Math.atan2(deltaY, deltaX);

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

function getCharacterMotion(mouse: Point, origin: Point): CharacterMotion {
  const deltaX = mouse.x - origin.x;
  const deltaY = mouse.y - origin.y;

  return {
    faceX: Math.max(-15, Math.min(15, deltaX / 20)),
    faceY: Math.max(-10, Math.min(10, deltaY / 30)),
    bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)),
  };
}

function useBlinking() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let blinkTimeout: number | undefined;
    let resetTimeout: number | undefined;

    const scheduleBlink = () => {
      blinkTimeout = window.setTimeout(
        () => {
          setIsBlinking(true);
          resetTimeout = window.setTimeout(() => {
            setIsBlinking(false);
            scheduleBlink();
          }, 150);
        },
        Math.random() * 4000 + 3000
      );
    };

    scheduleBlink();

    return () => {
      if (blinkTimeout) {
        window.clearTimeout(blinkTimeout);
      }

      if (resetTimeout) {
        window.clearTimeout(resetTimeout);
      }
    };
  }, []);

  return isBlinking;
}

function subscribeToColorScheme(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);

  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getColorSchemeSnapshot() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerColorSchemeSnapshot() {
  return false;
}

function EyeBall({
  size,
  pupilSize,
  offset,
  isBlinking = false,
}: EyeBallProps) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: "white",
      }}
    >
      {!isBlinking ? (
        <div
          className="rounded-full bg-[#2D2D2D] transition-transform duration-100 ease-out"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        />
      ) : null}
    </div>
  );
}

function Pupil({
  size,
  offset,
  color = "#2D2D2D",
}: PupilProps) {
  return (
    <div
      className="rounded-full transition-transform duration-100 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    />
  );
}

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stageMouse, setStageMouse] = useState<Point>(STAGE_CENTER);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const systemPrefersDark = useSyncExternalStore(
    subscribeToColorScheme,
    getColorSchemeSnapshot,
    getServerColorSchemeSnapshot
  );
  const [themeOverride, setThemeOverride] = useState<boolean | null>(null);
  const isDarkMode = themeOverride ?? systemPrefersDark;

  const stageRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const isPurpleBlinking = useBlinking();
  const isBlackBlinking = useBlinking();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = stageRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setStageMouse({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!password || !showPassword) {
      return;
    }

    let peekTimeout: number | undefined;
    let resetTimeout: number | undefined;

    const schedulePeek = () => {
      peekTimeout = window.setTimeout(
        () => {
          setIsPurplePeeking(true);
          resetTimeout = window.setTimeout(() => {
            setIsPurplePeeking(false);
            schedulePeek();
          }, 800);
        },
        Math.random() * 3000 + 2000
      );
    };

    schedulePeek();

    return () => {
      if (peekTimeout) {
        window.clearTimeout(peekTimeout);
      }

      if (resetTimeout) {
        window.clearTimeout(resetTimeout);
      }
    };
  }, [password, showPassword]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const hasPassword = password.length > 0;
  const charactersAreGuardingPassword = hasPassword && !showPassword;
  const charactersArePeekingPassword = hasPassword && showPassword;
  const purpleMotion = getCharacterMotion(stageMouse, { x: 160, y: 120 });
  const blackMotion = getCharacterMotion(stageMouse, { x: 300, y: 190 });
  const yellowMotion = getCharacterMotion(stageMouse, { x: 380, y: 245 });
  const orangeMotion = getCharacterMotion(stageMouse, { x: 120, y: 270 });
  const purpleEyeOffset = getLookOffset(stageMouse, { x: 165, y: 60 }, 5);
  const blackEyeOffset = getLookOffset(stageMouse, { x: 300, y: 120 }, 4);
  const orangeEyeOffset = getLookOffset(stageMouse, { x: 120, y: 285 }, 5);
  const yellowEyeOffset = getLookOffset(stageMouse, { x: 380, y: 220 }, 5);
  const purpleLook = charactersArePeekingPassword
    ? { x: isPurplePeeking ? 4 : -4, y: isPurplePeeking ? 5 : -4 }
    : isLookingAtEachOther
      ? { x: 3, y: 4 }
      : purpleEyeOffset;
  const blackLook = charactersArePeekingPassword
    ? { x: -4, y: -4 }
    : isLookingAtEachOther
      ? { x: 0, y: -4 }
      : blackEyeOffset;
  const orangeLook = charactersArePeekingPassword ? { x: -5, y: -4 } : orangeEyeOffset;
  const yellowLook = charactersArePeekingPassword ? { x: -5, y: -4 } : yellowEyeOffset;

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError("");
    setIsAuthenticated(false);
    setIsLookingAtEachOther(true);

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsLookingAtEachOther(false);
    }, 800);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const result = (await response.json().catch(() => null)) as
      | { authenticated?: boolean; error?: string }
      | null;

    if (response.ok && result?.authenticated) {
      setError("");
      setIsAuthenticated(true);
      return;
    }

    setIsAuthenticated(false);
    setError(result?.error ?? DEFAULT_PASSWORD_ERROR);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  };

  return (
    <main className={`relative min-h-[100svh] ${isDarkMode ? "bg-black text-white" : "bg-background text-foreground"}`}>
      <button
        type="button"
        aria-label={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
        onClick={() => setThemeOverride((value) => !(value ?? systemPrefersDark))}
        className={`fixed right-4 top-4 z-50 flex size-10 items-center justify-center rounded-lg transition-colors sm:right-6 sm:top-6 ${
          isDarkMode ? "bg-white/10 text-white hover:bg-white/15" : "bg-primary/10 text-primary hover:bg-primary/20"
        }`}
      >
        {isDarkMode ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
      </button>
      <div className="grid min-h-[100svh] lg:grid-cols-2">
        <section
          className={`relative hidden flex-col justify-between overflow-hidden p-12 lg:flex ${
            isDarkMode
              ? "bg-gray-100 text-gray-950"
              : "bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground"
          }`}
        >
          <div className="relative z-20 flex items-center gap-2 text-lg font-semibold">
            <div
              className={`flex size-8 items-center justify-center rounded-lg backdrop-blur-sm ${
                isDarkMode ? "bg-black/10" : "bg-primary-foreground/10"
              }`}
            >
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
            <span className="font-black">Champion 登录页</span>
          </div>

          <div className="relative z-20 flex h-[500px] items-end justify-center">
            <div ref={stageRef} className="relative h-[400px] w-[550px]">
              <div
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: "70px",
                  width: "180px",
                  height: charactersAreGuardingPassword ? "440px" : "400px",
                  backgroundColor: "#6C3FF5",
                  borderRadius: "10px 10px 0 0",
                  zIndex: 1,
                  transform: charactersArePeekingPassword
                    ? "skewX(0deg)"
                    : charactersAreGuardingPassword
                      ? `skewX(${purpleMotion.bodySkew - 12}deg) translateX(40px)`
                      : `skewX(${purpleMotion.bodySkew}deg)`,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                  style={{
                    left: charactersArePeekingPassword
                      ? "20px"
                      : isLookingAtEachOther
                        ? "55px"
                        : `${45 + purpleMotion.faceX}px`,
                    top: charactersArePeekingPassword
                      ? "35px"
                      : isLookingAtEachOther
                        ? "65px"
                        : `${40 + purpleMotion.faceY}px`,
                  }}
                >
                  <EyeBall
                    size={18}
                    pupilSize={7}
                    offset={purpleLook}
                    isBlinking={isPurpleBlinking}
                  />
                  <EyeBall
                    size={18}
                    pupilSize={7}
                    offset={purpleLook}
                    isBlinking={isPurpleBlinking}
                  />
                </div>
              </div>

              <div
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: "240px",
                  width: "120px",
                  height: "310px",
                  backgroundColor: "#2D2D2D",
                  borderRadius: "8px 8px 0 0",
                  zIndex: 2,
                  transform: charactersArePeekingPassword
                    ? "skewX(0deg)"
                    : isLookingAtEachOther
                      ? `skewX(${blackMotion.bodySkew * 1.5 + 10}deg) translateX(20px)`
                      : charactersAreGuardingPassword
                        ? `skewX(${blackMotion.bodySkew * 1.5}deg)`
                        : `skewX(${blackMotion.bodySkew}deg)`,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                  style={{
                    left: charactersArePeekingPassword
                      ? "10px"
                      : isLookingAtEachOther
                        ? "32px"
                        : `${26 + blackMotion.faceX}px`,
                    top: charactersArePeekingPassword
                      ? "28px"
                      : isLookingAtEachOther
                        ? "12px"
                        : `${32 + blackMotion.faceY}px`,
                  }}
                >
                  <EyeBall
                    size={16}
                    pupilSize={6}
                    offset={blackLook}
                    isBlinking={isBlackBlinking}
                  />
                  <EyeBall
                    size={16}
                    pupilSize={6}
                    offset={blackLook}
                    isBlinking={isBlackBlinking}
                  />
                </div>
              </div>

              <div
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: "0px",
                  width: "240px",
                  height: "200px",
                  zIndex: 3,
                  backgroundColor: "#FF9B6B",
                  borderRadius: "120px 120px 0 0",
                  transform: charactersArePeekingPassword ? "skewX(0deg)" : `skewX(${orangeMotion.bodySkew}deg)`,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="absolute flex gap-8 transition-all duration-200 ease-out"
                  style={{
                    left: charactersArePeekingPassword ? "50px" : `${82 + orangeMotion.faceX}px`,
                    top: charactersArePeekingPassword ? "85px" : `${90 + orangeMotion.faceY}px`,
                  }}
                >
                  <Pupil
                    size={12}
                    offset={orangeLook}
                  />
                  <Pupil
                    size={12}
                    offset={orangeLook}
                  />
                </div>
              </div>

              <div
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: "310px",
                  width: "140px",
                  height: "230px",
                  backgroundColor: "#E8D754",
                  borderRadius: "70px 70px 0 0",
                  zIndex: 4,
                  transform: charactersArePeekingPassword ? "skewX(0deg)" : `skewX(${yellowMotion.bodySkew}deg)`,
                  transformOrigin: "bottom center",
                }}
              >
                <div
                  className="absolute flex gap-6 transition-all duration-200 ease-out"
                  style={{
                    left: charactersArePeekingPassword ? "20px" : `${52 + yellowMotion.faceX}px`,
                    top: charactersArePeekingPassword ? "35px" : `${40 + yellowMotion.faceY}px`,
                  }}
                >
                  <Pupil
                    size={12}
                    offset={yellowLook}
                  />
                  <Pupil
                    size={12}
                    offset={yellowLook}
                  />
                </div>
                <div
                  className="absolute h-[4px] w-20 rounded-full bg-[#2D2D2D] transition-all duration-200 ease-out"
                  style={{
                    left: charactersArePeekingPassword ? "10px" : `${40 + yellowMotion.faceX}px`,
                    top: charactersArePeekingPassword ? "88px" : `${88 + yellowMotion.faceY}px`,
                  }}
                />
              </div>
            </div>
          </div>

          <p className={`relative z-20 text-sm ${isDarkMode ? "text-gray-700" : "text-primary-foreground/70"}`}>
            Champion 安全入口
          </p>
        </section>

        <section className={`flex min-h-[100svh] items-center justify-center px-5 py-20 sm:p-8 ${isDarkMode ? "bg-black" : "bg-background"}`}>
          <div className="w-full max-w-[420px]">
            <div className="mb-8 flex items-center justify-center sm:mb-12 lg:hidden">
              <div className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                <div className={`flex size-8 items-center justify-center rounded-lg ${isDarkMode ? "bg-white/10" : "bg-primary/10"}`}>
                  <Sparkles className={`size-4 ${isDarkMode ? "text-white" : "text-primary"}`} aria-hidden="true" />
                </div>
                <span className="font-black">Champion 登录页</span>
              </div>
            </div>

            <div className="mb-8 text-center sm:mb-10">
              <h1 className={`mb-2 text-[clamp(2.5rem,12vw,3.75rem)] font-black leading-tight tracking-normal sm:text-3xl ${isDarkMode ? "text-white" : ""}`}>
                {isAuthenticated ? "登录成功" : "欢迎回来"}
              </h1>
              <p className={`text-base sm:text-sm ${isDarkMode ? "text-white/60" : "text-muted-foreground"}`}>
                {isAuthenticated ? "状态已确认，欢迎回来。" : "Champion 安全入口已就绪。"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-base font-medium sm:text-sm ${isDarkMode ? "text-white" : ""}`}>
                  密码
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    disabled={isAuthenticated}
                    className={`h-14 rounded-2xl border px-5 pr-12 text-base sm:h-12 sm:rounded-lg ${
                      isDarkMode
                        ? "border-white/20 bg-black text-white placeholder:text-white/40"
                        : "border-border/60 bg-background"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={isAuthenticated}
                    className={`absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg transition-colors disabled:opacity-50 sm:size-8 ${
                      isDarkMode ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error ? (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    isDarkMode ? "border-red-400/30 bg-red-400/10 text-red-300" : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {error}
                </div>
              ) : null}

              {isAuthenticated ? (
                <div
                  className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                    isDarkMode
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  <span>当前登录状态有效。</span>
                </div>
              ) : null}

              <div className="grid gap-3">
                {isAuthenticated ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleLogout}
                    className={`h-14 gap-2 rounded-2xl text-base font-medium sm:h-12 sm:rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-white/90" : ""}`}
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    退出登录
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className={`h-14 rounded-2xl text-base font-medium sm:h-12 sm:rounded-lg ${isDarkMode ? "bg-white text-black hover:bg-white/90" : ""}`}
                  >
                    登录
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-10 flex items-center justify-center gap-5 sm:mt-12 sm:gap-8">
              <div className="h-12 w-12 rounded-full bg-[#6C3FF5] opacity-80 sm:h-14 sm:w-14" />
              <div className="h-9 w-9 rounded-lg bg-[#2D2D2D] opacity-80 sm:h-10 sm:w-10" />
              <div className="h-10 w-10 rounded-full bg-[#FF9B6B] opacity-80 sm:h-12 sm:w-12" />
              <div className="h-7 w-7 rounded-full bg-[#E8D754] opacity-80 sm:h-8 sm:w-8" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
