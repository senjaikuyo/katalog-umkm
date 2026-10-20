"use client";

import { useTransition } from "react";
import Tombol from "@/components/Tombol";
import { hapusProdukAction } from "@/app/admin/actions";

export default function TombolHapusProduk({ id, nama }) {
  const [isPending, startTransition] = useTransition();

  const handleHapus = () => {
    const yakin = window.confirm(`Apakah Anda yakin ingin menghapus produk "${nama}"?`);
    if (!yakin) return;

    startTransition(async () => {
      const hasil = await hapusProdukAction(id);
      if (hasil?.error) {
        alert(hasil.error);
      }
    });
  };

  return (
    <Tombol
      type="button"
      varian="bahaya"
      onClick={handleHapus}
      disabled={isPending}
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </Tombol>
  );
}
