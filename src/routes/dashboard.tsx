import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, Beef, Package, Activity, ExternalLink } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { stats, transactions, chartProgres, chartDistribusi, formatRp } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — QurbanChain" }] }),
  component: Dashboard,
});

function Dashboard() {
  const cards = [
    { icon: Wallet, label: "Total Dana Terkumpul", value: formatRp(stats.totalDana), trend: "+12.4%", color: "from-primary to-emerald-deep" },
    { icon: TrendingUp, label: "Target Dana", value: formatRp(stats.targetDana), trend: "75%", color: "from-accent to-gold" },
    { icon: Beef, label: "Hewan Terdaftar", value: stats.hewanTerdaftar.toString(), trend: "+3 minggu ini", color: "from-primary to-emerald-deep" },
    { icon: Package, label: "Paket Distribusi", value: stats.paketDistribusi.toLocaleString("id-ID"), trend: "+248 hari ini", color: "from-accent to-gold" },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Admin Panel</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Dashboard Panitia</h1>
        <p className="text-muted-foreground mt-2">Monitoring real-time aktivitas qurban dan transaksi blockchain.</p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="relative overflow-hidden bg-card rounded-2xl p-6 border border-border/60 shadow-card group hover:shadow-elegant transition">
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${c.color} opacity-10 group-hover:opacity-20 transition`} />
            <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-card`}>
              <c.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{c.label}</div>
            <div className="font-display text-2xl font-bold">{c.value}</div>
            <div className="text-xs text-primary font-medium mt-2">{c.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-display text-xl font-bold">Progres Dana Terkumpul</h3>
              <p className="text-xs text-muted-foreground">6 bulan terakhir (juta Rp)</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">Tren ↑</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartProgres}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.42 0.09 160)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="oklch(0.42 0.09 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 110)" />
              <XAxis dataKey="bulan" stroke="oklch(0.5 0.02 160)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.02 160)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.015 110)" }} />
              <Area type="monotone" dataKey="dana" stroke="oklch(0.42 0.09 160)" strokeWidth={3} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-display text-xl font-bold">Distribusi Paket Daging</h3>
              <p className="text-xs text-muted-foreground">Timeline H-3 hingga H+3</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-gold-foreground font-medium">1.840 paket</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartDistribusi}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 110)" />
              <XAxis dataKey="hari" stroke="oklch(0.5 0.02 160)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.02 160)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.015 110)" }} />
              <Bar dataKey="paket" fill="oklch(0.78 0.13 82)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Blockchain ledger */}
      <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Blockchain Ledger</h3>
              <p className="text-xs text-muted-foreground">Smart contract: 0x9aF…3D2c · Ethereum Mainnet</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Streaming
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Tx Hash</th>
                <th className="text-left p-4">Peserta</th>
                <th className="text-left p-4">Hewan</th>
                <th className="text-right p-4">Jumlah</th>
                <th className="text-left p-4">Block</th>
                <th className="text-left p-4">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.hash} className="border-t border-border/40 hover:bg-secondary/30 transition">
                  <td className="p-4 font-mono text-primary flex items-center gap-1.5">{t.hash}<ExternalLink className="w-3 h-3 opacity-50" /></td>
                  <td className="p-4 font-medium">{t.peserta}</td>
                  <td className="p-4 text-muted-foreground">{t.animal}</td>
                  <td className="p-4 text-right font-semibold">{formatRp(t.amount)}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">#{t.block}</td>
                  <td className="p-4 text-muted-foreground">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
