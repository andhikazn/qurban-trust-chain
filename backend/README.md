# QurbanChain — Backend (Express + MySQL + JWT)

## Prasyarat
- Node.js 18+
- MySQL 8 / MariaDB (XAMPP juga bisa)

## Setup
```bash
cd backend
cp .env.example .env        # edit kredensial MySQL & JWT_SECRET
npm install

# Buat database + tabel + seed:
mysql -u root -p < schema.sql

npm run dev                 # listen di http://localhost:3000
```

## Endpoint utama
| Method | Path | Auth | Keterangan |
|---|---|---|---|
| POST | /api/auth/register | – | Daftar user |
| POST | /api/auth/login | – | Login → JWT |
| PATCH| /api/auth/wallet  | ✅ | Update wallet address |
| GET  | /api/animals      | – | List hewan |
| POST | /api/animals      | panitia | Tambah hewan |
| POST | /api/participants | ✅ | Daftar qurban |
| GET  | /api/participants/me | ✅ | Riwayat peserta |
| POST | /api/transactions | ✅ | Catat tx hash dari MetaMask |
| GET  | /api/transactions | – | Ledger publik |
| GET  | /api/transactions/stats | – | Statistik dashboard |
| GET  | /api/distributions| – | List distribusi |
| POST | /api/distributions| panitia | Tambah distribusi |

JWT dikirim via header `Authorization: Bearer <token>`.
