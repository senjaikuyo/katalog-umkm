"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toko } from "@/lib/toko";
import { useKeranjang } from "@/lib/KeranjangContext";

export default function Header() {
  const { totalItem } = useKeranjang();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const tersimpan = localStorage.getItem("tema");
    if (tersimpan === "dark" || (!tersimpan && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-garis bg-latar/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/tentang" className="text-teks-lembut hover:text-utama">
            Tentang
          </Link>
          <Link href="/favorit" className="text-teks-lembut hover:text-utama" title="Favorit">
            ❤️ Favorit
          </Link>
          <Link
            href="/keranjang"
            className="flex items-center gap-1.5 rounded-lg bg-utama px-3 py-1.5 text-xs text-white hover:bg-utama-gelap"
          >
            <span>🛒</span>
            <span>Keranjang</span>
            {totalItem > 0 && (
              <span className="ml-1 rounded-full bg-white px-1.5 py-0.2 text-[10px] font-extrabold text-utama">
                {totalItem}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Ganti mode gelap/terang"
            className="rounded-lg border border-garis p-1.5 text-xs hover:border-utama"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
