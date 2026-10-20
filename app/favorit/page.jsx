"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";

export default function HalamanFavorit() {
  const [daftarProduk, setDaftarProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorit() {
      try {
        const saved = JSON.parse(localStorage.getItem("favorit") || "[]");
        if (saved.length === 0) {
          setDaftarProduk([]);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/produk/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: saved }),
        });
        const data = await res.json();
        setDaftarProduk(data.produk || []);
      } catch {
        setDaftarProduk([]);
      } finally {
        setLoading(false);
      }
    }

    loadFavorit();
  }, []);

  return (
    <div className="flex flex-col gap-6 py-8">
      <div>
        <Link href="/" className="text-sm text-teks-lembut hover:text-utama">
          ← Kembali ke katalog
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Produk Favorit</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Daftar produk yang Anda simpan di perangkat ini.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-teks-lembut">Memuat produk favorit...</div>
      ) : daftarProduk.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan py-16 text-center">
          <p className="text-base font-semibold text-teks-lembut">Belum ada produk favorit.</p>
          <Link href="/" className="mt-3 inline-block text-sm font-semibold text-utama underline">
            Jelajahi katalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {daftarProduk.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

