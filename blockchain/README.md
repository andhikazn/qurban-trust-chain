# QurbanChain — Smart Contract (Solidity + Hardhat + Ganache)

## Prasyarat
- Node.js 18+
- Ganache GUI (recommended) atau ganache-cli — listen di `127.0.0.1:7545`
- MetaMask browser extension

## Setup
```bash
cd blockchain
cp .env.example .env       # isi DEPLOYER_PRIVATE_KEY dari salah satu akun Ganache
npm install
npm run compile
npm run deploy:ganache
```

Output script `deploy.js` akan otomatis menulis
`src/lib/contract-abi.json` (address + ABI) untuk dipakai frontend.

## Hubungkan MetaMask ke Ganache
1. MetaMask → Add Network manual
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency: `ETH`
2. Import salah satu akun Ganache (Private Key)
3. Pilih network "Ganache" di MetaMask sebelum daftar qurban.

## Smart contract: `QurbanRegistry.sol`
Fungsi utama:
- `registerAnimal(code, type, maxSlots, pricePerSlot)` — panitia
- `registerParticipant(animalId)` payable — peserta + bayar pertama
- `payInstallment(pid)` payable — cicilan
- `validatePayment(pid)` — cek lunas
- `setAnimalStatus(animalId, status)` — tandai disembelih/terdistribusi
- `withdraw(to, amount)` — tarik dana ke rekening operasional

Setiap pembayaran men-emit event `PaymentRecorded` dengan `receiptHash`
(keccak256) yang disimpan di backend MySQL melalui `POST /api/transactions`.
