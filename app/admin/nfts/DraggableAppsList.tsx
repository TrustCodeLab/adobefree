"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Pencil, Plus } from "lucide-react";
import { deleteNFT, updateNFTOrder } from "./actions";

interface NFT {
    id: string;
    title: string;
    creator: string;
    price: string;
    image_url: string;
    product_image_url?: string | null;
    display_order: number;
    category_id: string;
    categories?: { name: string };
}

interface DraggableAppsListProps {
    initialNFTs: NFT[];
}

export default function DraggableAppsList({
    initialNFTs,
}: DraggableAppsListProps) {
    const [nfts, setNfts] = useState(initialNFTs);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
            const element = document.getElementById(`nft-${id}`);
            if (element) element.style.opacity = "0.5";
        }, 0);
    };

    const handleDragEnd = async () => {
        const element = document.getElementById(`nft-${draggedId}`);
        if (element) element.style.opacity = "1";

        if (draggedId && dragOverId && draggedId !== dragOverId) {
            const draggedIndex = nfts.findIndex((n) => n.id === draggedId);
            const targetIndex = nfts.findIndex((n) => n.id === dragOverId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const newNfts = [...nfts];
                const [removed] = newNfts.splice(draggedIndex, 1);
                newNfts.splice(targetIndex, 0, removed);

                const updatedNfts = newNfts.map((nft, index) => ({
                    ...nft,
                    display_order: index,
                }));

                setNfts(updatedNfts);

                await updateNFTOrder(
                    updatedNfts.map((n) => ({ id: n.id, display_order: n.display_order }))
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
        setNfts(nfts.filter((n) => n.id !== id));
        await deleteNFT(id);
    };

    if (!nfts || nfts.length === 0) {
        return (
            <div className="p-8 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-center space-y-3">
                <p className="text-[#ededef] font-semibold text-sm">No apps published yet</p>
                <p className="text-[#878c96] text-xs">Create your first software package to populate the catalog.</p>
                <Link
                    href="/admin/nfts/new"
                    className="inline-flex items-center gap-2 bg-[#3ecf8e] text-[#141414] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#34b27b] transition-all mt-2"
                >
                    <Plus className="w-4 h-4" /> Create App Now
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft) => (
                <div
                    key={nft.id}
                    id={`nft-${nft.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, nft.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, nft.id)}
                    onDragLeave={handleDragLeave}
                    className={`bg-[#1c1c1c] border p-4 rounded-xl flex items-center gap-4 group transition-all duration-150 cursor-grab active:cursor-grabbing ${
                        dragOverId === nft.id
                            ? "border-[#3ecf8e] bg-[#242424] scale-[1.005]"
                            : "border-[#2e2e2e] hover:border-[#3ecf8e]/40 hover:bg-[#242424]/80"
                        }`}
                >
                    {/* Image Thumbnail / Icon Wallpaper */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#141414] border border-[#2e2e2e] group-hover:border-[#3ecf8e]/40 transition-colors">
                        <Image
                            src={nft.image_url || nft.product_image_url || ""}
                            alt={nft.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0 py-0.5 space-y-1.5">
                        <div className="flex justify-between items-start">
                            <h3 className="text-[#ededef] font-bold text-sm truncate pr-1 group-hover:text-[#3ecf8e] transition-colors">
                                {nft.title}
                            </h3>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <Link
                                    href={`/admin/nfts/${nft.id}`}
                                    className="p-1.5 text-[#6b7280] hover:text-[#ededef] hover:bg-[#242424] rounded-md transition-all border border-transparent hover:border-[#2e2e2e]"
                                    title="Edit App"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(nft.id)}
                                    className="p-1.5 text-[#6b7280] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all border border-transparent hover:border-red-500/20 cursor-pointer"
                                    title="Delete App"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <p className="text-[#878c96] text-xs truncate font-medium">{nft.creator || "Adobe"}</p>

                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className="text-[11px] bg-[#242424] px-2 py-0.5 rounded-md text-[#ededef] font-medium border border-[#2e2e2e]">
                                {nft.categories?.name || "Uncategorized"}
                            </span>
                            <span className="text-xs text-[#3ecf8e] font-mono font-bold bg-[#3ecf8e]/10 px-2 py-0.5 rounded-md border border-[#3ecf8e]/20">
                                {nft.price || "Free"}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
