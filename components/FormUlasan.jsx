"use client";

import { useState } from "react";
import { tambahUlasanAction } from "@/app/produk/actions";

export default function FormUlasan({ produkId }) {
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    formData.set("produk_id", produkId);
    formData.set("rating", String(rating));
    const res = await tambahUlasanAction(formData);
    setHasil(res);
    setLoading(false);
    if (res?.sukses) {
      e.target.reset();
      setRating(5);
    }
  };

  return (
    <div className="rounded-xl border border-garis bg-permukaan p-4">
      <h3 className="mb-3 font-semibold">Tulis Ulasan</h3>
      {hasil?.sukses ? (
        <p className="text-sm text-utama">Terima kasih! Ulasan Anda sedang menunggu moderasi.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {hasil?.error && (
            <p className="rounded-lg bg-red-50 p-2 text-sm text-bahaya">{hasil.error}</p>
          )}
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Nama
            <input
              name="nama"
              required
              maxLength={100}
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
              placeholder="Nama Anda"
            />
          </label>
          <div className="flex flex-col gap-1 text-sm font-semibold">
            <span>Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`text-xl ${r <= rating ? "text-yellow-400" : "text-garis"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Komentar (opsional)
            <textarea
              name="komentar"
              rows={3}
              maxLength={500}
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
              placeholder="Tulis pengalaman Anda..."
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </form>
      )}
    </div>
  );
}

