<script lang="ts">
  // A transaction id or an address, linked to its chain's explorer where the build has one
  // (explorer.ts); just what it wraps otherwise. Opens a tab of its own, with no referrer.
  import type { Snippet } from "svelte";
  import { explorerAddress, explorerTx } from "$lib/explorer";

  let { chain, tx, address, children }: { chain: string | undefined; tx?: string; address?: string; children: Snippet } = $props();
  const href = $derived(tx !== undefined ? explorerTx(chain, tx) : address !== undefined ? explorerAddress(chain, address) : undefined);
</script>

{#if href}<a class="explorer" {href} target="_blank" rel="noopener noreferrer" title="Open in the block explorer" data-explorer-link>{@render children()}</a>{:else}{@render children()}{/if}

<style>
  /* No box of its own: what it wraps keeps its place in the row (a long id still cuts off with …). */
  .explorer {
    display: contents;
    color: inherit;
  }
  .explorer :global(code) {
    color: inherit;
    cursor: pointer;
    text-decoration: underline dotted;
    text-decoration-color: var(--mark, var(--accent-text));
    text-underline-offset: 3px;
  }
  .explorer:hover :global(code),
  .explorer:focus-visible :global(code) {
    color: var(--mark, var(--accent-text));
    text-decoration-style: solid;
  }
</style>
