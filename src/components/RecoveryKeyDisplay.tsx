import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.js";
import { Button } from "./ui/button.js";
import { Checkbox } from "./ui/checkbox.js";
import { Label } from "./ui/label.js";
import { Copy, Check, Key, AlertTriangle } from "lucide-react";

interface RecoveryKeyDisplayProps {
  recoveryKey: string;
  open: boolean;
  onContinue: () => void;
}

export function RecoveryKeyDisplay({ recoveryKey, open, onContinue }: RecoveryKeyDisplayProps) {
  const [hasSaved, setHasSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-[var(--bg-secondary)] border-[var(--border)] max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
            <Key className="w-6 h-6 text-amber-400" />
          </div>
          <DialogTitle className="text-center text-[var(--text-primary)]">
            Save Your Recovery Key
          </DialogTitle>
          <DialogDescription className="text-center text-[var(--text-secondary)]">
            This key is the <strong>only way</strong> to decrypt your notes. Store it securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recovery Key Display */}
          <div className="relative">
            <div className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-4 font-mono text-sm text-[var(--text-primary)] break-all text-center leading-relaxed">
              {recoveryKey}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute top-2 right-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Warning */}
          <div className="flex gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="text-xs text-amber-200/80">
              <p className="font-medium mb-1">This is shown only once!</p>
              <p>If you lose this key, your encrypted notes cannot be recovered. No one can help you.</p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-[var(--bg-tertiary)]">
            <Checkbox
              id="saved"
              checked={hasSaved}
              onCheckedChange={(checked) => setHasSaved(checked === true)}
            />
            <Label
              htmlFor="saved"
              className="text-sm text-[var(--text-secondary)] cursor-pointer"
            >
              I have saved my recovery key in a secure location
            </Label>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          disabled={!hasSaved}
          className="w-full bg-[var(--accent)] hover:bg-[#4393e6] text-white disabled:opacity-50"
        >
          Continue to VaultMD
        </Button>
      </DialogContent>
    </Dialog>
  );
}
