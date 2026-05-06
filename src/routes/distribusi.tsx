import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Package, Users, CheckCircle2, Clock, Calendar } from "lucide-react";
import { distributions } from "@/lib/mock-data";

export const Route = createFileRoute("/distribusi")({
  head: () => ({ meta: [{ title: "Tracking Distribusi — QurbanChain" }] }),
  component: DistribusiPage,
});

const statusMap = {
  Selesai: { icon: CheckCircle2, color: "text-primary bg-primary/10" },
  Berlangsung: { icon: Clock, color: "text-accent-foreground bg-accent/30" },
  Terjadwal: { icon: Calendar, color: "text-muted-foreground bg-secondary" },
} as const;

function DistribusiPage() {
  const totalPaket = distributions.reduce((s, d) => s + d.paket, 0);
  const totalPenerima = distributions.reduce((s, d) => s + d.penerima, 0);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-10 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Tracking Real-Time</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Distribusi Daging Qurban</h1>
        <p className="text-muted-foreground">Pantau setiap paket daging qurban yang dibagikan ke wilayah penerima.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-6 shadow-elegant">
          <Package className="w-6 h-6 text-gold mb-3" />
          <div className="text-xs uppercase tracking-wider opacity-80">Total Paket</div>
          <div className="font-display text-3xl font-bold">{totalPaket.toLocaleString("id-ID")}</div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-card">
          <Users className="w-6 h-6 text-primary mb-3" />
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Penerima</div>
          <div className="font-display text-3xl font-bold">{totalPenerima.toLocaleString("id-ID")}</div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-card">
          <MapPin className="w-6 h-6 text-primary mb-3" />
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Wilayah</div>
          <div className="font-display text-3xl font-bold">{distributions.length} titik</div>
        </div>
      </div>

      <div className="space-y-4">
        {distributions.map((d, i) => {
          const s = statusMap[d.status as keyof typeof statusMap];
          return (
            <div key={d.area} className="group bg-card rounded-2xl p-6 border border-border/60 shadow-card hover:shadow-elegant transition flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0 font-display text-lg font-bold text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">{d.area}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {d.penerima} penerima</span>
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {d.paket} paket</span>
                  </div>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold ${s.color}`}>
                <s.icon className="w-3.5 h-3.5" /> {d.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
