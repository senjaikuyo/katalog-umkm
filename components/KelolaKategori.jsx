"use client";

import { useState, useTransition, useActionState } from "react";
import Link from "next/link";
import {
  tambahKategoriAction,
  ubahKategoriAction,
  hapusKategoriAction,
} from "@/app/admin/kategori/actions";

export default function KelolaKategori({ initialKategori = [] }) {
  const [tambahState, formTambahAction, isTambahPending] = useActionState(
    tambahKategoriAction,
    null
  );
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pesanError, setPesanError] = useState(null);

  const handleMulaiUbah = (kat) => {
    setEditId(kat.id);
    setEditNama(kat.nama);
    setPesanError(null);
  };

  const handleBatalUbah = () => {
    setEditId(null);
    setEditNama("");
  };

  const handleHapus = (id, nama) => {
    if (!confirm(`Hapus kategori "${nama}"?`)) return;
    setPesanError(null);
    startTransition(async () => {
      const res = await hapusKategoriAction(id, nama);
      if (res?.error) {
        setPesanError(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form Tambah Kategori */}
      <div className="rounded-xl border border-garis bg-permukaan p-5">
        <h2 className="text-base font-bold text-teks">Tambah Kategori Baru</h2>
        <form action={formTambahAction} className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            name="nama"
            placeholder="Contoh: Aksesoris, Makanan Ringan"
            required
            className="flex-1 min-w-[240px] rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <button
            type="submit"
            disabled={isTambahPending}
            className="rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap disabled:opacity-50"
          >
            {isTambahPending ? "Menyimpan..." : "+ Tambah Kategori"}
          </button>
        </form>
        {tambahState?.error && (
          <p className="mt-2 text-xs font-semibold text-bahaya">{tambahState.error}</p>
        )}
        {tambahState?.sukses && (
          <p className="mt-2 text-xs font-semibold text-green-600">{tambahState.sukses}</p>
        )}
      </div>

      {pesanError && (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm font-semibold text-bahaya">
          {pesanError}
        </div>
      )}

      {/* Tabel Kategori */}
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
            {initialKategori.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada kategori terdaftar.
                </td>
              </tr>
            ) : (
              initialKategori.map((kat) => (
                <tr key={kat.id} className="hover:bg-latar/50">
                  <td className="px-4 py-3 font-semibold">
                    {editId === kat.id ? (
                      <form
                        action={async (formData) => {
                          startTransition(async () => {
                            const res = await ubahKategoriAction(null, formData);
                            if (res?.error) {
                              setPesanError(res.error);
                            } else {
                              setEditId(null);
                            }
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="id" value={kat.id} />
                        <input type="hidden" name="nama_lama" value={kat.nama} />
                        <input
                          type="text"
                          name="nama_baru"
                          value={editNama}
                          onChange={(e) => setEditNama(e.target.value)}
                          className="rounded border border-utama bg-latar px-2 py-1 text-sm text-teks focus:outline-none"
                          required
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={isPending}
                          className="rounded bg-utama px-2.5 py-1 text-xs font-semibold text-white hover:bg-utama-gelap"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={handleBatalUbah}
                          className="rounded border border-garis px-2 py-1 text-xs font-semibold text-teks-lembut hover:text-teks"
                        >
                          Batal
                        </button>
                      </form>
                    ) : (
                      <span>{kat.nama}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-utama/10 px-2.5 py-0.5 text-xs font-bold text-utama">
                      {kat.jumlah || 0} produk
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/?kategori=${encodeURIComponent(kat.nama)}`}
                        target="_blank"
                        className="text-xs font-semibold text-teks-lembut hover:text-utama"
                      >
                        Lihat ↗
                      </Link>
                      {editId !== kat.id && (
                        <button
                          type="button"
                          onClick={() => handleMulaiUbah(kat)}
                          className="rounded border border-garis bg-latar px-2.5 py-1 text-xs font-semibold text-teks hover:border-utama"
                        >
                          Ubah
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleHapus(kat.id, kat.nama)}
                        disabled={isPending}
                        className="rounded border border-garis bg-latar px-2.5 py-1 text-xs font-semibold text-bahaya hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
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
