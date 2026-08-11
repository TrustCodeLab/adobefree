import NFTStoreClient from "./components/NFTStoreClient";
import CardSkeleton from "./components/CardSkeleton";
import Header from "./components/Header";
import { createClient } from "./utils/supabase/server";
import { Suspense } from "react";

async function StoreContent({ query }: { query: string }) {
  const supabase = await createClient();

  // Fetch Categories with their NFTs, ordered by category creation
  const { data: categoriesWithNFTs } = await supabase
    .from("categories")
    .select("*, nfts(*)")
    .order("display_order", { ascending: true });

  return (
    <NFTStoreClient
      initialData={categoriesWithNFTs || []}
      query={query}
    />
  );
}

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query =
    typeof searchParams.q === "string" ? searchParams.q.toLowerCase() : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <Suspense fallback={<CardSkeleton />}>
            <StoreContent query={query} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
