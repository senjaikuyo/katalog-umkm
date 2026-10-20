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
  } catch {
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

async function uploadFotoProduk(fotoFile, supabase) {
  if (!fotoFile || typeof fotoFile.size !== "number" || fotoFile.size === 0) {
    return { url: null, error: null };
  }

  // 1. Validasi tipe file
  const allowedMime = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  if (!allowedMime.includes(fotoFile.type) && !fotoFile.type.startsWith("image/")) {
    return {
      url: null,
      error: "File harus berupa gambar (JPG, PNG, WebP, SVG, atau GIF).",
    };
  }

  // 2. Validasi ukuran maksimal (5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (fotoFile.size > MAX_SIZE) {
    return {
      url: null,
      error: "Ukuran file foto maksimal 5 MB.",
    };
  }

  // 3. Upload ke Supabase Storage (bucket 'produk')
  try {
    const arrayBuffer = await fotoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeName = fotoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `produk-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("produk")
      .upload(path, buffer, {
        contentType: fotoFile.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: `Gagal mengunggah foto: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("produk").getPublicUrl(path);

    return { url: publicUrl, error: null };
  } catch (err) {
    return { url: null, error: `Kesalahan upload: ${err.message}` };
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

    const nama = formData.get("nama")?.toString().trim() || "";
    const hargaStr = formData.get("harga")?.toString().trim() || "";
    const kategori = formData.get("kategori")?.toString().trim() || null;
    const foto_url = formData.get("foto_url")?.toString().trim() || null;
    const deskripsi = formData.get("deskripsi")?.toString().trim() || null;
    const foto_file = formData.get("foto_file");

    const supabase = createServerClient();
    const fieldErrors = {};

    // US-34: Validasi nama produk wajib
    if (!nama) {
      fieldErrors.nama = "Nama produk wajib diisi.";
    }

    // US-34: Validasi harga angka positif
    const harga = parseInt(hargaStr, 10);
    if (isNaN(harga) || harga < 0) {
      fieldErrors.harga = "Harga harus berupa angka 0 atau lebih.";
    }

    // US-29: Upload file foto jika dipilih
    let fotoUrlFinal = foto_url;
    if (foto_file && typeof foto_file.size === "number" && foto_file.size > 0) {
      const uploadRes = await uploadFotoProduk(foto_file, supabase);
      if (uploadRes.error) {
        fieldErrors.foto_file = uploadRes.error;
      } else {
        fotoUrlFinal = uploadRes.url;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        error: "Mohon periksa kembali kolom yang ditandai.",
        fieldErrors,
        values: { nama, harga: hargaStr, kategori, foto_url, deskripsi },
      };
    }

    const { error: insertError } = await supabase.from("produk").insert({
      nama,
      harga,
      kategori,
      foto_url: fotoUrlFinal || "/produk/kopi.svg",
      deskripsi,
    });

    if (insertError) {
      return { error: `Gagal menyimpan produk: ${insertError.message}` };
    }

    // Sinkronisasi kategori ke tabel kategori jika belum ada
    if (kategori) {
      try {
        const slug = kategori.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
        await supabase
          .from("kategori")
          .upsert({ nama: kategori, slug }, { onConflict: "nama" });
      } catch {}
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Tambah Produk",
        detail: `Menambah produk "${nama}" (Rp ${harga})`,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
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
    const nama = formData.get("nama")?.toString().trim() || "";
    const hargaStr = formData.get("harga")?.toString().trim() || "";
    const kategori = formData.get("kategori")?.toString().trim() || null;
    const foto_url = formData.get("foto_url")?.toString().trim() || null;
    const deskripsi = formData.get("deskripsi")?.toString().trim() || null;
    const foto_file = formData.get("foto_file");

    if (!id) {
      return { error: "ID produk tidak valid." };
    }

    const supabase = createServerClient();
    const fieldErrors = {};

    // US-34: Validasi nama produk wajib
    if (!nama) {
      fieldErrors.nama = "Nama produk wajib diisi.";
    }

    // US-34: Validasi harga angka positif
    const harga = parseInt(hargaStr, 10);
    if (isNaN(harga) || harga < 0) {
      fieldErrors.harga = "Harga harus berupa angka 0 atau lebih.";
    }

    // US-29: Upload file foto jika dipilih
    let fotoUrlFinal = foto_url;
    if (foto_file && typeof foto_file.size === "number" && foto_file.size > 0) {
      const uploadRes = await uploadFotoProduk(foto_file, supabase);
      if (uploadRes.error) {
        fieldErrors.foto_file = uploadRes.error;
      } else {
        fotoUrlFinal = uploadRes.url;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        error: "Mohon periksa kembali kolom yang ditandai.",
        fieldErrors,
        values: { id, nama, harga: hargaStr, kategori, foto_url, deskripsi },
      };
    }

    const { error: updateError } = await supabase
      .from("produk")
      .update({
        nama,
        harga,
        kategori,
        foto_url: fotoUrlFinal || "/produk/kopi.svg",
        deskripsi,
      })
      .eq("id", id);

    if (updateError) {
      return { error: `Gagal memperbarui produk: ${updateError.message}` };
    }

    // Sinkronisasi kategori ke tabel kategori jika belum ada
    if (kategori) {
      try {
        const slug = kategori.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
        await supabase
          .from("kategori")
          .upsert({ nama: kategori, slug }, { onConflict: "nama" });
      } catch {}
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Ubah Produk",
        detail: `Mengubah produk ID ${id}: "${nama}"`,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/kategori");
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

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Hapus Produk",
        detail: `Menghapus produk ID ${id}`,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/produk/${id}`);
    return { sukses: true };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

export async function toggleAktifProdukAction(id, statusAktif) {
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
    const { error: updateError } = await supabase
      .from("produk")
      .update({ aktif: statusAktif })
      .eq("id", id);

    if (updateError) {
      return { error: `Gagal memperbarui status: ${updateError.message}` };
    }

    try {
      await supabase.from("aktivitas_log").insert({
        user_email: user.email,
        aksi: "Ubah Status Produk",
        detail: `Mengubah status aktif produk ID ${id} menjadi ${statusAktif ? "Aktif" : "Nonaktif"}`,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/produk/${id}`);
    return { sukses: true };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

export async function ubahUrutanProdukAction(id, delta) {
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
    const { data: produk, error: fetchError } = await supabase
      .from("produk")
      .select("urutan")
      .eq("id", id)
      .single();

    if (fetchError || !produk) {
      return { error: "Produk tidak ditemukan." };
    }

    const urutanSekarang = produk.urutan ?? 0;
    const urutanBaru = urutanSekarang + delta;

    const { error: updateError } = await supabase
      .from("produk")
      .update({ urutan: urutanBaru })
      .eq("id", id);

    if (updateError) {
      return { error: `Gagal mengubah urutan: ${updateError.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { sukses: true, urutan: urutanBaru };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}
