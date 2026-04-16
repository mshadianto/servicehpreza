import { useState, useEffect, useCallback } from "react";
import { supabase, hasSupabase } from "./lib/supabase";
import logo from "./assets/logo.jpeg";

const SFLOW = ["Diterima","Diagnosa","Proses","Selesai","Diambil"];
const SMAP = {
  Diterima:{c:"#3B82F6",bg:"#EFF6FF",e:"📥"},
  Diagnosa:{c:"#F59E0B",bg:"#FFFBEB",e:"🔍"},
  Proses:{c:"#8B5CF6",bg:"#F5F3FF",e:"🔧"},
  Selesai:{c:"#10B981",bg:"#ECFDF5",e:"✅"},
  Diambil:{c:"#6B7280",bg:"#F3F4F6",e:"🤝"},
  Batal:{c:"#EF4444",bg:"#FEF2F2",e:"❌"},
};
const BRANDS = ["Samsung","iPhone","Xiaomi","OPPO","Vivo","Realme","Huawei","Infinix","POCO","OnePlus","Lainnya"];
const DAMAGES = ["LCD Pecah","Baterai Drop","Mati Total","Charging Error","Speaker Rusak","Kamera Error","Software/Hang","Water Damage","Tombol Rusak","Sinyal Hilang","Lainnya"];
const COLORS = ["Hitam","Putih","Biru","Hijau","Merah","Gold","Silver","Ungu","Pink","Lainnya"];
const KONDISI = ["Mulus","Lecet Ringan","Lecet Berat","Retak","Penyok"];
const KELENGKAPAN = ["Charger","Kabel Data","Dus/Box","SIM Card","Memory Card","Case/Casing","Screen Guard"];
const PRIORITAS = [{v:"Normal",e:"🟢",c:"#10B981"},{v:"Urgent",e:"🟡",c:"#F59E0B"},{v:"Express",e:"🔴",c:"#EF4444"}];
const TEKNISI_LIST = ["Pak Budi","Pak Eko","Pak Andi","Pak Reza","Bu Sari"];
const fmt = function(d) { return d ? new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}) : "-"; };
const rp = function(n) { return (n || n === 0) ? "Rp " + Number(n).toLocaleString("id-ID") : "-"; };
const today = function() { return new Date().toISOString().split("T")[0]; };

const DEMO = [
  {id:"SRV001",namaCustomer:"Ahmad Fadli",noHP:"081234567890",alamat:"Jl. Melati No.12, Ciputat",merkHP:"Samsung",tipeHP:"Galaxy A54",warnaHP:"Hitam",imei:"354678091234567",kondisi:"Lecet Ringan",kelengkapan:"Charger,Kabel Data",kerusakan:"LCD Pecah",keluhan:"Layar retak setelah jatuh dari meja",prioritas:"Urgent",status:"Proses",biayaEstimasi:450000,uangMuka:200000,teknisi:"Pak Budi",passwordHP:"1234",garansi:"Tidak",tglEstSelesai:"2026-04-12",tanggalMasuk:"2026-04-08",catatan:"Sparepart sudah dipesan"},
  {id:"SRV002",namaCustomer:"Siti Rahma",noHP:"085678901234",alamat:"Jl. Kenanga No.5, Pamulang",merkHP:"iPhone",tipeHP:"iPhone 13",warnaHP:"Putih",imei:"490154203237518",kondisi:"Mulus",kelengkapan:"Charger,Dus/Box,Case/Casing",kerusakan:"Baterai Drop",keluhan:"Baterai cepat habis, health 72%",prioritas:"Normal",status:"Selesai",biayaEstimasi:600000,uangMuka:300000,teknisi:"Pak Eko",passwordHP:"Face ID",garansi:"Ya",tglEstSelesai:"2026-04-10",tanggalMasuk:"2026-04-07",catatan:"Baterai original Apple"},
  {id:"SRV003",namaCustomer:"Budi Santoso",noHP:"087890123456",alamat:"Jl. Dahlia No.8, Serpong",merkHP:"Xiaomi",tipeHP:"Redmi Note 12",warnaHP:"Biru",imei:"",kondisi:"Lecet Berat",kelengkapan:"Charger",kerusakan:"Mati Total",keluhan:"HP mati setelah kena air hujan",prioritas:"Express",status:"Diagnosa",biayaEstimasi:0,uangMuka:50000,teknisi:"Pak Andi",passwordHP:"Pola",garansi:"Tidak",tglEstSelesai:"",tanggalMasuk:"2026-04-09",catatan:"Perlu cek mesin & IC power"},
  {id:"SRV004",namaCustomer:"Dewi Putri",noHP:"089012345678",alamat:"Jl. Anggrek No.3, BSD",merkHP:"OPPO",tipeHP:"Reno 10",warnaHP:"Gold",imei:"867530012345678",kondisi:"Mulus",kelengkapan:"Charger,SIM Card",kerusakan:"Charging Error",keluhan:"Port charging longgar, kadang konek kadang tidak",prioritas:"Normal",status:"Diterima",biayaEstimasi:150000,uangMuka:0,teknisi:"",passwordHP:"",garansi:"Ya",tglEstSelesai:"2026-04-14",tanggalMasuk:"2026-04-10",catatan:""},
  {id:"SRV005",namaCustomer:"Rudi Hartono",noHP:"081345678901",alamat:"Jl. Mawar No.20, Pondok Aren",merkHP:"Vivo",tipeHP:"V29",warnaHP:"Ungu",imei:"",kondisi:"Lecet Ringan",kelengkapan:"Charger,Case/Casing",kerusakan:"Kamera Error",keluhan:"Kamera belakang blur & tidak bisa fokus",prioritas:"Urgent",status:"Proses",biayaEstimasi:350000,uangMuka:150000,teknisi:"Pak Budi",passwordHP:"5678",garansi:"Tidak",tglEstSelesai:"2026-04-11",tanggalMasuk:"2026-04-06",catatan:"Modul kamera perlu diganti"},
  {id:"SRV006",namaCustomer:"Aisyah Nur",noHP:"082567890123",alamat:"Jl. Flamboyan No.15, Ciputat Timur",merkHP:"Samsung",tipeHP:"Galaxy S23",warnaHP:"Hijau",imei:"352789041234567",kondisi:"Mulus",kelengkapan:"Charger,Kabel Data,Dus/Box,Screen Guard",kerusakan:"Software/Hang",keluhan:"HP sering restart sendiri & lag",prioritas:"Normal",status:"Selesai",biayaEstimasi:200000,uangMuka:100000,teknisi:"Pak Eko",passwordHP:"Pattern",garansi:"Ya",tglEstSelesai:"2026-04-08",tanggalMasuk:"2026-04-05",catatan:"Factory reset + update firmware"},
];

