<script lang="ts">
  import { page } from "$app/state";
  import { canFrameApps } from "$platform";
  import { brand } from "$lib/brand";
  import Mark from "$lib/Mark.svelte";
  import Icon from "$lib/Icon.svelte";
  import { nav, pathOf, type Tab } from "$lib/nav.svelte";

  const route = $derived(pathOf(page.url.hash));
  const onHome = $derived(route === "/");
  const atSettings = $derived(route.startsWith("/settings") || route.startsWith("/grants") || route.startsWith("/assets"));

  /** On home, a panel switches in place, as a tab does; elsewhere the link opens home on it. */
  function switchTo(event: MouseEvent, tab: Tab) {
    if (!onHome) return;
    event.preventDefault();
    nav.tab = tab;
  }
</script>

<!-- Docked to the bottom edge as each screen's header is to the top: it stays put while the page scrolls. -->
<nav class="bottom-bar" aria-label="Wallet">
  {#if brand === "blockfab"}
    <!-- Shown only as the head of the wide rail (brand/blockfab.css). -->
    <a class="rail-brand" href="#/" data-rail-brand><Mark size={28} /><span>ECX Wallet</span></a>
  {/if}
  <div class="bar-items" role={onHome ? "tablist" : undefined}>
    <!-- Links, so any screen can open home on a panel (`?tab=`). -->
    <a
      class="bar-item"
      href="#/?tab=assets"
      onclick={(e) => switchTo(e, "assets")}
      role={onHome ? "tab" : undefined}
      aria-selected={onHome ? nav.tab === "assets" : undefined}
      data-nav="assets"
      data-tab={onHome ? "assets" : undefined}
    >
      <Icon name="wallet" size={20} />
      <span>Assets</span>
    </a>
    <a
      class="bar-item"
      href="#/?tab=activity"
      onclick={(e) => switchTo(e, "activity")}
      role={onHome ? "tab" : undefined}
      aria-selected={onHome ? nav.tab === "activity" : undefined}
      data-nav="activity"
      data-tab={onHome ? "activity" : undefined}
    >
      <span class="bar-icon">
        <Icon name="history" size={20} />
        {#if nav.deposits > 0}<span class="count" title="Deposits in progress">{nav.deposits}</span>{/if}
      </span>
      <span>Activity</span>
    </a>
  </div>
  {#if canFrameApps}
    <a class="bar-item" href="#/apps" aria-current={route === "/apps" ? "page" : undefined} data-nav="apps" data-apps-link>
      <Icon name="apps" size={20} />
      <span>Apps</span>
    </a>
  {/if}
  <a class="bar-item" href="#/chains" aria-current={route === "/chains" ? "page" : undefined} data-nav="chains" data-chains-link-bar>
    <Icon name="layers" size={20} />
    <span>Chains</span>
  </a>
  <a class="bar-item" href="#/settings" aria-current={atSettings ? "page" : undefined} data-nav="settings" data-settings-link>
    <Icon name="settings" size={20} />
    <span>Settings</span>
  </a>
  {#if brand === "blockfab"}
    <a class="rail-credit" href="https://blockfab.org/" target="_blank" rel="noopener noreferrer" data-rail-credit>
      <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1.5" fill="currentColor" /><rect x="18" y="2" width="12" height="12" rx="1.5" style="fill:var(--mark)" /><rect x="2" y="18" width="12" height="12" rx="1.5" style="fill:var(--mark)" /><rect x="18" y="18" width="12" height="12" rx="1.5" fill="currentColor" /></svg>
      <span><small>Hosted by</small><b>BlockFab</b></span>
    </a>
  {/if}
</nav>

<style>
  /* The bottom bar: Assets and Activity switch the panel, Chains opens its quick menu, Settings its screen. */
  /* Below the screen's scrolling area, as the header is above it: it stays put while the page scrolls. */
  .bottom-bar {
    flex: none;
    z-index: 6;
    display: flex;
    width: 100%;
    gap: 2px;
    max-width: 440px;
    margin: 0 auto;
    padding: 6px 10px 8px;
    border-top: 1px solid var(--glass-border);
    background: color-mix(in srgb, var(--bg) 62%, transparent);
    -webkit-backdrop-filter: var(--glass-blur);
    backdrop-filter: var(--glass-blur);
  }
  .bar-items {
    display: contents;
  }
  .bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 50px;
    padding: 0;
    border: none;
    border-radius: 15px;
    background: none;
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s, background-color 0.25s, transform 0.25s var(--ease-spring);
  }
  .bar-item:hover {
    background: color-mix(in srgb, var(--surface-2) 60%, transparent);
    color: var(--text);
  }
  .bar-item:active {
    transform: scale(0.94);
  }
  .bar-item[aria-selected="true"],
  .bar-item[aria-current="page"] {
    background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--accent) 8%, transparent));
    box-shadow: inset 0 1px 0 var(--glass-edge);
    color: var(--accent-text);
  }
  .bar-item[aria-selected="true"] :global(svg),
  .bar-item[aria-current="page"] :global(svg) {
    animation: pop 0.4s var(--ease-spring);
  }
  .bar-icon {
    position: relative;
    display: flex;
  }
  /* A host's head and foot for the wide rail: hidden unless its brand shows them. */
  .rail-brand,
  .rail-credit {
    display: none;
    align-items: center;
    gap: 11px;
    color: var(--text);
    text-decoration: none;
  }
  .rail-brand {
    padding: 2px 10px 22px;
    font-size: 1.25rem;
    font-weight: 750;
    letter-spacing: -0.06em;
  }
  .rail-credit {
    margin-top: 10px;
    padding: 14px 12px 4px;
    border-top: 1px solid var(--border);
    color: var(--muted);
  }
  .rail-credit span {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
  .rail-credit small {
    font-size: 0.68rem;
  }
  .rail-credit b {
    color: var(--text);
    font-size: 0.98rem;
    font-weight: 750;
    letter-spacing: -0.06em;
  }
  .rail-credit:hover b {
    color: var(--mark);
  }
  /* Wide (layout.svelte.ts): the same bar as a rail down the left, Settings at its foot. */
  :global(html[data-layout="wide"]) .bottom-bar {
    flex-direction: column;
    justify-content: flex-start;
    gap: 4px;
    width: 236px;
    max-width: none;
    margin: 0;
    padding: 22px 14px 18px;
    border-top: none;
    border-right: 1px solid var(--glass-border);
  }
  :global(html[data-layout="wide"]) .bar-item {
    flex: none;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    min-height: 46px;
    padding: 0 14px;
    font-size: 0.92rem;
  }
  :global(html[data-layout="wide"]) .bar-item[data-nav="settings"] {
    margin-top: auto;
  }
  :global(html[data-layout="wide"]) .count {
    position: static;
    margin-left: 6px;
  }
  .count {
    position: absolute;
    top: -6px;
    right: -12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--on-accent);
    font-size: 0.7rem;
  }
</style>
