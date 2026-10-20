"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { tambahProdukAction } from "@/app/admin/actions";

export default function FormTambahProduk({ daftarKategori = [] }) {
  const [state, formAction, isPending] = useActionState(tambahProdukAction, null);

  return (
    <div className="flex flex-col gap-4">
      {state?.error && (
        <div className="max-w-xl rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      <FormProduk
        labelTombol="Simpan produk"
        action={formAction}
        isPending={isPending}
        daftarKategori={daftarKategori}
        state={state}
      />
    </div>
  );
}
