# VeloceOps — Master Developer Sprint Backlog & Execution Guide
**Target Timeline:** 3–4 Weeks (4 Sprints)  
**Assigned Developer:** 1 Full-Stack Developer + AI Coding Workflow  
**Project Lead / Client Representative:** Hanif Daffa N.  
**Tech Stack:** Next.js 15 (App Router, Server Components & Server Actions) + TypeScript + Tailwind CSS v4 + shadcn/ui + Supabase (PostgreSQL 16, Auth, RLS, Storage) + Stripe Webhooks + pgvector + Zod  
**Design Reference:** [veloceops-ui-design-reference.html](file:///Users/lala/Documents/upwork_ulil/veloceops-ui-design-reference.html) | [DESIGNSYSTEM_VeloceOps.md](file:///Users/lala/Documents/upwork_ulil/DESIGNSYSTEM_VeloceOps.md) | [veloceops-theme.json](file:///Users/lala/Documents/upwork_ulil/veloceops-theme.json)  

---

## 0. Aturan Inti Pengembangan (Core Engineering Rules)

Developer wajib mematuhi 4 aturan emas berikut di setiap commit & PR:

1. **Migration-First Rule (Dilarang Klik Manual di Dashboard Supabase):**
   - Semua pembuatan tabel, kolom, index, dan RLS policy wajib ditulis sebagai file migrasi di folder `supabase/migrations/*.sql`.
   - Diuji secara lokal via `npx supabase db reset` sebelum commit.
2. **Strict Multi-Tenant Row-Level Security (RLS):**
   - Seluruh tabel bisnis (`invoices`, `invoice_items`, `ledger_entries`, `budget_caps`) wajib mengaktifkan `ENABLE ROW LEVEL SECURITY`.
   - Query wajib difilter via PostgreSQL engine: `USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)`.
3. **Idempotent Webhook Handling:**
   - Webhook Stripe tidak boleh memproses event duplikat. Wajib mencatat `event_id` ke dalam tabel `processed_events` menggunakan transaksi database.
4. **Presisi Desain (Zero Bubble Pills / Clean Dot Indicators):**
   - Tidak boleh menggunakan badge kapsul/pill murahan dengan background tebal dan border rounded penuh.
   - Wajib mengikuti sistem *Inset App Frame* (`20px` radius pada kanvas kerja utama) dan status *Clean Dot Indicator* (titik 6px + teks netral).

---

## Sprint 1: Arsitektur, Multi-Tenant Database & RLS Auth Isolation
**Durasi:** Hari 1 – Hari 5  
**Tujuan Sprint:** Menyiapkan repositori Next.js 15, konfigurasi token desain (Satoshi & IBM Plex Mono), serta suite migrasi database Supabase lengkap dengan RLS multi-tenant dan data seed awal.

### Task Breakdown & GitHub Issues:

#### `TICK-001`: Inisialisasi Proyek Next.js 15 & Token Desain
- **Tugas:**
  - Setup Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.
  - Impor font `Satoshi` & `General Sans` (Fontshare) dan `IBM Plex Mono` (Google Fonts).
  - Setup konfigurasi token warna Warm Fintech di `globals.css`:
    - Canvas: `#FFFFFF`, Shell: `#F2F2EE`, Ink: `#121316`, Volt: `#D4F338`.
- **Acceptance Criteria:**
  - `npm run dev` berjalan tanpa warning.
  - Font dan variabel CSS ter-render sesuai [veloceops-theme.json](file:///Users/lala/Documents/upwork_ulil/veloceops-theme.json).

#### `TICK-002`: Skema Database Inti (`supabase/migrations/20261024000001_core_schema.sql`)
- **Tugas:**
  - Buat file migrasi SQL pertama untuk tabel-tabel inti:
    1. `public.tenants` (`id`, `slug`, `name`, `currency`, `created_at`)
    2. `public.tenant_users` (`id`, `tenant_id`, `user_id`, `role`, `created_at`)
    3. `public.invoices` (`id`, `tenant_id`, `invoice_number`, `customer_name`, `customer_email`, `payment_method`, `issued_date`, `due_date`, `status`, `total_amount`, `currency`)
    4. `public.invoice_items` (`id`, `invoice_id`, `tenant_id`, `description`, `quantity`, `unit_price`, `total_price`)
    5. `public.ledger_entries` (`id`, `tenant_id`, `account_code`, `account_name`, `entry_type`, `amount`, `created_at`)
    6. `public.budget_caps` (`id`, `tenant_id`, `department`, `cap_amount`, `current_spend`, `period`)
    7. `public.processed_events` (`event_id`, `event_type`, `processed_at`)
- **Acceptance Criteria:**
  - File migrasi tereksekusi tanpa error saat `npx supabase db push`.

#### `TICK-003`: Konfigurasi PostgreSQL Row-Level Security (RLS) & RBAC Guard
- **Tugas:**
  - Terapkan policy RLS pada seluruh tabel:
    ```sql
    ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "tenant_isolation_invoices" ON public.invoices
    FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
    ```
  - Buat helper function untuk validasi role (`OWNER`, `FINANCE`, `VIEWER`).
- **Acceptance Criteria:**
  - Query database dengan token Tenant A mengembalikan 0 baris data milik Tenant B.

#### `TICK-004`: Suite Data Seed Awal (`supabase/seed.sql`)
- **Tugas:**
  - Buat data seed dummy untuk 3 tenant yang telah divalidasi:
    1. **Acme Cloud Inc. (USD):** 5 invoices (`INV-2026-092`, `INV-2026-091`, dst.), saldo kas $148,920.
    2. **Nova Logistics GmbH (EUR):** 3 invoices, saldo kas €284,500.
    3. **Kinetix AI Labs (GBP):** 2 invoices, saldo kas £92,400.
- **Acceptance Criteria:**
  - Menjalankan `npx supabase db reset` otomatis menginputkan seluruh data seed dengan bersih.

---

## Sprint 2: Inset Frame Layout, Treasury Engine & Smart Invoicing Studio
**Durasi:** Hari 6 – Hari 10  
**Tujuan Sprint:** Membangun tata letak *Inset App Frame* (Linear/Attio style), strip metrik 4-kolom, grafik kecepatan arus kas dinamis, dan sub-ledger piutang dengan inspektor dokumen invoice interaktif.

### Task Breakdown & GitHub Issues:

#### `TICK-005`: Shell Tata Letak Inset App Frame (`components/layout/`)
- **Tugas:**
  - Buat komponen `AppFrame` dengan sidebar kiri menyatu di atas background shell (`#F2F2EE`).
  - Buat kanvas kerja utama putih membulat (`border-radius: 20px`, `border: 1px solid #E2E2DC`).
  - Buat `CanvasHeader` dengan indikator status minimalis:
    - `● Protected by RLS • acme_01 (OWNER)` (tanpa badge kapsul bubble!).
    - Pengalih Tenant & Role yang terintegrasi di header.
- **Acceptance Criteria:**
  - Tampilan 100% presisi dengan [veloceops-ui-design-reference.html](file:///Users/lala/Documents/upwork_ulil/veloceops-ui-design-reference.html).
  - Bagian bawah layar bersih (tidak ada floating bar yang menutupi).

#### `TICK-006`: Strip Metrik Keuangan 4-Kolom & Grafik Arus Kas
- **Tugas:**
  - Buat komponen `MetricStrip`:
    - Kolom 1: Operating Cash Balance (`$148,920.00`)
    - Kolom 2: Accounts Receivable (`$31,450.00`)
    - Kolom 3: Monthly Burn & Runway (`$42,380.00`, 14.2 Mos)
    - Kolom 4: Net ARR (`$528,000.00`, 109.4% NRR)
  - Buat komponen `CashflowChart` dengan SVG/Recharts:
    - Bar inflow/outflow + garis kurva likuiditas.
    - Segmented control periode (`30D`, `90D`, `12M`).
- **Acceptance Criteria:**
  - Data metrik terhitung secara akurat dari sub-ledger database Supabase.
  - Range periode `30D / 90D / 12M` merespons klik dengan halus.

#### `TICK-007`: Sub-Ledger Piutang & Live Invoice Paper Inspector
- **Tugas:**
  - Buat tabel master transaksi piutang dengan avatar inisial brand klien (`ST`, `VC`, `LO`, `SB`, `RT`).
  - Implementasikan *Clean Dot Status Indicator* (`● Paid`, `● Overdue`, `● Pending`).
  - Buat panel detail kanan `InvoicePaper`:
    - Mengklik baris invoice di tabel sebelah kiri akan langsung memperbarui tampilan lembar invoice di sebelah kanan (ID, rincian line items, total amount, dan timeline verifikasi webhook).
- **Acceptance Criteria:**
  - Pemilihan baris tabel responsif tanpa lag.
  - Lembar preview invoice di sebelah kanan mencerminkan data aktual invoice terpilih.

#### `TICK-008`: Form Drawer Penerbitan Invoice Baru (`actions/invoices.ts`)
- **Tugas:**
  - Buat Server Action `createInvoiceAction` dengan validasi schema Zod.
  - Implementasikan slide-over modal drawer untuk input customer, amount, dan line items.
  - Simpan invoice baru ke Supabase dan mutasikan saldo piutang secara reaktif.
- **Acceptance Criteria:**
  - Form menolak input tidak valid (misal: nominal negatif, nama kosong).
  - Invoice baru langsung muncul di tabel teratas dan dihitung dalam total sub-ledger.

---

## Sprint 3: Stripe Idempotent Webhook Engine & AI CFO Copilot
**Durasi:** Hari 11 – Hari 16  
**Tujuan Sprint:** Mengimplementasikan endpoint webhook Stripe yang terverifikasi dan idempoten, rekonsiliasi otomatis saldo kas, serta AI CFO Copilot untuk deteksi anomali pengeluaran dan eskalasi piutang.

### Task Breakdown & GitHub Issues:

#### `TICK-009`: Endpoint Webhook Stripe Idempoten (`app/api/webhooks/stripe/route.ts`)
- **Tugas:**
  - Validasi signature webhook via `stripe.webhooks.constructEvent`.
  - Cek tabel `processed_events` sebelum mengeksekusi payload:
    - Jika `event_id` sudah ada $\rightarrow$ kembalikan response `200 OK` (skip processing).
    - Jika belum ada $\rightarrow$ insert `event_id` dan proses status invoice.
- **Acceptance Criteria:**
  - Pengiriman ulang event webhook Stripe yang sama 5x berturut-turut hanya memutasi database 1x.

#### `TICK-010`: Engine Rekonsiliasi Otomatis (Ledger Cash Increment)
- **Tugas:**
  - Saat event `invoice.paid` diterima:
    1. Update status invoice menjadi `PAID`.
    2. Kurangi saldo piutang (*Accounts Receivable*).
    3. Tambah saldo kas (*Operating Liquidity*) via entri transaksi ledger baru.
    4. Catat event log ke `audit_logs`.
- **Acceptance Criteria:**
  - Menekan tombol "Simulate Webhook" langsung memperbarui saldo kas dan mengubah status invoice menjadi `● Paid`.

#### `TICK-011`: AI CFO Copilot Anomaly Engine (`pgvector` / SQL Aggregations)
- **Tugas:**
  - Buat query analitik otomatis untuk mendeteksi 2 jenis anomali:
    1. **Overdue Receivables Escalation:** Invoice dengan status `OVERDUE` $> 7$ hari.
    2. **Spend Cap Spike:** Departemen dengan realisasi biaya $> 100\%$ dari budget cap (misal: lonjakan AWS NAT Gateway egress).
  - Tampilkan rekomendasi CFO di tab `[ AI CFO Copilot (2) ]` pada panel inspektor kanan.
- **Acceptance Criteria:**
  - Anomali terdeteksi otomatis dan menampilkan estimasi penambahan runway (+0.8 Months) serta potensi penghematan biaya ($1,850/mo).

#### `TICK-012`: Aksi 1-Klik CFO (Reminder & Settlement)
- **Tugas:**
  - Implementasikan tombol "Send Escalation Notice" (simulasi pengiriman email via Resend API).
  - Implementasikan tombol "Mark Paid" untuk rekonsiliasi instan dari panel Copilot.
- **Acceptance Criteria:**
  - Notifikasi toast muncul saat aksi dijalankan dan status anomali ter-update secara real-time.

---

## Sprint 4: QA, Production Handover Cutover Runbook & Upwork Portfolio Assets
**Durasi:** Hari 17 – Hari 21  
**Tujuan Sprint:** Melakukan audit pengujian end-to-end, mengeksekusi SOP migrasi cutover ke akun Supabase klien, melakukan deployment Vercel production, dan menyiapkan aset portofolio Upwork untuk Hanif Daffa N.

### Task Breakdown & GitHub Issues:

#### `TICK-013`: Audit Keamanan & Isolasi RLS End-to-End
- **Tugas:**
  - Uji seluruh skenario security:
    - Coba bypass `tenant_id` via header JWT palsu $\rightarrow$ wajib ditolak.
    - Coba akses fungsi tulis dengan role `VIEWER` $\rightarrow$ tombol disabled & mutasi API ditolak 403 Forbidden.
- **Acceptance Criteria:**
  - 100% test case security lulus tanpa kebocoran data.

#### `TICK-014`: Eksekusi SOP Handover Supabase Production (Zero Manual Clicks)
- **Tugas:**
  - Ikuti SOP Handover yang telah disepakati:
    ```bash
    # 1. Login & Link ke project production milik klien
    npx supabase login
    npx supabase link --project-ref <CLIENT_PROD_PROJECT_REF>

    # 2. Push seluruh skema & policy RLS
    npx supabase db push

    # 3. Seed data baseline produksi
    npx supabase db seed
    ```
- **Acceptance Criteria:**
  - Database production klien langsung aktif dengan skema, RLS policy, dan data seed yang identik dengan staging.

#### `TICK-015`: Production Deployment Vercel & Environment Setup
- **Tugas:**
  - Setup Vercel project, kaitkan variabel env:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `STRIPE_SECRET_KEY`
    - `STRIPE_WEBHOOK_SECRET`
- **Acceptance Criteria:**
  - Aplikasi live di domain publik dengan SSL aktif, performa Lighthouse $> 90$, dan zero console errors.

#### `TICK-016`: Paket Portofolio & Studi Kasus Upwork
- **Tugas:**
  - Rekam video walkthrough 60 detik (Loom) menyoroti:
    1. Multi-tenant RLS isolation switcher.
    2. Idempotent Stripe webhook simulation.
    3. Live Invoice paper inspector & AI CFO Copilot.
  - Susun naskah portofolio untuk profil Hanif Daffa N.
- **Acceptance Criteria:**
  - Aset visual dan video siap diunggah ke profil Upwork Hanif.

---

## Ringkasan Definition of Done (DoD) Tiap Sprint

| Sprint | Deliverables Kunci | Verifikasi QA Wajib |
| :--- | :--- | :--- |
| **Sprint 1** | Skema Supabase, RLS Policy, Seed Dummy, Token UI | `npx supabase db reset` sukses; RLS cross-tenant lolos pengujian isolasi. |
| **Sprint 2** | Inset Frame Shell, 4-Col KPI Strip, Chart, Master-Detail Sub-Ledger | Presisi 100% dengan `veloceops-ui-design-reference.html`; responsif & no lag. |
| **Sprint 3** | Stripe Webhook Idempoten, Auto-Reconciliation, AI CFO Copilot | Webhook duplikat terabaikan otomatis; anomali spend & piutang terdeteksi. |
| **Sprint 4** | Production Cutover Runbook, Deployment Vercel, Upwork Case Study | `supabase db push` ke project klien berhasil; live demo siap pakai di Upwork. |
