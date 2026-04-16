-- MAX Mobile Service — Supabase schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/vafdtlclokssurcfydqh/sql

create table if not exists public.services (
  id              text primary key,
  "namaCustomer"  text not null,
  "noHP"          text not null,
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
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

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
insert into public.services (id, "namaCustomer", "noHP", alamat, "merkHP", "tipeHP", "warnaHP", imei, kondisi, kelengkapan, kerusakan, keluhan, prioritas, status, "biayaEstimasi", "uangMuka", teknisi, "passwordHP", garansi, "tglEstSelesai", "tanggalMasuk", catatan) values
  ('SRV001','Ahmad Fadli','081234567890','Jl. Melati No.12, Ciputat','Samsung','Galaxy A54','Hitam','354678091234567','Lecet Ringan','Charger,Kabel Data','LCD Pecah','Layar retak setelah jatuh dari meja','Urgent','Proses',450000,200000,'Pak Budi','1234','Tidak','2026-04-12','2026-04-08','Sparepart sudah dipesan'),
  ('SRV002','Siti Rahma','085678901234','Jl. Kenanga No.5, Pamulang','iPhone','iPhone 13','Putih','490154203237518','Mulus','Charger,Dus/Box,Case/Casing','Baterai Drop','Baterai cepat habis, health 72%','Normal','Selesai',600000,300000,'Pak Eko','Face ID','Ya','2026-04-10','2026-04-07','Baterai original Apple'),
  ('SRV003','Budi Santoso','087890123456','Jl. Dahlia No.8, Serpong','Xiaomi','Redmi Note 12','Biru',null,'Lecet Berat','Charger','Mati Total','HP mati setelah kena air hujan','Express','Diagnosa',0,50000,'Pak Andi','Pola','Tidak',null,'2026-04-09','Perlu cek mesin & IC power'),
  ('SRV004','Dewi Putri','089012345678','Jl. Anggrek No.3, BSD','OPPO','Reno 10','Gold','867530012345678','Mulus','Charger,SIM Card','Charging Error','Port charging longgar, kadang konek kadang tidak','Normal','Diterima',150000,0,null,null,'Ya','2026-04-14','2026-04-10',null),
  ('SRV005','Rudi Hartono','081345678901','Jl. Mawar No.20, Pondok Aren','Vivo','V29','Ungu',null,'Lecet Ringan','Charger,Case/Casing','Kamera Error','Kamera belakang blur & tidak bisa fokus','Urgent','Proses',350000,150000,'Pak Budi','5678','Tidak','2026-04-11','2026-04-06','Modul kamera perlu diganti'),
  ('SRV006','Aisyah Nur','082567890123','Jl. Flamboyan No.15, Ciputat Timur','Samsung','Galaxy S23','Hijau','352789041234567','Mulus','Charger,Kabel Data,Dus/Box,Screen Guard','Software/Hang','HP sering restart sendiri & lag','Normal','Selesai',200000,100000,'Pak Eko','Pattern','Ya','2026-04-08','2026-04-05','Factory reset + update firmware')
on conflict (id) do nothing;
