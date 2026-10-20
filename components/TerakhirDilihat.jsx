"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function TerakhirDilihat({ excludeId }) {
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        let saved = JSON.parse(localStorage.getItem("terakhir_dilihat") || "[]");
        if (excludeId) {
          saved = saved.filter((id) => String(id) !== String(excludeId));
        }
        if (saved.length === 0) return;

        const res = await fetch("/api/produk/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: saved.slice(0, 4) }),
        });
        const data = await res.json();
        setProdukList(data.produk || []);
      } catch {}
    }

    load();
  }, [excludeId]);

  if (produkList.length === 0) return null;

  return (
    <section className="mt-12 flex flex-col gap-4 border-t border-garis pt-8">
      <h2 className="text-xl font-bold">Terakhir Dilihat</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {produkList.map((p) => (
          <KartuProduk key={p.id} produk={p} />
        ))}
      </div>
    </section>
  );
}

