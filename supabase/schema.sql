-- MAX Mobile Service — Supabase schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/vafdtlclokssurcfydqh/sql

create table if not exists public.services (
  id              text primary key,
  "namaCustomer"  text not null,
  "noHP"          text not null,
  email           text,
  alamat          text,
  "merkHP"        text,
  "tipeHP"        text,
  "warnaHP"       text,
  imei            text,
  kondisi         text,
  kelengkapan     text,
  kerusakan       text,
  keluhan         text,
  prioritas       text default 'Normal',
  status          text default 'Diterima',
  "biayaEstimasi" numeric default 0,
  "uangMuka"      numeric default 0,
  teknisi         text,
  "passwordHP"    text,
  garansi         text default 'Tidak',
  "tglEstSelesai" date,
  "tanggalMasuk"  date default current_date,
  catatan         text,
  rating          smallint default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- If table already exists, add new v3 columns
alter table public.services add column if not exists email  text;
alter table public.services add column if not exists rating smallint default 0;

create index if not exists services_status_idx      on public.services(status);
create index if not exists services_tanggal_idx     on public.services("tanggalMasuk" desc);
create index if not exists services_created_at_idx  on public.services(created_at desc);

-- Auto-update updated_at on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

-- Auto-generate id if not provided (format: SRV001, SRV002, ...)
create or replace function public.services_autogen_id()
returns trigger
language plpgsql
as $$
declare
  next_num int;
begin
  if new.id is null or new.id = '' then
    select coalesce(max(nullif(regexp_replace(id, '\D', '', 'g'), '')::int), 0) + 1
      into next_num
      from public.services
     where id ~ '^SRV\d+$';
    new.id := 'SRV' || lpad(next_num::text, 3, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists services_autogen_id on public.services;
create trigger services_autogen_id
before insert on public.services
for each row execute function public.services_autogen_id();

-- Row-level security: allow anon read/write (adjust for production!)
alter table public.services enable row level security;

drop policy if exists "services_select_anon" on public.services;
drop policy if exists "services_insert_anon" on public.services;
drop policy if exists "services_update_anon" on public.services;
drop policy if exists "services_delete_anon" on public.services;

create policy "services_select_anon" on public.services for select  using (true);
create policy "services_insert_anon" on public.services for insert  with check (true);
create policy "services_update_anon" on public.services for update  using (true) with check (true);
create policy "services_delete_anon" on public.services for delete  using (true);

-- Seed demo data (optional — comment out if not desired)
insert into public.services (id, "namaCustomer", "noHP", email, alamat, "merkHP", "tipeHP", "warnaHP", imei, kondisi, kelengkapan, kerusakan, keluhan, prioritas, status, "biayaEstimasi", "uangMuka", teknisi, "passwordHP", garansi, "tglEstSelesai", "tanggalMasuk", catatan, rating) values
  ('SRV001','Ahmad Fadli','081234567890','ahmad@mail.com','Jl. Melati No.12, Ciputat','Samsung','Galaxy A54','Hitam','354678091234567','Lecet Ringan','Charger,Kabel Data','LCD Pecah','Layar retak setelah jatuh','Urgent','Proses',450000,200000,'Pak Budi','1234','Tidak','2026-04-18','2026-04-14','Sparepart sudah dipesan',0),
  ('SRV002','Siti Rahma','085678901234','siti@mail.com','Jl. Kenanga No.5, Pamulang','iPhone','iPhone 13','Putih','490154203237518','Mulus','Charger,Dus/Box,Case/Casing','Baterai Drop','Health 72%','Normal','Selesai',600000,300000,'Pak Eko','Face ID','Ya','2026-04-15','2026-04-12','Original Apple',5),
  ('SRV003','Budi Santoso','087890123456',null,'Jl. Dahlia No.8, Serpong','Xiaomi','Redmi Note 12','Biru',null,'Lecet Berat','Charger','Mati Total','Kena air hujan','Express','Diagnosa',0,50000,'Pak Andi','Pola','Tidak',null,'2026-04-15','Cek mesin',0),
  ('SRV004','Dewi Putri','089012345678','dewi@mail.com','Jl. Anggrek No.3, BSD','OPPO','Reno 10','Gold','867530012345678','Mulus','Charger,SIM Card','Charging Error','Port longgar','Normal','Diterima',150000,0,null,null,'Ya','2026-04-19','2026-04-15',null,0),
  ('SRV005','Rudi Hartono','081345678901',null,'Jl. Mawar No.20, Pondok Aren','Vivo','V29','Ungu',null,'Lecet Ringan','Charger,Case/Casing','Kamera Error','Blur tidak fokus','Urgent','Proses',350000,150000,'Pak Budi','5678','Tidak','2026-04-16','2026-04-13','Modul kamera',0),
  ('SRV006','Aisyah Nur','082567890123','aisyah@mail.com','Jl. Flamboyan No.15, Ciputat Timur','Samsung','Galaxy S23','Hijau','352789041234567','Mulus','Charger,Kabel Data,Dus/Box,Screen Guard','Software/Hang','Restart sendiri','Normal','Diambil',200000,100000,'Pak Eko','Pattern','Ya','2026-04-13','2026-04-10','Reset + update',5),
  ('SRV007','Yusuf Maulana','081567890123',null,'Jl. Kemuning No.7, Bintaro','iPhone','iPhone 12 Pro','Silver','353012345678901','Mulus','Charger,Dus/Box','Touchscreen Error','Layar tidak responsif di sebagian area','Urgent','Selesai',850000,400000,'Pak Reza','Face ID','Ya','2026-04-14','2026-04-11','LCD assembly diganti',4)
on conflict (id) do nothing;
