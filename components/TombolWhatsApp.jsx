import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

// US-03: Pesan via WhatsApp
export default function TombolWhatsApp({ produk }) {
  const teksPesan = `Halo ${toko.nama}, saya ingin memesan ${produk.nama} (${formatRupiah(produk.harga)}).`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teksPesan)}`;

  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
