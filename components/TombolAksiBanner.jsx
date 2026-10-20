"use client";

import { useTransition } from "react";
import { toggleBannerAction, hapusBannerAction } from "@/app/admin/banner/actions";

export default function TombolAksiBanner({ id, aktif }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleBannerAction(id, aktif);
    });
  };

  const handleHapus = () => {
    if (!window.confirm("Hapus banner ini?")) return;
    startTransition(async () => {
      await hapusBannerAction(id);
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        className={`rounded px-2.5 py-1 text-xs font-semibold ${
          aktif
            ? "border border-garis bg-latar text-teks-lembut hover:text-bahaya"
            : "bg-utama text-white hover:bg-utama-gelap"
        }`}
      >
        {isPending ? "..." : aktif ? "Nonaktifkan" : "Aktifkan"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={handleHapus}
        className="rounded border border-garis px-2 py-1 text-xs font-semibold text-bahaya hover:border-bahaya"
      >
        Hapus
      </button>
    </div>
  );
}

