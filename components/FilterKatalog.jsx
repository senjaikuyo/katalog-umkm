"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterKatalog({ daftarKategori = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const kategoriAktif = searchParams.get("kategori") || "Semua";
  const [kataKunci, setKataKunci] = useState(searchParams.get("q") || "");

  const updateFilter = (kategori, q) => {
    const params = new URLSearchParams();
    if (kategori && kategori !== "Semua") {
      params.set("kategori", kategori);
    }
    if (q && q.trim()) {
      params.set("q", q.trim());
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  const handleCari = (e) => {
    e.preventDefault();
    updateFilter(kategoriAktif, kataKunci);
  };

  const handlePilihKategori = (kategori) => {
    updateFilter(kategori, kataKunci);
  };

  const handleReset = () => {
    setKataKunci("");
    router.push("/");
  };

  const adaFilter = kategoriAktif !== "Semua" || (searchParams.get("q") && searchParams.get("q").trim());

  return (
    <div className="flex flex-col gap-4">
      {/* Form Pencarian */}
      <form onSubmit={handleCari} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-latar px-4 py-2.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-utama px-5 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
        >
          Cari
        </button>
        {adaFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks-lembut hover:text-teks"
          >
            Reset
          </button>
        )}
      </form>

      {/* Filter Kategori */}
      {daftarKategori.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {daftarKategori.map((kategori) => {
            const aktif = kategori === kategoriAktif;
            return (
              <button
                key={kategori}
                type="button"
                onClick={() => handlePilihKategori(kategori)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  aktif
                    ? "bg-utama text-white"
                    : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-teks"
                }`}
              >
                {kategori}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
