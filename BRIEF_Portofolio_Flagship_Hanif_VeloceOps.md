# Project Brief: VeloceOps — Multi-Tenant B2B SaaS Finance, Billing & AI Revenue Hub

> **Project Code:** `AETH-PORT-HANIF-01`  
> **Target Portfolio Owner:** Hanif Daffa N. (`Top Rated` • `100% JSS` • `$30K+ Earned`)  
> **Target Audience:** US / UK / EU Startup Founders, CTOs, & SMB Owners on Upwork  
> **Resource Allocation:** **1 Full-Stack Developer + AI Coding Workflow**  
> **Timeline:** 3–4 Minggu (4 Weekly Sprints + Handover)  
> **Execution Mode:** Diperlakukan sebagai **Real Client Project** (Sprint Planning, Git PR, Migration-First Supabase, Staging Review, & Formal Handover Migration)

---

## 1. Latar Belakang & Tujuan Strategis

Berdasarkan audit data akun Upwork **Hanif Daffa N.**, positioning utamanya adalah:
> *"I help founders turn SaaS MVPs into stable web apps with React, Node.js, and Next.js... I lock down who can access the database, set up Stripe payments, and keep each customer's data separate."*

Saat ini, portofolio Hanif sudah memiliki beberapa proyek AI (*Chatbotz, Kodevo, Medicall AI*), namun **belum memiliki 1 Flagship B2B Multi-Tenant SaaS Application** yang membuktikan klaim teknis termahalnya di bio:
1. **Multi-Tenant Data Isolation (Row-Level Security / PostgreSQL)** — memisahkan data antar perusahaan/pelanggan dengan aman.
2. **Role-Based Access Control (RBAC)** — pembagian hak akses antara *Owner, Finance Manager,* dan *Read-Only Viewer/Auditor*.
3. **End-to-End Financial & Stripe Billing Workflow** — alur nyata dari pembuatan invoice -> pembayaran Stripe -> rekonsiliasi otomatis ke buku kas (*ledger*) & metrik MRR.
4. **High-Density, Production-Grade UI/UX** — dashboard padat data yang cepat, bersih, responsif, dan bebas bug (menggabungkan kekuatan proyek utama *Finance Management* dan *SaaS Marketing/Revenue* dari rencana PRD sebelumnya ke dalam **satu produk full-stack utuh**).

---

## 2. Strategi "Client Magnet" Terbaik (Rekomendasi Kombinasi Paling Efektif)

Klien luar negeri (US/UK/EU) di Upwork rata-rata hanya menghabiskan **45–90 detik** saat membuka link portofolio. Mereka **tidak akan mau daftar akun menggunakan email** hanya untuk melihat portofolio.

Oleh karena itu, kombinasi **paling optimal dan berkonversi tinggi** yang wajib dibangun oleh tim dev adalah **"The 4-in-1 Upwork Conversion Kit"**:

1. **1-Click Instant Sandbox Login (Tanpa Ketik Email/Password):** Di halaman login dan landing page terdapat tombol menonjol **"Launch Interactive Live Demo (No Signup Required)"** yang langsung mengautentikasi pengunjung ke akun demo aktif.
2. **Floating "Reviewer Sandbox Bar" (Tenant & Role Switcher Instan):** Sebuah *floating pill bar* elegan di bagian bawah/atas layar yang memungkinkan klien Upwork berganti **Perusahaan (Tenant A vs Tenant B)** dan berganti **Role (Owner vs Finance Manager vs Viewer)** dalam 1 klik untuk membuktikan *Multi-Tenant Isolation* dan *RBAC* secara *live*.
3. **"Inspect Architecture & RLS" Drawer:** Tombol khusus di pojok toolbar bernama `⚡ View System Architecture` yang membuka *slide-over drawer* berisi diagram arsitektur (Next.js + Supabase PostgreSQL + RLS + Stripe), cuplikan SQL kebijakan keamanan (*RLS Policy*), dan *live Audit Log* dari aksi yang baru saja diklik klien.
4. **1-Click "Reset Demo Data" + 45s GIF/Video Walkthrough:** Agar data tetap rapi meski diutak-atik oleh banyak calon klien, serta video pendek untuk dipasang di thumbnail Upwork & bagian atas proposal.

---

## 3. Gambaran Produk (Product Overview)

