# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Tampilkan semua produk toko dari tabel `produk` di Supabase pada halaman beranda `/` secara server-side dengan format harga rupiah dan pesan yang jelas jika produk belum ada.

**Hasil:**
Halaman `/` berhasil memuat seluruh produk dari Supabase Server Component, menampilkan foto, nama, kategori, dan format rupiah, serta menampilkan pesan ramah jika katalog kosong.

**Perbaikan:**
Mengganti data contoh statis dengan query Supabase di `app/page.jsx`.

## US-02 Detail produk

**Prompt:**
Buat halaman detail produk `/produk/[id]` yang membaca data spesifik dari tabel Supabase dan menangani kondisi jika produk tidak ditemukan (404).

**Hasil:**
Halaman `/produk/[id]` berhasil merender foto, nama, harga rupiah, kategori, dan deskripsi produk, serta mengarahkan ke `notFound()` jika ID tidak valid atau tidak ditemukan di database.

**Perbaikan:**
Implementasi dinamis dengan `await params` di `app/produk/[id]/page.jsx` dan integrasi fungsi `notFound()`.

## US-03 Pesan via WhatsApp

**Prompt:**
Buat tombol pemesanan langsung ke nomor WhatsApp toko yang ada di `lib/toko.js` dengan draft pesan otomatis berisi nama dan harga produk.

**Hasil:**
Tombol "Pesan via WhatsApp" membuka tautan `https://wa.me/...` dengan format pesan yang sudah terisi nama produk dan harga, berfungsi di desktop maupun smartphone.

**Perbaikan:**
Membuat komponen pemesanan WhatsApp yang membaca nomor kontak dari `lib/toko.js`.

## US-04 Login admin

**Prompt:**
Buat sistem login admin di `/admin/login` menggunakan Supabase Auth di sisi server, lengkap dengan penanganan error dan tombol logout.

**Hasil:**
Admin dapat masuk menggunakan email dan password melalui Server Action `loginAction` dengan cookie session yang aman, serta dapat mengakhiri sesi melalui `logoutAction`.

**Perbaikan:**
Pembuatan halaman login, form action dengan `useActionState`, dan Server Action otentikasi di `app/admin/actions.js`.

## US-05 Ganti password

**Prompt:**
Buat fitur ganti password admin di `/admin/password` dengan validasi minimal 8 karakter dan konfirmasi kecocokan password.

**Hasil:**
Halaman `/admin/password` memungkinkan admin yang sedang login untuk memperbarui password via Server Action `gantiPasswordAction`, memvalidasi panjang password dan kecocokan konfirmasi, serta menampilkan pesan status.

**Perbaikan:**
Implementasi form ganti password dan Server Action pembaruan kredensial user di Supabase Auth.

## US-06 Proteksi halaman admin

**Prompt:**
Proteksi seluruh rute admin di bawah `/admin` (kecuali `/admin/login`) agar dialihkan ke halaman login jika belum login, dan lindungi seluruh mutasi Server Action di sisi server.

**Hasil:**
File `proxy.js` memvalidasi sesi cookie Supabase Auth pada rute admin dan mengalihkan pengguna anonim ke `/admin/login`. Setiap Server Action memverifikasi sesi user via `createAdminAuthClient().auth.getUser()`.

**Perbaikan:**
Konfigurasi proteksi rute di `proxy.js` dan pemeriksaan sesi wajib di awal setiap fungsi mutasi Server Action.

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
Membuat komponen interaktif `KotakPemesanan` di halaman detail produk menggantikan tombol WhatsApp statis, dengan dukungan varian (`nama` / `nama_varian`) dan prioritas harga diskon.

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

## US-17: Produk terkait di halaman detail

**Prompt:**
Tampilkan produk terkait dari kategori yang sama pada halaman detail `/produk/[id]` dengan membatasi jumlah dan mengecualikan produk yang sedang aktif.

