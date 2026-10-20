import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const namaKategori = decodeURIComponent(slug);
  return {
    title: `Kategori ${namaKategori}`,
    description: `Daftar produk dalam kategori ${namaKategori}`,
  };
}

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const namaKategori = decodeURIComponent(slug);

  let daftarProduk = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", namaKategori)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      notFound();
    }
    daftarProduk = data;
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <div>
        <Link href="/" className="text-sm text-teks-lembut hover:text-utama">
          ← Kembali ke semua produk
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
          Kategori: {namaKategori}
        </h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Menampilkan {daftarProduk.length} produk
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {daftarProduk.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </div>
  );
}

