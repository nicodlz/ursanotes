import { HardDrive, Cloud, CloudOff, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip.js";

type SyncState = "local" | "idle" | "syncing" | "synced" | "offline" | "error";

interface SyncStatusProps {
  state?: SyncState;
}

export function SyncStatus({ state = "local" }: SyncStatusProps) {
  const getStatusConfig = () => {
    switch (state) {
      case "synced":
        return {
          icon: <Cloud className="w-4 h-4" />,
          color: "text-green-400",
          label: "Synced",
          description: "All changes synced to cloud",
        };
      case "syncing":
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          color: "text-[var(--accent)]",
          label: "Syncing...",
          description: "Syncing changes to cloud",
        };
      case "offline":
        return {
          icon: <CloudOff className="w-4 h-4" />,
          color: "text-yellow-400",
          label: "Offline",
          description: "Changes will sync when online",
        };
      case "error":
        return {
          icon: <CloudOff className="w-4 h-4" />,
          color: "text-red-400",
          label: "Sync Error",
          description: "Failed to sync, will retry",
        };
      case "idle":
      case "local":
      default:
        return {
          icon: <HardDrive className="w-4 h-4" />,
          color: "text-[var(--text-secondary)]",
          label: "Local",
          description: "Stored locally on this device",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-1.5 text-xs ${config.color} cursor-default`}
          >
            {config.icon}
            <span>{config.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]">
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
