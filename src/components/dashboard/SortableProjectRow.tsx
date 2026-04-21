"use client";

import { ViewProject } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableProjectRow({
  project,
  onToggle,
}: {
  project: ViewProject;
  onToggle: (id: string, isVisible: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, disabled: !project.isVisible });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white dark:bg-zinc-900 px-4 py-3 ${
        isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
      } ${!project.isVisible ? "opacity-50" : ""}`}
    >
      {/* Drag handle — only interactive for visible projects */}
      {project.isVisible ? (
        <button
          className="cursor-grab touch-none text-gray-400 hover:text-gray-600 dark:text-zinc-400"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-5" />
      )}

      {/* Project info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{project.title}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {project.techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.techStack.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      {/* Visibility toggle */}
      <Switch
        checked={project.isVisible}
        onCheckedChange={(checked) => onToggle(project.id, checked)}
        aria-label={`Toggle visibility for ${project.title}`}
      />
    </div>
  );
}
