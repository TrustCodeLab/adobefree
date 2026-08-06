import { createClient } from "../../utils/supabase/server";
import { addCategory } from "./actions";
import { Plus, FolderPlus, FolderTree, GripVertical, Layers } from "lucide-react";
import DraggableCategoryList from "./DraggableCategoryList";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  const totalCategories = categories?.length || 0;

  return (
    <div className="space-y-6">
      {/* Supabase Styled Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#1c1c1c] p-6 sm:p-8 border border-[#2e2e2e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
                <FolderTree className="w-3.5 h-3.5" /> App Taxonomy
              </span>
              <span className="text-[#6b7280] text-xs font-medium">• Navigation Filters</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#ededef] tracking-tight">
              Category Management
            </h2>
            <p className="text-[#878c96] text-sm">
              Create and organize software categories. Drag and drop items to adjust storefront display order.
            </p>
          </div>

          {/* Stats Badge */}
          <div className="px-4 py-2.5 rounded-xl bg-[#242424] border border-[#2e2e2e] flex items-center gap-3 self-start sm:self-auto">
            <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-center text-[#3ecf8e]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#878c96] font-medium">Total Categories</p>
              <p className="text-base font-bold text-[#ededef] leading-none">{totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Form */}
      <form
        action={addCategory}
        className="rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#ededef] flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[#3ecf8e]" />
            Add New Category
          </label>
          <span className="text-xs text-[#878c96] font-mono bg-[#242424] px-2.5 py-0.5 rounded-md border border-[#2e2e2e]">
            Auto-slugified
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              name="name"
              required
              placeholder="e.g. Photoshop 2026, Video Editing, Utilities"
              className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
            />
          </div>

          <button className="bg-[#3ecf8e] hover:bg-[#34b27b] text-[#141414] font-bold py-2.5 px-5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 text-sm">
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </button>
        </div>
      </form>

      {/* Draggable Category List Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#ededef]">Configured Categories</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
              {totalCategories}
            </span>
          </div>
          <span className="text-[#878c96] text-xs font-medium flex items-center gap-1">
            <GripVertical className="w-3.5 h-3.5 text-[#3ecf8e]" /> Drag to reorder
          </span>
        </div>

        <DraggableCategoryList initialCategories={categories || []} />
      </div>
    </div>
  );
}
