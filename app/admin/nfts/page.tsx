import { createClient } from '../../utils/supabase/server'
import Link from 'next/link'
import { PlusIcon, WindowIcon, Bars2Icon } from '@heroicons/react/24/outline'
import DraggableAppsList from './DraggableAppsList'

export default async function NFTsPage() {
    const supabase = await createClient()

    // Fetch NFTs with Category name, ordered by display_order
    const { data: nfts } = await supabase
        .from('nfts')
        .select('*, categories(name)')
        .order('display_order', { ascending: true })

    const totalApps = nfts?.length || 0;

    return (
        <div className="space-y-6">
            {/* Supabase Styled Header Banner */}
            <div className="relative overflow-hidden rounded-xl bg-[#1c1c1c] p-6 sm:p-8 border border-[#2e2e2e]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
                                <WindowIcon className="w-3.5 h-3.5" /> Software Store
                            </span>
                            <span className="text-[#6b7280] text-xs font-medium">• Storefront Apps</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#ededef] tracking-tight">
                            Apps Management
                        </h2>
                        <p className="text-[#878c96] text-sm">
                            Manage software packages, edit details, and drag cards to customize storefront order.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href="/admin/nfts/new" 
                            className="bg-[#3ecf8e] hover:bg-[#34b27b] text-[#141414] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-2"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Add New App</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Draggable Apps List Container */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold text-[#ededef]">All Apps</h3>
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/20">
                            {totalApps}
                        </span>
                    </div>
                    <span className="text-[#878c96] text-xs font-medium flex items-center gap-1">
                        <Bars2Icon className="w-3.5 h-3.5 text-[#3ecf8e]" /> Drag cards to reorder
                    </span>
                </div>

                <DraggableAppsList initialNFTs={nfts || []} />
            </div>
        </div>
    )
}
