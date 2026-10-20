"use client";

import { useTransition } from "react";
import { toggleAktifProdukAction } from "@/app/admin/actions";

export default function TombolStatusProduk({ id, aktif = true }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleAktifProdukAction(id, !aktif);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={aktif ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
        aktif
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {isPending ? "..." : aktif ? "Aktif" : "Nonaktif"}
    </button>
  );
}
