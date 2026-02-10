import { useState } from "react";
import { useSignUp, useSignIn, usePasskeySupport, type ZKCredential } from "@ursalock/client";
import { vaultClient } from "../lib/vault-client.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Fingerprint, Lock, Loader2, AlertTriangle, ShieldX } from "lucide-react";

interface AuthProps {
  /** Called when authentication succeeds with the credential for encryption */
  onAuthenticated: (credential: ZKCredential) => void;
}

export function Auth({ onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);

  const supportsPasskey = usePasskeySupport(vaultClient);
  const { signUp, isLoading: isSigningUp } = useSignUp(vaultClient);
  const { signIn, isLoading: isSigningIn } = useSignIn(vaultClient);

  const isLoading = isSigningUp || isSigningIn;

  const handleSignUp = async () => {
    setError(null);
    try {
      const result = await signUp({ usePasskey: true });
      if (result.success && result.credential) {
        // Pass credential with encryption keys to parent
        onAuthenticated(result.credential);
      } else {
        setError(result.error ?? "Sign up failed");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err instanceof Error ? err.message : "Sign up failed");
    }
  };

  const handleSignIn = async () => {
    setError(null);
    try {
      const result = await signIn({ usePasskey: true });
      if (result.success && result.credential) {
        // Pass credential with encryption keys to parent
        onAuthenticated(result.credential);
      } else {
        setError(result.error ?? "Sign in failed");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  };

  // WebAuthn not supported
  if (!supportsPasskey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 mb-6">
            <ShieldX className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Passkeys Not Supported
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Your browser doesn&apos;t support WebAuthn passkeys. Please use a modern browser like Chrome, Firefox, Safari, or Edge.
          </p>
          <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--text-secondary)]">
                Passkeys provide secure, passwordless authentication using your device&apos;s biometrics or security key.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--accent)]/10 mb-4">
            <Lock className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            VaultMD
          </h1>
          <p className="text-[var(--text-secondary)]">
            End-to-end encrypted markdown notes
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Authentication failed</p>
              <p className="text-xs text-red-400/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Auth Card */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center text-[var(--text-primary)]">
              {mode === "signin" ? "Welcome back" : "Create your vault"}
            </CardTitle>
            <CardDescription className="text-center text-[var(--text-secondary)]">
              {mode === "signin"
                ? "Use your passkey to access your notes"
                : "Set up a passkey to secure your notes"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Passkey Button */}
            <Button
              onClick={mode === "signin" ? handleSignIn : handleSignUp}
              disabled={isLoading}
              className="w-full h-14 bg-[var(--accent)] hover:bg-[#4393e6] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {mode === "signin" ? "Authenticating..." : "Creating vault..."}
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 mr-2" />
                  {mode === "signin" ? "Sign in with Passkey" : "Create Passkey"}
                </>
              )}
            </Button>

            {/* Mode Toggle */}
            <div className="text-center pt-2">
              {mode === "signin" ? (
                <p className="text-sm text-[var(--text-secondary)]">
                  Don&apos;t have a vault?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="text-[var(--accent)] hover:underline"
                  >
                    Create one
                  </button>
                </p>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  Already have a vault?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="text-[var(--accent)] hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

            {/* Security Note */}
            <p className="text-xs text-[var(--text-secondary)] text-center pt-2">
              Your notes are encrypted with keys derived from your passkey. No recovery key needed!
            </p>
          </CardContent>
        </Card>

        {/* Passkey Info */}
        <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          <p>🔐 Your passkey derives encryption keys using WebAuthn PRF - same passkey on any device = same data.</p>
        </div>
      </div>
    </div>
  );
}
