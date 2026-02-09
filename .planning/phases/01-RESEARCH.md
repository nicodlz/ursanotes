# Phase 1 Research: Setup & Core Layout

## shadcn/ui Setup with Vite

### Installation Steps
```bash
# 1. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 2. Configure path aliases in tsconfig.json
# Add: "baseUrl": ".", "paths": { "@/*": ["./src/*"] }

# 3. Update vite.config.ts for path aliases
# Add: resolve: { alias: { "@": path.resolve(__dirname, "./src") } }

# 4. Init shadcn
npx shadcn@latest init
# Options: TypeScript, neutral, CSS variables, tailwind.config.js, @/components, @/lib/utils, RSC: No

# 5. Add components
npx shadcn@latest add button card input label separator sheet scroll-area dropdown-menu dialog alert-dialog tooltip badge skeleton switch command
```

### Theme Configuration
shadcn uses CSS variables for theming. Dark mode via class strategy:
```js
// tailwind.config.js
darkMode: ["class"]
```

Theme toggle stores preference in localStorage and adds/removes `dark` class on `<html>`.

## Layout Patterns

### Desktop (≥768px)
```
┌─────────────────────────────────────────────────┐
│ Header (h-14): Logo | Search | Sync Theme Settings │
├──────────────┬──────────────────────────────────┤
│ Sidebar      │ Main Content                     │
│ (w-64)       │ (flex-1)                         │
│              │                                  │
│ - Folders    │ [Editor | Preview]               │
│ - Tags       │                                  │
│ - Notes list │                                  │
└──────────────┴──────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────────┐
│ Header: ☰ Logo Search ⚙ │
├─────────────────────────┤
│ Main Content            │
│ (full width)            │
│                         │
│ [Editor or Preview]     │
│ (toggle, not split)     │
└─────────────────────────┘
+ Sheet drawer for sidebar
```

## Dependencies to Add
- `@radix-ui/*` — installed by shadcn automatically
- `class-variance-authority` — shadcn dependency
- `clsx` + `tailwind-merge` — for cn() utility
- `lucide-react` — icons (shadcn default)

## File Structure After Phase 1
```
src/
├── components/
│   ├── ui/           # shadcn (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── MobileSidebar.tsx
│       └── Layout.tsx
├── hooks/
│   └── use-mobile.ts  # Media query hook
├── lib/
│   └── utils.ts       # cn() helper
├── stores/
│   └── ui.ts          # UI state
├── App.tsx
├── main.tsx
└── index.css
```
