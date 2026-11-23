"use client";

import { useEffect } from "react";

export function ContentMotion() {
  useEffect(() => {
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.contentReveal = "shown";
          observer.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-content-reveal]",
    );
    for (const element of targets) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
        element.dataset.contentReveal = "shown";
      } else {
        element.dataset.contentReveal = "waiting";
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
