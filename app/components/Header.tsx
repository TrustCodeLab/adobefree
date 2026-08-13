"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, CloudDownload, Bookmark, Headset } from "lucide-react";
import { Suspense, useState, useRef, useTransition, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import ProductModal from "./ProductModal";

function LogoImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href="/" className="relative flex items-center flex-shrink-0 group">
      {!loaded && (
        <div className="h-9 sm:h-11 w-32 sm:w-40 bg-white/5 rounded-md animate-pulse" />
      )}
      <Image
        src="/logo-new.png"
        alt="Adobe Free Logo"
        width={150}
        height={46}
        className={`object-contain h-9 sm:h-11 w-auto transition-all duration-300 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0 absolute"
        }`}
        priority
        onLoad={() => setLoaded(true)}
      />
    </Link>
  );
}

function MobileSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTerm(searchParams.get("q")?.toString() || "");
  }, [searchParams]);

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
    <div className="sm:hidden w-full mt-4 sm:mt-0">
      <div className="flex items-center bg-[#14151b] border border-white/[0.07] rounded-full px-4 h-12 w-full shadow-lg shadow-black/40">
        <Search className="w-4 h-4 text-white/50 shrink-0 mr-2.5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search apps, versions, products..."
          value={term}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 bg-transparent text-xs font-normal placeholder:font-light text-white placeholder-white/35 focus:outline-none min-w-0"
        />
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-white/60 shrink-0 ml-1.5" />
        ) : term ? (
          <button
            onClick={clearSearch}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0 ml-1 cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DesktopExpandableSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialQuery = searchParams.get("q")?.toString() || "";
  const [term, setTerm] = useState(initialQuery);
  const [isExpanded, setIsExpanded] = useState(Boolean(initialQuery));
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = searchParams.get("q")?.toString() || "";
    setTerm(query);
    if (query) setIsExpanded(true);
  }, [searchParams]);

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleSearch = (newTerm: string) => {
    setTerm(newTerm);
    const params = new URLSearchParams(searchParams);
    if (newTerm) params.set("q", newTerm);
    else params.delete("q");
    startTransition(() => replace(`${pathname}?${params.toString()}`));
  };

  const handleClose = () => {
    if (term) {
      setTerm("");
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      startTransition(() => replace(`${pathname}?${params.toString()}`));
    }
    setIsExpanded(false);
  };

  const handleToggle = () => {
    if (!isExpanded) setIsExpanded(true);
    else handleClose();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !term
      ) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [term]);

  return (
    <div ref={containerRef} className="hidden sm:flex items-center ml-2">
      {!isExpanded ? (
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#14151b] hover:bg-[#1a1b23] border border-white/[0.07] hover:border-white/15 text-white/70 hover:text-white transition-all duration-300 cursor-pointer shadow-sm group active:scale-95"
          title="Search"
          aria-label="Open search bar"
        >
          <Search className="w-4.5 h-4.5 text-white/70 group-hover:text-white transition-colors group-hover:scale-110" />
        </button>
      ) : (
        <div className="flex items-center bg-[#14151b] border border-white/[0.08] rounded-full px-4 sm:px-4.5 h-10 sm:h-12 w-56 sm:w-76 md:w-84 lg:w-96 shadow-lg shadow-black/40 transition-all duration-300 ease-out animate-in fade-in zoom-in-95">
          <Search className="w-4.5 h-4.5 text-white/50 shrink-0 mr-2.5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search apps, versions, products..."
            value={term}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleClose();
            }}
            className="flex-1 bg-transparent text-xs sm:text-sm font-normal placeholder:font-light text-white placeholder-white/35 focus:outline-none min-w-0"
          />
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-white/60 shrink-0 ml-1.5" />
          ) : (
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0 ml-1 cursor-pointer"
              title="Close search"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/[0.05] px-4 sm:px-6 lg:px-8 py-4 sm:py-5.5 lg:py-6">
      <div className="w-full max-w-[85rem] mx-auto flex flex-col justify-center">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 sm:h-11 w-32 sm:w-40 bg-white/5 rounded-md animate-pulse" />
            <div className="hidden sm:block w-10 sm:w-12 h-10 sm:h-12 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/5 rounded-full animate-pulse" />
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/5 rounded-full animate-pulse" />
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="sm:hidden w-full h-12 bg-white/5 rounded-full mt-4 animate-pulse" />
      </div>
    </header>
  );
}

// ── Dropdown Panel Types ──────────────────────────────────────────────────
interface DownloadEntry {
  id: string;
  title: string;
  image: string;
  creator: string;
  timestamp: number;
}

interface SavedEntry {
  id: string;
  title: string;
  image: string;
  creator: string;
}

