/**
 * Environment variable validation.
 * Imported by db.ts so it runs on server startup.
 * In production, throws if any required var is missing.
 */

const requiredEnvVars = [
  "DATABASE_URL",
  "DIRECT_URL",
  "CLERK_SECRET_KEY",
] as const;

if (process.env.NODE_ENV === "production") {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  DIRECT_URL: process.env.DIRECT_URL!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
} as const;
