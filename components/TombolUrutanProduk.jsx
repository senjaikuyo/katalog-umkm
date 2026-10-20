"use client";

import { useTransition } from "react";
import { ubahUrutanProdukAction } from "@/app/admin/actions";

export default function TombolUrutanProduk({ id, urutan = 0 }) {
  const [isPending, startTransition] = useTransition();

  const handleUbahUrutan = (delta) => {
    startTransition(async () => {
      const res = await ubahUrutanProdukAction(id, delta);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="w-6 text-center font-mono text-xs font-semibold text-teks-lembut">
        {urutan}
      </span>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => handleUbahUrutan(-1)}
          disabled={isPending}
          title="Naikkan prioritas (urutan lebih kecil)"
          aria-label="Naikkan urutan"
          className="rounded px-1 text-[10px] font-bold text-teks-lembut hover:bg-permukaan hover:text-utama disabled:opacity-30"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => handleUbahUrutan(1)}
          disabled={isPending}
          title="Turunkan prioritas (urutan lebih besar)"
          aria-label="Turunkan urutan"
          className="rounded px-1 text-[10px] font-bold text-teks-lembut hover:bg-permukaan hover:text-utama disabled:opacity-30"
        >
          ▼
        </button>
      </div>
    </div>
  );
}