**Hasil:**
Halaman detail produk menampilkan hingga 4 produk serupa dalam kategori yang sama via query Supabase `neq("id", id).limit(4)` di sisi server.

**Perbaikan:**
Penambahan query produk terkait dan rendering grid produk serupa di `app/produk/[id]/page.jsx`.

## US-18: Galeri beberapa foto produk

**Prompt:**
Buat komponen galeri foto pada halaman detail `/produk/[id]` dengan dukungan multi-foto dan thumbnail yang interaktif.

**Hasil:**
Komponen `GaleriFoto.jsx` merender foto utama dan daftar thumbnail gambar jika produk memiliki beberapa foto (`foto_urls`), serta fallback ke foto tunggal.

**Perbaikan:**
Implementasi komponen klien `GaleriFoto.jsx` dan integrasi di `app/produk/[id]/page.jsx`.

## US-19: Status stok

**Prompt:**
Tampilkan indikator stok habis pada kartu katalog dan halaman detail produk, serta cegah pemesanan via WhatsApp jika stok kosong.

**Hasil:**
Badge "Habis" / "Stok Habis" muncul jika `stok === 0`. Tombol WhatsApp dinonaktifkan di `KotakPemesanan` dan tombol "+ Keranjang" disembunyikan di `KartuProduk`.

**Perbaikan:**
Penambahan prop dan pengecekan stok di `components/KartuProduk.jsx` dan `components/KotakPemesanan.jsx`.

## US-20: Harga coret dan badge

**Prompt:**
Tampilkan harga promo (harga diskon) dengan harga normal dicoret, serta tampilkan badge promo atau penanda khusus pada katalog dan detail produk.

**Hasil:**
Jika `harga_diskon` terisi, harga diskon ditampilkan sebagai harga aktif dan harga reguler dicoret. Jika produk memiliki nilai kolom `badge`, label pill ditampilkan pada kartu dan detail.

**Perbaikan:**
Pembaruan tata letak harga dan badge di `KartuProduk.jsx` dan `app/produk/[id]/page.jsx`.

## US-21: Keranjang, pesan semua via WhatsApp

**Prompt:**
Buat sistem keranjang belanja dengan context, penyimpanan di browser (localStorage), serta tombol checkout untuk memesan seluruh isi keranjang dalam satu pesan WhatsApp.

**Hasil:**
Context `KeranjangContext.jsx` mengelola state keranjang secara persisten di localStorage. Halaman `/keranjang` menampilkan daftar item, modifikasi kuantitas, subtotal, dan tombol pesan WhatsApp yang memformat seluruh rincian belanjaan.

**Perbaikan:**
Pemasangan `KeranjangProvider` di root layout, counter badge di `Header.jsx`, dan tombol "+ Keranjang" di kartu serta detail produk.

## US-22: Halaman Tentang dan kontak toko

**Prompt:**
Buat halaman `/tentang` yang memuat identitas toko, jam buka, alamat, dan kontak pemesanan, serta tautkan ke navigasi header dan footer.

**Hasil:**
Halaman `app/tentang/page.jsx` menyajikan profil lengkap toko yang bersumber dari `lib/toko.js`. Tautan navigasi "Tentang" disematkan di `Header.jsx` dan `Footer.jsx`.

**Perbaikan:**
Pembuatan halaman `app/tentang/page.jsx` dengan metadata SEO yang sesuai.

## US-23: Bagikan atau salin link produk

**Prompt:**
Sediakan tombol bagikan atau salin link produk ke clipboard dengan umpan balik visual di halaman detail produk.

**Hasil:**
Komponen `BagikanProduk.jsx` menggunakan Web Share API jika tersedia atau menyalin tautan ke clipboard via `navigator.clipboard.writeText`, menampilkan status konfirmasi "✓ Link tersalin!".

**Perbaikan:**
Pembuatan komponen `BagikanProduk.jsx` dan penyisipannya di `app/produk/[id]/page.jsx`.

