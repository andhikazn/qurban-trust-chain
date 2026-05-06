import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Moon, LayoutDashboard, Beef, Truck, UserPlus, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hewan", label: "Hewan Qurban", icon: Beef },
  { to: "/distribusi", label: "Distribusi", icon: Truck },
  { to: "/daftar", label: "Daftar", icon: UserPlus },
];

export function Layout() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-elegant group-hover:scale-105 transition-transform">
              <Moon className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-primary">QurbanChain</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Blockchain Transparency</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-card"
                      : "text-foreground/70 hover:text-primary hover:bg-secondary"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <Link
            to="/daftar"
            className="hidden md:inline-flex items-center gap-2 bg-gradient-gold text-gold-foreground px-5 py-2 rounded-full font-semibold text-sm shadow-gold hover:scale-105 transition-transform"
          >
            Connect Wallet
          </Link>
        </div>
        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = path === n.to;
            return (
              <Link key={n.to} to={n.to} className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap",
                active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"
              )}>
                <Icon className="w-3.5 h-3.5" /> {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-24 border-t border-border/60 bg-emerald-deep text-primary-foreground">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Moon className="w-4 h-4 text-gold-foreground" />
              </div>
              <span className="font-display text-xl font-bold">QurbanChain</span>
            </div>
            <p className="text-sm opacity-80 max-w-xs">Platform digital pengelolaan qurban berbasis blockchain Ethereum untuk transparansi penuh dana dan distribusi hewan qurban.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold">Layanan</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Patungan Sapi</li><li>Qurban Kambing/Domba</li><li>Titip Qurban</li><li>Cicilan Qurban</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold">Teknologi</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Smart Contract Solidity</li><li>Ethereum Network</li><li>MetaMask Wallet</li><li>QR Code Verification</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-4 text-center text-xs opacity-60">
          © 2026 QurbanChain — Bismillah, transparansi adalah amanah.
        </div>
      </footer>
    </div>
  );
}
