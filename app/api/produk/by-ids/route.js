import { createServerClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json({ produk: [] });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .in("id", ids.map((id) => parseInt(id, 10)).filter((n) => !isNaN(n)));

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ produk: data || [] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

