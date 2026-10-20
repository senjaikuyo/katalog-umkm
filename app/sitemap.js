import { createServerClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let ruteProduk = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("produk").select("id, created_at");
    if (data) {
      ruteProduk = data.map((p) => ({
        url: `${baseUrl}/produk/${p.id}`,
        lastModified: p.created_at ? new Date(p.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {
    // fallback jika db error
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...ruteProduk,
  ];
}

