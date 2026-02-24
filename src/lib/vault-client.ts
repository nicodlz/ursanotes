import { VaultClient } from "@ursalock/client";

/** Server URL for ursalock API */
export const SERVER_URL = import.meta.env.VITE_VAULT_SERVER_URL ?? "https://vault.ndlz.net";

/** Vault name on the server */
export const VAULT_NAME = "ursanotes-vault";

export const vaultClient = new VaultClient({
  serverUrl: SERVER_URL,
  rpName: "ursanotes",
  storageKey: "ursanotes:auth",
});