const CSS_TEXT = `
@keyframes scaleIn{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes barLoad{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}
input:focus,select:focus,textarea:focus{border-color:#3B82F6!important;box-shadow:0 0 0 4px rgba(59,130,246,0.08)!important}
.chover:active{transform:scale(0.97)!important}
*::-webkit-scrollbar{display:none}
`;

function Ico({name, size}) {
  const s = size || 20;
  const p = {viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",width:s,height:s};
  const pf = {viewBox:"0 0 24 24",fill:"currentColor",width:s,height:s};
  switch(name) {
    case "back": return <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>;
    case "plus": return <svg {...{...p,strokeWidth:"2.5"}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "home": return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "list": return <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case "refresh": return <svg {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
    case "receipt": return <svg {...p}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>;
    case "call": return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case "moon": return <svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    case "sun": return <svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "chev": return <svg {...{...p,strokeWidth:"2.5"}}><polyline points="9 18 15 12 9 6"/></svg>;
    case "wa": return <svg {...pf}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
    case "apple": return <svg {...pf}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/></svg>;
    case "android": return <svg {...pf}><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.69-.04-.86.27l-1.86 3.22c-1.44-.65-3.06-1.01-4.76-1.01-1.7 0-3.33.36-4.76 1.01L5.07 5.71c-.16-.31-.54-.43-.86-.27-.31.16-.43.55-.27.86L5.78 9.48C2.56 11.22.48 14.06 0 17.4h24c-.48-3.34-2.56-6.18-5.76-7.92zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>;
    default: return null;
  }
}

function Badge({status}) {
  var s = SMAP[status] || SMAP.Diterima;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,fontSize:11,fontWeight:800,color:s.c,background:s.bg,border:"1px solid " + s.c + "20",flexShrink:0}}>
      <span style={{fontSize:11}}>{s.e}</span> {status}
    </span>
  );
}

