"use client";

import { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { deleteCategory, updateCategoryOrder } from "./actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

interface DraggableCategoryListProps {
  initialCategories: Category[];
}

export default function DraggableCategoryList({
  initialCategories,
}: DraggableCategoryListProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      const element = document.getElementById(`category-${id}`);
      if (element) element.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    const element = document.getElementById(`category-${draggedId}`);
    if (element) element.style.opacity = "1";

    if (draggedId && dragOverId && draggedId !== dragOverId) {
      const draggedIndex = categories.findIndex((c) => c.id === draggedId);
      const targetIndex = categories.findIndex((c) => c.id === dragOverId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newCategories = [...categories];
        const [removed] = newCategories.splice(draggedIndex, 1);
        newCategories.splice(targetIndex, 0, removed);

        const updatedCategories = newCategories.map((cat, index) => ({
          ...cat,
          display_order: index,
        }));

        setCategories(updatedCategories);

        await updateCategoryOrder(
          updatedCategories.map((c) => ({
            id: c.id,
            display_order: c.display_order,
          })),
        );
      }
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggedId) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDelete = async (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    await deleteCategory(id);
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-center space-y-2">
        <p className="text-[#ededef] font-semibold text-sm">No categories configured yet</p>
        <p className="text-[#878c96] text-xs">Use the form above to add your first category.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5">
      {categories.map((cat, index) => (
        <div
          key={cat.id}
          id={`category-${cat.id}`}
          draggable
          onDragStart={(e) => handleDragStart(e, cat.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, cat.id)}
          onDragLeave={handleDragLeave}
          className={`bg-[#1c1c1c] border p-3.5 sm:px-5 rounded-xl flex justify-between items-center group transition-all duration-150 cursor-grab active:cursor-grabbing ${
            dragOverId === cat.id
              ? "border-[#3ecf8e] bg-[#242424] scale-[1.005]"
              : "border-[#2e2e2e] hover:border-[#3ecf8e]/40 hover:bg-[#242424]/80"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-lg bg-[#242424] border border-[#2e2e2e] text-[#6b7280] group-hover:text-[#3ecf8e] transition-colors">
              <GripVertical className="w-4 h-4" />
            </div>
            
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <span className="text-[#ededef] font-bold text-sm group-hover:text-[#3ecf8e] transition-colors">
                {cat.name}
              </span>
              <span className="text-[11px] font-mono font-medium text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 px-2 py-0.5 rounded-md">
                {cat.slug}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#6b7280]">
              Order #{index + 1}
            </span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 rounded-lg text-[#6b7280] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
