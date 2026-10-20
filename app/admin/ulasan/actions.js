"use server";

import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function toggleTampilUlasanAction(id, statusSekarang) {
  try {
    const authClient = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Hanya admin yang bisa mengelola ulasan." };
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from("ulasan")
      .update({ ditampilkan: !statusSekarang })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/ulasan");
    return { sukses: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function hapusUlasanAction(id) {
  try {
    const authClient = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Hanya admin yang bisa mengelola ulasan." };
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("ulasan").delete().eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/ulasan");
    return { sukses: true };
  } catch (err) {
    return { error: err.message };
  }
}