## US-24: Favorit tersimpan di browser

**Prompt:**
Buat fitur simpan produk favorit di localStorage browser dan halaman `/favorit` untuk menampilkan seluruh produk yang telah ditandai.

**Hasil:**
Komponen `TombolFavorit.jsx` memungkinkan pengunjung menandai produk dengan ikon hati. Halaman `/favorit` memuat ID favorit dari browser dan mengambil datanya dari server via endpoint `/api/produk/by-ids`.

**Perbaikan:**
Pembuatan rute `app/favorit/page.jsx`, endpoint `/api/produk/by-ids`, dan tautan "❤️ Favorit" di `Header.jsx`.

## US-25: Mode gelap

**Prompt:**
Tambahkan tombol switch mode gelap/terang dengan persistensi preferensi di localStorage dan dukungan media query prefers-color-scheme.

**Hasil:**
Header menyediakan tombol switch tema. Saat diaktifkan, kelas `dark` ditambahkan ke `document.documentElement` dan disimpan di localStorage (`tema`). Warna latar, kartu, dan teks menyesuaikan otomatis dengan variabel warna CSS Tailwind.

**Perbaikan:**
Implementasi state dan handler toggle dark mode di `components/Header.jsx`.

## US-26: Metadata SEO dan Open Graph

**Prompt:**
Gunakan `generateMetadata` pada rute produk dinamis `/produk/[id]` untuk mengatur title, description, dan Open Graph image secara otomatis berdasarkan data produk.

**Hasil:**
Fungsi `generateMetadata` mengambil data produk dari Supabase dan menghasilkan metadata halaman dinamis serta tag Open Graph (`title`, `description`, `images`) untuk preview tautan sosial.

**Perbaikan:**
Penambahan fungsi async `generateMetadata` di `app/produk/[id]/page.jsx`.

## US-27: sitemap.xml dan robots.txt

**Prompt:**
Buat `sitemap.xml` dinamis dari database produk dan `robots.txt` yang valid mengarahkan bot mesin pencari ke sitemap.

**Hasil:**
File `app/sitemap.js` meng-generate sitemap otomatis untuk beranda, `/tentang`, dan setiap URL `/produk/[id]`. File `public/robots.txt` mengizinkan perayapan halaman publik dan memblokir rute `/admin/` dan `/api/`.

**Perbaikan:**
Pembuatan route generator `app/sitemap.js` dan file konfigurasi `public/robots.txt`.

## US-28: Halaman 404 dan loading kustom

**Prompt:**
Buat tampilan `not-found.jsx` ramah pengguna dengan tombol kembali ke beranda, serta skeleton loading `loading.jsx` saat data sedang dimuat.

**Hasil:**
Halaman `app/not-found.jsx` memberikan pesan jelas saat produk/halaman tidak ditemukan. Halaman `app/loading.jsx` merender skeleton shimmer untuk katalog produk saat proses loading server component.

**Perbaikan:**
Pembuatan template khusus `app/not-found.jsx` dan `app/loading.jsx`.

## US-29: Upload foto ke Supabase Storage

**Prompt:**
[SENDIRI] Sediakan input file unggah foto produk pada form admin dan simpan langsung ke Supabase Storage bucket 'produk' di server, lengkapi dengan validasi tipe gambar dan batas ukuran 5 MB.

**Hasil:**
Form produk di panel admin mendukung input file foto langsung dari perangkat. Server Action memvalidasi MIME type (khusus file gambar) dan batas maksimal file 5 MB, mengunggah ke bucket Storage `produk` di server tanpa membocorkan API key di client, serta menyimpan public URL ke database produk.

**Perbaikan:**
Penambahan fungsi helper `uploadFotoProduk` di `app/admin/actions.js` dan input file pada `components/FormProduk.jsx`.

## US-30: Dashboard ringkasan admin

