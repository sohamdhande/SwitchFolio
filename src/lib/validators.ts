import { z } from "zod";

// ── Projects ────────────────────────────────────────────────────────────
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  techStack: z.array(z.string().max(50)).max(20).default([]),
  repoUrl: z.string().url().max(500).nullish().transform((v) => v || null),
  liveUrl: z.string().url().max(500).nullish().transform((v) => v || null),
  imageUrl: z.string().url().max(500).nullish().transform((v) => v || null),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  techStack: z.array(z.string().max(50)).max(20).optional(),
  repoUrl: z.string().url().max(500).nullish().transform((v) => v || null).optional(),
  liveUrl: z.string().url().max(500).nullish().transform((v) => v || null).optional(),
  imageUrl: z.string().url().max(500).nullish().transform((v) => v || null).optional(),
});

// ── Views ───────────────────────────────────────────────────────────────
export const createViewSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().max(100).regex(/^[a-z0-9-]*$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  description: z.string().max(500).nullish().transform((v) => v || null),
});

export const updateViewSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().max(100).regex(/^[a-z0-9-]*$/).optional(),
  description: z.string().max(500).nullish().transform((v) => v || null).optional(),
});

// ── API Keys ────────────────────────────────────────────────────────────
const validPermissions = ["read:projects", "read:views"] as const;

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  permissions: z.array(z.enum(validPermissions)).min(1).default(["read:projects", "read:views"]),
  expiresAt: z.string().datetime().optional().transform((v) => v ? new Date(v) : null),
});

// ── Reorder ─────────────────────────────────────────────────────────────
export const reorderUpdateSchema = z.object({
  updates: z.array(
    z.object({
      projectId: z.string().cuid(),
      lexoRank: z.string().max(50).optional(),
      isVisible: z.boolean().optional(),
    })
  ).min(1).max(100),
});

// ── Allowed Origins ─────────────────────────────────────────────────────
export const updateAllowedOriginsSchema = z.object({
  allowedOrigins: z.array(z.string().url().max(200)).max(20),
});

// ── Helpers ─────────────────────────────────────────────────────────────
export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}
