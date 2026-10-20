"use client";

import { useActionState } from "react";
import { simpanPengaturanAction } from "@/app/admin/pengaturan/actions";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function FormPengaturan({ settingAwal = {} }) {
  const [state, formAction, isPending] = useActionState(simpanPengaturanAction, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-6">
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

      <Input label="Nama Toko" name="nama" defaultValue={settingAwal.nama} required />
      <Input
        label="Nomor WhatsApp (dengan kode negara, misal: 628123456789)"
        name="nomor_wa"
        defaultValue={settingAwal.nomor_wa}
        required
      />
      <Input label="Jam Buka" name="jam_buka" defaultValue={settingAwal.jam_buka} />
      <Input label="Alamat Toko" name="alamat" textarea defaultValue={settingAwal.alamat} />

      <Tombol type="submit" disabled={isPending} className="self-start">
        {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
      </Tombol>
    </form>
  );
}

