import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wallet, QrCode, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { api, auth } from "@/lib/api";
import { connectWallet, registerParticipantOnChain, hasMetaMask } from "@/lib/web3";

export const Route = createFileRoute("/daftar")({
  head: () => ({ meta: [{ title: "Daftar Qurban — QurbanChain" }] }),
  component: DaftarPage,
});

type Animal = {
  id: number; code: string; name: string; type: string;
  price: number | string; max_slots: number; taken_slots: number; status: string;
};

function DaftarPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ txHash: string; blockNumber: number; participantId: number } | null>(null);
  const [walletAddr, setWalletAddr] = useState<string | null>(null);

  const [form, setForm] = useState({
    nama: "", email: "", phone: "", password: "",
    animal_id: 0,
    service_type: "patungan-sapi" as "patungan-sapi" | "kambing" | "domba" | "titip",
    payment_method: "lunas" as "lunas" | "cicilan",
    amount_eth: "0.05",
  });

  useEffect(() => {
    api.listAnimals()
      .then((a) => {
        setAnimals(a);
        const first = a.find((x: Animal) => x.status === "tersedia");
        if (first) setForm((f) => ({ ...f, animal_id: first.id }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingAnimals(false));
  }, []);

  async function handleConnectWallet() {
    setError(null);
    try {
      const { address } = await connectWallet();
      setWalletAddr(address);
    } catch (e: any) { setError(e.message); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      if (!hasMetaMask()) throw new Error("MetaMask belum terpasang.");
      if (!walletAddr) throw new Error("Hubungkan wallet MetaMask terlebih dahulu.");
      if (!form.animal_id) throw new Error("Pilih hewan qurban.");

      // 1) Register / login user di backend
      let token = auth.getToken();
      if (!token) {
        try {
          const r = await api.register({
            name: form.nama, email: form.email, phone: form.phone,
            password: form.password, wallet_address: walletAddr,
          });
          auth.setToken(r.token); token = r.token;
        } catch (err: any) {
          // jika email sudah ada → coba login
          const r = await api.login({ email: form.email, password: form.password });
          auth.setToken(r.token); token = r.token;
          await api.updateWallet(walletAddr);
        }
      }

      // 2) Pembayaran ke smart contract via MetaMask
      const onchain = await registerParticipantOnChain(form.animal_id, form.amount_eth);

      // 3) Catat peserta + transaksi di MySQL
      const animal = animals.find((a) => a.id === form.animal_id)!;
      const participant = await api.registerQurban({
        animal_id: form.animal_id,
        service_type: form.service_type,
        total_amount: Number(animal.price),
        payment_method: form.payment_method,
        onchain_id: onchain.onchainId || undefined,
      });
      await api.recordTransaction({
        participant_id: participant.id,
        amount: Number(form.amount_eth) * 1e9, // simpan dalam satuan gwei→IDR mapping (demo)
        tx_hash: onchain.txHash,
        block_number: onchain.blockNumber,
        from_address: onchain.from,
        to_address: onchain.to,
        status: "confirmed",
        network: "ganache-local",
      });

      setResult({ txHash: onchain.txHash, blockNumber: onchain.blockNumber, participantId: participant.id });
    } catch (e: any) {
      setError(e.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 max-w-6xl mx-auto">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Registrasi Peserta</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Daftar Qurban Anda</h1>
          <p className="text-muted-foreground mb-8">
            Lengkapi formulir, hubungkan MetaMask, bayar via smart contract di Ganache, dan dapatkan bukti on-chain.
          </p>

          {result ? (
            <div className="bg-card rounded-2xl p-10 border border-border/60 shadow-elegant text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center mb-5 shadow-elegant">
                <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Pendaftaran Berhasil</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Peserta #{result.participantId} · Block #{result.blockNumber}
              </p>
              <div className="inline-block bg-secondary rounded-xl p-4 font-mono text-xs text-primary break-all max-w-full">
                {result.txHash}
              </div>
              <div className="mt-6">
                <button onClick={() => setResult(null)} className="text-sm text-primary font-semibold underline">
                  Daftar peserta lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-7 border border-border/60 shadow-card space-y-5">
              <Field label="Nama Lengkap" value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} required />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Field label="No. WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              </div>
              <Field label="Password (untuk akun)" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Pilih Hewan
                </label>
                {loadingAnimals ? (
                  <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Memuat hewan…</div>
                ) : (
                  <select
                    value={form.animal_id}
                    onChange={(e) => setForm({ ...form, animal_id: Number(e.target.value) })}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm"
                  >
                    <option value={0}>— Pilih hewan —</option>
                    {animals.filter((a) => a.status === "tersedia").map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.code} · {a.name} · slot {a.taken_slots}/{a.max_slots}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Layanan</label>
                <div className="grid sm:grid-cols-4 gap-3">
                  {[
                    { v: "patungan-sapi", l: "Patungan Sapi" },
                    { v: "kambing", l: "Kambing" },
                    { v: "domba", l: "Domba" },
                    { v: "titip", l: "Titip" },
                  ].map((o) => (
                    <label key={o.v} className={`cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-semibold transition ${form.service_type === o.v ? "border-primary bg-primary/5" : "border-border"}`}>
                      <input type="radio" className="sr-only" checked={form.service_type === o.v} onChange={() => setForm({ ...form, service_type: o.v as any })} />
                      {o.l}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Metode Bayar</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ v: "lunas", l: "Lunas" }, { v: "cicilan", l: "Cicilan 6×" }].map((o) => (
                      <label key={o.v} className={`cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-semibold ${form.payment_method === o.v ? "border-primary bg-primary/5" : "border-border"}`}>
                        <input type="radio" className="sr-only" checked={form.payment_method === o.v} onChange={() => setForm({ ...form, payment_method: o.v as any })} />
                        {o.l}
                      </label>
                    ))}
                  </div>
                </div>
                <Field
                  label="Bayar Pertama (ETH)"
                  value={form.amount_eth}
                  onChange={(v) => setForm({ ...form, amount_eth: v })}
                  required
                />
              </div>

              <button type="button" onClick={handleConnectWallet}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/40 rounded-xl py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition">
                <Wallet className="w-4 h-4" />
                {walletAddr ? `Wallet: ${walletAddr.slice(0, 6)}…${walletAddr.slice(-4)}` : "Hubungkan MetaMask (Ganache 1337)"}
              </button>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full bg-gradient-hero text-primary-foreground py-4 rounded-xl font-semibold shadow-elegant hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Memproses…" : "Daftar & Bayar di Blockchain"}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-7 shadow-elegant">
            <QrCode className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">Bukti On-Chain</h3>
            <p className="text-sm opacity-90">Setiap pembayaran menghasilkan transaction hash yang tersimpan di MySQL & smart contract Ganache.</p>
          </div>
          {[
            { icon: ShieldCheck, t: "Smart Contract Escrow", d: "Dana ditahan kontrak hingga ditarik panitia (fungsi withdraw)." },
            { icon: CheckCircle2, t: "Validasi Otomatis", d: "Status berubah ke 'Paid' saat paidAmount ≥ totalAmount." },
            { icon: Wallet, t: "MetaMask + Ganache", d: "Chain ID 1337, RPC 127.0.0.1:7545." },
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