* **Nama Produk:** **VeloceOps** *(B2B Revenue, Invoicing & Cashflow Operations Platform)*
* **Value Proposition Produk:** Satu platform terpadu bagi founder SaaS dan agensi B2B untuk mengelola arus kas multi-rekening, menagih invoice dengan pembayaran otomatis Stripe, mengontrol budget departemen, memantau metrik pertumbuhan SaaS (MRR, Churn, Funnel), dan berkonsultasi dengan AI CFO Copilot.

### Skenario Data Pre-Seeded (2 Tenant Berbeda)
Agar fitur *Multi-Tenant* terasa nyata saat klien mengganti workspace, database harus di-*seed* dengan **2 organisasi yang kontras**:

| Parameter | Tenant 1: **Acme Cloud Inc.** (Default) | Tenant 2: **Northstar Digital Studio** |
| :--- | :--- | :--- |
| **Tipe Bisnis** | B2B AI SaaS Startup (Series A) | B2B Software & Design Agency |
| **Mata Uang Utama** | USD (`$`) | EUR (`€`) |
| **Saldo Kas Total** | `$284,500.00` (3 Rekening: Mercury, Stripe, Brex) | `€92,400.00` (2 Rekening: Wise, Revolut) |
| **Karakteristik Data** | MRR `$42,500`, 340 transaksi langganan & cloud (AWS/Vercel/Payroll), 1 budget *Cloud Infra* over-limit (`108%`). | 18 proyek retainer & milestone invoice, 3 invoice berstatus *Overdue* yang memicu alert kas. |

### Matriks Role-Based Access Control (RBAC) di Switcher
| Hak Akses / Aksi | `Owner / Admin` | `Finance Manager` | `Viewer / Investor` |
| :--- | :---: | :---: | :---: |
| Melihat Dashboard, Laporan, & SaaS Metrics | ✅ | ✅ | ✅ |
| Membuat / Mengedit Transaksi, Budget, & Invoice | ✅ | ✅ | ❌ *(Disabled + Tooltip RBAC)* |
| Simulasi Bayar Invoice / Rekonsiliasi Kas | ✅ | ✅ | ❌ *(Disabled + Tooltip RBAC)* |
| Mengelola Anggota Tim, API Keys, & Billing | ✅ | ❌ *(Locked View)* | ❌ *(Locked View)* |
| Menghapus Workspace / Reset Database | ✅ | ❌ | ❌ |

---

## 4. Ruang Lingkup Fitur & Acceptance Criteria (Scope of Work)

### Modul 0: Reviewer Sandbox Bar, Auth & Architecture Drawer *(Prioritas Kritis)*
* **Fitur:**
  * Halaman Login/Register modern + tombol **"Instant Demo Login as Acme Cloud (Owner)"**.
  * **Floating Reviewer Toolbar:** Menampilkan sedang login sebagai siapa, dropdown **Switch Tenant** (*Acme Cloud Inc.* <-> *Northstar Digital*), dropdown **Switch Role** (*Owner* <-> *Finance Manager* <-> *Investor Viewer*), tombol **Reset Demo Data**, dan tombol **Inspect Architecture**.
  * **Architecture Inspector Drawer:** Menampilkan skema relasi database multi-tenant, status koneksi Supabase PostgreSQL, dan *live query/audit log* terakhir.
* **Acceptance Criteria:**
  * Mengganti Tenant langsung me-refresh seluruh data dashboard, mata uang (`$` ke `€`), chart, dan daftar transaksi tanpa *page reload* penuh yang lambat.
  * Mengganti Role ke `Investor Viewer` otomatis menonaktifkan tombol `+ New Invoice`, `+ Transaction`, dan `Delete` disertai badge informasi *"Read-only mode active (RBAC enforced)"*.

---

### Modul 1: Executive Command Center (Overview Dashboard)
* **Fitur:**
  * **4 Kartu KPI Utama:** *Total Cash Balance, Monthly Net Burn / Net Income, Monthly Recurring Revenue (MRR),* dan *Estimated Cash Runway (Months)* — masing-masing dengan indikator `% vs periode lalu` dan *sparkline*.
  * **Interactive Cashflow & Revenue Chart:** Area/Bar chart 12 bulan (*Income vs Expense vs Net Cash*) dengan filter rentang tanggal (*30D, Q3, YTD, 12M*).
  * **Actionable Alerts Widget:** Menampilkan *Overdue Invoices* yang butuh di-*follow up* dan *Budgets Over 80%* secara berdampingan dengan tombol aksi cepat.
  * **Recent Ledger Activity:** 6 transaksi terakhir lintas rekening.
