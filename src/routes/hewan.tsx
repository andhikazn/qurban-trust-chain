import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Heart, Weight, Users } from "lucide-react";
import { animals, formatRp } from "@/lib/mock-data";

export const Route = createFileRoute("/hewan")({
  head: () => ({ meta: [{ title: "Hewan Qurban — QurbanChain" }] }),
  component: HewanPage,
});

function HewanPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-10 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Katalog Hewan</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Pilih Hewan Qurban Anda</h1>
        <p className="text-muted-foreground">Setiap hewan terverifikasi sehat dengan dokumentasi lengkap dari peternak terpercaya.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.map((a) => {
          const fullSlot = a.taken >= a.slots;
          return (
            <div key={a.id} className="group bg-card rounded-2xl border border-border/60 overflow-hidden shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={a.img} alt={a.name} loading="lazy" width={1024} height={768} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-mono font-semibold">{a.id}</div>
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${fullSlot ? "bg-destructive text-destructive-foreground" : "bg-gradient-gold text-gold-foreground"}`}>
                  {a.status}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-primary font-semibold">{a.type}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Heart className="w-3 h-3 text-primary" /> {a.health}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{a.name}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5"><Weight className="w-3.5 h-3.5" /> {a.weight} kg</div>
                  <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {a.taken}/{a.slots} slot</div>
                  <div className="col-span-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {a.peternak}</div>
                </div>

                {a.slots > 1 && (
                  <div className="mb-4">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-hero rounded-full" style={{ width: `${(a.taken / a.slots) * 100}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between pt-3 border-t border-border/60">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Harga</div>
                    <div className="font-display text-lg font-bold text-primary">{formatRp(a.price)}</div>
                  </div>
                  <Link to="/daftar" className={`px-4 py-2 rounded-full text-xs font-semibold transition ${fullSlot ? "bg-secondary text-muted-foreground pointer-events-none" : "bg-primary text-primary-foreground hover:bg-emerald-deep"}`}>
                    {fullSlot ? "Penuh" : "Pilih"}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
