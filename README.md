# Indico Technical Test – Frontend

This repository contains the **frontend application** for the Indico Technical Test.  
The app is built using **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**, and is fully containerized with Docker and deployed on a VPS with HTTPS.

🌐 **Live Demo:**  
https://techtest-indico.alifdwt.com

---

## 📌 Features

### 1. Authentication

- Login using email & password
- JWT token stored securely in **HttpOnly cookie**
- Protected routes with server-side guard via `proxy.ts`

### 2. Voucher Management

- List vouchers with:
  - Pagination
  - Search by voucher code
  - Sorting by:
    - `discount_percent`
    - `expiry_date`
    - `created_at`
    - `updated_at`
- Create new vouchers
- Edit existing vouchers
- Delete vouchers with confirmation

### 3. CSV Import

- Upload vouchers via CSV file
- Header order **does not matter**
- Preview before submit
- Upload result summary:
  - `success_count`
  - `failed_count`
  - Detailed failed rows (row number, reason, voucher_code)

### 4. CSV Export

- Export all vouchers to CSV
- Format:  
  `voucher_code, discount_percent, expiry_date`

---

## 🏗 Tech Stack

- **Next.js 16 (App Router)**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Zod** (shared validation: server + client)
- **pnpm** (package manager)
- **Docker** (containerized deployment)
- **GitHub Actions** (CI/CD)
- **NGINX + HTTPS (Let’s Encrypt)**

---

## 🗂 Project Structure

```
.
├── actions
│   ├── login.ts
│   ├── prtected.ts
│   ├── upload-csv.ts
│   └── voucher.ts
├── app
│   ├── api
│   │   └── vouchers
│   │       └── export
│   │           └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── page.tsx
│   └── (protected)
│       ├── layout.tsx
│       └── vouchers
│           ├── error.tsx
│           ├── [id]
│           │   └── edit
│           │       └── page.tsx
│           ├── new
│           │   └── page.tsx
│           ├── page.tsx
│           └── upload-csv
│               └── page.tsx
├── components
│   ├── auth
│   │   ├── login-form.tsx
│   │   └── logout-button.tsx
│   ├── layout
│   │   ├── app-sidebar.tsx
│   │   └── app-topbar.tsx
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sonner.tsx
│   │   └── table.tsx
│   └── vouchers
│       ├── delete-voucher-button.tsx
│       ├── export-voucher-button.tsx
│       ├── upload-csv-form.tsx
│       ├── voucher-form.tsx
│       └── voucher-table.tsx
├── components.json
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── lib
│   ├── api
│   │   └── voucher.ts
│   ├── utils.ts
│   └── validators
│       ├── auth.ts
│       ├── csv.ts
│       └── voucher.ts
├── next.config.ts
├── next-env.d.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── proxy.ts
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
└── tsconfig.json

```

---

## 🔐 Authentication Flow

- User logs in at `/login`
- Server action stores token as `auth_token` (HttpOnly cookie)
- `proxy.ts` automatically:
  - Redirects unauthenticated users → `/login`
  - Redirects authenticated users → `/vouchers`
- Cookie is set with:
  - `httpOnly: true`
  - `secure: true` (because app runs under HTTPS)

---

## 🚀 Running Locally

### 1. Clone repository

```bash
git clone https://github.com/alifdwt/techtest-indico-fe.git
cd techtest-indico-fe
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment variables

Create `.env.local`:

```env
API_BASE_URL=http://localhost:8080
```

### 4. Run development server

```bash
pnpm dev
```

App will be available at:

```
http://localhost:3000
```

---

## 🐳 Running with Docker (Production-like)

Make sure backend is running in Docker and part of the same network.

### 1. `.env` file

```env
NODE_ENV=production
API_BASE_URL=http://backend:8080
PORT=3000
```

### 2. Build and run

```bash
docker compose up -d --build
```

App will be available at:

```
http://localhost:3000
```

Behind NGINX + HTTPS in production:

```
https://techtest-indico.alifdwt.com
```

---

## 🔄 CI/CD with GitHub Actions

This project uses GitHub Actions for:

1. Continuous Integration:

   - `pnpm install`
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build`

2. Continuous Deployment:

   - SSH into VPS
   - `git pull`
   - `docker compose up -d --build`

### Required Secrets

Set these in **GitHub → Settings → Secrets → Actions**:

| Name        | Value                |
| ----------- | -------------------- |
| VPS_HOST    | `127.0.0.1`          |
| VPS_USER    | Your VPS username    |
| VPS_SSH_KEY | Your private SSH key |

---

## 🌍 Production Deployment

Production setup:

- Frontend container runs at `127.0.0.1:3000`
- NGINX reverse proxy handles:

  - Domain: `techtest-indico.alifdwt.com`
  - HTTPS via Let's Encrypt

- Frontend container communicates with backend via Docker network:

```
http://backend:8080
```

---

## ✅ Final Notes

This app is built with:

- Clean architecture
- Server-first mindset
- Minimal client components
- Production-ready setup (Docker + HTTPS + CI/CD)

Thank you for reviewing this technical test 🙏
Feel free to explore the demo and source code!
