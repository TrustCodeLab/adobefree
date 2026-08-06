import { NextResponse } from "next/server";

const RSS_URL =
  "https://news.google.com/rss?topic=T&hl=en-US&gl=US&ceid=US:en";

function getTag(title: string): { tag: string; badgeColor: string } {
  const t = title.toLowerCase();
  if (t.includes("ai") || t.includes("openai") || t.includes("gemini") || t.includes("machine learning")) {
    return { tag: "AI", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
  }
  if (t.includes("security") || t.includes("hack") || t.includes("breach") || t.includes("cyber") || t.includes("malware")) {
    return { tag: "SECURITY", badgeColor: "bg-red-500/10 text-red-400 border-red-500/20" };
  }
  if (t.includes("apple") || t.includes("microsoft") || t.includes("adobe") || t.includes("amazon") || t.includes("google") || t.includes("meta")) {
    return { tag: "TECH", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
  }
  if (t.includes("software") || t.includes("app") || t.includes("update") || t.includes("release") || t.includes("launch")) {
    return { tag: "SOFTWARE", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  }
  return { tag: "NEWS", badgeColor: "bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/20" };
}

function formatTime(pubDate: string): string {
  try {
    const date = new Date(pubDate);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const hours = Math.floor(diffMin / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return "Recently";
  }
}

export async function GET() {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    const items = [];

    for (const match of itemMatches) {
      const raw = match[1];

      const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/);
      const pubDateMatch = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

      if (!titleMatch) continue;

      let title = titleMatch[1]
        .replace(/<!\[CDATA\[|\]\]>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      // Google News appends " - Source Name" — strip it
      title = title.replace(/ - [^-]{1,40}$/, "").trim();

      if (!title) continue;

      const pubDate = pubDateMatch?.[1]?.trim() ?? "";
      const { tag, badgeColor } = getTag(title);

      items.push({ tag, title, time: formatTime(pubDate), badgeColor });

      if (items.length >= 8) break;
    }

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[/api/news]", err);
    return NextResponse.json(
      { items: [], error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
