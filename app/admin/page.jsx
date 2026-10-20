import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

const LIMIT = 15;

export default async function HalamanAdmin({ searchParams }) {
  const sp = await searchParams;
  const kataKunci = sp?.q?.trim() || "";
  const halaman = Math.max(1, parseInt(sp?.halaman || "1", 10));
  const offset = (halaman - 1) * LIMIT;

  let daftarProduk = [];
  let pesanError = null;
  let totalProduk = 0;

  try {
    const supabase = createServerClient();
    let query = supabase.from("produk").select("*", { count: "exact" });

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    query = query.order("urutan", { ascending: true }).order("created_at", { ascending: false });
    query = query.range(offset, offset + LIMIT - 1);

    const { data, error, count } = await query;

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
      totalProduk = count || 0;
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message}`;
  }

  const totalHalaman = Math.max(1, Math.ceil(totalProduk / LIMIT));

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Kelola Produk</h1>
          <p className="text-xs text-teks-lembut">Total {totalProduk} produk di katalog</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* US-35: Ekspor CSV */}
          <a
            href="/api/admin/export-csv"
            className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
          >
            📥 Ekspor CSV
          </a>
          {/* US-46: Impor CSV */}
          <Link
            href="/admin/impor"
            className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
          >
            📤 Impor CSV
          </Link>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {/* US-33: Form Pencarian Admin */}
      <form method="GET" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={kataKunci}
          placeholder="Cari nama produk di admin..."
          className="w-full max-w-sm rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap"
        >
          Cari
        </button>
        {kataKunci && (
          <Link
            href="/admin"
            className="inline-flex items-center rounded-lg border border-garis bg-permukaan px-3 py-2 text-xs font-semibold text-teks-lembut hover:text-teks"
          >
            Reset
          </Link>
        )}
      </form>

      {pesanError ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          {pesanError}
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="rounded-2xl border border-garis py-12 text-center text-teks-lembut">
          {kataKunci ? "Tidak ada produk yang cocok dengan pencarian." : "Belum ada produk di database."}
        </p>
      ) : (
        <>
          <TabelProduk daftarProduk={daftarProduk} />

          {/* US-33: Paginasi Admin */}
          {totalHalaman > 1 && (
            <div className="flex items-center justify-between border-t border-garis pt-4 text-sm">
              <span className="text-xs text-teks-lembut">
                Halaman {halaman} dari {totalHalaman}
              </span>
              <div className="flex gap-2">
                {halaman > 1 && (
                  <Link
                    href={`/admin?halaman=${halaman - 1}${kataKunci ? `&q=${encodeURIComponent(kataKunci)}` : ""}`}
                    className="rounded-lg border border-garis px-3 py-1.5 text-xs font-semibold hover:border-utama"
                  >
                    ← Sebelumnya
                  </Link>
                )}
                {halaman < totalHalaman && (
                  <Link
                    href={`/admin?halaman=${halaman + 1}${kataKunci ? `&q=${encodeURIComponent(kataKunci)}` : ""}`}
                    className="rounded-lg border border-garis px-3 py-1.5 text-xs font-semibold hover:border-utama"
                  >
                    Berikutnya →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
