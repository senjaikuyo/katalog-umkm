-- Skema Tambahan untuk Fitur Bonus Katalog UMKM
-- Jalankan di Supabase > SQL Editor > New Query > Run
-- Aman dijalankan berulang kali (idempotent)

-- 1. Tambahan Kolom ke Tabel Produk
alter table public.produk add column if not exists stok integer not null default 10;
alter table public.produk add column if not exists harga_diskon integer default null check (harga_diskon is null or harga_diskon >= 0);
alter table public.produk add column if not exists badge text default null;
alter table public.produk add column if not exists foto_tambahan text[] default '{}';
alter table public.produk add column if not exists urutan integer not null default 0;
alter table public.produk add column if not exists aktif boolean not null default true;

-- 2. Tabel Kategori
create table if not exists public.kategori (
  id bigint generated always as identity primary key,
  nama text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.kategori enable row level security;
drop policy if exists "publik_baca_kategori" on public.kategori;
drop policy if exists "admin_kelola_kategori" on public.kategori;
create policy "publik_baca_kategori" on public.kategori for select using (true);
create policy "admin_kelola_kategori" on public.kategori for all to authenticated using (true) with check (true);

-- Isi kategori awal dari kategori unik yang sudah ada di produk
insert into public.kategori (nama, slug)
select distinct kategori, lower(regexp_replace(kategori, '[^a-zA-Z0-9]+', '-', 'g'))
from public.produk
where kategori is not null and kategori <> ''
on conflict (nama) do nothing;

-- 3. Tabel Varian Produk (US-48)
create table if not exists public.varian_produk (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama_varian text not null,
  harga integer not null check (harga >= 0),
  created_at timestamptz not null default now()
);

alter table public.varian_produk enable row level security;
drop policy if exists "publik_baca_varian" on public.varian_produk;
drop policy if exists "admin_kelola_varian" on public.varian_produk;
create policy "publik_baca_varian" on public.varian_produk for select using (true);
create policy "admin_kelola_varian" on public.varian_produk for all to authenticated using (true) with check (true);

-- 4. Tabel Ulasan Produk (US-38, US-39)
create table if not exists public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  komentar text,
  status text not null default 'pending', -- 'pending', 'disetujui', 'ditolak'
  created_at timestamptz not null default now()
);

alter table public.ulasan enable row level security;
drop policy if exists "publik_baca_ulasan_disetujui" on public.ulasan;
drop policy if exists "publik_tambah_ulasan" on public.ulasan;
drop policy if exists "admin_kelola_ulasan" on public.ulasan;
create policy "publik_baca_ulasan_disetujui" on public.ulasan for select using (status = 'disetujui');
create policy "publik_tambah_ulasan" on public.ulasan for insert with check (true);
create policy "admin_kelola_ulasan" on public.ulasan for all to authenticated using (true) with check (true);

-- 5. Tabel Pencatatan Klik WhatsApp (US-40, US-41)
create table if not exists public.klik_whatsapp (
  id bigint generated always as identity primary key,
  produk_id bigint references public.produk(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.klik_whatsapp enable row level security;
drop policy if exists "publik_tambah_klik" on public.klik_whatsapp;
drop policy if exists "admin_baca_klik" on public.klik_whatsapp;
create policy "publik_tambah_klik" on public.klik_whatsapp for insert with check (true);
create policy "admin_baca_klik" on public.klik_whatsapp for select to authenticated using (true);

-- 6. Tabel Banner Promo (US-42)
create table if not exists public.banner (
  id bigint generated always as identity primary key,
  judul text not null,
  teks text,
  gambar_url text not null,
  link text,
  aktif boolean not null default true,
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.banner enable row level security;
drop policy if exists "publik_baca_banner" on public.banner;
drop policy if exists "admin_kelola_banner" on public.banner;
create policy "publik_baca_banner" on public.banner for select using (aktif = true);
create policy "admin_kelola_banner" on public.banner for all to authenticated using (true) with check (true);

-- 7. Tabel Pengaturan Toko (US-43)
create table if not exists public.pengaturan (
  kunci text primary key,
  nilai text not null
);

alter table public.pengaturan enable row level security;
drop policy if exists "publik_baca_pengaturan" on public.pengaturan;
drop policy if exists "admin_kelola_pengaturan" on public.pengaturan;
create policy "publik_baca_pengaturan" on public.pengaturan for select using (true);
create policy "admin_kelola_pengaturan" on public.pengaturan for all to authenticated using (true) with check (true);

-- 8. Tabel Log Aktivitas Admin (US-45)
create table if not exists public.log_aktivitas (
  id bigint generated always as identity primary key,
  admin_email text,
  aksi text not null,
  detail text,
  created_at timestamptz not null default now()
);

alter table public.log_aktivitas enable row level security;
drop policy if exists "admin_kelola_log" on public.log_aktivitas;
create policy "admin_kelola_log" on public.log_aktivitas for all to authenticated using (true) with check (true);

-- 9. Storage Bucket untuk Foto Produk (US-29)
insert into storage.buckets (id, name, public)
values ('produk', 'produk', true)
on conflict (id) do update set public = true;

drop policy if exists "publik_lihat_foto" on storage.objects;
drop policy if exists "admin_unggah_foto" on storage.objects;
drop policy if exists "admin_ubah_foto" on storage.objects;
drop policy if exists "admin_hapus_foto" on storage.objects;

create policy "publik_lihat_foto" on storage.objects
  for select using (bucket_id = 'produk');

create policy "admin_unggah_foto" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'produk');

create policy "admin_ubah_foto" on storage.objects
  for update to authenticated
  using (bucket_id = 'produk');

create policy "admin_hapus_foto" on storage.objects
  for delete to authenticated
  using (bucket_id = 'produk');
