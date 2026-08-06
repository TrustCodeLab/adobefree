"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  RectangleStackIcon,
  WindowIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";

interface MobileSidebarProps {
  signOutAction: () => Promise<void>;
}

export function MobileSidebar({ signOutAction }: MobileSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const links = [
    { href: "/admin", label: "Overview", icon: Squares2X2Icon },
    { href: "/admin/categories", label: "Categories", icon: RectangleStackIcon },
    { href: "/admin/nfts", label: "Apps", icon: WindowIcon },
    { href: "/admin/support", label: "Support", icon: LifebuoyIcon },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg hover:bg-[#242424] transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-5 h-5 text-[#ededef]" />
        ) : (
          <Bars3Icon className="w-5 h-5 text-[#ededef]" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-[#1c1c1c] border-r border-[#2a2a2a] flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2a2a2a] pt-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#242424] border border-[#2e2e2e] flex items-center justify-center flex-shrink-0 p-1">
            <Image
              src="/icon.png"
              alt="Adobe Free Icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#ededef]">Adobe Free</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]"></span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3ecf8e]">Production</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="px-3 pb-3 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Main Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  active
                    ? "bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20"
                    : "text-[#9296a1] hover:text-[#ededef] hover:bg-[#242424] border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${active ? "text-[#3ecf8e]" : "text-[#6b7280] group-hover:text-[#ededef]"}`}
                />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <form action={signOutAction}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-red-500/10 text-[#6b7280] hover:text-red-400 border border-[#2a2a2a] hover:border-red-500/20 text-xs font-semibold transition-all cursor-pointer">
              <ArrowRightStartOnRectangleIcon className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
