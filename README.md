# MAX Mobile Service

Aplikasi manajemen service HP untuk **MAX Mobile Service** — Apple & Android.

## Demo

**[Live App](https://mshadianto.github.io/servicehpreza/)**

## Fitur

- Splash screen dengan logo dan animasi
- Dashboard statistik (total, proses, selesai, hari ini, pendapatan)
- Form service order multi-step (Customer, Perangkat, Kerusakan, Biaya)
- Detail service dengan timeline status (Diterima > Diagnosa > Proses > Selesai > Diambil)
- Nota service & kirim via WhatsApp
- Filter dan pencarian data service
- Dark mode
- Offline mode (data demo jika Supabase tidak terhubung)

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 |
| Build Tool | Vite 5 |
| Database | Supabase (PostgreSQL) |
| Hosting | GitHub Pages |

## Setup Lokal

```bash
# Clone repo
git clone https://github.com/mshadianto/servicehpreza.git
cd servicehpreza

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env dan isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY

# Jalankan dev server
npm run dev
```

## Setup Database

1. Buat project di [Supabase](https://supabase.com)
2. Buka SQL Editor
3. Jalankan `supabase/schema.sql`
4. Copy URL dan anon key ke `.env`

## Deploy

Push ke branch `main` otomatis deploy ke GitHub Pages via GitHub Actions.

```bash
git push origin main
```

## Screenshot

Aplikasi mobile-first dengan desain modern, mendukung dark mode.

## Lisensi

Private project untuk MAX Mobile Service.
