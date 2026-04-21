"use client";

import { useState } from "react";
import { ApiKey } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Copy,
  Check,
  Key,
  AlertTriangle,
  LayoutGrid,
  FolderOpen,
  BookOpen,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ApiKeyPanel({
  user,
  initialKeys,
}: {
  user: { id: string; username: string; email: string; createdAt: string };
  initialKeys: ApiKey[];
}) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [usernameCopied, setUsernameCopied] = useState(false);
  const [snippetTab, setSnippetTab] = useState<"react" | "vanilla">("react");
  const [snippetCopied, setSnippetCopied] = useState(false);

  const keyPrefix = keys[0]?.prefix ?? "sk_live_xxxx";

  const reactSnippet = `import { useSwitchfolio } from '@switchfolio/react'

const { data, loading } = useSwitchfolio({
  apiKey: '${keyPrefix}...',
  username: '${user.username}',
  viewSlug: 'your-view-slug'
})

return data.map(project => (
  <YourCard key={project.id} project={project} />
))`;

  const vanillaSnippet = `<script src="https://switchfolio.app/sdk.js"></script>
<script>
  Switchfolio.load({
    apiKey: '${keyPrefix}...',
    username: '${user.username}',
    viewSlug: 'your-view-slug'
  }).then(({ projects }) => {
    renderProjects(projects)
  })
</script>`;

  const handleGenerate = async () => {
    if (!newKeyName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!res.ok) throw new Error("Failed to generate key");

      const data = await res.json();
      setNewlyCreatedKey(data.raw);
      setKeys([
        {
          id: data.id,
          name: data.name,
          prefix: data.prefix,
          lastUsedAt: data.lastUsedAt,
          createdAt: data.createdAt,
        },
        ...keys,
      ]);
      setNewKeyName("");
      toast.success("API key generated!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate key"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete key");
      setKeys(keys.filter((k) => k.id !== id));
      toast.success("API key deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete key"
      );
    }
  };

  const handleCopy = async () => {
    if (!newlyCreatedKey) return;
    await navigator.clipboard.writeText(newlyCreatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUsername = async () => {
    await navigator.clipboard.writeText(user.username);
    setUsernameCopied(true);
    toast.success("Username copied!");
    setTimeout(() => setUsernameCopied(false), 2000);
  };

  const handleCopySnippet = async () => {
    const text = snippetTab === "react" ? reactSnippet : vanillaSnippet;
    await navigator.clipboard.writeText(text);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const formatDate = (d: Date | string | null) => {
    if (!d) return "Never used";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* PROFILE SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">
              Your username
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-mono text-sm font-medium">{user.username}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handleCopyUsername}
              >
                {usernameCopied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <p className="text-sm">{user.email}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Member since
            </Label>
            <p className="text-sm">{memberSince}</p>
          </div>
        </CardContent>
      </Card>

      {/* API KEYS SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generate form */}
          <div className="flex gap-3">
            <Input
              placeholder="Key name (e.g. Portfolio Site)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
            />
            <Button
              onClick={handleGenerate}
              disabled={!newKeyName.trim() || loading}
            >
              {loading ? "Generating..." : "Generate Key"}
            </Button>
          </div>

          {/* New key reveal */}
          {newlyCreatedKey && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-amber-800">
                  Copy this key now — it will never be shown again.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-white dark:bg-zinc-900 border px-3 py-2 text-xs font-mono text-gray-900 dark:text-zinc-100 break-all">
                  {newlyCreatedKey}
                </code>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewlyCreatedKey(null);
                  setCopied(false);
                }}
                className="text-amber-700 hover:text-amber-900"
              >
                I&apos;ve copied it
              </Button>
            </div>
          )}

          {/* Keys list */}
          {keys.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No API keys yet. Generate one above.
            </p>
          ) : (
            <div className="divide-y">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{key.name}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {key.prefix}...
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last used: {formatDate(key.lastUsedAt)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Created: {formatDate(key.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(key.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QUICK LINKS */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/dashboard/views"
              className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors"
            >
              <LayoutGrid className="h-5 w-5 text-gray-500 dark:text-zinc-500" />
              View your views
            </Link>
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors"
            >
              <FolderOpen className="h-5 w-5 text-gray-500 dark:text-zinc-500" />
              Manage projects
            </Link>
            <Link
              href="/guide"
              className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-gray-500 dark:text-zinc-500" />
              Documentation
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* SDK SNIPPET SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Snippet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tab toggle */}
          <div className="flex border-b">
            <button
              onClick={() => { setSnippetTab("react"); setSnippetCopied(false); }}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                snippetTab === "react"
                  ? "border-gray-900 text-gray-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-gray-500 dark:text-zinc-500 hover:text-gray-700"
              }`}
            >
              React
            </button>
            <button
              onClick={() => { setSnippetTab("vanilla"); setSnippetCopied(false); }}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                snippetTab === "vanilla"
                  ? "border-gray-900 text-gray-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-gray-500 dark:text-zinc-500 hover:text-gray-700"
              }`}
            >
              Vanilla JS
            </button>
          </div>

          {/* Snippet */}
          <div className="relative">
            <pre className="rounded-lg bg-gray-950 dark:bg-zinc-950 text-gray-100 dark:text-zinc-300 p-4 text-sm font-mono overflow-x-auto">
              <code>
                {snippetTab === "react" ? reactSnippet : vanillaSnippet}
              </code>
            </pre>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopySnippet}
              className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {snippetCopied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Replace the API key with your full key and the view slug with your
            actual view.
          </p>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      <Card className="border-red-300 dark:border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                Delete Account
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <div className="relative group">
              <Button
                variant="destructive"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                Delete Account
              </Button>
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-zinc-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Coming soon
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
