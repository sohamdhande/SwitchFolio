"use client";

import { useState } from "react";
import { Project, ProjectFormData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

export function ProjectForm({
  onSubmit,
  initialData,
  loading,
}: {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Project;
  loading: boolean;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repoUrl || "");
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || []);
  const [newTech, setNewTech] = useState("");

  const handleAddTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      techStack,
      repoUrl: repoUrl.trim() === "" ? null : repoUrl,
      liveUrl: liveUrl.trim() === "" ? null : liveUrl,
      imageUrl: imageUrl.trim() === "" ? null : imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. My Awesome App"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Tell us about your project..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="repoUrl">Repo URL</Label>
          <Input
            id="repoUrl"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://.../screenshot.png"
        />
      </div>

      <div className="space-y-2">
        <Label>Tech Stack</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-gray-700"
            >
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTech(tech)}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTech();
              }
            }}
            placeholder="Add tech (e.g. Next.js)"
          />
          <Button type="button" variant="outline" size="icon" onClick={handleAddTech}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Project"}
      </Button>
    </form>
  );
}