function Timeline({current}) {
  var idx = SFLOW.indexOf(current);
  return (
    <div style={{display:"flex",alignItems:"center",margin:"16px 0 4px",padding:"0 4px"}}>
      {SFLOW.map(function(s, i) {
        var done = i <= idx;
        var active = i === idx;
        var st = SMAP[s];
        return (
          <div key={s} style={{display:"flex",alignItems:"center",flex:i < SFLOW.length - 1 ? 1 : "none"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:1}}>
              <div style={{
                width: active ? 36 : 28, height: active ? 36 : 28, borderRadius: "50%",
                background: done ? st.c : "#475569",
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"all .3s",
                boxShadow: active ? "0 0 0 4px " + st.bg + ", 0 4px 12px " + st.c + "40" : "none",
                fontSize: active ? 15 : 11, color:"#fff", fontWeight:800,
              }}>
                {done ? (active ? st.e : "✓") : String(i + 1)}
              </div>
              <div style={{fontSize:9,fontWeight:700,color:done ? st.c : "#64748B",marginTop:4,whiteSpace:"nowrap"}}>{s}</div>
            </div>
            {i < SFLOW.length - 1 && (
              <div style={{flex:1,height:3,background:i < idx ? (SMAP[SFLOW[i+1]] || {}).c || "#475569" : "#475569",borderRadius:2,margin:"0 4px 16px",transition:"all .3s"}} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Modal({title, msg, onOk, onNo, okText, danger}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:340,padding:28,textAlign:"center",animation:"scaleIn .25s ease"}}>
        <div style={{fontSize:40,marginBottom:12}}>{danger ? "⚠️" : "❓"}</div>
        <div style={{fontSize:18,fontWeight:800,color:"#0F172A",marginBottom:8}}>{title}</div>
        <div style={{fontSize:14,color:"#64748B",lineHeight:1.6,marginBottom:24}}>{msg}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onNo} style={{flex:1,padding:12,borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff",color:"#64748B",fontSize:14,fontWeight:700,cursor:"pointer"}}>Batal</button>
          <button onClick={onOk} style={{flex:1,padding:12,borderRadius:12,border:"none",background:danger ? "#EF4444" : "linear-gradient(135deg,#3B82F6,#6366F1)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{okText || "Ya"}</button>
        </div>
      </div>
    </div>
  );
}

function Nota({item, onClose}) {
  var sisa = (Number(item.biayaEstimasi) || 0) - (Number(item.uangMuka) || 0);
  function sendWA() {
    var t = "📋 *NOTA SERVICE*\n━━━━━━━━━━━━\nID: " + item.id + "\nCustomer: " + item.namaCustomer + "\nHP: " + item.merkHP + " " + (item.tipeHP||"") + "\nWarna: " + (item.warnaHP||"-") + "\nIMEI: " + (item.imei||"-") + "\nKondisi: " + (item.kondisi||"-") + "\nKelengkapan: " + (item.kelengkapan||"-") + "\nKerusakan: " + item.kerusakan + "\nPrioritas: " + (item.prioritas||"Normal") + "\nStatus: " + item.status + "\nTeknisi: " + (item.teknisi||"-") + "\nEstimasi: " + rp(item.biayaEstimasi) + "\nDP: " + rp(item.uangMuka) + "\nSisa: " + rp(sisa) + "\n━━━━━━━━━━━━\n_MAX Mobile Service_";
    window.open("https://wa.me/" + (item.noHP || "").replace(/^0/,"62") + "?text=" + encodeURIComponent(t), "_blank");
  }
  var rows = [["Customer",item.namaCustomer],["No. HP",item.noHP],["Alamat",item.alamat],["Perangkat",item.merkHP + " " + (item.tipeHP||"")],["Warna",item.warnaHP],["IMEI/SN",item.imei],["Kondisi",item.kondisi],["Kelengkapan",item.kelengkapan],["Kerusakan",item.kerusakan],["Prioritas",item.prioritas],["Teknisi",item.teknisi||"-"],["Status",item.status]];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:380,maxHeight:"85vh",overflow:"auto",animation:"scaleIn .25s ease"}}>
        <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",color:"#fff",padding:"20px 24px",borderRadius:"20px 20px 0 0",textAlign:"center"}}>
          <div style={{fontSize:20,fontWeight:800}}>📋 Nota Service</div>
          <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>MAX Mobile Service</div>
        </div>
        <div style={{padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,paddingBottom:12,borderBottom:"2px dashed #E2E8F0"}}>
            <span style={{fontWeight:800,fontSize:15,color:"#3B82F6"}}>{item.id}</span>
            <span style={{fontSize:13,color:"#64748B"}}>{fmt(item.tanggalMasuk)}</span>
          </div>
          {rows.map(function(r, i) {
            return (
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i < rows.length - 1 ? "1px solid #F1F5F9" : "none",gap:12}}>
                <span style={{fontSize:13,color:"#94A3B8",flexShrink:0}}>{r[0]}</span>
                <span style={{fontSize:13,fontWeight:600,color:"#0F172A",textAlign:"right"}}>{r[1] || "-"}</span>
              </div>
            );
          })}
          <div style={{marginTop:16,padding:16,background:"#F8FAFC",borderRadius:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:14,color:"#64748B"}}>Estimasi</span>
              <span style={{fontSize:16,fontWeight:800}}>{rp(item.biayaEstimasi)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:14,color:"#64748B"}}>DP</span>
              <span style={{fontSize:16,fontWeight:700,color:"#10B981"}}>{rp(item.uangMuka)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"2px solid #E2E8F0"}}>
              <span style={{fontSize:14,fontWeight:800}}>Sisa</span>
              <span style={{fontSize:18,fontWeight:900,color:"#EF4444"}}>{rp(sisa)}</span>
            </div>
          </div>
          <div style={{marginTop:20,display:"flex",gap:10}}>
            <button onClick={sendWA} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#25D366",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Ico name="wa" size={18} /> Kirim WA
            </button>
            <button onClick={onClose} style={{flex:1,padding:12,borderRadius:12,border:"1.5px solid #E2E8F0",background:"#fff",color:"#334155",fontSize:14,fontWeight:700,cursor:"pointer"}}>Tutup</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({data}) {
  if (!data) return null;
  return (
    <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",padding:"12px 24px",borderRadius:16,fontSize:14,fontWeight:700,zIndex:400,boxShadow:"0 8px 30px rgba(0,0,0,0.15)",background:data.type==="error" ? "#FEF2F2" : "#ECFDF5",color:data.type==="error" ? "#DC2626" : "#059669",border:"1.5px solid " + (data.type==="error" ? "#FECACA" : "#A7F3D0"),animation:"scaleIn .3s ease",maxWidth:340}}>
      {data.msg}
    </div>
  );
}

export default function App() {
  var [splash, setSplash] = useState(true);
  var [dark, setDark] = useState(false);
  var [page, setPage] = useState("home");
  var [tab, setTab] = useState("home");
  var [data, setData] = useState([]);
  var [loading, setLoading] = useState(false);
  var [spinning, setSpinning] = useState(false);
  var [search, setSearch] = useState("");
  var [filter, setFilter] = useState("Semua");
  var [sel, setSel] = useState(null);
  var [toast, setToast] = useState(null);
  var [modal, setModal] = useState(null);
  var [nota, setNota] = useState(null);
  var [step, setStep] = useState(0);
  var [fd, setFd] = useState({namaCustomer:"",noHP:"",alamat:"",merkHP:"",tipeHP:"",warnaHP:"",imei:"",kondisi:"",kelengkapan:[],kerusakan:"",keluhan:"",prioritas:"Normal",biayaEstimasi:"",uangMuka:"",teknisi:"",passwordHP:"",garansi:"",tglEstSelesai:"",catatan:""});
  var [errs, setErrs] = useState({});

  useEffect(function() { var t = setTimeout(function() { setSplash(false); }, 2200); return function() { clearTimeout(t); }; }, []);

  function flash(msg, type) { setToast({msg:msg,type:type||"success"}); setTimeout(function(){setToast(null);},3000); }

  var fetchData = useCallback(function(silent) {
    if (!silent) setLoading(true); else setSpinning(true);
    if (!hasSupabase) {
      setData(DEMO);
      setLoading(false); setSpinning(false);
      return;
    }
    supabase.from("services").select("*").order("created_at", {ascending:false}).then(function(res) {
      if (res.error || !res.data) { setData(DEMO); }
      else { setData(res.data); }
    }).catch(function() {
      setData(DEMO);
    }).finally(function() {
      setLoading(false); setSpinning(false);
    });
  }, []);

  useEffect(function() { fetchData(); }, [fetchData]);

  var filtered = data.filter(function(d) {
    var q = search.toLowerCase();
    var ms = !q || (d.namaCustomer||"").toLowerCase().indexOf(q)>=0 || (d.id||"").toLowerCase().indexOf(q)>=0 || (d.merkHP||"").toLowerCase().indexOf(q)>=0 || (d.noHP||"").indexOf(q)>=0 || (d.tipeHP||"").toLowerCase().indexOf(q)>=0;
    var mf = filter==="Semua" || d.status===filter;
    return ms && mf;
  });

  var stats = {
    total: data.length,
    proses: data.filter(function(d){return d.status==="Proses"||d.status==="Diagnosa";}).length,
    selesai: data.filter(function(d){return d.status==="Selesai";}).length,
    hari: data.filter(function(d){return d.tanggalMasuk===today();}).length,
    rev: data.filter(function(d){return d.status==="Selesai"||d.status==="Diambil";}).reduce(function(a,b){return a+(Number(b.biayaEstimasi)||0);},0),
  };

  function validate(s) {
    var e = {};
    if (s===0) { if(!fd.namaCustomer.trim()) e.namaCustomer="Wajib"; if(!fd.noHP.trim()) e.noHP="Wajib"; else if(!/^08\d{8,12}$/.test(fd.noHP.trim())) e.noHP="Format: 08xxx"; }
    if (s===1) { if(!fd.merkHP) e.merkHP="Pilih merk"; }
    if (s===2) { if(!fd.kerusakan) e.kerusakan="Pilih kerusakan"; }
    setErrs(e); return Object.keys(e).length===0;
  }

  function submitForm() {
    if (!validate(3)) return;
    setLoading(true);
    var sendFd = Object.assign({}, fd, {kelengkapan: (fd.kelengkapan||[]).join(",")});
    var payload = {
      namaCustomer: sendFd.namaCustomer, noHP: sendFd.noHP, alamat: sendFd.alamat || null,
      merkHP: sendFd.merkHP || null, tipeHP: sendFd.tipeHP || null, warnaHP: sendFd.warnaHP || null,
      imei: sendFd.imei || null, kondisi: sendFd.kondisi || null, kelengkapan: sendFd.kelengkapan || null,
      kerusakan: sendFd.kerusakan || null, keluhan: sendFd.keluhan || null,
      prioritas: sendFd.prioritas || "Normal", status: "Diterima",
      biayaEstimasi: Number(sendFd.biayaEstimasi) || 0, uangMuka: Number(sendFd.uangMuka) || 0,
      teknisi: sendFd.teknisi || null, passwordHP: sendFd.passwordHP || null,
      garansi: sendFd.garansi || "Tidak", tglEstSelesai: sendFd.tglEstSelesai || null,
      tanggalMasuk: today(), catatan: sendFd.catatan || null,
    };
    var done = function() {
      setFd({namaCustomer:"",noHP:"",alamat:"",merkHP:"",tipeHP:"",warnaHP:"",imei:"",kondisi:"",kelengkapan:[],kerusakan:"",keluhan:"",prioritas:"Normal",biayaEstimasi:"",uangMuka:"",teknisi:"",passwordHP:"",garansi:"",tglEstSelesai:"",catatan:""});
      setStep(0); setPage("home"); setTab("home"); setLoading(false); fetchData(true);
    };
    if (!hasSupabase) {
      var ni = Object.assign({}, payload, {id:"SRV"+String(data.length+1).padStart(3,"0")});
      setData(function(p){return [ni].concat(p);});
      flash("Tersimpan (offline) 📱");
      done();
      return;
    }
    supabase.from("services").insert([payload]).select().then(function(res) {
      if (res.error) {
        flash("Gagal menyimpan: " + res.error.message, "error");
      } else {
        flash("Service order berhasil! 🎉");
      }
    }).catch(function() {
      flash("Gagal menyimpan ke server", "error");
    }).finally(done);
  }

  function updStatus(item, ns) {
    setModal(null);
    setData(function(p){return p.map(function(d){return d.id===item.id?Object.assign({},d,{status:ns}):d;});});
    var upd = Object.assign({}, item, {status:ns});
    setSel(upd);
    flash("Status → " + (SMAP[ns]||{}).e + " " + ns);
    if (hasSupabase) {
      supabase.from("services").update({status: ns}).eq("id", item.id).then(function(){});
    }
  }

  var T = dark
    ? {bg:"#0F172A",card:"#1E293B",cb:"#334155",text:"#F1F5F9",ts:"#94A3B8",tm:"#64748B",ib:"#1E293B",ib2:"#334155",hbg:"linear-gradient(135deg,#020617,#0F172A,#1E293B)",dv:"#334155"}
    : {bg:"#F1F5F9",card:"#FFFFFF",cb:"#E2E8F0",text:"#0F172A",ts:"#64748B",tm:"#94A3B8",ib:"#FAFBFC",ib2:"#E2E8F0",hbg:"linear-gradient(135deg,#0F172A,#1E293B,#334155)",dv:"#F1F5F9"};

  var base = {fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif",background:T.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto"};
  var inp = function(f) { return {width:"100%",padding:"14px 16px",borderRadius:14,border:"1.5px solid "+(errs[f]?"#EF4444":T.ib2),fontSize:16,color:T.text,background:T.ib,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}; };

  // ═══ SPLASH ═══
  if (splash) {
    return (
      <div style={Object.assign({},base,{background:"linear-gradient(145deg,#0F172A,#1E293B,#334155)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff"})}>
        <style>{CSS_TEXT}</style>
        <div style={{width:200,height:110,borderRadius:20,overflow:"hidden",boxShadow:"0 20px 60px rgba(56,189,248,0.4)",animation:"pulse 2.4s ease infinite",marginBottom:24,border:"1.5px solid rgba(56,189,248,0.25)"}}>
          <img src={logo} alt="MAX Mobile Service" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        </div>
        <div style={{fontSize:28,fontWeight:900,letterSpacing:"2px",animation:"slideUp .6s ease .3s both"}}>MAX MOBILE</div>
        <div style={{fontSize:12,color:"#94A3B8",fontWeight:700,letterSpacing:"4px",textTransform:"uppercase",marginTop:6,animation:"slideUp .6s ease .5s both"}}>Apple & Android Service</div>
        <div style={{marginTop:40,width:200,height:3,borderRadius:4,background:"rgba(255,255,255,0.1)",overflow:"hidden",animation:"slideUp .6s ease .7s both"}}>
          <div style={{width:"60%",height:"100%",borderRadius:4,background:"linear-gradient(90deg,#38BDF8,#818CF8)",animation:"barLoad 2s ease infinite"}} />
        </div>
      </div>
    );
  }

  // ═══ DETAIL ═══
  if (page==="detail" && sel) {
    var ci = SFLOW.indexOf(sel.status);
    var ns = ci < SFLOW.length-1 ? SFLOW[ci+1] : null;
    var sisa = (Number(sel.biayaEstimasi)||0) - (Number(sel.uangMuka)||0);
    return (
      <div style={base}>
        <style>{CSS_TEXT}</style>
        <div style={{background:T.hbg,color:"#fff",padding:"16px 20px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div onClick={function(){setPage("home");setSel(null);}} style={{cursor:"pointer",padding:6,borderRadius:10,background:"rgba(255,255,255,0.1)"}}><Ico name="back" /></div>
            <div style={{flex:1}}>
              <div style={{fontSize:18,fontWeight:800}}>Detail Service</div>
              <div style={{fontSize:12,color:"#94A3B8",fontWeight:600}}>{sel.id} • {fmt(sel.tanggalMasuk)}</div>
            </div>
            <div onClick={function(){setNota(sel);}} style={{cursor:"pointer",padding:8,borderRadius:10,background:"rgba(255,255,255,0.1)"}}><Ico name="receipt" /></div>
          </div>
          <Timeline current={sel.status} />
        </div>
        <div style={{padding:"16px 16px 120px"}}>
          {/* Quick Actions */}
          <div style={{display:"flex",gap:10,marginBottom:16,animation:"fadeSlide .3s ease"}}>
            <button onClick={function(){window.open("tel:"+sel.noHP);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,borderRadius:14,border:"1px solid "+T.cb,background:T.card,color:T.text,fontSize:13,fontWeight:700,cursor:"pointer"}}><Ico name="call" size={16}/> Telepon</button>
            <button onClick={function(){window.open("https://wa.me/"+(sel.noHP||"").replace(/^0/,"62"),"_blank");}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,borderRadius:14,border:"none",background:"#25D366",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(37,211,102,0.25)"}}><Ico name="wa" size={16}/> WhatsApp</button>
            <button onClick={function(){setNota(sel);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,borderRadius:14,border:"1px solid "+T.cb,background:T.card,color:T.text,fontSize:13,fontWeight:700,cursor:"pointer"}}><Ico name="receipt" size={16}/> Nota</button>
          </div>
          {/* Customer */}
          <div style={{background:T.card,borderRadius:18,padding:20,marginBottom:12,border:"1px solid "+T.cb,animation:"fadeSlide .3s ease .05s both"}}>
            <div style={{fontSize:11,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>👤 Customer</div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:22,fontWeight:800,flexShrink:0}}>{(sel.namaCustomer||"?")[0].toUpperCase()}</div>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:T.text}}>{sel.namaCustomer}</div>
                <div style={{fontSize:14,color:T.ts,marginTop:2}}>{sel.noHP}</div>
                {sel.alamat && <div style={{fontSize:13,color:T.tm,marginTop:4,lineHeight:1.4}}>📍 {sel.alamat}</div>}
              </div>
            </div>
          </div>
          {/* Device */}
          <div style={{background:T.card,borderRadius:18,padding:20,marginBottom:12,border:"1px solid "+T.cb,animation:"fadeSlide .3s ease .1s both"}}>
            <div style={{fontSize:11,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>📱 Perangkat</div>
            {[["Merk & Tipe",sel.merkHP+" "+(sel.tipeHP||"")],["Warna",sel.warnaHP||"-"],["IMEI/SN",sel.imei||"-"],["Kondisi Fisik",sel.kondisi||"-"],["Kelengkapan",sel.kelengkapan||"-"],["Kerusakan",sel.kerusakan,"#EF4444"],["Keluhan",sel.keluhan||"-"],["Prioritas",(sel.prioritas||"Normal")],["Garansi",sel.garansi||"-"]].map(function(r,i){
              return <div key={i} style={{padding:"10px 0",borderBottom:i<8?"1px solid "+T.dv:"none"}}><div style={{fontSize:11,color:T.tm,fontWeight:700,marginBottom:3}}>{r[0]}</div><div style={{fontSize:15,fontWeight:600,color:r[2]||T.text,lineHeight:1.5}}>{r[1]}</div></div>;
            })}
          </div>
          {/* Finance */}
          <div style={{display:"flex",gap:10,marginBottom:16,animation:"fadeSlide .3s ease .15s both"}}>
            {[["Estimasi",rp(sel.biayaEstimasi),"#3B82F6"],["DP",rp(sel.uangMuka),"#10B981"],["Sisa",rp(sisa),"#EF4444"]].map(function(r,i){
              return <div key={i} style={{flex:1,background:T.card,borderRadius:16,padding:"14px 10px",border:"1px solid "+T.cb,textAlign:"center"}}><div style={{fontSize:10,color:T.tm,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>{r[0]}</div><div style={{fontSize:15,fontWeight:900,color:r[2]}}>{r[1]}</div></div>;
            })}
          </div>
          {/* Service Info */}
          <div style={{background:T.card,borderRadius:18,padding:20,marginBottom:16,border:"1px solid "+T.cb,animation:"fadeSlide .3s ease .2s both"}}>
            <div style={{fontSize:11,color:T.tm,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>🔧 Service Info</div>
            {[["Teknisi",sel.teknisi||"Belum ditentukan"],["Est. Selesai",sel.tglEstSelesai?fmt(sel.tglEstSelesai):"Belum ditentukan"],["Password/Pola","🔒 "+(sel.passwordHP||"Tidak ada")],["Catatan",sel.catatan||"Tidak ada catatan"]].map(function(r,i){
              return <div key={i} style={{padding:"10px 0",borderBottom:i<3?"1px solid "+T.dv:"none"}}><div style={{fontSize:11,color:T.tm,fontWeight:700,marginBottom:3}}>{r[0]}</div><div style={{fontSize:15,fontWeight:600,color:T.text,lineHeight:1.5}}>{r[1]}</div></div>;
            })}
          </div>
          {/* Actions */}
          <div style={{animation:"fadeSlide .3s ease .25s both"}}>
            {ns && <button onClick={function(){setModal({t:"Update ke "+ns+"?",m:"Status akan diubah: \""+sel.status+"\" → \""+ns+"\"",ok:function(){updStatus(sel,ns);},okT:"Ya, "+ns});}} style={{width:"100%",padding:16,borderRadius:16,border:"none",background:"linear-gradient(135deg,#3B82F6,#6366F1)",color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 20px rgba(59,130,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{(SMAP[ns]||{}).e} Lanjut ke {ns} <Ico name="chev" size={16}/></button>}
            {sel.status!=="Batal" && sel.status!=="Diambil" && <button onClick={function(){setModal({t:"Batalkan?",m:"Batalkan service "+sel.id+"?",ok:function(){updStatus(sel,"Batal");},okT:"Ya, Batalkan",danger:true});}} style={{width:"100%",padding:14,borderRadius:14,border:"1.5px solid #FECACA",background:"#FEF2F2",color:"#EF4444",fontSize:14,fontWeight:700,cursor:"pointer"}}>❌ Batalkan Service</button>}
          </div>
        </div>
        {nota && <Nota item={nota} onClose={function(){setNota(null);}} />}
        {modal && <Modal title={modal.t} msg={modal.m} onOk={modal.ok} onNo={function(){setModal(null);}} okText={modal.okT} danger={modal.danger} />}
        <Toast data={toast} />
      </div>
    );
  }

  // ═══ FORM ═══
  if (page==="form") {
    var stps = ["Customer","Perangkat","Kerusakan","Biaya"];
    return (
      <div style={base}>
        <style>{CSS_TEXT}</style>
        <div style={{background:T.hbg,color:"#fff",padding:"16px 20px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div onClick={function(){setPage("home");setTab("home");setStep(0);setErrs({});}} style={{cursor:"pointer",padding:6,borderRadius:10,background:"rgba(255,255,255,0.1)"}}><Ico name="back"/></div>
            <div style={{fontSize:18,fontWeight:800}}>Service Order Baru</div>
          </div>
          <div style={{display:"flex",gap:6}}>
            {stps.map(function(s,i){ return <div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:4,borderRadius:4,background:i<=step?"linear-gradient(90deg,#38BDF8,#818CF8)":"rgba(255,255,255,0.15)",transition:"all .3s",marginBottom:8}}/><div style={{fontSize:10,fontWeight:700,color:i<=step?"#F1F5F9":"#64748B"}}>{i+1}. {s}</div></div>; })}
          </div>
        </div>
        <div style={{padding:"24px 20px 120px"}}>
          {step===0 && <div style={{animation:"scaleIn .25s ease"}}>
            <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>👤 Info Customer</div>
            <div style={{fontSize:14,color:T.ts,marginBottom:24}}>Data pemilik perangkat</div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Nama Customer <span style={{color:"#EF4444"}}>*</span></label>
              <input style={inp("namaCustomer")} placeholder="cth: Ahmad Fadli" value={fd.namaCustomer} onChange={function(e){setFd(function(p){return Object.assign({},p,{namaCustomer:e.target.value});});}}/>
              {errs.namaCustomer && <div style={{fontSize:12,color:"#EF4444",marginTop:6,fontWeight:600}}>⚠️ {errs.namaCustomer}</div>}
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>No. HP <span style={{color:"#EF4444"}}>*</span></label>
              <input style={inp("noHP")} placeholder="08xxxxxxxxxx" type="tel" value={fd.noHP} onChange={function(e){setFd(function(p){return Object.assign({},p,{noHP:e.target.value});});}}/>
              {errs.noHP && <div style={{fontSize:12,color:"#EF4444",marginTop:6,fontWeight:600}}>⚠️ {errs.noHP}</div>}
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Alamat</label>
              <textarea style={Object.assign({},inp(""),{minHeight:70,resize:"vertical"})} placeholder="Alamat lengkap customer..." value={fd.alamat} onChange={function(e){setFd(function(p){return Object.assign({},p,{alamat:e.target.value});});}}/>
            </div>
          </div>}

          {step===1 && <div style={{animation:"scaleIn .25s ease"}}>
            <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>📱 Info Perangkat</div>
            <div style={{fontSize:14,color:T.ts,marginBottom:24}}>Detail HP yang diservis</div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Merk HP <span style={{color:"#EF4444"}}>*</span></label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {BRANDS.map(function(b){ return <div key={b} onClick={function(){setFd(function(p){return Object.assign({},p,{merkHP:b});});setErrs(function(e){var n=Object.assign({},e);delete n.merkHP;return n;});}} style={{padding:"10px 16px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:fd.merkHP===b?"linear-gradient(135deg,#3B82F6,#6366F1)":dark?"#1E293B":"#F1F5F9",color:fd.merkHP===b?"#fff":"#475569",boxShadow:fd.merkHP===b?"0 4px 12px rgba(59,130,246,0.25)":"none"}}>{b==="iPhone"?"🍎 ":b==="Samsung"?"📱 ":""}{b}</div>; })}
              </div>
              {errs.merkHP && <div style={{fontSize:12,color:"#EF4444",marginTop:8,fontWeight:600}}>⚠️ {errs.merkHP}</div>}
            </div>
            <div style={{display:"flex",gap:12,marginBottom:18}}>
              <div style={{flex:1}}>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Tipe HP</label>
                <input style={inp("")} placeholder="cth: Galaxy A54" value={fd.tipeHP} onChange={function(e){setFd(function(p){return Object.assign({},p,{tipeHP:e.target.value});});}}/>
              </div>
              <div style={{flex:1}}>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Warna HP</label>
                <select style={Object.assign({},inp(""),{appearance:"auto"})} value={fd.warnaHP} onChange={function(e){setFd(function(p){return Object.assign({},p,{warnaHP:e.target.value});});}}>
                  <option value="">Pilih warna</option>
                  {COLORS.map(function(c){return <option key={c} value={c}>{c}</option>;})}
                </select>
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>IMEI / Serial Number</label>
              <input style={inp("")} placeholder="cth: 354678091234567" value={fd.imei} onChange={function(e){setFd(function(p){return Object.assign({},p,{imei:e.target.value});});}}/>
              <div style={{fontSize:11,color:T.tm,marginTop:4}}>Dial *#06# untuk cek IMEI</div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Kondisi Fisik</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {KONDISI.map(function(k){ return <div key={k} onClick={function(){setFd(function(p){return Object.assign({},p,{kondisi:k});});}} style={{padding:"10px 16px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:fd.kondisi===k?"linear-gradient(135deg,#8B5CF6,#6366F1)":dark?"#1E293B":"#F5F3FF",color:fd.kondisi===k?"#fff":"#7C3AED",boxShadow:fd.kondisi===k?"0 4px 12px rgba(139,92,246,0.25)":"none"}}>{k}</div>; })}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Kelengkapan Diterima</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {KELENGKAPAN.map(function(k){ var sel2 = (fd.kelengkapan||[]).indexOf(k) >= 0; return <div key={k} onClick={function(){setFd(function(p){var arr = p.kelengkapan||[]; var nxt = sel2 ? arr.filter(function(x){return x!==k;}) : arr.concat([k]); return Object.assign({},p,{kelengkapan:nxt});});}} style={{padding:"10px 16px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:sel2?"linear-gradient(135deg,#10B981,#059669)":dark?"#1E293B":"#ECFDF5",color:sel2?"#fff":"#059669",boxShadow:sel2?"0 4px 12px rgba(16,185,129,0.25)":"none",display:"flex",alignItems:"center",gap:4}}>{sel2?"✓ ":""}{k}</div>; })}
              </div>
              <div style={{fontSize:11,color:T.tm,marginTop:6}}>Tap untuk centang/uncentang. Dipilih: {(fd.kelengkapan||[]).length} item</div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Password / Pola Kunci</label>
              <input style={inp("")} placeholder="Opsional, untuk keperluan testing" value={fd.passwordHP} onChange={function(e){setFd(function(p){return Object.assign({},p,{passwordHP:e.target.value});});}}/>
              <div style={{fontSize:11,color:T.tm,marginTop:4}}>🔒 Info ini hanya untuk teknisi, tidak dibagikan</div>
            </div>
          </div>}

          {step===2 && <div style={{animation:"scaleIn .25s ease"}}>
            <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>🔧 Kerusakan & Prioritas</div>
            <div style={{fontSize:14,color:T.ts,marginBottom:24}}>Detail masalah perangkat</div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Kerusakan <span style={{color:"#EF4444"}}>*</span></label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {DAMAGES.map(function(d){ return <div key={d} onClick={function(){setFd(function(p){return Object.assign({},p,{kerusakan:d});});setErrs(function(e){var n=Object.assign({},e);delete n.kerusakan;return n;});}} style={{padding:"10px 16px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:fd.kerusakan===d?"linear-gradient(135deg,#EF4444,#F97316)":dark?"#1E293B":"#FEF2F2",color:fd.kerusakan===d?"#fff":"#DC2626",boxShadow:fd.kerusakan===d?"0 4px 12px rgba(239,68,68,0.25)":"none"}}>{d}</div>; })}
              </div>
              {errs.kerusakan && <div style={{fontSize:12,color:"#EF4444",marginTop:8,fontWeight:600}}>⚠️ {errs.kerusakan}</div>}
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Keluhan Detail</label>
              <textarea style={Object.assign({},inp(""),{minHeight:90,resize:"vertical"})} placeholder="Deskripsikan keluhan customer secara detail..." value={fd.keluhan} onChange={function(e){setFd(function(p){return Object.assign({},p,{keluhan:e.target.value});});}}/>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Prioritas Service</label>
              <div style={{display:"flex",gap:10}}>
                {PRIORITAS.map(function(pr){ return <div key={pr.v} onClick={function(){setFd(function(p){return Object.assign({},p,{prioritas:pr.v});});}} style={{flex:1,padding:"14px 10px",borderRadius:14,textAlign:"center",cursor:"pointer",background:fd.prioritas===pr.v?"linear-gradient(135deg,"+pr.c+","+pr.c+"CC)":dark?"#1E293B":"#F1F5F9",color:fd.prioritas===pr.v?"#fff":pr.c,fontWeight:800,fontSize:14,boxShadow:fd.prioritas===pr.v?"0 4px 12px "+pr.c+"40":"none",border:fd.prioritas===pr.v?"none":"2px solid "+pr.c+"20"}}><div style={{fontSize:20,marginBottom:4}}>{pr.e}</div>{pr.v}</div>; })}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Masih Garansi?</label>
              <div style={{display:"flex",gap:10}}>
                {["Ya","Tidak"].map(function(g){ return <div key={g} onClick={function(){setFd(function(p){return Object.assign({},p,{garansi:g});});}} style={{flex:1,padding:"12px",borderRadius:12,textAlign:"center",cursor:"pointer",background:fd.garansi===g?(g==="Ya"?"linear-gradient(135deg,#10B981,#059669)":"linear-gradient(135deg,#EF4444,#DC2626)"):dark?"#1E293B":"#F1F5F9",color:fd.garansi===g?"#fff":T.ts,fontWeight:700,fontSize:14}}>{g==="Ya"?"✅ Ya, Masih":"❌ Tidak"}</div>; })}
              </div>
            </div>
          </div>}

          {step===3 && <div style={{animation:"scaleIn .25s ease"}}>
            <div style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>💰 Biaya & Penugasan</div>
            <div style={{fontSize:14,color:T.ts,marginBottom:24}}>Estimasi biaya, teknisi, dan jadwal</div>
            <div style={{display:"flex",gap:12,marginBottom:18}}>
              <div style={{flex:1}}><label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Estimasi Biaya</label><input style={inp("")} placeholder="0" type="number" value={fd.biayaEstimasi} onChange={function(e){setFd(function(p){return Object.assign({},p,{biayaEstimasi:e.target.value});});}}/></div>
              <div style={{flex:1}}><label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Uang Muka (DP)</label><input style={inp("")} placeholder="0" type="number" value={fd.uangMuka} onChange={function(e){setFd(function(p){return Object.assign({},p,{uangMuka:e.target.value});});}}/></div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Teknisi</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {TEKNISI_LIST.map(function(t){ return <div key={t} onClick={function(){setFd(function(p){return Object.assign({},p,{teknisi:t});});}} style={{padding:"10px 16px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:fd.teknisi===t?"linear-gradient(135deg,#3B82F6,#6366F1)":dark?"#1E293B":"#EFF6FF",color:fd.teknisi===t?"#fff":"#3B82F6",boxShadow:fd.teknisi===t?"0 4px 12px rgba(59,130,246,0.25)":"none",display:"flex",alignItems:"center",gap:4}}>{fd.teknisi===t?"✓ ":""}🧑‍🔧 {t}</div>; })}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Estimasi Tanggal Selesai</label>
              <input style={inp("")} type="date" value={fd.tglEstSelesai} onChange={function(e){setFd(function(p){return Object.assign({},p,{tglEstSelesai:e.target.value});});}}/>
            </div>
            <div style={{marginBottom:18}}><label style={{display:"block",fontSize:13,fontWeight:700,color:T.ts,marginBottom:8}}>Catatan Internal</label><textarea style={Object.assign({},inp(""),{minHeight:80,resize:"vertical"})} placeholder="Catatan untuk teknisi..." value={fd.catatan} onChange={function(e){setFd(function(p){return Object.assign({},p,{catatan:e.target.value});});}}/></div>
            <div style={{background:dark?"#0F172A":"#F8FAFC",borderRadius:16,padding:18,marginBottom:20,border:"1.5px dashed "+T.cb}}>
              <div style={{fontSize:12,fontWeight:800,color:T.tm,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>📋 Ringkasan Order</div>
              {[["Customer",fd.namaCustomer],["No. HP",fd.noHP],["Alamat",fd.alamat],["HP",fd.merkHP+" "+(fd.tipeHP||"")+" "+(fd.warnaHP||"")],["IMEI",fd.imei],["Kondisi",fd.kondisi],["Kelengkapan",(fd.kelengkapan||[]).join(", ")],["Kerusakan",fd.kerusakan],["Prioritas",fd.prioritas],["Garansi",fd.garansi],["Teknisi",fd.teknisi],["Est. Selesai",fd.tglEstSelesai?fmt(fd.tglEstSelesai):"-"],["Estimasi",rp(fd.biayaEstimasi||0)],["DP",rp(fd.uangMuka||0)]].map(function(r,i){ return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span style={{color:T.tm}}>{r[0]}</span><span style={{fontWeight:700,color:T.text,textAlign:"right",maxWidth:"60%",overflow:"hidden",textOverflow:"ellipsis"}}>{r[1]||"-"}</span></div>; })}
            </div>
          </div>}

          <div style={{display:"flex",gap:12,marginTop:8}}>
            {step>0 && <button onClick={function(){setStep(function(s){return Math.max(0,s-1);});}} style={{flex:1,padding:16,borderRadius:16,border:"1.5px solid "+T.cb,background:"transparent",color:T.ts,fontSize:15,fontWeight:700,cursor:"pointer"}}>← Kembali</button>}
            {step<3
              ? <button onClick={function(){if(validate(step))setStep(function(s){return s+1;});}} style={{flex:2,padding:16,borderRadius:16,border:"none",background:"linear-gradient(135deg,#3B82F6,#6366F1)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 20px rgba(59,130,246,0.3)"}}>Lanjut →</button>
              : <button onClick={submitForm} disabled={loading} style={{flex:2,padding:16,borderRadius:16,border:"none",background:"linear-gradient(135deg,#10B981,#059669)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 20px rgba(16,185,129,0.3)",opacity:loading?0.7:1}}>{loading?"⏳ Menyimpan...":"✅ Simpan"}</button>
            }
          </div>
        </div>
        <Toast data={toast} />
      </div>
    );
  }

  // ═══ HOME ═══
  return (
    <div style={Object.assign({},base,{position:"relative"})}>
      <style>{CSS_TEXT}</style>
      {/* Header */}
      <div style={{background:T.hbg,color:"#fff",padding:"16px 20px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-80,right:-80,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.12),transparent 70%)"}} />
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,position:"relative",zIndex:1}}>
          <div style={{width:52,height:44,borderRadius:12,overflow:"hidden",boxShadow:"0 4px 15px rgba(56,189,248,0.35)",flexShrink:0,border:"1px solid rgba(56,189,248,0.3)"}}>
            <img src={logo} alt="MAX" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:19,fontWeight:900,letterSpacing:"0.5px"}}>MAX MOBILE</div>
            <div style={{fontSize:10,color:"#94A3B8",fontWeight:700,letterSpacing:"1.3px",textTransform:"uppercase"}}>Apple &amp; Android Service</div>
          </div>
          <div onClick={function(){setDark(!dark);}} style={{cursor:"pointer",padding:8,borderRadius:10,background:"rgba(255,255,255,0.08)"}}><Ico name={dark?"sun":"moon"}/></div>
          <div onClick={function(){fetchData(true);}} style={{cursor:"pointer",padding:8,borderRadius:10,background:"rgba(255,255,255,0.08)",animation:spinning?"spin 1s linear infinite":"none"}}><Ico name="refresh"/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,position:"relative",zIndex:1}}>
          {[[stats.total,"Total","#F1F5F9"],[stats.proses,"Proses","#FBBF24"],[stats.selesai,"Selesai","#34D399"],[stats.hari,"Hari Ini","#38BDF8"]].map(function(r,i){
            return <div key={i} style={{background:"rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)"}}><div style={{fontSize:24,fontWeight:900,color:r[2]}}>{r[0]}</div><div style={{fontSize:10,color:"#94A3B8",marginTop:2,textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:700}}>{r[1]}</div></div>;
          })}
        </div>
        {stats.rev > 0 && <div style={{marginTop:10,padding:"10px 14px",background:"rgba(16,185,129,0.1)",borderRadius:12,display:"flex",alignItems:"center",gap:8,position:"relative",zIndex:1}}><span style={{fontSize:14}}>💰</span><span style={{fontSize:12,color:"#34D399",fontWeight:700}}>Pendapatan: {rp(stats.rev)}</span></div>}
      </div>

      <div style={{padding:"14px 16px 110px"}}>
        {/* Search */}
        <div style={{display:"flex",alignItems:"center",gap:10,background:T.card,borderRadius:16,padding:"12px 16px",marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",border:"1px solid "+T.cb}}>
          <span style={{color:T.tm}}><Ico name="search" size={18}/></span>
          <input style={{border:"none",outline:"none",flex:1,fontSize:15,color:T.text,background:"transparent",fontFamily:"inherit"}} placeholder="Cari nama, ID, merk, no HP..." value={search} onChange={function(e){setSearch(e.target.value);}}/>
          {search && <span onClick={function(){setSearch("");}} style={{cursor:"pointer",color:T.tm,fontSize:18,fontWeight:800,padding:"0 4px"}}>✕</span>}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:12,marginBottom:4}}>
          {["Semua","Diterima","Diagnosa","Proses","Selesai","Diambil","Batal"].map(function(s){
            var cnt = s==="Semua" ? data.length : data.filter(function(d){return d.status===s;}).length;
            var act = filter===s;
            var sm = SMAP[s] || {};
            return <div key={s} onClick={function(){setFilter(s);}} style={{padding:"8px 14px",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4,flexShrink:0,background:act?(s==="Semua"?"linear-gradient(135deg,#3B82F6,#6366F1)":sm.bg||"#F1F5F9"):dark?"#1E293B":"#F1F5F9",color:act?(s==="Semua"?"#fff":sm.c||"#475569"):T.tm,boxShadow:act&&s==="Semua"?"0 2px 8px rgba(59,130,246,0.2)":"none",border:act&&s!=="Semua"?"1.5px solid "+(sm.c||"")+"33":"1.5px solid transparent"}}>{s!=="Semua"&&<span style={{fontSize:11}}>{sm.e}</span>}{s}{cnt>0&&<span style={{fontSize:10,opacity:0.7}}>({cnt})</span>}</div>;
          })}
        </div>

        {/* List */}
        {loading && !data.length ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}><div style={{width:40,height:40,borderRadius:"50%",border:"3px solid #E2E8F0",borderTopColor:"#3B82F6",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}/><div style={{fontSize:15,fontWeight:600,color:T.ts}}>Memuat data...</div></div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:56,marginBottom:12}}>{search?"🔍":"📱"}</div><div style={{fontSize:17,fontWeight:800,color:T.text,marginBottom:4}}>{search?"Tidak ditemukan":"Belum ada data"}</div><div style={{fontSize:14,color:T.ts}}>{search ? "Tidak ada hasil untuk \""+search+"\"" : "Tap + untuk menambah service order baru"}</div>{search && <button onClick={function(){setSearch("");}} style={{marginTop:16,padding:"10px 24px",borderRadius:12,border:"none",background:"#3B82F6",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>Reset</button>}</div>
        ) : filtered.map(function(item, idx) {
          var st = SMAP[item.status] || SMAP.Diterima;
          return (
            <div key={item.id || idx} className="chover" onClick={function(){setSel(item);setPage("detail");}} style={{background:T.card,borderRadius:18,padding:16,marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.03)",border:"1px solid "+T.cb,cursor:"pointer",transition:"all .15s",animation:"fadeSlide .3s ease "+(idx*0.04)+"s both"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,"+st.c+"20,"+st.c+"10)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:"2px solid "+st.c+"20"}}><Ico name={item.merkHP==="iPhone"?"apple":"android"} size={22}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:16,fontWeight:800,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.namaCustomer}</div>
                      <div style={{fontSize:12,color:T.tm,fontWeight:600,marginTop:1}}>{item.id} • {item.merkHP} {item.tipeHP||""}</div>
                    </div>
                    <Badge status={item.status} />
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px solid "+T.dv}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,fontSize:12,fontWeight:700,background:dark?"#1E293B":"#FEF2F2",color:"#EF4444"}}>🔧 {item.kerusakan}</span>
                    <span style={{fontSize:12,color:T.tm,display:"flex",alignItems:"center",gap:4,fontWeight:600}}><Ico name="clock" size={13}/> {fmt(item.tanggalMasuk)}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,flexWrap:"wrap"}}>
                    {Number(item.biayaEstimasi) > 0 && <span style={{fontSize:12,fontWeight:800,color:"#3B82F6"}}>{rp(item.biayaEstimasi)}</span>}
                    {item.prioritas && item.prioritas !== "Normal" && <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:6,background:item.prioritas==="Express"?"#FEF2F2":"#FFFBEB",color:item.prioritas==="Express"?"#EF4444":"#F59E0B"}}>{item.prioritas==="Express"?"🔴":"🟡"} {item.prioritas}</span>}
                    {item.garansi === "Ya" && <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:6,background:"#ECFDF5",color:"#10B981"}}>✅ Garansi</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button onClick={function(){setPage("form");setTab("add");setStep(0);setErrs({});}} style={{position:"fixed",bottom:88,right:"calc(50% - 210px)",width:60,height:60,borderRadius:20,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(59,130,246,0.4)",cursor:"pointer",zIndex:99,border:"none"}}><Ico name="plus" size={26}/></button>

      {/* Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:T.card,display:"flex",justifyContent:"space-around",padding:"10px 0 14px",borderTop:"1px solid "+T.cb,zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,0.04)"}}>
        {[["home","Beranda","home"],["list","Daftar","list"],null,["stats","Laporan","receipt"],["more","Lainnya","settings"]].map(function(item, i) {
          if (!item) return <div key={i} style={{width:60}} />;
          var act = tab === item[0];
          return (
            <div key={i} onClick={function(){setTab(item[0]);setPage("home");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 14px",cursor:"pointer",color:act?"#3B82F6":T.tm}}>
              <div style={{transform:act?"scale(1.15)":"scale(1)",transition:"transform .2s"}}><Ico name={item[2]} size={act?24:22}/></div>
              <span style={{fontSize:10,fontWeight:act?800:600}}>{item[1]}</span>
              {act && <div style={{width:4,height:4,borderRadius:"50%",background:"#3B82F6",marginTop:-1}} />}
            </div>
          );
        })}
      </div>

      {nota && <Nota item={nota} onClose={function(){setNota(null);}} />}
      {modal && <Modal title={modal.t} msg={modal.m} onOk={modal.ok} onNo={function(){setModal(null);}} okText={modal.okT} danger={modal.danger} />}
      <Toast data={toast} />
    </div>
  );
}
