"use server";

import { redirect } from "next/navigation";
import { createAdminAuthClient } from "@/lib/supabase/server";

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createAdminAuthClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      return { error: "Email atau password salah." };
    }
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }

  redirect("/admin");
}

export async function logoutAction() {
  try {
    const supabase = await createAdminAuthClient();
    await supabase.auth.signOut();
  } catch (err) {
    // Tetap lanjut redirect jika ada kendala
  }

  redirect("/admin/login");
}

export async function gantiPasswordAction(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  try {
    const supabase = await createAdminAuthClient();

    // Pastikan user sedang login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi telah berakhir. Silakan login kembali." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      return { error: `Gagal mengganti password: ${error.message}` };
    }

    return { sukses: "Password berhasil diganti." };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}