* **Acceptance Criteria:**
  * Mengubah *Date Range Picker* di pojok kanan atas wajib mengalkulasi ulang seluruh kartu KPI dan grafik secara akurat dari database.

---

### Modul 2: Smart Invoicing, Stripe Checkout Simulator & Auto-Reconciliation *(Fitur Andalan #1)*
* **Fitur:**
  * **Daftar & Statistik Invoice:** Ringkasan total *Draft, Pending, Paid,* dan *Overdue*. Tabel interaktif dengan filter status, pencarian klien, dan *pagination*.
  * **Invoice Builder & Live Preview:** Form pembuatan invoice dengan kalkulasi otomatis *item x qty*, diskon, dan pajak, dilengkapi *Live PDF-style Preview* di sebelahnya.
  * **1-Click "Simulate Stripe Payment / Webhook":** Pada invoice berstatus *Pending* atau *Overdue*, terdapat tombol **"⚡ Simulate Client Stripe Payment"**.
* **Acceptance Criteria (Alur End-to-End):**
  1. User membuat invoice baru atau memilih invoice *Pending* milik klien senilai misal `$4,500`.
  2. User mengklik tombol **"⚡ Simulate Client Stripe Payment"**.
  3. Sistem menampilkan animasi pemrosesan *Stripe Webhook (`invoice.payment_succeeded`)* selama ~1,5 detik.
  4. Status invoice berubah menjadi `Paid`, sebuah transaksi `Income` baru senilai `$4,500` otomatis tercatat di modul **Transactions**, saldo rekening **Stripe Balance** bertambah `$4,500`, grafik di **Overview** naik, dan aksi tercatat di **Audit Logs**.

---

### Modul 3: Multi-Account Ledger, Expenses & Internal Transfers
* **Fitur:**
  * **Accounts & Cards Strip:** Daftar rekening perusahaan (mis. *Mercury Operating, Stripe Payouts, Brex Corporate Card*) beserta saldo masing-masing dan tombol **Transfer Funds**.
  * **Advanced Transactions Data Table:** Search, multi-filter (Kategori, Rekening, Tipe Income/Expense, Status), sorting, *bulk delete/categorize*, dan **Export CSV**.
  * **CRUD Transaksi & Internal Transfer:** Modal tambah/edit transaksi dan transfer antar-rekening.
* **Acceptance Criteria:**
  * Melakukan transfer `$10,000` dari *Stripe Payouts* ke *Mercury Operating* otomatis mengurangi saldo akun asal, menambah saldo akun tujuan, dan membuat sepasang jurnal transaksi yang seimbang.
  * Jika transaksi *Expense* baru menyebabkan kategori budget melewati ambang `80%` atau `100%`, sistem otomatis memunculkan *toast alert* dan notifikasi di topbar.

---

### Modul 4: Department Budgets & Burn-Rate Control
* **Fitur:**
  * **Kartu Budget per Departemen/Kategori:** (Misal: *Cloud Infrastructure, Paid Marketing, SaaS Subscriptions, Payroll*).
  * **Visual Progress Bar Berwarna:** Hijau (`<80%`), Kuning (`80–99%`), Merah menyala (`>=100% Over Budget`).
  * **Drill-down Drawer:** Klik salah satu kartu budget membuka *drawer* samping yang menampilkan seluruh rincian transaksi pemicu pembengkakan biaya di kategori tersebut.
* **Acceptance Criteria:**
  * Penambahan transaksi pengeluaran baru di Modul 3 langsung mengupdate persentase pemakaian budget di halaman ini secara *real-time*.

---

