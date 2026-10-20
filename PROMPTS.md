# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-07 List Produk

**Prompt:**
Ambil data produk pada halaman `/admin` dari database Supabase bukan dari data contoh.

**Hasil:**
Halaman `/admin` berhasil membaca tabel `produk` via Server Component dengan pengurutan terbaru, serta menangani kondisi error dan daftar produk kosong.

**Perbaikan:**
Mengganti impor `produkContoh` dari `lib/data-contoh` dengan pemanggilan `createServerClient().from("produk").select("*")`.

## US-08 Tambah produk

**Prompt:**
Buat fitur tambah produk baru di `/admin/produk/baru` dengan form yang menyimpan ke database dan terlindungi auth admin di server.

**Hasil:**
Halaman `/admin/produk/baru` berhasil menggunakan `FormProduk` yang terhubung ke Server Action `tambahProdukAction`, memvalidasi data di server, mengecek sesi admin, menyimpan ke Supabase, dan redirect ke `/admin`.

**Perbaikan:**
Menghubungkan `useActionState` ke form, memvalidasi input di server, dan menghapus `CatatanBelumAktif`.

## US-09 Ubah produk

**Prompt:**
Buat fitur ubah produk di `/admin/produk/[id]/ubah` yang mengambil data produk yang ada dari database, menampilkan nilai awal di form, dan menyimpan pembaruan ke database dengan autentikasi server.

**Hasil:**
Halaman `/admin/produk/[id]/ubah` berhasil memuat data lama dari Supabase, merender `FormUbahProduk`, memvalidasi data di server melalui `ubahProdukAction`, dan redirect ke `/admin`.

**Perbaikan:**
Mengganti `cariProdukContoh` dengan query Supabase `eq("id", id)`, membuat Server Action `ubahProdukAction`, dan menghapus `CatatanBelumAktif`.

## US-10 Hapus produk

**Prompt:**
Buat fitur hapus produk pada tombol Hapus di `/admin` dengan konfirmasi dan eksekusi penghapusan di database Supabase yang terlindungi login di server.

**Hasil:**
Tombol Hapus meminta konfirmasi sebelum menghapus, memanggil Server Action `hapusProdukAction` yang memverifikasi autentikasi admin di server, menghapus baris dari Supabase, dan merevalidasi cache.

**Perbaikan:**
Membuat komponen klien `TombolHapusProduk` dengan konfirmasi `window.confirm` dan menghubungkannya ke `hapusProdukAction`.

## US-11 Filter kategori atau pencarian

**Prompt:**
Buat fitur filter kategori dan pencarian nama produk pada katalog publik di `/` yang diterapkan langsung di sisi server query database Supabase.

**Hasil:**
Pengunjung dapat menyaring produk berdasarkan kategori (pills) atau mencari nama produk (form pencarian), dengan query dinamis `ilike` dan `eq` di Supabase.

**Perbaikan:**
Membuat komponen `FilterKatalog` yang mengelola parameter URL `q` dan `kategori`, dan memperbarui `app/page.jsx` agar membaca `searchParams` secara asynchronous.

## US-12 Pilih jumlah atau varian

**Prompt:**
Buat fitur pemilihan jumlah barang dan varian produk di halaman detail `/produk/[id]` sebelum memesan, serta memasukkan pilihan jumlah dan varian tersebut ke dalam draf pesan WhatsApp.

**Hasil:**
Pengunjung dapat menambah/mengurangi jumlah produk dan memilih varian (jika ada). Total harga terhitung otomatis dan pesan WhatsApp terisi lengkap dengan rincian varian, kuantitas, dan total harga.

**Perbaikan:**
Membuat komponen interaktif `KotakPemesanan` di halaman detail produk menggantikan tombol WhatsApp statis.

## US-13: PWA manifest

**Prompt:**
Buat PWA manifest untuk aplikasi katalog UMKM.

**Hasil:**
File `public/manifest.json` dibuat dan `app/layout.jsx` diperbarui dengan `<link rel="manifest">` dan `<meta name="theme-color">`.

**Perbaikan:**
-

## US-14: AI deskripsi produk

**Prompt:**
Buat fitur AI untuk generate deskripsi produk menggunakan Groq API.

**Hasil:**
Route Handler `app/api/generate-description/route.js` dibuat. Komponen `FormProduk.jsx` ditulis ulang bersih dengan tombol "✨ Buat deskripsi AI" yang memanggil route handler via fetch dan mengisi textarea deskripsi dengan hasilnya.

**Perbaikan:**
File `FormProduk.jsx` ditulis ulang karena korup (dua export default, import ganda). File `app/admin/actions.js` dibersihkan dari orphan code.


## US-15: Urutkan produk

**Prompt:**
Tambah fitur urutan produk (termurah, termahal, terbaru) di katalog.

**Hasil:**
Select urutan ditambahkan di `FilterKatalog.jsx`. `app/page.jsx` membaca `searchParams.urut` dan menerapkan `.order()` yang sesuai.

**Perbaikan:**
-

## US-16: Paginasi

**Prompt:**
Tambah paginasi berbasis URL dengan 12 produk per halaman.

**Hasil:**
`app/page.jsx` menggunakan `.range()` Supabase dengan parameter `halaman`. Navigasi halaman ditampilkan dengan angka, ellipsis, dan tombol prev/next.

**Perbaikan:**
-

