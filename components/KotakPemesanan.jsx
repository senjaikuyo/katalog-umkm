"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

// US-12: Pengunjung memilih jumlah dan varian sebelum memesan via WhatsApp
export default function KotakPemesanan({ produk, daftarVarian = [] }) {
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

  const hargaSatuan = varianTerpilih?.harga ?? produk.harga;
  const totalHarga = hargaSatuan * jumlah;

  // Format pesan WhatsApp lengkap dengan jumlah & varian
  const bagianVarian = varianTerpilih ? ` (Varian: ${varianTerpilih.nama_varian || varianTerpilih})` : "";
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
                (v) => (typeof v === "object" ? String(v.id) : v) === e.target.value
              );
              setVarianTerpilih(terpilih || null);
            }}
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
          >
            {daftarVarian.map((v) => {
              const label = typeof v === "object" ? `${v.nama_varian} - ${formatRupiah(v.harga)}` : v;
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

      {/* Tombol Pesan WhatsApp */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
