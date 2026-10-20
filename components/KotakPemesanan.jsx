"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

import { useKeranjang } from "@/lib/KeranjangContext";
import { catatKlikWAAction } from "@/app/produk/actions";

// US-12: Pengunjung memilih jumlah dan varian sebelum memesan via WhatsApp
export default function KotakPemesanan({ produk, daftarVarian = [], habis = false }) {
  const { tambahItem } = useKeranjang();
  const [jumlah, setJumlah] = useState(1);
  const [varianTerpilih, setVarianTerpilih] = useState(
    daftarVarian.length > 0 ? daftarVarian[0] : null
  );

  const kurangiJumlah = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
    }
  };

  const tambahJumlah = () => {
    setJumlah(jumlah + 1);
  };

  const hargaSatuan = varianTerpilih?.harga ?? (produk.harga_diskon || produk.harga);
  const totalHarga = hargaSatuan * jumlah;

  // Format pesan WhatsApp lengkap dengan jumlah & varian
  const namaVarian = varianTerpilih
    ? typeof varianTerpilih === "object"
      ? varianTerpilih.nama || varianTerpilih.nama_varian
      : varianTerpilih
    : null;
  const bagianVarian = namaVarian ? ` (Varian: ${namaVarian})` : "";
  const teksPesan = `Halo ${toko.nama}, saya ingin memesan ${produk.nama}${bagianVarian} sebanyak ${jumlah} buah. Total: ${formatRupiah(totalHarga)}.`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teksPesan)}`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-garis bg-permukaan p-4">
      {/* Pilihan Varian jika tersedia */}
      {daftarVarian.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pilih-varian" className="text-xs font-semibold text-teks-lembut">
            Pilih Varian
          </label>
          <select
            id="pilih-varian"
            value={typeof varianTerpilih === "object" ? varianTerpilih?.id : varianTerpilih}
            onChange={(e) => {
              const terpilih = daftarVarian.find(
                (v) => (typeof v === "object" ? String(v.id) : String(v)) === e.target.value
              );
              setVarianTerpilih(terpilih || null);
            }}
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
          >
            {daftarVarian.map((v) => {
              const namaLabel = typeof v === "object" ? (v.nama || v.nama_varian) : v;
              const label = typeof v === "object" ? `${namaLabel} - ${formatRupiah(v.harga)}` : v;
              const val = typeof v === "object" ? v.id : v;
              return (
                <option key={val} value={val}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Pilihan Jumlah */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-teks">Jumlah</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={kurangiJumlah}
            disabled={jumlah <= 1}
            aria-label="Kurangi jumlah"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks hover:bg-permukaan disabled:opacity-40"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-teks">{jumlah}</span>
          <button
            type="button"
            onClick={tambahJumlah}
            aria-label="Tambah jumlah"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks hover:bg-permukaan"
          >
            +
          </button>
        </div>
      </div>

      {/* Ringkasan Total */}
      <div className="flex items-center justify-between border-t border-garis pt-3">
        <span className="text-xs text-teks-lembut">Total perkiraan:</span>
        <span className="text-lg font-bold text-utama">{formatRupiah(totalHarga)}</span>
      </div>

      {/* Tombol Pesan WhatsApp & Keranjang */}
      {habis ? (
        <button
          type="button"
          disabled
          className="inline-flex w-full items-center justify-center rounded-lg bg-garis px-5 py-3 font-semibold text-teks-lembut cursor-not-allowed"
        >
          Stok Habis
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => catatKlikWAAction(produk.id)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap"
          >
            Pesan via WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              for (let i = 0; i < jumlah; i++) {
                tambahItem(produk);
              }
            }}
            className="inline-flex w-full items-center justify-center rounded-lg border border-garis bg-latar px-5 py-2.5 text-sm font-semibold text-teks hover:border-utama hover:text-utama"
          >
            + Tambah ke Keranjang
          </button>
        </div>
      )}
    </div>
  );
}
