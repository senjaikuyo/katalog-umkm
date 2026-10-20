"use client";

import { createContext, useContext, useState, useEffect } from "react";

const KeranjangContext = createContext(null);

export function KeranjangProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load dari localStorage saat mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("keranjang");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  }, []);

  // Simpan ke localStorage setiap kali items berubah
  useEffect(() => {
    try {
      localStorage.setItem("keranjang", JSON.stringify(items));
    } catch {}
  }, [items]);

  const tambahItem = (produk) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === produk.id);
      if (existing) {
        return prev.map((item) =>
          item.id === produk.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga_diskon || produk.harga,
          foto_url: produk.foto_url,
          jumlah: 1,
        },
      ];
    });
  };

  const ubahJumlah = (id, jumlah) => {
    if (jumlah <= 0) {
      hapusItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, jumlah } : item))
    );
  };

  const hapusItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const kosongkanKeranjang = () => setItems([]);

  const totalItem = items.reduce((s, i) => s + i.jumlah, 0);
  const totalHarga = items.reduce((s, i) => s + i.harga * i.jumlah, 0);

  return (
    <KeranjangContext.Provider
      value={{ items, tambahItem, ubahJumlah, hapusItem, kosongkanKeranjang, totalItem, totalHarga }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const ctx = useContext(KeranjangContext);
  if (!ctx) throw new Error("useKeranjang harus dipakai di dalam KeranjangProvider");
  return ctx;
}

