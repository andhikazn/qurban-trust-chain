import { createRootRoute, HeadContent, Link, Scripts } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-primary">404</h1>
        <p className="mt-2 text-muted-foreground">Halaman tidak ditemukan.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Kembali ke Beranda</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "QurbanChain — Pengelolaan Qurban Berbasis Blockchain" },
      { name: "description", content: "Platform transparansi qurban berbasis blockchain Ethereum & smart contract Solidity untuk panitia masjid dan masyarakat." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => <Layout />,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
