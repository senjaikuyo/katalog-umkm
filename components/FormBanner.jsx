"use client";

import { useActionState } from "react";
import { simpanBannerAction } from "@/app/admin/banner/actions";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function FormBanner() {
  const [state, formAction, isPending] = useActionState(simpanBannerAction, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-5">
      <h2 className="text-base font-bold">Tambah Banner Baru</h2>

      {state?.error && (
        <div className="rounded-lg border border-garis bg-latar p-3 text-xs text-bahaya">
          {state.error}
        </div>
      )}

      {state?.sukses && (
        <div className="rounded-lg border border-garis bg-latar p-3 text-xs text-utama font-semibold">
          {state.sukses}
        </div>
      )}

      <Input label="Judul Banner" name="judul" required placeholder="Promo Spesial Hari Ini!" />
      <Input label="Keterangan / Teks Promo" name="teks" textarea placeholder="Dapatkan diskon untuk semua produk pilihan..." />
      <Input label="URL Gambar (Opsional)" name="gambar_url" placeholder="https://..." />
      <Input label="Tautan / Link Klik (Opsional)" name="tautan" placeholder="/ atau /produk/1" />

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="aktif" defaultChecked className="h-4 w-4 rounded accent-utama" />
        Langsung aktifkan banner di beranda
      </label>

      <Tombol type="submit" disabled={isPending} className="self-start">
        {isPending ? "Menyimpan..." : "Simpan Banner"}
      </Tombol>
    </form>
  );
}

