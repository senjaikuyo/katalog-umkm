"use client";

import { useState, useEffect } from "react";

export default function TombolFavorit({ produkId, kecil = false }) {
  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("favorit") || "[]");
      setIsFavorit(saved.includes(produkId));
    } catch {
      setIsFavorit(false);
    }
  }, [produkId]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("favorit") || "[]");
      let baru;
      if (saved.includes(produkId)) {
        baru = saved.filter((id) => id !== produkId);
      } else {
        baru = [...saved, produkId];
      }
      localStorage.setItem("favorit", JSON.stringify(baru));
      setIsFavorit(!isFavorit);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFavorit ? "Hapus dari favorit" : "Tambah ke favorit"}
      className={`flex-shrink-0 rounded-full transition-colors hover:scale-110 ${
        kecil ? "p-1 text-base" : "p-2 text-xl"
      } ${isFavorit ? "text-red-500" : "text-teks-lembut hover:text-red-400"}`}
    >
      {isFavorit ? "❤️" : "🤍"}
    </button>
  );
}

