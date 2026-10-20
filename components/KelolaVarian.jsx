"use client";

import { useActionState, useTransition } from "react";
import { formatRupiah } from "@/lib/format";
import { tambahVarianAction, hapusVarianAction } from "@/app/admin/produk/[id]/varian/actions";

export default function KelolaVarian({ produkId, initialVarian = [] }) {
  const [state, formAction, isPending] = useActionState(tambahVarianAction, null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleHapus = (varianId, namaVarian) => {
    if (!confirm(`Hapus varian "${namaVarian}"?`)) return;
    startDeleteTransition(async () => {
      const res = await hapusVarianAction(varianId, produkId);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form Tambah Varian */}
      <div className="rounded-xl border border-garis bg-permukaan p-5">
        <h2 className="text-base font-bold text-teks">Tambah Varian Baru</h2>
        <p className="mt-0.5 text-xs text-teks-lembut">
          Contoh: &quot;250 Gram&quot;, &quot;Ukuran L&quot;, &quot;Ekstra Pedas&quot; dengan harga tersendiri.
        </p>

        <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="produk_id" value={produkId} />

          <label className="flex flex-1 min-w-[200px] flex-col gap-1 text-xs font-semibold text-teks">
            Nama Varian
            <input
              type="text"
              name="nama_varian"
              placeholder="Contoh: Ukuran 500 gram"
              required
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
          </label>

          <label className="flex w-44 flex-col gap-1 text-xs font-semibold text-teks">
            Harga (Rp)
            <input
              type="number"
              name="harga"
              min="0"
              placeholder="Contoh: 55000"
              required
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "+ Tambah Varian"}
          </button>
        </form>

        {state?.error && (
          <p className="mt-2 text-xs font-semibold text-bahaya">{state.error}</p>
        )}
        {state?.sukses && (
          <p className="mt-2 text-xs font-semibold text-green-600">{state.sukses}</p>
        )}
      </div>

      {/* Tabel Varian */}
      <div className="overflow-hidden rounded-xl border border-garis bg-permukaan">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-garis bg-latar text-xs uppercase text-teks-lembut">
            <tr>
              <th className="px-4 py-3">Nama Varian</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {initialVarian.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada varian untuk produk ini.
                </td>
              </tr>
            ) : (
              initialVarian.map((v) => (
                <tr key={v.id} className="hover:bg-latar/50">
                  <td className="px-4 py-3 font-semibold">{v.nama_varian}</td>
                  <td className="px-4 py-3">{formatRupiah(v.harga)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleHapus(v.id, v.nama_varian)}
                      disabled={isDeleting}
                      className="rounded border border-garis bg-latar px-2.5 py-1 text-xs font-semibold text-bahaya hover:bg-red-50 disabled:opacity-50"
                    >
                      Hapus
                    </button>
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
