"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function HalamanBandingkan() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const saved = JSON.parse(localStorage.getItem("bandingkan") || "[]");
      if (saved.length === 0) {
        setProdukList([]);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/produk/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: saved.slice(0, 2) }),
      });
      const data = await res.json();
      setProdukList(data.produk || []);
    } catch {
      setProdukList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const hapusSatu = (id) => {
    const saved = JSON.parse(localStorage.getItem("bandingkan") || "[]");
    const baru = saved.filter((i) => String(i) !== String(id));
    localStorage.setItem("bandingkan", JSON.stringify(baru));
    loadData();
  };

  const hapusSemua = () => {
    localStorage.removeItem("bandingkan");
    setProdukList([]);
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-teks-lembut hover:text-utama">
            ← Kembali ke katalog
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Perbandingan Produk</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Bandingkan detail dan harga hingga 2 produk sekaligus.
          </p>
        </div>
        {produkList.length > 0 && (
          <button
            type="button"
            onClick={hapusSemua}
            className="rounded-lg border border-garis px-3 py-1.5 text-xs font-semibold text-bahaya hover:border-bahaya"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-teks-lembut">Memuat produk perbandingan...</div>
      ) : produkList.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan py-16 text-center">
          <p className="text-base font-semibold text-teks-lembut">
            Belum ada produk yang dipilih untuk dibandingkan.
          </p>
          <p className="mt-1 text-xs text-teks-lembut">
            Pilih "Bandingkan" pada kartu produk di katalog.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-utama underline">
            Jelajahi produk
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[500px] grid-cols-2 gap-6">
            {produkList.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-teks-lembut uppercase">{p.kategori}</span>
                  <button
                    type="button"
                    onClick={() => hapusSatu(p.id)}
                    className="text-xs font-semibold text-bahaya hover:underline"
                  >
                    ✕ Hapus
                  </button>
                </div>

                <img
                  src={p.foto_url}
                  alt={p.nama}
                  className="aspect-square w-full rounded-xl bg-latar object-cover"
                />

                <div>
                  <h2 className="text-xl font-bold">{p.nama}</h2>
                  <p className="mt-1 text-lg font-extrabold text-harga">{formatRupiah(p.harga)}</p>
                </div>

                <div className="border-t border-garis pt-3">
                  <h3 className="text-xs font-bold uppercase text-teks-lembut">Deskripsi</h3>
                  <p className="mt-1 text-sm text-teks-lembut whitespace-pre-line leading-relaxed">
                    {p.deskripsi || "Tidak ada deskripsi."}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(
                    `Halo, saya ingin memesan ${p.nama} seharga ${formatRupiah(p.harga)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center rounded-lg bg-utama py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
                >
                  Pesan via WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

