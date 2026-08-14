"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import NFTCard from "./NFTCard";
import VideoModal from "./VideoModal";
import ProductModal from "./ProductModal";
import { useRealtimeNFTs, Category, NFT } from "../hooks/useRealtimeNFTs";
import { PackageSearch, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

// Custom hook for drag and wheel scrolling
function useDragScroll() {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const ref = useCallback((element: HTMLDivElement | null) => {
    internalRef.current = element;
    setNode(element);
  }, []);

  const scrollByAmount = useCallback((amount: number) => {
    if (internalRef.current) {
      internalRef.current.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    }
  }, []);

  // Wheel scrolling (maps vertical mouse wheel to horizontal with smooth animation)
  useEffect(() => {
    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      // If user is swiping horizontally on trackpad (deltaX dominant), let native scroll work
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) return;

      if (e.deltaY !== 0) {
        const maxScroll = node.scrollWidth - node.clientWidth;
        if (maxScroll <= 5) return;

        // Normalize mouse wheel ticks (lines vs pixels vs notched wheels)
        let delta = e.deltaY;
        if (e.deltaMode === 1) {
          delta *= 40; // Line mode -> pixels
        } else if (Math.abs(delta) < 40) {
          delta = Math.sign(delta) * 140; // Normalize small notched wheel ticks
        } else {
          delta *= 1.8;
        }

        const canScrollLeft = node.scrollLeft > 2;
        const canScrollRight = node.scrollLeft < maxScroll - 2;

        if ((delta > 0 && canScrollRight) || (delta < 0 && canScrollLeft)) {
          e.preventDefault();
          node.scrollBy({
            left: delta,
            behavior: "smooth",
          });
        }
      }
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [node]);

  // Window-level Drag Scrolling (never gets interrupted when cursor leaves container)
  useEffect(() => {
    const el = node;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftPos = el.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX;

      if (Math.abs(walk) > 4) {
        setIsDragging(true);
        e.preventDefault();
        el.scrollLeft = scrollLeftPos - walk * 1.5;
      }
    };

    const handleMouseUp = () => {
      isDown = false;
      setTimeout(() => setIsDragging(false), 50);
    };

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [node]);

  return { ref, isDragging, scrollByAmount };
}

function CategorySection({
  category,
  query,
}: {
  category: Category;
  query: string;
}) {
  const { ref, isDragging, scrollByAmount } = useDragScroll();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<NFT | null>(null);

  // Filter NFTs based on search query and sort by display_order
  const filteredItems = category.nfts
    ?.filter(
      (item) =>
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query),
    )
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  if (!filteredItems || filteredItems.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {category.name}
        </h1>
        {/* Desktop smooth scroll arrow navigation */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scrollByAmount(-340)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-90"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByAmount(340)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-90"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className={`flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 sm:pb-6 pt-3 sm:pt-4 snap-x snap-proximity hide-scrollbar overscroll-x-contain -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 ${isDragging ? "snap-none" : ""}`}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[16.25rem] sm:min-w-[18.75rem] md:min-w-[21.25rem] snap-start pointer-events-auto"
          >
            {/* Disable clicking card while dragging to prevent accidental opens */}
            <div className={`${isDragging ? "pointer-events-none" : ""}`}>
              <NFTCard
                id={item.id}
                image={item.image_url}
                creator={item.creator}
                title={item.title}
                price={item.price}
                timeLeft={item.time_left}
                description={item.description}
                downloads={item.downloads}
                onInstallationClick={(url) => setActiveVideo(url)}
                onDetailsClick={() => setActiveProduct(item)}
              />
            </div>
          </div>
        ))}
        {/* End spacer to guarantee right padding on flex scroll in mobile browsers */}
        <div className="w-0.5 shrink-0 opacity-0 pointer-events-none" aria-hidden="true" />
      </div>

      <VideoModal videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />

      <ProductModal
        product={
          activeProduct && (category.nfts.find(n => n.id === activeProduct.id) || activeProduct) && {
            id: activeProduct.id,
            image: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).image_url,
            title: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).title,
            description: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).description,
            product_image_url: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).product_image_url,
            icon_url: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).icon_url,
            creator: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).creator,
            price: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).price,
            timeLeft: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).time_left,
            downloads: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).downloads,
            badge_text: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).badge_text,
            file_size: (category.nfts.find(n => n.id === activeProduct.id) || activeProduct).file_size,
          }
        }
        onClose={() => setActiveProduct(null)}
      />
    </section>
  );
}

interface NFTStoreClientProps {
  initialData: Category[];
  query: string;
}

export default function NFTStoreClient({
  initialData,
  query,
}: NFTStoreClientProps) {
  const categories = useRealtimeNFTs(initialData);

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <p className="text-muted text-lg">No content currently available.</p>
        <a href="/login" className="text-accent hover:underline">
          Admin Login
        </a>
      </div>
    );
  }

  // Detect if all categories have zero matches for the current query
  const hasAnyResult = query
    ? categories.some((cat) =>
        cat.nfts?.some(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.creator.toLowerCase().includes(query),
        ),
      )
    : true;

  if (!hasAnyResult) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">

        {/* Icon */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="absolute w-16 h-16 rounded-full bg-accent/10 blur-lg" />
          <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ring-1 ring-accent/20">
            <PackageSearch className="w-6 h-6 text-accent/70" />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent mb-2">
          No Results Found
        </p>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 max-w-xs">
          We couldn&apos;t find{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #6b66ff, #a78bfa)" }}
          >
            &ldquo;{query}&rdquo;
          </span>
        </h2>

        {/* Body */}
        <p className="text-muted text-xs sm:text-sm leading-relaxed max-w-xs mb-6">
          This app isn&apos;t available yet.{" "}
          <span className="text-white/60">Request it below and we&apos;ll do our best to add it.</span>
        </p>

        {/* CTA */}
        <Link
          href={`/support?request=${encodeURIComponent(query)}`}
          className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black font-bold px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm mb-4"
        >
          <MessageCircle className="w-4 h-4" />
          Request this App
        </Link>

        {/* Back link */}
        <a href="/" className="text-white/30 text-xs hover:text-white/70 transition-colors">
          ← Back to all apps
        </a>

      </div>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <CategorySection key={category.id} category={category} query={query} />
      ))}
    </>
  );
}
