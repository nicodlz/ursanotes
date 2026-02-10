# Quick Task: Editor UI Improvements

**Created:** 2026-02-10
**Status:** Planning

## Goal
Améliorer l'expérience d'édition markdown avec une toolbar et de meilleurs raccourcis.

## Context
- L'éditeur actuel utilise CodeMirror 6
- Les raccourcis de base existent déjà (Ctrl+B, Ctrl+I)
- Besoin d'une toolbar visible pour les utilisateurs non-power-users
- Mobile-friendly

## Tasks

### Task 1: Markdown Toolbar
```xml
<plan phase="quick" task="1" name="Markdown Toolbar Component">
  <context>
    <file>src/components/Editor.tsx</file>
    <file>src/components/EditorToolbar.tsx (new)</file>
    <dependency>lucide-react for icons</dependency>
    <dependency>shadcn/ui Button, Tooltip</dependency>
  </context>
  <tasks>
    <task type="auto">
      <name>Create EditorToolbar component</name>
      <action>
        Create a toolbar component with buttons for:
        - Bold (Ctrl+B)
        - Italic (Ctrl+I)
        - Headers (H1, H2, H3 dropdown)
        - Link (Ctrl+K)
        - Code inline
        - Code block
        - Bullet list
        - Numbered list
        - Quote
        - Horizontal rule
        
        Each button should:
        1. Show tooltip with name and shortcut
        2. Insert markdown syntax at cursor position
        3. Work with selected text (wrap selection)
      </action>
      <verify>Toolbar renders above editor with all buttons</verify>
      <done>All toolbar buttons insert correct markdown</done>
    </task>
  </tasks>
</plan>
```

### Task 2: Keyboard Shortcuts Enhancement
```xml
<plan phase="quick" task="2" name="Enhanced Keyboard Shortcuts">
  <context>
    <file>src/components/Editor.tsx</file>
    <file>src/lib/editor-commands.ts (new)</file>
  </context>
  <tasks>
    <task type="auto">
      <name>Add missing shortcuts</name>
      <action>
        Add keyboard shortcuts:
        - Ctrl+K: Insert link
        - Ctrl+Shift+C: Code block
        - Ctrl+Shift+B: Bullet list
        - Ctrl+Shift+O: Numbered list
        - Ctrl+Shift+Q: Blockquote
        - Ctrl+H: Toggle preview (if not already)
        
        Extract commands to separate file for reuse between
        toolbar and keyboard shortcuts.
      </action>
      <verify>All shortcuts work in editor</verify>
      <done>Shortcuts work and are consistent with toolbar</done>
    </task>
  </tasks>
</plan>
```

### Task 3: Mobile Toolbar
```xml
<plan phase="quick" task="3" name="Mobile-Friendly Toolbar">
  <context>
    <file>src/components/EditorToolbar.tsx</file>
  </context>
  <tasks>
    <task type="auto">
      <name>Responsive toolbar</name>
      <action>
        Make toolbar responsive:
        - On mobile: horizontal scroll or dropdown menu
        - Touch-friendly button sizes (min 44px tap targets)
        - Hide less-used buttons in overflow menu on small screens
        - Sticky toolbar when scrolling
      </action>
      <verify>Toolbar usable on 375px viewport</verify>
      <done>Toolbar works on mobile without horizontal overflow issues</done>
    </task>
  </tasks>
</plan>
```

## Execution Order
1. Task 1 (Toolbar) - can run first
2. Task 2 (Shortcuts) - depends on commands extraction from Task 1
3. Task 3 (Mobile) - depends on Task 1

## Verification Criteria
- [ ] Toolbar visible above editor
- [ ] All buttons insert correct markdown
- [ ] Shortcuts work (test Ctrl+B, Ctrl+K, Ctrl+Shift+C)
- [ ] Mobile usable (no horizontal scroll, tap targets OK)
- [ ] Code committed with descriptive message
