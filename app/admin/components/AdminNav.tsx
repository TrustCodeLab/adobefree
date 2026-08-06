"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, AppWindow, LifeBuoy } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/nfts", label: "Apps", icon: AppWindow },
    { href: "/admin/support", label: "Support", icon: LifeBuoy },
  ];

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-150 group ${
              active
                ? "bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20"
                : "text-[#9296a1] hover:text-[#ededef] hover:bg-[#242424] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  active ? "text-[#3ecf8e]" : "text-[#6b7280] group-hover:text-[#ededef]"
                }`}
              />
              <span className="text-sm font-medium">{link.label}</span>
            </div>
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
