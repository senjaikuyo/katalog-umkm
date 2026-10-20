"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { ubahProdukAction } from "@/app/admin/actions";

export default function FormUbahProduk({ produk }) {
  const [state, formAction, isPending] = useActionState(ubahProdukAction, null);

  return (
    <div className="flex flex-col gap-4">
      {state?.error && (
        <div className="max-w-xl rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      <FormProduk
        produk={produk}
        labelTombol="Simpan perubahan"
        action={formAction}
        isPending={isPending}
      />
    </div>
  );
}
