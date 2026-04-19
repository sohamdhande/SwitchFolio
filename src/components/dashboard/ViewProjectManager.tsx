"use client";

import { useState } from "react";
import { ViewProject } from "@/types";
import { midpoint } from "@/lib/lexorank";
import { SortableProjectRow } from "./SortableProjectRow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export function ViewProjectManager({
  viewId,
  viewName,
  initialProjects,
}: {
  viewId: string;
  viewName: string;
  initialProjects: ViewProject[];
}) {
  const [projects, setProjects] = useState<ViewProject[]>(initialProjects);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const visibleProjects = projects.filter((p) => p.isVisible);
  const hiddenProjects = projects.filter((p) => !p.isVisible);

  const saveUpdates = async (
    updates: Array<{
      projectId: string;
      lexoRank?: string;
      isVisible?: boolean;
    }>
  ) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/views/${viewId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = visibleProjects.findIndex((p) => p.id === active.id);
    const newIndex = visibleProjects.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(visibleProjects, oldIndex, newIndex);

    // Calculate new lexoRank for the moved item
    const prevRank = reordered[newIndex - 1]?.lexoRank ?? "0";
    const nextRank = reordered[newIndex + 1]?.lexoRank ?? "z";
    const newRank = midpoint(prevRank, nextRank);

    reordered[newIndex] = { ...reordered[newIndex], lexoRank: newRank };

    // Update full projects list: replace visible portion, keep hidden as-is
    setProjects([...reordered, ...hiddenProjects]);

    saveUpdates([{ projectId: reordered[newIndex].id, lexoRank: newRank }]);
  };

  const handleToggle = (id: string, isVisible: boolean) => {
    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== id) return p;

        if (isVisible) {
          // Moving to visible: assign a rank at the end
          const currentVisible = prev.filter(
            (vp) => vp.isVisible && vp.id !== id
          );
          const lastRank =
            currentVisible[currentVisible.length - 1]?.lexoRank ?? "0";
          const newRank = midpoint(lastRank, "z");
          return { ...p, isVisible: true, lexoRank: newRank };
        } else {
          return { ...p, isVisible: false };
        }
      });

      // Sort: visible by lexoRank first, then hidden alphabetically
      const vis = updated
        .filter((p) => p.isVisible)
        .sort((a, b) => a.lexoRank.localeCompare(b.lexoRank));
      const hid = updated
        .filter((p) => !p.isVisible)
        .sort((a, b) => a.title.localeCompare(b.title));

      return [...vis, ...hid];
    });

    // Find the project to get the rank we just assigned
    const proj = projects.find((p) => p.id === id);
    if (isVisible && proj) {
      const currentVisible = projects.filter(
        (vp) => vp.isVisible && vp.id !== id
      );
      const lastRank =
        currentVisible[currentVisible.length - 1]?.lexoRank ?? "0";
      const newRank = midpoint(lastRank, "z");
      saveUpdates([{ projectId: id, isVisible: true, lexoRank: newRank }]);
    } else {
      saveUpdates([{ projectId: id, isVisible: false }]);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/views">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {viewName}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Toggle projects on/off and drag to reorder visible ones.
            </p>
          </div>
        </div>
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {/* Visible Projects */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Visible Projects ({visibleProjects.length})
        </h2>
        {visibleProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
            No visible projects. Toggle some on below.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleProjects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {visibleProjects.map((project) => (
                  <SortableProjectRow
                    key={project.id}
                    project={project}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Hidden Projects */}
      {hiddenProjects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Hidden Projects ({hiddenProjects.length})
          </h2>
          <div className="space-y-2">
            {hiddenProjects.map((project) => (
              <SortableProjectRow
                key={project.id}
                project={project}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
