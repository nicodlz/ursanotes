import { Header } from "./Header.js";
import { Sidebar } from "./Sidebar.js";
import { MobileSidebar } from "./MobileSidebar.js";
import { useMobile } from "@/hooks/use-mobile.js";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useMobile();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <Sidebar />}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      {isMobile && <MobileSidebar />}
    </div>
  );
}
