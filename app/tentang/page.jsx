import { toko } from "@/lib/toko";
import Link from "next/link";

export const metadata = {
  title: `Tentang Kami - ${toko.nama}`,
  description: `Profil dan informasi kontak ${toko.nama}`,
};

export default function HalamanTentang() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-10">
      <div>
        <Link href="/" className="text-sm text-teks-lembut hover:text-utama">
          ← Kembali ke katalog
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Tentang {toko.nama}
        </h1>
        <p className="mt-2 text-lg text-teks-lembut">{toko.tagline}</p>
      </div>

      <div className="grid gap-6 rounded-2xl border border-garis bg-permukaan p-6 sm:p-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teks-lembut">
            Jam Operasional
          </h2>
          <p className="mt-1 text-base font-medium">{toko.jamBuka}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teks-lembut">
            Alamat Toko
          </h2>
          <p className="mt-1 text-base font-medium">{toko.alamat}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teks-lembut">
            Kontak Pemesanan
          </h2>
          <p className="mt-1 text-base font-medium">WhatsApp: {toko.nomorWhatsApp}</p>
          <a
            href={`https://wa.me/${toko.nomorWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

