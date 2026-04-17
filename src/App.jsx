import React, { useState, useEffect, useMemo, useRef } from "react";
import logoImg from "./assets/logo.jpeg";

// ==========================================================================
// SERVISKITA PRO v2.0 — Service Management + POS Multi-Cabang Enterprise
// Upgrade: Login multi-role, POS Kasir, Servis Kilat, Inventaris+Foto,
//          Supplier, Riwayat Kulakan, Print Struk, Export CSV, Theme Toggle
// Single-file JSX • localStorage • Bahasa Indonesia
// ==========================================================================

// ---------- DATA ----------
const BRANCHES = [
  { id: "b1", name: "MAX Mobile Pusat",    addr: "Jl. Margonda Raya No. 12, Depok",    phone: "021-7788-1234", owner: "Pusat" },
  { id: "b2", name: "MAX Mobile Pamulang", addr: "Jl. Siliwangi No. 45, Pamulang",     phone: "021-7788-2345", owner: "Cabang" },
  { id: "b3", name: "MAX Mobile Tangsel",  addr: "Jl. BSD Boulevard No. 8, Tangsel",   phone: "021-7788-3456", owner: "Cabang" },
];

const DEVICE_TYPES = [
  { id: "hp-android", name: "HP Android",  icon: "📱" },
  { id: "hp-ios",     name: "iPhone",      icon: "📱" },
  { id: "tab-android",name: "Tablet",      icon: "📲" },
  { id: "tab-ios",    name: "iPad",        icon: "📲" },
  { id: "laptop",     name: "Laptop",      icon: "💻" },
  { id: "pc",         name: "PC Desktop",  icon: "🖥️" },
];

const SERVICE_CATS = [
  { id: "lcd",     name: "LCD / Layar",        icon: "🖼️" },
  { id: "battery", name: "Baterai",            icon: "🔋" },
  { id: "board",   name: "Mesin / Mainboard",  icon: "🔧" },
  { id: "soft",    name: "Software / OS",      icon: "💿" },
  { id: "charger", name: "Port / Charger",     icon: "🔌" },
  { id: "camera",  name: "Kamera",             icon: "📷" },
  { id: "speaker", name: "Speaker / Audio",    icon: "🔊" },
  { id: "water",   name: "Kemasukan Air",      icon: "💧" },
  { id: "other",   name: "Lainnya",            icon: "🛠️" },
];

const SERVICE_CATALOG = [
  { id: "s01", name: "Ganti LCD iPhone 11",         cat: "lcd",     price: 850000, warranty: 30, durasi: "2 jam" },
  { id: "s02", name: "Ganti LCD iPhone 13",         cat: "lcd",     price: 1750000,warranty: 30, durasi: "2 jam" },
  { id: "s03", name: "Ganti LCD Samsung A-series",  cat: "lcd",     price: 550000, warranty: 30, durasi: "1 jam" },
  { id: "s04", name: "Ganti LCD Xiaomi Redmi",      cat: "lcd",     price: 450000, warranty: 30, durasi: "1 jam" },
  { id: "s05", name: "Ganti Baterai iPhone",        cat: "battery", price: 400000, warranty: 60, durasi: "45 menit" },
  { id: "s06", name: "Ganti Baterai Android",       cat: "battery", price: 250000, warranty: 60, durasi: "45 menit" },
  { id: "s07", name: "Ganti Baterai Laptop",        cat: "battery", price: 650000, warranty: 90, durasi: "1 jam" },
  { id: "s08", name: "Service Mainboard HP",        cat: "board",   price: 500000, warranty: 14, durasi: "1-3 hari" },
  { id: "s09", name: "Service Motherboard Laptop",  cat: "board",   price: 850000, warranty: 14, durasi: "2-5 hari" },
  { id: "s10", name: "Install Ulang Windows",       cat: "soft",    price: 150000, warranty: 7,  durasi: "1 jam" },
  { id: "s11", name: "Install Ulang macOS",         cat: "soft",    price: 200000, warranty: 7,  durasi: "1-2 jam" },
  { id: "s12", name: "Flash / Unlock Android",      cat: "soft",    price: 150000, warranty: 7,  durasi: "1 jam" },
  { id: "s13", name: "Ganti Konektor Charger",      cat: "charger", price: 200000, warranty: 30, durasi: "1 jam" },
  { id: "s14", name: "Ganti Kamera Belakang",       cat: "camera",  price: 350000, warranty: 30, durasi: "1 jam" },
  { id: "s15", name: "Service Speaker",             cat: "speaker", price: 150000, warranty: 30, durasi: "45 menit" },
  { id: "s16", name: "Cuci / Bersih Kemasukan Air", cat: "water",   price: 300000, warranty: 0,  durasi: "1-2 hari" },
  { id: "s17", name: "Ganti Keyboard Laptop",       cat: "other",   price: 450000, warranty: 30, durasi: "1-2 jam" },
  { id: "s18", name: "Upgrade SSD Laptop",          cat: "other",   price: 250000, warranty: 14, durasi: "1 jam" },
];

const PRODUCT_CATS = [
  { id: "spare",  name: "Sparepart",  icon: "🔧" },
  { id: "acc",    name: "Aksesoris",  icon: "🎧" },
  { id: "cable",  name: "Kabel",      icon: "🔌" },
  { id: "case",   name: "Casing",     icon: "📱" },
  { id: "power",  name: "Charger",    icon: "🔋" },
  { id: "audio",  name: "Audio",      icon: "🎵" },
];

const INIT_PRODUCTS = [
  { id: "p01", name: "LCD iPhone 11 Original",       cat: "spare", stock: 8,  price: 950000, modal: 650000, img: "📱", supplier: "sup1", barcode: "8991234560011" },
  { id: "p02", name: "LCD Samsung A52",              cat: "spare", stock: 5,  price: 550000, modal: 380000, img: "📱", supplier: "sup1", barcode: "8991234560012" },
  { id: "p03", name: "Baterai iPhone 12",            cat: "spare", stock: 15, price: 280000, modal: 180000, img: "🔋", supplier: "sup2", barcode: "8991234560013" },
  { id: "p04", name: "Baterai Laptop HP Pavilion",   cat: "spare", stock: 3,  price: 650000, modal: 450000, img: "🔋", supplier: "sup2", barcode: "8991234560014" },
  { id: "p05", name: "Konektor Charger Type-C",      cat: "spare", stock: 25, price: 75000,  modal: 45000,  img: "🔌", supplier: "sup1", barcode: "8991234560015" },
  { id: "p06", name: "Kabel Charger USB-C 1m",       cat: "cable", stock: 40, price: 35000,  modal: 18000,  img: "🔌", supplier: "sup3", barcode: "8991234560016" },
  { id: "p07", name: "Kabel Lightning 1m",           cat: "cable", stock: 28, price: 45000,  modal: 22000,  img: "🔌", supplier: "sup3", barcode: "8991234560017" },
  { id: "p08", name: "Charger 20W Type-C",           cat: "power", stock: 22, price: 85000,  modal: 50000,  img: "🔌", supplier: "sup3", barcode: "8991234560018" },
  { id: "p09", name: "Tempered Glass iPhone 13",     cat: "acc",   stock: 50, price: 25000,  modal: 8000,   img: "🛡️", supplier: "sup3", barcode: "8991234560019" },
  { id: "p10", name: "Casing Samsung A52 Soft",      cat: "case",  stock: 15, price: 45000,  modal: 18000,  img: "📱", supplier: "sup3", barcode: "8991234560020" },
  { id: "p11", name: "Earphone Bluetooth TWS",       cat: "audio", stock: 12, price: 175000, modal: 95000,  img: "🎧", supplier: "sup3", barcode: "8991234560021" },
  { id: "p12", name: "Powerbank 10000mAh",           cat: "power", stock: 8,  price: 165000, modal: 100000, img: "🔋", supplier: "sup3", barcode: "8991234560022" },
];

const INIT_SUPPLIERS = [
  { id: "sup1", name: "PT Spare Mandiri",     phone: "021-5551-1001", addr: "Glodok, Jakarta Barat" },
  { id: "sup2", name: "CV Battery Indonesia", phone: "021-5551-1002", addr: "Mangga Dua, Jakarta" },
  { id: "sup3", name: "Toko Aksesoris HP",    phone: "021-5551-1003", addr: "ITC Roxy, Jakarta" },
];

const INIT_TECHNICIANS = [
  { id: "t01", name: "Budi Santoso",    branch: "b1", spec: "HP & Tablet",   phone: "0812-1111-1001", rating: 4.8, done: 142 },
  { id: "t02", name: "Ahmad Rizki",     branch: "b1", spec: "Laptop & PC",   phone: "0812-1111-1002", rating: 4.9, done: 98 },
  { id: "t03", name: "Dedi Kurniawan",  branch: "b2", spec: "iPhone Expert", phone: "0812-1111-1003", rating: 4.9, done: 205 },
  { id: "t04", name: "Wawan Hermawan",  branch: "b2", spec: "HP Android",    phone: "0812-1111-1004", rating: 4.7, done: 87 },
  { id: "t05", name: "Eko Prasetyo",    branch: "b3", spec: "Laptop Master", phone: "0812-1111-1005", rating: 4.8, done: 121 },
  { id: "t06", name: "Fajar Nugroho",   branch: "b3", spec: "Mainboard BGA", phone: "0812-1111-1006", rating: 5.0, done: 76 },
];

const STATUS = [
  { id: "masuk",     label: "Masuk",      color: "#64748b" },
  { id: "antri",     label: "Antri",      color: "#f59e0b" },
  { id: "diagnosa",  label: "Diagnosa",   color: "#3b82f6" },
  { id: "menunggu",  label: "Tunggu ACC", color: "#a855f7" },
  { id: "repair",    label: "Pengerjaan", color: "#06b6d4" },
  { id: "selesai",   label: "Selesai",    color: "#10b981" },
  { id: "ambil",     label: "Diambil",    color: "#22c55e" },
  { id: "batal",     label: "Batal",      color: "#ef4444" },
];

const PAY_METHODS = [
  { id: "cash",     name: "Tunai",        icon: "💵" },
  { id: "qris",     name: "QRIS",         icon: "📱" },
  { id: "transfer", name: "Transfer",     icon: "🏦" },
  { id: "gopay",    name: "GoPay",        icon: "💚" },
  { id: "ovo",      name: "OVO",          icon: "💜" },
  { id: "dana",     name: "DANA",         icon: "💙" },
  { id: "shopeepay",name: "ShopeePay",    icon: "🧡" },
  { id: "debit",    name: "Kartu Debit",  icon: "💳" },
];

const INIT_USERS = [
  { id: "u1", username: "owner",  password: "owner123",  name: "Sopian Hadianto", role: "OWNER",     active: true, branch: "all" },
  { id: "u2", username: "admin",  password: "admin123",  name: "Admin Pusat",     role: "ADMIN",     active: true, branch: "b1" },
  { id: "u3", username: "kasir1", password: "kasir123",  name: "Rina Kasir",      role: "KASIR",     active: true, branch: "b1" },
  { id: "u4", username: "tek1",   password: "tek123",    name: "Budi Teknisi",    role: "TEKNISI",   active: true, branch: "b1" },
];

const INIT_CUSTOMERS = [
  { id: "c01", name: "Rina Wulandari", phone: "081234567890", email: "rina@mail.com",  address: "Depok" },
  { id: "c02", name: "Hendra Wijaya",  phone: "081234567891", email: "hendra@mail.com", address: "Pamulang" },
  { id: "c03", name: "Siti Aminah",    phone: "081234567892", email: "siti@mail.com",  address: "BSD" },
];

const now = Date.now();
const INIT_TICKETS = [
  { id: "TK2604001", branch: "b1", customerId: "c01", custName: "Rina Wulandari", custPhone: "081234567890",
    device: "hp-ios", brand: "Apple", model: "iPhone 13 Pro", imei: "356789012345678", color: "Graphite",
    complaint: "Layar retak, touchscreen masih jalan", accessories: "Charger, case", password: "1234",
    diagnosis: "LCD pecah, perlu ganti LCD original", services: [{ id: "s02", name: "Ganti LCD iPhone 13", price: 1750000 }],
    parts: [{ id: "p01", name: "LCD iPhone 13", price: 1200000 }], kilat: false,
    technicianId: "t03", status: "repair", estDone: "16/04/2026", warranty: 30,
    totalCost: 1750000, dp: 500000, sisa: 1250000, payMethod: "transfer", createdAt: now - 86400000 * 2, notes: "Customer minta cepat" },
  { id: "TK2604002", branch: "b1", customerId: "c02", custName: "Hendra Wijaya", custPhone: "081234567891",
    device: "laptop", brand: "Asus", model: "ROG Strix G15", imei: "SN-ASUS-XY72", color: "Black",
    complaint: "Tidak bisa nyala, indikator charging kedip",
    diagnosis: "IC power rusak, perlu reball mainboard", services: [{ id: "s09", name: "Service Motherboard", price: 850000 }],
    parts: [], kilat: false, technicianId: "t02", status: "diagnosa", estDone: "18/04/2026", warranty: 14,
    totalCost: 850000, dp: 200000, sisa: 650000, payMethod: "cash", createdAt: now - 86400000, notes: "" },
  { id: "TK2604003", branch: "b2", customerId: "c03", custName: "Siti Aminah", custPhone: "081234567892",
    device: "hp-android", brand: "Samsung", model: "Galaxy A52", imei: "356789012345679", color: "Violet",
    complaint: "Baterai boros, sering panas",
    diagnosis: "Baterai drop, perlu ganti", services: [{ id: "s06", name: "Ganti Baterai Android", price: 250000 }],
    parts: [], kilat: true, technicianId: "t04", status: "selesai", estDone: "15/04/2026", warranty: 60,
    totalCost: 250000, dp: 0, sisa: 250000, payMethod: "qris", createdAt: now - 86400000 * 3, notes: "Sudah ditest OK" },
  { id: "TK2604004", branch: "b3", customerId: "c01", custName: "Rina Wulandari", custPhone: "081234567890",
    device: "tab-ios", brand: "Apple", model: "iPad Air 4", imei: "356789012345680", color: "Space Gray",
    complaint: "Charging port longgar",
    diagnosis: "", services: [], parts: [], kilat: false, technicianId: "", status: "antri", estDone: "17/04/2026", warranty: 30,
    totalCost: 0, dp: 0, sisa: 0, payMethod: "", createdAt: now - 3600000 * 5, notes: "" },
];

