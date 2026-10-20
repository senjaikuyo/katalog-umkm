import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import KotakPemesanan from "@/components/KotakPemesanan";
import GaleriFoto from "@/components/GaleriFoto";
import BagikanProduk from "@/components/BagikanProduk";
import TombolFavorit from "@/components/TombolFavorit";
import FormUlasan from "@/components/FormUlasan";
import KotakTanya from "@/components/KotakTanya";
import CatatTerakhirDilihat from "@/components/CatatTerakhirDilihat";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("produk")
      .select("nama,deskripsi,foto_url")
      .eq("id", id)
      .maybeSingle();
    if (!data) return {};
    return {
      title: data.nama,
      description: data.deskripsi || data.nama,
      openGraph: {
        title: data.nama,
        description: data.deskripsi || data.nama,
        images: data.foto_url ? [{ url: data.foto_url }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  let produk = null;
  let daftarVarian = [];
  let produkTerkait = [];
  let daftarUlasan = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      notFound();
    }
    produk = data;

    // US-17: Produk terkait dari kategori yang sama
    if (produk.kategori) {
      const { data: terkaitData } = await supabase
        .from("produk")
        .select("*")
        .eq("kategori", produk.kategori)
        .neq("id", id)
        .limit(4);
      if (terkaitData) produkTerkait = terkaitData;
    }

    // US-38: Ambil ulasan
    try {
      const { data: ulasanData } = await supabase
        .from("ulasan")
        .select("*")
        .eq("produk_id", id)
        .eq("ditampilkan", true)
        .order("created_at", { ascending: false });
      if (ulasanData) daftarUlasan = ulasanData;
    } catch {
      // tabel ulasan belum ada
    }

    // US-48: Coba ambil varian
    try {
      const { data: varianData } = await supabase
        .from("varian")
        .select("*")
        .eq("produk_id", id);
      if (varianData) daftarVarian = varianData;
    } catch {
      // Abaikan jika tabel varian belum dibuat
    }
  } catch {
    notFound();
  }

  const habis = produk.stok === 0;
  const rataRating =
    daftarUlasan.length > 0
      ? (daftarUlasan.reduce((s, u) => s + u.rating, 0) / daftarUlasan.length).toFixed(1)
      : null;

  return (
    <>
      <CatatTerakhirDilihat produkId={id} />
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        {/* US-18: Galeri foto */}
        <GaleriFoto
          fotoUtama={produk.foto_url}
          fotoUrls={produk.foto_urls || []}
          namaAlt={produk.nama}
        />
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          {produk.kategori && (
            <Link
              href={`/kategori/${encodeURIComponent(produk.kategori)}`}
              className="self-start text-sm text-teks-lembut hover:text-utama"
            >
              {produk.kategori}
            </Link>
          )}

          <div className="flex items-start justify-between gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
            {/* US-24: Tombol favorit */}
            <TombolFavorit produkId={String(produk.id)} />
          </div>

          {/* US-20: Badge */}
          {produk.badge && (
            <span className="self-start rounded-full bg-utama px-3 py-0.5 text-xs font-bold text-white">
              {produk.badge}
            </span>
          )}

          {/* US-19: Stok habis */}
          {habis && (
            <span className="self-start rounded-full bg-bahaya px-3 py-0.5 text-xs font-bold text-white">
              Stok Habis
            </span>
          )}

          {/* US-20: Harga diskon */}
          <div className="flex items-center gap-3">
            {produk.harga_diskon ? (
              <>
                <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
                  {formatRupiah(produk.harga_diskon)}
                </p>
                <p className="text-base text-teks-lembut line-through">
                  {formatRupiah(produk.harga)}
                </p>
              </>
            ) : (
              <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
                {formatRupiah(produk.harga)}
              </p>
            )}
          </div>

          {/* Rating */}
          {rataRating && (
            <p className="text-sm text-teks-lembut">
              ⭐ {rataRating} ({daftarUlasan.length} ulasan)
            </p>
          )}

          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>

          {/* US-19: Nonaktifkan pesan jika stok habis */}
          <KotakPemesanan produk={produk} daftarVarian={daftarVarian} habis={habis} />

          {/* US-23: Bagikan */}
          <BagikanProduk namaProduk={produk.nama} />
        </div>
      </article>

      {/* US-38: Ulasan & Rating */}
      <section className="pb-8">
        <h2 className="mb-4 text-lg font-bold">Ulasan pembeli</h2>
        {daftarUlasan.length > 0 ? (
          <div className="flex flex-col gap-3">
            {daftarUlasan.map((u) => (
              <div key={u.id} className="rounded-xl border border-garis bg-permukaan p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{u.nama}</p>
                  <span className="text-sm">{"⭐".repeat(u.rating)}</span>
                </div>
                {u.komentar && <p className="mt-1 text-sm text-teks-lembut">{u.komentar}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-teks-lembut">Belum ada ulasan.</p>
        )}
        <div className="mt-6">
          <FormUlasan produkId={String(produk.id)} />
        </div>
      </section>

      {/* US-50: AI Tanya Jawab */}
      <section className="pb-8">
        <KotakTanya produk={produk} />
      </section>

      {/* US-17: Produk terkait */}
      {produkTerkait.length > 0 && (
        <section className="pb-12">
          <h2 className="mb-4 text-lg font-bold">Produk serupa</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {produkTerkait.map((p) => (
              <KartuProduk key={p.id} produk={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
