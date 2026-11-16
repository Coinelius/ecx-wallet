// Where a transaction or an address can be looked up, for a build whose host has a block explorer
// (brand.ts). Keyed by chain (CAIP-2). Without one, nothing is linked. Following a link tells the
// explorer which transaction or address the reader cares about, as any explorer visit does.
import { brand } from "$lib/brand";

const EXPLORERS: Record<string, Record<string, string>> = {
  blockfab: {
    "ecash:mainnet": "https://explorer.blockfab.org",
    "ecash:mainnet-s46": "https://explorer.blockfab.org/flush",
  },
};

/** The main chain a Slot's chain is under (itself, for the main chain). */
export const mainChainOf = (chain: string) => chain.replace(/-s\d+$/, "");

export function explorerTx(chain: string | undefined, txid: string): string | undefined {
  const base = chain === undefined ? undefined : EXPLORERS[brand]?.[chain];
  return base !== undefined && /^[0-9a-f]{64}$/.test(txid) ? `${base}/tx/${txid}` : undefined;
}

export function explorerAddress(chain: string | undefined, address: string): string | undefined {
  const base = chain === undefined ? undefined : EXPLORERS[brand]?.[chain];
  return base !== undefined && /^[0-9a-zA-Z]{14,128}$/.test(address) ? `${base}/address/${address}` : undefined;
}
