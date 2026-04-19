"use client";

import { useState } from "react";
import { View, ViewFormData } from "@/types";
import { ViewCard } from "./ViewCard";
import { ViewForm } from "./ViewForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function ViewList({ views: initialViews }: { views: View[] }) {
  const [views, setViews] = useState<View[]>(initialViews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingView, setEditingView] = useState<View | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingView(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (view: View) => {
    setEditingView(view);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingView(null);
  };

  const handleSubmit = async (data: ViewFormData) => {
    setLoading(true);
    try {
      if (editingView) {
        // Edit
        const res = await fetch(`/api/views/${editingView.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update view");
        }
        const updatedView = await res.json();
        
        setViews(views.map(v => v.id === updatedView.id ? updatedView : v));
        toast.success("View updated successfully!");
      } else {
        // Create
        const res = await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create view");
        }
        const newView = await res.json();
        
        setViews([newView, ...views]);
        toast.success("View created successfully!");
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this view? Projects inside it will not be deleted.")) return;
    
    try {
      const res = await fetch(`/api/views/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete view");
      
      setViews(views.filter(v => v.id !== id));
      toast.success("View deleted successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Views</h2>
        <Button onClick={handleOpenCreate}>Create View</Button>
      </div>

      {views.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed">
          No views found. Create a view to organize your projects!
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {views.map((view) => (
            <ViewCard
              key={view.id}
              view={view}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingView ? "Edit View" : "Create View"}</DialogTitle>
          </DialogHeader>
          <ViewForm
            onSubmit={handleSubmit}
            initialData={editingView || undefined}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