**Prompt:**
Buat halaman dashboard admin yang menampilkan metrik total produk dan distribusi jumlah produk per kategori dari database Supabase.

**Hasil:**
Halaman `/admin/dashboard` merangkum statistik katalog toko: kartu total produk, total kategori, dan rincian produk per kategori dari query tabel `produk`.

**Perbaikan:**
Pembuatan halaman `app/admin/dashboard/page.jsx` dan navigasi `NavAdmin.jsx`.

## US-31: Kelola kategori

**Prompt:**
[SENDIRI] Buat modul manajemen kategori lengkap (tambah, ubah nama, hapus dengan proteksi pemakaian produk) di `/admin/kategori` dan gunakan daftar ini sebagai pilihan kategori di form produk.

**Hasil:**
Halaman `/admin/kategori` menyediakan formulir tambah kategori baru, ubah nama kategori secara inline (sekaligus memperbarui produk terkait), dan tombol hapus yang memeriksa referensi pemakaian oleh produk agar kategori aktif tidak terhapus sembarangan. Form produk memuat saran kategori dari tabel ini.

**Perbaikan:**
Pembuatan Server Actions `app/admin/kategori/actions.js`, komponen `KelolaKategori.jsx`, dan integrasi sinkronisasi kategori di `FormProduk.jsx`.

## US-32: Aktif atau nonaktifkan produk

**Prompt:**
[SENDIRI] Implementasikan toggle status aktif/nonaktif produk di halaman admin, serta pastikan produk nonaktif tidak muncul di katalog publik dan memicu 404 pada halaman detail.

**Hasil:**
Admin dapat mengaktifkan atau menonaktifkan produk via `TombolStatusProduk`. Server Action `toggleAktifProdukAction` memperbarui kolom `aktif` di Supabase. Halaman katalog beranda `/`, `/kategori/[slug]`, dan `sitemap.xml` menyaring `neq("aktif", false)`, serta halaman detail `/produk/[id]` memanggil `notFound()` jika produk berstatus nonaktif.

**Perbaikan:**
Penyempurnaan guard `data.aktif === false` di `app/produk/[id]/page.jsx`, filter query di `app/kategori/[slug]/page.jsx`, dan penyesuaian query sitemap.

## US-33: Cari dan paginasi di list admin

**Prompt:**
Buat form pencarian produk berdasarkan nama dan navigasi paginasi berbasis URL pada tabel manajemen produk di `/admin`.

**Hasil:**
Tabel admin di `/admin` menerima parameter `q` dan `halaman`. Query Supabase menggunakan `.ilike("nama", ...)` dan `.range()` untuk menyaring dan membatasi 15 produk per halaman, mempertahankan parameter di URL.

**Perbaikan:**
Penambahan input pencarian, tombol filter, dan navigasi nomor halaman di `app/admin/page.jsx`.

## US-34: Validasi form admin di server

**Prompt:**
[SENDIRI] Terapkan validasi form produk di sisi server dengan pesan error spesifik per-field di bawah input dan pertahankan nilai input yang sudah diisi pengguna saat terjadi error validasi.

**Hasil:**
Server Action `tambahProdukAction` dan `ubahProdukAction` memvalidasi kelengkapan nama dan kevalidan harga (angka non-negatif). Error validasi dikembalikan dalam objek `fieldErrors` dan dirender tepat di bawah input terkait dengan indikator border merah, sementara nilai input yang sudah diisi dipertahankan via objek `values`.

**Perbaikan:**
Update komponen `components/Input.jsx` dengan properti `error`, penyempurnaan return state validasi pada `app/admin/actions.js`, dan binding nilai pada `components/FormProduk.jsx`.

## US-35: Ekspor produk ke CSV

**Prompt:**
Buat endpoint unduh CSV di `/api/admin/export-csv` yang terlindungi autentikasi admin di server untuk mengekspor seluruh daftar produk.

