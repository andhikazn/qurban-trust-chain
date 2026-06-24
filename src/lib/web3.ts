// MetaMask + Ethers.js v6 integration untuk QurbanRegistry
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

// File ini di-generate oleh `blockchain/scripts/deploy.js`.
// Jika belum ada, deploy dulu contract-nya.
import contractMeta from "./contract-abi.json";

declare global {
  interface Window { ethereum?: any }
}

export const CONTRACT_ADDRESS: string = contractMeta.address;
export const CONTRACT_ABI: any = contractMeta.abi;
export const CHAIN_ID_HEX = "0x539"; // 1337 Ganache

export function hasMetaMask(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function connectWallet(): Promise<{ address: string; chainId: string }> {
  if (!hasMetaMask()) throw new Error("MetaMask tidak terdeteksi. Install ekstensi MetaMask.");
  const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
  const chainId: string = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== CHAIN_ID_HEX) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: CHAIN_ID_HEX,
          chainName: "Ganache Local",
          rpcUrls: ["http://127.0.0.1:7545"],
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        }],
      });
    }
  }
  return { address: accounts[0], chainId };
}

export async function getContract() {
  if (!hasMetaMask()) throw new Error("MetaMask tidak terdeteksi");
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/**
 * Registrasi peserta + bayar pertama via MetaMask.
 * Mengembalikan tx hash, block number, dan participantId on-chain.
 */
export async function registerParticipantOnChain(animalId: number, amountEth: string) {
  const contract = await getContract();
  const tx = await contract.registerParticipant(animalId, { value: parseEther(amountEth) });
  const receipt = await tx.wait();
  // Cari event ParticipantRegistered
  let onchainId: string | null = null;
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed?.name === "ParticipantRegistered") {
        onchainId = parsed.args[0].toString();
        break;
      }
    } catch { /* skip */ }
  }
  return {
    txHash: receipt.hash as string,
    blockNumber: Number(receipt.blockNumber),
    from: receipt.from as string,
    to: receipt.to as string,
    onchainId,
  };
}

export async function payInstallmentOnChain(participantId: number, amountEth: string) {
  const contract = await getContract();
  const tx = await contract.payInstallment(participantId, { value: parseEther(amountEth) });
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash as string,
    blockNumber: Number(receipt.blockNumber),
    from: receipt.from as string,
    to: receipt.to as string,
  };
}

export { formatEther, parseEther };
