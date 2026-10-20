import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HalamanKatalog({ searchParams }) {
  const sp = await searchParams;
  const kataKunci = sp?.q?.trim() || "";
  const kategoriAktif = sp?.kategori?.trim() || "";

  let daftarProduk = [];
  let daftarKategori = ["Semua"];
  let pesanError = null;

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

    // Query produk dengan filter kategori dan pencarian nama (US-11)
    let query = supabase.from("produk").select("*");

    if (kategoriAktif && kategoriAktif !== "Semua") {
      query = query.eq("kategori", kategoriAktif);
    }

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message}`;
  }

  const adaFilter = (kategoriAktif && kategoriAktif !== "Semua") || Boolean(kataKunci);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>
        </div>

        {/* US-11: Filter kategori dan pencarian */}
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
