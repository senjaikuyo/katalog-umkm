"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

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

export async function tambahProdukAction(prevState, formData) {
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
    const hargaStr = formData.get("harga")?.toString().trim();
    const kategori = formData.get("kategori")?.toString().trim() || null;
    const foto_url = formData.get("foto_url")?.toString().trim() || null;
    const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

    if (!nama) {
      return { error: "Nama produk wajib diisi." };
    }

    const harga = parseInt(hargaStr, 10);
    if (isNaN(harga) || harga < 0) {
      return { error: "Harga harus berupa angka 0 atau lebih." };
    }

    const supabase = createServerClient();
    const { error: insertError } = await supabase.from("produk").insert({
      nama,
      harga,
      kategori,
      foto_url: foto_url || "/produk/kopi.svg",
      deskripsi,
    });

    if (insertError) {
      return { error: `Gagal menyimpan produk: ${insertError.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }

  redirect("/admin");
}

export async function ubahProdukAction(prevState, formData) {
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
    const nama = formData.get("nama")?.toString().trim();
    const hargaStr = formData.get("harga")?.toString().trim();
    const kategori = formData.get("kategori")?.toString().trim() || null;
    const foto_url = formData.get("foto_url")?.toString().trim() || null;
    const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

    if (!id) {
      return { error: "ID produk tidak valid." };
    }

    if (!nama) {
      return { error: "Nama produk wajib diisi." };
    }

    const harga = parseInt(hargaStr, 10);
    if (isNaN(harga) || harga < 0) {
      return { error: "Harga harus berupa angka 0 atau lebih." };
    }

    const supabase = createServerClient();
    const { error: updateError } = await supabase
      .from("produk")
      .update({
        nama,
        harga,
        kategori,
        foto_url: foto_url || "/produk/kopi.svg",
        deskripsi,
      })
      .eq("id", id);

    if (updateError) {
      return { error: `Gagal memperbarui produk: ${updateError.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/produk/${id}`);
    revalidatePath(`/admin/produk/${id}/ubah`);
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }

  redirect("/admin");
}

export async function hapusProdukAction(id) {
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
      return { error: "ID produk tidak valid." };
    }

    const supabase = createServerClient();
    const { error: deleteError } = await supabase
      .from("produk")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { error: `Gagal menghapus produk: ${deleteError.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/produk/${id}`);
    return { sukses: true };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}
