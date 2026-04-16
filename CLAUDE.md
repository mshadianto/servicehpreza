# MAX Mobile Service - Service HP Reza

## Project Overview
Aplikasi manajemen service HP (Apple & Android) untuk MAX Mobile Service. Single-page React app yang di-deploy ke GitHub Pages.

## Tech Stack
- **Frontend**: React 18 + Vite 5
- **Backend**: Supabase (PostgreSQL + REST API)
- **Deploy**: GitHub Pages via GitHub Actions
- **URL**: https://mshadianto.github.io/servicehpreza/

## Commands
- `npm run dev` — jalankan dev server lokal
- `npm run build` — build production ke folder `dist/`
- `npm run preview` — preview hasil build

## Architecture
- Semua UI ada di `src/App.jsx` (single-file component)
- Supabase client di `src/lib/supabase.js`
- Logo di `src/assets/logo.jpeg`
- Database schema di `supabase/schema.sql`
- Jika Supabase key tidak tersedia, app berjalan dengan data demo (offline mode)

## Environment Variables
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- Lihat `.env.example` untuk contoh

## Deploy
Push ke branch `main` otomatis trigger GitHub Actions deploy ke GitHub Pages. Secrets Supabase diatur di repository settings.
