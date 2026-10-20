"use server";

import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function simpanPengaturanAction(prevState, formData) {
  try {
    const authClient = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Hanya admin yang bisa mengubah pengaturan toko." };
    }

    const nama = formData.get("nama")?.toString().trim();
    const nomor_wa = formData.get("nomor_wa")?.toString().trim();
    const jam_buka = formData.get("jam_buka")?.toString().trim();
    const alamat = formData.get("alamat")?.toString().trim();

    if (!nama || !nomor_wa) {
      return { error: "Nama toko dan nomor WhatsApp wajib diisi." };
    }

    // Validasi nomor WA sederhana (angka, minimal 10 digit)
    if (!/^\d{10,15}$/.test(nomor_wa.replace(/\D/g, ""))) {
      return { error: "Nomor WhatsApp harus berupa angka 10-15 digit (contoh: 628123456789)." };
    }

    const supabase = createServerClient();
    // Simpan atau update row tunggal
    const { data: existing } = await supabase.from("toko_setting").select("id").limit(1).maybeSingle();

    if (existing?.id) {
      await supabase
        .from("toko_setting")
        .update({ nama, nomor_wa, jam_buka, alamat })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("toko_setting")
        .insert({ nama, nomor_wa, jam_buka, alamat });
    }

    revalidatePath("/admin/pengaturan");
    revalidatePath("/");
    revalidatePath("/tentang");
    return { sukses: "Pengaturan toko berhasil disimpan." };
  } catch (err) {
    return { error: err.message };
  }
}

