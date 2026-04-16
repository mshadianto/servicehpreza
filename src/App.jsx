import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase, hasSupabase } from "./lib/supabase";
import logo from "./assets/logo.jpeg";

const STORAGE_KEY = "serviceku_v3_data";
const SETTINGS_KEY = "serviceku_v3_settings";

/* ═══════════════════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════════════════ */
const SFLOW = ["Diterima","Diagnosa","Proses","Selesai","Diambil"];
const SMAP = {
  Diterima:{c:"#3B82F6",bg:"#EFF6FF",e:"📥",txt:"Baru masuk"},
  Diagnosa:{c:"#F59E0B",bg:"#FFFBEB",e:"🔍",txt:"Sedang diperiksa"},
  Proses:{c:"#8B5CF6",bg:"#F5F3FF",e:"🔧",txt:"Sedang diperbaiki"},
  Selesai:{c:"#10B981",bg:"#ECFDF5",e:"✅",txt:"Siap diambil"},
  Diambil:{c:"#6B7280",bg:"#F3F4F6",e:"🤝",txt:"Sudah diambil"},
  Batal:{c:"#EF4444",bg:"#FEF2F2",e:"❌",txt:"Dibatalkan"},
};
const BRANDS = [
  {n:"Samsung",e:"📱"},{n:"iPhone",e:"🍎"},{n:"Xiaomi",e:"🔶"},{n:"OPPO",e:"🟢"},
  {n:"Vivo",e:"🔵"},{n:"Realme",e:"🟡"},{n:"Huawei",e:"🌸"},{n:"Infinix",e:"⚡"},
  {n:"POCO",e:"🚀"},{n:"OnePlus",e:"➕"},{n:"ASUS",e:"🎮"},{n:"Lainnya",e:"📞"},
];
const DAMAGES = [
  {n:"LCD Pecah",e:"📺",cat:"Layar"},
  {n:"Touchscreen Error",e:"👆",cat:"Layar"},
  {n:"Baterai Drop",e:"🔋",cat:"Power"},
  {n:"Mati Total",e:"⚫",cat:"Power"},
  {n:"Charging Error",e:"🔌",cat:"Power"},
  {n:"Speaker Rusak",e:"🔊",cat:"Audio"},
  {n:"Mic Tidak Berfungsi",e:"🎤",cat:"Audio"},
  {n:"Kamera Error",e:"📷",cat:"Optik"},
  {n:"Software/Hang",e:"💾",cat:"Software"},
  {n:"Lupa Password",e:"🔐",cat:"Software"},
  {n:"Water Damage",e:"💧",cat:"Fisik"},
  {n:"Tombol Rusak",e:"🔘",cat:"Fisik"},
  {n:"Sinyal Hilang",e:"📡",cat:"Network"},
  {n:"WiFi/Bluetooth",e:"📶",cat:"Network"},
  {n:"Lainnya",e:"⚙️",cat:"Lain"},
];
const COLORS = ["Hitam","Putih","Biru","Hijau","Merah","Gold","Silver","Ungu","Pink","Abu-abu","Lainnya"];
const KONDISI = [{n:"Mulus",e:"✨"},{n:"Lecet Ringan",e:"🔸"},{n:"Lecet Berat",e:"🔶"},{n:"Retak",e:"⚠️"},{n:"Penyok",e:"🔻"}];
const KELENGKAPAN = ["Charger","Kabel Data","Dus/Box","SIM Card","Memory Card","Case/Casing","Screen Guard","Headset","Stylus"];
const PRIORITAS = [
  {v:"Normal",e:"🟢",c:"#10B981",d:"3-5 hari"},
  {v:"Urgent",e:"🟡",c:"#F59E0B",d:"1-2 hari"},
  {v:"Express",e:"🔴",c:"#EF4444",d:"Hari ini"},
];
const TEKNISI = [
  {n:"Pak Budi",e:"👨‍🔧",sp:"Hardware"},
  {n:"Pak Eko",e:"👨‍💻",sp:"Software"},
  {n:"Pak Andi",e:"👨‍🔬",sp:"Board"},
  {n:"Pak Reza",e:"🧑‍🔧",sp:"LCD"},
  {n:"Bu Sari",e:"👩‍💼",sp:"Front Desk"},
];

