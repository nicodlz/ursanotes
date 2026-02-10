import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

interface ResizeHandleProps {
  onResize: (leftWidthPercent: number) => void;
}

/**
 * Draggable resize handle for split view
 * Supports both mouse and touch events
 */
export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Find parent container
    const handle = e.currentTarget as HTMLElement;
    containerRef.current = handle.parentElement;
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percent = Math.min(Math.max((offsetX / rect.width) * 100, 20), 80);
      onResize(percent);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    // Prevent text selection while dragging
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, onResize]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      className={`
        w-2 flex-shrink-0 cursor-col-resize
        flex items-center justify-center
        bg-[var(--border)] hover:bg-[var(--accent)]
        transition-colors duration-150
        ${isDragging ? "bg-[var(--accent)]" : ""}
      `}
      title="Drag to resize"
    >
      <GripVertical className="w-3 h-3 text-[var(--text-tertiary)]" />
    </div>
  );
}
