import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormUbahProduk from "@/components/FormUbahProduk";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

// US-09: ubah data produk dari halaman admin
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  let daftarKategori = [];
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }
    produk = data;

    const { data: katData } = await supabase
      .from("kategori")
      .select("nama")
      .order("nama", { ascending: true });
    if (katData && katData.length > 0) {
      daftarKategori = katData.map((k) => k.nama);
    } else {
      const { data: pData } = await supabase.from("produk").select("kategori");
      if (pData) {
        daftarKategori = Array.from(new Set(pData.map((p) => p.kategori).filter(Boolean)));
      }
    }
  } catch (err) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormUbahProduk produk={produk} daftarKategori={daftarKategori} />
    </div>
  );
}
