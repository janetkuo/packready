# PackReady 🧳 — Travel Preparation Checklist

A lightweight, zero-build, bilingual (**English / 繁體中文**) travel packing and pre-departure checklist web app designed for **GitHub Pages**, mobile devices, and laptops.

## Features

- **Bilingual UI (English / Traditional Chinese)**: One-click language switcher in the header (`EN / 繁中`), with automatic browser language detection and full translations for all built-in items, categories, contexts, and presets.
- **Privacy-Safe Default List**: Ships with general packing items and pre-departure home tasks (lock doors & windows, water plants, unplug appliances, turn off alarms, etc.) — safe for public hosting. Personal items stay strictly in your browser (`localStorage`) and your private Google Drive.
- **Multi-Context Filtering**:
  - Organize items across **Trip Type** (International, Business, Domestic, Outdoor), **Destination** (Japan, Taiwan, Europe, US/Canada), **Season & Weather** (Winter, Summer, Rainy), **Personal Needs** (Feminine Care, Men's Care, Makeup & Skincare, Contact Lenses), and **Custom Tags** (e.g., Medical, Ski, Kids).
  - A single item can apply to multiple contexts (e.g., Bug Spray applies to Summer, Taiwan, and Outdoor).
  - Switch between **Trip Mode** (Essentials + matching contexts), **Tags Only**, and **All Items**, plus quick filters for **Carry-on** and **Unpacked only**.
- **Custom Items, Presets & Private CSV Import**:
  - Add, edit, or delete any item, create custom categories and context tags, and save favorite filter combinations as reusable presets.
  - Import your own private spreadsheet CSV locally (supports standard columns as well as emoji context columns such as `🧳`, `✈️`, `🇹🇼`, `💼`, `🏥`).
- **One-Click Reset with Undo**:
  - Reset all checkmarks (or only currently visible items) between trips with a 7-second Undo toast, while preserving all custom items and presets.
- **Backup & Google Drive Sync**:
  - **Local JSON Backup**: Instant export and import (Merge or Replace mode) with zero setup.
  - **Google Drive Sync**: Pure client-side OAuth 2.0 via Google Identity Services (`drive.file` scope) that reads/writes only `packready-backup.json` in your own Google Drive — no backend server required.
- **Mobile-First & PWA Ready**:
  - Responsive two-column desktop layout and mobile slide-over filter drawer, light/dark theme toggle, and Web App Manifest for "Add to Home Screen".

---

## Local Development

PackReady uses pure HTML, CSS, and native ES Modules — no Node.js or build step required:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages** in your repository.
3. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## Setting Up Google Drive Sync

Because PackReady runs purely in the browser, you can connect your own free Google OAuth Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a project.
2. Navigate to **APIs & Services → Library**, search for **Google Drive API**, and enable it.
3. Navigate to **OAuth consent screen**, choose **External**, fill in an app name, and add your Gmail address under **Test users**.
4. Navigate to **Credentials → Create Credentials → OAuth client ID** and select **Web application**.
5. Under **Authorized JavaScript origins**, add the origin where you open PackReady (e.g., `https://<your-username>.github.io` and/or `http://localhost:8080`).
6. Copy the generated Client ID and paste it into **Backup / Drive** in the app.

---

## Project Structure

```text
.
├── index.html                 # App shell and modal dialogs
├── manifest.json              # PWA manifest
├── icon.svg                   # App icon
├── css/
│   └── styles.css             # Responsive light/dark theme styles
└── js/
    ├── app.js                 # App bootstrap and event bindings
    ├── data/
    │   └── defaults.js        # Public bilingual default items, categories, tags & presets
    ├── i18n/
    │   └── translations.js    # English & Traditional Chinese UI dictionary
    ├── services/
    │   └── googleDrive.js     # Client-side GIS OAuth 2.0 + Drive API v3 client
    ├── state/
    │   └── store.js           # Reactive state, localStorage, filtering, JSON/CSV import
    └── ui/
        ├── render.js          # DOM rendering and i18n text application
        └── modals.js          # Modals, toasts, and Drive sync UI handlers
```
