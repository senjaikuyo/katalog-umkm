"use client";

import { useState } from "react";

export default function BagikanProduk({ namaProduk }) {
  const [pesan, setPesan] = useState("");

  const handleBagikan = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: namaProduk, url });
      } catch {
        // user cancel
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setPesan("Link tersalin!");
        setTimeout(() => setPesan(""), 2500);
      } catch {
        setPesan("Gagal menyalin link");
        setTimeout(() => setPesan(""), 2500);
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleBagikan}
        className="inline-flex items-center gap-2 rounded-lg border border-garis bg-permukaan px-4 py-2 text-sm font-semibold text-teks hover:border-utama hover:text-utama"
      >
        🔗 Bagikan
      </button>
      {pesan && <span className="text-sm text-utama">{pesan}</span>}
    </div>
  );
}

