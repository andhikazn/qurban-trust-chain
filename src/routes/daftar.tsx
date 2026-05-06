import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, QrCode, CheckCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/daftar")({
  head: () => ({ meta: [{ title: "Daftar Qurban — QurbanChain" }] }),
  component: DaftarPage,
});

function DaftarPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", phone: "", layanan: "patungan-sapi", cicilan: "lunas" });

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 max-w-6xl mx-auto">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Registrasi Peserta</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Daftar Qurban Anda</h1>
          <p className="text-muted-foreground mb-8">Lengkapi formulir, hubungkan wallet MetaMask, dan dapatkan QR identitas digital.</p>

          {submitted ? (
            <div className="bg-card rounded-2xl p-10 border border-border/60 shadow-elegant text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center mb-5 shadow-elegant">
                <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Pendaftaran Berhasil</h2>
              <p className="text-sm text-muted-foreground mb-6">Transaksi tercatat di blockchain. Cek email Anda untuk QR Code identitas digital.</p>
              <div className="inline-block bg-secondary rounded-xl p-4 font-mono text-xs text-primary">Tx: 0x{Math.random().toString(16).slice(2, 10)}…{Math.random().toString(16).slice(2, 6)}</div>
              <div className="mt-6">
                <button onClick={() => setSubmitted(false)} className="text-sm text-primary font-semibold underline">Daftar peserta lain</button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-card rounded-2xl p-7 border border-border/60 shadow-card space-y-5">
              <Field label="Nama Lengkap" value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} required />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Field label="No. WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pilih Layanan</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { v: "patungan-sapi", l: "Patungan Sapi", p: "Rp 5.5jt" },
                    { v: "kambing", l: "Kambing/Domba", p: "Rp 3.5jt" },
                    { v: "titip", l: "Titip Qurban", p: "Mulai 3.2jt" },
                  ].map((o) => (
                    <label key={o.v} className={`cursor-pointer rounded-xl border-2 p-3 text-center transition ${form.layanan === o.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <input type="radio" name="layanan" value={o.v} checked={form.layanan === o.v} onChange={() => setForm({ ...form, layanan: o.v })} className="sr-only" />
                      <div className="text-sm font-semibold">{o.l}</div>
                      <div className="text-xs text-muted-foreground">{o.p}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: "lunas", l: "Bayar Lunas" }, { v: "cicilan", l: "Cicilan 3-6 bulan" }].map((o) => (
                    <label key={o.v} className={`cursor-pointer rounded-xl border-2 p-3 text-center transition ${form.cicilan === o.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <input type="radio" name="cicilan" value={o.v} checked={form.cicilan === o.v} onChange={() => setForm({ ...form, cicilan: o.v })} className="sr-only" />
                      <div className="text-sm font-semibold">{o.l}</div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="button" className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/40 rounded-xl py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition">
                <Wallet className="w-4 h-4" /> Hubungkan MetaMask
              </button>

              <button type="submit" className="w-full bg-gradient-hero text-primary-foreground py-4 rounded-xl font-semibold shadow-elegant hover:opacity-90 transition">
                Daftar & Catat di Blockchain
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-7 shadow-elegant">
            <QrCode className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">QR Identitas Digital</h3>
            <p className="text-sm opacity-90">Setelah pendaftaran, Anda menerima QR unik sebagai bukti qurban yang dapat diverifikasi siapa saja melalui blockchain.</p>
          </div>

          {[
            { icon: ShieldCheck, t: "Smart Contract Escrow", d: "Dana tersimpan aman dalam kontrak pintar hingga digunakan." },
            { icon: CheckCircle2, t: "Notifikasi Real-time", d: "Update status pembayaran, penyembelihan, dan distribusi langsung ke email." },
            { icon: Wallet, t: "MetaMask Integration", d: "Pembayaran on-chain dengan wallet pribadi Anda yang aman." },
          ].map((b) => (
            <div key={b.t} className="bg-card rounded-2xl p-5 border border-border/60 shadow-card flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold mb-1">{b.t}</h4>
                <p className="text-xs text-muted-foreground">{b.d}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      <input
        type={type} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>
  );
}
