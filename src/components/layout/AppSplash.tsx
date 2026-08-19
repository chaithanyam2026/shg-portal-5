"use client";

import { useEffect, useState } from "react";

import { PWA_SPLASH_SUBTITLE, PWA_SPLASH_TITLE } from "@/lib/pwa/app-metadata";
import { APP_LOGO_ALT, APP_LOGO_PATH } from "@/lib/pwa/brand-assets";

const MIN_VISIBLE_MS = 1200;
const FADE_MS = 280;

export default function AppSplash() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    let fadeTimer: number;
    let removeTimer: number;

    const startHide = () => {
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      fadeTimer = window.setTimeout(() => {
        setHidden(true);
        removeTimer = window.setTimeout(() => setRemoved(true), FADE_MS);
      }, remaining);
    };

    if (document.readyState === "complete") {
      startHide();
    } else {
      window.addEventListener("load", startHide, { once: true });
    }

    return () => {
      window.removeEventListener("load", startHide);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (removed) {
    return null;
  }

  return (
    <div
      id="app-splash"
      className={hidden ? "app-splash--hidden" : undefined}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- first-paint splash must not wait on next/image */}
      <img className="app-splash__logo" src={APP_LOGO_PATH} alt={APP_LOGO_ALT} width={160} height={160} />
      <p className="app-splash__copy">
        {PWA_SPLASH_TITLE}
        <br />
        {PWA_SPLASH_SUBTITLE}
      </p>
    </div>
  );
}
