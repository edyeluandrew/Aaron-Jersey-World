# Aaron Jersey World

**Your Life Partner** — premium sportswear catalogue and quotation platform for Aaron Jersey World, Kampala.

Browse jerseys, sports equipment, trophies, custom branding, and institutional bulk supply. Request quotes online — no card payments in v1.

| | |
|---|---|
| **Location** | Arua Park Plaza, Kampala, Uganda |
| **Repository** | [github.com/edyeluandrew/Aaron-Jersey-World](https://github.com/edyeluandrew/Aaron-Jersey-World) |
| **Public site** | _Deploy frontend → paste URL here_ |
| **Admin dashboard** | _Your site URL_`/admin/login` |
| **API** | _Deploy backend → paste URL here_`/api/v1` |

---

## Live URLs (fill in after deploy)

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | [Vercel](https://vercel.com) | `https://________________.vercel.app` |
| **Backend API** | [Render](https://render.com) | `https://________________.onrender.com/api/v1` |
| **Database** | [Neon](https://neon.tech) | PostgreSQL (connection string in env) |
| **Media** | [Cloudinary](https://cloudinary.com) | Product images & form uploads |

> After deploying, set `CLIENT_URL` on the server to your Vercel URL, and `VITE_API_BASE_URL` on the client to your Render API URL (including `/api/v1`).

---

## Features

### Public website
- Product catalogue with search, filters, sorting, and pagination
- Category pages, product detail, related products
- Custom branding, institutions, trophies & awards pages
- Contact, quote, branding, and institutional enquiry forms with file uploads
- WhatsApp integration and site settings from the API

### Admin dashboard (`/admin/login`)
- JWT auth with HTTP-only cookies
- Dashboard stats (products, inquiries, quotes)
- Product & category CRUD
- Manage inquiries, quote requests, branding & institutional submissions
- Update request status and view attachments

---

## Tech stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod, Framer Motion |
| **Backend** | Node.js, Express 5, Prisma, PostgreSQL (Neon), JWT, Cloudinary |
| **Security** | Helmet, CORS, rate limiting, bcrypt, Zod validation |

---

## Project structure

```
Aaron-Jersey-World/
├── client/                 # React frontend (deploy to Vercel)
│   ├── src/
│   ├── vercel.json         # SPA routing
│   └── .env.example
├── server/                 # Express API (deploy to Render)
│   ├── prisma/
│   ├── src/
│   └── .env.example
├── render.yaml             # Render blueprint (optional)
└── package.json            # npm workspaces monorepo
```

---

## Quick start (local)

### Prerequisites
- Node.js 20+
- npm 10+
- Neon PostgreSQL database
- Cloudinary account (for uploads)

### 1. Clone & install

```bash
git clone https://github.com/edyeluandrew/Aaron-Jersey-World.git
cd Aaron-Jersey-World
npm install
```

### 2. Environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit **`server/.env`** — at minimum:

```env
DATABASE_URL=postgresql://...@...-pooler.neon.tech/...?sslmode=require
DIRECT_URL=postgresql://...@....neon.tech/...?sslmode=require
JWT_ACCESS_SECRET=your-32-char-minimum-secret
JWT_REFRESH_SECRET=your-32-char-minimum-secret
ADMIN_EMAIL=your-admin@email.com
ADMIN_INITIAL_PASSWORD=your-secure-password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Edit **`client/.env`** — local dev uses the Vite proxy:

```env
VITE_API_BASE_URL=/api/v1
```

### 3. Database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Run

```bash
# Both client + server
npm run dev

# Or separately
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Public website |
| http://localhost:5173/admin/login | Admin login |
| http://localhost:5000/api/v1/health | API health check |

---

## Deploy to production

### Backend → Render

1. Push this repo to GitHub (already done if you're reading this from the remote).
2. [Render Dashboard](https://dashboard.render.com) → **New → Web Service** → connect `edyeluandrew/Aaron-Jersey-World`.
3. Settings:
   - **Root directory:** `server`
   - **Build command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start command:** `npm start`
   - **Health check path:** `/api/v1/health`
4. Add environment variables from `server/.env.example` (use production secrets).
5. Set **`CLIENT_URL`** to your Vercel frontend URL (e.g. `https://aaron-jersey-world.vercel.app`).
6. After first deploy, run seed once via Render shell: `npm run db:seed`

**Your API base URL:** `https://<service-name>.onrender.com/api/v1`

> Or use the included `render.yaml` blueprint: **New → Blueprint** → select this repo.

### CI + Render deploy hook (GitHub Actions)

This repo includes:

| Workflow | File | What it does |
|----------|------|----------------|
| **CI** | `.github/workflows/ci.yml` | On every push/PR to `main`: validates Prisma, checks server syntax, builds the Vite client. |
| **Deploy Render API** | `.github/workflows/render-deploy.yml` | After CI passes on `main`, POSTs your Render deploy hook (if configured). |

#### 1. Create the Render deploy hook

1. [Render Dashboard](https://dashboard.render.com) → **aaron-jersey-world-api** → **Settings**
2. Scroll to **Deploy Hook** → **Create Deploy Hook**
3. Copy the URL (looks like `https://api.render.com/deploy/srv-xxxxx?key=yyyy`)

#### 2. Add the hook to GitHub Secrets

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Name: `RENDER_DEPLOY_HOOK_URL`
3. Value: paste the deploy hook URL from Render

#### 3. (Recommended) Avoid double deploys

Render auto-deploys on every push by default. If you use the GitHub deploy hook, pick **one** approach:

- **Option A — CI-gated deploys (recommended):** In Render → **Settings** → turn **Auto-Deploy** off. Deploys only run when CI passes and the hook fires.
- **Option B — Keep auto-deploy:** Leave Render auto-deploy on. The deploy hook is optional (manual redeploy via **Actions → Deploy Render API → Run workflow**).

#### 4. Manual redeploy from GitHub

**Actions** → **Deploy Render API** → **Run workflow** → triggers the hook without a new commit.

#### 5. Verify CI locally

```bash
npm run ci
```

### Frontend → Vercel

1. [Vercel Dashboard](https://vercel.com) → **Add New Project** → import `edyeluandrew/Aaron-Jersey-World`.
2. Settings:
   - **Root directory:** `client` (uses `client/vercel.json` — leave Build/Output commands **empty** in the dashboard so Vercel reads the config file)
   - **Framework preset:** Other (or Vite — clear any manual Output Directory override)
   - Do **not** set Output Directory to a custom value in the dashboard; it must stay `dist` via `client/vercel.json`
3. Environment variables:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_BASE_URL` | `https://<your-render-service>.onrender.com/api/v1` |
   | `VITE_WHATSAPP_NUMBER` | `256781161690` |
   | `VITE_GOOGLE_MAPS_EMBED_URL` | _(optional)_ Google Maps embed URL |

4. Deploy. `vercel.json` handles client-side routing for `/admin/*` and all public pages.

### Post-deploy checklist

- [ ] API health: `GET https://<api>/api/v1/health` returns `"status": "ok"`
- [ ] Frontend loads products from the API
- [ ] Admin login works at `/admin/login`
- [ ] CORS: `CLIENT_URL` on server matches exact Vercel URL (no trailing slash)
- [ ] Cloudinary uploads work on quote/branding forms

---

## API overview

Base path: `/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Health check |
| GET | `/categories` | — | List categories |
| GET | `/products` | — | Search & filter products |
| POST | `/inquiries` | — | Contact enquiry |
| POST | `/quotes` | — | Quote request |
| POST | `/branding-requests` | — | Branding request |
| POST | `/institutional-requests` | — | Institutional request |
| POST | `/uploads/request-file` | — | Public file upload |
| POST | `/auth/login` | — | Admin login |
| GET | `/auth/me` | Cookie | Current admin user |
| GET | `/admin/dashboard` | Admin | Dashboard stats |
| GET | `/admin/products` | Admin | Manage products |
| GET | `/admin/inquiries` | Admin | List inquiries |

---

## Admin access

Created by the seed script using `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` in `server/.env`.

```
https://<your-frontend-url>/admin/login
```

Never commit real passwords or `.env` files.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server concurrently |
| `npm run build:client` | Production frontend build |
| `npm run start:server` | Start API (production) |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed categories, products, admin user |
| `npm run db:studio` | Open Prisma Studio |

---

## Implementation status

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ | Monorepo, Tailwind, Express foundation |
| 2 | ✅ | Prisma schema, migrations, seed |
| 3 | ✅ | JWT auth, HTTP-only cookies |
| 4 | ✅ | Product & category catalogue API |
| 5 | ✅ | Cloudinary uploads |
| 6 | ✅ | Public layout, routing, API hooks |
| 7 | ✅ | All public pages |
| 8 | ✅ | Enquiry forms + file uploads |
| 9 | ✅ | Admin dashboard |
| 10 | 🔜 | SEO, a11y, performance polish |
| 11 | 🔜 | Production hardening |

---

## Security

- JWT in HTTP-only cookies (not localStorage)
- bcrypt password hashing
- Helmet, CORS, rate limiting
- Zod validation on all inputs
- Secrets only in environment variables — never in Git

---

## License

Private — © Aaron Jersey World. All rights reserved.