**Hasil:**
Route handler `app/api/admin/export-csv/route.js` memverifikasi sesi admin, mengambil seluruh produk dari database, memformat baris CSV dengan escaping kutip yang aman, dan mengirim response file attachment `.csv`. Tombol "📥 Ekspor CSV" ditambahkan di halaman admin.

**Perbaikan:**
Pembuatan route handler `app/api/admin/export-csv/route.js` dan tombol ekspor di `app/admin/page.jsx`.

## US-36: Terakhir dilihat

**Prompt:**
Simpan riwayat produk yang terakhir dilihat pengunjung di browser dan tampilkan rekomendasinya di halaman beranda toko.

**Hasil:**
Komponen `CatatTerakhirDilihat.jsx` mencatat ID produk yang dibuka ke localStorage (maksimal 6 item). Komponen `TerakhirDilihat.jsx` memuat data produk tersebut via `/api/produk/by-ids` dan menampilkannya di bagian bawah beranda hanya jika ada data.

**Perbaikan:**
Pembuatan komponen `CatatTerakhirDilihat.jsx`, `TerakhirDilihat.jsx`, dan endpoint `/api/produk/by-ids/route.js`.

## US-37: Bandingkan 2 produk

**Prompt:**
Buat fitur perbandingan hingga 2 produk secara berdampingan di halaman `/bandingkan`.

**Hasil:**
Pengunjung dapat menandai produk dengan tombol `TombolBandingkan.jsx`. Halaman `/bandingkan` menampilkan perbandingan berdampingan: foto, nama, kategori, harga, deskripsi lengkap, serta tombol pemesanan WhatsApp langsung.

**Perbaikan:**
Pembuatan rute `app/bandingkan/page.jsx` dan komponen `TombolBandingkan.jsx` dengan validasi batas maksimal 2 produk.

## US-38: Ulasan dan rating

**Prompt:**
Buat fitur ulasan pembeli (nama, rating 1-5 bintang, komentar) di halaman detail produk dengan Server Action dan proteksi dasar.

**Hasil:**
Form `FormUlasan.jsx` mengirim ulasan via Server Action `tambahUlasanAction` yang memvalidasi input di server dan menyimpan data ke tabel `ulasan`. Halaman detail menampilkan daftar ulasan yang telah dimoderasi beserta rata-rata nilai rating bintang.

**Perbaikan:**
Pembuatan Server Action di `app/produk/actions.js`, form ulasan di `components/FormUlasan.jsx`, dan kalkulasi rating di `app/produk/[id]/page.jsx`.

## US-39: Moderasi ulasan di admin

**Prompt:**
Buat halaman panel admin di `/admin/ulasan` untuk memoderasi ulasan pembeli (menyetujui/menyembunyikan dan menghapus ulasan).

**Hasil:**
Halaman `/admin/ulasan` menampilkan seluruh ulasan pembeli beserta nama produk terkait. Admin dapat mengubah status tampil (`toggleTampilUlasanAction`) atau menghapus ulasan (`hapusUlasanAction`) dengan proteksi login server.

**Perbaikan:**
Pembuatan rute `app/admin/ulasan/page.jsx`, komponen `TombolAksiUlasan.jsx`, dan Server Actions di `app/admin/ulasan/actions.js`.

## US-40: Catat klik pesan WhatsApp

**Prompt:**
Catat metrik klik tombol pesan WhatsApp ke database secara asynchronous tanpa menghambat pengguna diarahkan ke WhatsApp.

**Hasil:**
Setiap kali tombol WhatsApp di klik, Server Action `catatKlikWAAction` dipanggil secara asinkron untuk mencatat ID produk ke tabel `klik_wa` tanpa mengganggu pembukaan tautan `wa.me`.

**Perbaikan:**
Implementasi `catatKlikWAAction` di `app/produk/actions.js` dan penambahan event click di `components/KotakPemesanan.jsx`.

## US-41: Produk terlaris di dashboard

