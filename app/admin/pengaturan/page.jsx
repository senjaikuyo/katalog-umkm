import NavAdmin from "@/components/NavAdmin";
import FormPengaturan from "@/components/FormPengaturan";
import { createServerClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const revalidate = 0;

export default async function HalamanPengaturanAdmin() {
  let setting = {
    nama: toko.nama,
    nomor_wa: toko.nomorWhatsApp,
    jam_buka: toko.jamBuka,
    alamat: toko.alamat,
  };

  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("toko_setting").select("*").limit(1).maybeSingle();
    if (data) {
      setting = {
        nama: data.nama || setting.nama,
        nomor_wa: data.nomor_wa || setting.nomor_wa,
        jam_buka: data.jam_buka || setting.jam_buka,
        alamat: data.alamat || setting.alamat,
      };
    }
  } catch {}

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Pengaturan Toko</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Ubah identitas dan kontak toko secara langsung tanpa mengubah kode.
        </p>
      </div>

      <FormPengaturan settingAwal={setting} />
    </div>
  );
}

