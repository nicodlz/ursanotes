<?xml version="1.0" encoding="UTF-8"?>
<plan phase="1" task="3" name="Theme System">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <depends>01-PLAN-2 (layout components)</depends>
    <style>Double quotes, semicolons always, .js extensions on imports</style>
  </context>

  <tasks>
    <task type="auto">
      <name>Create ThemeProvider</name>
      <action>
        Create src/components/theme-provider.tsx:
        
        Context provider for theme management:
        - Themes: "light" | "dark" | "system"
        - Store preference in localStorage (key: "vaultmd-theme")
        - On mount: read localStorage, apply class to document.documentElement
        - System theme: use matchMedia("prefers-color-scheme: dark")
        - Provide: { theme, setTheme }
        
        Implementation pattern from shadcn docs.
      </action>
      <verify>Provider exports ThemeProvider and useTheme hook</verify>
      <done>Theme context ready</done>
    </task>

    <task type="auto">
      <name>Create ThemeToggle component</name>
      <action>
        Create src/components/theme-toggle.tsx:
        
        Button that cycles through themes:
        - Sun icon → light mode
        - Moon icon → dark mode
        - Use shadcn Button variant="ghost" size="icon"
        - Use lucide-react Sun and Moon icons
        - Dropdown menu with: Light, Dark, System options
        
        Use shadcn DropdownMenu for the menu.
      </action>
      <verify>Toggle changes theme and persists on reload</verify>
      <done>Theme toggle UI complete</done>
    </task>

    <task type="auto">
      <name>Integrate theme system</name>
      <action>
        1. Wrap App with ThemeProvider in main.tsx:
           ```tsx
           <ThemeProvider defaultTheme="system" storageKey="vaultmd-theme">
             <App />
           </ThemeProvider>
           ```
        
        2. Add ThemeToggle to Header.tsx (right section)
        
        3. Verify tailwind.config.js has: darkMode: ["class"]
        
        4. Test: toggle between light/dark, refresh page, verify persistence
      </action>
      <verify>Theme persists after page reload</verify>
      <done>Theme system fully integrated</done>
    </task>

    <task type="auto">
      <name>Final cleanup and build</name>
      <action>
        1. Remove any unused imports
        2. Ensure all files use consistent code style
        3. Run: npm run build
        4. Run: npm run dev — verify app works
        5. Test responsive: resize browser, check mobile layout
        6. Test theme: toggle light/dark/system
      </action>
      <verify>npm run build succeeds AND dev server shows working app</verify>
      <done>Phase 1 complete</done>
    </task>
  </tasks>

  <commit>feat(01-03): add dark/light theme with persistence</commit>
</plan>
