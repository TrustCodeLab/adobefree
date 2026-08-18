"use client";

import { useState, useRef } from "react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { updateNFT } from "../actions";

interface Category {
  id: string;
  name: string;
}

interface NFT {
  id: string;
  title: string;
  creator: string;
  price: string;
  time_left: string | null;
  mac_url?: string | null;
  category_id: string | null;
  image_url: string;
  product_image_url?: string | null;
  icon_url?: string | null;
  description?: string | null;
  downloads: number;
  badge_text?: string | null;
  file_size?: string | null;
  mac_file_size?: string | null;
}

interface EditAppFormProps {
  nft: NFT;
  categories: Category[];
}

export default function EditAppForm({ nft, categories }: EditAppFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    nft.image_url || null,
  );
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(
    nft.product_image_url || null,
  );
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(
    nft.icon_url || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIconPreviewUrl(url);
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

  const clearIconPreview = () => {
    setIconPreviewUrl(null);
    if (iconFileInputRef.current) {
      iconFileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerProductFileInput = () => {
    productFileInputRef.current?.click();
  };

  const triggerIconFileInput = () => {
    iconFileInputRef.current?.click();
  };

  return (
    <form
      action={updateNFT}
      className="bg-[#1c1c1c] border border-[#2e2e2e] p-6 sm:p-8 rounded-xl space-y-6"
    >
      <input type="hidden" name="id" value={nft.id} />
      <input type="hidden" name="current_image_url" value={nft.image_url} />
      <input
        type="hidden"
        name="current_product_image_url"
        value={nft.product_image_url || ""}
      />
      <input
        type="hidden"
        name="current_icon_url"
        value={nft.icon_url || ""}
      />

      {/* 3-Way Asset Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* 1. Card Banner */}
        <div className="space-y-1.5 min-w-0">
          <div>
            <label className="text-xs font-semibold text-[#ededef] block truncate">
              Card Banner
            </label>
            <p className="text-[11px] text-[#6b7280] truncate">Store card (5:3)</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          {previewUrl ? (
            <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden group border-2 border-dashed border-[#2e2e2e] bg-[#141414]">
              <Image
                src={previewUrl}
                alt="Card Banner Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearPreview}
                  className="p-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-2.5 bg-[#242424] text-[#ededef] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer border border-[#2e2e2e]"
                >
                  <ArrowUpTrayIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className="relative w-full aspect-[5/3] border-2 border-dashed border-[#2e2e2e] rounded-xl flex items-center justify-center text-center hover:border-[#3ecf8e]/50 transition-colors group cursor-pointer bg-[#141414] select-none"
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none p-3 sm:p-4">
                <div className="p-2 bg-[#242424] rounded-lg group-hover:bg-[#3ecf8e]/10 transition-colors">
                  <ArrowUpTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280] group-hover:text-[#3ecf8e]" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[#ededef] font-semibold text-xs truncate">
                    Upload Banner
                  </p>
                  <p className="text-[#6b7280] text-[10px] sm:text-[11px] truncate">5:3 Ratio</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Product Modal Cover */}
        <div className="space-y-1.5 min-w-0">
          <div>
            <label className="text-xs font-semibold text-[#ededef] block truncate">
              Modal Cover
            </label>
            <p className="text-[11px] text-[#6b7280] truncate">Popup detail image</p>
          </div>

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
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={triggerProductFileInput}
                  className="p-2.5 bg-[#242424] text-[#ededef] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer border border-[#2e2e2e]"
                >
                  <ArrowUpTrayIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerProductFileInput}
              className="relative w-full aspect-[5/3] border-2 border-dashed border-[#2e2e2e] rounded-xl flex items-center justify-center text-center hover:border-[#3ecf8e]/50 transition-colors group cursor-pointer bg-[#141414] select-none"
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none p-3 sm:p-4">
                <div className="p-2 bg-[#242424] rounded-lg group-hover:bg-[#3ecf8e]/10 transition-colors">
                  <ArrowUpTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280] group-hover:text-[#3ecf8e]" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[#ededef] font-semibold text-xs truncate">
                    Upload Cover
                  </p>
                  <p className="text-[#6b7280] text-[10px] sm:text-[11px] truncate">
                    Detail View
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. App Icon */}
        <div className="space-y-1.5 min-w-0">
          <div>
            <label className="text-xs font-semibold text-[#ededef] block truncate">
              App Icon
            </label>
            <p className="text-[11px] text-[#6b7280] truncate">Square logo (1:1)</p>
          </div>

          <input
            ref={iconFileInputRef}
            type="file"
            name="icon"
            className="hidden"
            accept="image/*,.svg"
            onChange={handleIconChange}
          />

          {iconPreviewUrl ? (
            <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden group border-2 border-dashed border-[#2e2e2e] bg-[#141414]">
              <Image
                src={iconPreviewUrl}
                alt="App Icon Preview"
                fill
                className="object-contain p-2"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearIconPreview}
                  className="p-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={triggerIconFileInput}
                  className="p-2.5 bg-[#242424] text-[#ededef] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer border border-[#2e2e2e]"
                >
                  <ArrowUpTrayIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerIconFileInput}
              className="relative w-full aspect-[5/3] border-2 border-dashed border-[#2e2e2e] rounded-xl flex items-center justify-center text-center hover:border-[#3ecf8e]/50 transition-colors group cursor-pointer bg-[#141414] select-none"
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none p-3 sm:p-4">
                <div className="p-2 bg-[#242424] rounded-lg group-hover:bg-[#3ecf8e]/10 transition-colors">
                  <ArrowUpTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#6b7280] group-hover:text-[#3ecf8e]" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[#ededef] font-semibold text-xs truncate">
                    Upload Icon
                  </p>
                  <p className="text-[#6b7280] text-[10px] sm:text-[11px] truncate">
                    1:1 Square
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
          defaultValue={nft.description || ""}
          placeholder="Enter app description..."
          className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm resize-none"
        />
      </div>

      {/* Title & Creator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Title
          </label>
          <input
            name="title"
            defaultValue={nft.title}
            required
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Creator
          </label>
          <input
            name="creator"
            defaultValue={nft.creator}
            required
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Price & Download URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Price / Tag
          </label>
          <input
            name="price"
            defaultValue={nft.price}
            required
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
        {/* placeholder col */}
        <div />
      </div>

      {/* Download URLs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#878c96] block">
          Download URLs
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Windows URL */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-[#6b7280]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.951" />
              </svg>
            </div>
            <input
              name="time_left"
              defaultValue={nft.time_left || ""}
              placeholder="Windows URL (e.g. https://mega.nz/...)"
              className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 pl-9 pr-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
            />
          </div>
          {/* Mac URL */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-[#6b7280]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.17c.61-.75 1.04-1.8 0.91-2.85-.93.04-2.02.63-2.66 1.38-.57.65-1.06 1.7-0.93 2.73 1.03.08 2.07-.51 2.68-1.26z" />
              </svg>
            </div>
            <input
              name="mac_url"
              defaultValue={nft.mac_url || ""}
              placeholder="Mac URL (e.g. https://mega.nz/...)"
              className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 pl-9 pr-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Category & Downloads */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Category
          </label>
          <div className="relative">
            <select
              name="category_id"
              defaultValue={nft.category_id || ""}
              required
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
            File Size (Win)
          </label>
          <input
            name="file_size"
            type="text"
            defaultValue={nft.file_size || ""}
            placeholder="e.g. 2.4 GB"
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            File Size (Mac)
          </label>
          <input
            name="mac_file_size"
            type="text"
            defaultValue={nft.mac_file_size || ""}
            placeholder="e.g. 3.1 GB"
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#878c96] block">
            Downloads Count
          </label>
          <input
            name="downloads"
            type="text"
            inputMode="numeric"
            defaultValue={nft.downloads}
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-lg py-2.5 px-4 text-[#ededef] placeholder-[#6b7280] focus:outline-none focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="pt-2">
        <button className="w-full bg-[#3ecf8e] hover:bg-[#34b27b] text-[#141414] font-bold py-3 rounded-lg transition-all cursor-pointer text-sm">
          Update App
        </button>
      </div>
    </form>
  );
}
