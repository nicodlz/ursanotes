import { VaultClient } from "@ursalock/client";

// Server URL - use env var or default to production
const SERVER_URL = import.meta.env.VITE_VAULT_SERVER_URL ?? "https://vault.ndlz.net";

export const vaultClient = new VaultClient({
  serverUrl: SERVER_URL,
  rpName: "vaultmd",
  storageKey: "vaultmd:auth",
});
