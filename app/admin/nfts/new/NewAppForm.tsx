"use client";

import { useState, useRef, useActionState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { createNFT } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface NewAppFormProps {
  categories: Category[];
}

export default function NewAppForm({ categories }: NewAppFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(createNFT, {
    message: "",
    error: "404",
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    } else if (state.message) {
      toast.success(state.message);
      router.push("/admin/nfts");
    }
  }, [state, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProductPreviewUrl(url);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearProductPreview = () => {
    setProductPreviewUrl(null);
    if (productFileInputRef.current) {
      productFileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerProductFileInput = () => {
    productFileInputRef.current?.click();
  };

  return (
    <form
      action={formAction}
      className="bg-[#1c1c1c] border border-[#2e2e2e] p-6 sm:p-8 rounded-xl space-y-6"
    >
      {/* Dual Image Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card/Thumbnail Image */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Card Image (Thumbnail)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            required
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          {previewUrl ? (
            <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden group border-2 border-dashed border-[#2e2e2e] bg-[#141414]">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearPreview}
                  className="p-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-2.5 bg-[#242424] text-[#ededef] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer border border-[#2e2e2e]"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className="relative w-full aspect-[5/3] border-2 border-dashed border-[#2e2e2e] rounded-xl flex items-center justify-center text-center hover:border-[#3ecf8e]/50 transition-colors group cursor-pointer bg-[#141414] select-none"
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none p-4">
                <div className="p-2.5 bg-[#242424] rounded-lg group-hover:bg-[#3ecf8e]/10 transition-colors">
                  <Upload className="w-5 h-5 text-[#6b7280] group-hover:text-[#3ecf8e]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[#ededef] font-semibold text-xs">
                    Upload Thumbnail
                  </p>
                  <p className="text-[#6b7280] text-[11px]">(5:3 Aspect Ratio)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product/Details Image */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Product Image (Modal Cover)
          </label>

          <input
            ref={productFileInputRef}
            type="file"
            name="product_image"
            className="hidden"
            accept="image/*"
            onChange={handleProductImageChange}
          />

          {productPreviewUrl ? (
            <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden group border-2 border-dashed border-[#2e2e2e] bg-[#141414]">
              <Image
                src={productPreviewUrl}
                alt="Product Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearProductPreview}
                  className="p-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={triggerProductFileInput}
                  className="p-2.5 bg-[#242424] text-[#ededef] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer border border-[#2e2e2e]"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerProductFileInput}
              className="relative w-full aspect-[5/3] border-2 border-dashed border-[#2e2e2e] rounded-xl flex items-center justify-center text-center hover:border-[#3ecf8e]/50 transition-colors group cursor-pointer bg-[#141414] select-none"
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none p-4">
                <div className="p-2.5 bg-[#242424] rounded-lg group-hover:bg-[#3ecf8e]/10 transition-colors">
                  <Upload className="w-5 h-5 text-[#6b7280] group-hover:text-[#3ecf8e]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[#ededef] font-semibold text-xs">
                    Upload Product Cover
                  </p>
                  <p className="text-[#6b7280] text-[11px]">
                    (High Quality Recommended)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#878c96] block">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          placeholder="Enter app description..."
          className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Title
          </label>
          <input
            name="title"
            required
            placeholder="e.g. Photoshop 2026"
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Creator
          </label>
          <input
            name="creator"
            required
            placeholder="e.g. Adobe Inc."
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Price / Tag
          </label>
          <input
            name="price"
            required
            placeholder="e.g. Free or Pro"
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Download URL
          </label>
          <input
            name="time_left"
            placeholder="e.g. https://mega.nz/..."
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Category
          </label>
          <div className="relative">
            <select
              name="category_id"
              required
              defaultValue=""
              className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all appearance-none cursor-pointer text-sm font-medium"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#1c1c1c] text-[#ededef]">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Initial Downloads
          </label>
          <input
            name="downloads"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 1200"
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          disabled={isPending}
          className="w-full bg-[#3ecf8e] hover:bg-[#34b27b] text-[#141414] font-bold py-3 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isPending ? "Creating App..." : "Create App"}
        </button>
      </div>
    </form>
  );
}
