"use server";

import { revalidatePath } from "next/cache";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function imporCsvAction(prevState, formData) {
  try {
    const authClient = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return { error: "Akses ditolak: Hanya admin yang bisa mengimpor produk." };
    }

    const file = formData.get("file_csv");
    if (!file || !(file instanceof File) || file.size === 0) {
      return { error: "Silakan pilih file CSV terlebih dahulu." };
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    if (lines.length <= 1) {
      return { error: "File CSV kosong atau hanya berisi baris header." };
    }

    // Parse header sederhana (nama, harga, kategori, deskripsi, foto_url)
    // Format baris CSV standar: "Nama","Harga","Kategori","Deskripsi","Foto URL"
    const parseCsvLine = (line) => {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ""));
    const namaIdx = header.findIndex((h) => h.includes("nama"));
    const hargaIdx = header.findIndex((h) => h.includes("harga"));
    const katIdx = header.findIndex((h) => h.includes("kategori"));
    const deskIdx = header.findIndex((h) => h.includes("deskripsi"));
    const fotoIdx = header.findIndex((h) => h.includes("foto"));

    if (namaIdx === -1 || hargaIdx === -1) {
      return { error: "CSV harus memiliki kolom Nama dan Harga." };
    }

    const validRows = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const cols = parseCsvLine(lines[i]);
      const nama = cols[namaIdx];
      const hargaStr = cols[hargaIdx];
      const kategori = katIdx !== -1 ? cols[katIdx] : null;
      const deskripsi = deskIdx !== -1 ? cols[deskIdx] : null;
      const foto_url = fotoIdx !== -1 ? cols[fotoIdx] : null;

      if (!nama) {
        errors.push(`Baris ${rowNum}: Nama produk tidak boleh kosong.`);
        continue;
      }

      const harga = parseInt(String(hargaStr).replace(/\D/g, ""), 10);
      if (isNaN(harga) || harga < 0) {
        errors.push(`Baris ${rowNum}: Harga "${hargaStr}" tidak valid (harus angka >= 0).`);
        continue;
      }

      validRows.push({
        nama,
        harga,
        kategori: kategori || null,
        deskripsi: deskripsi || null,
        foto_url: foto_url || "/produk/kopi.svg",
      });
    }

    let suksesCount = 0;
    if (validRows.length > 0) {
      const supabase = createServerClient();
      const { error: insertError } = await supabase.from("produk").insert(validRows);
      if (insertError) {
        return { error: `Gagal menyimpan ke database: ${insertError.message}`, errors };
      }
      suksesCount = validRows.length;
      revalidatePath("/admin");
      revalidatePath("/");
    }

    return {
      suksesCount,
      gagalCount: errors.length,
      errors,
    };
  } catch (err) {
    return { error: `Terjadi kesalahan: ${err.message}` };
  }
}

