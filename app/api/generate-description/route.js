import { generateDescription } from "@/lib/ai/generateDescription";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, kategori } = body;

    if (!nama || !kategori) {
      return Response.json(
        { error: "Nama dan kategori wajib diisi." },
        { status: 400 }
      );
    }

    const description = await generateDescription({
      nama: String(nama).trim(),
      kategori: String(kategori).trim(),
    });

    return Response.json({ description });
  } catch (err) {
    return Response.json(
      { error: `Gagal generate deskripsi: ${err.message}` },
      { status: 500 }
    );
  }
}
