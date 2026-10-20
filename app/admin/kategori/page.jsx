import NavAdmin from "@/components/NavAdmin";
import KelolaKategori from "@/components/KelolaKategori";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HalamanKategoriAdmin() {
  let kategoriWithCount = [];

  try {
    const supabase = createServerClient();

    // 1. Ambil daftar kategori dari tabel kategori
    const { data: daftarKategori } = await supabase
      .from("kategori")
      .select("*")
      .order("nama", { ascending: true });

    // 2. Ambil produk untuk menghitung jumlah per kategori
    const { data: produkData } = await supabase
      .from("produk")
      .select("kategori");

    const counts = {};
    if (produkData) {
      produkData.forEach((p) => {
        if (p.kategori) {
          counts[p.kategori] = (counts[p.kategori] || 0) + 1;
        }
      });
    }

    if (daftarKategori && daftarKategori.length > 0) {
      kategoriWithCount = daftarKategori.map((k) => ({
        id: k.id,
        nama: k.nama,
        slug: k.slug,
        jumlah: counts[k.nama] || 0,
      }));
    } else {
      // Fallback jika belum ada data di tabel kategori
      kategoriWithCount = Object.entries(counts).map(([nama, jumlah], idx) => ({
        id: idx + 1,
        nama,
        slug: nama.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-"),
        jumlah,
      }));
    }
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Kelola Kategori</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Tambah, ubah, dan hapus kategori produk toko. Kategori yang masih digunakan oleh produk tidak dapat dihapus sembarangan.
        </p>
      </div>

      <KelolaKategori initialKategori={kategoriWithCount} />
    </div>
  );
}
