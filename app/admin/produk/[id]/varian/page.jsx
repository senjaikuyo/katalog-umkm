import Link from "next/link";
import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import KelolaVarian from "@/components/KelolaVarian";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HalamanKelolaVarian({ params }) {
  const { id } = await params;

  let produk = null;
  let daftarVarian = [];

  try {
    const supabase = createServerClient();
    const { data: produkData, error: produkError } = await supabase
      .from("produk")
      .select("id, nama, harga")
      .eq("id", id)
      .maybeSingle();

    if (produkError || !produkData) {
      notFound();
    }
    produk = produkData;

    const { data: varianData } = await supabase
      .from("varian_produk")
      .select("*")
      .eq("produk_id", id)
      .order("harga", { ascending: true });

    if (varianData) {
      daftarVarian = varianData;
    }
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <Link href="/admin" className="text-xs text-teks-lembut hover:text-utama">
          ← Kembali ke daftar produk
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold">
          Kelola Varian: {produk.nama}
        </h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Atur pilihan varian dan harga khusus per ukuran/kemasan untuk produk ini.
        </p>
      </div>

      <KelolaVarian produkId={String(produk.id)} initialVarian={daftarVarian} />
    </div>
  );
}
