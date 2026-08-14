import { createClient } from "../utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import {
  PlusIcon,
  RectangleStackIcon,
  FolderIcon,
  LifebuoyIcon,
  SignalIcon,
  PencilIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import RealTimeNewsTicker from "./components/RealTimeNewsTicker";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch exact counts
  const { count: nftsCount } = await supabase
    .from("nfts")
    .select("*", { count: "exact", head: true });

  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  const { count: supportCount } = await supabase
    .from("support_requests")
    .select("*", { count: "exact", head: true });

  // 2. Fetch Recent Apps (latest 6)
  const { data: recentApps } = await supabase
    .from("nfts")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(6);

  // 3. Fetch Categories & All Apps for Distribution
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("display_order", { ascending: true });

  const { data: allApps } = await supabase
    .from("nfts")
    .select("category_id");

  // Calculate App Distribution per Category
  const categoryCounts: Record<string, number> = {};
  allApps?.forEach((app) => {
    if (app.category_id) {
      categoryCounts[app.category_id] = (categoryCounts[app.category_id] || 0) + 1;
    }
  });

  const categoryStats =
    categories?.map((cat) => {
      const count = categoryCounts[cat.id] || 0;
      const total = nftsCount && nftsCount > 0 ? nftsCount : 1;
      const percentage = Math.round((count / total) * 100);
      return {
        id: cat.id,
        name: cat.name,
        count,
        percentage,
      };
    }).sort((a, b) => b.count - a.count) || [];

  // 4. Fetch Recent Support Requests (latest 3)
  const { data: recentSupport } = await supabase
    .from("support_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  // Helper date formatter
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Supabase Dashboard Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#1c1c1c] p-6 sm:p-8 border border-[#2e2e2e]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-pulse"></span>
                Supabase Dashboard View
              </span>
              <span className="text-[#6b7280] text-xs font-medium">• Production Environment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#ededef] tracking-tight">
              Overview & Analytics
            </h2>
            <p className="text-[#878c96] text-sm leading-relaxed">
              Real-time catalog metrics.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/nfts/new"
              className="inline-flex items-center gap-2 bg-[#3ecf8e] hover:bg-[#34b27b] text-[#141414] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add New App</span>
            </Link>

            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 bg-[#242424] hover:bg-[#2a2a2a] text-[#ededef] font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-[#2e2e2e] transition-all"
            >
              <FolderIcon className="w-4 h-4 text-[#3ecf8e]" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/support"
              className="inline-flex items-center gap-2 bg-[#242424] hover:bg-[#2a2a2a] text-[#ededef] font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-[#2e2e2e] transition-all"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#3ecf8e]" />
              <span>Support</span>
              <span className="ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3ecf8e]/15 text-[#3ecf8e] border border-[#3ecf8e]/30">
                {supportCount || 0}
              </span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-[#878c96] hover:text-[#ededef] font-medium text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#2e2e2e] transition-all"
              title="Open store website"
            >
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Supabase Dashboard Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Catalog */}
        <Link href="/admin/nfts" className="group rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] p-5 space-y-3 hover:border-[#3ecf8e]/40 transition-all duration-200 block cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[#878c96] font-mono text-[11px] font-semibold tracking-wider uppercase">
              Total Catalog
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#242424] border border-[#2e2e2e] flex items-center justify-center text-[#3ecf8e] group-hover:scale-105 transition-transform">
              <RectangleStackIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <h3 className="text-3xl font-extrabold text-[#ededef] tracking-tight">
              {nftsCount || 0}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#2e2e2e] text-xs text-[#878c96]">
            <span>Published Software</span>
            <span className="text-[#3ecf8e] font-medium flex items-center gap-1">View All <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></span>
          </div>
        </Link>

        {/* Metric 2: Categories */}
        <Link href="/admin/categories" className="group rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] p-5 space-y-3 hover:border-[#3ecf8e]/40 transition-all duration-200 block cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[#878c96] font-mono text-[11px] font-semibold tracking-wider uppercase">
              Categories
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#242424] border border-[#2e2e2e] flex items-center justify-center text-[#3ecf8e] group-hover:scale-105 transition-transform">
              <FolderIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <h3 className="text-3xl font-extrabold text-[#ededef] tracking-tight">
              {categoriesCount || 0}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#2e2e2e] text-xs text-[#878c96]">
            <span>Taxonomy Groups</span>
            <span className="text-[#3ecf8e] font-medium flex items-center gap-1">Manage <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></span>
          </div>
        </Link>

        {/* Metric 3: Support Inquiries */}
        <Link href="/admin/support" className="group rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] p-5 space-y-3 hover:border-[#3ecf8e]/40 transition-all duration-200 block cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[#878c96] font-mono text-[11px] font-semibold tracking-wider uppercase">
              Support Tickets
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#242424] border border-[#2e2e2e] flex items-center justify-center text-[#3ecf8e] group-hover:scale-105 transition-transform">
              <LifebuoyIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <h3 className="text-3xl font-extrabold text-[#ededef] tracking-tight">
              {supportCount || 0}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
              Monitored
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#2e2e2e] text-xs text-[#878c96]">
            <span>User Feedback</span>
            <span className="text-[#3ecf8e] font-medium flex items-center gap-1">View Tickets <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></span>
          </div>
        </Link>

        {/* Metric 4: Database & Storage */}
        <a href="https://supabase.com/dashboard/project/mjtokvqdrswfgfhvchns" target="_blank" rel="noopener noreferrer" className="group rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] p-5 space-y-3 hover:border-[#3ecf8e]/40 transition-all duration-200 block cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[#878c96] font-mono text-[11px] font-semibold tracking-wider uppercase">
              Postgres & Storage
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#242424] border border-[#2e2e2e] flex items-center justify-center text-[#3ecf8e] group-hover:scale-105 transition-transform">
              <SignalIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ecf8e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3ecf8e]"></span>
              </span>
              <h3 className="text-xl font-bold text-[#ededef] tracking-tight">
                Operational
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#2e2e2e] text-xs text-[#878c96]">
            <span className="flex items-center gap-1 text-[#ededef] font-medium">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#3ecf8e]" /> 99.9% Health
            </span>
            <span className="text-[#3ecf8e] font-medium flex items-center gap-1">Dashboard <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></span>
          </div>
        </a>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Apps */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-lg font-bold text-[#ededef] flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#242424] border border-[#2e2e2e] flex items-center justify-center text-[#3ecf8e]">
                  <CubeIcon className="w-4 h-4" />
                </div>
                Recent Apps
              </h3>
            </div>

            <Link
              href="/admin/nfts"
              className="text-xs font-semibold text-[#3ecf8e] hover:underline flex items-center gap-1"
            >
              <span>View All ({nftsCount || 0})</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!recentApps || recentApps.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#242424] border border-[#2e2e2e] mx-auto flex items-center justify-center text-[#6b7280]">
                <RectangleStackIcon className="w-6 h-6" />
              </div>
              <p className="text-[#ededef] font-semibold text-sm">No apps found</p>
              <Link
                href="/admin/nfts/new"
                className="inline-flex items-center gap-2 bg-[#3ecf8e] text-[#141414] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#34b27b] transition-all"
              >
                <PlusIcon className="w-4 h-4" /> Add App
              </Link>
            </div>
          ) : (
            <div className="rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] overflow-hidden divide-y divide-[#2e2e2e]">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-[#242424]/60 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0">
                      {app.icon_url || app.product_image_url || app.image_url ? (
                        <Image
                          src={app.icon_url || app.product_image_url || app.image_url}
                          alt={app.title || "App Icon"}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6b7280] text-xs font-bold">
                          App
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#ededef] truncate group-hover:text-[#3ecf8e] transition-colors">
                          {app.title}
                        </h4>
                        {app.badge_text && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#3ecf8e]/10 text-[#3ecf8e] rounded-md border border-[#3ecf8e]/20">
                            {app.badge_text}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#878c96] flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#242424] text-[#ededef] font-medium text-[11px] border border-[#2e2e2e]">
                          {app.categories?.name || "Uncategorized"}
                        </span>
                        <span>•</span>
                        <span className="text-[#ededef] font-medium">{app.creator || "Adobe"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#878c96]">
                          <ClockIcon className="w-3 h-3" /> {formatDate(app.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-[#242424] text-[#3ecf8e] border border-[#3ecf8e]/20 text-xs font-bold font-mono">
                      {app.price || "Free"}
                    </span>

                    <Link
                      href={`/admin/nfts/${app.id}`}
                      className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#242424] hover:bg-[#2a2a2a] text-[#ededef] hover:text-[#3ecf8e] transition-all border border-[#2e2e2e] flex items-center gap-1.5 text-xs font-medium"
                      title="Edit App Details"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Category Distribution & Support Widgets */}
        <div className="space-y-6">
          {/* Category Breakdown Card */}
          <div className="rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#ededef] flex items-center gap-2">
                <FolderIcon className="w-4 h-4 text-[#3ecf8e]" /> Category Distribution
              </h3>
              <Link
                href="/admin/categories"
                className="text-xs font-semibold text-[#3ecf8e] hover:underline"
              >
                Manage
              </Link>
            </div>

            {categoryStats.length === 0 ? (
              <p className="text-[#878c96] text-xs text-center py-4">No categories configured.</p>
            ) : (
              <div className="space-y-3">
                {categoryStats.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#ededef] font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#3ecf8e]"></span>
                        {cat.name}
                      </span>
                      <span className="text-[#878c96]">
                        <strong className="text-[#ededef] font-mono">{cat.count}</strong> {cat.count === 1 ? "app" : "apps"}{" "}
                        <span className="text-[#6b7280]">({cat.percentage}%)</span>
                      </span>
                    </div>
                    {/* Supabase Green Progress Bar */}
                    <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden border border-[#2e2e2e]">
                      <div
                        className="h-full bg-[#3ecf8e] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(cat.percentage, 6)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Support Messages Card */}
          <div className="rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#ededef] flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#3ecf8e]" /> Recent Support
              </h3>
              <Link
                href="/admin/support"
                className="text-xs font-semibold text-[#3ecf8e] hover:underline"
              >
                All Tickets
              </Link>
            </div>

            {!recentSupport || recentSupport.length === 0 ? (
              <div className="text-center py-4 space-y-1 bg-[#242424] border border-[#2e2e2e] rounded-lg p-3">
                <p className="text-[#ededef] text-xs font-medium">No pending tickets</p>
                <p className="text-[#878c96] text-[11px]">Messages sent from your store contact page will show here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentSupport.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-[#242424] hover:bg-[#2a2a2a] rounded-lg border border-[#2e2e2e] space-y-1 transition-all duration-150 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#ededef] truncate max-w-[130px] group-hover:text-[#3ecf8e]">
                        {req.name || req.email}
                      </span>
                      <span className="text-[10px] text-[#6b7280]">{formatDate(req.created_at)}</span>
                    </div>
                    <p className="text-xs text-[#ededef] font-medium truncate">{req.subject}</p>
                    <p className="text-[11px] text-[#878c96] line-clamp-2 leading-relaxed">{req.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time News Ticker */}
          <RealTimeNewsTicker />
        </div>
      </div>
    </div>
  );
}
