"use server";

import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function tambahAdminAction(prevState, formData) {
  try {
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !currentUser) {
      return { error: "Akses ditolak: Anda harus login sebagai admin." };
    }

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { error: "Email dan password wajib diisi." };
    }

    if (password.length < 8) {
      return { error: "Password admin minimal 8 karakter." };
    }

    const supabase = createServerClient();
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      return { error: `Gagal membuat admin baru: ${createError.message}` };
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: currentUser.email,
        aksi: "Tambah Admin",
        detail: `Menambahkan akun admin baru: "${email}"`,
      });
    } catch {}

    revalidatePath("/admin/pengguna");
    return { sukses: `Admin "${email}" berhasil ditambahkan.` };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

export async function hapusAdminAction(targetUserId, targetEmail) {
  try {
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !currentUser) {
      return { error: "Akses ditolak: Anda harus login sebagai admin." };
    }

    if (!targetUserId) {
      return { error: "ID admin tidak valid." };
    }

    // Proteksi: Tidak boleh menghapus akun sendiri!
    if (currentUser.id === targetUserId || currentUser.email === targetEmail) {
      return { error: "Anda tidak dapat menghapus akun Anda sendiri." };
    }

    const supabase = createServerClient();
    const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      return { error: `Gagal menghapus admin: ${deleteError.message}` };
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: currentUser.email,
        aksi: "Hapus Admin",
        detail: `Menghapus akun admin: "${targetEmail || targetUserId}"`,
      });
    } catch {}

    revalidatePath("/admin/pengguna");
    return { sukses: true };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}
