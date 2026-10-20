"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function tambahUlasanAction(formData) {
  const produk_id = formData.get("produk_id");
  const nama = formData.get("nama")?.toString().trim();
  const rating = parseInt(formData.get("rating") || "5", 10);
  const komentar = formData.get("komentar")?.toString().trim() || null;

  if (!produk_id || !nama) {
    return { error: "Nama wajib diisi." };
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Rating harus antara 1 dan 5." };
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("ulasan").insert({
      produk_id: parseInt(produk_id, 10),
      nama,
      rating,
      komentar,
      ditampilkan: false, // moderasi dulu
    });

    if (error) {
      return { error: `Gagal menyimpan ulasan: ${error.message}` };
    }

    return { sukses: true };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

export async function catatKlikWAAction(produkId) {
  try {
    const supabase = createServerClient();
    await supabase.from("klik_wa").insert({
      produk_id: parseInt(produkId, 10),
    });
  } catch {
    // Abaikan error, jangan blokir user
  }
}

