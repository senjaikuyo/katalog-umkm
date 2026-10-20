import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

// US-06: rute ini terlindungi oleh proxy.js
export default async function HalamanAdmin() {
  // US-07: daftar produk diambil dari database Supabase
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message}`;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          {pesanError}
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="rounded-2xl border border-garis py-12 text-center text-teks-lembut">
          Belum ada produk di database.
        </p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
