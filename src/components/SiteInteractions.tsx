"use client";

import { useEffect } from "react";

export function SiteInteractions() {
  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    const start = () => { void import("./site-interactions").then(({ mountSiteInteractions }) => {
      if (!cancelled) dispose = mountSiteInteractions();
    }); };
    if (document.readyState === "complete") start();
    else addEventListener("load", start, { once: true });
    return () => { cancelled = true; removeEventListener("load", start); dispose(); };
  }, []);
  return null;
}
