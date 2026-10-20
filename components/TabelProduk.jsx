import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapusProduk from "@/components/TombolHapusProduk";
import TombolStatusProduk from "@/components/TombolStatusProduk";
import TombolUrutanProduk from "@/components/TombolUrutanProduk";
import Link from "next/link";

export default function TabelProduk({ daftarProduk }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold">Urutan</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className="border-t border-garis">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={produk.foto_url} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <span className="font-semibold">{produk.nama}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-teks-lembut">{produk.kategori}</td>
              <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
              <td className="px-4 py-3">
                <TombolUrutanProduk id={produk.id} urutan={produk.urutan ?? 0} />
              </td>
              <td className="px-4 py-3">
                <TombolStatusProduk id={produk.id} aktif={produk.aktif !== false} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end items-center gap-2">
                  <Link
                    href={`/admin/produk/${produk.id}/varian`}
                    className="rounded-lg border border-garis bg-latar px-2.5 py-1.5 text-xs font-semibold text-teks-lembut hover:border-utama hover:text-utama"
                    title="Kelola varian produk"
                  >
                    Varian
                  </Link>
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                    Ubah
                  </Tombol>
                  <TombolHapusProduk id={produk.id} nama={produk.nama} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
