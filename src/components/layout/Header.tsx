import { Menu, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useUIStore } from "@/stores/ui.js";
import { useMobile } from "@/hooks/use-mobile.js";
import { ThemeToggle } from "@/components/theme-toggle.js";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const isMobile = useMobile();

  return (
    <header className="h-14 border-b flex items-center px-4 gap-4 bg-background">
      {/* Left: Menu button (mobile) + App title */}
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <h1 className="font-semibold text-lg">vaultmd</h1>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-9 w-full"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Sync status placeholder */}
        <div className="text-xs text-muted-foreground hidden sm:block">
          Synced
        </div>
        
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* Settings button */}
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}
