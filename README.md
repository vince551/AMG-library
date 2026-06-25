# 📚 AMG Community Library Website & Visitor Log System

A modern, highly responsive community library portal built with a clean **Blue, White, and Green** aesthetic. This platform includes public-facing sections (About Us, Curated Book Catalog, Contact Form) alongside a secure, Firebase-backed **Librarian Desk Dashboard** for checking in and checking out library visitors in real-time.

---

## 🎨 Theme & Visual Palette
* **Primary Blue (`#1e3a8a`):** Used for navigation headers, section titles, and key dashboard metrics to inspire trustworthiness and depth.
* **Accent Green (`#10b981`):** Highlights active elements, action buttons, successful metrics, and positive focus states.
* **Soft Tint Green (`#f0fdf4`):** Soft background blocks and zebra striping that ensure high readability without visual fatigue.

---

## ✨ Features

### 🌐 Public Portal
1. **Hero Header:** A sleek landing interface presenting full-bleed photography overlays wrapped in community welcoming messages.
2. **About Us Layout:** An elegant block detailing the library's mission statement, feature cards highlighting resources, and a clean working schedule matrix.
3. **Curated Book Catalog:** Organizes physical and virtual copies under dynamic categories (Children's Classics, Coding & Technology, and Global Current Events) featuring live legal links to read digital books immediately.
4. **Interactive Contact Form:** A clean form matching user theme choices with dynamic border-glowing effects upon text selection.

### 🔒 Secure Librarian Desk
* **Credential Authentication:** Protected behind a login layer prompt linked from the main menu navigation bar.
* **Real-time Visitor Check-In:** Form submission tracks attendee name and purpose, automatically computing exact arrival intervals.
* **Live Metrics Counters:** Monitors concurrent active visitors inside the facility and logs historical summary counts for that day.
* **Over-Capacity Detection Alert:** Triggers a sticky warning container instantly if building capacity passes safe thresholds (Default: 15 learners).
* **Persistent Cloud Syncing:** Connected natively with **Firebase Realtime Database** so that updates broadcast live across any viewing terminal.
* **Data Spreadsheet Exporter:** Includes a single-click script to parse cloud logs and compile them instantly into a clean downloadable `.csv` spreadsheet file.

---

## 📁 Project Structure

```text
amg-library/
├── index.html     # Main application markup & view structure
├── script.js      # App controller logic & Firebase live streams
├── style.css      # Core theme stylings & responsive layouts
└── images/        # Asset repository
    ├── logo.jpg   # Brand mark asset
    └── bck.jpg    # Hero interface landing photography
