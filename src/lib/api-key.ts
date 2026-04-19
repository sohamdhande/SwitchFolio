import crypto from "crypto"
import bcrypt from "bcryptjs"

export function generateApiKey(): { 
  raw: string
  prefix: string
  hashed: string 
} {
  const bytes = crypto.randomBytes(32).toString("hex")
  const prefixBytes = crypto.randomBytes(4).toString("hex")
  const prefix = `sk_live_${prefixBytes}`
  const raw = `${prefix}_${bytes}`
  const hashed = bcrypt.hashSync(raw, 10)
  return { raw, prefix, hashed }
}

export async function validateApiKey(raw: string): Promise<string | null> {
  if (!raw || !raw.startsWith("sk_live_")) return null
  
  // prefix is the first 3 underscore-separated segments: sk_live_XXXX
  const parts = raw.split("_")
  if (parts.length < 4) return null
  const prefix = `${parts[0]}_${parts[1]}_${parts[2]}`
  
  const { db } = await import("@/lib/db")
  const keyRecord = await db.apiKey.findUnique({ where: { prefix } })
  if (!keyRecord) return null
  
  const valid = bcrypt.compareSync(raw, keyRecord.hashedKey)
  if (!valid) return null
  
  // fire and forget — update lastUsedAt
  db.apiKey.update({ 
    where: { prefix }, 
    data: { lastUsedAt: new Date() } 
  }).catch(() => {})
  
  return keyRecord.userId
}
