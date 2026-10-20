import NavAdmin from "@/components/NavAdmin";
import TombolAksiUlasan from "@/components/TombolAksiUlasan";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HalamanUlasanAdmin() {
  let daftarUlasan = [];

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("ulasan")
      .select("*, produk:produk_id(nama)")
      .order("created_at", { ascending: false });

    if (data) daftarUlasan = data;
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Moderasi Ulasan</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Tinjau ulasan dan rating dari pembeli sebelum ditampilkan di katalog.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-garis bg-permukaan">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-garis bg-latar text-xs uppercase text-teks-lembut">
            <tr>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Pengulas</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Komentar</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {daftarUlasan.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada ulasan yang masuk.
                </td>
              </tr>
            ) : (
              daftarUlasan.map((u) => (
                <tr key={u.id} className="hover:bg-latar/50">
                  <td className="px-4 py-3 font-semibold">{u.produk?.nama || `#${u.produk_id}`}</td>
                  <td className="px-4 py-3">{u.nama}</td>
                  <td className="px-4 py-3 text-yellow-500 font-bold">{"★".repeat(u.rating)}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-teks-lembut">{u.komentar || "-"}</td>
                  <td className="px-4 py-3">
                    {u.status === "approved" || u.ditampilkan ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Tampil
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                        Tertunda
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <TombolAksiUlasan
                      id={u.id}
                      ditampilkan={u.status === "approved" || Boolean(u.ditampilkan)}
                    />
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

