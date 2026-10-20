-- Skema database Katalog UMKM
-- Cara pakai: Supabase > SQL Editor > New query > tempel seluruh isi file ini > Run.
-- Aman dijalankan ulang.

-- 1. Tabel produk
create table if not exists public.produk (
  id bigint generated always as identity primary key,
  nama text not null,
  harga integer not null check (harga >= 0),
  deskripsi text,
  foto_url text,
  kategori text,
  created_at timestamptz not null default now()
);

-- US-18: Galeri foto (array URL)
alter table public.produk add column if not exists foto_urls text[] default '{}';

-- US-19: Status stok (null = tidak terbatas)
alter table public.produk add column if not exists stok integer default null;

-- US-20: Harga diskon dan badge
alter table public.produk add column if not exists harga_diskon integer default null;
alter table public.produk add column if not exists badge text default null;

-- US-32: Aktif/nonaktif produk
alter table public.produk add column if not exists aktif boolean not null default true;

-- US-47: Urutan tampil
alter table public.produk add column if not exists urutan integer default 0;

-- 2. Row Level Security
alter table public.produk enable row level security;

drop policy if exists "admin_baca_produk" on public.produk;
drop policy if exists "admin_tambah_produk" on public.produk;
drop policy if exists "admin_ubah_produk" on public.produk;
drop policy if exists "admin_hapus_produk" on public.produk;

create policy "admin_baca_produk" on public.produk
  for select to authenticated using (true);

create policy "admin_tambah_produk" on public.produk
  for insert to authenticated with check (true);

create policy "admin_ubah_produk" on public.produk
  for update to authenticated using (true) with check (true);

create policy "admin_hapus_produk" on public.produk
  for delete to authenticated using (true);

-- 3. Tabel ulasan (US-38)
create table if not exists public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  komentar text,
  status text not null default 'pending',
  ditampilkan boolean not null default true,
  created_at timestamptz not null default now()
);

-- Pastikan kolom status dan ditampilkan ada jika tabel sudah pernah dibuat sebelumnya
alter table public.ulasan add column if not exists status text not null default 'pending';
alter table public.ulasan add column if not exists ditampilkan boolean not null default true;

alter table public.ulasan enable row level security;

drop policy if exists "siapa_saja_baca_ulasan" on public.ulasan;
drop policy if exists "siapa_saja_tambah_ulasan" on public.ulasan;
drop policy if exists "admin_kelola_ulasan" on public.ulasan;

create policy "siapa_saja_baca_ulasan" on public.ulasan
  for select using (ditampilkan = true);

create policy "siapa_saja_tambah_ulasan" on public.ulasan
  for insert with check (true);

create policy "admin_kelola_ulasan" on public.ulasan
  for all to authenticated using (true) with check (true);

-- 4. Tabel klik_wa (US-40)
create table if not exists public.klik_wa (
  id bigint generated always as identity primary key,
  produk_id bigint references public.produk(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.klik_wa enable row level security;

drop policy if exists "siapa_saja_catat_klik" on public.klik_wa;
drop policy if exists "admin_baca_klik" on public.klik_wa;

create policy "siapa_saja_catat_klik" on public.klik_wa
  for insert with check (true);

create policy "admin_baca_klik" on public.klik_wa
  for select to authenticated using (true);

-- 5. Tabel banner (US-42)
create table if not exists public.banner (
  id bigint generated always as identity primary key,
  judul text not null,
  teks text,
  gambar_url text,
  tautan text,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.banner enable row level security;

drop policy if exists "publik_baca_banner" on public.banner;
drop policy if exists "admin_kelola_banner" on public.banner;

create policy "publik_baca_banner" on public.banner
  for select using (aktif = true);

create policy "admin_kelola_banner" on public.banner
  for all to authenticated using (true) with check (true);

-- 6. Tabel toko_setting (US-43)
create table if not exists public.toko_setting (
  id bigint generated always as identity primary key,
  nama text not null,
  nomor_wa text not null,
  jam_buka text,
  alamat text
);

alter table public.toko_setting enable row level security;

drop policy if exists "publik_baca_toko" on public.toko_setting;
drop policy if exists "admin_kelola_toko" on public.toko_setting;

create policy "publik_baca_toko" on public.toko_setting
  for select using (true);

create policy "admin_kelola_toko" on public.toko_setting
  for all to authenticated using (true) with check (true);

-- 7. Tabel aktivitas_log (US-45)
create table if not exists public.aktivitas_log (
  id bigint generated always as identity primary key,
  user_email text,
  aksi text not null,
  detail text,
  created_at timestamptz not null default now()
);

alter table public.aktivitas_log enable row level security;

drop policy if exists "admin_baca_log" on public.aktivitas_log;
drop policy if exists "admin_tambah_log" on public.aktivitas_log;

create policy "admin_baca_log" on public.aktivitas_log
  for select to authenticated using (true);

create policy "admin_tambah_log" on public.aktivitas_log
  for insert to authenticated with check (true);

-- 8. Tabel varian (US-48)
create table if not exists public.varian (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null,
  harga integer not null check (harga >= 0)
);

alter table public.varian enable row level security;

drop policy if exists "siapa_saja_baca_varian" on public.varian;
drop policy if exists "admin_kelola_varian" on public.varian;

create policy "siapa_saja_baca_varian" on public.varian
  for select using (true);

create policy "admin_kelola_varian" on public.varian
  for all to authenticated using (true) with check (true);

-- 9. Data produk awal (hanya diisi jika tabel masih kosong)
insert into public.produk (nama, harga, deskripsi, foto_url, kategori)
select * from (values
  ('Kopi Bubuk Robusta 250 g', 45000, 'Biji robusta disangrai sedang lalu digiling halus. Cocok untuk kopi tubruk dan kopi susu.', '/produk/kopi.svg', 'Minuman'),
  ('Keripik Singkong Balado', 15000, 'Singkong iris tipis, digoreng renyah, dibalut bumbu balado pedas manis.', '/produk/keripik.svg', 'Camilan'),
  ('Sambal Bawang Botol 150 ml', 25000, 'Cabai rawit dan bawang putih goreng dengan minyak, tahan hingga 2 bulan.', '/produk/sambal.svg', 'Bumbu'),
  ('Kue Nastar Toples 500 g', 85000, 'Nastar lembut dengan selai nanas buatan sendiri. Dikemas toples kedap udara.', '/produk/nastar.svg', 'Kue kering'),
  ('Tas Anyaman Pandan', 120000, 'Dianyam tangan dari daun pandan kering, dilapisi kain di bagian dalam.', '/produk/tas.svg', 'Kerajinan'),
  ('Kain Batik Cap 2 m', 175000, 'Batik cap motif parang di atas kain katun primisima, panjang 2 meter.', '/produk/batik.svg', 'Kain')
) as data_awal (nama, harga, deskripsi, foto_url, kategori)
where not exists (select 1 from public.produk);
