"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When path or search parameters change, finish progress animation
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept link clicks to trigger progress bar start
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only trigger for internal links that navigate to a new path
      const isInternal = href.startsWith("/") || href.startsWith(window.location.origin);
      const isAnchorOnly = href.startsWith("#");
      const isNewTab = target.getAttribute("target") === "_blank";

      if (isInternal && !isAnchorOnly && !isNewTab) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setLoading(true);
          setProgress(30);
          
          // Incrementally advance progress bar while waiting for route transition
          const interval = setInterval(() => {
            setProgress((prev) => (prev >= 85 ? prev : prev + 10));
          }, 150);

          setTimeout(() => clearInterval(interval), 5000);
        }
      }
    };

    window.addEventListener("click", handleAnchorClick);
    return () => window.removeEventListener("click", handleAnchorClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-black/20">
      <div
        className="h-full bg-gradient-to-r from-[#3ecf8e] via-accent to-[#6b66ff] transition-all duration-300 ease-out shadow-[0_0_10px_#3ecf8e]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