### Modul 5: SaaS Revenue, Funnel & Cohort Analytics *(Fitur Andalan #2)*
* **Fitur:**
  * **6 SaaS Growth KPIs:** *MRR, ARR, Net Dollar Retention (NDR), Customer Acquisition Cost (CAC), LTV:CAC Ratio,* dan *Monthly Churn Rate*.
  * **Conversion Funnel & Bottleneck Highlighter:** Visualisasi 4 tahap (*Website Visitor -> Free Trial -> Activated Workspace -> Paid Subscriber*) dengan sorotan merah otomatis pada tahap dengan *drop-off* tertinggi, plus filter per *Acquisition Channel* (*Organic, Google Ads, LinkedIn, Referral*).
  * **Cohort Retention Heatmap:** Tabel matriks retensi pelanggan selama 6 bulan terakhir.
* **Acceptance Criteria:**
  * User dapat memfilter funnel berdasarkan channel (misal membandingkan konversi *Google Ads* vs *Organic Search*) untuk menemukan channel mana yang paling bocor.

---

### Modul 6: AI CFO Copilot & Security Audit Logs *(Fitur Andalan #3)*
* **Fitur:**
  * **AI CFO Copilot (Slide-over Chat / Command Bar `Cmd+K`):** Asisten AI kontekstual yang membaca ringkasan finansial tenant aktif. Dilengkapi **3 tombol Prompt Instan** (agar klien tidak bingung mau mengetik apa):
    1. *"Analyze our biggest expense spike this quarter"*
    2. *"Which overdue invoices should we prioritize for cashflow?"*
    3. *"Calculate our runway if marketing spend increases by 20%"*
  * **Security & RBAC Audit Logs Page:** Tabel rekaman aktivitas sistem (*Who, Role, Action, Resource, Timestamp, IP/Session*) yang membuktikan bahwa setiap perubahan data tercatat layaknya aplikasi *enterprise*.
* **Acceptance Criteria:**
  * Saat tombol prompt diklik, AI memberikan jawaban terstruktur dengan angka akurat sesuai data *tenant* yang sedang aktif (*Acme Cloud* atau *Northstar*).

---

## 5. Spesifikasi Teknis & Arsitektur (Untuk Tim Dev)

| Lapisan | Teknologi yang Digunakan | Standar Implementasi |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** + **TypeScript (Strict Mode)** | Tidak boleh ada `any` liar; gunakan Server Components untuk fetch awal & Server Actions / Route Handlers untuk mutasi. |
| **Styling & UI System** | **Tailwind CSS** + **shadcn/ui** + **Lucide Icons** + **Recharts** | Desain mengacu ke standar *Linear / Stripe / Mercury* (tipografi `Inter` + `JetBrains Mono` untuk angka finansial `tabular-nums`, dark & light mode rapi). |
| **Database & Auth** | **Supabase (PostgreSQL)** + **Supabase Auth** | Tabel wajib memiliki kolom `organization_id` (UUID) dengan kebijakan **Row-Level Security (RLS)** aktif. Selama dev menggunakan **Supabase tersendiri milik Dev**, lalu dimigrasikan saat Handover. |
| **Database Migration** | **Supabase CLI (`supabase/migrations/*.sql`)** | **Wajib 100% Migration-First** (dilarang membuat tabel/RLS manual di dashboard tanpa file SQL migrasi). |
| **AI Integration** | **OpenAI / Gemini API** (via Vercel AI SDK) | Dilengkapi *rate-limiter* dan *fallback response* cerdas jika kuota API habis saat didemokan. |
| **Sandbox Isolation** | **PostgreSQL RPC (`reset_demo_data()`)** | Tombol *"Reset Demo Data"* memanggil fungsi SQL `reset_demo_data()` untuk mengembalikan data tenant demo ke kondisi awal dalam `< 2 detik`. |
| **Deployment** | **Vercel** (Staging Dev -> Production Handover) | Terhubung ke GitHub dengan CI check (`npm run build` + typecheck lolos 100%). |

---

## 6. Aturan Wajib Supabase & SOP Migrasi Saat Handover

Karena proyek ini dikerjakan menggunakan **project Supabase terpisah milik Developer** selama masa pengembangan dan baru **dimigrasikan ke akun Supabase Produksi saat Handover**, developer **WAJIB** mematuhi aturan arsitektur database berikut sejak Hari ke-1:

**Aturan Emas: "Zero Manual Dashboard Config" (100% Code-Driven Migration)**  
Developer **DILARANG** membuat tabel, mengubah kolom, membuat *Row-Level Security (RLS) policy*, atau membuat *SQL Function/Trigger* hanya dengan klik manual di Supabase Studio Web tanpa menyimpannya ke dalam file migrasi. Jika aturan ini dilanggar, proses migrasi saat *handover* akan gagal atau timpang.

