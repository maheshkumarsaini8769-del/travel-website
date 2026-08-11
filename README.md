# Sunsky Tourism — Travel Website

Next.js 14 travel website for Sunsky Tourism (Sikar) with a MongoDB-backed admin panel.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` (never commit it):

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sunsky
ADMIN_PASSWORD=<change-this>
ADMIN_SECRET=<long-random-string>
```

- `MONGODB_URI` — Atlas connection string. Make sure your IP is whitelisted in Atlas → Network Access, otherwise TLS handshakes are rejected (`tlsv1 alert internal error`).
- `ADMIN_PASSWORD` — password for the admin panel at `/admin`.
- `ADMIN_SECRET` — used to sign the admin session cookie.

## Admin panel

Visit `/admin` (login with `ADMIN_PASSWORD`). You can:

- **Packages** — list, create, edit and delete travel packages. "Seed from defaults" copies the static packages from `src/data/packages.ts` into MongoDB (upsert, keeps your edits).
- **Images** — upload images into MongoDB and copy their `/api/images/...` URLs into a package's cover/gallery fields.

Packages are served **database-first with static fallback**: every public page (home, `/packages`, search, booking, sitemap) loads `/api/packages`, which merges MongoDB documents over the static defaults. If MongoDB is unreachable, the site keeps working with the static data.

## API

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | — | Login, sets `admin_session` cookie |
| POST | `/api/auth/logout` | cookie | Logout |
| GET | `/api/admin/me` | cookie | Session check |
| POST | `/api/admin/seed` | cookie | Upsert static packages into MongoDB |
| GET | `/api/packages` | — | Public merged package list |
| POST | `/api/packages` | cookie | Create package |
| GET/PUT/DELETE | `/api/packages/[id]` | cookie (GET public) | Read / update / delete |
| GET/POST | `/api/images` | cookie (GET/POST) | List / upload image |
| GET/DELETE | `/api/images/[id]` | cookie (DELETE) | Serve / delete image |

## Notes

- `src/data/packages.ts` remains the source of truth until the DB is seeded; after that, edits win.
- Deleting a package also deletes its stored images.