const INIT_SALES = [
  { id: "TR2604001", branch: "b1", customerId: "", custName: "Umum", items: [{ id: "p06", name: "Kabel Charger USB-C 1m", qty: 1, price: 35000 }], total: 35000, payMethod: "cash", payAmt: 50000, change: 15000, createdAt: now - 3600000, cashier: "u3" },
  { id: "TR2604002", branch: "b1", customerId: "", custName: "Umum", items: [{ id: "p09", name: "Tempered Glass iPhone 13", qty: 2, price: 25000 }], total: 50000, payMethod: "qris", payAmt: 50000, change: 0, createdAt: now - 7200000, cashier: "u3" },
  { id: "TR2604003", branch: "b2", customerId: "c02", custName: "Hendra Wijaya", items: [{ id: "p11", name: "Earphone Bluetooth TWS", qty: 1, price: 175000 }], total: 175000, payMethod: "cash", payAmt: 200000, change: 25000, createdAt: now - 86400000, cashier: "u3" },
];

const INIT_PURCHASES = [
  { id: "PO2604001", branch: "b1", supplierId: "sup1", items: [{ id: "p01", name: "LCD iPhone 11 Original", qty: 5, price: 650000 }], total: 3250000, createdAt: now - 86400000 * 5, notes: "Restock bulanan" },
  { id: "PO2604002", branch: "b1", supplierId: "sup3", items: [{ id: "p09", name: "Tempered Glass iPhone 13", qty: 50, price: 8000 }, { id: "p06", name: "Kabel Charger USB-C 1m", qty: 30, price: 18000 }], total: 940000, createdAt: now - 86400000 * 3, notes: "" },
];

// ---------- UTILS ----------
const rp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");
const fT = (ts) => new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
const fD = (ts) => new Date(ts).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
const fFull = (ts) => `${fD(ts)} ${fT(ts)}`;

const gid = (pfx = "ID") => {
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rnd = String(Math.floor(Math.random() * 900) + 100);
  return `${pfx}${y}${m}${dd}${rnd}`;
};

// 10-char Konter Pro style resi (alphanumeric)
const genResi = () => {
  const ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "";
  for (let i = 0; i < 10; i++) r += ch[Math.floor(Math.random() * ch.length)];
  return r;
};

const useLS = (key, init) => {
  const [v, setV] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : init; }
    catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
};

const waLink = (phone, text) => {
  const p = String(phone).replace(/\D/g, "").replace(/^0/, "62");
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
};

// CSV export
const downloadCSV = (filename, rows) => {
  const csv = rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// SVG QR
const QR = ({ value, size = 160, dark = "#0f172a", light = "#fff" }) => {
  const str = String(value);
  const n = 21;
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  const cells = [];
  for (let i = 0; i < n * n; i++) {
    const v = Math.abs(((hash * (i + 13)) ^ (i * 7919)) % 97);
    cells.push(v < 45);
  }
  const finder = (r, c) => {
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
      const idx = (r + i) * n + (c + j);
      const on = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
      cells[idx] = on;
    }
  };
  finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
  const s = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: light, borderRadius: 8 }}>
      {cells.map((on, i) => on && (
        <rect key={i} x={(i % n) * s} y={Math.floor(i / n) * s} width={s} height={s} fill={dark} />
      ))}
    </svg>
  );
};

// ---------- ICONS ----------
const IX = {
  dash: "M3 12l9-9 9 9v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z",
  pos: "M9 2v6h6V2M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2z",
  ticket: "M4 6h16a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a2 2 0 000-4V8a2 2 0 012-2z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  plus: "M12 4v16m-8-8h16",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M13 7a4 4 0 11-8 0 4 4 0 018 0zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  tech: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 18.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM18.5 18.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
  report: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  cash: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  set: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  chev: "M9 18l6-6-6-6",
  chevD: "M6 9l6 6 6-6",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",
  wa: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z",
  qr: "M3 11h8V3H3zm2-6h4v4H5zm8-2v8h8V3zm6 6h-4V5h4zM3 21h8v-8H3zm2-6h4v4H5zm14-2h2v2h-2zm-6 0h2v2h-2zm8 4h-2v2h2zm-2 2h-2v2h2zm-2-6h-2v2h2zm-2 2h-2v2h2zm-2 2h-2v2h2zm6 2h-2v4h4v-2h-2z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.41-9.42a2 2 0 112.83 2.83L11.83 15H9v-2.83z",
  trash: "M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  print: "M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z",
  arrow: "M5 12h14M12 5l7 7-7 7",
  back: "M19 12H5M12 19l-7-7 7-7",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  history: "M3 3v5h5M3.05 13A9 9 0 106 5.3L3 8M12 7v5l4 2",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M16 7a4 4 0 11-8 0 4 4 0 018 0z",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
};