const DEMO = [
  {id:"SRV001",namaCustomer:"Ahmad Fadli",noHP:"081234567890",email:"ahmad@mail.com",alamat:"Jl. Melati No.12, Ciputat",merkHP:"Samsung",tipeHP:"Galaxy A54",warnaHP:"Hitam",imei:"354678091234567",kondisi:"Lecet Ringan",kelengkapan:"Charger,Kabel Data",kerusakan:"LCD Pecah",keluhan:"Layar retak setelah jatuh",prioritas:"Urgent",status:"Proses",biayaEstimasi:450000,uangMuka:200000,teknisi:"Pak Budi",passwordHP:"1234",garansi:"Tidak",tglEstSelesai:"2026-04-18",tanggalMasuk:"2026-04-14",catatan:"Sparepart sudah dipesan",rating:0},
  {id:"SRV002",namaCustomer:"Siti Rahma",noHP:"085678901234",email:"siti@mail.com",alamat:"Jl. Kenanga No.5, Pamulang",merkHP:"iPhone",tipeHP:"iPhone 13",warnaHP:"Putih",imei:"490154203237518",kondisi:"Mulus",kelengkapan:"Charger,Dus/Box,Case/Casing",kerusakan:"Baterai Drop",keluhan:"Health 72%",prioritas:"Normal",status:"Selesai",biayaEstimasi:600000,uangMuka:300000,teknisi:"Pak Eko",passwordHP:"Face ID",garansi:"Ya",tglEstSelesai:"2026-04-15",tanggalMasuk:"2026-04-12",catatan:"Original Apple",rating:5},
  {id:"SRV003",namaCustomer:"Budi Santoso",noHP:"087890123456",email:"",alamat:"Jl. Dahlia No.8, Serpong",merkHP:"Xiaomi",tipeHP:"Redmi Note 12",warnaHP:"Biru",imei:"",kondisi:"Lecet Berat",kelengkapan:"Charger",kerusakan:"Mati Total",keluhan:"Kena air hujan",prioritas:"Express",status:"Diagnosa",biayaEstimasi:0,uangMuka:50000,teknisi:"Pak Andi",passwordHP:"Pola",garansi:"Tidak",tglEstSelesai:"",tanggalMasuk:"2026-04-15",catatan:"Cek mesin",rating:0},
  {id:"SRV004",namaCustomer:"Dewi Putri",noHP:"089012345678",email:"dewi@mail.com",alamat:"Jl. Anggrek No.3, BSD",merkHP:"OPPO",tipeHP:"Reno 10",warnaHP:"Gold",imei:"867530012345678",kondisi:"Mulus",kelengkapan:"Charger,SIM Card",kerusakan:"Charging Error",keluhan:"Port longgar",prioritas:"Normal",status:"Diterima",biayaEstimasi:150000,uangMuka:0,teknisi:"",passwordHP:"",garansi:"Ya",tglEstSelesai:"2026-04-19",tanggalMasuk:"2026-04-15",catatan:"",rating:0},
  {id:"SRV005",namaCustomer:"Rudi Hartono",noHP:"081345678901",email:"",alamat:"Jl. Mawar No.20, Pondok Aren",merkHP:"Vivo",tipeHP:"V29",warnaHP:"Ungu",imei:"",kondisi:"Lecet Ringan",kelengkapan:"Charger,Case/Casing",kerusakan:"Kamera Error",keluhan:"Blur tidak fokus",prioritas:"Urgent",status:"Proses",biayaEstimasi:350000,uangMuka:150000,teknisi:"Pak Budi",passwordHP:"5678",garansi:"Tidak",tglEstSelesai:"2026-04-16",tanggalMasuk:"2026-04-13",catatan:"Modul kamera",rating:0},
  {id:"SRV006",namaCustomer:"Aisyah Nur",noHP:"082567890123",email:"aisyah@mail.com",alamat:"Jl. Flamboyan No.15, Ciputat Timur",merkHP:"Samsung",tipeHP:"Galaxy S23",warnaHP:"Hijau",imei:"352789041234567",kondisi:"Mulus",kelengkapan:"Charger,Kabel Data,Dus/Box,Screen Guard",kerusakan:"Software/Hang",keluhan:"Restart sendiri",prioritas:"Normal",status:"Diambil",biayaEstimasi:200000,uangMuka:100000,teknisi:"Pak Eko",passwordHP:"Pattern",garansi:"Ya",tglEstSelesai:"2026-04-13",tanggalMasuk:"2026-04-10",catatan:"Reset + update",rating:5},
  {id:"SRV007",namaCustomer:"Yusuf Maulana",noHP:"081567890123",email:"",alamat:"Jl. Kemuning No.7, Bintaro",merkHP:"iPhone",tipeHP:"iPhone 12 Pro",warnaHP:"Silver",imei:"353012345678901",kondisi:"Mulus",kelengkapan:"Charger,Dus/Box",kerusakan:"Touchscreen Error",keluhan:"Layar tidak responsif di sebagian area",prioritas:"Urgent",status:"Selesai",biayaEstimasi:850000,uangMuka:400000,teknisi:"Pak Reza",passwordHP:"Face ID",garansi:"Ya",tglEstSelesai:"2026-04-14",tanggalMasuk:"2026-04-11",catatan:"LCD assembly diganti",rating:4},
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */
const fmt = d => d ? new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}) : "-";
const fmtShort = d => d ? new Date(d).toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit"}) : "-";
const rp = n => (n || n === 0) ? "Rp " + Number(n).toLocaleString("id-ID") : "-";
const today = () => new Date().toISOString().split("T")[0];
const greeting = () => {
  const h = new Date().getHours();
  if (h < 11) return {t:"Selamat Pagi",e:"☀️"};
  if (h < 15) return {t:"Selamat Siang",e:"🌤️"};
  if (h < 18) return {t:"Selamat Sore",e:"🌇"};
  return {t:"Selamat Malam",e:"🌙"};
};
const daysAgo = d => {
  if (!d) return null;
  const diff = Math.floor((new Date() - new Date(d)) / 86400000);
  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  if (diff < 7) return diff + " hari lalu";
  return fmt(d);
};
const initials = n => (n || "?").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
const colorFromName = n => {
  const colors = ["#3B82F6","#8B5CF6","#EC4899","#10B981","#F59E0B","#EF4444","#06B6D4","#6366F1"];
  let h = 0;
  for (let i = 0; i < (n||"").length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
};

/* ═══════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════ */
const CSS = `
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
*::-webkit-scrollbar{display:none}
body{margin:0}
@keyframes scaleIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.85}}
@keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes barLoad{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(59,130,246,0.3)}50%{box-shadow:0 0 30px rgba(59,130,246,0.5)}}
@keyframes ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(4);opacity:0}}
input:focus,select:focus,textarea:focus{border-color:#3B82F6!important;box-shadow:0 0 0 4px rgba(59,130,246,0.1)!important}
.tap:active{transform:scale(0.97);opacity:0.85}
.btn-primary{background:linear-gradient(135deg,#3B82F6,#6366F1);box-shadow:0 4px 14px rgba(59,130,246,0.35)}
.btn-success{background:linear-gradient(135deg,#10B981,#059669);box-shadow:0 4px 14px rgba(16,185,129,0.35)}
.btn-danger{background:linear-gradient(135deg,#EF4444,#DC2626);box-shadow:0 4px 14px rgba(239,68,68,0.35)}
.skel{background:linear-gradient(90deg,#E2E8F0 0%,#F1F5F9 50%,#E2E8F0 100%);background-size:200% 100%;animation:shine 1.5s infinite}
`;

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */
function Ico({n, s}) {
  const sz = s || 20;
  const p = {viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:sz,height:sz};
  const pf = {viewBox:"0 0 24 24",fill:"currentColor",width:sz,height:sz};
  const map = {
    back: <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>,
    plus: <svg {...{...p,strokeWidth:"2.5"}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search: <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    home: <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    list: <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    chart: <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    user: <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    clock: <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    refresh: <svg {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    receipt: <svg {...p}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>,
    call: <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    moon: <svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    sun: <svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    chev: <svg {...{...p,strokeWidth:"2.5"}}><polyline points="9 18 15 12 9 6"/></svg>,
    bell: <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    star: <svg {...pf}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    starO: <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    wa: <svg {...pf}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    grid: <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    settings: <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    print: <svg {...p}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    share: <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    check: <svg {...{...p,strokeWidth:"3"}}><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg {...{...p,strokeWidth:"2.5"}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    trend: <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    money: <svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    qr: <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="14.01"/><line x1="14" y1="17" x2="14" y2="17.01"/><line x1="14" y1="20" x2="17" y2="20"/><line x1="20" y1="14" x2="20" y2="14.01"/><line x1="17" y1="17" x2="20" y2="17"/><line x1="20" y1="20" x2="20" y2="20.01"/></svg>,
    info: <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    fire: <svg {...pf}><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67M11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>,
    tools: <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    apple: <svg {...pf}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/></svg>,
    android: <svg {...pf}><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.69-.04-.86.27l-1.86 3.22c-1.44-.65-3.06-1.01-4.76-1.01-1.7 0-3.33.36-4.76 1.01L5.07 5.71c-.16-.31-.54-.43-.86-.27-.31.16-.43.55-.27.86L5.78 9.48C2.56 11.22.48 14.06 0 17.4h24c-.48-3.34-2.56-6.18-5.76-7.92zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>,
  };
  return map[n] || null;
}

/* ═══════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════ */
function Avatar({name, size}) {
  const s = size || 44;
  const c = colorFromName(name);
  return <div style={{width:s,height:s,borderRadius:s*0.32,background:`linear-gradient(135deg,${c},${c}CC)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:s*0.4,fontWeight:800,flexShrink:0,boxShadow:`0 4px 12px ${c}40`}}>{initials(name)}</div>;
}

function Badge({s}) {
  const m = SMAP[s] || SMAP.Diterima;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,fontSize:11,fontWeight:800,color:m.c,background:m.bg,border:`1px solid ${m.c}25`,flexShrink:0}}><span style={{fontSize:11}}>{m.e}</span> {s}</span>;
}

function Stars({n}) {
  return <div style={{display:"flex",gap:2,color:"#F59E0B"}}>{[1,2,3,4,5].map(i => <Ico key={i} n={i <= n ? "star" : "starO"} s={14} />)}</div>;
}

function Toast({d}) {
  if (!d) return null;
  const cfg = {
    success:{bg:"#ECFDF5",c:"#059669",b:"#A7F3D0",e:"✅"},
    error:{bg:"#FEF2F2",c:"#DC2626",b:"#FECACA",e:"❌"},
    info:{bg:"#EFF6FF",c:"#2563EB",b:"#BFDBFE",e:"ℹ️"},
  }[d.type] || {bg:"#ECFDF5",c:"#059669",b:"#A7F3D0",e:"✅"};
  return <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",padding:"12px 20px",borderRadius:16,fontSize:14,fontWeight:700,zIndex:500,boxShadow:"0 10px 30px rgba(0,0,0,0.15)",background:cfg.bg,color:cfg.c,border:`1.5px solid ${cfg.b}`,animation:"scaleIn .3s ease",maxWidth:340,display:"flex",alignItems:"center",gap:8}}><span>{cfg.e}</span> {d.msg}</div>;
}

function Modal({title, msg, onOk, onNo, okText, danger, icon}) {
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(6px)",animation:"fadeIn .2s ease"}}>
    <div style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:340,padding:28,textAlign:"center",animation:"scaleIn .3s ease",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
      <div style={{fontSize:48,marginBottom:12}}>{icon || (danger ? "⚠️" : "❓")}</div>
      <div style={{fontSize:19,fontWeight:800,color:"#0F172A",marginBottom:8}}>{title}</div>
      <div style={{fontSize:14,color:"#64748B",lineHeight:1.6,marginBottom:24}}>{msg}</div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onNo} className="tap" style={{flex:1,padding:13,borderRadius:14,border:"1.5px solid #E2E8F0",background:"#fff",color:"#64748B",fontSize:14,fontWeight:700,cursor:"pointer"}}>Batal</button>
        <button onClick={onOk} className={"tap " + (danger ? "btn-danger" : "btn-primary")} style={{flex:1,padding:13,borderRadius:14,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{okText || "Ya"}</button>
      </div>
    </div>
  </div>;
}

function Timeline({current, T}) {
  const idx = SFLOW.indexOf(current);
  return <div style={{display:"flex",alignItems:"center",margin:"18px 0 4px",padding:"0 4px"}}>
    {SFLOW.map((s,i) => {
      const done = i <= idx, active = i === idx, st = SMAP[s];
      return <div key={s} style={{display:"flex",alignItems:"center",flex:i < SFLOW.length-1 ? 1 : "none"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:1}}>
          <div style={{width:active?38:30,height:active?38:30,borderRadius:"50%",background:done?st.c:"#475569",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .4s cubic-bezier(.34,1.56,.64,1)",boxShadow:active?`0 0 0 5px ${st.bg},0 6px 16px ${st.c}50`:"none",fontSize:active?15:11,color:"#fff",fontWeight:800,animation:active?"pulse 2s ease infinite":"none"}}>{done?(active?st.e:"✓"):String(i+1)}</div>
          <div style={{fontSize:9,fontWeight:700,color:done?st.c:"#64748B",marginTop:5,whiteSpace:"nowrap"}}>{s}</div>
        </div>
        {i < SFLOW.length-1 && <div style={{flex:1,height:3,background:i < idx ? (SMAP[SFLOW[i+1]] || {}).c : "#475569",borderRadius:2,margin:"0 4px 16px",transition:"all .4s"}} />}
      </div>;
    })}
  </div>;
}

function Skeleton({h, mb}) {
  return <div className="skel" style={{height:h||80,borderRadius:16,marginBottom:mb||10}} />;
}

function Empty({icon, title, msg, action, onAction}) {
  return <div style={{textAlign:"center",padding:"60px 24px",animation:"fadeUp .4s ease"}}>
    <div style={{fontSize:64,marginBottom:16,opacity:0.8}}>{icon || "📱"}</div>
    <div style={{fontSize:18,fontWeight:800,color:"#0F172A",marginBottom:6}}>{title}</div>
    <div style={{fontSize:14,color:"#64748B",lineHeight:1.6,marginBottom:action?20:0}}>{msg}</div>
    {action && <button onClick={onAction} className="tap btn-primary" style={{padding:"12px 28px",borderRadius:14,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{action}</button>}
  </div>;
}

/* ═══════════════════════════════════════════════════════
   NOTA / RECEIPT MODAL
   ═══════════════════════════════════════════════════════ */
function Nota({item, onClose}) {
  const sisa = (Number(item.biayaEstimasi)||0) - (Number(item.uangMuka)||0);
  function sendWA() {
    const t = `📋 *NOTA SERVICE*
━━━━━━━━━━━━
🆔 ${item.id}
📅 ${fmt(item.tanggalMasuk)}
━━━━━━━━━━━━
👤 *${item.namaCustomer}*
📞 ${item.noHP}
${item.alamat ? "📍 " + item.alamat + "\n" : ""}━━━━━━━━━━━━
📱 *Perangkat*
${item.merkHP} ${item.tipeHP||""} (${item.warnaHP||"-"})
IMEI: ${item.imei||"-"}
Kondisi: ${item.kondisi||"-"}
Kelengkapan: ${item.kelengkapan||"-"}
━━━━━━━━━━━━
🔧 *Service*
Kerusakan: ${item.kerusakan}
Prioritas: ${item.prioritas||"Normal"}
Status: ${item.status} ${(SMAP[item.status]||{}).e}
Teknisi: ${item.teknisi||"-"}
${item.tglEstSelesai ? "Est. Selesai: " + fmt(item.tglEstSelesai) + "\n" : ""}━━━━━━━━━━━━
💰 *Biaya*
Estimasi: ${rp(item.biayaEstimasi)}
DP: ${rp(item.uangMuka)}
*Sisa: ${rp(sisa)}*
━━━━━━━━━━━━
_Terima kasih atas kepercayaan Anda!_
🔧 *MAX Mobile Service*`;
    window.open(`https://wa.me/${(item.noHP||"").replace(/^0/,"62")}?text=${encodeURIComponent(t)}`,"_blank");
  }
  function copyId() {
    navigator.clipboard.writeText(item.id);
    alert("ID disalin: " + item.id);
  }
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)",animation:"fadeIn .2s ease"}}>
    <div style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:380,maxHeight:"90vh",overflow:"auto",animation:"scaleIn .3s ease"}}>
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B,#334155)",color:"#fff",padding:"24px",borderRadius:"24px 24px 0 0",textAlign:"center",position:"relative"}}>
        <div onClick={onClose} style={{position:"absolute",top:14,right:14,cursor:"pointer",padding:8,borderRadius:10,background:"rgba(255,255,255,0.15)"}}><Ico n="x" s={18}/></div>
        <div style={{fontSize:32,marginBottom:6}}>🧾</div>
        <div style={{fontSize:20,fontWeight:800}}>Nota Service</div>
        <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>MAX Mobile Service</div>
      </div>
      <div style={{padding:24}}>
        <div onClick={copyId} className="tap" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,padding:"12px 16px",background:"linear-gradient(135deg,#EFF6FF,#F5F3FF)",borderRadius:14,cursor:"pointer",border:"1.5px dashed #3B82F6"}}>
          <div>
            <div style={{fontSize:10,color:"#64748B",fontWeight:700,letterSpacing:"1px"}}>ID SERVICE</div>
            <div style={{fontWeight:800,fontSize:16,color:"#3B82F6"}}>{item.id}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#3B82F6",fontWeight:700}}><Ico n="qr" s={20}/></div>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#94A3B8",fontWeight:800,letterSpacing:"1px",marginBottom:6}}>👤 CUSTOMER</div>
          <div style={{padding:"10px 14px",background:"#F8FAFC",borderRadius:12}}>
            <div style={{fontWeight:700,fontSize:14,color:"#0F172A"}}>{item.namaCustomer}</div>
            <div style={{fontSize:13,color:"#64748B",marginTop:2}}>{item.noHP}</div>
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#94A3B8",fontWeight:800,letterSpacing:"1px",marginBottom:6}}>📱 PERANGKAT</div>
          <div style={{padding:"10px 14px",background:"#F8FAFC",borderRadius:12}}>
            <div style={{fontWeight:700,fontSize:14,color:"#0F172A"}}>{item.merkHP} {item.tipeHP}</div>
            <div style={{fontSize:12,color:"#64748B",marginTop:2}}>{item.warnaHP} • {item.kondisi || "-"}</div>
            {item.imei && <div style={{fontSize:11,color:"#94A3B8",marginTop:2,fontFamily:"monospace"}}>IMEI: {item.imei}</div>}
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#94A3B8",fontWeight:800,letterSpacing:"1px",marginBottom:6}}>🔧 KERUSAKAN</div>
          <div style={{padding:"10px 14px",background:"#FEF2F2",borderRadius:12}}>
            <div style={{fontWeight:700,fontSize:14,color:"#DC2626"}}>{item.kerusakan}</div>
            {item.keluhan && <div style={{fontSize:12,color:"#64748B",marginTop:4,lineHeight:1.5}}>{item.keluhan}</div>}
          </div>
        </div>

        <div style={{padding:18,background:"linear-gradient(135deg,#0F172A,#1E293B)",borderRadius:14,color:"#fff"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}><span style={{color:"#94A3B8"}}>Estimasi</span><span style={{fontWeight:700}}>{rp(item.biayaEstimasi)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:13}}><span style={{color:"#94A3B8"}}>DP Dibayar</span><span style={{fontWeight:700,color:"#34D399"}}>- {rp(item.uangMuka)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1.5px dashed #475569"}}><span style={{fontWeight:800}}>Sisa Bayar</span><span style={{fontSize:18,fontWeight:900,color:sisa > 0 ? "#FBBF24" : "#34D399"}}>{rp(sisa)}</span></div>
        </div>

        <div style={{marginTop:20,display:"flex",gap:10}}>
          <button onClick={sendWA} className="tap" style={{flex:2,padding:13,borderRadius:14,border:"none",background:"#25D366",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:"0 4px 14px rgba(37,211,102,0.35)"}}><Ico n="wa" s={18}/> Kirim Nota</button>
          <button onClick={() => window.print()} className="tap" style={{flex:1,padding:13,borderRadius:14,border:"1.5px solid #E2E8F0",background:"#fff",color:"#334155",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ico n="print" s={16}/> Cetak</button>
        </div>
      </div>
    </div>
  </div>;
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [splash, setSplash] = useState(true);
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("home"); // home | list | board | stats | more
  const [page, setPage] = useState("main"); // main | detail | form | customer | settings
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list"); // list | grid
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [nota, setNota] = useState(null);
  const [step, setStep] = useState(0);
  const [shopName, setShopName] = useState("MAX Mobile Service");
  const initFd = {namaCustomer:"",noHP:"",email:"",alamat:"",merkHP:"",tipeHP:"",warnaHP:"",imei:"",kondisi:"",kelengkapan:[],kerusakan:"",keluhan:"",prioritas:"Normal",biayaEstimasi:"",uangMuka:"",teknisi:"",passwordHP:"",garansi:"",tglEstSelesai:"",catatan:""};
  const [fd, setFd] = useState(initFd);
  const [errs, setErrs] = useState({});

  useEffect(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) {
        const obj = JSON.parse(s);
        if (obj.dark !== undefined) setDark(obj.dark);
        if (obj.shopName) setShopName(obj.shopName);
      }
    } catch {}
    const t = setTimeout(() => setSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({dark, shopName})); } catch {}
  }, [dark, shopName]);

  function flash(msg, type) { setToast({msg,type:type||"success"}); setTimeout(() => setToast(null), 3200); }

  const fetchData = useCallback((silent) => {
    if (!silent) setLoading(true); else setSpinning(true);
    if (!hasSupabase) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) setData(JSON.parse(cached));
        else setData(DEMO);
      } catch { setData(DEMO); }
      setLoading(false); setSpinning(false);
      return;
    }
    supabase.from("services").select("*").order("created_at", {ascending:false}).then(res => {
      if (res.error || !res.data || !res.data.length) throw new Error("empty");
      setData(res.data);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data)); } catch {}
    }).catch(() => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) setData(JSON.parse(cached));
        else setData(DEMO);
      } catch { setData(DEMO); }
    }).finally(() => { setLoading(false); setSpinning(false); });
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── DERIVED ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let r = data.filter(d => {
      const ms = !q || (d.namaCustomer||"").toLowerCase().indexOf(q) >= 0 || (d.id||"").toLowerCase().indexOf(q) >= 0 || (d.merkHP||"").toLowerCase().indexOf(q) >= 0 || (d.noHP||"").indexOf(q) >= 0 || (d.tipeHP||"").toLowerCase().indexOf(q) >= 0 || (d.kerusakan||"").toLowerCase().indexOf(q) >= 0;
      const mf = filter === "Semua" || d.status === filter;
      return ms && mf;
    });
    if (sortBy === "newest") r.sort((a,b) => (b.tanggalMasuk||"").localeCompare(a.tanggalMasuk||""));
    else if (sortBy === "oldest") r.sort((a,b) => (a.tanggalMasuk||"").localeCompare(b.tanggalMasuk||""));
    else if (sortBy === "priority") {
      const order = {Express:0,Urgent:1,Normal:2};
      r.sort((a,b) => (order[a.prioritas]||9) - (order[b.prioritas]||9));
    }
    else if (sortBy === "biaya") r.sort((a,b) => (Number(b.biayaEstimasi)||0) - (Number(a.biayaEstimasi)||0));
    return r;
  }, [data, search, filter, sortBy]);

  const stats = useMemo(() => {
    const t = today();
    const isMonth = d => d && d.startsWith(t.slice(0,7));
    return {
      total: data.length,
      proses: data.filter(d => d.status === "Proses" || d.status === "Diagnosa").length,
      selesai: data.filter(d => d.status === "Selesai").length,
      hari: data.filter(d => d.tanggalMasuk === t).length,
      revToday: data.filter(d => d.tanggalMasuk === t).reduce((a,b) => a + (Number(b.biayaEstimasi)||0), 0),
      revMonth: data.filter(d => isMonth(d.tanggalMasuk) && (d.status === "Selesai" || d.status === "Diambil")).reduce((a,b) => a + (Number(b.biayaEstimasi)||0), 0),
      pendapatan: data.filter(d => d.status === "Selesai" || d.status === "Diambil").reduce((a,b) => a + (Number(b.biayaEstimasi)||0), 0),
      piutang: data.filter(d => d.status !== "Batal").reduce((a,b) => a + Math.max(0, (Number(b.biayaEstimasi)||0) - (Number(b.uangMuka)||0)), 0),
      avgRating: (() => {
        const rated = data.filter(d => Number(d.rating) > 0);
        return rated.length ? (rated.reduce((a,b) => a + Number(b.rating), 0) / rated.length).toFixed(1) : 0;
      })(),
      ratedCount: data.filter(d => Number(d.rating) > 0).length,
      // Top brands
      topBrands: (() => {
        const m = {};
        data.forEach(d => { if (d.merkHP) m[d.merkHP] = (m[d.merkHP]||0) + 1; });
        return Object.entries(m).sort((a,b) => b[1] - a[1]).slice(0,5);
      })(),
      // Top damages
      topDamages: (() => {
        const m = {};
        data.forEach(d => { if (d.kerusakan) m[d.kerusakan] = (m[d.kerusakan]||0) + 1; });
        return Object.entries(m).sort((a,b) => b[1] - a[1]).slice(0,5);
      })(),
      // Top teknisi
      topTeknisi: (() => {
        const m = {};
        data.forEach(d => { if (d.teknisi) m[d.teknisi] = (m[d.teknisi]||0) + 1; });
        return Object.entries(m).sort((a,b) => b[1] - a[1]).slice(0,5);
      })(),
      // Last 7 days trend
      weekTrend: (() => {
        const arr = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const ds = d.toISOString().split("T")[0];
          arr.push({date:ds, count:data.filter(x => x.tanggalMasuk === ds).length, label:d.toLocaleDateString("id-ID",{weekday:"short"})});
        }
        return arr;
      })(),
    };
  }, [data]);

  // Customer DB (unique by phone)
  const customers = useMemo(() => {
    const m = {};
    data.forEach(d => {
      if (!d.noHP) return;
      if (!m[d.noHP]) m[d.noHP] = {noHP:d.noHP,nama:d.namaCustomer,email:d.email,alamat:d.alamat,visits:0,total:0,lastVisit:null};
      m[d.noHP].visits++;
      m[d.noHP].total += (Number(d.biayaEstimasi)||0);
      if (!m[d.noHP].lastVisit || d.tanggalMasuk > m[d.noHP].lastVisit) m[d.noHP].lastVisit = d.tanggalMasuk;
    });
    return Object.values(m).sort((a,b) => b.visits - a.visits);
  }, [data]);

  /* ── FORM ── */
  function validate(s) {
    const e = {};
    if (s === 0) {
      if (!fd.namaCustomer.trim()) e.namaCustomer = "Nama wajib diisi";
      if (!fd.noHP.trim()) e.noHP = "No. HP wajib diisi";
      else if (!/^08\d{8,12}$/.test(fd.noHP.trim())) e.noHP = "Format: 08xxxxxxxxxx";
    }
    if (s === 1) { if (!fd.merkHP) e.merkHP = "Pilih merk HP"; }
    if (s === 2) { if (!fd.kerusakan) e.kerusakan = "Pilih kerusakan"; }
    setErrs(e); return Object.keys(e).length === 0;
  }

  function submitForm() {
    if (!validate(3)) return;
    setLoading(true);
    const send = Object.assign({}, fd, {kelengkapan:(fd.kelengkapan||[]).join(",")});
    const payload = {
      namaCustomer: send.namaCustomer, noHP: send.noHP, alamat: send.alamat || null,
      merkHP: send.merkHP || null, tipeHP: send.tipeHP || null, warnaHP: send.warnaHP || null,
      imei: send.imei || null, kondisi: send.kondisi || null, kelengkapan: send.kelengkapan || null,
      kerusakan: send.kerusakan || null, keluhan: send.keluhan || null,
      prioritas: send.prioritas || "Normal", status: "Diterima",
      biayaEstimasi: Number(send.biayaEstimasi) || 0, uangMuka: Number(send.uangMuka) || 0,
      teknisi: send.teknisi || null, passwordHP: send.passwordHP || null,
      garansi: send.garansi || "Tidak", tglEstSelesai: send.tglEstSelesai || null,
      tanggalMasuk: today(), catatan: send.catatan || null,
    };
    const done = () => {
      setFd(initFd); setStep(0); setPage("main"); setTab("home"); setLoading(false);
      fetchData(true);
    };
    if (!hasSupabase) {
      const ni = Object.assign({}, payload, {id:"SRV" + String(data.length + 1).padStart(3,"0"), rating:0});
      const newData = [ni].concat(data);
      setData(newData);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch {}
      flash("Tersimpan (offline mode) 📱");
      done();
      return;
    }
    supabase.from("services").insert([payload]).select().then(res => {
      if (res.error) flash("Gagal menyimpan: " + res.error.message, "error");
      else flash("Service order berhasil ditambahkan! 🎉");
    }).catch(() => {
      flash("Gagal menyimpan ke server", "error");
    }).finally(done);
  }

  function updStatus(item, ns) {
    setModal(null);
    const newData = data.map(d => d.id === item.id ? Object.assign({}, d, {status:ns}) : d);
    setData(newData);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch {}
    setSel(Object.assign({}, item, {status:ns}));
    flash(`Status diubah → ${(SMAP[ns]||{}).e} ${ns}`);
    if (hasSupabase) {
      supabase.from("services").update({status: ns}).eq("id", item.id).then(() => {});
    }
  }

  function rateItem(item, r) {
    const newData = data.map(d => d.id === item.id ? Object.assign({}, d, {rating:r}) : d);
    setData(newData);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch {}
    setSel(Object.assign({}, item, {rating:r}));
    flash(`Rating ${r} bintang ⭐`, "info");
  }

  /* ── THEME ── */
  const T = dark
    ? {bg:"#0B1120",bg2:"#0F172A",card:"#1E293B",cb:"#334155",text:"#F1F5F9",ts:"#94A3B8",tm:"#64748B",ib:"#1E293B",ib2:"#334155",hbg:"linear-gradient(135deg,#020617,#0F172A,#1E293B)",dv:"#334155",chip:"#1E293B"}
    : {bg:"#F1F5F9",bg2:"#F8FAFC",card:"#FFFFFF",cb:"#E2E8F0",text:"#0F172A",ts:"#64748B",tm:"#94A3B8",ib:"#FAFBFC",ib2:"#E2E8F0",hbg:"linear-gradient(135deg,#0F172A,#1E293B,#334155)",dv:"#F1F5F9",chip:"#F1F5F9"};

  const base = {fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:T.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:"env(safe-area-inset-bottom)"};
  const inp = f => ({width:"100%",padding:"14px 16px",borderRadius:14,border:`1.5px solid ${errs[f]?"#EF4444":T.ib2}`,fontSize:16,color:T.text,background:T.ib,outline:"none",fontFamily:"inherit",transition:"all .2s"});

  /* ═══ SPLASH ═══ */
  if (splash) return <div style={Object.assign({}, base, {background:"linear-gradient(145deg,#0F172A,#1E293B,#334155)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff"})}>
    <style>{CSS}</style>
    <div style={{width:200,height:110,borderRadius:20,overflow:"hidden",boxShadow:"0 20px 60px rgba(56,189,248,0.4)",animation:"pulse 2.4s ease infinite",marginBottom:24,border:"1.5px solid rgba(56,189,248,0.25)"}}><img src={logo} alt="MAX Mobile Service" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/></div>
    <div style={{fontSize:28,fontWeight:900,letterSpacing:"2px",animation:"fadeUp .6s ease .3s both"}}>MAX MOBILE</div>
    <div style={{fontSize:12,color:"#94A3B8",fontWeight:700,letterSpacing:"4px",textTransform:"uppercase",marginTop:6,animation:"fadeUp .6s ease .5s both"}}>Apple & Android Service</div>
    <div style={{marginTop:48,width:220,height:3,borderRadius:4,background:"rgba(255,255,255,0.1)",overflow:"hidden",animation:"fadeUp .6s ease .7s both"}}>
      <div style={{width:"60%",height:"100%",borderRadius:4,background:"linear-gradient(90deg,#38BDF8,#818CF8,#A78BFA)",animation:"barLoad 1.5s ease infinite"}} />
    </div>
  </div>;

  /* ═══ DETAIL ═══ */
  if (page === "detail" && sel) {
    const ci = SFLOW.indexOf(sel.status);
    const ns = ci < SFLOW.length - 1 ? SFLOW[ci+1] : null;
    const sisa = (Number(sel.biayaEstimasi)||0) - (Number(sel.uangMuka)||0);
    const dmg = DAMAGES.find(d => d.n === sel.kerusakan);
    const pri = PRIORITAS.find(p => p.v === sel.prioritas) || PRIORITAS[0];

    return <div style={base}>
      <style>{CSS}</style>
      <div style={{background:T.hbg,color:"#fff",padding:"14px 18px 22px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${pri.c}30,transparent 70%)`}} />
        <div style={{display:"flex",alignItems:"center",gap:12,position:"relative",zIndex:1}}>
          <div onClick={() => {setPage("main"); setSel(null);}} className="tap" style={{cursor:"pointer",padding:8,borderRadius:12,background:"rgba(255,255,255,0.12)"}}><Ico n="back"/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"#94A3B8",fontWeight:700,letterSpacing:"1px"}}>SERVICE DETAIL</div>
            <div style={{fontSize:18,fontWeight:800,marginTop:1}}>{sel.id}</div>
          </div>
          <div onClick={() => setNota(sel)} className="tap" style={{cursor:"pointer",padding:10,borderRadius:12,background:"rgba(255,255,255,0.12)"}}><Ico n="receipt" s={18}/></div>
        </div>
        <Timeline current={sel.status} T={T}/>
        <div style={{textAlign:"center",fontSize:12,color:"#94A3B8",marginTop:6,fontWeight:600}}>{(SMAP[sel.status]||{}).txt}</div>
      </div>

      <div style={{padding:"16px 16px 120px"}}>
        {/* Quick Actions */}
        <div style={{display:"flex",gap:10,marginBottom:16,animation:"fadeUp .3s ease"}}>
          <button onClick={() => window.open("tel:"+sel.noHP)} className="tap" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px",borderRadius:14,border:`1px solid ${T.cb}`,background:T.card,color:T.text,fontSize:11,fontWeight:700,cursor:"pointer"}}><div style={{color:"#3B82F6"}}><Ico n="call" s={20}/></div>Telepon</button>
          <button onClick={() => window.open("https://wa.me/"+(sel.noHP||"").replace(/^0/,"62"),"_blank")} className="tap" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px",borderRadius:14,border:"none",background:"#25D366",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(37,211,102,0.3)"}}><Ico n="wa" s={20}/>WhatsApp</button>
          <button onClick={() => setNota(sel)} className="tap" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px",borderRadius:14,border:`1px solid ${T.cb}`,background:T.card,color:T.text,fontSize:11,fontWeight:700,cursor:"pointer"}}><div style={{color:"#8B5CF6"}}><Ico n="receipt" s={20}/></div>Nota</button>
          <button onClick={() => window.open("https://maps.google.com/?q="+encodeURIComponent(sel.alamat||""))} className="tap" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px",borderRadius:14,border:`1px solid ${T.cb}`,background:T.card,color:T.text,fontSize:11,fontWeight:700,cursor:"pointer"}}><div style={{color:"#EF4444"}}>📍</div>Lokasi</button>
        </div>

        {/* Customer */}
        <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:12,border:`1px solid ${T.cb}`,animation:"fadeUp .3s ease .05s both"}}>
          <div style={{fontSize:10,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>👤 CUSTOMER</div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Avatar name={sel.namaCustomer} size={54}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:18,fontWeight:800,color:T.text}}>{sel.namaCustomer}</div>
              <div style={{fontSize:13,color:T.ts,marginTop:2}}>{sel.noHP}</div>
              {sel.email && <div style={{fontSize:12,color:T.tm,marginTop:2}}>✉️ {sel.email}</div>}
              {sel.alamat && <div style={{fontSize:12,color:T.tm,marginTop:4,lineHeight:1.4}}>📍 {sel.alamat}</div>}
            </div>
          </div>
        </div>

        {/* Device */}
        <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:12,border:`1px solid ${T.cb}`,animation:"fadeUp .3s ease .1s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:10,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px"}}>📱 PERANGKAT</div>
            <span style={{fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:6,background:`${pri.c}20`,color:pri.c}}>{pri.e} {pri.v}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <div style={{width:50,height:50,borderRadius:14,background:`linear-gradient(135deg,#3B82F620,#3B82F610)`,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #3B82F620"}}>
              <Ico n={sel.merkHP === "iPhone" ? "apple" : "android"} s={24}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:800,color:T.text}}>{sel.merkHP} {sel.tipeHP}</div>
              <div style={{fontSize:13,color:T.ts,marginTop:2}}>{sel.warnaHP || "-"} • {sel.kondisi || "-"}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <div style={{padding:"10px 12px",background:T.bg2,borderRadius:10}}>
              <div style={{fontSize:10,color:T.tm,fontWeight:700,marginBottom:2}}>IMEI/SN</div>
              <div style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:"monospace"}}>{sel.imei || "-"}</div>
            </div>
            <div style={{padding:"10px 12px",background:T.bg2,borderRadius:10}}>
              <div style={{fontSize:10,color:T.tm,fontWeight:700,marginBottom:2}}>GARANSI</div>
              <div style={{fontSize:13,fontWeight:700,color:sel.garansi === "Ya" ? "#10B981" : "#EF4444"}}>{sel.garansi === "Ya" ? "✅ Aktif" : "❌ Habis"}</div>
            </div>
          </div>
          {sel.kelengkapan && <div style={{padding:"10px 12px",background:T.bg2,borderRadius:10}}>
            <div style={{fontSize:10,color:T.tm,fontWeight:700,marginBottom:4}}>KELENGKAPAN</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {sel.kelengkapan.split(",").map(k => <span key={k} style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:"#10B98120",color:"#059669",fontWeight:700}}>✓ {k.trim()}</span>)}
            </div>
          </div>}
        </div>

        {/* Damage */}
        <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:12,border:`1px solid ${T.cb}`,animation:"fadeUp .3s ease .15s both"}}>
          <div style={{fontSize:10,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>🔧 KERUSAKAN</div>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px",background:"linear-gradient(135deg,#FEF2F2,#FEE2E2)",borderRadius:14,border:"1.5px solid #FECACA"}}>
            <div style={{fontSize:32}}>{(dmg||{}).e || "🔧"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:800,color:"#DC2626"}}>{sel.kerusakan}</div>
              {dmg && <div style={{fontSize:11,color:"#991B1B",fontWeight:600,marginTop:2}}>Kategori: {dmg.cat}</div>}
            </div>
          </div>
          {sel.keluhan && <div style={{marginTop:12,padding:"12px 14px",background:T.bg2,borderRadius:12,fontSize:14,color:T.text,lineHeight:1.6}}>"{sel.keluhan}"</div>}
        </div>

        {/* Finance */}
        <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:12,border:`1px solid ${T.cb}`,animation:"fadeUp .3s ease .2s both"}}>
          <div style={{fontSize:10,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>💰 BIAYA</div>
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            {[["Estimasi",rp(sel.biayaEstimasi),"#3B82F6"],["DP",rp(sel.uangMuka),"#10B981"]].map((r,i) => (
              <div key={i} style={{flex:1,padding:"12px",background:T.bg2,borderRadius:12,textAlign:"center"}}>
                <div style={{fontSize:10,color:T.tm,fontWeight:700,marginBottom:4}}>{r[0]}</div>
                <div style={{fontSize:14,fontWeight:800,color:r[2]}}>{r[1]}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"14px",background:`linear-gradient(135deg,${sisa>0?"#FEF2F2":"#ECFDF5"},${sisa>0?"#FEE2E2":"#D1FAE5"})`,borderRadius:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:sisa>0?"#991B1B":"#065F46",fontWeight:800}}>{sisa>0?"💸 Sisa Bayar":"✅ Lunas"}</span>
            <span style={{fontSize:20,fontWeight:900,color:sisa>0?"#DC2626":"#059669"}}>{rp(Math.max(0,sisa))}</span>
          </div>
        </div>

        {/* Service Info */}
        <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:12,border:`1px solid ${T.cb}`,animation:"fadeUp .3s ease .25s both"}}>
          <div style={{fontSize:10,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>👨‍🔧 SERVICE INFO</div>
          {[
            ["Teknisi",sel.teknisi || "Belum ditentukan",sel.teknisi?"#3B82F6":T.tm],
            ["Tgl Masuk",fmt(sel.tanggalMasuk) + " (" + (daysAgo(sel.tanggalMasuk)||"-") + ")",T.text],
            ["Est. Selesai",sel.tglEstSelesai?fmt(sel.tglEstSelesai):"Belum ditentukan",T.text],
            ["Password","🔒 " + (sel.passwordHP || "Tidak ada"),T.text],
          ].map((r,i) => <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<3?`1px solid ${T.dv}`:"none"}}>
            <span style={{fontSize:12,color:T.tm,fontWeight:700}}>{r[0]}</span>
            <span style={{fontSize:13,fontWeight:700,color:r[2],textAlign:"right",maxWidth:"60%"}}>{r[1]}</span>
          </div>)}
          {sel.catatan && <div style={{marginTop:12,padding:"10px 12px",background:"#FFFBEB",borderRadius:10,borderLeft:"3px solid #F59E0B"}}>
            <div style={{fontSize:10,color:"#92400E",fontWeight:800,marginBottom:3}}>📝 CATATAN</div>
            <div style={{fontSize:13,color:"#78350F",lineHeight:1.5}}>{sel.catatan}</div>
          </div>}
        </div>

        {/* Rating (only for selesai/diambil) */}
        {(sel.status === "Selesai" || sel.status === "Diambil") && <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:12,border:`1px solid ${T.cb}`,animation:"fadeUp .3s ease .3s both"}}>
          <div style={{fontSize:10,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>⭐ RATING CUSTOMER</div>
          <div style={{textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:8}}>
              {[1,2,3,4,5].map(i => <div key={i} onClick={() => rateItem(sel,i)} className="tap" style={{cursor:"pointer",color:i<=Number(sel.rating)?"#F59E0B":"#CBD5E1"}}><Ico n={i<=Number(sel.rating)?"star":"starO"} s={32}/></div>)}
            </div>
            <div style={{fontSize:13,color:T.ts,fontWeight:600}}>{Number(sel.rating)>0?`${sel.rating} dari 5 bintang`:"Tap untuk beri rating"}</div>
          </div>
        </div>}

        {/* Actions */}
        <div style={{animation:"fadeUp .3s ease .35s both"}}>
          {ns && <button onClick={() => setModal({title:`Update ke ${ns}?`,msg:`Status akan diubah dari "${sel.status}" ke "${ns}". Customer akan menerima notifikasi.`,onOk:() => updStatus(sel,ns),okText:`✓ ${ns}`,icon:(SMAP[ns]||{}).e})} className="tap btn-primary" style={{width:"100%",padding:16,borderRadius:16,border:"none",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {(SMAP[ns]||{}).e} Lanjut ke {ns} <Ico n="chev" s={16}/>
          </button>}
          {sel.status !== "Batal" && sel.status !== "Diambil" && <button onClick={() => setModal({title:"Batalkan service?",msg:`Yakin ingin membatalkan service ${sel.id}?`,onOk:() => updStatus(sel,"Batal"),okText:"Ya, Batalkan",danger:true})} className="tap" style={{width:"100%",padding:14,borderRadius:14,border:"1.5px solid #FECACA",background:"#FEF2F2",color:"#EF4444",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            ❌ Batalkan Service
          </button>}
        </div>
      </div>

      {nota && <Nota item={nota} onClose={() => setNota(null)}/>}
      {modal && <Modal {...modal} onNo={() => setModal(null)}/>}
      <Toast d={toast}/>
    </div>;
  }

  /* ═══ FORM WIZARD ═══ */
  if (page === "form") {
    const stps = [
      {n:"Customer",e:"👤"},
      {n:"Perangkat",e:"📱"},
      {n:"Kerusakan",e:"🔧"},
      {n:"Biaya",e:"💰"},
    ];
    return <div style={base}>
      <style>{CSS}</style>
      <div style={{background:T.hbg,color:"#fff",padding:"14px 18px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div onClick={() => {setPage("main"); setTab("home"); setStep(0); setErrs({}); setFd(initFd);}} className="tap" style={{cursor:"pointer",padding:8,borderRadius:12,background:"rgba(255,255,255,0.12)"}}><Ico n="back"/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"#94A3B8",fontWeight:700,letterSpacing:"1px"}}>STEP {step+1}/4</div>
            <div style={{fontSize:18,fontWeight:800,marginTop:1}}>{stps[step].e} {stps[step].n}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {stps.map((s,i) => <div key={i} style={{flex:1,height:5,borderRadius:6,background:i<=step?"linear-gradient(90deg,#38BDF8,#818CF8)":"rgba(255,255,255,0.15)",transition:"all .4s",boxShadow:i===step?"0 0 12px rgba(56,189,248,0.5)":"none"}}/>)}
        </div>
      </div>

      <div style={{padding:"24px 18px 130px"}}>
        {step === 0 && <div style={{animation:"fadeUp .25s ease"}}>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Nama Customer <span style={{color:"#EF4444"}}>*</span></label>
            <input style={inp("namaCustomer")} placeholder="cth: Ahmad Fadli" value={fd.namaCustomer} onChange={e => setFd(p => Object.assign({},p,{namaCustomer:e.target.value}))}/>
            {errs.namaCustomer && <div style={{fontSize:12,color:"#EF4444",marginTop:6,fontWeight:600}}>⚠️ {errs.namaCustomer}</div>}
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>No. HP / WhatsApp <span style={{color:"#EF4444"}}>*</span></label>
            <input style={inp("noHP")} placeholder="08xxxxxxxxxx" type="tel" value={fd.noHP} onChange={e => setFd(p => Object.assign({},p,{noHP:e.target.value}))}/>
            {errs.noHP && <div style={{fontSize:12,color:"#EF4444",marginTop:6,fontWeight:600}}>⚠️ {errs.noHP}</div>}
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Email (opsional)</label>
            <input style={inp("")} placeholder="email@domain.com" type="email" value={fd.email} onChange={e => setFd(p => Object.assign({},p,{email:e.target.value}))}/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Alamat</label>
            <textarea style={Object.assign({},inp(""),{minHeight:80,resize:"vertical"})} placeholder="Alamat lengkap customer..." value={fd.alamat} onChange={e => setFd(p => Object.assign({},p,{alamat:e.target.value}))}/>
          </div>
          {/* Quick fill from customer DB */}
          {customers.length > 0 && fd.namaCustomer.length === 0 && <div style={{marginTop:20,padding:14,background:T.bg2,borderRadius:14,border:`1px dashed ${T.cb}`}}>
            <div style={{fontSize:11,color:T.tm,fontWeight:800,marginBottom:8,letterSpacing:"1px"}}>💡 CUSTOMER LANGGANAN</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {customers.slice(0,3).map(c => <div key={c.noHP} onClick={() => setFd(p => Object.assign({},p,{namaCustomer:c.nama,noHP:c.noHP,email:c.email||"",alamat:c.alamat||""}))} className="tap" style={{padding:"10px 12px",background:T.card,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{c.nama}</div>
                  <div style={{fontSize:11,color:T.tm}}>{c.noHP} • {c.visits}x kunjungan</div>
                </div>
                <Ico n="chev" s={14}/>
              </div>)}
            </div>
          </div>}
        </div>}

        {step === 1 && <div style={{animation:"fadeUp .25s ease"}}>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Merk HP <span style={{color:"#EF4444"}}>*</span></label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {BRANDS.map(b => <div key={b.n} onClick={() => {setFd(p => Object.assign({},p,{merkHP:b.n})); setErrs(e => {const n=Object.assign({},e); delete n.merkHP; return n;});}} className="tap" style={{padding:"14px 8px",borderRadius:14,fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"center",background:fd.merkHP===b.n?"linear-gradient(135deg,#3B82F6,#6366F1)":T.chip,color:fd.merkHP===b.n?"#fff":T.ts,boxShadow:fd.merkHP===b.n?"0 4px 12px rgba(59,130,246,0.3)":"none",transition:"all .2s"}}>
                <div style={{fontSize:22,marginBottom:4}}>{b.e}</div>{b.n}
              </div>)}
            </div>
            {errs.merkHP && <div style={{fontSize:12,color:"#EF4444",marginTop:8,fontWeight:600}}>⚠️ {errs.merkHP}</div>}
          </div>
          <div style={{display:"flex",gap:12,marginBottom:18}}>
            <div style={{flex:1.5}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Tipe HP</label>
              <input style={inp("")} placeholder="cth: Galaxy A54" value={fd.tipeHP} onChange={e => setFd(p => Object.assign({},p,{tipeHP:e.target.value}))}/>
            </div>
            <div style={{flex:1}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Warna</label>
              <select style={Object.assign({},inp(""),{appearance:"auto"})} value={fd.warnaHP} onChange={e => setFd(p => Object.assign({},p,{warnaHP:e.target.value}))}>
                <option value="">Pilih</option>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>IMEI / SN</label>
            <input style={inp("")} placeholder="cth: 354678091234567" value={fd.imei} onChange={e => setFd(p => Object.assign({},p,{imei:e.target.value}))}/>
            <div style={{fontSize:11,color:T.tm,marginTop:4}}>💡 Dial *#06# untuk cek IMEI</div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Kondisi Fisik</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {KONDISI.map(k => <div key={k.n} onClick={() => setFd(p => Object.assign({},p,{kondisi:k.n}))} className="tap" style={{padding:"10px 14px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:fd.kondisi===k.n?"linear-gradient(135deg,#8B5CF6,#6366F1)":T.chip,color:fd.kondisi===k.n?"#fff":T.ts,display:"flex",alignItems:"center",gap:5}}>
                <span>{k.e}</span> {k.n}
              </div>)}
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Kelengkapan ({(fd.kelengkapan||[]).length} item)</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {KELENGKAPAN.map(k => {
                const sel2 = (fd.kelengkapan||[]).indexOf(k) >= 0;
                return <div key={k} onClick={() => setFd(p => {const arr=p.kelengkapan||[]; return Object.assign({},p,{kelengkapan:sel2?arr.filter(x=>x!==k):arr.concat([k])});})} className="tap" style={{padding:"8px 14px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",background:sel2?"linear-gradient(135deg,#10B981,#059669)":T.chip,color:sel2?"#fff":T.ts,display:"flex",alignItems:"center",gap:4}}>
                  {sel2 && "✓ "}{k}
                </div>;
              })}
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>🔒 Password / Pola Kunci</label>
            <input style={inp("")} placeholder="Untuk testing teknisi (opsional)" value={fd.passwordHP} onChange={e => setFd(p => Object.assign({},p,{passwordHP:e.target.value}))}/>
          </div>
        </div>}

        {step === 2 && <div style={{animation:"fadeUp .25s ease"}}>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Jenis Kerusakan <span style={{color:"#EF4444"}}>*</span></label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              {DAMAGES.map(d => <div key={d.n} onClick={() => {setFd(p => Object.assign({},p,{kerusakan:d.n})); setErrs(e => {const n=Object.assign({},e); delete n.kerusakan; return n;});}} className="tap" style={{padding:"12px 10px",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer",background:fd.kerusakan===d.n?"linear-gradient(135deg,#EF4444,#F97316)":T.chip,color:fd.kerusakan===d.n?"#fff":T.ts,display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:18}}>{d.e}</span>{d.n}
              </div>)}
            </div>
            {errs.kerusakan && <div style={{fontSize:12,color:"#EF4444",marginTop:8,fontWeight:600}}>⚠️ {errs.kerusakan}</div>}
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Keluhan Detail</label>
            <textarea style={Object.assign({},inp(""),{minHeight:90,resize:"vertical"})} placeholder="Jelaskan secara detail..." value={fd.keluhan} onChange={e => setFd(p => Object.assign({},p,{keluhan:e.target.value}))}/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Prioritas Service</label>
            <div style={{display:"flex",gap:10}}>
              {PRIORITAS.map(pr => <div key={pr.v} onClick={() => setFd(p => Object.assign({},p,{prioritas:pr.v}))} className="tap" style={{flex:1,padding:"14px 8px",borderRadius:14,textAlign:"center",cursor:"pointer",background:fd.prioritas===pr.v?`linear-gradient(135deg,${pr.c},${pr.c}DD)`:T.chip,color:fd.prioritas===pr.v?"#fff":pr.c,fontWeight:800,boxShadow:fd.prioritas===pr.v?`0 4px 14px ${pr.c}50`:"none"}}>
                <div style={{fontSize:24,marginBottom:4}}>{pr.e}</div>
                <div style={{fontSize:13}}>{pr.v}</div>
                <div style={{fontSize:10,opacity:0.85,marginTop:2}}>{pr.d}</div>
              </div>)}
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Status Garansi</label>
            <div style={{display:"flex",gap:10}}>
              {[{v:"Ya",e:"✅",c:"#10B981",t:"Masih Garansi"},{v:"Tidak",e:"❌",c:"#EF4444",t:"Habis Garansi"}].map(g => <div key={g.v} onClick={() => setFd(p => Object.assign({},p,{garansi:g.v}))} className="tap" style={{flex:1,padding:"14px",borderRadius:14,textAlign:"center",cursor:"pointer",background:fd.garansi===g.v?`linear-gradient(135deg,${g.c},${g.c}DD)`:T.chip,color:fd.garansi===g.v?"#fff":g.c,fontWeight:800,fontSize:14}}>
                {g.e} {g.t}
              </div>)}
            </div>
          </div>
        </div>}

        {step === 3 && <div style={{animation:"fadeUp .25s ease"}}>
          <div style={{display:"flex",gap:12,marginBottom:18}}>
            <div style={{flex:1}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Estimasi Biaya</label>
              <input style={inp("")} placeholder="0" type="number" value={fd.biayaEstimasi} onChange={e => setFd(p => Object.assign({},p,{biayaEstimasi:e.target.value}))}/>
              <div style={{fontSize:11,color:T.tm,marginTop:4,fontWeight:700}}>{rp(fd.biayaEstimasi||0)}</div>
            </div>
            <div style={{flex:1}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Uang Muka (DP)</label>
              <input style={inp("")} placeholder="0" type="number" value={fd.uangMuka} onChange={e => setFd(p => Object.assign({},p,{uangMuka:e.target.value}))}/>
              <div style={{fontSize:11,color:T.tm,marginTop:4,fontWeight:700}}>{rp(fd.uangMuka||0)}</div>
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Pilih Teknisi</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              {TEKNISI.map(t => <div key={t.n} onClick={() => setFd(p => Object.assign({},p,{teknisi:t.n}))} className="tap" style={{padding:"12px 10px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:fd.teknisi===t.n?"linear-gradient(135deg,#3B82F6,#6366F1)":T.chip,color:fd.teknisi===t.n?"#fff":T.text,display:"flex",alignItems:"center",gap:8,boxShadow:fd.teknisi===t.n?"0 4px 12px rgba(59,130,246,0.3)":"none"}}>
                <span style={{fontSize:20}}>{t.e}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13}}>{t.n}</div>
                  <div style={{fontSize:10,opacity:0.85,marginTop:1}}>{t.sp}</div>
                </div>
                {fd.teknisi===t.n && <Ico n="check" s={16}/>}
              </div>)}
            </div>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Estimasi Tanggal Selesai</label>
            <input style={inp("")} type="date" value={fd.tglEstSelesai} onChange={e => setFd(p => Object.assign({},p,{tglEstSelesai:e.target.value}))}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>📝 Catatan Internal</label>
            <textarea style={Object.assign({},inp(""),{minHeight:70,resize:"vertical"})} placeholder="Catatan untuk teknisi..." value={fd.catatan} onChange={e => setFd(p => Object.assign({},p,{catatan:e.target.value}))}/>
          </div>

          {/* Summary */}
          <div style={{padding:18,background:`linear-gradient(135deg,${T.bg2},${T.card})`,borderRadius:18,border:`1.5px dashed ${T.cb}`,marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:800,color:T.tm,letterSpacing:"1.5px",marginBottom:14,textAlign:"center"}}>📋 RINGKASAN ORDER</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${T.dv}`}}>
              <Avatar name={fd.namaCustomer || "Baru"} size={44}/>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:T.text}}>{fd.namaCustomer || "-"}</div>
                <div style={{fontSize:12,color:T.ts}}>{fd.noHP || "-"}</div>
              </div>
            </div>
            {[
              ["📱 Perangkat",`${fd.merkHP || ""} ${fd.tipeHP || ""} ${fd.warnaHP ? "(" + fd.warnaHP + ")" : ""}`],
              ["🔧 Kerusakan",fd.kerusakan || "-"],
              ["⚡ Prioritas",fd.prioritas + " " + (PRIORITAS.find(p => p.v === fd.prioritas)||{}).e],
              ["👨‍🔧 Teknisi",fd.teknisi || "-"],
              ["💰 Estimasi",rp(fd.biayaEstimasi||0)],
              ["💵 DP",rp(fd.uangMuka||0)],
              ["💸 Sisa",rp(Math.max(0,(Number(fd.biayaEstimasi)||0)-(Number(fd.uangMuka)||0)))],
            ].map((r,i) => <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:12}}>
              <span style={{color:T.tm}}>{r[0]}</span>
              <span style={{fontWeight:700,color:T.text,textAlign:"right",maxWidth:"60%"}}>{r[1]}</span>
            </div>)}
          </div>
        </div>}

        <div style={{display:"flex",gap:12,marginTop:16}}>
          {step > 0 && <button onClick={() => setStep(s => Math.max(0,s-1))} className="tap" style={{flex:1,padding:16,borderRadius:16,border:`1.5px solid ${T.cb}`,background:"transparent",color:T.ts,fontSize:15,fontWeight:700,cursor:"pointer"}}>← Kembali</button>}
          {step < 3
            ? <button onClick={() => {if (validate(step)) setStep(s => s+1);}} className="tap btn-primary" style={{flex:2,padding:16,borderRadius:16,border:"none",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer"}}>Lanjut →</button>
            : <button onClick={submitForm} disabled={loading} className="tap btn-success" style={{flex:2,padding:16,borderRadius:16,border:"none",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",opacity:loading?0.7:1}}>{loading ? "⏳ Menyimpan..." : "✅ Simpan Order"}</button>
          }
        </div>
      </div>
      <Toast d={toast}/>
    </div>;
  }

  /* ═══ STATS PAGE ═══ */
  const renderStats = () => <div style={{padding:"14px 16px 110px",animation:"fadeUp .3s ease"}}>
    <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>📊 Laporan & Analitik</div>
    <div style={{fontSize:13,color:T.ts,marginBottom:20}}>Insight bisnis service center kamu</div>

    {/* Revenue Cards */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div style={{padding:16,borderRadius:16,background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",boxShadow:"0 6px 20px rgba(16,185,129,0.3)"}}>
        <div style={{fontSize:11,opacity:0.9,fontWeight:700,letterSpacing:"1px"}}>💰 PENDAPATAN BULAN INI</div>
        <div style={{fontSize:18,fontWeight:900,marginTop:6,letterSpacing:"-0.3px"}}>{rp(stats.revMonth)}</div>
        <div style={{fontSize:11,opacity:0.85,marginTop:4}}>Hari ini: {rp(stats.revToday)}</div>
      </div>
      <div style={{padding:16,borderRadius:16,background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",boxShadow:"0 6px 20px rgba(245,158,11,0.3)"}}>
        <div style={{fontSize:11,opacity:0.9,fontWeight:700,letterSpacing:"1px"}}>💸 PIUTANG</div>
        <div style={{fontSize:18,fontWeight:900,marginTop:6,letterSpacing:"-0.3px"}}>{rp(stats.piutang)}</div>
        <div style={{fontSize:11,opacity:0.85,marginTop:4}}>Belum dibayar lunas</div>
      </div>
    </div>

    {/* Rating */}
    <div style={{padding:18,borderRadius:16,background:T.card,border:`1px solid ${T.cb}`,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,color:T.tm,fontWeight:800,letterSpacing:"1px"}}>⭐ RATING CUSTOMER</div>
          <div style={{fontSize:32,fontWeight:900,color:T.text,marginTop:4,letterSpacing:"-1px"}}>{stats.avgRating || "-"}</div>
          <div style={{fontSize:12,color:T.ts,marginTop:2}}>{stats.ratedCount} review</div>
        </div>
        <div><Stars n={Math.round(stats.avgRating)}/></div>
      </div>
    </div>

    {/* Week trend */}
    <div style={{padding:18,borderRadius:16,background:T.card,border:`1px solid ${T.cb}`,marginBottom:14}}>
      <div style={{fontSize:11,color:T.tm,fontWeight:800,letterSpacing:"1px",marginBottom:14}}>📈 TREN 7 HARI TERAKHIR</div>
      <div style={{display:"flex",gap:6,alignItems:"flex-end",height:100}}>
        {stats.weekTrend.map((w,i) => {
          const max = Math.max(...stats.weekTrend.map(x => x.count), 1);
          const h = (w.count / max) * 80 + 4;
          const today_ = w.date === today();
          return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:11,fontWeight:800,color:today_?"#3B82F6":T.text}}>{w.count}</div>
            <div style={{width:"100%",height:h,borderRadius:6,background:today_?"linear-gradient(180deg,#3B82F6,#6366F1)":"linear-gradient(180deg,"+T.tm+","+T.ts+")",transition:"all .4s ease",animation:`fadeUp .5s ease ${i*0.05}s both`}}/>
            <div style={{fontSize:10,color:T.tm,fontWeight:600}}>{w.label}</div>
          </div>;
        })}
      </div>
    </div>

    {/* Top brands */}
    <div style={{padding:18,borderRadius:16,background:T.card,border:`1px solid ${T.cb}`,marginBottom:14}}>
      <div style={{fontSize:11,color:T.tm,fontWeight:800,letterSpacing:"1px",marginBottom:14}}>📱 TOP MERK HP</div>
      {stats.topBrands.length ? stats.topBrands.map(([n,c],i) => {
        const b = BRANDS.find(x => x.n === n) || {e:"📞"};
        const max = stats.topBrands[0][1];
        const pct = (c / max) * 100;
        return <div key={n} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:13,fontWeight:700,color:T.text}}>{b.e} {n}</span>
            <span style={{fontSize:13,fontWeight:800,color:T.tm}}>{c}</span>
          </div>
          <div style={{height:6,borderRadius:3,background:T.bg2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,#3B82F6,#8B5CF6)`,borderRadius:3,transition:"width .6s",animation:`slideRight .6s ease ${i*0.1}s both`}}/>
          </div>
        </div>;
      }) : <Empty icon="📱" title="Belum ada data" msg="Tambahkan service order untuk melihat statistik"/>}
    </div>

    {/* Top damages */}
    <div style={{padding:18,borderRadius:16,background:T.card,border:`1px solid ${T.cb}`,marginBottom:14}}>
      <div style={{fontSize:11,color:T.tm,fontWeight:800,letterSpacing:"1px",marginBottom:14}}>🔧 KERUSAKAN PALING SERING</div>
      {stats.topDamages.length ? stats.topDamages.map(([n,c],i) => {
        const d = DAMAGES.find(x => x.n === n) || {e:"🔧"};
        return <div key={n} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<stats.topDamages.length-1?`1px solid ${T.dv}`:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`#EF444420`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{d.e}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:T.text}}>{n}</div>
              {i === 0 && <div style={{fontSize:10,color:"#EF4444",fontWeight:700,marginTop:1}}>🔥 Paling banyak</div>}
            </div>
          </div>
          <div style={{padding:"4px 12px",borderRadius:10,background:T.bg2,fontSize:13,fontWeight:800,color:T.text}}>{c}x</div>
        </div>;
      }) : <Empty icon="🔧" title="-" msg="Belum ada data kerusakan"/>}
    </div>

    {/* Top teknisi */}
    <div style={{padding:18,borderRadius:16,background:T.card,border:`1px solid ${T.cb}`,marginBottom:14}}>
      <div style={{fontSize:11,color:T.tm,fontWeight:800,letterSpacing:"1px",marginBottom:14}}>👨‍🔧 PERFORMA TEKNISI</div>
      {stats.topTeknisi.length ? stats.topTeknisi.map(([n,c],i) => {
        const t = TEKNISI.find(x => x.n === n) || {e:"🧑‍🔧",sp:"-"};
        return <div key={n} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<stats.topTeknisi.length-1?`1px solid ${T.dv}`:"none"}}>
          <div style={{width:38,height:38,borderRadius:12,background:i===0?"linear-gradient(135deg,#FBBF24,#F59E0B)":T.bg2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{i===0?"🏆":t.e}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:800,color:T.text}}>{n}</div>
            <div style={{fontSize:11,color:T.tm}}>{t.sp}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:900,color:T.text}}>{c}</div>
            <div style={{fontSize:10,color:T.tm}}>order</div>
          </div>
        </div>;
      }) : <Empty icon="👨‍🔧" title="-" msg="Belum ada data teknisi"/>}
    </div>
  </div>;

  /* ═══ KANBAN BOARD ═══ */
  const renderBoard = () => <div style={{padding:"14px 16px 110px",animation:"fadeUp .3s ease"}}>
    <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>📋 Board Service</div>
    <div style={{fontSize:13,color:T.ts,marginBottom:20}}>Pantau semua service per status</div>
    {SFLOW.concat(["Batal"]).map(status => {
      const items = data.filter(d => d.status === status);
      const sm = SMAP[status];
      return <div key={status} style={{marginBottom:16,background:T.card,borderRadius:18,border:`1px solid ${T.cb}`,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",background:`linear-gradient(90deg,${sm.bg},transparent)`,borderLeft:`4px solid ${sm.c}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>{sm.e}</span>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:T.text}}>{status}</div>
              <div style={{fontSize:11,color:T.ts}}>{sm.txt}</div>
            </div>
          </div>
          <div style={{padding:"4px 12px",borderRadius:20,background:sm.c,color:"#fff",fontSize:12,fontWeight:800}}>{items.length}</div>
        </div>
        {items.length === 0 ? <div style={{padding:"24px",textAlign:"center",fontSize:12,color:T.tm}}>Tidak ada item</div>
          : items.slice(0,3).map(item => <div key={item.id} onClick={() => {setSel(item); setPage("detail");}} className="tap" style={{padding:"12px 18px",borderTop:`1px solid ${T.dv}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <Avatar name={item.namaCustomer} size={36}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.namaCustomer}</div>
              <div style={{fontSize:11,color:T.ts,marginTop:1}}>{item.merkHP} • {item.kerusakan}</div>
            </div>
            <Ico n="chev" s={14}/>
          </div>)}
        {items.length > 3 && <div onClick={() => {setFilter(status); setTab("list"); setPage("main");}} className="tap" style={{padding:"10px",textAlign:"center",fontSize:12,fontWeight:700,color:"#3B82F6",cursor:"pointer",borderTop:`1px solid ${T.dv}`}}>Lihat semua {items.length} →</div>}
      </div>;
    })}
  </div>;

  /* ═══ MORE PAGE ═══ */
  const renderMore = () => <div style={{padding:"14px 16px 110px",animation:"fadeUp .3s ease"}}>
    <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:20}}>⚙️ Lainnya</div>

    {/* Customer DB */}
    <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:14,border:`1px solid ${T.cb}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:T.text}}>👥 Database Customer</div>
          <div style={{fontSize:12,color:T.ts,marginTop:2}}>{customers.length} customer terdaftar</div>
        </div>
      </div>
      {customers.slice(0,5).map(c => <div key={c.noHP} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.dv}`}}>
        <Avatar name={c.nama} size={40}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:800,color:T.text}}>{c.nama}</div>
          <div style={{fontSize:11,color:T.ts}}>{c.noHP} • {c.visits}x kunjungan</div>
        </div>
        <div style={{fontSize:12,fontWeight:800,color:"#10B981"}}>{rp(c.total)}</div>
      </div>)}
      {customers.length > 5 && <div style={{textAlign:"center",fontSize:12,color:"#3B82F6",fontWeight:700,paddingTop:10}}>+{customers.length-5} customer lainnya</div>}
    </div>

    {/* Settings */}
    <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:14,border:`1px solid ${T.cb}`}}>
      <div style={{fontSize:15,fontWeight:800,color:T.text,marginBottom:14}}>⚙️ Pengaturan</div>
      <div style={{marginBottom:12}}>
        <label style={{display:"block",fontSize:12,fontWeight:700,color:T.ts,marginBottom:6}}>Nama Toko</label>
        <input style={inp("")} value={shopName} onChange={e => setShopName(e.target.value)}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:`1px solid ${T.dv}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Ico n={dark?"sun":"moon"}/><span style={{fontSize:13,fontWeight:700,color:T.text}}>Mode {dark?"Terang":"Gelap"}</span></div>
        <div onClick={() => setDark(!dark)} className="tap" style={{width:48,height:28,borderRadius:14,background:dark?"#3B82F6":"#CBD5E1",position:"relative",cursor:"pointer",transition:"all .3s"}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:dark?23:3,transition:"all .3s",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/>
        </div>
      </div>
    </div>

    {/* About */}
    <div style={{background:T.card,borderRadius:18,padding:18,marginBottom:14,border:`1px solid ${T.cb}`,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:8}}>🔧</div>
      <div style={{fontSize:16,fontWeight:800,color:T.text}}>{shopName}</div>
      <div style={{fontSize:11,color:T.tm,marginTop:4}}>v3.0 Premium Edition</div>
      <div style={{fontSize:11,color:T.tm,marginTop:8,lineHeight:1.6}}>Aplikasi manajemen service center HP profesional untuk Android & iOS</div>
    </div>
  </div>;

  /* ═══ HOME PAGE ═══ */
  const g = greeting();
  const renderHome = () => <div style={{animation:"fadeUp .3s ease"}}>
    {/* Greeting Hero */}
    <div style={{background:T.hbg,color:"#fff",padding:"16px 18px 22px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-100,right:-100,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.15),transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)"}}/>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:52,height:44,borderRadius:12,overflow:"hidden",boxShadow:"0 4px 15px rgba(56,189,248,0.35)",flexShrink:0,border:"1px solid rgba(56,189,248,0.3)"}}><img src={logo} alt="MAX" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/></div>
          <div>
            <div style={{fontSize:11,color:"#94A3B8",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>{g.e} {g.t}</div>
            <div style={{fontSize:18,fontWeight:800}}>MAX MOBILE</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div onClick={() => setDark(!dark)} className="tap" style={{cursor:"pointer",padding:9,borderRadius:11,background:"rgba(255,255,255,0.1)"}}><Ico n={dark?"sun":"moon"} s={18}/></div>
          <div onClick={() => fetchData(true)} className="tap" style={{cursor:"pointer",padding:9,borderRadius:11,background:"rgba(255,255,255,0.1)",animation:spinning?"spin 1s linear infinite":"none"}}><Ico n="refresh" s={18}/></div>
        </div>
      </div>

      {/* Big Revenue Card */}
      <div style={{background:"linear-gradient(135deg,rgba(16,185,129,0.18),rgba(5,150,105,0.12))",borderRadius:18,padding:18,marginBottom:14,position:"relative",zIndex:1,border:"1px solid rgba(52,211,153,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"#94A3B8",fontWeight:700,letterSpacing:"1px"}}>💰 PENDAPATAN BULAN INI</div>
            <div style={{fontSize:24,fontWeight:900,color:"#fff",marginTop:6,letterSpacing:"-0.5px"}}>{rp(stats.revMonth)}</div>
            <div style={{fontSize:11,color:"#34D399",marginTop:4,fontWeight:700}}>↗ Hari ini: {rp(stats.revToday)}</div>
          </div>
          <div style={{padding:"6px 12px",borderRadius:20,background:"rgba(52,211,153,0.2)",color:"#34D399",fontSize:11,fontWeight:800}}>+{stats.hari} hari ini</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,position:"relative",zIndex:1}}>
        {[
          [stats.total,"Total","#F1F5F9","📦"],
          [stats.proses,"Proses","#FBBF24","🔧"],
          [stats.selesai,"Selesai","#34D399","✅"],
          [stats.hari,"Hari Ini","#38BDF8","📅"],
        ].map(([n,l,c,e],i) => <div key={i} style={{background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"12px 6px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)",backdropFilter:"blur(10px)"}}>
          <div style={{fontSize:18,marginBottom:2}}>{e}</div>
          <div style={{fontSize:20,fontWeight:900,color:c}}>{n}</div>
          <div style={{fontSize:9,color:"#94A3B8",marginTop:1,textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:700}}>{l}</div>
        </div>)}
      </div>
    </div>

    {/* Quick Action Banner */}
    {stats.proses > 0 && <div onClick={() => {setFilter("Proses"); setTab("list");}} className="tap" style={{margin:"14px 16px",padding:14,background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",borderRadius:14,border:"1.5px solid #FBBF24",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
      <div style={{fontSize:28}}>⚡</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:800,color:"#92400E"}}>{stats.proses} service sedang proses</div>
        <div style={{fontSize:11,color:"#78350F"}}>Tap untuk lihat semua</div>
      </div>
      <Ico n="chev" s={18}/>
    </div>}

    {/* Recent Orders */}
    <div style={{padding:"4px 16px 110px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,marginBottom:12}}>
        <div style={{fontSize:15,fontWeight:800,color:T.text}}>🕐 Order Terbaru</div>
        <div onClick={() => setTab("list")} className="tap" style={{fontSize:12,fontWeight:700,color:"#3B82F6",cursor:"pointer"}}>Semua →</div>
      </div>
      {loading && !data.length ? <><Skeleton/><Skeleton/><Skeleton/></>
        : data.slice(0,5).map((item,idx) => {
          const st = SMAP[item.status] || SMAP.Diterima;
          return <div key={item.id} onClick={() => {setSel(item); setPage("detail");}} className="tap" style={{background:T.card,borderRadius:16,padding:14,marginBottom:10,border:`1px solid ${T.cb}`,cursor:"pointer",animation:`fadeUp .3s ease ${idx*0.04}s both`,display:"flex",alignItems:"center",gap:12}}>
            <Avatar name={item.namaCustomer} size={42}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2,gap:8}}>
                <div style={{fontSize:14,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.namaCustomer}</div>
                <Badge s={item.status}/>
              </div>
              <div style={{fontSize:11,color:T.tm,fontWeight:600}}>{item.merkHP} {item.tipeHP} • {item.kerusakan}</div>
            </div>
          </div>;
        })}
    </div>
  </div>;

  /* ═══ LIST PAGE ═══ */
  const renderList = () => <div style={{padding:"14px 16px 110px",animation:"fadeUp .3s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div>
        <div style={{fontSize:22,fontWeight:800,color:T.text}}>📋 Daftar Service</div>
        <div style={{fontSize:12,color:T.ts,marginTop:2}}>{filtered.length} dari {data.length} order</div>
      </div>
      <div onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")} className="tap" style={{padding:10,borderRadius:12,background:T.card,border:`1px solid ${T.cb}`,cursor:"pointer",color:T.ts}}><Ico n={viewMode==="list"?"grid":"list"} s={18}/></div>
    </div>

    {/* Search */}
    <div style={{display:"flex",alignItems:"center",gap:10,background:T.card,borderRadius:16,padding:"12px 16px",marginBottom:12,border:`1px solid ${T.cb}`}}>
      <span style={{color:T.tm}}><Ico n="search" s={18}/></span>
      <input style={{border:"none",outline:"none",flex:1,fontSize:15,color:T.text,background:"transparent",fontFamily:"inherit"}} placeholder="Cari nama, ID, merk, kerusakan..." value={search} onChange={e => setSearch(e.target.value)}/>
      {search && <span onClick={() => setSearch("")} className="tap" style={{cursor:"pointer",color:T.tm,fontSize:18,fontWeight:800,padding:"0 4px"}}><Ico n="x" s={16}/></span>}
    </div>

    {/* Sort */}
    <div style={{display:"flex",gap:6,marginBottom:10,overflowX:"auto",paddingBottom:6}}>
      {[["newest","🆕 Terbaru"],["oldest","📅 Terlama"],["priority","⚡ Prioritas"],["biaya","💰 Biaya"]].map(s => <div key={s[0]} onClick={() => setSortBy(s[0])} className="tap" style={{padding:"7px 13px",borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",background:sortBy===s[0]?T.text:T.chip,color:sortBy===s[0]?T.bg:T.ts,flexShrink:0}}>{s[1]}</div>)}
    </div>

    {/* Status Filter */}
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:12,marginBottom:8}}>
      {["Semua"].concat(Object.keys(SMAP)).map(s => {
        const cnt = s === "Semua" ? data.length : data.filter(d => d.status === s).length;
        const act = filter === s;
        const sm = SMAP[s] || {};
        return <div key={s} onClick={() => setFilter(s)} className="tap" style={{padding:"8px 14px",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,flexShrink:0,background:act?(s==="Semua"?"linear-gradient(135deg,#3B82F6,#6366F1)":sm.bg):T.chip,color:act?(s==="Semua"?"#fff":sm.c):T.tm,boxShadow:act?"0 2px 8px rgba(0,0,0,0.08)":"none",border:act&&s!=="Semua"?`1.5px solid ${sm.c}33`:"1.5px solid transparent"}}>
          {s !== "Semua" && <span style={{fontSize:11}}>{sm.e}</span>}
          {s} {cnt > 0 && <span style={{fontSize:10,opacity:0.7}}>{cnt}</span>}
        </div>;
      })}
    </div>

    {/* List */}
    {loading && !data.length ? <><Skeleton/><Skeleton/><Skeleton/></>
      : filtered.length === 0 ? <Empty icon={search?"🔍":"📱"} title={search?"Tidak ditemukan":"Belum ada data"} msg={search?`Tidak ada hasil untuk "${search}"`:"Tap + untuk menambah service order"} action={search?"Reset Pencarian":null} onAction={() => setSearch("")}/>
      : viewMode === "grid"
        ? <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {filtered.map((item,idx) => {
            const st = SMAP[item.status] || SMAP.Diterima;
            return <div key={item.id} onClick={() => {setSel(item); setPage("detail");}} className="tap" style={{background:T.card,borderRadius:16,padding:14,border:`1px solid ${T.cb}`,cursor:"pointer",animation:`fadeUp .3s ease ${idx*0.03}s both`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <Avatar name={item.namaCustomer} size={40}/>
                <Ico n={item.merkHP === "iPhone" ? "apple" : "android"} s={18}/>
              </div>
              <div style={{fontSize:13,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.namaCustomer}</div>
              <div style={{fontSize:11,color:T.tm,marginTop:2,marginBottom:8}}>{item.merkHP} {item.tipeHP}</div>
              <Badge s={item.status}/>
              {Number(item.biayaEstimasi) > 0 && <div style={{marginTop:8,fontSize:13,fontWeight:800,color:"#3B82F6"}}>{rp(item.biayaEstimasi)}</div>}
            </div>;
          })}
        </div>
        : filtered.map((item,idx) => {
          const st = SMAP[item.status] || SMAP.Diterima;
          return <div key={item.id} onClick={() => {setSel(item); setPage("detail");}} className="tap" style={{background:T.card,borderRadius:18,padding:14,marginBottom:10,border:`1px solid ${T.cb}`,cursor:"pointer",animation:`fadeUp .3s ease ${idx*0.03}s both`}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <Avatar name={item.namaCustomer} size={48}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.namaCustomer}</div>
                    <div style={{fontSize:11,color:T.tm,fontWeight:600,marginTop:1}}>{item.id} • {item.merkHP} {item.tipeHP||""}</div>
                  </div>
                  <Badge s={item.status}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.dv}`}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:8,fontSize:11,fontWeight:700,background:dark?"#1E293B":"#FEF2F2",color:"#EF4444"}}>🔧 {item.kerusakan}</span>
                  <span style={{fontSize:11,color:T.tm,fontWeight:600}}>{daysAgo(item.tanggalMasuk)}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,flexWrap:"wrap"}}>
                  {Number(item.biayaEstimasi) > 0 && <span style={{fontSize:13,fontWeight:800,color:"#3B82F6"}}>{rp(item.biayaEstimasi)}</span>}
                  {item.prioritas && item.prioritas !== "Normal" && <span style={{fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:6,background:item.prioritas==="Express"?"#FEF2F2":"#FFFBEB",color:item.prioritas==="Express"?"#EF4444":"#F59E0B"}}>{item.prioritas==="Express"?"🔴":"🟡"} {item.prioritas}</span>}
                  {item.garansi === "Ya" && <span style={{fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:6,background:"#ECFDF5",color:"#10B981"}}>✅ Garansi</span>}
                  {Number(item.rating) > 0 && <span style={{fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:6,background:"#FFFBEB",color:"#F59E0B"}}>⭐ {item.rating}</span>}
                </div>
              </div>
            </div>
          </div>;
        })}
  </div>;

  /* ═══ MAIN RENDER ═══ */
  return <div style={base}>
    <style>{CSS}</style>

    {tab === "home" && renderHome()}
    {tab === "list" && renderList()}
    {tab === "board" && renderBoard()}
    {tab === "stats" && renderStats()}
    {tab === "more" && renderMore()}

    {/* FAB */}
    <button onClick={() => {setPage("form"); setStep(0); setErrs({}); setFd(initFd);}} className="tap btn-primary" style={{position:"fixed",bottom:88,right:"calc(50% - 218px)",width:62,height:62,borderRadius:22,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:99,border:"none",animation:"glow 2.5s ease infinite"}}><Ico n="plus" s={28}/></button>

    {/* Bottom Nav */}
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:T.card,display:"flex",justifyContent:"space-around",padding:"10px 0 max(14px, env(safe-area-inset-bottom))",borderTop:`1px solid ${T.cb}`,zIndex:100,boxShadow:"0 -4px 24px rgba(0,0,0,0.06)"}}>
      {[
        ["home","Beranda","home"],
        ["list","Daftar","list"],
        ["board","Board","grid"],
        ["stats","Laporan","chart"],
        ["more","Lainnya","settings"],
      ].map((item,i) => {
        const act = tab === item[0];
        return <div key={i} onClick={() => {setTab(item[0]); setPage("main");}} className="tap" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 10px",cursor:"pointer",color:act?"#3B82F6":T.tm,position:"relative"}}>
          <div style={{transform:act?"scale(1.15)":"scale(1)",transition:"transform .25s cubic-bezier(.34,1.56,.64,1)"}}><Ico n={item[2]} s={act?23:21}/></div>
          <span style={{fontSize:10,fontWeight:act?800:600}}>{item[1]}</span>
          {act && <div style={{width:5,height:5,borderRadius:"50%",background:"#3B82F6",position:"absolute",bottom:-2}}/>}
        </div>;
      })}
    </div>

    {nota && <Nota item={nota} onClose={() => setNota(null)}/>}
    {modal && <Modal {...modal} onNo={() => setModal(null)}/>}
    <Toast d={toast}/>
  </div>;
}
