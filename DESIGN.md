# VeloceOps Design System v5.0 — "Warm Fintech & Inset Frame"
**Archetype:** Ramp $\times$ Attio $\times$ Linear (Warm Alabaster `#F2F2EE` + Inset Rounded Canvas `#FFFFFF` + Deep Charcoal `#121316` + Signature Volt Lime `#D4F338`)  
**Audit Verification:** Passed `impeccable detect --json` with **0 warnings / Exit Code 0**  
**Target Stack:** Next.js 15 (App Router) + Tailwind CSS + shadcn/ui + Supabase RLS  

---

## 1. Konsep Desain: Mengapa V5 Terasa Modern, Bersih, dan Tidak "AI"

1. **Tata Letak "Inset App Frame" (Linear & Attio Style):**
   - Tidak ada lagi sidebar hitam tebal yang menempel kaku di tepi layar atau floating dock hitam yang menutupi bagian bawah layar.
   - Background luar (*outer shell*) menggunakan warna hangat Alabaster (`#F2F2EE`). Sidebar kiri menyatu secara natural di atas kanvas luar (`248px`), sementara area kerja utama berbentuk **1 kanvas putih membulat (`border-radius: 20px`, `border: 1px solid #E2E2DC`, `box-shadow: 0 2px 12px rgba(18,19,22,0.03)`)** yang sangat lega dan elegan.
   - Pengalih Tenant (*RLS Isolation*) dan RBAC Role disatukan rapi di header atas kanvas, menjaga bagian bawah layar tetap bersih 100%.

2. **Tipografi Bersih & Tajam (Bebas dari Huruf Lekukan Aneh):**
   - Menggantikan *Bricolage Grotesque* dengan kombinasi **`Satoshi`** / **`General Sans`** (font geometric sans berkarakter bersih & modern ala fintech kelas dunia) dan **`IBM Plex Mono`** untuk angka akuntansi GAAP yang presisi (`tabular-nums`).

3. **Palet Warna "Warm Fintech & Volt Lime" (Ramp / Wise / Brex):**
   - Tidak lagi menggunakan biru dongker pekat (`#0B1623`) yang gloomy atau warna rumah sakit.
   - Menggunakan teks utama **Deep Charcoal (`#121316`)** dengan rasio kontras tinggi **18.1:1**, dipadukan dengan aksen khas **Ramp Volt Lime (`#D4F338`)** untuk tombol aksi utama, serta **Botanical Emerald (`#0B6B41`)** untuk status transaksi settled.

4. **Struktur Master-Detail Asimetris:**
   - **Baris 1:** Strip metrik keuangan 4-kolom yang lapang (Operating Cash, Receivables, Monthly Burn & Runway, Net ARR).
   - **Baris 2:** Master-detail split:
     - Sisi Kiri (`1.48fr`): Grafik Cashflow Velocity yang dinamis + Tabel Piutang & Stripe Sub-ledger interaktif.
     - Sisi Kanan (`1fr`): Panel Inspektor Kontekstual dengan toggle segmented: **[ Invoice Preview ]** (menampilkan lembar invoice komersial riil) dan **[ AI CFO Copilot (2) ]** (anomali spend & eskalasi piutang).

---

## 2. Color Tokens & Contrast Matrix

```css
:root {
  /* Surfaces & Frame */
  --bg-shell: #F2F2EE;          /* Outer Frame & Sidebar Backdrop */
  --bg-canvas: #FFFFFF;         /* Inset Rounded Main Workspace Canvas */
  --bg-subtle: #F8F8F5;         /* Soft Warm Table Headers & Panels */
  --bg-recessed: #EAEAE4;       /* Segmented Tab & Progress Tracks */
  --bg-hover: #F4F4F0;          /* Interactive Row Hover */

  /* High-Contrast Typography Ink */
  --ink: #121316;               /* Deep Charcoal (18.1:1 contrast — AAA) */
  --ink-secondary: #434642;     /* Warm Slate Body (9.3:1 contrast — AAA) */
  --ink-tertiary: #5C605A;      /* Muted Labels & Captions (6.2:1 contrast — AA) */

  /* Hairlines & Borders */
  --border-canvas: #E2E2DC;     /* Inset Canvas Border */
  --border-hairline: #EBEBE6;   /* Internal Table & Grid Dividers */
  --border-strong: #D0D0C8;     /* Form Input Borders */

  /* Signature Ramp Volt Lime (Paired with #121316 = 14.2:1 contrast) */
  --volt: #D4F338;              /* Primary Action Surface */
  --volt-hover: #C5E627;
  --volt-border: #B5D618;

  /* Semantic Status Tokens */
  --emerald: #0B6B41;           /* Settled / Paid Ink (6.8:1) */
  --emerald-bg: #E6F6EE;
  --emerald-border: #A5DFC3;

  --coral: #B91C1C;             /* Overdue / Cap Alert Ink (6.4:1) */
  --coral-bg: #FEE2E2;
  --coral-border: #FCA5A5;

  --amber: #8C4608;             /* Pending / Review Ink (6.9:1) */
  --amber-bg: #FEF3C7;
  --amber-border: #FCD34D;
}
```

---

## 3. Typography Hierarchy

```html
<!-- Font Imports -->
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&f[]=general-sans@500,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400,500,600&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Level | Penggunaan | Font Family | Size & Weight |
| :--- | :--- | :--- | :--- |
| **Hero Balance** | Operating Cash Balance (`$148,920.00`) | `General Sans` / `Satoshi` | `34px` / `600`, letter-spacing `-0.03em` |
| **Sub-Metrics** | AR, Burn, ARR Figures | `General Sans` / `Satoshi` | `26px` / `600`, letter-spacing `-0.025em` |
| **Section Headings** | Judul Blok & Panel | `General Sans` / `Satoshi` | `16px` / `600` |
| **Body & Labels** | Teks Antarmuka & Deskripsi | `Satoshi` / `Instrument Sans` | `13px–14px` / `500` |
| **Tabular Numbers** | Invoice ID, Saldo, Tanggal, Kode SQL | `IBM Plex Mono` | `12px–14px` / `500` (`tabular-nums`) |
| **Caption Floor** | Header Kolom, Status Badge, Kbd Pills | `Satoshi` / `IBM Plex Mono` | **`12px` (Batas Minimum Mutlak)** |

---

## 4. Status Indicators (Bebas dari "Candy Capsule Pills")

- **Banned:** Dilarang menggunakan badge/pill capsule dengan background berwarna tebal dan border rounded penuh (`border-radius: 999px; background: #e6f6ee; border: 1px solid #a5dfc3`). Pola ini membuat antarmuka terlihat seperti template AI murahan atau stiker mainan.
- **Modern Dot Indicator:** Gunakan titik 6px bersih (`●`) dengan tipografi natural:
  - **Settled / Paid:** `<span class="status-dot-cell"><span class="dot-emerald"></span> Paid</span>`
  - **Overdue:** `<span class="status-dot-cell"><span class="dot-coral"></span> Overdue</span>`
  - **Pending:** `<span class="status-dot-cell"><span class="dot-amber"></span> Pending</span>`
- **Environment Status:** Tampilkan teks bersih tanpa kapsul: `Protected by RLS • acme_01 (OWNER)`.