**Prompt:**
Tampilkan peringkat 5 produk paling sering dipesan via WhatsApp pada dashboard admin berdasarkan data pencatatan klik.

**Hasil:**
Dashboard admin `/admin/dashboard` menghitung frekuensi interaksi produk dari tabel `klik_wa`, mengurutkan 5 produk dengan klik terbanyak, dan menampilkannya dalam daftar peringkat metrik.

**Perbaikan:**
Agregasi data klik WhatsApp dan penyajian UI peringkat top 5 di `app/admin/dashboard/page.jsx`.

## US-42: Banner promo di beranda

**Prompt:**
Buat fitur banner promo beranda yang dapat dikelola (tambah, aktifkan/nonaktifkan, hapus) dari halaman admin `/admin/banner`.

**Hasil:**
Admin dapat mengelola banner promo melalui `FormBanner.jsx` dan Server Action `app/admin/banner/actions.js`. Komponen `BannerBeranda.jsx` membaca banner yang berstatus aktif dari Supabase dan menampilkannya di halaman katalog utama.

**Perbaikan:**
Pembuatan rute `/admin/banner`, komponen `FormBanner.jsx`, `TombolAksiBanner.jsx`, dan `BannerBeranda.jsx`.

## US-43: Pengaturan toko dari admin

**Prompt:**
Buat halaman pengaturan toko di `/admin/pengaturan` agar admin dapat memperbarui nama, nomor WhatsApp, jam operasional, dan alamat toko tanpa mengubah kode.

**Hasil:**
Form di `/admin/pengaturan` menyimpan konfigurasi toko ke tabel `toko_setting` via Server Action `simpanPengaturanAction` dengan validasi format nomor WhatsApp dan proteksi sesi admin.

**Perbaikan:**
Pembuatan rute `app/admin/pengaturan/page.jsx`, komponen `FormPengaturan.jsx`, dan Server Action `app/admin/pengaturan/actions.js`.

## US-44: Kelola akun admin

**Prompt:**
[SENDIRI] Sediakan halaman kelola admin di `/admin/pengguna` untuk melihat daftar admin Supabase Auth, menambah admin baru, dan menghapus admin lain dengan pencegahan penghapusan akun sendiri.

**Hasil:**
Admin dapat melihat seluruh user admin terdaftar via `supabase.auth.admin.listUsers()`, menambahkan akun admin baru (email + password min. 8 karakter), serta menghapus admin lain. Sistem memproteksi akun yang sedang aktif login agar tidak dapat dihapus sendiri di server maupun di tampilan.

**Perbaikan:**
Pembuatan Server Actions `app/admin/pengguna/actions.js`, komponen `KelolaAdmin.jsx`, rute `app/admin/pengguna/page.jsx`, dan penambahan tautan di `NavAdmin.jsx`.

## US-45: Log aktivitas admin

**Prompt:**
Catat riwayat aktivitas perubahan data produk oleh admin ke dalam audit log dan sediakan tampilan 50 log terakhir di `/admin/log`.

**Hasil:**
Tindakan tambah, ubah, dan hapus produk mencatat entri ke tabel `aktivitas_log` (email admin, jenis aksi, detail perubahan, dan timestamp). Halaman `/admin/log` menampilkan 50 catatan audit aktivitas terakhir terlindungi login.

**Perbaikan:**
Pembuatan rute `app/admin/log/page.jsx` dan integrasi fungsi pencatatan log pada mutasi Server Actions di `app/admin/actions.js`.

## US-46: Impor produk dari CSV

**Prompt:**
Buat fitur impor massal produk melalui unggahan file CSV pada panel admin `/admin/impor` lengkap dengan validasi baris.

**Hasil:**
Halaman `/admin/impor` dan komponen `FormImporCsv.jsx` memproses file CSV via `imporCsvAction`. Baris divalidasi (nama wajib, harga harus angka positif), data valid disimpan secara batch ke Supabase, dan baris bermasalah dilaporkan beserta rincian nomor barisnya.

