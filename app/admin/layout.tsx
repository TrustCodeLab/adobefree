import { LogOut } from "lucide-react";
import Image from "next/image";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "./components/AdminNav";
import { MobileSidebar } from "./components/MobileSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== "trustjonathan.ug@gmail.com") {
    redirect("/login");
  }

  const signOut = async () => {
    "use server";
    const sb = await createClient();
    await sb.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#ededef]">
      {/* Mobile Sidebar */}
      <MobileSidebar signOutAction={signOut} />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#1c1c1c] border-r border-[#2a2a2a] flex-col fixed h-full z-20">
        {/* Branding Header */}
        <div className="p-5 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#242424] border border-[#2e2e2e] flex items-center justify-center flex-shrink-0 p-1">
            <Image
              src="/icon.png"
              alt="Adobe Free Icon"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-[#ededef] tracking-tight truncate">
              Adobe Free
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]"></span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3ecf8e]">
                Production
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <AdminNav />

        {/* Footer: User Info + Sign Out */}
        <div className="p-4 border-t border-[#2a2a2a] mt-auto space-y-3">
          <div className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#242424] border border-[#2e2e2e] flex items-center justify-center flex-shrink-0 p-1">
              <Image
                src="/icon.png"
                alt="Admin Avatar"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#ededef] truncate">Super Admin</p>
              <p className="text-[10px] text-[#6b7280] truncate">trustjonathan.ug@gmail.com</p>
            </div>
          </div>

          <form action={signOut}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-red-500/10 text-[#6b7280] hover:text-red-400 border border-[#2a2a2a] hover:border-red-500/20 text-xs font-semibold transition-all cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
