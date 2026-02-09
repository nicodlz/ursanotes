<?xml version="1.0" encoding="UTF-8"?>
<plan phase="1" task="1" name="Tailwind + shadcn Setup">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <existing>Vite + React 19 + TypeScript already initialized</existing>
    <style>Double quotes, semicolons always, .js extensions on imports</style>
  </context>

  <tasks>
    <task type="auto">
      <name>Install Tailwind CSS</name>
      <action>
        npm install -D tailwindcss postcss autoprefixer
        npx tailwindcss init -p
      </action>
      <verify>tailwind.config.js exists</verify>
      <done>Tailwind config created</done>
    </task>

    <task type="auto">
      <name>Configure path aliases</name>
      <action>
        Update tsconfig.json to add:
        - "baseUrl": "."
        - "paths": { "@/*": ["./src/*"] }
        
        Update tsconfig.app.json similarly.
        
        Update vite.config.ts to add:
        - import path from "path"
        - resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
        
        Install: npm install -D @types/node
      </action>
      <verify>Import "@/lib/utils" resolves correctly</verify>
      <done>Path aliases work in both TS and Vite</done>
    </task>

    <task type="auto">
      <name>Initialize shadcn/ui</name>
      <action>
        Run: npx shadcn@latest init
        
        When prompted, select:
        - Style: New York
        - Base color: Neutral  
        - CSS variables: Yes
        - tailwind.config location: tailwind.config.js
        - Components location: @/components
        - Utils location: @/lib/utils
        - React Server Components: No
        
        This creates:
        - components.json
        - src/lib/utils.ts (cn helper)
        - Updates tailwind.config.js
        - Updates src/index.css with CSS variables
      </action>
      <verify>components.json exists AND src/lib/utils.ts exists</verify>
      <done>shadcn initialized with neutral theme</done>
    </task>

    <task type="auto">
      <name>Add required shadcn components</name>
      <action>
        npx shadcn@latest add button card input label separator sheet scroll-area dropdown-menu dialog alert-dialog tooltip badge skeleton switch command
        
        This installs all components needed for the app.
      </action>
      <verify>src/components/ui/button.tsx exists</verify>
      <done>All UI components installed</done>
    </task>

    <task type="auto">
      <name>Clean up and verify build</name>
      <action>
        1. Remove default Vite CSS (App.css content)
        2. Update src/index.css to only have Tailwind directives + shadcn CSS vars
        3. Update App.tsx to render a simple "vaultmd" heading with a shadcn Button
        4. Run: npm run build
      </action>
      <verify>npm run build succeeds with no errors</verify>
      <done>Clean build with shadcn working</done>
    </task>
  </tasks>

  <commit>feat(01-01): setup Tailwind and shadcn/ui</commit>
</plan>
