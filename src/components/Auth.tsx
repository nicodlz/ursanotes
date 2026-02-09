import { useState } from "react";
import { useAuthStore } from "../stores/auth.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.js";
import { Input } from "./ui/input.js";
import { Button } from "./ui/button.js";
import { Label } from "./ui/label.js";
import { Checkbox } from "./ui/checkbox.js";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";

export function Auth() {
  const [passphrase, setPassphrase] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passphrase.length < 8) {
      setError("Passphrase must be at least 8 characters");
      return;
    }

    try {
      await login(passphrase, rememberMe);
    } catch {
      setError("Failed to unlock vault");
    }
  };

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

        {/* Auth Card */}
        <Card className="bg-[var(--bg-secondary)] border-[var(--border)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center text-[var(--text-primary)]">
              Unlock your vault
            </CardTitle>
            <CardDescription className="text-center text-[var(--text-secondary)]">
              Enter your passphrase to access your notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Passphrase Input */}
              <div className="space-y-2">
                <Label htmlFor="passphrase" className="text-[var(--text-secondary)]">
                  Passphrase
                </Label>
                <div className="relative">
                  <Input
                    id="passphrase"
                    type={showPassword ? "text" : "password"}
                    value={passphrase}
                    onChange={(e) => {
                      setPassphrase(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your secret passphrase..."
                    className="pr-10 bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                    autoFocus
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-[var(--text-secondary)] cursor-pointer"
                >
                  Remember me on this device
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--accent)] hover:bg-[#4393e6] text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  "Unlock Vault"
                )}
              </Button>

              {/* Security Note */}
              <p className="text-xs text-[var(--text-secondary)] text-center">
                Your passphrase never leaves your device. It derives an encryption key for your notes.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* First Time Hint */}
        <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          <p>First time? Just enter a passphrase to create your vault.</p>
        </div>
      </div>
    </div>
  );
}
