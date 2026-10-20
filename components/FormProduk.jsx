"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({
  produk = {},
  labelTombol,
  action,
  isPending = false,
  tombolTambahan = null,
}) {
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const nama = document.querySelector('input[name="nama"]')?.value;
    const kategori = document.querySelector('input[name="kategori"]')?.value;
    if (!nama || !kategori) {
      alert("Isi nama dan kategori terlebih dahulu");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, kategori }),
      });
      const data = await res.json();
      if (data.description) {
        setDeskripsi(data.description);
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      alert("Gagal generate deskripsi");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {produk?.id && <input type="hidden" name="id" value={produk.id} />}
      <Input label="Nama produk" name="nama" defaultValue={produk.nama} required />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input label="Kategori" name="kategori" defaultValue={produk.kategori} />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />
      <div className="flex flex-col gap-1.5 text-sm font-semibold">
        <div className="flex items-center justify-between">
          <label htmlFor="deskripsi-input">Deskripsi</label>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg border border-garis bg-permukaan px-3 py-1 text-xs font-semibold text-teks-lembut hover:border-utama hover:text-utama disabled:opacity-50"
          >
            {generating ? "Membuat..." : "✨ Buat deskripsi AI"}
          </button>
        </div>
        <textarea
          id="deskripsi-input"
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>
      {tombolTambahan}
      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
