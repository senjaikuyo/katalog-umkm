export async function generateDescription({ nama, kategori }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY tidak diatur di environment variables.');
  }

  const prompt = `Buat deskripsi singkat (maks 150 kata) untuk produk dengan nama "${nama}" dalam kategori "${kategori}". Fokus pada manfaat, bahan, dan kegunaan, tanpa menyebut harga.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  const description = data?.choices?.[0]?.message?.content?.trim();
  return description ?? '';
}

