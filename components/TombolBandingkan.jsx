"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TombolBandingkan({ produkId }) {
  const router = useRouter();
  const [isBandingkan, setIsBandingkan] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bandingkan") || "[]");
      setIsBandingkan(saved.includes(String(produkId)));
    } catch {}
  }, [produkId]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("bandingkan") || "[]");
      let baru;
      if (saved.includes(String(produkId))) {
        baru = saved.filter((id) => id !== String(produkId));
        setIsBandingkan(false);
      } else {
        if (saved.length >= 2) {
          alert("Maksimal 2 produk untuk dibandingkan. Buka halaman /bandingkan untuk melihat.");
          return;
        }
        baru = [...saved, String(produkId)];
        setIsBandingkan(true);
      }
      localStorage.setItem("bandingkan", JSON.stringify(baru));
      window.dispatchEvent(new Event("bandingkan_updated"));
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${
        isBandingkan
          ? "border-utama bg-utama text-white"
          : "border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
      }`}
      title="Bandingkan produk ini"
    >
      {isBandingkan ? "✓ Banding" : "+ Banding"}
    </button>
  );
}

