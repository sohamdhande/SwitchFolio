import { db } from "@/lib/db";
import { headers } from "next/headers";

interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
}

/**
 * Logs a security-relevant event to the AuditLog table.
 * Automatically captures IP and User-Agent from the request headers.
 * Fire-and-forget: never blocks the response.
 */
export function logAudit(event: AuditEvent): void {
  const headersList = headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  const userAgent = headersList.get("user-agent") ?? "unknown";

  db.auditLog
    .create({
      data: {
        userId: event.userId,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId ?? null,
        ip,
        userAgent,
      },
    })
    .catch((err) => {
      console.error("Audit log write failed:", err);
    });
}
