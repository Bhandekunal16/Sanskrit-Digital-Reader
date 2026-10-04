# Installation & Setup Guide

This guide provides step-by-step instructions for setting up, running, testing, building, and deploying the **Sanskrit Vani** web application.

---

## 💻 System Requirements

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (Recommended: Node 20 LTS)
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn` / `bun`)
- **Git**: For cloning the repository

Verify your installed versions:
```bash
node -v
npm -v
```

---

## 📥 Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Bhandekunal16/Sanskrit-Digital-Reader.git
cd Sanskrit-Digital-Reader
```

### 2. Install Project Dependencies
```bash
npm install
```

---

## 🏃 Running in Development Mode

Start the local development server:
```bash
npm run dev
```

The application will start on port `3000`:
- Local URL: **`http://localhost:3000`**

---

## 🧪 Running Automated Tests

Run the full Vitest suite covering linguistic analyzers, transliteration, phonology, dictionary search, quizzes, and the Varṇamālā dataset:
```bash
npm test
```

---

## 🏗️ Production Build & Verification

### 1. Type Checking & Linting
```bash
npm run lint
```

### 2. Build Production Bundle
```bash
npm run build
```
This generates optimized, minified static assets in the `dist/` directory.

### 3. Preview Production Build
```bash
npm run preview
```

---

## ☁️ Deployment

Since the application compiles to a client-side single-page application with zero backend latency, it can be deployed directly to:
- **Vercel** / **Netlify** / **Cloudflare Pages**
- **GitHub Pages**
- **Google Cloud Run** / **Firebase Hosting** / **AWS S3**
