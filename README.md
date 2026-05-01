# MAX Mobile Service

Aplikasi manajemen service HP untuk **MAX Mobile Service** — Apple & Android, lengkap dengan POS, inventory, multi-cabang, multi-role, dan faktur elektronik.

## Demo

- 🌐 **Custom domain**: https://maxmobileservice.web.id
- 🔗 **GitHub Pages**: https://mshadianto.github.io/servicehpreza/

## Fitur Utama

### Tiket Servis
- Splash screen + login multi-role (Owner / Kasir / Teknisi)
- Dashboard statistik real-time (total tiket, proses, selesai, pendapatan harian)
- **Form Terima Servis Baru** wizard 4-langkah: Perangkat → Pelanggan → Servis → Konfirmasi
- **Harga manual editable** — override harga servis per-tiket + tambah barang/spare-part custom (nama, qty, harga)
- Detail tiket dengan timeline status (Diterima → Antri → Diagnosa → Menunggu → Repair → Selesai → Diambil)
- Edit diagnosa, assign teknisi, update status, DP & sisa pembayaran
- Servis Kilat ⚡ (prioritas)

### Faktur & Komunikasi Pelanggan
- 📄 **Faktur Elektronik Servis** mirip nota digital — logo toko, info pelanggan & perangkat, detail biaya (servis + spare-part), syarat & ketentuan, status pembayaran (LUNAS / BELUM LUNAS), garansi
- 📲 **QR Code tracking** di setiap faktur — pelanggan scan untuk buka halaman lacak status
- 📱 **Halaman lacak publik** dengan auto-load dari URL hash (`#track-<RESI>`)
- 📨 Kirim notifikasi WhatsApp (status masuk, diagnosa, selesai) + kirim faktur lengkap via WA

### POS & Inventory
- Kasir/POS dengan kategori, barcode, multi-payment (cash / QRIS)
- Inventory spare-part: stok, harga modal, harga jual, margin, supplier, barcode
- Riwayat penjualan, struk thermal print-friendly
- Purchase Order ke supplier, history kulakan
- Export CSV inventory, riwayat transaksi

### Multi-Cabang & Lainnya
- 3 cabang siap pakai (Pusat, Pamulang, Tangsel) — bisa dirombak via UI Settings
- Filter & pencarian universal (resi, nama, brand, model)
- Dark mode
- Offline mode — semua data demo otomatis aktif kalau Supabase tidak tersedia (persist via `localStorage`)

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 |
| Build Tool | Vite 5 |
| Database | Supabase (PostgreSQL) — opsional |
| Hosting | GitHub Pages + custom domain |
| QR Code | api.qrserver.com (eksternal, no install) |

## Setup Lokal

```bash
# Clone repo
git clone https://github.com/mshadianto/servicehpreza.git
cd servicehpreza

# Install dependencies
npm install

# (Opsional) salin environment variables — kalau tidak diisi, app jalan offline pakai data demo
cp .env.example .env
# Edit .env: VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY

# Jalankan dev server
npm run dev
```

## Setup Database (Opsional)

1. Buat project di [Supabase](https://supabase.com)
2. Buka SQL Editor
3. Jalankan `supabase/schema.sql`
4. Copy URL dan anon key ke `.env`

## Custom Domain

Domain `maxmobileservice.web.id` (registrar via PANDI, DNS via Sumopod):
- Nameserver: `ns1.sumopod.com`, `ns2.sumopod.com`
- A record `@` → 4 IP GitHub Pages (`185.199.108–111.153`)
- CNAME `www` → `mshadianto.github.io.`
- File `public/CNAME` di repo: `MaxMobileService.web.id`

## Deploy

Push ke branch `main` otomatis trigger GitHub Actions deploy ke GitHub Pages.

```bash
git push origin main
```

## Lisensi

Private project untuk MAX Mobile Service.
