"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useTransition } from "react";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (newTerm: string) => {
    setTerm(newTerm);
    setIsTyping(true);

    // Clear typing indicator after 600ms of no input
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 600);

    const params = new URLSearchParams(searchParams);
    if (newTerm) {
      params.set("q", newTerm);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setTerm("");
    setIsTyping(false);
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
    inputRef.current?.focus();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  const isActive = isFocused || !!term;

  return (
    <div
      className={`
        relative group
        transition-all duration-500 ease-out
        ${compact ? "w-full" : "w-full sm:max-w-xs"}
        ${isActive && !compact ? "sm:max-w-sm" : ""}
      `}
      style={{
        /* Outer glow ring that pulses while typing */
        filter: isTyping
          ? "drop-shadow(0 0 10px rgba(107, 102, 255, 0.45))"
          : isActive
          ? "drop-shadow(0 0 6px rgba(107, 102, 255, 0.2))"
          : "none",
        transition: "filter 0.4s ease",
      }}
    >
      {/* Animated border glow layer */}
      <div
        className={`
          absolute inset-0 rounded-full pointer-events-none z-0
          transition-all duration-500
        `}
        style={{
          backgroundImage: isTyping
            ? "linear-gradient(90deg, rgba(107,102,255,0.35), rgba(107,102,255,0.1), rgba(107,102,255,0.35))"
            : "none",
          backgroundColor: isActive && !isTyping ? "rgba(107,102,255,0.12)" : "transparent",
          backgroundSize: "200% 100%",
          animation: isTyping ? "shimmer 1.2s linear infinite" : "none",
          opacity: 1,
        }}
      />

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        placeholder=" "
        className={`
          peer relative z-10 w-full bg-card rounded-full
          ${compact ? "py-[0.65rem] text-sm" : "py-[0.9rem] text-[0.95rem]"}
          pl-4 pr-10 text-white text-center placeholder-transparent
          focus:outline-none font-light
          transition-all duration-300 ease-out
          ${
            isActive
              ? "border border-accent/50 ring-1 ring-accent/30"
              : "border border-card-border"
          }
        `}
        value={term}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Clear / Loading Button */}
      {term && (
        <button
          onClick={clearSearch}
          className={`
            absolute right-3 top-1/2 -translate-y-1/2 z-20
            p-1.5 rounded-full zoom-in-75
            transition-all duration-300 ease-out
            ${
              isPending
                ? "bg-accent/20 text-accent"
                : "bg-white text-black hover:bg-white/90 hover:scale-110 active:scale-95"
            }
          `}
          style={{ animationDuration: "200ms" }}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Centered Placeholder & Icon Group */}
      <div
        className={`
          absolute inset-0 z-10 flex items-center justify-center gap-2
          pointer-events-none
          transition-all duration-300 ease-out
          ${term ? "opacity-0 scale-95" : "peer-focus:opacity-0 peer-focus:scale-95 peer-[:not(:placeholder-shown)]:opacity-0"}
        `}
      >
        {/* Search icon — morphs when active */}
        <Search
          className={`
            transition-all duration-300 ease-out
            ${compact ? "w-4 h-4" : "w-5 h-5"}
            ${isActive ? "text-accent scale-110" : "text-muted scale-100"}
          `}
        />
        <span
          className={`
            transition-all duration-300 ease-out
            ${compact ? "text-sm" : "text-[0.95rem]"}
            ${isActive ? "text-white/60" : "text-muted"}
            font-light
          `}
        >
          Search apps or brands
        </span>
      </div>

      {/* Bottom animated underline accent */}
      <div
        className={`
          absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full
          bg-accent transition-all duration-500 ease-out pointer-events-none z-20
          ${isTyping ? "w-[60%] opacity-100" : isActive ? "w-[30%] opacity-60" : "w-0 opacity-0"}
        `}
      />
    </div>
  );
}
