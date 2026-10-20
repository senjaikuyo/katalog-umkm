import Link from "next/link";
import { notFound } from "next/navigation";
import KotakPemesanan from "@/components/KotakPemesanan";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

// US-02: ambil satu produk dari Supabase berdasarkan id, di sisi server.
// US-12: pengunjung memilih jumlah atau varian sebelum memesan via WhatsApp.
export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  let produk = null;
  let daftarVarian = [];

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

    // Coba ambil varian jika tabel varian_produk ada
    try {
      const { data: varianData } = await supabase
        .from("varian_produk")
        .select("*")
        .eq("produk_id", id);
      if (varianData) {
        daftarVarian = varianData;
      }
    } catch {
      // Abaikan jika tabel varian belum dibuat di database
    }
  } catch (err) {
    notFound();
  }

  return (
    <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <img
        src={produk.foto_url}
        alt={produk.nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <p className="text-sm text-teks-lembut">{produk.kategori}</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
        <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
        <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
        <KotakPemesanan produk={produk} daftarVarian={daftarVarian} />
      </div>
    </article>
  );
}
