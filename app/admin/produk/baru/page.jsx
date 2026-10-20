import NavAdmin from "@/components/NavAdmin";
import FormTambahProduk from "@/components/FormTambahProduk";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

// US-08: tambah produk baru dari halaman admin
export default async function HalamanTambahProduk() {
  let daftarKategori = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("kategori")
      .select("nama")
      .order("nama", { ascending: true });
    if (data && data.length > 0) {
      daftarKategori = data.map((k) => k.nama);
    } else {
      const { data: pData } = await supabase.from("produk").select("kategori");
      if (pData) {
        daftarKategori = Array.from(new Set(pData.map((p) => p.kategori).filter(Boolean)));
      }
    }
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormTambahProduk daftarKategori={daftarKategori} />
    </div>
  );
}
