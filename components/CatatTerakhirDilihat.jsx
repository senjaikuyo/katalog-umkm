"use client";

import { useEffect } from "react";

export default function CatatTerakhirDilihat({ produkId }) {
  useEffect(() => {
    if (!produkId) return;
    try {
      const saved = JSON.parse(localStorage.getItem("terakhir_dilihat") || "[]");
      const filtered = saved.filter((id) => String(id) !== String(produkId));
      const baru = [String(produkId), ...filtered].slice(0, 8);
      localStorage.setItem("terakhir_dilihat", JSON.stringify(baru));
    } catch {}
  }, [produkId]);

  return null;
}

