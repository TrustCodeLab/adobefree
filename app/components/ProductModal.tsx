"use client";

import { X, DollarSign, CloudDownload, Share2, Bookmark, HardDrive, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface ProductModalProps {
  product: {
    id: string;
    image: string;
    title: string;
    description?: string;
    product_image_url?: string;
    icon_url?: string | null;
    creator: string;
    price: string;
    timeLeft: string;
    macUrl?: string | null;
    downloads: number;
    badge_text?: string;
    file_size?: string;
    mac_file_size?: string;
  } | null;
  onClose: () => void;
}

// Robust client OS detection helper
function detectUserOS(): "windows" | "mac" {
  if (typeof window === "undefined" || !window.navigator) return "windows";

  const nav = window.navigator as any;

  // 1. Check Modern Navigator UserAgentData Platform (Chrome, Edge, Brave, Chromium)
  if (nav.userAgentData?.platform) {
    const platform = String(nav.userAgentData.platform).toLowerCase();
    if (platform.includes("mac") || platform.includes("ios") || platform.includes("darwin")) {
      return "mac";
    }
    if (platform.includes("win")) {
      return "windows";
    }
  }

  // 2. Check navigator.platform fallback (Firefox, Safari, etc.)
  const platform = String(nav.platform || "").toLowerCase();
  if (
    platform.includes("mac") ||
    platform.includes("ipad") ||
    platform.includes("iphone") ||
    platform.includes("ipod") ||
    platform.includes("darwin")
  ) {
    return "mac";
  }
  if (platform.includes("win")) {
    return "windows";
  }

  // 3. Check navigator.userAgent string fallback
  const userAgent = String(nav.userAgent || "").toLowerCase();
  if (
    userAgent.includes("macintosh") ||
    userAgent.includes("mac os x") ||
    userAgent.includes("ipad") ||
    userAgent.includes("iphone") ||
    userAgent.includes("ipod")
  ) {
    return "mac";
  }

  return "windows";
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedOS, setSelectedOS] = useState<"windows" | "mac">("windows");
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  const isMac = selectedOS === "mac";
  const hasWindowsUrl = Boolean(product?.timeLeft && product.timeLeft.trim() !== "");
  const hasMacUrl = Boolean(product?.macUrl && product.macUrl.trim() !== "");

  // Initial client-side auto-detection
  useEffect(() => {
    setSelectedOS(detectUserOS());
  }, []);

  useEffect(() => {
    if (product) {
      setIsVisible(true);
      setShowUnavailableModal(false);
      // Auto-detect OS for the user's current environment
      const detected = detectUserOS();
      setSelectedOS(detected);

      const liked = localStorage.getItem(`liked-${product.id}`);
      if (liked) {
        setIsLiked(JSON.parse(liked));
      } else {
        setIsLiked(false);
      }
    } else {
      setIsVisible(false);
      setShowUnavailableModal(false);
    }
  }, [product]);

  const handleSelectOS = (os: "windows" | "mac") => {
    setSelectedOS(os);
    const targetAvailable = os === "mac" ? hasMacUrl : hasWindowsUrl;
    if (!targetAvailable) {
      setShowUnavailableModal(true);
    }
  };

  if (!product) return null;

  const handleLike = () => {
    const newState = !isLiked;
    setIsLiked(newState);
    localStorage.setItem(`liked-${product.id}`, JSON.stringify(newState));
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} on Adobe Free`,
      url: window.location.href, // Or construct a specific product URL if routing existed
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        console.error("Error copying link:", err);
      }
    }
  };

  const handleDownload = () => {
    const targetUrl = isMac ? product.macUrl : product.timeLeft;

    if (!targetUrl || targetUrl.trim() === "") {
      setShowUnavailableModal(true);
      return;
    }

    // Save to localStorage download history
    try {
      const existing = JSON.parse(localStorage.getItem("download-history") || "[]");
      const newEntry = {
        id: product.id,
        title: product.title,
        image: product.icon_url || product.product_image_url || product.image,
        creator: product.creator,
        timestamp: Date.now(),
      };
      // Keep unique by id, most recent first, max 20
      const filtered = existing.filter((e: { id: string }) => e.id !== product.id);
      localStorage.setItem("download-history", JSON.stringify([newEntry, ...filtered].slice(0, 20)));
    } catch {}

    toast.success(`Your ${isMac ? "macOS" : "Windows"} download has started`, {
      icon: <CloudDownload className="w-5 h-5 text-emerald-400 animate-bounce" />
    });

    setTimeout(() => {
      window.location.href = `/api/download/${product.id}?os=${selectedOS}`;
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-300 ${isVisible
        ? "opacity-100 backdrop-blur-md bg-black/60"
        : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      <article
        className={`bg-[#0f1115] w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 transform ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
        onClick={(e) => e.stopPropagation()}
        itemScope
        itemType="https://schema.org/SoftwareApplication"
      >
        {/* Close Button Mobile - Absolute */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white/70 hover:text-white backdrop-blur-md border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="relative w-full md:w-5/12 aspect-video md:aspect-auto bg-[#0f1115] overflow-hidden rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none">
          <meta itemProp="operatingSystem" content="Windows, macOS" />
          <meta itemProp="applicationCategory" content="DesignApplication" />
          <meta itemProp="offers" content="0" />
          <Image
            src={product.product_image_url || product.image}
            alt={`${product.title} free download`}
            fill
            className="object-cover scale-[1.02] rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none"
            sizes="(max-width: 48rem) 100vw, 50vw"
            priority
            itemProp="image"
          />
          {/* Floating Action Buttons over Image */}
          <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center transition-all hover:bg-accent hover:border-accent hover:scale-110 backdrop-blur-md cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleLike}
              className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center transition-all hover:bg-accent hover:border-accent hover:scale-110 backdrop-blur-md cursor-pointer"
              title="Save app"
            >
              <Bookmark
                className={`w-4 h-4 ${isLiked ? "text-yellow-400 fill-yellow-400" : "text-white"}`}
              />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col relative bg-card/50 backdrop-blur-sm">
          {/* Close Button Desktop */}
          <button
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-1.5 mb-6">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-accent/90">
              {product.creator}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight" itemProp="name">
              {product.title}
            </h2>
            <div className="flex items-center gap-2 pt-3.5 flex-wrap">
              {/* Price Tag */}
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-tight">
                  {product.price}
                </span>
              </div>

              {/* Download Count */}
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CloudDownload
                  className="w-3.5 h-3.5 text-white/70"
                  strokeWidth={2}
                />
                <span className="text-white/80 font-medium text-xs sm:text-sm">
                  {product.downloads > 0
                    ? `${product.downloads} Downloads`
                    : "New"}
                </span>
              </div>

              {/* File Size */}
              {(isMac ? (product.mac_file_size || product.file_size) : product.file_size) && (
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <HardDrive
                    className="w-3.5 h-3.5 text-white/70"
                    strokeWidth={2}
                  />
                  <span className="text-white/80 font-medium text-xs sm:text-sm">
                    {isMac ? (product.mac_file_size || product.file_size) : product.file_size}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-8 min-h-[5.5rem]">
            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
              {product.description ||
                "No description available for this application."}
            </p>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-start gap-2.5">
              {/* OS Selection Toggle (Icons Only) */}
              <div className="flex items-center p-1 bg-white/[0.05] border border-white/10 rounded-full backdrop-blur-md shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelectOS("windows")}
                  className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    selectedOS === "windows"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "text-white/40 hover:text-white/80 border border-transparent hover:bg-white/5"
                  }`}
                  title="Windows"
                  aria-label="Windows"
                >
                  <svg
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.951" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOS("mac")}
                  className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    selectedOS === "mac"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "text-white/40 hover:text-white/80 border border-transparent hover:bg-white/5"
                  }`}
                  title="macOS"
                  aria-label="macOS"
                >
                  <svg
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.17c.61-.75 1.04-1.8 0.91-2.85-.93.04-2.02.63-2.66 1.38-.57.65-1.06 1.7-0.93 2.73 1.03.08 2.07-.51 2.68-1.26z" />
                  </svg>
                </button>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="bg-[#e4e4e7] hover:bg-white text-[#0f1115] border border-white/40 backdrop-blur-md font-semibold py-3 sm:py-3.5 min-w-[200px] sm:min-w-[230px] px-8 sm:px-10 rounded-full transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg shadow-md shadow-black/20 group"
              >
                <CloudDownload className="w-5 h-5 text-[#0f1115] group-hover:animate-bounce shrink-0" />
                <span>Download Now</span>
              </button>
            </div>
            <p className="text-left text-white/40 text-xs font-medium mt-5 sm:mt-6 flex items-center justify-start gap-2 pl-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
              <span>Secure download directly from server</span>
            </p>
          </div>
        </div>

        {/* Border Overlay */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none z-50" />

        {/* OS Download Unavailable Clean Modal Popup */}
        {showUnavailableModal && (
          <div
            className="absolute inset-0 z-[60] bg-black/85 backdrop-blur-xl rounded-[2rem] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setShowUnavailableModal(false)}
          >
            <div
              className="bg-[#0b0c0e] border border-white/[0.08] rounded-[2.25rem] sm:rounded-[2.5rem] p-7 sm:p-8 max-w-[360px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bottom Ambient Glow from reference card */}
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#3ecf8e]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-16 -left-16 w-36 h-36 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* 3D Glowing Glass Orb Icon (from reference design) */}
              <div className="relative mx-auto w-18 h-18 mb-5 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#3ecf8e]/25 rounded-full blur-xl" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-white/20 via-white/[0.05] to-transparent border border-white/25 backdrop-blur-xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                  {/* Specular light highlight */}
                  <div className="absolute top-1.5 left-3 w-4 h-2 rounded-full bg-white/50 blur-[0.5px]" />
                  {selectedOS === "mac" ? (
                    <svg className="w-7 h-7 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.17c.61-.75 1.04-1.8 0.91-2.85-.93.04-2.02.63-2.66 1.38-.57.65-1.06 1.7-0.93 2.73 1.03.08 2.07-.51 2.68-1.26z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.951" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Status Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-white/70 mb-3 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" />
                <span>{selectedOS === "mac" ? "macOS" : "Windows"} Build</span>
              </div>

              {/* High-End Typography Headline */}
              <h3 className="text-xl sm:text-[22px] font-semibold text-white tracking-[-0.03em] leading-snug">
                {selectedOS === "mac" ? "macOS Unavailable" : "Windows Unavailable"}
              </h3>

              {/* Subtext */}
              <p className="text-white/50 text-[13px] leading-relaxed mt-2 mb-6 max-w-[260px] mx-auto font-normal">
                A download for <span className="text-white font-medium">{selectedOS === "mac" ? "macOS" : "Windows"}</span> hasn&apos;t been uploaded yet for this app.
              </p>

              {/* Actions */}
              {(selectedOS === "mac" ? hasWindowsUrl : hasMacUrl) ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      const other = selectedOS === "mac" ? "windows" : "mac";
                      setSelectedOS(other);
                      setShowUnavailableModal(false);
                      toast.success(`Switched to ${other === "mac" ? "macOS" : "Windows"} download`, {
                        icon: <CloudDownload className="w-5 h-5 text-emerald-400 animate-bounce" />
                      });
                      setTimeout(() => {
                        window.location.href = `/api/download/${product.id}?os=${other}`;
                      }, 400);
                    }}
                    className="w-full bg-[#e4e4e7] hover:bg-white text-[#0f1115] font-semibold py-3 px-5 rounded-full transition-colors duration-200 text-sm cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-white/5 group"
                  >
                    <span>Download for {selectedOS === "mac" ? "Windows" : "macOS"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUnavailableModal(false)}
                    className="w-full text-xs font-medium text-white/40 hover:text-white/80 py-1 transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUnavailableModal(false)}
                  className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-3 rounded-full transition-all text-sm cursor-pointer border border-white/10"
                >
                  Got it
                </button>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
