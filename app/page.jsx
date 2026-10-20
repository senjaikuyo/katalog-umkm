import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import TerakhirDilihat from "@/components/TerakhirDilihat";
import BannerBeranda from "@/components/BannerBeranda";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

const LIMIT = 12;

export default async function HalamanKatalog({ searchParams }) {
  const sp = await searchParams;
  const kataKunci = sp?.q?.trim() || "";
  const kategoriAktif = sp?.kategori?.trim() || "";
  const urutAktif = sp?.urut?.trim() || "created_at_desc";
  const halaman = Math.max(1, parseInt(sp?.halaman || "1", 10));
  const offset = (halaman - 1) * LIMIT;

  let daftarProduk = [];
  let daftarKategori = ["Semua"];
  let pesanError = null;
  let totalProduk = 0;

  try {
    const supabase = createServerClient();

    // Ambil daftar kategori unik
    const { data: dataKategori } = await supabase
      .from("produk")
      .select("kategori");

    if (dataKategori) {
      const kategoriUnik = [
        ...new Set(
          dataKategori
            .map((item) => item.kategori)
            .filter((k) => k && k.trim() !== "")
        ),
      ];
      daftarKategori = ["Semua", ...kategoriUnik];
    }

    // Query produk dengan filter
    let query = supabase.from("produk").select("*", { count: "exact" }).neq("aktif", false);

    if (kategoriAktif && kategoriAktif !== "Semua") {
      query = query.eq("kategori", kategoriAktif);
    }

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    // Urutan
    if (urutAktif === "harga_asc") {
      query = query.order("harga", { ascending: true });
    } else if (urutAktif === "harga_desc") {
      query = query.order("harga", { ascending: false });
    } else {
      query = query.order("urutan", { ascending: true }).order("created_at", { ascending: false });
    }

    // Paginasi
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
  const adaFilter = (kategoriAktif && kategoriAktif !== "Semua") || Boolean(kataKunci);

  // Buat URL untuk paginasi
  const buatUrlHalaman = (h) => {
    const params = new URLSearchParams();
    if (kategoriAktif && kategoriAktif !== "Semua") params.set("kategori", kategoriAktif);
    if (kataKunci) params.set("q", kataKunci);
    if (urutAktif !== "created_at_desc") params.set("urut", urutAktif);
    if (h > 1) params.set("halaman", String(h));
    const query = params.toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      {/* US-42: Banner Promo */}
      <BannerBeranda />

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>
        </div>

        {/* Filter kategori, pencarian, dan urutan */}
        <FilterKatalog daftarKategori={daftarKategori} />

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
            {pesanError}
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="rounded-2xl border border-garis bg-permukaan py-12 text-center text-teks-lembut">
            {adaFilter
              ? "Tidak ada produk yang cocok dengan pencarian atau filter Anda."
              : "Belum ada produk"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            {/* Paginasi */}
            {totalHalaman > 1 && (
              <nav className="flex items-center justify-center gap-2 pt-4" aria-label="Paginasi">
                {halaman > 1 && (
                  <Link
                    href={buatUrlHalaman(halaman - 1)}
                    className="rounded-lg border border-garis bg-latar px-4 py-2 text-sm font-semibold text-teks hover:border-utama hover:text-utama"
                  >
                    ← Sebelumnya
                  </Link>
                )}

                {Array.from({ length: totalHalaman }, (_, i) => i + 1)
                  .filter((h) => h === 1 || h === totalHalaman || Math.abs(h - halaman) <= 2)
                  .map((h, idx, arr) => {
                    const prev = arr[idx - 1];
                    return (
                      <>
                        {prev && h - prev > 1 && (
                          <span key={`ellipsis-${h}`} className="px-1 text-teks-lembut">…</span>
                        )}
                        <Link
                          key={h}
                          href={buatUrlHalaman(h)}
                          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                            h === halaman
                              ? "bg-utama text-white"
                              : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                          }`}
                        >
                          {h}
                        </Link>
                      </>
                    );
                  })}

                {halaman < totalHalaman && (
                  <Link
                    href={buatUrlHalaman(halaman + 1)}
                    className="rounded-lg border border-garis bg-latar px-4 py-2 text-sm font-semibold text-teks hover:border-utama hover:text-utama"
                  >
                    Berikutnya →
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </section>

      {/* US-36: Terakhir dilihat */}
      <TerakhirDilihat />
    </>
  );
}