const Ic = ({ n, s = 18, c = "currentColor", sw = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={IX[n]} />
  </svg>
);

// ---------- STYLES ----------
const CSS = `
:root{
  --bg:#0a0f1c; --bg2:#0f172a; --panel:#111827; --panel2:#1f2937;
  --line:#1e293b; --line2:#334155;
  --txt:#e2e8f0; --txt2:#94a3b8; --txt3:#64748b;
  --pri:#f97316; --pri2:#ea580c; --pri-glow:rgba(249,115,22,0.25);
  --acc:#fbbf24; --acc2:#f59e0b;
  --ok:#10b981; --warn:#f59e0b; --err:#ef4444; --info:#3b82f6;
  --rad:10px; --rad2:14px;
}
[data-theme="light"]{
  --bg:#f8fafc; --bg2:#f1f5f9; --panel:#fff; --panel2:#f1f5f9;
  --line:#e2e8f0; --line2:#cbd5e1;
  --txt:#0f172a; --txt2:#475569; --txt3:#64748b;
}
*{box-sizing:border-box;margin:0;padding:0}
body,html,#root{background:var(--bg);color:var(--txt);font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;min-height:100vh}
.app{display:flex;min-height:100vh;background:linear-gradient(135deg,var(--bg) 0%,var(--bg2) 60%,var(--panel) 100%)}
[data-theme="light"] .app{background:var(--bg)}
.app::before{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at top right,rgba(249,115,22,0.08),transparent 50%),radial-gradient(ellipse at bottom left,rgba(251,191,36,0.05),transparent 50%);pointer-events:none;z-index:0}
[data-theme="light"] .app::before{background:radial-gradient(ellipse at top right,rgba(249,115,22,0.05),transparent 50%)}

/* LOGIN */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:linear-gradient(135deg,#0a0f1c 0%,#1a1f3a 100%);position:relative;overflow:hidden}
.login-wrap::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(249,115,22,0.15),transparent 50%),radial-gradient(circle at 70% 80%,rgba(251,191,36,0.1),transparent 50%)}
.login-card{background:rgba(17,24,39,0.85);backdrop-filter:blur(20px);border:1px solid var(--line2);border-radius:20px;padding:40px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);position:relative;z-index:1;color:#e2e8f0}
.login-logo{width:72px;height:72px;background:linear-gradient(135deg,#f97316,#fbbf24);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 16px;box-shadow:0 10px 30px rgba(249,115,22,0.4)}
.login-card h1{text-align:center;font-size:24px;font-weight:800;letter-spacing:-0.02em;background:linear-gradient(135deg,#fff,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.login-card .sub{text-align:center;font-size:12px;color:#94a3b8;margin:6px 0 28px}

/* SIDEBAR */
.sb{width:240px;background:rgba(17,24,39,0.9);backdrop-filter:blur(20px);border-right:1px solid var(--line);display:flex;flex-direction:column;padding:18px 12px;position:sticky;top:0;height:100vh;z-index:10;transition:width 0.25s}
[data-theme="light"] .sb{background:#fff}
.sb.col{width:72px;padding:18px 8px}
.sb.col .nav-itm span,.sb.col .brand-txt,.sb.col .nav-lbl,.sb.col .brch-sel .lbl,.sb.col .brch-sel .nm,.sb.col .user-nm,.sb.col .user-rl{display:none}
.sb.col .brch-sel,.sb.col .nav-itm{justify-content:center;padding:11px 0}
.sb.col .user-info{justify-content:center}
.sb.col .user-info .avatar{margin:0}
.brand{display:flex;align-items:center;gap:10px;padding:6px 8px 16px;border-bottom:1px solid var(--line);margin-bottom:14px}
.logo{width:38px;height:38px;background:linear-gradient(135deg,var(--pri),var(--acc));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 16px var(--pri-glow);flex-shrink:0}
.brand-txt h1{font-size:14px;font-weight:800;letter-spacing:-0.02em}
.brand-txt p{font-size:9px;color:var(--txt3);text-transform:uppercase;letter-spacing:0.12em;font-weight:600}
.nav{display:flex;flex-direction:column;gap:2px;flex:1;overflow-y:auto;overflow-x:hidden}
.nav::-webkit-scrollbar{width:4px}
.nav::-webkit-scrollbar-thumb{background:var(--line2);border-radius:2px}
.nav-lbl{font-size:9px;color:var(--txt3);padding:8px 10px 4px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700}
.nav-itm{display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:8px;color:var(--txt2);cursor:pointer;transition:all 0.18s;border:none;background:none;font-size:13px;font-weight:500;text-align:left;width:100%;font-family:inherit;white-space:nowrap;overflow:hidden}
.nav-itm:hover{background:var(--panel2);color:var(--txt)}
.nav-itm.act{background:linear-gradient(135deg,var(--pri),var(--pri2));color:#fff;box-shadow:0 4px 16px var(--pri-glow)}
.brch{padding:10px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:8px 0}
.brch-sel{background:var(--panel2);border:1px solid var(--line2);border-radius:8px;padding:9px 11px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all 0.18s}
.brch-sel:hover{border-color:var(--pri)}
.brch-sel .lbl{font-size:9px;color:var(--txt3);text-transform:uppercase;font-weight:700;letter-spacing:0.08em}
.brch-sel .nm{font-size:12px;font-weight:700;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px}
.user-info{display:flex;align-items:center;gap:10px;padding:8px;background:var(--panel2);border-radius:10px;margin-top:8px}
.user-info .avatar{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--pri),var(--acc));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px;flex-shrink:0}
.user-nm{font-size:12px;font-weight:700;line-height:1.2}
.user-rl{font-size:9px;color:var(--txt3);text-transform:uppercase;font-weight:700;letter-spacing:0.08em;margin-top:1px}

/* TOPBAR */
.main{flex:1;display:flex;flex-direction:column;position:relative;z-index:1;min-width:0}
.tb{background:rgba(17,24,39,0.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--line);padding:12px 22px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:5;gap:12px}
[data-theme="light"] .tb{background:rgba(255,255,255,0.85)}
.tb-left{display:flex;align-items:center;gap:14px;min-width:0;flex:1}
.collapse-btn{background:var(--panel2);border:1px solid var(--line);border-radius:8px;padding:6px;cursor:pointer;color:var(--txt2);transition:all 0.18s;display:flex}
.collapse-btn:hover{color:var(--pri);border-color:var(--pri)}
.tb-ttl h2{font-size:20px;font-weight:800;letter-spacing:-0.02em;background:linear-gradient(135deg,var(--txt) 0%,var(--pri) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.tb-ttl p{font-size:11px;color:var(--txt3);margin-top:1px}
.tb-act{display:flex;gap:8px;align-items:center;flex-shrink:0}

/* COMMON */
.btn{padding:8px 14px;border-radius:8px;border:none;background:var(--panel2);color:var(--txt);cursor:pointer;font-weight:600;font-size:12px;display:inline-flex;align-items:center;gap:7px;transition:all 0.18s;font-family:inherit;white-space:nowrap}
.btn:hover{background:var(--line2)}
.btn:disabled{opacity:0.5;cursor:not-allowed}
.btn.pri{background:linear-gradient(135deg,var(--pri),var(--pri2));color:#fff;box-shadow:0 4px 14px var(--pri-glow)}
.btn.pri:hover{transform:translateY(-1px);box-shadow:0 6px 20px var(--pri-glow)}
.btn.ok{background:var(--ok);color:#fff}
.btn.ok:hover{background:#059669}
.btn.err{background:var(--err);color:#fff}
.btn.gh{background:transparent;border:1px solid var(--line2)}
.btn.gh:hover{border-color:var(--pri);color:var(--pri)}
.btn.wa{background:#25D366;color:#fff}
.btn.wa:hover{background:#1eb352}
.btn.sm{padding:6px 10px;font-size:11px}
.btn.icn{padding:7px;border-radius:7px}
.cnt{padding:20px;max-width:1400px;width:100%;margin:0 auto}
.grid{display:grid;gap:14px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--rad2);padding:18px;transition:border-color 0.18s}
.card:hover{border-color:var(--line2)}
.kpi{background:linear-gradient(135deg,var(--panel) 0%,var(--panel2) 100%);border:1px solid var(--line);border-radius:var(--rad2);padding:18px;position:relative;overflow:hidden}
.kpi::before{content:"";position:absolute;top:0;right:0;width:120px;height:120px;background:radial-gradient(circle,var(--pri-glow),transparent 70%);border-radius:50%;transform:translate(40%,-40%)}
.kpi .lbl{font-size:11px;color:var(--txt3);text-transform:uppercase;letter-spacing:0.08em;font-weight:700}
.kpi .v{font-size:24px;font-weight:800;margin-top:6px;letter-spacing:-0.02em}
.kpi .sub{font-size:11px;color:var(--txt2);margin-top:4px}
.kpi.alt::before{background:radial-gradient(circle,rgba(16,185,129,0.2),transparent 70%)}
.kpi.alt2::before{background:radial-gradient(circle,rgba(59,130,246,0.2),transparent 70%)}
.kpi.alt3::before{background:radial-gradient(circle,rgba(251,191,36,0.2),transparent 70%)}
.kpi.alt4::before{background:radial-gradient(circle,rgba(239,68,68,0.2),transparent 70%)}
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;padding:11px 10px;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--txt3);font-weight:700;border-bottom:1px solid var(--line)}
.tbl td{padding:11px 10px;border-bottom:1px solid var(--line)}
.tbl tr:hover td{background:rgba(249,115,22,0.03)}
.tbl .n{text-align:right;font-variant-numeric:tabular-nums}
.bdg{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em}
.inp,.sel,.txa{width:100%;background:var(--bg2);border:1px solid var(--line2);color:var(--txt);padding:10px 12px;border-radius:8px;font-size:13px;font-family:inherit;transition:border-color 0.18s}
[data-theme="light"] .inp,[data-theme="light"] .sel,[data-theme="light"] .txa{background:#fff}
.inp:focus,.sel:focus,.txa:focus{outline:none;border-color:var(--pri);box-shadow:0 0 0 3px var(--pri-glow)}
.fld{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.fld label{font-size:11px;color:var(--txt2);font-weight:600;text-transform:uppercase;letter-spacing:0.04em}
.row{display:flex;gap:12px}
.row>*{flex:1}
.modal{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.mbox{background:var(--panel);border:1px solid var(--line2);border-radius:16px;max-width:720px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
.mhd{padding:18px 22px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--panel);z-index:2}
.mhd h3{font-size:17px;font-weight:800;letter-spacing:-0.01em}
.mbd{padding:20px 22px}
.mft{padding:14px 22px;border-top:1px solid var(--line);display:flex;justify-content:flex-end;gap:8px;background:var(--panel);position:sticky;bottom:0}
.close{background:none;border:none;color:var(--txt2);cursor:pointer;padding:4px;border-radius:6px}
.close:hover{background:var(--panel2);color:var(--txt)}
.tck{background:var(--panel);border:1px solid var(--line);border-radius:var(--rad2);padding:14px;cursor:pointer;transition:all 0.18s;position:relative;overflow:hidden}
.tck:hover{border-color:var(--pri);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
.tck.kilat{border-left:4px solid var(--acc)}
.tck-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
.tck-id{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;color:var(--txt3);font-weight:700;letter-spacing:0.05em}
.tck-dev{font-size:14px;font-weight:700;margin:4px 0 2px}
.tck-cust{font-size:11px;color:var(--txt2)}
.tck-cmp{font-size:12px;color:var(--txt2);margin-top:8px;padding-top:8px;border-top:1px dashed var(--line);line-height:1.4}
.tck-ft{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--line);font-size:11px;color:var(--txt3)}
.step{display:flex;align-items:center;gap:8px;padding:12px;border-radius:8px;background:var(--bg2);border:1px solid var(--line);cursor:pointer;transition:all 0.18s;flex:1;min-width:110px}
.step:hover{border-color:var(--pri)}
.step.on{background:linear-gradient(135deg,var(--pri),var(--pri2));color:#fff;border-color:var(--pri)}
.step .dot{width:24px;height:24px;border-radius:50%;background:var(--panel2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
.step.on .dot{background:rgba(255,255,255,0.2)}
.step .lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em}
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:18px;overflow-x:auto}
.tab{padding:10px 16px;border:none;background:none;color:var(--txt2);cursor:pointer;font-weight:600;font-size:13px;border-bottom:2px solid transparent;transition:all 0.18s;white-space:nowrap;font-family:inherit}
.tab:hover{color:var(--txt)}
.tab.on{color:var(--pri);border-bottom-color:var(--pri)}
.chip{display:inline-block;padding:4px 10px;background:var(--panel2);border-radius:999px;font-size:11px;font-weight:600;color:var(--txt2)}
.stk-low{color:var(--err);font-weight:700}
.stk-ok{color:var(--ok);font-weight:700}
.empty{text-align:center;padding:50px 20px;color:var(--txt3)}
.empty-ic{font-size:40px;margin-bottom:10px;opacity:0.5}
.avatar{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,var(--pri),var(--acc));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0}
.track-hero{background:linear-gradient(135deg,var(--panel) 0%,#1a2436 100%);border:1px solid var(--line2);border-radius:16px;padding:28px;text-align:center;position:relative;overflow:hidden}
.track-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,var(--pri-glow),transparent 60%)}
.track-hero>*{position:relative}
.prog-line{display:flex;align-items:center;gap:8px;margin:20px 0;flex-wrap:wrap}
.prog-step{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;min-width:60px}
.prog-step .dot{width:32px;height:32px;border-radius:50%;background:var(--panel2);border:2px solid var(--line);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:var(--txt3)}
.prog-step.on .dot{background:var(--pri);border-color:var(--pri);color:#fff;box-shadow:0 0 20px var(--pri-glow)}
.prog-step.done .dot{background:var(--ok);border-color:var(--ok);color:#fff}
.prog-step .lbl{font-size:10px;color:var(--txt3);text-transform:uppercase;font-weight:700;letter-spacing:0.05em;text-align:center}
.prog-step.on .lbl,.prog-step.done .lbl{color:var(--txt)}
.prog-bar{flex:1;height:2px;background:var(--line);min-width:10px}
.prog-bar.done{background:var(--ok)}

/* POS */
.pos-wrap{display:grid;grid-template-columns:1fr 380px;gap:14px;height:calc(100vh - 120px)}
.pos-left{display:flex;flex-direction:column;gap:12px;overflow:hidden}
.pos-right{background:var(--panel);border:1px solid var(--line);border-radius:var(--rad2);display:flex;flex-direction:column;overflow:hidden}
.pos-cats{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px}
.pos-cat{padding:8px 14px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);cursor:pointer;font-size:12px;font-weight:600;white-space:nowrap;transition:all 0.18s}
.pos-cat.on{background:linear-gradient(135deg,var(--pri),var(--pri2));border-color:var(--pri);color:#fff}
.pos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;overflow-y:auto;padding-right:4px;flex:1}
.pos-prod{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px;cursor:pointer;transition:all 0.18s;display:flex;flex-direction:column;gap:4px;text-align:center}
.pos-prod:hover{border-color:var(--pri);transform:translateY(-2px);box-shadow:0 6px 16px rgba(249,115,22,0.15)}
.pos-prod-img{width:100%;aspect-ratio:1;background:var(--bg2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:6px}
.pos-prod-nm{font-size:11px;font-weight:700;line-height:1.2;min-height:26px}
.pos-prod-pr{font-size:13px;color:var(--pri);font-weight:800}
.pos-prod-st{font-size:9px;color:var(--txt3);text-transform:uppercase}
.cart-hd{padding:14px 16px;border-bottom:1px solid var(--line)}
.cart-bd{flex:1;overflow-y:auto;padding:10px 14px}
.cart-itm{display:flex;gap:8px;padding:8px;border-bottom:1px dashed var(--line);align-items:center}
.cart-itm:last-child{border-bottom:none}
.qty-grp{display:flex;align-items:center;gap:4px;background:var(--bg2);border-radius:6px;padding:2px}
.qty-btn{width:22px;height:22px;border:none;background:var(--panel2);color:var(--txt);border-radius:4px;cursor:pointer;font-weight:800}
.qty-btn:hover{background:var(--pri);color:#fff}
.qty-num{min-width:24px;text-align:center;font-weight:700;font-size:12px}
.cart-ft{padding:14px 16px;border-top:1px solid var(--line);background:var(--bg2)}
.cart-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:3px 0}
.cart-row.tot{font-size:18px;font-weight:800;padding-top:8px;margin-top:6px;border-top:1px solid var(--line)}
.cart-row.tot .v{color:var(--pri)}

/* RECEIPT */
.receipt{font-family:'Courier New',monospace;background:#fff;color:#000;padding:16px;max-width:300px;margin:0 auto;font-size:11px;line-height:1.5}
.receipt .hd{text-align:center;border-bottom:1px dashed #000;padding-bottom:8px;margin-bottom:8px}
.receipt .hd h3{font-size:14px;font-weight:800;margin-bottom:2px}
.receipt .ln{display:flex;justify-content:space-between;margin:2px 0}
.receipt .div{border-top:1px dashed #000;margin:8px 0}
.receipt .ft{text-align:center;margin-top:8px;font-size:10px}

@media(max-width:1100px){.pos-wrap{grid-template-columns:1fr}.pos-right{position:fixed;bottom:0;left:0;right:0;height:60vh;z-index:50;border-radius:16px 16px 0 0}}
@media(max-width:900px){.sb{display:none}.cnt{padding:14px}}
@media print{.sb,.tb,.btn,.close,.mft{display:none!important}.cnt{padding:0}body{background:#fff;color:#000}.card,.modal,.mbox{border:none;background:#fff;color:#000;box-shadow:none}.mbd{padding:0}}
`;

// ==========================================================================
// COMPONENTS
// ==========================================================================

// ---------- LOGIN ----------
const LoginPage = ({ users, onLogin }) => {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const submit = () => {
    const usr = users.find((x) => x.username === u && x.password === p && x.active);
    if (usr) onLogin(usr);
    else setErr("Username atau password salah");
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{width:120,height:68,borderRadius:14,overflow:"hidden",margin:"0 auto 12px",boxShadow:"0 8px 30px rgba(56,189,248,0.3)",border:"1.5px solid rgba(56,189,248,0.2)"}}><img src={logoImg} alt="MAX Mobile" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/></div>
        <h1>MAX Mobile Service</h1>
        <p className="sub">Apple & Android — Service Management & POS</p>
        <div className="fld">
          <label>Username</label>
          <input className="inp" value={u} onChange={(e) => { setU(e.target.value); setErr(""); }} placeholder="Masukkan username" onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <div className="fld">
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input className="inp" type={show ? "text" : "password"} value={p} onChange={(e) => { setP(e.target.value); setErr(""); }} placeholder="Masukkan password" onKeyDown={(e) => e.key === "Enter" && submit()} style={{ paddingRight: 40 }} />
            <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 6 }}><Ic n="eye" s={16} /></button>
          </div>
        </div>
        {err && <div style={{ color: "#ef4444", fontSize: 12, padding: "8px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8, marginBottom: 12, textAlign: "center" }}>{err}</div>}
        <button className="btn pri" onClick={submit} style={{ width: "100%", padding: "12px", fontSize: 14, justifyContent: "center" }}>
          <Ic n="logout" s={16} c="#fff" /> Masuk
        </button>
        <div style={{ textAlign: "center", marginTop: 16, padding: 10, background: "rgba(249,115,22,0.08)", borderRadius: 8, fontSize: 11, color: "#94a3b8" }}>
          <div style={{ marginBottom: 4, color: "#fbbf24", fontWeight: 700 }}>Default Login</div>
          <div>owner / owner123 • admin / admin123</div>
          <div>kasir1 / kasir123 • tek1 / tek123</div>
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 10, color: "#64748b" }}>MAX Mobile Service — © 2026</div>
      </div>
    </div>
  );
};

