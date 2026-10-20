"use server";

import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function tambahVarianAction(prevState, formData) {
  try {
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Anda harus login sebagai admin." };
    }

    const produkId = formData.get("produk_id")?.toString().trim();
    const namaVarian = formData.get("nama_varian")?.toString().trim();
    const hargaStr = formData.get("harga")?.toString().trim();

    if (!produkId) {
      return { error: "ID produk tidak valid." };
    }

    if (!namaVarian) {
      return { error: "Nama varian wajib diisi (misal: Ukuran S, 250 gram)." };
    }

    const harga = parseInt(hargaStr, 10);
    if (isNaN(harga) || harga < 0) {
      return { error: "Harga varian harus berupa angka 0 atau lebih." };
    }

    const supabase = createServerClient();
    const { error: insertError } = await supabase.from("varian_produk").insert({
      produk_id: parseInt(produkId, 10),
      nama_varian: namaVarian,
      harga,
    });

    if (insertError) {
      return { error: `Gagal menambah varian: ${insertError.message}` };
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Tambah Varian Produk",
        detail: `Menambah varian "${namaVarian}" (Rp ${harga}) pada produk ID ${produkId}`,
      });
    } catch {}

    revalidatePath(`/admin/produk/${produkId}/varian`);
    revalidatePath(`/produk/${produkId}`);
    return { sukses: `Varian "${namaVarian}" berhasil ditambahkan.` };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

export async function hapusVarianAction(id, produkId) {
  try {
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Anda harus login sebagai admin." };
    }

    if (!id) {
      return { error: "ID varian tidak valid." };
    }

    const supabase = createServerClient();
    const { error: deleteError } = await supabase
      .from("varian_produk")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { error: `Gagal menghapus varian: ${deleteError.message}` };
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Hapus Varian Produk",
        detail: `Menghapus varian ID ${id} pada produk ID ${produkId}`,
      });
    } catch {}

    revalidatePath(`/admin/produk/${produkId}/varian`);
    revalidatePath(`/produk/${produkId}`);
    return { sukses: true };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}
