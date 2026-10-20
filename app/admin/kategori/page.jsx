import NavAdmin from "@/components/NavAdmin";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export const revalidate = 0;

export default async function HalamanKategoriAdmin() {
  let kategoriList = [];

  try {
    const supabase = createServerClient();
    const { data: produkData } = await supabase.from("produk").select("kategori");

    if (produkData) {
      const counts = {};
      produkData.forEach((p) => {
        const k = p.kategori || "Tanpa Kategori";
        counts[k] = (counts[k] || 0) + 1;
      });

      kategoriList = Object.entries(counts).map(([nama, jumlah]) => ({
        nama,
        jumlah,
      }));
    }
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Daftar Kategori</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Kategori produk yang terdaftar di katalog.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-garis bg-permukaan">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-garis bg-latar text-xs uppercase text-teks-lembut">
            <tr>
              <th className="px-4 py-3">Nama Kategori</th>
              <th className="px-4 py-3 text-center">Jumlah Produk</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {kategoriList.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada kategori produk.
                </td>
              </tr>
            ) : (
              kategoriList.map((kat) => (
                <tr key={kat.nama} className="hover:bg-latar/50">
                  <td className="px-4 py-3 font-semibold">{kat.nama}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-utama/10 px-2.5 py-0.5 text-xs font-bold text-utama">
                      {kat.jumlah} produk
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/?kategori=${encodeURIComponent(kat.nama)}`}
                      target="_blank"
                      className="text-xs font-semibold text-utama hover:underline"
                    >
                      Lihat di Katalog ↗
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

