# Kinly — Family Digital Wellness & Parental Protection Platform

Official full-stack application built with **React** (frontend) and **Node.js** (backend), modeled after the Figma design system.

---

## 🌟 Key Features

### 1. Dashboard Overview
- **Active Family Status**: Real-time stats across all family devices (Leo's iPad, Maya's iPhone, Lucas's MacBook, Living Room Tablet).
- **Interactive Weekly Screen Time Chart**: Daily bar chart with peak day highlighting (Thursday 4h 15m), daily average metrics, and breakdown.
- **Safety & Content Blockers**: Recent security events, geofence school arrivals, and limit notifications.
- **Instant Restrictions Panel**: One-click **Pause All Internet**, **Bedtime Lockdown** (8:30 PM), and **SafeSearch Enforced**.

### 2. Live Child Phone Companion & Real Phone Sync ("Connect with Phones Really")
- **QR Code Pairing**: Scan with any real iOS or Android camera to open the companion app on local Wi-Fi.
- **Live Phone Simulator**: Built-in interactive mobile phone preview allowing parents to see the child's screen, remaining time, and instant lock screen when internet is paused.
- **Bonus Time Requests**: Children can request +15m or +30m directly from their phone with one tap.

### 3. Comprehensive Billing & Payment System
- **Family Subscription Plans**: Free Trial, Kinly Family Plus ($9.99/mo or $89/yr), and Kinly Complete All-in-One ($19.99/mo).
- **Secure Checkout Modal**:
  - Live formatted card input (16-digit spacing, MM/YY expiry, CVC).
  - Discount promo code engine (`KINLY20` for 20% off).
  - Apple Pay, Google Pay, and PayPal support.
  - Live simulated bank authorization & order confirmation (`ORD-2026-XXXX`).
  - Downloadable official tax invoices & receipts.

### 4. Smart Rules & Web Filtering
- Automated category blocking (Adult & Explicit, Gambling, Violence, Social Networks, Online Gaming).
- Custom URL blocklist with instant addition and removal.
- Educational domain whitelist (bypasses downtime limits for homework).

---

## 📁 Project Architecture

```
kasim/
├── backend/
│   ├── server.js          # RESTful Node.js API server (Port 5050)
│   ├── package.json       # Backend configuration
│   └── data/
│       └── db.json        # Persistent JSON database (devices, rules, orders)
├── frontend/
│   ├── src/
│   │   ├── components/    # Modular React UI components
│   │   ├── services/      # REST API client
│   │   ├── App.jsx        # Main application controller
│   │   └── main.jsx       # React DOM entry
│   ├── tailwind.config.js # Exact Figma color tokens & fonts
│   ├── vite.config.js     # Vite dev server with proxy to backend
│   └── package.json       # React dependencies
└── start.bat              # One-click startup script for Windows
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on Node v26)

### Running the Application

1. **Start the Node.js Backend:**
   ```powershell
   cd backend
   node server.js
   ```
   *Backend runs on `http://localhost:5050`*

2. **Start the React Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```
   *Frontend runs on `http://localhost:3000`*

3. **Or run with one click:**
   Double click `start.bat` in the root folder!
