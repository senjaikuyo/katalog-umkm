import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import KelolaAdmin from "@/components/KelolaAdmin";
import { createAdminAuthClient, createServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HalamanKelolaPengguna() {
  const supabaseAuth = await createAdminAuthClient();
  const {
    data: { user: currentUser },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !currentUser) {
    redirect("/admin/login");
  }

  let adminList = [];
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.admin.listUsers();
    if (!error && data?.users) {
      adminList = data.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
      }));
    }
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Kelola Akun Admin</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Tambah akun admin baru untuk berbagi pengelolaan toko, atau hapus akses admin lain.
        </p>
      </div>

      <KelolaAdmin currentUserId={currentUser.id} adminList={adminList} />
    </div>
  );
}

