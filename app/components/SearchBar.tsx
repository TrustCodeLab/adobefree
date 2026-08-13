"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useRef, useTransition } from "react";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (newTerm: string) => {
    setTerm(newTerm);
    const params = new URLSearchParams(searchParams);
    if (newTerm) params.set("q", newTerm);
    else params.delete("q");
    startTransition(() => replace(`${pathname}?${params.toString()}`));
  };

  const clearSearch = () => {
    setTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    startTransition(() => replace(`${pathname}?${params.toString()}`));
    inputRef.current?.focus();
  };

  return (
    <div
      className={`flex items-center w-full mx-auto ${
        compact ? "w-full" : "max-w-[16rem] sm:max-w-[20rem] lg:max-w-[24rem]"
      }`}
    >
      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex items-center w-full rounded-full overflow-hidden cursor-text h-10 sm:h-11 bg-[#121318]/90 border transition-all duration-300 ${
          isFocused
            ? "border-white/40 ring-2 ring-white/10"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="flex items-center justify-center pl-3.5 pr-2 shrink-0">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-white/60" />
          ) : (
            <Search className="w-4 h-4 text-white/60" />
          )}
        </div>

        <div className="flex flex-1 items-center pr-3 gap-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search apps, versions, products..."
            className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm font-medium text-white placeholder-white/40 focus:outline-none"
            value={term}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {term && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSearch();
              }}
              className="shrink-0 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

