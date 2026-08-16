import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Create a simple Supabase client (no auth needed for public reads)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing app ID" }, { status: 400 });
  }

  const os = request.nextUrl.searchParams.get("os") || "windows";

  // Fetch the NFT/app by ID to get both download URLs
  const { data: nft, error } = await supabase
    .from("nfts")
    .select("time_left, mac_url, title")
    .eq("id", id)
    .single();

  if (error || !nft) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  // Select the correct URL based on OS
  // Fall back to the other URL if the requested one is not set
  const downloadUrl =
    os === "mac"
      ? (nft.mac_url || nft.time_left)
      : (nft.time_left || nft.mac_url);

  if (!downloadUrl) {
    return NextResponse.json(
      { error: "Download URL not configured" },
      { status: 404 },
    );
  }

  // Increment download count (Atomic update)
  const { error: rpcError } = await supabase.rpc("increment_downloads", {
    app_id: id,
  });

  if (rpcError) {
    console.error("Failed to increment downloads:", rpcError);
  }

  // Redirect directly to the download URL for maximum speed
  return NextResponse.redirect(downloadUrl);
}
