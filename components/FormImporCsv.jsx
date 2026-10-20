"use client";

import { useActionState } from "react";
import { imporCsvAction } from "@/app/admin/impor/actions";
import Tombol from "@/components/Tombol";

export default function FormImporCsv() {
  const [state, formAction, isPending] = useActionState(imporCsvAction, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-6">
      {state?.error && (
        <div className="rounded-lg border border-garis bg-latar p-3 text-xs text-bahaya">
          {state.error}
        </div>
      )}

      {state?.suksesCount !== undefined && (
        <div className="flex flex-col gap-2 rounded-lg border border-garis bg-latar p-4 text-sm">
          <p className="font-bold text-utama">
            ✓ Berhasil mengimpor {state.suksesCount} produk!
          </p>
          {state.gagalCount > 0 && (
            <p className="font-semibold text-bahaya">
              ⚠️ {state.gagalCount} baris gagal/dilewati karena tidak valid:
            </p>
          )}
          {state.errors?.length > 0 && (
            <ul className="list-inside list-disc text-xs text-teks-lembut">
              {state.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold">Pilih File CSV</label>
        <p className="mt-0.5 text-xs text-teks-lembut">
          Format kolom: Nama, Harga, Kategori, Deskripsi, Foto URL
        </p>
        <input
          type="file"
          name="file_csv"
          accept=".csv,text/csv"
          required
          className="mt-2 block w-full text-sm text-teks-lembut file:mr-4 file:rounded-lg file:border-0 file:bg-utama file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-utama-gelap"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Mengunggah & Memproses..." : "Mulai Impor Produk"}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Kembali
        </Tombol>
      </div>
    </form>
  );
}