### Standar Struktur Folder Database di Repository
Seluruh konfigurasi Supabase wajib tersimpan di dalam Git repository dengan struktur standar Supabase CLI:
```text
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 20261025000001_init_multi_tenant_schema.sql   # Tabel organizations, members, accounts, dll
│   │   ├── 20261025000002_rls_policies.sql               # Seluruh policy Row-Level Security
│   │   └── 20261025000003_rpc_functions_and_triggers.sql # Fungsi reset_demo_data(), auto-reconcile, audit log trigger
│   └── seed.sql                                          # Data lengkap Tenant 1 (Acme Cloud) & Tenant 2 (Northstar)
├── .env.example                                          # Template variabel environment tanpa rahasia
```

### SOP Migrasi Saat Handover (Target Waktu: < 10 Menit)
Saat proyek selesai di akhir Minggu ke-4, proses *Handover* dari akun Supabase Dev ke akun Supabase Produksi dilakukan dengan langkah terstandar berikut:
1. **Link ke Project Supabase Produksi Baru:**
   ```bash
   npx supabase link --project-ref <PROJECT_REF_BARU>
   ```
2. **Push Seluruh Skema, RLS, & RPC Function:**
   ```bash
   npx supabase db push
   ```
3. **Jalankan Seeder Data Demo (2 Tenant + 3 Role):**
   ```bash
   npx supabase db seed
   ```
