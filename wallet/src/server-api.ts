// Which client speaks to a chain's Sidechain Server: the Server API its Chain Entry names.
import type { SessionCache } from "./cache";
import type { ChainEntry, NetworkEntry, OutputTokens, ServerApi } from "./chain-module";
import { esploraServer, FLUSH_STALL_SECONDS, type EsploraServerConfig, type HistoryStore } from "./esplora";
import type { TradeStore } from "./flush-trades";
import { SidechainServerError, type Fetch, type SidechainServer } from "./sidechain-server";
import { sidepotServer } from "./sidepot";
import { standardSidechainServer } from "./standard-sidechain-api";

/** True if the wallet reads a server of this API as Esplora: `esplora`, and Flush's (`flush`), which adds to it. */
export const speaksEsplora = (api: ServerApi): boolean => api === "esplora" || api === "flush";

/**
 * `network`'s default server's base URL. A Chain Entry may name a path on the wallet's own origin
 * instead of a URL (`/esplora`), for a web wallet served beside its servers under a hostname the
 * build doesn't know (docs/adr/0021): it resolves against the origin the wallet runs at.
 */
export function serverUrl(network: NetworkEntry, origin: string | undefined = (globalThis as { location?: { origin?: string } }).location?.origin): string {
  const { url } = network.sidechainServer;
  if (!/^\/(?!\/)/.test(url)) return url;
  if (origin === undefined || !/^https?:\/\//.test(origin)) {
    throw new SidechainServerError(url, `${network.chain}'s server is the path ${url} on the wallet's own site, so only a web wallet served over http(s) can reach it.`);
  }
  return `${origin}${url}`;
}

/**
 * How to reach `network`'s default server over Esplora: Flush's (`flush`) also reports finality
 * and can stall (docs/adr/0012). `tokens` reads what a transaction's outputs carry, where the
 * chain's module declares it (docs/adr/0013); `tradeStore` keeps what Flush's market index said of
 * a trade once final (docs/adr/0017); `historyStore` keeps each address's settled history (docs/adr/0020).
 */
export function esploraConfig(
  entry: ChainEntry,
  network: NetworkEntry,
  cache?: SessionCache,
  tokens?: (tx: string) => Promise<OutputTokens | undefined>,
  tradeStore?: TradeStore,
  historyStore?: HistoryStore,
): EsploraServerConfig {
  const { api } = network.sidechainServer;
  const url = serverUrl(network);
  const flush = api === "flush" ? { finality: true, stallAfter: FLUSH_STALL_SECONDS, ...(tradeStore === undefined ? {} : { tradeStore }) } : {};
  const stores = historyStore === undefined ? {} : { historyStore };
  return { url, identityBlock: network.identityBlock, chainName: entry.name, cache, ...flush, ...stores, ...(tokens === undefined ? {} : { tokens }) };
}

/** A client for `network`'s default Sidechain Server, in the Server API its Chain Entry names. */
export function sidechainServer(
  entry: ChainEntry,
  network: NetworkEntry,
  fetchFn: Fetch = (...args) => fetch(...args),
  cache?: SessionCache,
  tokens?: (tx: string) => Promise<OutputTokens | undefined>,
  tradeStore?: TradeStore,
  historyStore?: HistoryStore,
): SidechainServer {
  const { api } = network.sidechainServer;
  const url = serverUrl(network);
  switch (api) {
    case "ecx-v0":
      return standardSidechainServer(url, fetchFn);
    case "esplora":
    case "flush":
      return esploraServer(esploraConfig(entry, network, cache, tokens, tradeStore, historyStore), fetchFn);
    case "sidepot":
      return sidepotServer(url, fetchFn);
    default:
      throw new SidechainServerError(url, `${entry.name}'s Chain Entry names a Server API this wallet doesn't speak: ${String(api)}.`);
  }
}
