import NavAdmin from "@/components/NavAdmin";
import { createServerClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";

export const revalidate = 0;

export default async function HalamanDashboardAdmin() {
  let totalProduk = 0;
  let kategoriCounts = {};
  let topProduk = [];

  try {
    const supabase = createServerClient();

    // Total produk dan per kategori
    const { data: produkData } = await supabase
      .from("produk")
      .select("id, nama, kategori, harga");

    if (produkData) {
      totalProduk = produkData.length;
      produkData.forEach((p) => {
        const k = p.kategori || "Tanpa Kategori";
        kategoriCounts[k] = (kategoriCounts[k] || 0) + 1;
      });
    }

    // US-41: Top 5 produk dengan klik WA terbanyak
    try {
      const { data: klikData } = await supabase
        .from("klik_wa")
        .select("produk_id");

      if (klikData && klikData.length > 0 && produkData) {
        const klikCounts = {};
        klikData.forEach((k) => {
          klikCounts[k.produk_id] = (klikCounts[k.produk_id] || 0) + 1;
        });

        const sorted = Object.entries(klikCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        topProduk = sorted.map(([id, jumlahKlik]) => {
          const prod = produkData.find((p) => String(p.id) === String(id));
          return {
            id,
            nama: prod?.nama || `Produk #${id}`,
            harga: prod?.harga || 0,
            jumlahKlik,
          };
        });
      }
    } catch {
      // Tabel klik_wa belum dibuat
    }
  } catch (err) {
    // Tangani error
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Dashboard Toko</h1>
        <p className="mt-1 text-sm text-teks-lembut">Ringkasan performa katalog produk.</p>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <p className="text-sm font-semibold text-teks-lembut">Total Produk</p>
          <p className="mt-2 text-3xl font-extrabold text-utama">{totalProduk}</p>
        </div>
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <p className="text-sm font-semibold text-teks-lembut">Jumlah Kategori</p>
          <p className="mt-2 text-3xl font-extrabold text-teks">
            {Object.keys(kategoriCounts).length}
          </p>
        </div>
      </div>

      {/* Distribusi Kategori */}
      <div className="rounded-2xl border border-garis bg-permukaan p-5">
        <h2 className="text-lg font-bold">Produk per Kategori</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(kategoriCounts).map(([kat, count]) => (
            <div
              key={kat}
              className="flex items-center gap-2 rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm"
            >
              <span className="font-semibold">{kat}</span>
              <span className="rounded-full bg-utama px-2 py-0.5 text-xs font-bold text-white">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* US-41: 5 Produk Paling Sering Dipesan via WhatsApp */}
      <div className="rounded-2xl border border-garis bg-permukaan p-5">
        <h2 className="text-lg font-bold">Top 5 Produk Paling Sering Dipesan (WhatsApp)</h2>
        {topProduk.length === 0 ? (
          <p className="mt-3 text-sm text-teks-lembut">
            Belum ada data pemesanan WhatsApp yang tercatat.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-garis">
            {topProduk.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-teks-lembut">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold">{item.nama}</p>
                    <p className="text-xs text-teks-lembut">{formatRupiah(item.harga)}</p>
                  </div>
                </div>
                <span className="rounded-md bg-harga-latar px-2 py-1 text-xs font-bold text-harga">
                  {item.jumlahKlik} kali diklik
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

