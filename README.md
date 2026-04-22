# Youth Organisations by Team71 — Fund Manager

A cloud-synced monthly donation tracker for 11 members.  
Built with **React + Vite + Firebase Firestore** · Deployable to **Netlify** in minutes.

---

## 🗂️ Project Structure

```
team71-fund-manager/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Donations.jsx
│   │   ├── Members.jsx
│   │   ├── Expenses.jsx
│   │   ├── Reports.jsx
│   │   └── MyPayments.jsx
│   ├── firebase.js          ← Firebase init (reads env vars)
│   ├── useCloudData.js      ← Real-time Firestore hooks
│   ├── constants.js         ← Shared data & helpers
│   ├── styles.js            ← All shared styles
│   ├── App.jsx              ← Root component & routing
│   └── main.jsx             ← React entry point
├── index.html
├── vite.config.js           ← Vite + PWA config
├── netlify.toml             ← Netlify build & redirect rules
├── .env.example             ← Template for env variables
├── .gitignore
└── package.json
```

---

## ✅ Step 1 — Create Firebase Project (Free)

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → name it `team71-fund-manager`
3. Disable Google Analytics (not needed) → **Create project**

### Enable Firestore Database
4. In the left sidebar → **Build → Firestore Database**
5. Click **"Create database"**
6. Choose **"Start in test mode"** → select your region → **Enable**

### Get your Firebase config
7. Go to **Project Settings** (gear icon ⚙️ top left)
8. Scroll to **"Your apps"** → click **"</>" (Web)**
9. Register app name: `team71-web` → **Register app**
10. Copy the `firebaseConfig` values — you'll need them next

---

## ✅ Step 2 — Configure Environment Variables

### For local development:
Create a file called `.env.local` in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=team71-fund-manager.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=team71-fund-manager
VITE_FIREBASE_STORAGE_BUCKET=team71-fund-manager.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> ⚠️ Never commit `.env.local` to Git. It is already in `.gitignore`.

---

## ✅ Step 3 — Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ✅ Step 4 — Deploy to Netlify

### Option A — Netlify CLI (recommended)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option B — Netlify Dashboard (drag & drop)

1. Run `npm run build` locally
2. Go to **https://app.netlify.com**
3. Drag the `dist/` folder onto the Netlify dashboard
4. Done! Your app is live.

### Option C — GitHub + Auto Deploy

1. Push this project to a GitHub repository
2. Go to **https://app.netlify.com → "Add new site" → "Import from Git"**
3. Connect your GitHub repo
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## ✅ Step 5 — Add Environment Variables to Netlify

**This is required — without this, the deployed app cannot connect to Firebase.**

1. In Netlify dashboard → your site → **Site configuration → Environment variables**
2. Click **"Add a variable"** and add each one:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | your value |
| `VITE_FIREBASE_AUTH_DOMAIN` | your value |
| `VITE_FIREBASE_PROJECT_ID` | your value |
| `VITE_FIREBASE_STORAGE_BUCKET` | your value |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | your value |
| `VITE_FIREBASE_APP_ID` | your value |

3. After adding all variables → **Trigger a new deploy** (Deploys tab → "Trigger deploy")

---

## ✅ Step 6 — Set Firestore Security Rules

After testing, switch Firestore from "test mode" to secure rules:

1. Firestore → **Rules** tab → replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /app/{document} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> For production, you can tighten this further with Firebase Authentication.

---

## 🔑 Default Login Credentials

| Role   | Selection     | Password    |
|--------|---------------|-------------|
| Admin  | Admin tab     | `admin123`  |
| Member | Select name   | `member123` |

**To change passwords:** edit `src/components/Login.jsx` lines with `'admin123'` and `'member123'`.

---

## 📱 Install as Mobile App (PWA)

Once deployed to Netlify:

**Android:** Open the URL in Chrome → tap ⋮ menu → "Add to Home screen" → Install  
**iPhone:** Open in Safari → tap Share ⬆️ → "Add to Home Screen"

The app will appear on your home screen, open fullscreen, and work offline.

---

## 🛠️ Customisation

| What to change | Where |
|----------------|-------|
| Donation amount (default: ৳100) | `src/constants.js` → `DONATION_AMOUNT` |
| Member list | `src/constants.js` → `SEED_MEMBERS` (only for first-time seed) |
| Passwords | `src/components/Login.jsx` |
| App name / theme color | `index.html` + `vite.config.js` manifest |
| Month range start | `src/App.jsx` → `genMonthKeys('2025-01')` |

---

## ☁️ How Cloud Sync Works

- All data is stored in **Firebase Firestore** (3 documents: `members`, `payments`, `expenses`)
- Every change is written to Firestore instantly
- All open sessions receive updates in **real-time** via `onSnapshot` listeners
- **Offline support**: Firestore caches data locally — the app works without internet and syncs when reconnected
- The top bar shows **"☁ Saving…"** during writes and **"☁ Synced"** when complete

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Firebase Firestore | Cloud database (real-time) |
| vite-plugin-pwa | PWA / installable app |
| Netlify | Hosting & deployment |
