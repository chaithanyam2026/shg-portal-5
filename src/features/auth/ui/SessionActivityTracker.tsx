"use client";

import { useEffect } from "react";

/**
 * Records PWA/app opens while the user stays signed in.
 * Does not sign the user out. Server ignores repeats within 30 minutes.
 */
export default function SessionActivityTracker() {
  useEffect(() => {
    function recordOpen() {
      void fetch("/api/account/session-activity", {
        method: "POST",
        keepalive: true,
      }).catch(() => undefined);
    }

    recordOpen();

    function onVisible() {
      if (document.visibilityState === "visible") {
        recordOpen();
      }
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        recordOpen();
      }
    }

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