// ---------- SIDEBAR ----------
const Sidebar = ({ page, setPage, branch, setBranchModal, user, onLogout, collapsed }) => {
  const b = BRANCHES.find((x) => x.id === branch);
  const navs = [
    { l: "MENU UTAMA" },
    { id: "dash",    n: "dash",    t: "Dashboard" },
    { id: "pos",     n: "pos",     t: "Kasir (POS)" },
    { id: "ticket",  n: "ticket",  t: "Servis" },
    { id: "kilat",   n: "bolt",    t: "Servis Kilat" },
    { l: "MANAJEMEN" },
    { id: "inv",     n: "box",     t: "Inventaris" },
    { id: "supplier",n: "truck",   t: "Supplier" },
    { id: "cust",    n: "users",   t: "Pelanggan" },
    { id: "tech",    n: "tech",    t: "Teknisi" },
    { l: "LAPORAN" },
    { id: "history", n: "history", t: "Riwayat" },
    { id: "report",  n: "report",  t: "Laporan" },
    { id: "track",   n: "qr",      t: "Tracking Publik" },
    { id: "setting", n: "set",     t: "Pengaturan" },
  ];
  return (
    <aside className={`sb ${collapsed ? "col" : ""}`}>
      <div className="brand">
        <div style={{width:40,height:34,borderRadius:8,overflow:"hidden",flexShrink:0,border:"1px solid rgba(56,189,248,0.25)",boxShadow:"0 2px 10px rgba(56,189,248,0.2)"}}><img src={logoImg} alt="MAX" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/></div>
        <div className="brand-txt">
          <h1>MAX Mobile</h1>
          <p>Apple & Android Service</p>
        </div>
      </div>
      <nav className="nav">
        {navs.map((nv, i) => nv.l
          ? <div key={i} className="nav-lbl">{nv.l}</div>
          : <button key={nv.id} className={`nav-itm ${page === nv.id ? "act" : ""}`} onClick={() => setPage(nv.id)} title={nv.t}>
              <Ic n={nv.n} /><span>{nv.t}</span>
            </button>
        )}
      </nav>
      <div className="brch">
        <div className="brch-sel" onClick={() => setBranchModal(true)} title={b?.name}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="lbl">Cabang</div>
            <div className="nm">{b?.name || "—"}</div>
          </div>
          <Ic n="chev" s={14} />
        </div>
      </div>
      <div className="user-info">
        <div className="avatar">{user.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-nm">{user.name}</div>
          <div className="user-rl">{user.role}</div>
        </div>
        <button className="close" onClick={onLogout} title="Logout"><Ic n="logout" s={16} /></button>
      </div>
    </aside>
  );
};

const TopBar = ({ title, subtitle, actions, onCollapse, theme, setTheme }) => (
  <div className="tb">
    <div className="tb-left">
      <button className="collapse-btn" onClick={onCollapse}><Ic n="dash" s={16} /></button>
      <div className="tb-ttl">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
    <div className="tb-act">
      {actions}
      <button className="btn icn gh" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
        <Ic n={theme === "dark" ? "sun" : "moon"} s={15} />
      </button>
    </div>
  </div>
);

const StatusBadge = ({ st }) => {
  const s = STATUS.find((x) => x.id === st) || STATUS[0];
  return <span className="bdg" style={{ background: s.color + "22", color: s.color, border: `1px solid ${s.color}44` }}>{s.label}</span>;
};

// ---------- BRANCH MODAL ----------
const BranchModal = ({ onClose, current, setBranch }) => (
  <div className="modal" onClick={onClose}>
    <div className="mbox" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
      <div className="mhd"><h3>Pilih Cabang</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
      <div className="mbd">
        {BRANCHES.map((b) => (
          <div key={b.id}
            style={{ padding: 14, border: `1px solid ${b.id === current ? "var(--pri)" : "var(--line)"}`, borderRadius: 10, marginBottom: 8, cursor: "pointer",
                     background: b.id === current ? "rgba(249,115,22,0.1)" : "var(--bg2)" }}
            onClick={() => { setBranch(b.id); onClose(); }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 3 }}>{b.addr}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>📞 {b.phone}</div>
              </div>
              <span className="chip" style={{ background: b.owner === "Pusat" ? "var(--pri)" : "var(--panel2)", color: b.owner === "Pusat" ? "#fff" : "var(--txt2)" }}>{b.owner}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ---------- DASHBOARD ----------
const DashboardPage = ({ tickets, sales, technicians, products, branch, user, setPage }) => {
  const bt = tickets.filter((t) => t.branch === branch);
  const bs = sales.filter((s) => s.branch === branch);
  const today = new Date().toDateString();
  const todayTickets = bt.filter((t) => new Date(t.createdAt).toDateString() === today);
  const todaySales = bs.filter((s) => new Date(s.createdAt).toDateString() === today);
  const omsetServis = todayTickets.filter((t) => ["selesai", "ambil"].includes(t.status)).reduce((s, t) => s + (t.totalCost || 0), 0);
  const omsetKasir = todaySales.reduce((s, x) => s + x.total, 0);
  const omsetTotal = omsetServis + omsetKasir;
  const aktif = bt.filter((t) => !["selesai", "ambil", "batal"].includes(t.status));
  const totalProduk = products.length;
  const stokRendah = products.filter((p) => p.stock < 5).length;
  const piutang = bt.filter((t) => t.sisa > 0 && !["batal"].includes(t.status)).reduce((s, t) => s + t.sisa, 0);
  const statusDist = STATUS.map((s) => ({ ...s, count: bt.filter((t) => t.status === s.id).length }));
  const recentSales = bs.slice(0, 5);
  const recentService = bt.slice(0, 5);
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="cnt">
      <div className="card" style={{ marginBottom: 18, background: "linear-gradient(135deg,rgba(249,115,22,0.1),rgba(251,191,36,0.05))", borderColor: "var(--line2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{greet}, {user.name.split(" ")[0]}! 👋</h2>
            <p style={{ fontSize: 12, color: "var(--txt3)", marginTop: 4 }}>Terakhir dimuat: {new Date().toLocaleTimeString("id-ID")} • {fD(Date.now())}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn pri" onClick={() => setPage("pos")}><Ic n="pos" s={14} /> Buka Kasir</button>
            <button className="btn ok" onClick={() => setPage("ticket")}><Ic n="plus" s={14} /> Terima Servis</button>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginBottom: 18 }}>
        <div className="kpi">
          <div className="lbl">Pendapatan Hari Ini</div>
          <div className="v" style={{ color: "var(--pri)" }}>{rp(omsetTotal)}</div>
          <div className="sub">Kasir: {rp(omsetKasir)} • Servis: {rp(omsetServis)}</div>
        </div>
        <div className="kpi alt3">
          <div className="lbl">Servis Aktif</div>
          <div className="v" style={{ color: "var(--acc)" }}>{aktif.length}</div>
          <div className="sub">{bt.filter(t => t.status === "selesai").length} BELUM DIAMBIL</div>
        </div>
        <div className="kpi alt">
          <div className="lbl">Total Produk</div>
          <div className="v">{totalProduk}</div>
          <div className="sub" style={{ color: stokRendah > 0 ? "var(--err)" : "var(--ok)" }}>{stokRendah > 0 ? `${stokRendah} stok rendah` : "Stok aman"}</div>
        </div>
        <div className="kpi alt4">
          <div className="lbl">Piutang Belum Lunas</div>
          <div className="v" style={{ color: piutang > 0 ? "var(--err)" : "var(--ok)" }}>{rp(piutang)}</div>
          <div className="sub">{bt.filter(t => t.sisa > 0 && t.status !== "batal").length} piutang</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>🔧 Servis Terbaru</h3>
          {recentService.length === 0 ? <div className="empty"><div className="empty-ic">📋</div>Belum ada</div>
            : recentService.map((t) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed var(--line)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.brand} {t.model}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>{t.custName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge st={t.status} />
                  <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 4, fontFamily: "monospace" }}>{t.id}</div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>🕒 Transaksi Terbaru</h3>
          {recentSales.length === 0 ? <div className="empty"><div className="empty-ic">🛒</div>Belum ada</div>
            : recentSales.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed var(--line)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.custName}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>{fFull(s.createdAt)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--pri)" }}>{rp(s.total)}</div>
                  <span className="bdg" style={{ background: "rgba(16,185,129,0.2)", color: "var(--ok)", marginTop: 4 }}>Lunas</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>📊 Distribusi Status Servis</h3>
        {statusDist.map((s) => (
          <div key={s.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 12, color: "var(--txt2)" }}>{s.count} tiket</span>
            </div>
            <div style={{ height: 8, background: "var(--bg2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${bt.length ? (s.count / bt.length) * 100 : 0}%`, background: s.color, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- POS / KASIR ----------
const POSPage = ({ products, setProducts, sales, setSales, customers, branch, user, shop }) => {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);
  const [custName, setCustName] = useState("Umum");
  const [payOpen, setPayOpen] = useState(false);
  const [printSale, setPrintSale] = useState(null);

  const filtered = products.filter((p) => {
    if (cat !== "all" && p.cat !== cat) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.barcode?.includes(q)) return false;
    return true;
  });

  const addToCart = (p) => {
    if (p.stock <= 0) return alert("Stok habis!");
    const ex = cart.find((x) => x.id === p.id);
    if (ex) {
      if (ex.qty >= p.stock) return alert("Stok tidak cukup");
      setCart(cart.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      setCart([...cart, { id: p.id, name: p.name, price: p.price, qty: 1 }]);
    }
  };
  const updQty = (id, delta) => {
    const p = products.find((x) => x.id === id);
    setCart(cart.map((x) => {
      if (x.id !== id) return x;
      const nq = x.qty + delta;
      if (nq <= 0) return null;
      if (nq > p.stock) { alert("Stok tidak cukup"); return x; }
      return { ...x, qty: nq };
    }).filter(Boolean));
  };
  const removeItem = (id) => setCart(cart.filter((x) => x.id !== id));
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  const processPayment = (method, payAmt) => {
    const sale = {
      id: gid("TR"), branch, customerId: "", custName, items: cart, total,
      payMethod: method, payAmt, change: payAmt - total,
      createdAt: Date.now(), cashier: user.id,
    };
    setSales([sale, ...sales]);
    setProducts(products.map((p) => {
      const c = cart.find((x) => x.id === p.id);
      return c ? { ...p, stock: p.stock - c.qty } : p;
    }));
    setCart([]); setCustName("Umum"); setPayOpen(false);
    setPrintSale(sale);
  };

  return (
    <div className="cnt" style={{ maxWidth: "100%", padding: 14 }}>
      <div className="pos-wrap">
        <div className="pos-left">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input className="inp" placeholder="🔍 Cari produk atau scan barcode..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="pos-cats">
            <button className={`pos-cat ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>Semua ({products.length})</button>
            {PRODUCT_CATS.map((c) => {
              const cnt = products.filter((p) => p.cat === c.id).length;
              return <button key={c.id} className={`pos-cat ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>{c.icon} {c.name} ({cnt})</button>;
            })}
          </div>
          <div className="pos-grid">
            {filtered.length === 0 ? <div className="empty" style={{ gridColumn: "1/-1" }}><div className="empty-ic">📦</div>Tidak ada produk</div>
              : filtered.map((p) => (
                <div key={p.id} className="pos-prod" onClick={() => addToCart(p)}>
                  <div className="pos-prod-img">{p.img}</div>
                  <div className="pos-prod-nm">{p.name}</div>
                  <div className="pos-prod-pr">{rp(p.price)}</div>
                  <div className="pos-prod-st" style={{ color: p.stock < 5 ? "var(--err)" : "var(--txt3)" }}>Stok: {p.stock}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="pos-right">
          <div className="cart-hd">
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>🛒 Keranjang ({cart.length})</div>
            <input className="inp" placeholder="Nama pelanggan" value={custName} onChange={(e) => setCustName(e.target.value)} style={{ fontSize: 12, padding: "8px 10px" }} />
          </div>
          <div className="cart-bd">
            {cart.length === 0 ? (
              <div className="empty" style={{ padding: 30 }}>
                <div className="empty-ic">🛒</div>
                <div style={{ fontSize: 12 }}>Pilih produk untuk mulai</div>
              </div>
            ) : cart.map((it) => (
              <div key={it.id} className="cart-itm">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: "var(--pri)", marginTop: 2 }}>{rp(it.price)}</div>
                </div>
                <div className="qty-grp">
                  <button className="qty-btn" onClick={() => updQty(it.id, -1)}>−</button>
                  <span className="qty-num">{it.qty}</span>
                  <button className="qty-btn" onClick={() => updQty(it.id, 1)}>+</button>
                </div>
                <button className="close" onClick={() => removeItem(it.id)}><Ic n="x" s={14} /></button>
              </div>
            ))}
          </div>
          <div className="cart-ft">
            <div className="cart-row"><span>Subtotal ({cart.reduce((s, x) => s + x.qty, 0)} item)</span><span>{rp(total)}</span></div>
            <div className="cart-row tot"><span>TOTAL</span><span className="v">{rp(total)}</span></div>
            <button className="btn pri" disabled={cart.length === 0} style={{ width: "100%", justifyContent: "center", padding: 12, fontSize: 14, marginTop: 10 }} onClick={() => setPayOpen(true)}>
              <Ic n="cash" s={16} c="#fff" /> BAYAR
            </button>
          </div>
        </div>
      </div>

      {payOpen && <PayModal total={total} onClose={() => setPayOpen(false)} onConfirm={processPayment} />}
      {printSale && <ReceiptModal sale={printSale} shop={shop} branch={branch} onClose={() => setPrintSale(null)} />}
    </div>
  );
};

// ---------- PAY MODAL ----------
const PayModal = ({ total, onClose, onConfirm }) => {
  const [method, setMethod] = useState("cash");
  const [payAmt, setPayAmt] = useState(total);
  const change = payAmt - total;
  const quickCash = [total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000, Math.ceil(total / 100000) * 100000];
  const unique = [...new Set(quickCash)];

  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="mhd"><h3>💰 Pembayaran</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
        <div className="mbd">
          <div style={{ textAlign: "center", padding: 20, background: "var(--bg2)", borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700 }}>Total Bayar</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--pri)", marginTop: 4 }}>{rp(total)}</div>
          </div>
          <div className="fld">
            <label>Metode Pembayaran</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {PAY_METHODS.map((m) => (
                <button key={m.id} className={`btn ${method === m.id ? "pri" : "gh"}`} onClick={() => setMethod(m.id)} style={{ flexDirection: "column", padding: 10, fontSize: 11 }}>
                  <span style={{ fontSize: 18 }}>{m.icon}</span>{m.name}
                </button>
              ))}
            </div>
          </div>
          {method === "cash" && (
            <>
              <div className="fld">
                <label>Tunai Diterima</label>
                <input type="number" className="inp" value={payAmt} onChange={(e) => setPayAmt(Number(e.target.value))} style={{ fontSize: 18, fontWeight: 700 }} />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {unique.map((v) => <button key={v} className="btn gh sm" onClick={() => setPayAmt(v)}>{rp(v)}</button>)}
              </div>
              {change >= 0 && (
                <div style={{ padding: 12, background: "rgba(16,185,129,0.1)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>Kembalian</span>
                    <span style={{ fontWeight: 800, color: "var(--ok)", fontSize: 18 }}>{rp(change)}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="mft">
          <button className="btn gh" onClick={onClose}>Batal</button>
          <button className="btn pri" disabled={method === "cash" && payAmt < total} onClick={() => onConfirm(method, method === "cash" ? payAmt : total)}>
            <Ic n="check" /> Konfirmasi Bayar
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- RECEIPT MODAL ----------
const ReceiptModal = ({ sale, shop, branch, onClose }) => {
  const b = BRANCHES.find((x) => x.id === branch);
  const handlePrint = () => window.print();
  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="mhd"><h3>✅ Transaksi Berhasil</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
        <div className="mbd">
          <div className="receipt">
            <div className="hd">
              <h3>{shop.name}</h3>
              <div>{b?.name}</div>
              <div>{b?.addr}</div>
              <div>WA: {shop.waCS}</div>
            </div>
            <div className="ln"><span>No:</span><span>{sale.id}</span></div>
            <div className="ln"><span>Tgl:</span><span>{fFull(sale.createdAt)}</span></div>
            <div className="ln"><span>Pelanggan:</span><span>{sale.custName}</span></div>
            <div className="div" />
            {sale.items.map((it) => (
              <div key={it.id}>
                <div>{it.name}</div>
                <div className="ln"><span>{it.qty} x {rp(it.price)}</span><span>{rp(it.qty * it.price)}</span></div>
              </div>
            ))}
            <div className="div" />
            <div className="ln" style={{ fontWeight: 800, fontSize: 13 }}><span>TOTAL</span><span>{rp(sale.total)}</span></div>
            <div className="ln"><span>Bayar ({sale.payMethod.toUpperCase()})</span><span>{rp(sale.payAmt)}</span></div>
            {sale.change > 0 && <div className="ln"><span>Kembali</span><span>{rp(sale.change)}</span></div>}
            <div className="div" />
            <div className="ft">{shop.receiptFooter}</div>
          </div>
        </div>
        <div className="mft">
          <button className="btn wa" onClick={() => window.open(waLink(shop.waCS, `Bukti transaksi ${sale.id} - Total ${rp(sale.total)}`))}><Ic n="wa" /> WhatsApp</button>
          <button className="btn pri" onClick={handlePrint}><Ic n="print" /> Cetak</button>
        </div>
      </div>
    </div>
  );
};

// ---------- TIKET LIST ----------
const TicketPage = ({ tickets, setTickets, technicians, branch, setSelected, setPage, kilatOnly = false }) => {
  const [q, setQ] = useState("");
  const [fst, setFst] = useState("all");
  const bt = tickets.filter((t) => t.branch === branch && (kilatOnly ? t.kilat : true));
  const filtered = bt.filter((t) => {
    if (fst !== "all" && t.status !== fst) return false;
    if (q) {
      const s = q.toLowerCase();
      return t.id.toLowerCase().includes(s) || t.custName.toLowerCase().includes(s)
          || t.brand?.toLowerCase().includes(s) || t.model?.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="cnt">
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input className="inp" placeholder="🔍 Cari ID, nama, brand, model…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
        <select className="sel" style={{ width: 180 }} value={fst} onChange={(e) => setFst(e.target.value)}>
          <option value="all">Semua Status</option>
          {STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-ic">📋</div>
          <p>Belum ada tiket. Klik <b>+ Terima Servis</b> untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
          {filtered.map((t) => {
            const dev = DEVICE_TYPES.find((d) => d.id === t.device);
            const tech = technicians.find((x) => x.id === t.technicianId);
            return (
              <div key={t.id} className={`tck ${t.kilat ? "kilat" : ""}`} onClick={() => setSelected(t)}>
                <div className="tck-hd">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                      <span className="tck-id">{t.id}</span>
                      {t.kilat && <span className="bdg" style={{ background: "rgba(251,191,36,0.2)", color: "var(--acc)" }}>⚡ KILAT</span>}
                    </div>
                    <div className="tck-dev">{dev?.icon} {t.brand} {t.model}</div>
                    <div className="tck-cust">👤 {t.custName}</div>
                  </div>
                  <StatusBadge st={t.status} />
                </div>
                <div className="tck-cmp">💬 {t.complaint}</div>
                <div className="tck-ft">
                  <span>{tech ? `🔧 ${tech.name.split(" ")[0]}` : "Belum assign"}</span>
                  <span style={{ color: "var(--pri)", fontWeight: 700 }}>{rp(t.totalCost)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---------- NEW TICKET (4-step wizard) ----------
const NewTicketModal = ({ onClose, setTickets, customers, setCustomers, technicians, branch, kilat = false }) => {
  const [form, setForm] = useState({
    device: "hp-android", brand: "", model: "", imei: "", color: "",
    custName: "", custPhone: "", custEmail: "", custAddr: "",
    complaint: "", accessories: "", password: "",
    services: [], parts: [], technicianId: "",
    estDone: "", dp: 0, notes: "", kilat,
  });
  const [step, setStep] = useState(1);
  const upd = (k, v) => setForm({ ...form, [k]: v });

  const toggleService = (svc) => {
    const exists = form.services.find((s) => s.id === svc.id);
    if (exists) upd("services", form.services.filter((s) => s.id !== svc.id));
    else upd("services", [...form.services, { id: svc.id, name: svc.name, price: svc.price }]);
  };

  const total = form.services.reduce((s, x) => s + x.price, 0) + form.parts.reduce((s, x) => s + x.price, 0);

  const submit = () => {
    if (!form.custName || !form.custPhone || !form.complaint) {
      alert("Isi minimal: Nama pelanggan, No HP, dan Keluhan");
      return;
    }
    let custId = "";
    const existing = customers.find((c) => c.phone === form.custPhone);
    if (existing) custId = existing.id;
    else {
      const nc = { id: gid("CUST"), name: form.custName, phone: form.custPhone, email: form.custEmail, address: form.custAddr };
      setCustomers([...customers, nc]);
      custId = nc.id;
    }
    const newTicket = {
      id: genResi(),
      branch, customerId: custId, custName: form.custName, custPhone: form.custPhone,
      device: form.device, brand: form.brand, model: form.model, imei: form.imei, color: form.color,
      complaint: form.complaint, accessories: form.accessories, password: form.password,
      diagnosis: "", services: form.services, parts: form.parts, technicianId: form.technicianId,
      status: form.technicianId ? "diagnosa" : "antri", kilat: form.kilat,
      estDone: form.estDone || "", warranty: 30,
      totalCost: total, dp: Number(form.dp) || 0, sisa: total - (Number(form.dp) || 0),
      payMethod: "", createdAt: Date.now(), notes: form.notes,
    };
    setTickets((p) => [newTicket, ...p]);
    onClose(newTicket);
  };

  return (
    <div className="modal" onClick={() => onClose(null)}>
      <div className="mbox" onClick={(e) => e.stopPropagation()}>
        <div className="mhd">
          <h3>{form.kilat && "⚡ "}Terima Servis Baru</h3>
          <button className="close" onClick={() => onClose(null)}><Ic n="x" /></button>
        </div>
        <div className="mbd">
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {[{ n: 1, t: "Perangkat" }, { n: 2, t: "Pelanggan" }, { n: 3, t: "Servis" }, { n: 4, t: "Konfirmasi" }].map((s) => (
              <div key={s.n} className={`step ${step === s.n ? "on" : ""}`} onClick={() => setStep(s.n)}>
                <div className="dot">{s.n}</div><div className="lbl">{s.t}</div>
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="fld">
                <label>Jenis Perangkat</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {DEVICE_TYPES.map((d) => (
                    <button key={d.id} className={`btn sm ${form.device === d.id ? "pri" : "gh"}`} onClick={() => upd("device", d.id)}>{d.icon} {d.name}</button>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="fld"><label>Brand / Merek</label><input className="inp" value={form.brand} onChange={(e) => upd("brand", e.target.value)} placeholder="Apple, Samsung, Asus" /></div>
                <div className="fld"><label>Model / Tipe</label><input className="inp" value={form.model} onChange={(e) => upd("model", e.target.value)} placeholder="iPhone 13, Galaxy A52" /></div>
              </div>
              <div className="row">
                <div className="fld"><label>IMEI / SN</label><input className="inp" value={form.imei} onChange={(e) => upd("imei", e.target.value)} /></div>
                <div className="fld"><label>Warna</label><input className="inp" value={form.color} onChange={(e) => upd("color", e.target.value)} /></div>
              </div>
              <div className="fld"><label>Keluhan / Kerusakan *</label><textarea className="txa" rows={3} value={form.complaint} onChange={(e) => upd("complaint", e.target.value)} /></div>
              <div className="row">
                <div className="fld"><label>Aksesoris</label><input className="inp" value={form.accessories} onChange={(e) => upd("accessories", e.target.value)} placeholder="Charger, case" /></div>
                <div className="fld"><label>Password / PIN</label><input className="inp" value={form.password} onChange={(e) => upd("password", e.target.value)} /></div>
              </div>
              <div className="fld">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.kilat} onChange={(e) => upd("kilat", e.target.checked)} />
                  ⚡ Servis Kilat (prioritas, biaya extra)
                </label>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="row">
                <div className="fld"><label>Nama Lengkap *</label><input className="inp" value={form.custName} onChange={(e) => upd("custName", e.target.value)} /></div>
                <div className="fld"><label>No HP (WhatsApp) *</label><input className="inp" value={form.custPhone} onChange={(e) => upd("custPhone", e.target.value)} placeholder="0812..." /></div>
              </div>
              <div className="fld"><label>Email</label><input className="inp" value={form.custEmail} onChange={(e) => upd("custEmail", e.target.value)} /></div>
              <div className="fld"><label>Alamat</label><textarea className="txa" rows={2} value={form.custAddr} onChange={(e) => upd("custAddr", e.target.value)} /></div>
              <div style={{ fontSize: 12, padding: 10, background: "rgba(59,130,246,0.1)", borderRadius: 8, border: "1px solid rgba(59,130,246,0.3)" }}>ℹ️ Jika nomor HP sudah terdaftar, data akan otomatis terhubung.</div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="fld">
                <label>Pilih Jenis Servis</label>
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
                  {SERVICE_CATALOG.map((s) => {
                    const sel = form.services.find((x) => x.id === s.id);
                    return (
                      <div key={s.id} onClick={() => toggleService(s)}
                        style={{ padding: 10, border: `1px solid ${sel ? "var(--pri)" : "var(--line)"}`, borderRadius: 8, cursor: "pointer", background: sel ? "rgba(249,115,22,0.1)" : "var(--bg2)" }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 4 }}>⏱️{s.durasi} • 🛡️{s.warranty}h</div>
                        <div style={{ fontSize: 12, color: "var(--pri)", fontWeight: 800, marginTop: 4 }}>{rp(s.price)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="row" style={{ marginTop: 14 }}>
                <div className="fld">
                  <label>Assign Teknisi</label>
                  <select className="sel" value={form.technicianId} onChange={(e) => upd("technicianId", e.target.value)}>
                    <option value="">— Nanti —</option>
                    {technicians.filter((t) => t.branch === branch).map((t) => <option key={t.id} value={t.id}>{t.name} • ⭐{t.rating}</option>)}
                  </select>
                </div>
                <div className="fld"><label>Estimasi Selesai</label><input className="inp" value={form.estDone} onChange={(e) => upd("estDone", e.target.value)} placeholder="17/04/2026" /></div>
              </div>
              <div className="row">
                <div className="fld"><label>DP / Uang Muka</label><input type="number" className="inp" value={form.dp} onChange={(e) => upd("dp", e.target.value)} /></div>
                <div className="fld"><label>Catatan</label><input className="inp" value={form.notes} onChange={(e) => upd("notes", e.target.value)} /></div>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <div style={{ padding: 14, background: "var(--bg2)", borderRadius: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Perangkat</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{DEVICE_TYPES.find((d) => d.id === form.device)?.icon} {form.brand} {form.model}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 8 }}>💬 {form.complaint}</div>
              </div>
              <div style={{ padding: 14, background: "var(--bg2)", borderRadius: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Pelanggan</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{form.custName}</div>
                <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 4 }}>📞 {form.custPhone}</div>
              </div>
              <div style={{ padding: 14, background: "var(--bg2)", borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Servis</div>
                {form.services.length === 0 ? <div style={{ fontSize: 12, color: "var(--txt3)" }}>Belum ada servis</div>
                  : form.services.map((s) => <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span style={{ fontSize: 13 }}>{s.name}</span><span style={{ fontSize: 13 }}>{rp(s.price)}</span></div>)
                }
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "2px solid var(--pri)", fontWeight: 800 }}>
                  <span>TOTAL</span><span style={{ color: "var(--pri)", fontSize: 16 }}>{rp(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mft">
          {step > 1 && <button className="btn gh" onClick={() => setStep(step - 1)}><Ic n="back" /> Kembali</button>}
          <button className="btn gh" onClick={() => onClose(null)}>Batal</button>
          {step < 4 ? <button className="btn pri" onClick={() => setStep(step + 1)}>Lanjut <Ic n="arrow" /></button>
                    : <button className="btn pri" onClick={submit}><Ic n="check" /> Buat Tiket</button>}
        </div>
      </div>
    </div>
  );
};

// ---------- TICKET DETAIL ----------
const TicketDetail = ({ ticket, setTickets, technicians, onClose, shop }) => {
  const [t, setT] = useState(ticket);
  const [diagMode, setDiagMode] = useState(false);
  const tech = technicians.find((x) => x.id === t.technicianId);
  const dev = DEVICE_TYPES.find((d) => d.id === t.device);

  const save = (updates) => {
    const nt = { ...t, ...updates };
    setT(nt);
    setTickets((prev) => prev.map((x) => x.id === nt.id ? nt : x));
  };

  const sendWA = (msgType) => {
    const trackUrl = `${window.location.origin}${window.location.pathname}#track-${t.id}`;
    const msgs = {
      masuk: `Halo ${t.custName}, terima kasih telah mempercayakan perangkat Anda ke ${shop.name}.\n\n🛠️ Resi: ${t.id}\n📱 Perangkat: ${t.brand} ${t.model}\n💬 Keluhan: ${t.complaint}\n\nLacak status di:\n${trackUrl}`,
      diagnosa: `Halo ${t.custName}, hasil diagnosa ${t.brand} ${t.model}:\n\n🔍 ${t.diagnosis || "-"}\n💰 Estimasi: ${rp(t.totalCost)}\n\nMohon konfirmasi untuk lanjut perbaikan. 🙏`,
      selesai: `Halo ${t.custName}, kabar baik! 🎉\n\nPerangkat ${t.brand} ${t.model} sudah selesai diperbaiki.\n\n🛠️ Resi: ${t.id}\n💰 Total: ${rp(t.totalCost)}\n💵 Sisa: ${rp(t.sisa)}\n🛡️ Garansi: ${t.warranty} hari\n\nSilakan diambil. Terima kasih!`,
    };
    window.open(waLink(t.custPhone, msgs[msgType]), "_blank");
  };

  const statusFlow = ["masuk", "antri", "diagnosa", "menunggu", "repair", "selesai", "ambil"];
  const curIdx = statusFlow.indexOf(t.status);

  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" onClick={(e) => e.stopPropagation()}>
        <div className="mhd">
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <h3>{t.id}</h3>
              {t.kilat && <span className="bdg" style={{ background: "rgba(251,191,36,0.2)", color: "var(--acc)" }}>⚡ KILAT</span>}
            </div>
            <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>{fFull(t.createdAt)}</div>
          </div>
          <button className="close" onClick={onClose}><Ic n="x" /></button>
        </div>
        <div className="mbd">
          <div className="prog-line">
            {statusFlow.map((s, i) => {
              const label = STATUS.find((x) => x.id === s)?.label || s;
              const done = i < curIdx;
              const on = i === curIdx;
              return (
                <React.Fragment key={s}>
                  <div className={`prog-step ${on ? "on" : ""} ${done ? "done" : ""}`}>
                    <div className="dot">{done ? "✓" : i + 1}</div>
                    <div className="lbl">{label}</div>
                  </div>
                  {i < statusFlow.length - 1 && <div className={`prog-bar ${done ? "done" : ""}`} />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>👤 Pelanggan</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.custName}</div>
              <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 4 }}>📞 {t.custPhone}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                <button className="btn wa sm" onClick={() => sendWA("masuk")}><Ic n="wa" s={12} /> Masuk</button>
                <button className="btn wa sm" onClick={() => sendWA("diagnosa")}>Diagnosa</button>
                <button className="btn wa sm" onClick={() => sendWA("selesai")}>Selesai</button>
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{dev?.icon} Perangkat</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.brand} {t.model}</div>
              <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 4 }}>IMEI: {t.imei || "-"} • {t.color}</div>
              {t.accessories && <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 4 }}>Aksesoris: {t.accessories}</div>}
            </div>
          </div>

          <div className="card" style={{ padding: 14, marginTop: 12 }}>
            <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>💬 Keluhan</div>
            <div style={{ fontSize: 13 }}>{t.complaint}</div>
            {t.diagnosis && (
              <>
                <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginTop: 12, marginBottom: 6 }}>🔍 Diagnosa</div>
                <div style={{ fontSize: 13 }}>{t.diagnosis}</div>
              </>
            )}
            {!diagMode ? (
              <button className="btn gh sm" style={{ marginTop: 10 }} onClick={() => setDiagMode(true)}><Ic n="edit" s={12} /> Edit Diagnosa</button>
            ) : (
              <div style={{ marginTop: 10 }}>
                <textarea className="txa" rows={3} value={t.diagnosis} onChange={(e) => setT({ ...t, diagnosis: e.target.value })} />
                <div style={{ marginTop: 6 }}>
                  <button className="btn pri sm" onClick={() => { save({ diagnosis: t.diagnosis }); setDiagMode(false); }}>Simpan</button>
                  <button className="btn gh sm" onClick={() => setDiagMode(false)} style={{ marginLeft: 6 }}>Batal</button>
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 14, marginTop: 12 }}>
            <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>💰 Rincian Biaya</div>
            {t.services.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ fontSize: 13 }}>{s.name}</span><span style={{ fontSize: 13 }}>{rp(s.price)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--line)", fontWeight: 700 }}>
              <span>Total</span><span style={{ color: "var(--pri)" }}>{rp(t.totalCost)}</span>
            </div>
            {t.dp > 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--txt2)", marginTop: 4 }}><span>DP</span><span>{rp(t.dp)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--warn)", fontWeight: 700, marginTop: 2 }}><span>Sisa</span><span>{rp(t.sisa)}</span></div>
              </>
            )}
            <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 10 }}>🛡️ Garansi: {t.warranty} hari • 🔧 {tech?.name || "Belum di-assign"}</div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Update Status</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {STATUS.map((s) => (
                <button key={s.id} className={`btn sm ${t.status === s.id ? "pri" : "gh"}`} onClick={() => save({ status: s.id })}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mft">
          <button className="btn gh" onClick={() => window.print()}><Ic n="print" /> Print</button>
          <button className="btn pri" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
};

// ---------- INVENTARIS ----------
const InventoryPage = ({ products, setProducts, suppliers, purchases, setPurchases }) => {
  const [q, setQ] = useState("");
  const [editProd, setEditProd] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showSup, setShowSup] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const [showKulakan, setShowKulakan] = useState(false);

  const filtered = products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.barcode?.includes(q));
  const low = products.filter((p) => p.stock < 5);

  const exportProducts = () => {
    const rows = [["Nama", "Kategori", "Stok", "Harga Jual", "Modal", "Margin", "Nilai Stok", "Barcode"]];
    products.forEach((p) => rows.push([p.name, p.cat, p.stock, p.price, p.modal, p.price - p.modal, p.stock * p.price, p.barcode]));
    downloadCSV(`inventaris-${Date.now()}.csv`, rows);
  };

  return (
    <div className="cnt">
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <input className="inp" placeholder="🔍 Cari produk..." value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <button className="btn gh" onClick={() => setShowSup(true)}><Ic n="truck" s={14} /> Supplier</button>
        <button className="btn gh" onClick={() => setShowHist(true)}><Ic n="history" s={14} /> Riwayat Kulakan</button>
        <button className="btn ok" onClick={() => setShowKulakan(true)}><Ic n="plus" s={14} /> Kulakan</button>
        <button className="btn gh icn" onClick={exportProducts} title="Export CSV"><Ic n="download" s={14} /></button>
        <button className="btn pri" onClick={() => setShowAdd(true)}><Ic n="plus" s={14} /> Tambah Produk</button>
      </div>

      {low.length > 0 && (
        <div className="card" style={{ marginBottom: 14, background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Ic n="alert" s={20} c="var(--err)" />
            <div>
              <div style={{ fontWeight: 700, color: "var(--err)" }}>Stok Menipis</div>
              <div style={{ fontSize: 12, color: "var(--txt2)" }}>{low.length} produk stok &lt; 5 unit</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
        {filtered.map((p) => (
          <div key={p.id} className="card" style={{ padding: 12 }}>
            <div style={{ width: "100%", aspectRatio: "1", background: "var(--bg2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, marginBottom: 10 }}>{p.img}</div>
            <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700 }}>{PRODUCT_CATS.find(c => c.id === p.cat)?.name}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--txt3)" }}>
              <span>Harga Jual</span><span>Stok</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--pri)" }}>{rp(p.price)}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: p.stock < 5 ? "var(--err)" : "var(--ok)" }}>{p.stock} pcs</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <button className="btn gh sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEditProd(p)}><Ic n="edit" s={12} /> Edit</button>
              <button className="btn gh sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => {
                const n = prompt("Tambah stok:", "0");
                if (n) setProducts(products.map((x) => x.id === p.id ? { ...x, stock: x.stock + Number(n) } : x));
              }}>📦 Stok</button>
            </div>
          </div>
        ))}
      </div>

      {(showAdd || editProd) && <ProductFormModal product={editProd} suppliers={suppliers} onClose={() => { setShowAdd(false); setEditProd(null); }} onSave={(p) => {
        if (editProd) setProducts(products.map((x) => x.id === p.id ? p : x));
        else setProducts([...products, { ...p, id: gid("PROD") }]);
        setShowAdd(false); setEditProd(null);
      }} />}
      {showSup && <SupplierModal suppliers={suppliers} onClose={() => setShowSup(false)} />}
      {showHist && <PurchaseHistoryModal purchases={purchases} suppliers={suppliers} onClose={() => setShowHist(false)} />}
      {showKulakan && <KulakanModal products={products} setProducts={setProducts} suppliers={suppliers} purchases={purchases} setPurchases={setPurchases} onClose={() => setShowKulakan(false)} />}
    </div>
  );
};

const ProductFormModal = ({ product, suppliers, onClose, onSave }) => {
  const [f, setF] = useState(product || { name: "", cat: "spare", stock: 0, price: 0, modal: 0, img: "📦", supplier: suppliers[0]?.id || "", barcode: "" });
  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="mhd"><h3>{product ? "Edit" : "Tambah"} Produk</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
        <div className="mbd">
          <div className="row">
            <div className="fld" style={{ flex: 0, minWidth: 80 }}><label>Icon</label><input className="inp" value={f.img} onChange={(e) => setF({ ...f, img: e.target.value })} style={{ fontSize: 24, textAlign: "center" }} /></div>
            <div className="fld"><label>Nama Produk *</label><input className="inp" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          </div>
          <div className="row">
            <div className="fld"><label>Kategori</label><select className="sel" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>{PRODUCT_CATS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
            <div className="fld"><label>Supplier</label><select className="sel" value={f.supplier} onChange={(e) => setF({ ...f, supplier: e.target.value })}><option value="">-</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          </div>
          <div className="row">
            <div className="fld"><label>Harga Modal</label><input type="number" className="inp" value={f.modal} onChange={(e) => setF({ ...f, modal: Number(e.target.value) })} /></div>
            <div className="fld"><label>Harga Jual *</label><input type="number" className="inp" value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} /></div>
          </div>
          <div className="row">
            <div className="fld"><label>Stok Awal</label><input type="number" className="inp" value={f.stock} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} /></div>
            <div className="fld"><label>Barcode</label><input className="inp" value={f.barcode} onChange={(e) => setF({ ...f, barcode: e.target.value })} /></div>
          </div>
          {f.price > 0 && f.modal > 0 && (
            <div style={{ padding: 10, background: "rgba(16,185,129,0.1)", borderRadius: 8, fontSize: 12 }}>
              💰 Margin: <b style={{ color: "var(--ok)" }}>{rp(f.price - f.modal)}</b> ({Math.round((f.price - f.modal) / f.modal * 100)}%)
            </div>
          )}
        </div>
        <div className="mft"><button className="btn gh" onClick={onClose}>Batal</button><button className="btn pri" onClick={() => onSave(f)}><Ic n="check" /> Simpan</button></div>
      </div>
    </div>
  );
};

const SupplierModal = ({ suppliers, onClose }) => (
  <div className="modal" onClick={onClose}>
    <div className="mbox" onClick={(e) => e.stopPropagation()}>
      <div className="mhd"><h3><Ic n="truck" /> Daftar Supplier</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
      <div className="mbd">
        {suppliers.map((s) => (
          <div key={s.id} className="card" style={{ marginBottom: 8, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 4 }}>📞 {s.phone}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>{s.addr}</div>
              </div>
              <a className="btn wa sm" href={waLink(s.phone, "Halo, kami ingin pesan barang")} target="_blank" rel="noreferrer"><Ic n="wa" s={12} /> WA</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PurchaseHistoryModal = ({ purchases, suppliers, onClose }) => (
  <div className="modal" onClick={onClose}>
    <div className="mbox" onClick={(e) => e.stopPropagation()}>
      <div className="mhd"><h3><Ic n="history" /> Riwayat Kulakan</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
      <div className="mbd">
        <table className="tbl">
          <thead><tr><th>ID</th><th>Tanggal</th><th>Supplier</th><th>Items</th><th className="n">Total</th></tr></thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td><span className="tck-id">{p.id}</span></td>
                <td style={{ fontSize: 12 }}>{fD(p.createdAt)}</td>
                <td>{suppliers.find((s) => s.id === p.supplierId)?.name}</td>
                <td><span className="chip">{p.items.length} produk</span></td>
                <td className="n" style={{ color: "var(--pri)", fontWeight: 700 }}>{rp(p.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const KulakanModal = ({ products, setProducts, suppliers, purchases, setPurchases, onClose }) => {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");

  const addItem = (p) => {
    if (items.find((x) => x.id === p.id)) return;
    setItems([...items, { id: p.id, name: p.name, qty: 1, price: p.modal }]);
  };
  const updItem = (id, k, v) => setItems(items.map((x) => x.id === id ? { ...x, [k]: v } : x));
  const removeItem = (id) => setItems(items.filter((x) => x.id !== id));
  const total = items.reduce((s, x) => s + x.qty * x.price, 0);

  const submit = () => {
    if (items.length === 0) return alert("Tambah minimal 1 produk");
    const po = { id: gid("PO"), branch: "b1", supplierId, items, total, createdAt: Date.now(), notes };
    setPurchases([po, ...purchases]);
    setProducts(products.map((p) => {
      const i = items.find((x) => x.id === p.id);
      return i ? { ...p, stock: p.stock + i.qty, modal: i.price } : p;
    }));
    alert(`Kulakan berhasil! ${items.length} produk masuk stok.`);
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" onClick={(e) => e.stopPropagation()}>
        <div className="mhd"><h3>🛒 Kulakan / Pembelian Stok</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
        <div className="mbd">
          <div className="fld">
            <label>Supplier</label>
            <select className="sel" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Pilih Produk</label>
            <select className="sel" onChange={(e) => { const p = products.find((x) => x.id === e.target.value); if (p) addItem(p); e.target.value = ""; }}>
              <option value="">+ Pilih produk...</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} (stok: {p.stock})</option>)}
            </select>
          </div>
          {items.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 11, color: "var(--txt2)", textTransform: "uppercase", fontWeight: 600 }}>Items</label>
              {items.map((it) => (
                <div key={it.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, background: "var(--bg2)", borderRadius: 8, marginBottom: 6 }}>
                  <div style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{it.name}</div>
                  <input type="number" className="inp" value={it.qty} onChange={(e) => updItem(it.id, "qty", Number(e.target.value))} style={{ width: 70, padding: 6 }} />
                  <input type="number" className="inp" value={it.price} onChange={(e) => updItem(it.id, "price", Number(e.target.value))} style={{ width: 100, padding: 6 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, minWidth: 90, textAlign: "right" }}>{rp(it.qty * it.price)}</span>
                  <button className="close" onClick={() => removeItem(it.id)}><Ic n="x" s={14} /></button>
                </div>
              ))}
              <div style={{ padding: 12, background: "var(--bg2)", borderRadius: 8, marginTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
                <span>TOTAL</span><span style={{ color: "var(--pri)", fontSize: 16 }}>{rp(total)}</span>
              </div>
            </div>
          )}
          <div className="fld" style={{ marginTop: 12 }}><label>Catatan</label><input className="inp" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <div className="mft">
          <button className="btn gh" onClick={onClose}>Batal</button>
          <button className="btn pri" disabled={items.length === 0} onClick={submit}><Ic n="check" /> Proses Kulakan</button>
        </div>
      </div>
    </div>
  );
};

// ---------- TRACKING PUBLIK ----------
const TrackingPage = ({ tickets }) => {
  const [q, setQ] = useState("");
  const [found, setFound] = useState(null);
  const track = () => {
    const t = tickets.find((x) => x.id.toLowerCase() === q.trim().toLowerCase());
    if (t) setFound(t);
    else { alert("Resi tidak ditemukan"); setFound(null); }
  };
  const statusFlow = ["masuk", "antri", "diagnosa", "menunggu", "repair", "selesai", "ambil"];
  const curIdx = found ? statusFlow.indexOf(found.status) : -1;

  return (
    <div className="cnt" style={{ maxWidth: 720 }}>
      <div className="track-hero">
        <div style={{ fontSize: 42, marginBottom: 8 }}>🔍</div>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Lacak Status Perbaikan</h2>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 6 }}>Masukkan nomor resi untuk melihat progres</p>
        <div style={{ display: "flex", gap: 8, marginTop: 18, maxWidth: 420, margin: "18px auto 0" }}>
          <input className="inp" placeholder="Contoh: GK4PLLCMYL" value={q} onChange={(e) => setQ(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && track()} />
          <button className="btn pri" onClick={track}><Ic n="search" /> Lacak</button>
        </div>
      </div>

      {found && (
        <div className="card" style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700 }}>Resi</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace" }}>{found.id}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{found.brand} {found.model} • {found.custName}</div>
            </div>
            <StatusBadge st={found.status} />
          </div>
          <div className="prog-line">
            {statusFlow.map((s, i) => {
              const label = STATUS.find((x) => x.id === s)?.label || s;
              const done = i < curIdx;
              const on = i === curIdx;
              return (
                <React.Fragment key={s}>
                  <div className={`prog-step ${on ? "on" : ""} ${done ? "done" : ""}`}>
                    <div className="dot">{done ? "✓" : i + 1}</div><div className="lbl">{label}</div>
                  </div>
                  {i < statusFlow.length - 1 && <div className={`prog-bar ${done ? "done" : ""}`} />}
                </React.Fragment>
              );
            })}
          </div>
          <div style={{ padding: 14, background: "var(--bg2)", borderRadius: 10, marginTop: 14 }}>
            <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>💬 Keluhan</div>
            <div style={{ fontSize: 13 }}>{found.complaint}</div>
            {found.diagnosis && (
              <>
                <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700, marginTop: 12, marginBottom: 6 }}>🔍 Diagnosa</div>
                <div style={{ fontSize: 13 }}>{found.diagnosis}</div>
              </>
            )}
          </div>
          <div className="row" style={{ marginTop: 14 }}>
            <div className="card" style={{ padding: 12 }}><div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700 }}>Estimasi</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{found.estDone || "-"}</div></div>
            <div className="card" style={{ padding: 12 }}><div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700 }}>Total</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: "var(--pri)" }}>{rp(found.totalCost)}</div></div>
            <div className="card" style={{ padding: 12 }}><div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", fontWeight: 700 }}>Garansi</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{found.warranty} hari</div></div>
          </div>
          <div style={{ marginTop: 14, padding: 16, background: "#fff", borderRadius: 10, textAlign: "center" }}>
            <div style={{ color: "#000", fontSize: 12, marginBottom: 8, fontWeight: 700 }}>QR Kode Resi</div>
            <QR value={found.id} size={140} />
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- CUSTOMERS ----------
const CustomerPage = ({ customers, setCustomers, tickets }) => {
  const [q, setQ] = useState("");
  const [mod, setMod] = useState(false);
  const [frm, setFrm] = useState({ name: "", phone: "", email: "", address: "" });
  const enriched = customers.map((c) => {
    const ct = tickets.filter((t) => t.customerId === c.id);
    const totalSpent = ct.filter((t) => ["selesai", "ambil"].includes(t.status)).reduce((s, t) => s + t.totalCost, 0);
    return { ...c, visits: ct.length, totalSpent };
  }).filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));
  const add = () => {
    if (!frm.name || !frm.phone) return alert("Isi nama & no HP");
    setCustomers([...customers, { id: gid("CUST"), ...frm }]);
    setFrm({ name: "", phone: "", email: "", address: "" });
    setMod(false);
  };
  return (
    <div className="cnt">
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input className="inp" placeholder="Cari nama atau no HP…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1 }} />
        <button className="btn pri" onClick={() => setMod(true)}><Ic n="plus" /> Pelanggan Baru</button>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Nama</th><th>No HP</th><th>Kunjungan</th><th className="n">Total Belanja</th><th>Aksi</th></tr></thead>
          <tbody>
            {enriched.map((c) => (
              <tr key={c.id}>
                <td><b>{c.name}</b></td>
                <td>{c.phone}</td>
                <td><span className="chip">{c.visits}×</span></td>
                <td className="n" style={{ color: "var(--pri)", fontWeight: 700 }}>{rp(c.totalSpent)}</td>
                <td><a className="btn wa sm" href={waLink(c.phone, `Halo ${c.name}`)} target="_blank" rel="noreferrer"><Ic n="wa" s={12} /> WA</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mod && (
        <div className="modal" onClick={() => setMod(false)}>
          <div className="mbox" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="mhd"><h3>Pelanggan Baru</h3><button className="close" onClick={() => setMod(false)}><Ic n="x" /></button></div>
            <div className="mbd">
              <div className="fld"><label>Nama *</label><input className="inp" value={frm.name} onChange={(e) => setFrm({ ...frm, name: e.target.value })} /></div>
              <div className="fld"><label>No HP *</label><input className="inp" value={frm.phone} onChange={(e) => setFrm({ ...frm, phone: e.target.value })} /></div>
              <div className="fld"><label>Email</label><input className="inp" value={frm.email} onChange={(e) => setFrm({ ...frm, email: e.target.value })} /></div>
              <div className="fld"><label>Alamat</label><textarea className="txa" rows={2} value={frm.address} onChange={(e) => setFrm({ ...frm, address: e.target.value })} /></div>
            </div>
            <div className="mft"><button className="btn gh" onClick={() => setMod(false)}>Batal</button><button className="btn pri" onClick={add}><Ic n="check" /> Simpan</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- TECHNICIANS ----------
const TechnicianPage = ({ technicians, tickets, branch }) => {
  const bt = technicians.filter((t) => t.branch === branch);
  return (
    <div className="cnt">
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
        {bt.map((t) => {
          const active = tickets.filter((x) => x.technicianId === t.id && !["selesai", "ambil", "batal"].includes(x.status)).length;
          return (
            <div key={t.id} className="card">
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div className="avatar" style={{ width: 54, height: 54, fontSize: 20 }}>{t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)" }}>{t.spec}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>📞 {t.phone}</div>
                </div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={{ padding: 10, background: "var(--bg2)", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--acc)" }}>⭐{t.rating}</div>
                  <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase" }}>Rating</div>
                </div>
                <div style={{ padding: 10, background: "var(--bg2)", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ok)" }}>{t.done}</div>
                  <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase" }}>Selesai</div>
                </div>
                <div style={{ padding: 10, background: "var(--bg2)", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--pri)" }}>{active}</div>
                  <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase" }}>Aktif</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- HISTORY ----------
const HistoryPage = ({ tickets, sales, branch, shop }) => {
  const [tab, setTab] = useState("sales");
  const [printSale, setPrintSale] = useState(null);
  const bs = sales.filter((s) => s.branch === branch);
  const bt = tickets.filter((t) => t.branch === branch && t.status === "ambil");

  const exportSales = () => {
    const rows = [["Resi", "Tanggal", "Pelanggan", "Items", "Total", "Pembayaran"]];
    bs.forEach((s) => rows.push([s.id, fFull(s.createdAt), s.custName, s.items.length, s.total, s.payMethod.toUpperCase()]));
    downloadCSV(`riwayat-penjualan-${Date.now()}.csv`, rows);
  };

  return (
    <div className="cnt">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>🕒 Riwayat Transaksi</h3>
          <button className="btn gh sm" onClick={exportSales}><Ic n="download" s={12} /> Export CSV</button>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === "sales" ? "on" : ""}`} onClick={() => setTab("sales")}>📋 Penjualan (POS)</button>
          <button className={`tab ${tab === "service" ? "on" : ""}`} onClick={() => setTab("service")}>✓ Servis Diambil</button>
        </div>
        {tab === "sales" ? (
          <table className="tbl">
            <thead><tr><th>Resi / Waktu</th><th>Pelanggan</th><th>Item</th><th className="n">Total</th><th>Pembayaran</th><th>Aksi</th></tr></thead>
            <tbody>
              {bs.map((s) => (
                <tr key={s.id}>
                  <td><div style={{ fontFamily: "monospace", fontWeight: 700 }}>{s.id}</div><div style={{ fontSize: 11, color: "var(--txt3)" }}>{fFull(s.createdAt)}</div></td>
                  <td>{s.custName}</td>
                  <td><span className="chip">{s.items.length} produk</span></td>
                  <td className="n" style={{ color: "var(--pri)", fontWeight: 700 }}>{rp(s.total)}</td>
                  <td><span style={{ color: "var(--ok)", fontWeight: 700 }}>LUNAS - {s.payMethod.toUpperCase()}</span></td>
                  <td>
                    <button className="btn icn gh" onClick={() => setPrintSale(s)}><Ic n="print" s={14} /></button>
                    <a className="btn icn wa" href={waLink(shop.waCS, `Bukti ${s.id} - ${rp(s.total)}`)} target="_blank" rel="noreferrer" style={{ marginLeft: 4 }}><Ic n="wa" s={14} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="tbl">
            <thead><tr><th>Resi</th><th>Pelanggan</th><th>Perangkat</th><th>Tanggal Selesai</th><th className="n">Total</th></tr></thead>
            <tbody>
              {bt.map((t) => (
                <tr key={t.id}>
                  <td><span className="tck-id">{t.id}</span></td>
                  <td>{t.custName}</td>
                  <td>{t.brand} {t.model}</td>
                  <td style={{ fontSize: 12 }}>{fD(t.createdAt)}</td>
                  <td className="n" style={{ color: "var(--pri)", fontWeight: 700 }}>{rp(t.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {printSale && <ReceiptModal sale={printSale} shop={shop} branch={branch} onClose={() => setPrintSale(null)} />}
    </div>
  );
};

// ---------- REPORT ----------
const ReportPage = ({ tickets, sales, products, technicians, branch }) => {
  const [period, setPeriod] = useState("month");
  const bt = tickets.filter((t) => t.branch === branch);
  const bs = sales.filter((s) => s.branch === branch);
  const totalSales = bs.reduce((s, x) => s + x.total, 0);
  const avgSales = bs.length ? totalSales / bs.length : 0;
  const totalService = bt.filter((t) => ["selesai", "ambil"].includes(t.status)).reduce((s, t) => s + t.totalCost, 0);
  const stockValue = products.reduce((s, p) => s + p.stock * p.modal, 0);
  const lowStock = products.filter((p) => p.stock < 5);
  const byPay = {};
  bs.forEach((s) => { byPay[s.payMethod] = (byPay[s.payMethod] || 0) + s.total; });
  const byDevice = DEVICE_TYPES.map((d) => ({ ...d, count: bt.filter((t) => t.device === d.id).length }));
  const byTech = technicians.filter((t) => t.branch === branch).map((t) => {
    const ct = bt.filter((x) => x.technicianId === t.id);
    return { ...t, tickets: ct.length, omset: ct.filter((x) => ["selesai", "ambil"].includes(x.status)).reduce((s, x) => s + x.totalCost, 0) };
  }).sort((a, b) => b.omset - a.omset);

  const exportReport = () => {
    const rows = [
      ["LAPORAN PENJUALAN"],
      ["Total Penjualan", rp(totalSales)],
      ["Total Transaksi", bs.length],
      ["Rata-rata", rp(avgSales)],
      [],
      ["Per Metode Pembayaran"],
      ...Object.entries(byPay).map(([m, v]) => [m.toUpperCase(), rp(v)]),
      [],
      ["LAPORAN SERVIS"],
      ["Total Omset Servis", rp(totalService)],
      ["Total Tiket", bt.length],
      [],
      ["LAPORAN STOK"],
      ["Total Produk", products.length],
      ["Nilai Stok", rp(stockValue)],
      ["Stok Rendah", lowStock.length],
    ];
    downloadCSV(`laporan-${period}-${Date.now()}.csv`, rows);
  };

  return (
    <div className="cnt">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800 }}>📊 Laporan Bisnis</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="sel" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: 140 }}>
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
          <button className="btn gh" onClick={exportReport}><Ic n="download" s={14} /> CSV</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>📈 Laporan Penjualan ({period})</h4>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <div className="kpi"><div className="lbl">Total Penjualan</div><div className="v" style={{ fontSize: 22 }}>{rp(totalSales)}</div></div>
          <div className="kpi alt"><div className="lbl">Total Transaksi</div><div className="v">{bs.length}</div></div>
          <div className="kpi alt2"><div className="lbl">Rata-rata</div><div className="v" style={{ fontSize: 22 }}>{rp(avgSales)}</div></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 6, fontWeight: 700, textTransform: "uppercase" }}>Per Metode Pembayaran</div>
          {Object.entries(byPay).map(([m, v]) => (
            <div key={m} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed var(--line)" }}>
              <span>{PAY_METHODS.find(p => p.id === m)?.icon} {m.toUpperCase()}</span>
              <span style={{ fontWeight: 700 }}>{rp(v)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>🔧 Laporan Servis</h4>
        <div className="row">
          <div className="kpi"><div className="lbl">Omset Servis</div><div className="v" style={{ fontSize: 20 }}>{rp(totalService)}</div></div>
          <div className="kpi alt"><div className="lbl">Total Tiket</div><div className="v">{bt.length}</div></div>
          <div className="kpi alt2"><div className="lbl">Selesai</div><div className="v">{bt.filter(t => ["selesai", "ambil"].includes(t.status)).length}</div></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>Per Jenis Perangkat</div>
          {byDevice.map((d) => (
            <div key={d.id} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span>{d.icon} {d.name}</span><span>{d.count}</span>
              </div>
              <div style={{ height: 6, background: "var(--bg2)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${bt.length ? (d.count / bt.length) * 100 : 0}%`, background: "linear-gradient(90deg,var(--pri),var(--acc))", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>📦 Laporan Stok</h4>
        <div className="row">
          <div className="kpi"><div className="lbl">Total Produk</div><div className="v">{products.length}</div></div>
          <div className="kpi alt"><div className="lbl">Nilai Stok</div><div className="v" style={{ fontSize: 18 }}>{rp(stockValue)}</div></div>
          <div className="kpi alt4"><div className="lbl">Stok Rendah</div><div className="v" style={{ color: lowStock.length ? "var(--err)" : "var(--ok)" }}>{lowStock.length}</div></div>
        </div>
      </div>

      <div className="card">
        <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>🔧 Performa Teknisi</h4>
        <table className="tbl">
          <thead><tr><th>Teknisi</th><th>Spesialisasi</th><th>Rating</th><th>Tiket</th><th className="n">Omset</th></tr></thead>
          <tbody>
            {byTech.map((t) => (
              <tr key={t.id}>
                <td><b>{t.name}</b></td>
                <td>{t.spec}</td>
                <td style={{ color: "var(--acc)" }}>⭐ {t.rating}</td>
                <td><span className="chip">{t.tickets}</span></td>
                <td className="n" style={{ color: "var(--pri)", fontWeight: 700 }}>{rp(t.omset)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------- SETTINGS ----------
const SettingPage = ({ shop, setShop, users, setUsers }) => {
  const [showUserMod, setShowUserMod] = useState(false);
  const [editUser, setEditUser] = useState(null);
  return (
    <div className="cnt">
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>🏪 Profil Toko</h3>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ width: 80, height: 80, margin: "0 auto", borderRadius: "50%", background: "linear-gradient(135deg,var(--pri),var(--acc))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff", fontWeight: 800 }}>
              {shop.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </div>
            <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 6 }}>Logo Toko</div>
          </div>
          <div className="fld"><label>Nama Toko</label><input className="inp" value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} /></div>
          <div className="fld"><label>Alamat</label><textarea className="txa" rows={2} value={shop.address} onChange={(e) => setShop({ ...shop, address: e.target.value })} /></div>
          <div className="fld"><label>No HP / WA</label><input className="inp" value={shop.waCS} onChange={(e) => setShop({ ...shop, waCS: e.target.value })} /></div>
          <div className="fld"><label>Email</label><input className="inp" value={shop.email} onChange={(e) => setShop({ ...shop, email: e.target.value })} /></div>
          <div className="fld"><label>Catatan Kaki Struk Kasir</label><input className="inp" value={shop.receiptFooter} onChange={(e) => setShop({ ...shop, receiptFooter: e.target.value })} /></div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>👥 Manajemen Staff</h3>
            {users.map((u) => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "var(--bg2)", borderRadius: 8, marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: "var(--txt3)" }}>@{u.username} • {u.role}</div>
                </div>
                <span className="bdg" style={{ background: u.active ? "rgba(16,185,129,0.2)" : "var(--panel2)", color: u.active ? "var(--ok)" : "var(--txt3)" }}>
                  {u.active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            ))}
            <button className="btn gh" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={() => { setEditUser(null); setShowUserMod(true); }}><Ic n="plus" s={14} /> Tambah Staff</button>
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}><Ic n="bell" s={16} /> Notifikasi Email Otomatis</h3>
            <p style={{ fontSize: 12, color: "var(--txt2)", marginBottom: 10 }}>Kirim ringkasan harian ke email setiap jam 8 pagi (stok rendah & servis pending &gt;3 hari).</p>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: 10, background: "var(--bg2)", borderRadius: 8 }}>
              <input type="checkbox" checked={shop.emailNotif || false} onChange={(e) => setShop({ ...shop, emailNotif: e.target.checked })} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Aktifkan notifikasi email harian</span>
            </label>
          </div>

          <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, color: "var(--err)" }}>⚠️ Reset Data</h3>
            <p style={{ fontSize: 12, color: "var(--txt2)", marginBottom: 10 }}>Hapus semua data lokal. Tidak dapat dikembalikan.</p>
            <button className="btn err" onClick={() => {
              if (confirm("Yakin reset semua data?")) {
                ["sk2_tickets", "sk2_sales", "sk2_customers", "sk2_technicians", "sk2_products", "sk2_suppliers", "sk2_purchases", "sk2_users", "sk2_branch", "sk2_shop", "sk2_page", "sk2_user", "sk2_theme", "sk2_collapsed"].forEach((k) => localStorage.removeItem(k));
                location.reload();
              }
            }}><Ic n="trash" /> Reset Semua Data</button>
          </div>
        </div>
      </div>

      {showUserMod && <UserFormModal user={editUser} onClose={() => setShowUserMod(false)} onSave={(u) => {
        if (editUser) setUsers(users.map((x) => x.id === u.id ? u : x));
        else setUsers([...users, { ...u, id: gid("USR") }]);
        setShowUserMod(false);
      }} />}
    </div>
  );
};

const UserFormModal = ({ user, onClose, onSave }) => {
  const [f, setF] = useState(user || { username: "", password: "", name: "", role: "STAFF", active: true, branch: "b1" });
  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="mhd"><h3>{user ? "Edit" : "Tambah"} Staff</h3><button className="close" onClick={onClose}><Ic n="x" /></button></div>
        <div className="mbd">
          <div className="fld"><label>Nama</label><input className="inp" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="row">
            <div className="fld"><label>Username</label><input className="inp" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} /></div>
            <div className="fld"><label>Password</label><input className="inp" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
          </div>
          <div className="row">
            <div className="fld">
              <label>Role</label>
              <select className="sel" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
                <option>OWNER</option><option>ADMIN</option><option>KASIR</option><option>TEKNISI</option>
              </select>
            </div>
            <div className="fld">
              <label>Cabang</label>
              <select className="sel" value={f.branch} onChange={(e) => setF({ ...f, branch: e.target.value })}>
                <option value="all">Semua</option>
                {BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="mft"><button className="btn gh" onClick={onClose}>Batal</button><button className="btn pri" onClick={() => onSave(f)}><Ic n="check" /> Simpan</button></div>
      </div>
    </div>
  );
};

// ==========================================================================
// ROOT
// ==========================================================================
export default function App() {
  const [user, setUser] = useLS("sk2_user", null);
  const [users, setUsers] = useLS("sk2_users", INIT_USERS);
  const [page, setPage] = useLS("sk2_page", "dash");
  const [branch, setBranch] = useLS("sk2_branch", "b1");
  const [theme, setTheme] = useLS("sk2_theme", "dark");
  const [collapsed, setCollapsed] = useLS("sk2_collapsed", false);
  const [tickets, setTickets] = useLS("sk2_tickets", INIT_TICKETS);
  const [sales, setSales] = useLS("sk2_sales", INIT_SALES);
  const [customers, setCustomers] = useLS("sk2_customers", INIT_CUSTOMERS);
  const [technicians, setTechnicians] = useLS("sk2_technicians", INIT_TECHNICIANS);
  const [products, setProducts] = useLS("sk2_products", INIT_PRODUCTS);
  const [suppliers, setSuppliers] = useLS("sk2_suppliers", INIT_SUPPLIERS);
  const [purchases, setPurchases] = useLS("sk2_purchases", INIT_PURCHASES);
  const [shop, setShop] = useLS("sk2_shop", {
    name: "MAX Mobile Service", tagline: "Servis HP, Tablet & Laptop Terpercaya",
    waCS: "081234567890", email: "cs@maxmobile.id",
    address: "Jl. Margonda Raya No. 12, Depok",
    receiptFooter: "Terima kasih atas kunjungan Anda!",
    emailNotif: false,
  });
  const [branchModal, setBranchModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(null); // null | "normal" | "kilat"

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  if (!user) return <><style>{CSS}</style><LoginPage users={users} onLogin={setUser} /></>;

  const titles = {
    dash: ["Dashboard", `${BRANCHES.find(b => b.id === branch)?.name}`],
    pos: ["Kasir (POS)", "Transaksi penjualan produk"],
    ticket: ["Manajemen Servis", "Kelola tiket perbaikan"],
    kilat: ["Servis Kilat", "Tiket prioritas express"],
    inv: ["Inventaris", "Manajemen stok produk"],
    supplier: ["Supplier", "Daftar supplier"],
    cust: ["Pelanggan", "Database & histori"],
    tech: ["Teknisi", "Performa & manajemen"],
    history: ["Riwayat Transaksi", "Penjualan & servis selesai"],
    report: ["Laporan", "Analisis bisnis"],
    track: ["Tracking Publik", "Cek status tiket customer"],
    setting: ["Pengaturan", "Konfigurasi aplikasi"],
  };
  const [t, s] = titles[page] || ["-", ""];

  const actions = page === "ticket" ? <button className="btn pri" onClick={() => setShowNewTicket("normal")}><Ic n="plus" s={14} /> Terima Servis</button>
    : page === "kilat" ? <button className="btn pri" onClick={() => setShowNewTicket("kilat")}><Ic n="bolt" s={14} /> Servis Kilat</button>
    : null;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Sidebar page={page} setPage={setPage} branch={branch} setBranchModal={setBranchModal} user={user} onLogout={() => setUser(null)} collapsed={collapsed} />
        <div className="main">
          <TopBar title={t} subtitle={s} actions={actions} onCollapse={() => setCollapsed(!collapsed)} theme={theme} setTheme={setTheme} />
          {page === "dash" && <DashboardPage tickets={tickets} sales={sales} technicians={technicians} products={products} branch={branch} user={user} setPage={setPage} />}
          {page === "pos" && <POSPage products={products} setProducts={setProducts} sales={sales} setSales={setSales} customers={customers} branch={branch} user={user} shop={shop} />}
          {page === "ticket" && <TicketPage tickets={tickets} setTickets={setTickets} technicians={technicians} branch={branch} setSelected={setSelected} />}
          {page === "kilat" && <TicketPage tickets={tickets} setTickets={setTickets} technicians={technicians} branch={branch} setSelected={setSelected} kilatOnly />}
          {page === "inv" && <InventoryPage products={products} setProducts={setProducts} suppliers={suppliers} purchases={purchases} setPurchases={setPurchases} />}
          {page === "supplier" && <div className="cnt"><SupplierModal suppliers={suppliers} onClose={() => setPage("dash")} /></div>}
          {page === "cust" && <CustomerPage customers={customers} setCustomers={setCustomers} tickets={tickets} />}
          {page === "tech" && <TechnicianPage technicians={technicians} tickets={tickets} branch={branch} />}
          {page === "history" && <HistoryPage tickets={tickets} sales={sales} branch={branch} shop={shop} />}
          {page === "report" && <ReportPage tickets={tickets} sales={sales} products={products} technicians={technicians} branch={branch} />}
          {page === "track" && <TrackingPage tickets={tickets} />}
          {page === "setting" && <SettingPage shop={shop} setShop={setShop} users={users} setUsers={setUsers} />}
        </div>
        {branchModal && <BranchModal onClose={() => setBranchModal(false)} current={branch} setBranch={setBranch} />}
        {selected && <TicketDetail ticket={selected} setTickets={setTickets} technicians={technicians} onClose={() => setSelected(null)} shop={shop} />}
        {showNewTicket && <NewTicketModal onClose={(t) => { setShowNewTicket(null); if (t) setSelected(t); }} setTickets={setTickets} customers={customers} setCustomers={setCustomers} technicians={technicians} branch={branch} kilat={showNewTicket === "kilat"} />}
      </div>
    </>
  );
}
