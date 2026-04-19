import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ApiKeyPanel } from "@/components/dashboard/ApiKeyPanel";

export default async function SettingsPage() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
  }

  const keys = await db.apiKey.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      prefix: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your profile and API keys.
        </p>
      </div>

      <ApiKeyPanel
        user={{
          id: user.id,
          username: user.username,
          email: user.email,
        }}
        initialKeys={keys}
      />
    </div>
  );
}
