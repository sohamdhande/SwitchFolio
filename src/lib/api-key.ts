import crypto from "crypto"
import bcrypt from "bcryptjs"
import { Redis } from "@upstash/redis"

// Reuse the same Redis instance for API key caching (only if configured)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? Redis.fromEnv()
  : null

export { redis }

const KEY_CACHE_TTL = 300 // 5 minutes

export interface GenerateApiKeyOptions {
  permissions?: string[]
  expiresAt?: Date | null
}

export async function generateApiKey(options?: GenerateApiKeyOptions): Promise<{ 
  raw: string
  prefix: string
  hashed: string
  permissions: string[]
  expiresAt: Date | null
}> {
  const bytes = crypto.randomBytes(32).toString("hex")
  const prefixBytes = crypto.randomBytes(4).toString("hex")
  const prefix = `sk_live_${prefixBytes}`
  const raw = `${prefix}_${bytes}`
  const hashed = await bcrypt.hash(raw, 10)
  const permissions = options?.permissions ?? ["read:projects", "read:views"]
  const expiresAt = options?.expiresAt ?? null
  return { raw, prefix, hashed, permissions, expiresAt }
}

export interface ValidatedKey {
  userId: string
  permissions: string[]
}

export async function validateApiKey(raw: string): Promise<ValidatedKey | null> {
  if (!raw || !raw.startsWith("sk_live_")) return null
  
  // prefix is the first 3 underscore-separated segments: sk_live_XXXX
  const parts = raw.split("_")
  if (parts.length < 4) return null
  const prefix = `${parts[0]}_${parts[1]}_${parts[2]}`
  
  // Check Redis cache first to avoid hitting Postgres on every request
  if (redis) {
    const cached = await redis.get<ValidatedKey>(`apikey:${prefix}`)
    if (cached) return cached
  }

  const { db } = await import("@/lib/db")
  const keyRecord = await db.apiKey.findUnique({ where: { prefix } })
  if (!keyRecord) return null

  // Check expiry
  if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
    // Expired — clear any stale cache entry
    if (redis) {
      await redis.del(`apikey:${prefix}`)
    }
    return null
  }
  
  const valid = await bcrypt.compare(raw, keyRecord.hashedKey)
  if (!valid) return null

  const result: ValidatedKey = {
    userId: keyRecord.userId,
    permissions: keyRecord.permissions,
  }
  
  // Cache the validated key data in Redis for subsequent requests
  if (redis) {
    await redis.setex(`apikey:${prefix}`, KEY_CACHE_TTL, JSON.stringify(result))
  }

  // fire and forget — update lastUsedAt
  db.apiKey.update({ 
    where: { prefix }, 
    data: { lastUsedAt: new Date() } 
  }).catch(() => {})
  
  return result
}