4. **Update Environment Variables di Vercel Produksi:**
   Cukup mengganti 3 variabel utama di dashboard Vercel tanpa menyentuh kode sama sekali:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY` *(khusus untuk one-click demo auth / reset RPC)*
   * `AI_API_KEY` *(OpenAI / Gemini API Key)*

---

## 7. Cara Kerja (1 Full-Stack Dev + AI) & Jadwal 4 Minggu

Proyek ini dieksekusi oleh **1 Full-Stack Developer dengan akselerasi AI Coding Tools** (Cursor / Claude Code / Antigravity) namun tetap mengikuti disiplin manajemen proyek profesional:

### Ritual Manajemen Proyek
1. **Git & Branching Strategy:** Branch `main` (Siap Handover), `staging` (Review Mingguan), dan `feat/<nama-modul>`. Setiap modul selesai wajib dibuatkan **Pull Request (PR)** dengan deskripsi singkat & screenshot hasil uji.
2. **AI-Assisted Workflow:** AI digunakan untuk mempercepat *scaffolding* UI, penulisan query SQL/migrasi, pembuatan data *seed* yang realistis (300+ transaksi), dan *unit/type checking*. Developer bertanggung jawab penuh atas **kualitas arsitektur, keamanan RLS, kerapian UI, dan bebasnya bug pada alur bisnis**.
3. **Weekly Checkpoint & Demo (Setiap Jumat):** Developer mendemokan progres di link *Staging Vercel* (yang terhubung ke Supabase Dev) untuk di-review oleh Project Owner.

### Rencana Sprint 4 Minggu (Timeline)

#### **Minggu 1 (Sprint 1): Pondasi Arsitektur, Supabase Migrations, & Reviewer Sandbox**
* Setup repositori Next.js 15 + TypeScript + Tailwind + shadcn/ui + inisialisasi **Supabase CLI (`supabase init`)** di akun Supabase Dev.
* Tulis file migrasi SQL (`init_multi_tenant_schema.sql` & `rls_policies.sql`) untuk tabel `organizations`, `organization_members`, `accounts`, `transactions`, `invoices`, `invoice_items`, `budgets`, `saas_metrics_daily`, dan `audit_logs`.
* Buat file `supabase/seed.sql` untuk 2 Tenant (*Acme Cloud Inc.* & *Northstar Digital*) + fungsi RPC `reset_demo_data()`.
* Bangun Layout Utama (Collapsible Sidebar, Topbar, Dark/Light Mode) + **Modul 0 (1-Click Demo Login, Floating Reviewer Toolbar, & Architecture Drawer)**.
* **Deliverable Akhir Minggu 1:** Link staging live; Project Owner sudah bisa klik *1-Click Demo Login*, ganti Tenant & Role, serta klik *Reset Demo Data*.

#### **Minggu 2 (Sprint 2): Core Financial Engine (Overview, Ledger, Transfers & Budgets)**
* Bangun **Modul 1 (Executive Overview Dashboard)** dengan 4 KPI utama, grafik arus kas 12 bulan, dan filter periode dinamis.
* Bangun **Modul 3 (Accounts, Transactions CRUD, Multi-filter Table, Export CSV, & Internal Account Transfer)**.
* Bangun **Modul 4 (Department Budgets)** lengkap dengan kalkulasi persentase otomatis, indikator warna, dan *drill-down drawer* transaksi.
* **Deliverable Akhir Minggu 2:** Alur tambah transaksi & transfer antar-rekening berjalan mulus di Supabase Dev dan langsung mengubah grafik Overview serta status Budget.

#### **Minggu 3 (Sprint 3): Smart Invoicing + Stripe Simulator, SaaS Funnel & AI CFO Copilot**
* Bangun **Modul 2 (Smart Invoicing & Live PDF Preview)** beserta fitur andalan **"⚡ Simulate Client Stripe Payment"** yang otomatis mencatat transaksi *Income*, menaikkan saldo kas, dan menulis ke `audit_logs`.
* Bangun **Modul 5 (SaaS Revenue, Funnel Drop-off Analyzer & Cohort Heatmap)**.
* Bangun **Modul 6 (AI CFO Copilot dengan 3 Instant Prompts & halaman Security Audit Logs)**.
* **Deliverable Akhir Minggu 3:** Seluruh 6 modul fungsional selesai 100% dan terintegrasi dari hulu ke hilir.

#### **Minggu 4 (Sprint 4): UI Polish, QA Bug Bash, Paket Aset Upwork & Migrasi Handover**
* **Hari 1–2 (UI Polish & QA):** Rapikan *tabular-nums*, *empty states*, *loading skeletons*, responsivitas layar, uji pengetatan RBAC, dan pastikan skor **Lighthouse Performance >= 90**.
* **Hari 3 (Simulasi & Eksekusi Migrasi Handover):** Buat project baru di akun Supabase Produksi, jalankan `npx supabase db push` + `seed.sql`, hubungkan ke Vercel Produksi, dan verifikasi semua fitur berjalan 100% identik tanpa error.
* **Hari 4–5 (Paket Aset Portofolio Upwork Hanif):**
  * 1 Hero Mockup resolusi tinggi + 5 Screenshot fitur kunci beranotasi.
  * 3 Video/GIF pendek (15–30 detik): *(1) Tenant & RBAC Switching, (2) Stripe Invoice Payment -> Auto Ledger Update, (3) AI CFO Copilot & Funnel Analysis*.
  * Dokumentasi `README.md` (termasuk panduan setup & migrasi database) + naskah **Case Study Upwork** siap upload.

---

## 8. Definition of Done & Checklist Serah Terima (Handover DoD)

1. **Zero Friction Access:** Klien bisa masuk ke dalam dashboard kurang dari **3 detik** lewat tombol *1-Click Demo Login* tanpa perlu mengetik alamat email.
2. **1-Command Supabase Migration:** Seluruh database (tabel, enum, index, RLS policy, fungsi RPC, dan data seed 2 tenant) terbukti bisa dimigrasikan ke akun Supabase baru saat *handover* hanya dengan perintah CLI (`supabase db push` & `supabase db seed`) tanpa konfigurasi manual di dashboard.
3. **Real Full-Stack Persistence & Isolation:** Perubahan data benar-benar tersimpan di Supabase PostgreSQL dan memicu perubahan lintas halaman, serta bisa di-reset kapan saja lewat tombol *Reset Demo Data*.
4. **No Dead Links / Zero Console Errors:** Semua menu di sidebar, filter, export CSV, dan simulasi berjalan 100% tanpa halaman *"Coming Soon"*, tanpa error di console, dan skor Lighthouse Desktop minimal **85–90**.
5. **Complete Handover Package:** Repository GitHub bersih (`.env.example` lengkap), kredensial telah dipindah ke akun Supabase & Vercel produksi, serta paket gambar/GIF/studi kasus siap di-upload ke profil Upwork Hanif Daffa N.
