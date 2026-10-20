import NavAdmin from "@/components/NavAdmin";
import FormBanner from "@/components/FormBanner";
import TombolAksiBanner from "@/components/TombolAksiBanner";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HalamanBannerAdmin() {
  let daftarBanner = [];

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("banner")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) daftarBanner = data;
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Kelola Banner Promo</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Pasang banner penawaran khusus di halaman beranda toko.
        </p>
      </div>

      <FormBanner />

      <div className="overflow-hidden rounded-xl border border-garis bg-permukaan">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-garis bg-latar text-xs uppercase text-teks-lembut">
            <tr>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Keterangan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {daftarBanner.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada banner promo.
                </td>
              </tr>
            ) : (
              daftarBanner.map((b) => (
                <tr key={b.id} className="hover:bg-latar/50">
                  <td className="px-4 py-3 font-semibold">{b.judul}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-teks-lembut">{b.teks || "-"}</td>
                  <td className="px-4 py-3">
                    {b.aktif ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-garis px-2 py-0.5 text-xs font-semibold text-teks-lembut">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <TombolAksiBanner id={b.id} aktif={b.aktif} />
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

