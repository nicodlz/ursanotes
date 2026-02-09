# Phase 1 Context: Setup & Core Layout

## Implementation Decisions

### Layout
- **Sidebar:** Left side, fixed 260px width
- **Mobile:** Drawer (slide from left) with hamburger toggle
- **Breakpoint:** 768px (md) for mobile/desktop switch

### Header
- **Left:** App logo + "vaultmd" title
- **Center:** Search input (expands on focus)
- **Right:** Sync status icon + Theme toggle + Settings button

### Navigation
- **No router:** State-based navigation (simpler for single-page notes app)
- **Views:** Auth → Main (sidebar + editor)
- **State:** `currentNoteId`, `currentFolderId`, `currentTag` in Zustand

### Theme
- **Base:** shadcn "neutral" palette (clean, professional)
- **Accent:** Subtle blue for interactive elements
- **Modes:** Light + Dark with system preference detection
- **Toggle:** Sun/Moon icon in header

### shadcn Components to Install
```
button card input label separator
sheet (mobile drawer) scroll-area
dropdown-menu dialog alert-dialog
tooltip badge skeleton
switch (theme toggle) command (search)
```

### Folder Structure
```
src/
├── components/
│   ├── ui/          # shadcn components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── ...
├── lib/
│   └── utils.ts     # shadcn cn() helper
├── stores/
│   └── ui.ts        # UI state (sidebar open, theme, etc.)
├── App.tsx
├── main.tsx
└── index.css        # Tailwind + shadcn globals
```

### Design Principles
1. **Content first:** UI should disappear, notes should shine
2. **Keyboard friendly:** All actions accessible via keyboard
3. **Fast:** No unnecessary animations, instant feedback
4. **Familiar:** Follow conventions (Notion, Obsidian, HackMD)
