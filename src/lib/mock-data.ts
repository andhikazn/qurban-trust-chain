import cowImg from "@/assets/cow.jpg";
import goatImg from "@/assets/goat.jpg";
import sheepImg from "@/assets/sheep.jpg";

export const stats = {
  totalDana: 487500000,
  targetDana: 650000000,
  pesertaAktif: 142,
  hewanTerdaftar: 28,
  paketDistribusi: 1840,
  transaksiOnchain: 312,
};

export const animals = [
  { id: "QC-001", name: "Sapi Limosin Premium", type: "Sapi", img: cowImg, weight: 480, price: 38000000, peternak: "H. Yusuf — Boyolali", health: "Sehat A+", slots: 7, taken: 5, status: "Tersedia" },
  { id: "QC-002", name: "Sapi Brahman", type: "Sapi", img: cowImg, weight: 520, price: 42000000, peternak: "PT Ternak Berkah", health: "Sehat A+", slots: 7, taken: 7, status: "Penuh" },
  { id: "QC-003", name: "Kambing Etawa", type: "Kambing", img: goatImg, weight: 38, price: 3500000, peternak: "Pak Salim — Garut", health: "Sehat A", slots: 1, taken: 0, status: "Tersedia" },
  { id: "QC-004", name: "Domba Garut Jantan", type: "Domba", img: sheepImg, weight: 42, price: 4200000, peternak: "Koperasi Tani Sejahtera", health: "Sehat A+", slots: 1, taken: 1, status: "Penuh" },
  { id: "QC-005", name: "Sapi Simmental", type: "Sapi", img: cowImg, weight: 550, price: 45000000, peternak: "H. Mahmud — Magetan", health: "Sehat A+", slots: 7, taken: 3, status: "Tersedia" },
  { id: "QC-006", name: "Kambing Jawarandu", type: "Kambing", img: goatImg, weight: 35, price: 3200000, peternak: "Pak Idris — Cianjur", health: "Sehat A", slots: 1, taken: 0, status: "Tersedia" },
];

export const transactions = [
  { hash: "0x8f3a...c92e", peserta: "Ahmad Fauzi", amount: 5500000, animal: "QC-001", time: "2 menit lalu", block: 18472019 },
  { hash: "0x2b1d...a4f7", peserta: "Siti Aminah", amount: 3500000, animal: "QC-003", time: "12 menit lalu", block: 18472003 },
  { hash: "0xe7c4...91b2", peserta: "Budi Santoso", amount: 5500000, animal: "QC-005", time: "34 menit lalu", block: 18471987 },
  { hash: "0x4a9f...2d18", peserta: "Dewi Lestari", amount: 4200000, animal: "QC-004", time: "1 jam lalu", block: 18471942 },
  { hash: "0x6c2e...8b53", peserta: "Rahmat Hidayat", amount: 5500000, animal: "QC-001", time: "2 jam lalu", block: 18471900 },
];

export const distributions = [
  { area: "Kampung Cibadak", penerima: 145, paket: 290, status: "Selesai" },
  { area: "Desa Sukamaju", penerima: 98, paket: 196, status: "Selesai" },
  { area: "Panti Asuhan Al-Hidayah", penerima: 65, paket: 130, status: "Berlangsung" },
  { area: "Pesantren Nurul Iman", penerima: 120, paket: 240, status: "Berlangsung" },
  { area: "Kampung Cisempur", penerima: 87, paket: 174, status: "Terjadwal" },
];

export const chartProgres = [
  { bulan: "Jan", dana: 45 }, { bulan: "Feb", dana: 92 }, { bulan: "Mar", dana: 168 },
  { bulan: "Apr", dana: 245 }, { bulan: "Mei", dana: 358 }, { bulan: "Jun", dana: 487 },
];

export const chartDistribusi = [
  { hari: "H-3", paket: 0 }, { hari: "H-2", paket: 0 }, { hari: "H-1", paket: 120 },
  { hari: "H+0", paket: 680 }, { hari: "H+1", paket: 540 }, { hari: "H+2", paket: 320 }, { hari: "H+3", paket: 180 },
];

export const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID");
