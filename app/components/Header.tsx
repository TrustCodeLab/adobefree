"use client";

import Image from "next/image";
import Link from "next/link";
import { Headset } from "lucide-react";
import { Suspense, useState } from "react";
import SearchBar from "./SearchBar";

function LogoImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex items-center flex-shrink-0">
      {/* Skeleton shown until image loads */}
      {!loaded && (
        <div className="h-8 sm:h-10 w-28 sm:w-32 bg-white/10 rounded-lg animate-pulse" />
      )}
      <Image
        src="/logo-new.png"
        alt="Free"
        width={120}
        height={40}
        className={`object-contain h-8 sm:h-10 w-auto transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
        priority
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
      <div
        className="w-full mx-auto flex items-center justify-between gap-3 sm:gap-6 lg:gap-8"
        style={{ maxWidth: "calc(80rem + 2rem)" }}
      >
        {/* Logo Skeleton */}
        <div className="h-8 sm:h-10 w-28 sm:w-32 bg-white/10 rounded-lg animate-pulse flex-shrink-0" />

        {/* Search Bar Skeleton - Hidden on small screens */}
        <div className="hidden sm:flex flex-1 justify-center">
          <div className="w-full max-w-xl h-11 bg-white/5 border border-white/10 rounded-full animate-pulse" />
        </div>

        {/* Support Button Skeleton */}
        <div className="w-9 h-9 sm:w-28 sm:h-10 bg-white/10 rounded-full animate-pulse flex-shrink-0" />
      </div>

      {/* Mobile Search Skeleton */}
      <div className="sm:hidden mt-3.5">
        <div className="w-full h-10 bg-white/5 border border-white/10 rounded-full animate-pulse" />
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
      <div
        className="w-full mx-auto flex items-center justify-between gap-3 sm:gap-6 lg:gap-8"
        style={{ maxWidth: "calc(80rem + 2rem)" }}
      >
        {/* Logo */}
        <LogoImage />

        {/* Search Bar - Hidden on very small screens */}
        <div className="hidden sm:flex flex-1 justify-center">
          <Suspense fallback={<div className="w-full max-w-xl h-11 bg-white/5 border border-white/10 rounded-full animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Support Button */}
        <Link
          href="/support"
          className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 border border-transparent rounded-full w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 text-black font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 text-sm sm:text-base"
        >
          <Headset className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:block">Support</span>
        </Link>
      </div>

      {/* Mobile Search Bar - Below header on small screens */}
      <div className="sm:hidden mt-3.5">
        <Suspense fallback={<div className="w-full h-10 bg-white/5 border border-white/10 rounded-full animate-pulse" />}>
          <SearchBar compact={true} />
        </Suspense>
      </div>
    </header>
  );
}

