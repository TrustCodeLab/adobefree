"use client";

import { useEffect, useState, useCallback } from "react";
import {
  NewspaperIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface NewsItem {
  tag: string;
  title: string;
  time: string;
  badgeColor: string;
}

const FALLBACK: NewsItem[] = [
  {
    tag: "LIVE",
    title: "Real-time system monitoring active",
    time: "Just now",
    badgeColor: "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20",
  },
  {
    tag: "CATALOG",
    title: "Software catalog updated live",
    time: "2m ago",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    tag: "HEALTH",
    title: "Supabase DB operational 99.9%",
    time: "5m ago",
    badgeColor: "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20",
  },
  {
    tag: "FEATURE",
    title: "Drag card to reorder catalog",
    time: "10m ago",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    tag: "SUPPORT",
    title: "Customer inbox synchronized",
    time: "15m ago",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    tag: "SECURITY",
    title: "Row Level Security policies active",
    time: "1h ago",
    badgeColor: "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20",
  },
];

export default function RealTimeNewsTicker() {
  const [news, setNews] = useState<NewsItem[]>(FALLBACK);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"up" | "down">("up");
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReal, setIsReal] = useState(false);

  /* ── Fetch real news ── */
  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error();
      const data: { items: NewsItem[] } = await res.json();
      if (data.items?.length > 0) {
        setNews(data.items);
        setIndex(0);
        setIsReal(true);
      }
    } catch {
      // keep fallback silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    // Refresh every 5 minutes
    const refresh = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(refresh);
  }, [fetchNews]);

  /* ── Auto-scroll up/down ── */
  useEffect(() => {
    if (paused || loading) return;

    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => {
          let next: number;
          let newDir = dir;
          if (dir === "up") {
            if (prev >= news.length - 1) {
              newDir = "down";
              next = prev - 1;
            } else {
              next = prev + 1;
            }
          } else {
            if (prev <= 0) {
              newDir = "up";
              next = prev + 1;
            } else {
              next = prev - 1;
            }
          }
          setDir(newDir);
          return Math.max(0, Math.min(next, news.length - 1));
        });
        setVisible(true);
      }, 350);
    }, 6000);

    return () => clearInterval(timer);
  }, [dir, paused, loading, news.length]);

  const go = (delta: number) => {
    setVisible(false);
    setTimeout(() => {
      setIndex((p) => (p + delta + news.length) % news.length);
      setVisible(true);
    }, 200);
  };

  const jumpTo = (i: number) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(i);
      setVisible(true);
    }, 200);
  };

  const item = news[index];

  return (
    <div
      className="rounded-xl bg-[#1c1c1c] border border-[#3ecf8e]/30 overflow-hidden shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ecf8e] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3ecf8e]" />
          </span>
          <span className="text-[#3ecf8e] text-[11px] font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
            <NewspaperIcon className="w-3.5 h-3.5" />
            {isReal ? "Live Tech News" : "Real-Time News"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#6b7280] font-mono mr-1 hidden sm:inline">
            {dir === "up" ? "▲ Up" : "▼ Down"}
          </span>
          <button
            onClick={() => go(-1)}
            className="p-1 rounded bg-[#242424] hover:bg-[#2a2a2a] text-[#878c96] hover:text-[#ededef] border border-[#2e2e2e] transition-colors cursor-pointer"
          >
            <ChevronUpIcon className="w-3 h-3" />
          </button>
          <button
            onClick={() => go(1)}
            className="p-1 rounded bg-[#242424] hover:bg-[#2a2a2a] text-[#878c96] hover:text-[#ededef] border border-[#2e2e2e] transition-colors cursor-pointer"
          >
            <ChevronDownIcon className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* News Item */}
      <div className="px-4 py-2.5">
        {loading ? (
          <div className="flex items-center gap-2">
            <ArrowPathIcon className="w-3.5 h-3.5 text-[#3ecf8e] animate-spin flex-shrink-0" />
            <span className="text-xs text-[#6b7280] font-mono">
              Fetching live news…
            </span>
          </div>
        ) : (
          <div
            className="flex flex-col gap-1.5 transition-all duration-300 ease-in-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0)"
                : dir === "up"
                  ? "translateY(-5px)"
                  : "translateY(5px)",
            }}
          >
            {/* Row 1: tag + time */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border flex-shrink-0 ${item.badgeColor}`}
              >
                {item.tag}
              </span>
              <span className="text-[10px] text-[#6b7280] font-mono flex-shrink-0">
                {item.time}
              </span>
            </div>
            {/* Row 2: full title, up to 2 lines */}
            <p className="text-xs text-[#ededef] font-medium leading-relaxed line-clamp-2">
              {item.title}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#2e2e2e]">
        <div className="flex items-center gap-1">
          {news.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-4 bg-[#3ecf8e]"
                  : "w-1.5 bg-[#2e2e2e] hover:bg-[#6b7280]"
              }`}
            />
          ))}
        </div>
        <button
          onClick={fetchNews}
          title="Refresh news"
          className="text-[10px] text-[#6b7280] font-mono flex items-center gap-1 hover:text-[#3ecf8e] transition-colors cursor-pointer"
        >
          <ArrowPathIcon className="w-3 h-3" />
          {isReal ? "Google News" : "Live Feed"}
        </button>
      </div>
    </div>
  );
}
