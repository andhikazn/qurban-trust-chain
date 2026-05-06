import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Link2, QrCode, Users, Beef, Truck, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-mosque.jpg";
import { stats, formatRp } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "QurbanChain — Qurban Transparan dengan Blockchain" },
    { name: "description", content: "Daftar qurban patungan sapi, kambing, atau titip qurban dengan transparansi penuh berbasis smart contract Ethereum." },
  ]}),
  component: Home,
});

function Home() {
  const progres = Math.round((stats.totalDana / stats.targetDana) * 100);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" width={1536} height={1024} />
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="relative container mx-auto px-6 py-24 md:py-36 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-primary-foreground">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Powered by Ethereum Smart Contract
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] text-balance mb-6">
              Qurban <span className="text-gold italic">Transparan</span>,<br /> Amanah Terjaga.
            </h1>
            <p className="text-lg opacity-90 max-w-lg mb-8 text-balance">
              Platform pengelolaan qurban modern berbasis blockchain. Setiap rupiah, setiap hewan, dan setiap paket daging tercatat permanen — tidak dapat dimanipulasi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/daftar" className="inline-flex items-center gap-2 bg-gradient-gold text-gold-foreground px-7 py-3.5 rounded-full font-semibold shadow-gold hover:scale-105 transition-transform">
                Daftar Qurban Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur border border-primary-foreground/30 text-primary-foreground px-7 py-3.5 rounded-full font-semibold hover:bg-primary-foreground/20 transition">
                Lihat Dashboard
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: stats.pesertaAktif, l: "Peserta" },
                { v: stats.hewanTerdaftar, l: "Hewan" },
                { v: stats.transaksiOnchain, l: "On-chain Tx" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-bold text-gold">{s.v}</div>
                  <div className="text-xs uppercase tracking-wider opacity-70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live progress card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-3xl rounded-3xl" />
            <div className="relative bg-card rounded-3xl shadow-elegant p-8 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Live Ledger</div>
                  <div className="font-display text-2xl font-bold">Idul Adha 1447 H</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> LIVE
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total Terkumpul</span>
                  <span className="font-semibold text-primary">{progres}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-hero rounded-full transition-all" style={{ width: `${progres}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                  <span className="font-mono font-semibold text-foreground">{formatRp(stats.totalDana)}</span>
                  <span>dari {formatRp(stats.targetDana)}</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { hash: "0x8f3a…c92e", who: "Ahmad F.", amt: "5.5 jt" },
                  { hash: "0x2b1d…a4f7", who: "Siti A.", amt: "3.5 jt" },
                  { hash: "0xe7c4…91b2", who: "Budi S.", amt: "5.5 jt" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
                        <Link2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t.who}</div>
                        <div className="text-xs font-mono text-muted-foreground">{t.hash}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">Rp {t.amt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">Fitur Utama</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-balance">Transparansi yang dapat <span className="text-primary italic">dibuktikan</span></h2>
          <p className="text-muted-foreground">Setiap proses qurban — dari donasi hingga pembagian daging — tercatat di blockchain dan dapat diverifikasi siapa saja.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, t: "Smart Contract Solidity", d: "Validasi pembayaran otomatis dan immutable melalui kontrak pintar Ethereum." },
            { icon: Link2, t: "Catatan Immutable", d: "Setiap transaksi tercatat permanen dan tidak dapat diubah atau dihapus." },
            { icon: QrCode, t: "QR Identitas Digital", d: "Setiap peserta memiliki QR unik sebagai bukti qurban yang dapat diverifikasi." },
            { icon: Users, t: "Patungan Sapi", d: "Kelola kelompok hingga 7 peserta dengan slot transparan dan real-time." },
            { icon: Beef, t: "Data Hewan Lengkap", d: "Foto, video, berat, kondisi kesehatan, dan asal peternak terdokumentasi." },
            { icon: Truck, t: "Tracking Distribusi", d: "Pantau penerima, wilayah, dan jumlah paket daging yang dibagikan." },
          ].map((f) => (
            <div key={f.t} className="group relative bg-card rounded-2xl p-7 border border-border/60 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gradient-soft py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4">Layanan Qurban</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">Pilih jenis qurban Anda</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { t: "Patungan Sapi", price: "Rp 5.500.000", desc: "Bergabung dalam kelompok hingga 7 peserta untuk satu ekor sapi premium.", features: ["Slot real-time", "Smart contract escrow", "Kelola kelompok"], featured: false },
              { t: "Kambing / Domba", price: "Rp 3.500.000", desc: "Qurban mandiri kambing atau domba berkualitas dari peternak terpercaya.", features: ["Pilihan hewan langsung", "Sertifikat NFT", "Dokumentasi lengkap"], featured: true },
              { t: "Titip Qurban", price: "Mulai Rp 3.200.000", desc: "Titipkan qurban Anda kepada panitia masjid dengan transparansi penuh.", features: ["Cicilan tersedia", "Laporan otomatis", "QR verifikasi"], featured: false },
            ].map((s) => (
              <div key={s.t} className={`relative rounded-3xl p-8 border ${s.featured ? "bg-gradient-hero text-primary-foreground border-transparent shadow-elegant scale-105" : "bg-card border-border/60 shadow-card"}`}>
                {s.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-gold-foreground text-xs font-bold px-4 py-1 rounded-full shadow-gold">PALING POPULER</div>}
                <h3 className="font-display text-2xl font-bold mb-2">{s.t}</h3>
                <div className="font-display text-4xl font-bold mb-3">{s.price}</div>
                <p className={`text-sm mb-6 ${s.featured ? "opacity-80" : "text-muted-foreground"}`}>{s.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 ${s.featured ? "text-gold" : "text-primary"}`} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/daftar" className={`block text-center py-3 rounded-full font-semibold transition ${s.featured ? "bg-gradient-gold text-gold-foreground shadow-gold hover:scale-105" : "bg-primary text-primary-foreground hover:bg-emerald-deep"}`}>
                  Pilih Layanan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-20 text-center text-primary-foreground shadow-elegant">
          <div className="absolute inset-0 islamic-pattern opacity-20" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-balance">Mulai qurban Anda dengan amanah</h2>
            <p className="opacity-90 mb-8">Hubungkan MetaMask wallet Anda dan rasakan transparansi qurban tingkat berikutnya.</p>
            <Link to="/daftar" className="inline-flex items-center gap-2 bg-gradient-gold text-gold-foreground px-8 py-4 rounded-full font-semibold shadow-gold hover:scale-105 transition-transform">
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
