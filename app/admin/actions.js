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