**Perbaikan:**
Pembuatan rute `app/admin/impor/page.jsx`, komponen `FormImporCsv.jsx`, parser CSV robust dengan escaping kutip, dan Server Action di `app/admin/impor/actions.js`.

## US-47: Atur urutan tampil produk

**Prompt:**
[SENDIRI] Tambahkan kontrol naik/turun urutan tampil produk di tabel admin dan pastikan katalog publik mengikuti urutan kolom `urutan` secara ascending.

**Hasil:**
Tabel produk di `/admin` dilengkapi tombol pengatur urutan (▲ / ▼) via Server Action `ubahUrutanProdukAction`. Query katalog publik pada beranda `/` dan `/admin` diprioritaskan berdasarkan kolom `urutan` ascending sebelum diurutkan berdasarkan `created_at` descending.

**Perbaikan:**
Pembuatan Server Action `ubahUrutanProdukAction` di `app/admin/actions.js`, komponen `TombolUrutanProduk.jsx`, pembaruan `TabelProduk.jsx`, dan penyesuaian query di `app/page.jsx`.

## US-48: Varian harga per ukuran

**Prompt:**
[SENDIRI] Sediakan modul pengelolaan varian per produk di `/admin/produk/[id]/varian`, tampilkan pilihan varian dinamis di halaman detail produk dengan penyesuaian harga satuan otomatis, dan sertakan nama varian terpilih ke dalam pesan WhatsApp.

**Hasil:**
Admin dapat membuka halaman varian dari tabel produk untuk menambah dan menghapus varian harga. Halaman detail `/produk/[id]` membaca varian dari database Supabase (`varian_produk`). Komponen `KotakPemesanan.jsx` menyesuaikan harga total saat varian dipilih dan mencantumkan varian terpilih ke dalam draft pesan WhatsApp.

**Perbaikan:**
Pembuatan Server Actions `app/admin/produk/[id]/varian/actions.js`, komponen `KelolaVarian.jsx`, rute `app/admin/produk/[id]/varian/page.jsx`, penautan di `TabelProduk.jsx`, serta sinkronisasi query tabel `varian_produk` di `app/produk/[id]/page.jsx`.

## US-49: Halaman per kategori

**Prompt:**
Buat halaman publik khusus kategori `/kategori/[slug]` yang dapat dibagikan dan menampilkan seluruh produk dalam kategori tersebut.

**Hasil:**
Rute dinamis `app/kategori/[slug]/page.jsx` memuat data produk berdasarkan nama kategori dari database Supabase, menampilkan judul dan jumlah produk, menangani 404 jika kategori tidak ditemukan, dan melengkapi metadata halaman dinamis. Nama kategori pada kartu produk dan detail produk diarahkan ke halaman ini.

**Perbaikan:**
Pembuatan rute dinamis `app/kategori/[slug]/page.jsx` dan penautan URL kategori di `components/KartuProduk.jsx` serta `app/produk/[id]/page.jsx`.

## US-50: Asisten AI tanya jawab produk

**Prompt:**
Sediakan asisten AI interaktif tanya jawab seputar produk di halaman detail dengan pembatasan token, rate limiting, dan jawaban berdasar konteks produk.

**Hasil:**
Komponen `KotakTanya.jsx` di halaman detail terhubung ke route handler `app/api/tanya-produk/route.js`. Endpoint membatasi panjang pertanyaan (maksimal 300 karakter), membatasi frekuensi kirim (rate limiting 5 pertanyaan/menit via cookie), memanggil Groq Llama-3 API di server secara aman, dan mengembalikan jawaban ramah sesuai data produk.

**Perbaikan:**
Pembuatan route handler `app/api/tanya-produk/route.js`, komponen `KotakTanya.jsx`, dan penempatannya di `app/produk/[id]/page.jsx`.


