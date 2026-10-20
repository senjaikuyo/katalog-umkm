# Handoff Resume: Proyek Katalog UMKM

Dokumen ringkasan untuk melanjutkan pengerjaan proyek secara langsung di Antigravity (atau AI agent lainnya).

---

## 1. Konteks Proyek & Stack
- **Direktori:** `/home/senjaikuyo/Projects/katalog-umkm`
- **Framework:** Next.js 16 (App Router, JavaScript), React 19, Tailwind CSS v4, Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Aturan Arsitektur & Keamanan:**
  - Supabase client hanya diakses di sisi server (Server Component, Server Action, Proxy).
  - Environment variable tidak boleh berawalan `NEXT_PUBLIC_`.
  - Next.js 16 route protection menggunakan `proxy.js` di root (pengganti `middleware.js`).
  - Dinamis params di Next.js 16 adalah Promise: `const { id } = await params;` dan `const sp = await searchParams;`.
  - Pola commit: 1 user story = 1 commit rapi (Conventional Commits) + testing build (`npm run build`) + update `PROMPTS.md` + `git push`.
  - API Key Groq sudah tersimpan di `.env.local` sebagai `GROQ_API_KEY` untuk fitur AI (US-14, US-50).
  - Skema SQL fitur bonus sudah disiapkan di `docs/schema-bonus.sql`.

---

## 2. Status Pekerjaan (US-01 s/d US-12 Sudah Selesai & Push)

| User Story | Status | Komponen / File Terkait |
|---|---|---|
| **US-01: Katalog dari database** | Selesai | `app/page.jsx` |
| **US-02: Detail produk** | Selesai | `app/produk/[id]/page.jsx` |
| **US-03: Pesan via WhatsApp** | Selesai | `components/TombolWhatsApp.jsx` |
| **US-04: Login admin** | Selesai | `app/admin/login/page.jsx`, `app/admin/actions.js` |
| **US-05: Ganti password** | Selesai | `app/admin/password/page.jsx`, `app/admin/actions.js` |
| **US-06: Proteksi halaman admin** | Selesai | `proxy.js` |
| **US-07: List Produk admin** | Selesai | `app/admin/page.jsx` (baca database Supabase) |
| **US-08: Tambah produk** | Selesai | `app/admin/produk/baru/page.jsx`, `components/FormProduk.jsx`, `tambahProdukAction` |
| **US-09: Ubah produk** | Selesai | `app/admin/produk/[id]/ubah/page.jsx`, `components/FormUbahProduk.jsx`, `ubahProdukAction` |
| **US-10: Hapus produk** | Selesai | `components/TombolHapusProduk.jsx`, `components/TabelProduk.jsx`, `hapusProdukAction` |
| **US-11: Filter & Pencarian** | Selesai | `components/FilterKatalog.jsx`, `app/page.jsx` (query dynamic `ilike` & `eq`) |
| **US-12: Pilih jumlah / varian** | Selesai | `components/KotakPemesanan.jsx`, `app/produk/[id]/page.jsx` |

Semua commit di atas sudah ter-push ke GitHub repo (`origin/main`).

---

## 3. Fitur Berikutnya yang Harus Dikerjakan (Mulai dari US-13)

Kriteria detail setiap fitur ada di `docs/user-stories.md`:

1. **US-13: PWA** (10 poin)
   - Buat Web App Manifest di `app/manifest.json` (atau `app/manifest.js` route Next.js).
   - Tautkan ikon dari `public/icons` (`icon-192.png`, `icon-512.png`).
   - Meta tags PWA di `app/layout.jsx`.

2. **US-14: Deskripsi produk dibuat AI** (10 poin)
   - Pakai Groq API (`GROQ_API_KEY` di server).
   - Tombol "Buat deskripsi dengan AI" di form produk admin (`/admin/produk/baru` dan ubah).
   - Isi otomatis textarea deskripsi sebelum simpan.

3. **US-15: Urutkan produk** (5 poin)
   - Termurah, termahal, terbaru via query database di `app/page.jsx`.

4. **US-16: Paginasi atau muat lebih banyak** (10 poin)
   - Paginasi limit & offset di query Supabase `app/page.jsx`.

5. **US-17: Produk terkait di halaman detail** (5 poin)
   - Rekomendasi kategori sama di `app/produk/[id]/page.jsx`.

6. **US-18: Galeri beberapa foto produk** (10 poin)
7. **US-19 & US-20: Status stok, harga coret, dan badge promo** (5 + 5 poin)
8. **US-21 s/d US-50 & K-6 s/d K-13** sesuai urutan roadmap.

---

## 4. Cara Melanjutkan di Antigravity
Cukup beri prompt ke Antigravity:
```
Baca file HANDOFF.md dan docs/user-stories.md. US-01 sampai US-12 sudah selesai dan sudah dipush ke Git. Lanjutkan implementasi mulai dari US-13 (PWA), jalankan pengujian build, update PROMPTS.md, dan commit serta push secara bertahap.
```
