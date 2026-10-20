"use client";

import { useTransition } from "react";
import { toggleTampilUlasanAction, hapusUlasanAction } from "@/app/admin/ulasan/actions";

export default function TombolAksiUlasan({ id, ditampilkan }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTampilUlasanAction(id, ditampilkan);
    });
  };

  const handleHapus = () => {
    if (!window.confirm("Yakin ingin menghapus ulasan ini?")) return;
    startTransition(async () => {
      await hapusUlasanAction(id);
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        className={`rounded px-2.5 py-1 text-xs font-semibold ${
          ditampilkan
            ? "border border-garis bg-permukaan text-teks-lembut hover:text-bahaya"
            : "bg-utama text-white hover:bg-utama-gelap"
        }`}
      >
        {isPending ? "..." : ditampilkan ? "Sembunyikan" : "Tampilkan"}
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

