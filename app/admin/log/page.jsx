import NavAdmin from "@/components/NavAdmin";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HalamanLogAdmin() {
  let daftarLog = [];

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("aktivitas_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) daftarLog = data;
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Log Aktivitas Admin</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Menampilkan 50 riwayat aktivitas perubahan data terakhir.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-garis bg-permukaan">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-garis bg-latar text-xs uppercase text-teks-lembut">
            <tr>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Aksi</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {daftarLog.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada log aktivitas tercatat.
                </td>
              </tr>
            ) : (
              daftarLog.map((log) => (
                <tr key={log.id} className="hover:bg-latar/50">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-teks-lembut">
                    {new Date(log.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 font-semibold">{log.user_email || "System"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-utama/10 px-2 py-0.5 text-xs font-bold text-utama">
                      {log.aksi}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-teks-lembut">{log.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

