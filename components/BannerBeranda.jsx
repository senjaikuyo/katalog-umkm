import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export default async function BannerBeranda() {
  let bannerAktif = null;

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("banner")
      .select("*")
      .eq("aktif", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) bannerAktif = data;
  } catch {}

  if (!bannerAktif) return null;

  const Konten = (
    <div className="my-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-utama p-6 text-white sm:flex-row">
      <div className="flex flex-col gap-1">
        <span className="self-start rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          Pengumuman
        </span>
        <h3 className="text-xl font-extrabold">{bannerAktif.judul}</h3>
        {bannerAktif.teks && (
          <p className="max-w-xl text-sm text-white/90">{bannerAktif.teks}</p>
        )}
      </div>
      {bannerAktif.tautan && (
        <span className="flex-shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold text-utama hover:bg-permukaan">
          Lihat Promo →
        </span>
      )}
    </div>
  );

  if (bannerAktif.tautan) {
    return <Link href={bannerAktif.tautan}>{Konten}</Link>;
  }

  return Konten;
}

