// REST client untuk backend Express (lihat /backend)
const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";
const TOKEN_KEY = "qurbanchain.token";

export const auth = {
  getToken: () => (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = auth.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // auth
  register: (data: { name: string; email: string; phone?: string; password: string; wallet_address?: string }) =>
    request<{ token: string; user: any }>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  updateWallet: (wallet_address: string) =>
    request<{ ok: true }>("/api/auth/wallet", { method: "PATCH", body: JSON.stringify({ wallet_address }) }),

  // animals
  listAnimals: () => request<any[]>("/api/animals"),

  // participants
  registerQurban: (data: {
    animal_id: number;
    service_type: "patungan-sapi" | "kambing" | "domba" | "titip";
    total_amount: number;
    payment_method?: "lunas" | "cicilan";
    onchain_id?: string;
  }) => request<{ id: number; slot_number: number }>("/api/participants", { method: "POST", body: JSON.stringify(data) }),

  myParticipants: () => request<any[]>("/api/participants/me"),

  // transactions
  recordTransaction: (data: {
    participant_id: number;
    amount: number;
    tx_hash: string;
    block_number?: number;
    from_address?: string;
    to_address?: string;
    status?: "pending" | "confirmed" | "failed";
    network?: string;
    installment_id?: number;
  }) => request<{ id: number }>("/api/transactions", { method: "POST", body: JSON.stringify(data) }),

  listTransactions: () => request<any[]>("/api/transactions"),
  stats: () => request<{
    totalDana: number; pesertaAktif: number; hewanTerdaftar: number;
    paketDistribusi: number; transaksiOnchain: number;
  }>("/api/transactions/stats"),

  // distributions
  listDistributions: () => request<any[]>("/api/distributions"),
};
