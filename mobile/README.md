# VeloceOps Mobile — Standalone Native Application (React Native + Expo)

The native mobile companion app for **VeloceOps**, engineered with **React Native**, **Expo**, **TypeScript**, and connected to the same **Supabase Multi-Tenant PostgreSQL** database.

---

## 📱 Features

- **Multi-Tenant Switcher:** Real-time switching between Acme Cloud (USD), Nova Logistics (EUR), and Kinetix AI (GBP) with Row-Level Security isolation.
- **Executive Treasury Deck:** Live operating cash balance, Accounts Receivable sub-ledger, and 1-tap Stripe Webhook simulation.
- **Interactive Invoice Inspector:** Native modal bottom sheet displaying itemized deliverables, payment rails, and SHA-256 cryptographic audit proofs.
- **Spend Management Controls:** Departmental OpEx budget cap progress meters with instant spike warning indicators.
- **AI CFO Surveillance:** Real-time anomaly feed and interactive runway extension scenario simulator.
- **Warm Fintech Theme:** Preserved Linear/Attio-style Inset Frame aesthetic (`#F2F2EE` shell, `#FFFFFF` canvas, `#D4F338` Volt Lime).

---

## 🚀 Quickstart

### 1. Navigate to Mobile Folder
```bash
cd mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npx expo start
```

- Press `i` to launch in the **iOS Simulator** (macOS with Xcode).
- Press `a` to launch in the **Android Emulator** or physical device (via Expo Go app).
- Press `w` to run directly in the web browser.

---

## 📦 Building Standalone APK / iOS App

To build standalone binary installers for testing or app stores:

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure and build Android APK
eas build -p android --profile preview

# 4. Build iOS App
eas build -p ios --profile preview
```
