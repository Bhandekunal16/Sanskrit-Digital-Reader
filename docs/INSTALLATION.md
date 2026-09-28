# Installation & Setup Guide

This guide provides step-by-step instructions for setting up, running, building, and deploying the **Sanskrit Digital Reader** web application.

---

## 💻 System Requirements

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (Recommended: Node 20 LTS)
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)
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

> **Note**: If installing in a CI/CD environment or encountering peer dependency resolution flags, ensure `.npmrc` contains `legacy-peer-deps=true` or install with:
> ```bash
> npm install --legacy-peer-deps
> ```

---

## 🏃 Running in Development Mode

Start the local development server:
```bash
npm run dev
```

The application will start on port `3000` (or the next available port):
- Local URL: **`http://localhost:3000`**
- Network URL: **`http://<your-local-ip>:3000`**

---

## 🏗️ Production Build & Preview

### 1. Type Check & Linting
Run TypeScript compilation and static verification:
```bash
npm run lint
```

### 2. Build Production Bundle
To create an optimized, minified production build:
```bash
npm run build
```
This generates the compiled static assets in the `dist/` directory.

### 3. Preview Production Build Locally
To test the production build locally:
```bash
npm run preview
```

---

## ⚙️ Environment Configuration

The application is completely self-contained and operates client-side using deterministic local datasets (`sanskritDictionary.ts` and `passages.ts`). 

- **Required Variables**: None. The core application runs with zero configuration out of the box.
- **Optional Variables**:
  - `APP_URL`: Used if self-referential links or deployment URLs are needed.
  - `GEMINI_API_KEY`: Reserved for optional AI assistant features if configured in Google AI Studio.

Example `.env.example`:
```env
# Optional configuration
APP_URL="http://localhost:3000"
```

---

## ☁️ Deployment Guides

### Deploying to Vercel
1. Push your code to a GitHub/GitLab repository.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. The project will automatically detect Vite / Next.js static build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**.

### Deploying to GitHub Pages / Static Hosting
Since the application compiles to pure static HTML/JS/CSS:
1. Run `npm run build`.
2. Deploy the contents of the `dist/` folder to any static hosting provider (GitHub Pages, Cloudflare Pages, Netlify, AWS S3).
