import {
  Bold,
  Italic,
  Code,
  Link,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  CodeSquare,
  Minus,
  CheckSquare,
} from "lucide-react";
import { Button } from "./ui/button.js";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip.js";

export interface ToolbarAction {
  bold: () => void;
  italic: () => void;
  code: () => void;
  link: () => void;
  heading1: () => void;
  heading2: () => void;
  heading3: () => void;
  bulletList: () => void;
  numberedList: () => void;
  quote: () => void;
  codeBlock: () => void;
  horizontalRule: () => void;
  taskList: () => void;
}

interface MarkdownToolbarProps {
  actions: ToolbarAction;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
}

function ToolbarButton({ icon, label, shortcut, onClick }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className="h-8 w-8 p-0 hover:bg-accent touch-manipulation"
          aria-label={label}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <div className="flex flex-col gap-0.5">
          <span>{label}</span>
          {shortcut && <span className="text-muted-foreground">{shortcut}</span>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-border mx-1" />;
}

export function MarkdownToolbar({ actions }: MarkdownToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 px-3 py-2 bg-background border-b border-border overflow-x-auto">
        {/* Text formatting */}
        <ToolbarButton
          icon={<Bold className="h-4 w-4" />}
          label="Bold"
          shortcut="Ctrl+B"
          onClick={actions.bold}
        />
        <ToolbarButton
          icon={<Italic className="h-4 w-4" />}
          label="Italic"
          shortcut="Ctrl+I"
          onClick={actions.italic}
        />
        <ToolbarButton
          icon={<Code className="h-4 w-4" />}
          label="Inline Code"
          shortcut="Ctrl+`"
          onClick={actions.code}
        />

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          icon={<Heading1 className="h-4 w-4" />}
          label="Heading 1"
          shortcut="Ctrl+Alt+1"
          onClick={actions.heading1}
        />
        <ToolbarButton
          icon={<Heading2 className="h-4 w-4" />}
          label="Heading 2"
          shortcut="Ctrl+Alt+2"
          onClick={actions.heading2}
        />
        <ToolbarButton
          icon={<Heading3 className="h-4 w-4" />}
          label="Heading 3"
          shortcut="Ctrl+Alt+3"
          onClick={actions.heading3}
        />

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          icon={<List className="h-4 w-4" />}
          label="Bullet List"
          shortcut="Ctrl+Shift+8"
          onClick={actions.bulletList}
        />
        <ToolbarButton
          icon={<ListOrdered className="h-4 w-4" />}
          label="Numbered List"
          shortcut="Ctrl+Shift+7"
          onClick={actions.numberedList}
        />
        <ToolbarButton
          icon={<CheckSquare className="h-4 w-4" />}
          label="Task List"
          shortcut="Ctrl+Shift+9"
          onClick={actions.taskList}
        />

        <ToolbarDivider />

        {/* Other formatting */}
        <ToolbarButton
          icon={<Link className="h-4 w-4" />}
          label="Link"
          shortcut="Ctrl+K"
          onClick={actions.link}
        />
        <ToolbarButton
          icon={<Quote className="h-4 w-4" />}
          label="Quote"
          shortcut="Ctrl+Shift+."
          onClick={actions.quote}
        />
        <ToolbarButton
          icon={<CodeSquare className="h-4 w-4" />}
          label="Code Block"
          shortcut="Ctrl+Shift+K"
          onClick={actions.codeBlock}
        />
        <ToolbarButton
          icon={<Minus className="h-4 w-4" />}
          label="Horizontal Rule"
          shortcut="Ctrl+Shift+-"
          onClick={actions.horizontalRule}
        />
      </div>
    </TooltipProvider>
  );
}
