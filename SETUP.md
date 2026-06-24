# QurbanChain — Cara Menjalankan Stack Penuh (Lokal)

Stack: **React (TanStack Start) + Express + MySQL + Solidity (Ganache) + MetaMask**.

## Struktur
```
/                 → Frontend React
/backend          → Express + MySQL + JWT  (jalan di :3000)
/blockchain       → Solidity + Hardhat + Ganache
```

## 1. Backend (Express + MySQL)
```bash
cd backend
cp .env.example .env       # edit DB_USER/DB_PASSWORD/JWT_SECRET
npm install
mysql -u root -p < schema.sql
npm run dev                # http://localhost:3000
```

## 2. Blockchain (Ganache + Smart Contract)
1. Jalankan **Ganache GUI** di `127.0.0.1:7545` (chainId 1337).
2. Copy private key salah satu akun → masukkan ke `blockchain/.env`.
```bash
cd blockchain
cp .env.example .env
npm install
npm run deploy:ganache     # akan men-generate src/lib/contract-abi.json
```

## 3. MetaMask
- Add Network manual → RPC `http://127.0.0.1:7545`, Chain ID `1337`.
- Import akun dari Ganache (private key).

## 4. Frontend
```bash
cp .env.example .env       # VITE_API_URL=http://localhost:3000
bun install
bun run dev                # http://localhost:8080
```
Buka `/daftar`, klik **Hubungkan MetaMask**, isi form, lalu daftar.
Aliran: form → MetaMask `registerParticipant()` → tx hash → POST `/api/transactions` → tersimpan MySQL → muncul di Dashboard.

## Endpoint API
Lihat `backend/README.md`.
