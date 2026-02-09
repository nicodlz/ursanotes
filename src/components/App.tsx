import { useState, useEffect, useCallback } from "react";
import { useAuth, type ZKCredential } from "@zod-vault/client";
import { vaultClient } from "../lib/vault-client.js";
import { initializeVaultStore, getVaultStore, isVaultInitialized, clearVaultStore } from "../stores/vault.js";
import { Auth } from "./Auth.js";
import { Sidebar, MobileSidebar, MobileMenuButton } from "./Sidebar.js";
import { SplitView } from "./SplitView.js";
import { FileText, Loader2 } from "lucide-react";

// Store credential in memory after auth
let currentCredential: ZKCredential | null = null;

export function setCredential(credential: ZKCredential | null): void {
  currentCredential = credential;
}

export function getCredential(): ZKCredential | null {
  return currentCredential;
}

function EmptyState({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="h-full flex flex-col">
      {/* Mobile header with menu button */}
      <div className="flex md:hidden items-center gap-2 p-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <MobileMenuButton onClick={onMenuClick} />
        <div className="flex items-center gap-2">
          <span className="text-lg">🔐</span>
          <h1 className="font-semibold text-[var(--text-primary)]">VaultMD</h1>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)] p-4">
        <div className="text-center">
          <FileText className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">No note selected</h2>
          <p className="text-sm">Select a note from the sidebar or create a new one</p>
        </div>
      </div>
    </div>
  );
}

function LoadingState({ message }: { message?: string }) {
  return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="text-center">
        <Loader2 className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 animate-spin text-[var(--accent)]" />
        <h2 className="text-base md:text-lg font-medium text-[var(--text-primary)]">
          {message ?? "Loading..."}
        </h2>
      </div>
    </div>
  );
}

function MainLayout() {
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isVaultInitialized()) {
      const store = getVaultStore();
      const state = store.getState();
      setCurrentNoteId(state.currentNoteId);

      // Subscribe to changes
      const unsubscribe = store.subscribe((state) => {
        setCurrentNoteId(state.currentNoteId);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Mobile Sidebar - drawer */}
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {currentNoteId ? (
          <SplitView noteId={currentNoteId} onMenuClick={() => setSidebarOpen(true)} />
        ) : (
          <EmptyState onMenuClick={() => setSidebarOpen(true)} />
        )}
      </div>
    </div>
  );
}

export function App() {
  const { isAuthenticated, isLoading: isAuthLoading, credential: stateCredential } = useAuth(vaultClient);
  const [vaultReady, setVaultReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  const initializeVault = useCallback(async (providedCredential?: ZKCredential) => {
    const credential = providedCredential ?? stateCredential ?? getCredential();
    
    // If no credential, we can't initialize (shouldn't happen in normal flow)
    if (!credential) {
      console.error("No credential available for vault initialization");
      setVaultError("No encryption key available. Please sign in again.");
      return;
    }

    setIsInitializing(true);
    setVaultError(null);

    try {
      // Use the cipherJwk from the credential for encryption
      await initializeVaultStore(credential.cipherJwk);
      
      // Store for future use in this session
      if (providedCredential) {
        setCredential(providedCredential);
      }
      setVaultReady(true);
    } catch (error) {
      console.error("Vault initialization failed:", error);
      
      // Clear the vault store on failure
      clearVaultStore();
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      setVaultError(`Failed to initialize vault: ${errorMessage}`);
    } finally {
      setIsInitializing(false);
    }
  }, [stateCredential]);

  const handleAuthenticated = useCallback((credential: ZKCredential) => {
    setCredential(credential);
    // Immediately initialize vault with the credential
    void initializeVault(credential);
  }, [initializeVault]);

  // If we have state credential but no vault yet, initialize
  useEffect(() => {
    if (isAuthenticated && stateCredential && !vaultReady && !isInitializing && !vaultError) {
      initializeVault(stateCredential);
    }
  }, [isAuthenticated, stateCredential, vaultReady, isInitializing, vaultError, initializeVault]);

  // Reset vault ready state when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      setVaultReady(false);
      setVaultError(null);
      setCredential(null);
      clearVaultStore();
    }
  }, [isAuthenticated]);

  // Auth still loading
  if (isAuthLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  // Vault error
  if (vaultError) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
        <div className="text-center max-w-md">
          <h2 className="text-lg md:text-xl font-semibold text-red-400 mb-2">Vault Error</h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] mb-4">{vaultError}</p>
          <button
            onClick={() => {
              setVaultError(null);
              vaultClient.signOut();
            }}
            className="text-[var(--accent)] hover:underline touch-manipulation py-2"
          >
            Sign out and try again
          </button>
        </div>
      </div>
    );
  }

  // Initializing vault
  if (isInitializing || !vaultReady) {
    return <LoadingState message="Decrypting vault..." />;
  }

  return <MainLayout />;
}
