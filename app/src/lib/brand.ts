// A host's own look for a build it serves, picked at build time (`VITE_BRAND=blockfab pnpm build:web`).
// Unset, the wallet looks as it does everywhere else. The styles are in src/brand/.
export const brand: string = import.meta.env.VITE_BRAND ?? "";
