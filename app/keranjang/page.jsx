"use client";

import { useKeranjang } from "@/lib/KeranjangContext";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";
import Link from "next/link";

export default function HalamanKeranjang() {
  const { items, ubahJumlah, hapusItem, kosongkanKeranjang, totalHarga } = useKeranjang();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-teks-lembut">Keranjang masih kosong.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-utama underline">
          Lihat produk
        </Link>
      </div>
    );
  }

  const buatPesanWA = () => {
    const baris = items.map(
      (item) => `- ${item.nama} x${item.jumlah} = ${formatRupiah(item.harga * item.jumlah)}`
    );
    return `Halo ${toko.nama}, saya ingin memesan:\n${baris.join("\n")}\n\nTotal: ${formatRupiah(totalHarga)}`;
  };

  const urlWA = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(buatPesanWA())}`;

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Keranjang</h1>
        <button
          type="button"
          onClick={kosongkanKeranjang}
          className="text-sm text-teks-lembut hover:text-bahaya"
        >
          Kosongkan
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-garis bg-permukaan p-3"
          >
            <img
              src={item.foto_url || "/produk/kopi.svg"}
              alt={item.nama}
              className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-snug truncate">{item.nama}</p>
              <p className="text-sm text-teks-lembut">{formatRupiah(item.harga)}/pcs</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => ubahJumlah(item.id, item.jumlah - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-garis text-sm font-bold hover:border-utama"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-bold">{item.jumlah}</span>
              <button
                type="button"
                onClick={() => ubahJumlah(item.id, item.jumlah + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-garis text-sm font-bold hover:border-utama"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right text-sm font-bold text-harga">
              {formatRupiah(item.harga * item.jumlah)}
            </p>
            <button
              type="button"
              onClick={() => hapusItem(item.id)}
              aria-label="Hapus item"
              className="text-teks-lembut hover:text-bahaya"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-garis bg-permukaan p-4">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-extrabold text-harga">{formatRupiah(totalHarga)}</span>
      </div>

      <a
        href={urlWA}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap"
      >
        Pesan semua via WhatsApp
      </a>
    </div>
  );
}

