"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, AlertTriangle } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [data, setData] = useState<{ rawKey: string | null; username: string; viewSlug: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetch("/api/auth/provision", { method: "POST" })
      .then((res) => res.json())
      .then((d) => {
        if (d.error) {
          if (d.error === "Setup already complete") {
            router.push("/dashboard");
          }
        } else {
          setData(d);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = async () => {
    setConfirming(true);
    await fetch("/api/auth/provision", { method: "PATCH" });
    router.push("/dashboard/projects");
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Provisioning your portfolio...</div>;
  }

  if (!data) return null;

  const codeSnippet = `const { data, loading, error } = useSwitchfolio({
  apiKey: "${data.rawKey || 'sk_live_...'}",
  username: "${data.username}",
  viewSlug: "${data.viewSlug}"
});`;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Quick Setup</h1>
        <p className="text-muted-foreground">We&apos;ve auto-provisioned everything you need.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Credentials</CardTitle>
          <CardDescription>Install the SDK and copy these credentials to your project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. Install the SDK</p>
            <code className="block p-3 bg-zinc-100 dark:bg-zinc-900 rounded-md text-sm font-mono">
              npm install @switchfolio/react
            </code>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">2. Use the Hook</p>
            {data.rawKey ? (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  This is the <strong>only time</strong> your raw API key will be shown. Copy the code block below.
                </p>
              </div>
            ) : (
               <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md mb-3">
                <p className="text-sm text-blue-800">
                  Your key was already shown. Go to Settings to generate a new one if you lost it.
                </p>
              </div>
            )}
            
            <div className="relative">
              <pre className="p-4 bg-zinc-950 text-zinc-300 rounded-md text-sm font-mono overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => handleCopy(codeSnippet)}
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleComplete} disabled={confirming || !data.rawKey} className="w-full">
              {confirming ? "Completing setup..." : "I've copied my key"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
