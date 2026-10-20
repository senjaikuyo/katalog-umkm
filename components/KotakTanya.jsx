"use client";

import { useState, useRef } from "react";

const MAX_PERTANYAAN = 300;
const MAX_PER_MENIT = 5;

export default function KotakTanya({ produk }) {
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const riwayat = useRef([]); // timestamps pertanyaan

  const handleTanya = async (e) => {
    e.preventDefault();
    const teks = pertanyaan.trim();
    if (!teks) return;

    // Rate limiting sederhana: max 5 per menit
    const sekarang = Date.now();
    riwayat.current = riwayat.current.filter((t) => sekarang - t < 60000);
    if (riwayat.current.length >= MAX_PER_MENIT) {
      setError("Terlalu banyak pertanyaan. Tunggu beberapa saat.");
      return;
    }
    riwayat.current.push(sekarang);

    setLoading(true);
    setError("");
    setJawaban("");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/tanya-produk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pertanyaan: teks,
          produk: {
            nama: produk.nama,
            kategori: produk.kategori,
            harga: produk.harga,
            deskripsi: produk.deskripsi,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Permintaan gagal");
      }

      const data = await res.json();
      setJawaban(data.jawaban || "Tidak ada jawaban.");
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Waktu habis. Coba lagi.");
      } else {
        setError(err.message || "Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-garis bg-permukaan p-4">
      <h3 className="mb-3 font-semibold">🤖 Tanya AI tentang produk ini</h3>
      <form onSubmit={handleTanya} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value.slice(0, MAX_PERTANYAAN))}
            rows={2}
            placeholder="Contoh: Apakah produk ini cocok untuk anak-anak?"
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <span className="absolute bottom-2 right-2 text-[10px] text-teks-lembut">
            {pertanyaan.length}/{MAX_PERTANYAAN}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading || !pertanyaan.trim()}
          className="rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap disabled:opacity-50"
        >
          {loading ? "Menanyakan..." : "Tanya"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-bahaya">{error}</p>}
      {jawaban && (
        <div className="mt-3 rounded-lg bg-latar p-3 text-sm text-teks">
          <p className="whitespace-pre-wrap">{jawaban}</p>
        </div>
      )}
    </div>
  );
}

