"use server";

import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function simpanBannerAction(prevState, formData) {
  try {
    const authClient = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Hanya admin yang bisa mengelola banner." };
    }

    const judul = formData.get("judul")?.toString().trim();
    const teks = formData.get("teks")?.toString().trim();
    const gambar_url = formData.get("gambar_url")?.toString().trim() || null;
    const tautan = formData.get("tautan")?.toString().trim() || null;
    const aktif = formData.get("aktif") === "on";

    if (!judul) return { error: "Judul banner wajib diisi." };

    const supabase = createServerClient();
    const { error } = await supabase.from("banner").insert({
      judul,
      teks,
      gambar_url,
      tautan,
      aktif,
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/banner");
    revalidatePath("/");
    return { sukses: "Banner berhasil ditambahkan." };
  } catch (err) {
    return { error: err.message };
  }
}

export async function toggleBannerAction(id, aktifSekarang) {
  try {
    const authClient = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak." };
    }

    const supabase = createServerClient();
    await supabase.from("banner").update({ aktif: !aktifSekarang }).eq("id", id);

    revalidatePath("/admin/banner");
    revalidatePath("/");
    return { sukses: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function hapusBannerAction(id) {
  try {
    const authClient = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak." };
    }

    const supabase = createServerClient();
    await supabase.from("banner").delete().eq("id", id);

    revalidatePath("/admin/banner");
    revalidatePath("/");
    return { sukses: true };
  } catch (err) {
    return { error: err.message };
  }
}

