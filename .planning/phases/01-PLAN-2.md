<?xml version="1.0" encoding="UTF-8"?>
<plan phase="1" task="2" name="Layout Components">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <depends>01-PLAN-1 (shadcn setup)</depends>
    <style>Double quotes, semicolons always, .js extensions on imports</style>
    <layout>
      - Header: h-14, logo left, search center, actions right
      - Sidebar: w-64, fixed left, collapsible on mobile
      - Main: flex-1, content area
      - Mobile: Sheet drawer for sidebar
    </layout>
  </context>

  <tasks>
    <task type="auto">
      <name>Create useMobile hook</name>
      <action>
        Create src/hooks/use-mobile.ts:
        
        Custom hook that returns true when viewport < 768px.
        Use window.matchMedia for efficiency.
        Handle SSR gracefully (default to false).
      </action>
      <verify>Hook exports useMobile function</verify>
      <done>Mobile detection hook ready</done>
    </task>

    <task type="auto">
      <name>Create UI store</name>
      <action>
        Create src/stores/ui.ts:
        
        Zustand store with:
        - sidebarOpen: boolean (default true on desktop, false on mobile)
        - toggleSidebar: () => void
        - setSidebarOpen: (open: boolean) => void
        
        Use zustand with devtools middleware for debugging.
      </action>
      <verify>Store exports useUIStore hook</verify>
      <done>UI state management ready</done>
    </task>

    <task type="auto">
      <name>Create Header component</name>
      <action>
        Create src/components/layout/Header.tsx:
        
        Fixed header with:
        - Left: Menu button (mobile) + App title "vaultmd"
        - Center: Search input using Command component (placeholder for now)
        - Right: Sync status placeholder + Theme toggle placeholder + Settings button
        
        Use shadcn Button, lucide-react icons (Menu, Search, Settings).
        Tailwind classes: h-14, border-b, flex items-center, px-4
      </action>
      <verify>Component renders without errors</verify>
      <done>Header with responsive layout</done>
    </task>

    <task type="auto">
      <name>Create Sidebar component</name>
      <action>
        Create src/components/layout/Sidebar.tsx:
        
        Desktop sidebar (hidden on mobile):
        - w-64, h-full, border-r
        - Sections: Folders (placeholder), Tags (placeholder), Notes list (placeholder)
        - Use ScrollArea for content
        - Each section with collapsible header
        
        Just structure for now, content comes in later phases.
      </action>
      <verify>Component renders without errors</verify>
      <done>Desktop sidebar shell ready</done>
    </task>

    <task type="auto">
      <name>Create MobileSidebar component</name>
      <action>
        Create src/components/layout/MobileSidebar.tsx:
        
        Uses shadcn Sheet component:
        - Side: left
        - Controlled by useUIStore.sidebarOpen
        - Contains same content as Sidebar
        - Close button in sheet header
      </action>
      <verify>Sheet opens and closes correctly</verify>
      <done>Mobile drawer navigation ready</done>
    </task>

    <task type="auto">
      <name>Create Layout component</name>
      <action>
        Create src/components/layout/Layout.tsx:
        
        Main layout wrapper:
        - Header (always visible)
        - Sidebar (desktop only, conditional on sidebarOpen)
        - MobileSidebar (mobile only)
        - Main content area (children)
        
        Structure:
        ```
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            {!isMobile && <Sidebar />}
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
          {isMobile && <MobileSidebar />}
        </div>
        ```
      </action>
      <verify>Layout renders with header, sidebar, and main area</verify>
      <done>Responsive layout shell complete</done>
    </task>

    <task type="auto">
      <name>Create index exports</name>
      <action>
        Create src/components/layout/index.ts:
        Export all layout components.
        
        Update App.tsx to use Layout:
        ```tsx
        import { Layout } from "@/components/layout";
        
        function App() {
          return (
            <Layout>
              <div className="p-4">
                <h1>Welcome to vaultmd</h1>
              </div>
            </Layout>
          );
        }
        ```
      </action>
      <verify>npm run build succeeds</verify>
      <done>Layout integrated into app</done>
    </task>
  </tasks>

  <commit>feat(01-02): add responsive layout with header and sidebar</commit>
</plan>
