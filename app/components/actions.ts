"use server";

import { createClient } from "../utils/supabase/server";

export async function getFileSize(id: string) {
  const supabase = await createClient();

  const { data: nft } = await supabase
    .from("nfts")
    .select("time_left, file_size")
    .eq("id", id)
    .single();

  if (!nft) {
    return null;
  }

  // If file_size is already cached in the DB, return it instantly
  if (nft.file_size) {
    return nft.file_size as number;
  }

  // No download URL means no file size to fetch
  if (!nft.time_left) {
    return null;
  }

  // Fetch file size from the remote URL
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // 1. Try HEAD request first (best for performance)
      let response = await fetch(nft.time_left, {
        method: "HEAD",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: controller.signal,
      });

      let contentLength = response.headers.get("content-length");

      // 2. If HEAD fails or no content-length, try GET with Range
      if (!contentLength || !response.ok) {
        response = await fetch(nft.time_left, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Range: "bytes=0-0",
          },
          signal: controller.signal,
        });

        // Some servers return content-range instead of content-length for range requests
        const contentRange = response.headers.get("content-range");
        if (contentRange) {
          const totalSize = contentRange.split("/")[1];
          contentLength = totalSize || null;
        } else {
          contentLength = response.headers.get("content-length");
        }
      }

      clearTimeout(timeoutId);

      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);

        // Cache the file size in Supabase so future loads are instant
        await supabase
          .from("nfts")
          .update({ file_size: sizeInBytes })
          .eq("id", id);

        return sizeInBytes;
      }

      return null;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  } catch (error) {
    console.error("Failed to fetch file size:", error);
    return null;
  }
}
