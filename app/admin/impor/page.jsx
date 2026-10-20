import NavAdmin from "@/components/NavAdmin";
import FormImporCsv from "@/components/FormImporCsv";

export const revalidate = 0;

export default function HalamanImporAdmin() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Impor Produk dari CSV</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Unggah file CSV untuk menambahkan banyak produk sekaligus ke database.
        </p>
      </div>

      <FormImporCsv />
    </div>
  );
}

