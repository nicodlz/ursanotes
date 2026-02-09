import { useState, useEffect, useCallback } from "react";
import { useAuthStore, getRecoveryKey } from "@/stores/auth.js";
import { initializeVaultStore, getVaultStore, isVaultInitialized, clearVaultStore } from "@/stores/vault.js";
import { Auth } from "./Auth.js";
import { Sidebar } from "./Sidebar.js";
import { SplitView } from "./SplitView.js";
import { FileText, Loader2 } from "lucide-react";

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
      <div className="text-center">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">No note selected</h2>
        <p className="text-sm">Select a note from the sidebar or create a new one</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-[var(--accent)]" />
        <h2 className="text-lg font-medium text-[var(--text-primary)]">Decrypting vault...</h2>
        <p className="text-sm text-[var(--text-secondary)]">This may take a moment</p>
      </div>
    </div>
  );
}

function MainLayout() {
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

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
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {currentNoteId ? (
          <SplitView noteId={currentNoteId} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setVaultError = useAuthStore((s) => s.setVaultError);
  const [vaultReady, setVaultReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeVault = useCallback(async () => {
    const recoveryKey = getRecoveryKey();
    if (!recoveryKey) {
      setVaultError("No encryption key available");
      return;
    }

    setIsInitializing(true);

    try {
      await initializeVaultStore(recoveryKey);
      setVaultReady(true);
    } catch (error) {
      console.error("Vault initialization failed:", error);
      
      // Clear the vault store on failure
      clearVaultStore();
      
      // Check if this is a decryption error (wrong passphrase)
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("decrypt") || 
          errorMessage.includes("cipher") || 
          errorMessage.includes("authentication") ||
          errorMessage.includes("OperationError")) {
        setVaultError("Invalid passphrase. Unable to decrypt your vault.");
      } else {
        setVaultError(`Failed to unlock vault: ${errorMessage}`);
      }
    } finally {
      setIsInitializing(false);
    }
  }, [setVaultError]);

  useEffect(() => {
    if (isAuthenticated && !vaultReady && !isInitializing) {
      initializeVault();
    }
  }, [isAuthenticated, vaultReady, isInitializing, initializeVault]);

  // Reset vault ready state when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      setVaultReady(false);
      clearVaultStore();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Auth />;
  }

  if (isInitializing || !vaultReady) {
    return <LoadingState />;
  }

  return <MainLayout />;
}