type ProductData = {
  id: string;
  image: string;
  title: string;
  description?: string;
  product_image_url?: string;
  creator: string;
  price: string;
  timeLeft: string;
  downloads: number;
  badge_text?: string;
  file_size?: string;
};

// ── Downloads Panel ───────────────────────────────────────────────────────
function DownloadsPanel({
  onClose,
  onOpenProduct,
  fetchingId,
}: {
  onClose: () => void;
  onOpenProduct: (id: string) => void;
  fetchingId: string | null;
}) {
  const [items, setItems] = useState<DownloadEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("download-history");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const clearAll = () => {
    localStorage.removeItem("download-history");
    setItems([]);
  };

  const timeAgo = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 bg-[#0f1014]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <CloudDownload className="w-4 h-4 text-white/60" />
          <span className="text-xs font-semibold text-white/80 tracking-wide">Downloads</span>
          {items.length > 0 && (
            <span className="text-[0.6rem] font-bold bg-white/10 text-white/60 px-1.5 py-0.5 rounded-full">{items.length}</span>
          )}
        </div>
        {items.length > 0 && (
          <button onClick={clearAll} className="text-[0.65rem] text-white/30 hover:text-white/70 transition-colors cursor-pointer">
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2">
            <CloudDownload className="w-8 h-8 text-white/15" />
            <p className="text-white/30 text-xs">No downloads yet</p>
            <p className="text-white/20 text-[0.65rem]">Your download history will appear here</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors group">
              <button
                onClick={() => onOpenProduct(item.id)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                disabled={fetchingId === item.id}
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="36px" />
                  {fetchingId === item.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/85 truncate group-hover:text-white transition-colors">{item.title}</p>
                  <p className="text-[0.65rem] text-white/35 truncate">{item.creator}</p>
                </div>
              </button>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[0.6rem] text-white/25">{timeAgo(item.timestamp)}</span>
                <a
                  href={`/api/download/${item.id}`}
                  className="text-[0.6rem] text-white/40 hover:text-white/80 transition-colors flex items-center gap-0.5"
                  onClick={onClose}
                >
                  <CloudDownload className="w-2.5 h-2.5" />
                  Again
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Saved Panel ───────────────────────────────────────────────────────────
function SavedPanel({
  onClose,
  onOpenProduct,
  fetchingId,
}: {
  onClose: () => void;
  onOpenProduct: (id: string) => void;
  fetchingId: string | null;
}) {
  const [items, setItems] = useState<SavedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const history: DownloadEntry[] = JSON.parse(localStorage.getItem("download-history") || "[]");
        const savedIds: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("liked-") && localStorage.getItem(key) === "true") {
            savedIds.push(key.replace("liked-", ""));
          }
        }

        if (savedIds.length === 0) { setLoading(false); return; }

        const withMeta: SavedEntry[] = [];
        const missingIds: string[] = [];
        for (const id of savedIds) {
          const meta = history.find((h) => h.id === id);
          if (meta) {
            withMeta.push({ id: meta.id, title: meta.title, image: meta.image, creator: meta.creator });
          } else {
            missingIds.push(id);
          }
        }

        let fetched: SavedEntry[] = [];
        if (missingIds.length > 0) {
          const supabase = createClient();
          const { data } = await supabase
            .from("nfts")
            .select("id, title, image_url, creator")
            .in("id", missingIds);
          if (data) {
            fetched = data.map((r) => ({
              id: r.id,
              title: r.title,
              image: r.image_url || "",
              creator: r.creator || "",
            }));
          }
        }

        setItems([...withMeta, ...fetched]);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const removeSaved = (id: string) => {
    localStorage.setItem(`liked-${id}`, "false");
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 bg-[#0f1014]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-white/60" />
          <span className="text-xs font-semibold text-white/80 tracking-wide">Saved Apps</span>
          {items.length > 0 && (
            <span className="text-[0.6rem] font-bold bg-white/10 text-white/60 px-1.5 py-0.5 rounded-full">{items.length}</span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-1 p-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-3 px-1 py-2 animate-pulse">
                <div className="w-9 h-9 rounded-lg bg-white/5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-white/5 rounded-full w-3/4" />
                  <div className="h-2 bg-white/5 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2">
            <Bookmark className="w-8 h-8 text-white/15" />
            <p className="text-white/30 text-xs">No saved apps</p>
            <p className="text-white/20 text-[0.65rem]">Tap the bookmark icon on any app to save it</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors group">
              <button
                onClick={() => onOpenProduct(item.id)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                disabled={fetchingId === item.id}
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="36px" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-white/20" />
                  )}
                  {fetchingId === item.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/85 truncate group-hover:text-white transition-colors">{item.title}</p>
                  {item.creator && <p className="text-[0.65rem] text-white/35 truncate">{item.creator}</p>}
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); removeSaved(item.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-full text-white/30 hover:text-white/70 hover:bg-white/10 transition-all cursor-pointer shrink-0"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// ── Main Header ───────────────────────────────────────────────────────────
export default function Header() {
  const [openPanel, setOpenPanel] = useState<"downloads" | "saved" | null>(null);
  const [activeProduct, setActiveProduct] = useState<ProductData | null>(null);
  const [fetchingProductId, setFetchingProductId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    if (openPanel) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openPanel]);

  const togglePanel = (panel: "downloads" | "saved") => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  const handleOpenProduct = async (id: string) => {
    setFetchingProductId(id);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("nfts")
        .select("id, title, image_url, product_image_url, creator, price, time_left, downloads, description, badge_text, file_size")
        .eq("id", id)
        .single();
      if (data) {
        setActiveProduct({
          id: data.id,
          image: data.image_url || "",
          title: data.title,
          description: data.description,
          product_image_url: data.product_image_url,
          creator: data.creator,
          price: data.price,
          timeLeft: data.time_left,
          downloads: data.downloads,
          badge_text: data.badge_text,
          file_size: data.file_size,
        });
        setOpenPanel(null); // Close dropdown panel when modal opens
      }
    } catch (e) {
      console.error(e);
    }
    setFetchingProductId(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/[0.05] px-4 sm:px-6 lg:px-8 py-4 sm:py-5.5 lg:py-6 transition-all">
        <div className="w-full max-w-[85rem] mx-auto flex flex-col justify-center">
          {/* Top Row: Logo + Desktop Expandable Search + Fixed Right Icons */}
          <div className="w-full flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Logo & Desktop Search */}
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <LogoImage />
              <Suspense fallback={<div className="hidden sm:block w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/5 animate-pulse" />}>
                <DesktopExpandableSearch />
              </Suspense>
            </div>

            {/* Center Space */}
            <div className="flex-1 min-w-0" />

            {/* Right: Downloads, Bookmark, Support */}
            <div ref={panelRef} className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">

              {/* Downloads Button + Panel */}
              <div className="relative">
                <button
                  onClick={() => togglePanel("downloads")}
                  className={`flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-full border transition-all duration-300 cursor-pointer shadow-sm active:scale-95 group ${
                    openPanel === "downloads"
                      ? "bg-[#1a1b23] border-white/15 text-white"
                      : "bg-[#14151b] hover:bg-[#1a1b23] border-white/[0.07] hover:border-white/15 text-white/80 hover:text-white"
                  }`}
                  title="Downloads"
                  aria-label="Downloads"
                >
                  <CloudDownload className="w-4.5 h-4.5 text-white/70 group-hover:text-white transition-colors" />
                </button>
                {openPanel === "downloads" && (
                  <DownloadsPanel
                    onClose={() => setOpenPanel(null)}
                    onOpenProduct={handleOpenProduct}
                    fetchingId={fetchingProductId}
                  />
                )}
              </div>

              {/* Saved Button + Panel */}
              <div className="relative">
                <button
                  onClick={() => togglePanel("saved")}
                  className={`flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-full border transition-all duration-300 cursor-pointer shadow-sm active:scale-95 group ${
                    openPanel === "saved"
                      ? "bg-[#1a1b23] border-white/15 text-white"
                      : "bg-[#14151b] hover:bg-[#1a1b23] border-white/[0.07] hover:border-white/15 text-white/80 hover:text-white"
                  }`}
                  title="Saved"
                  aria-label="Saved"
                >
                  <Bookmark className="w-4.5 h-4.5 text-white/70 group-hover:text-white transition-colors" />
                </button>
                {openPanel === "saved" && (
                  <SavedPanel
                    onClose={() => setOpenPanel(null)}
                    onOpenProduct={handleOpenProduct}
                    fetchingId={fetchingProductId}
                  />
                )}
              </div>

              {/* Support */}
              <Link
                href="/support"
                className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white hover:bg-white/90 text-black transition-all duration-300 cursor-pointer shadow-md active:scale-95 group"
                title="Support"
                aria-label="Support"
              >
                <Headset className="w-4.5 h-4.5 text-black group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Mobile Full-Width Search Bar Row */}
          <Suspense fallback={<div className="sm:hidden w-full h-12 bg-white/5 rounded-full mt-4 animate-pulse" />}>
            <MobileSearchBar />
          </Suspense>
        </div>
      </header>

      {/* Full-Screen Product Modal rendered at Header root level */}
      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </>
  );
}









