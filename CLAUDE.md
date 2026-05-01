# MAX Mobile Service - Service HP Reza

## Project Overview
Aplikasi manajemen service HP (Apple & Android) untuk MAX Mobile Service. Single-page React app yang di-deploy ke GitHub Pages dengan custom domain.

## Tech Stack
- **Frontend**: React 18 + Vite 5
- **Backend**: Supabase (PostgreSQL + REST API), fallback ke localStorage / data demo
- **Deploy**: GitHub Pages via GitHub Actions
- **Custom domain**: https://maxmobileservice.web.id (DNS via Sumopod, NS: ns1/ns2.sumopod.com)
- **Fallback URL**: https://mshadianto.github.io/servicehpreza/

## Commands
- `npm run dev` — jalankan dev server lokal
- `npm run build` — build production ke folder `dist/`
- `npm run preview` — preview hasil build

## Architecture
- Semua UI ada di `src/App.jsx` (single-file component dengan banyak sub-component internal)
- Supabase client di `src/lib/supabase.js`
- Logo di `src/assets/logo.jpeg` (di-import sebagai `logoImg`)
- Custom domain: `public/CNAME` berisi `MaxMobileService.web.id`
- Database schema di `supabase/schema.sql`
- Jika Supabase key tidak tersedia, app berjalan dengan data demo (offline mode) dan persist via `useLS` hook (localStorage)

## Komponen Utama (di `src/App.jsx`)
- `NewTicketModal` — wizard 4-step untuk Terima Servis Baru. Step 3 mendukung input harga manual untuk servis yg dipilih dan tambah barang/spare part custom (nama, qty, harga editable).
- `TicketDetail` — detail tiket + tombol Print, Faktur, dan Tutup.
- `InvoiceModal` — Faktur Elektronik Servis: header dengan logo, info pelanggan & perangkat, detail biaya, syarat & ketentuan, QR code tracking, tombol Cetak + Kirim WA. URL QR pakai `api.qrserver.com` (eksternal, tidak butuh lib).
- `ReceiptModal` — struk POS (terpisah dari faktur servis).
- `TrackingPage` — halaman publik untuk lacak status. **Auto-load dari URL hash** `#track-<RESI>` sehingga link WA / QR code langsung membuka tiketnya tanpa paste manual.

## Data Shape
- `tickets[*].services` — `[{ id, name, price }]`. Harga bisa diedit di form (override per-tiket).
- `tickets[*].parts` — `[{ id, name, qty, price }]`. Item custom yang diinput manual; total cost tiket = sum services + sum (qty × price) parts.
- `tickets[*].sisa` — derived dari `totalCost - dp`. `lunas` di faktur = `sisa <= 0 && totalCost > 0`.

## Environment Variables
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- Lihat `.env.example` untuk contoh

## Deploy
Push ke branch `main` otomatis trigger GitHub Actions deploy ke GitHub Pages. Secrets Supabase diatur di repository settings. Setelah deploy, custom domain `maxmobileservice.web.id` otomatis terupdate (CNAME sudah di repo).

## DNS Custom Domain (referensi)
- A `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- CNAME `www` → `mshadianto.github.io.`
- Nameserver registrar (PANDI) → `ns1.sumopod.com` & `ns2.sumopod.com`
- DNS Zone Editor di panel Sumopod (NS authoritative ada di sana)
