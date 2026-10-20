"use server";

import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function tambahKategoriAction(prevState, formData) {
  try {
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Anda harus login sebagai admin." };
    }

    const nama = formData.get("nama")?.toString().trim();
    if (!nama) {
      return { error: "Nama kategori wajib diisi." };
    }

    const slug = nama
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const supabase = createServerClient();
    const { error: insertError } = await supabase.from("kategori").insert({
      nama,
      slug: slug || "kategori",
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return { error: `Kategori "${nama}" sudah terdaftar.` };
      }
      return { error: `Gagal menambah kategori: ${insertError.message}` };
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Tambah Kategori",
        detail: `Menambah kategori "${nama}"`,
      });
    } catch {}

    revalidatePath("/admin/kategori");
    revalidatePath("/admin/produk/baru");
    revalidatePath("/");
    return { sukses: `Kategori "${nama}" berhasil ditambahkan.` };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

export async function ubahKategoriAction(prevState, formData) {
  try {
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Anda harus login sebagai admin." };
    }

    const id = formData.get("id")?.toString().trim();
    const namaLama = formData.get("nama_lama")?.toString().trim();
    const namaBaru = formData.get("nama_baru")?.toString().trim();

    if (!id || !namaBaru) {
      return { error: "Nama kategori baru wajib diisi." };
    }

    const slugBaru = namaBaru
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const supabase = createServerClient();
    const { error: updateError } = await supabase
      .from("kategori")
      .update({
        nama: namaBaru,
        slug: slugBaru || "kategori",
      })
      .eq("id", id);

    if (updateError) {
      return { error: `Gagal mengubah kategori: ${updateError.message}` };
    }

    // Perbarui produk yang memakai kategori lama
    if (namaLama && namaLama !== namaBaru) {
      await supabase
        .from("produk")
        .update({ kategori: namaBaru })
        .eq("kategori", namaLama);
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Ubah Kategori",
        detail: `Mengubah kategori "${namaLama}" menjadi "${namaBaru}"`,
      });
    } catch {}

    revalidatePath("/admin/kategori");
    revalidatePath("/admin/produk/baru");
    revalidatePath("/");
    return { sukses: `Kategori berhasil diubah menjadi "${namaBaru}".` };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

export async function hapusKategoriAction(id, nama) {
  try {
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Anda harus login sebagai admin." };
    }

    if (!id || !nama) {
      return { error: "Data kategori tidak valid." };
    }

    const supabase = createServerClient();

    // Periksa apakah kategori masih dipakai oleh produk
    const { count, error: countError } = await supabase
      .from("produk")
      .select("id", { count: "exact", head: true })
      .eq("kategori", nama);

    if (countError) {
      return { error: `Gagal memeriksa pemakaian kategori: ${countError.message}` };
    }

    if (count && count > 0) {
      return {
        error: `Kategori "${nama}" tidak dapat dihapus karena masih digunakan oleh ${count} produk. Ubah atau hapus produk terkait terlebih dahulu.`,
      };
    }

    const { error: deleteError } = await supabase
      .from("kategori")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { error: `Gagal menghapus kategori: ${deleteError.message}` };
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Hapus Kategori",
        detail: `Menghapus kategori "${nama}"`,
      });
    } catch {}

    revalidatePath("/admin/kategori");
    revalidatePath("/admin/produk/baru");
    revalidatePath("/");
    return { sukses: true };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

