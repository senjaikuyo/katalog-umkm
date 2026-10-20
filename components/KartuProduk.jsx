"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { useKeranjang } from "@/lib/KeranjangContext";
import TombolFavorit from "@/components/TombolFavorit";
import TombolBandingkan from "@/components/TombolBandingkan";

export default function KartuProduk({ produk }) {
  const { tambahItem } = useKeranjang();
  const habis = produk.stok === 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar">
      <Link href={`/produk/${produk.id}`} className="relative block">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full bg-permukaan object-cover"
        />
        {/* US-20: Badge */}
        {produk.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-utama px-2 py-0.5 text-[10px] font-bold text-white">
            {produk.badge}
          </span>
        )}
        {/* US-19: Stok habis */}
        {habis && (
          <span className="absolute right-2 top-2 rounded-full bg-bahaya px-2 py-0.5 text-[10px] font-bold text-white">
            Habis
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1">
            {produk.kategori && (
              <Link
                href={`/kategori/${encodeURIComponent(produk.kategori)}`}
                className="text-xs text-teks-lembut hover:text-utama hover:underline"
              >
                {produk.kategori}
              </Link>
            )}
            <Link href={`/produk/${produk.id}`}>
              <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
            </Link>
          </div>
          <div className="flex flex-col items-end gap-1">
            <TombolFavorit produkId={String(produk.id)} kecil />
            <TombolBandingkan produkId={produk.id} />
          </div>
        </div>

        {/* US-20: Harga diskon */}
        <div className="mt-auto flex items-center gap-2">
          {produk.harga_diskon ? (
            <>
              <span className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
                {formatRupiah(produk.harga_diskon)}
              </span>
              <span className="text-xs text-teks-lembut line-through">{formatRupiah(produk.harga)}</span>
            </>
          ) : (
            <span className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
              {formatRupiah(produk.harga)}
            </span>
          )}
        </div>

        {/* US-21: Tambah ke keranjang */}
        {!habis && (
          <button
            type="button"
            onClick={() => tambahItem(produk)}
            className="mt-1 w-full rounded-lg border border-garis bg-permukaan py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
          >
            + Keranjang
          </button>
        )}
      </div>
    </div>
  );
}
