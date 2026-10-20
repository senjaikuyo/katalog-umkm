"use client";

import { useState } from "react";

export default function GaleriFoto({ fotoUtama, fotoUrls = [], namaAlt }) {
  const semuaFoto = fotoUtama
    ? [fotoUtama, ...fotoUrls.filter((f) => f && f !== fotoUtama)]
    : fotoUrls.filter(Boolean);

  const [fotoAktif, setFotoAktif] = useState(semuaFoto[0] || "/produk/kopi.svg");

  if (semuaFoto.length <= 1) {
    return (
      <img
        src={fotoAktif}
        alt={namaAlt}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <img
        src={fotoAktif}
        alt={namaAlt}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      <div className="flex gap-2 overflow-x-auto">
        {semuaFoto.map((foto, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setFotoAktif(foto)}
            className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
              foto === fotoAktif ? "border-utama" : "border-garis hover:border-utama"
            }`}
          >
            <img
              src={foto}
              alt={`Foto ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

