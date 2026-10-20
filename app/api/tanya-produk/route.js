import { cookies } from "next/headers";

const MAX_PER_MENIT = 5;

export async function POST(request) {
  try {
    // Rate limiting via cookie
    const cookieStore = await cookies();
    const riwayatCookie = cookieStore.get("tanya_ts");
    const sekarang = Date.now();
    let riwayat = [];
    if (riwayatCookie) {
      try {
        riwayat = JSON.parse(riwayatCookie.value);
      } catch {
        riwayat = [];
      }
    }
    riwayat = riwayat.filter((t) => sekarang - t < 60000);
    if (riwayat.length >= MAX_PER_MENIT) {
      return Response.json(
        { error: "Terlalu banyak pertanyaan. Tunggu beberapa saat." },
        { status: 429 }
      );
    }
    riwayat.push(sekarang);

    const body = await request.json();
    const { pertanyaan, produk } = body;

    if (!pertanyaan || typeof pertanyaan !== "string") {
      return Response.json({ error: "Pertanyaan tidak boleh kosong." }, { status: 400 });
    }

    if (pertanyaan.length > 300) {
      return Response.json({ error: "Pertanyaan maksimal 300 karakter." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Layanan AI tidak tersedia." }, { status: 503 });
    }

    const konteks = `Produk: ${produk.nama}
Kategori: ${produk.kategori || "-"}
Harga: Rp ${produk.harga?.toLocaleString("id-ID") || "-"}
Deskripsi: ${produk.deskripsi || "-"}`;

    const systemPrompt = `Kamu adalah asisten toko UMKM yang membantu menjawab pertanyaan tentang produk. Jawab dengan singkat, jelas, dan ramah dalam Bahasa Indonesia. Hanya jawab pertanyaan yang relevan dengan produk berikut:\n${konteks}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: pertanyaan },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "Layanan AI sedang tidak tersedia." }, { status: 502 });
    }

    const data = await res.json();
    const jawaban = data?.choices?.[0]?.message?.content?.trim() || "Maaf, tidak ada jawaban.";

    const response = Response.json({ jawaban });
    response.headers.set(
      "Set-Cookie",
      `tanya_ts=${JSON.stringify(riwayat)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=60`
    );
    return response;
  } catch (err) {
    return Response.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}

