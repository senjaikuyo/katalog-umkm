import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Periksa login admin di server
    const supabaseAuth = await createAdminAuthClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createServerClient();
    const { data: produk, error } = await supabase
      .from("produk")
      .select("id, nama, harga, kategori, deskripsi, foto_url, created_at")
      .order("id", { ascending: true });

    if (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const header = ["ID", "Nama", "Harga", "Kategori", "Deskripsi", "Foto URL", "Created At"];
    const rows = (produk || []).map((p) => [
      p.id,
      escapeCsv(p.nama),
      p.harga,
      escapeCsv(p.kategori),
      escapeCsv(p.deskripsi),
      escapeCsv(p.foto_url),
      escapeCsv(p.created_at),
    ]);

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="produk-umkm.csv"',
      },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}

