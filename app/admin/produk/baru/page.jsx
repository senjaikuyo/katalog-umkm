"use client";

import { useActionState } from "react";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProdukAction } from "@/app/admin/actions";

// US-08: tambah produk baru dari halaman admin
export default function HalamanTambahProduk() {
  const [state, formAction, isPending] = useActionState(tambahProdukAction, null);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>

      {state?.error && (
        <div className="max-w-xl rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      <FormProduk
        labelTombol="Simpan produk"
        action={formAction}
        isPending={isPending}
      />
    </div>
  );
}
