import { query, isMock } from '../core/db.js';
import { v4 as uuid } from 'uuid';

/**
 * Centralized audit logger middleware factory.
 * Usage: logAudit(action, entity)(req, res, next)
 * Or call: await writeAuditLog(req, action, entity, entityId, oldVal, newVal)
 */
export async function writeAuditLog(req, action, entity, entityId = null, oldValue = null, newValue = null) {
  if (isMock()) return;
  try {
    const id = `log-${uuid().slice(0, 8)}`;
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;
    await query(
      `INSERT INTO audit_logs (id, school_id, user_id, user_name, action, entity, entity_id, old_value, new_value, ip_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        id,
        req.user?.school_id || null,
        req.user?.sub || null,
        req.user?.name || null,
        action,
        entity,
        entityId,
        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null,
        ip
      ]
    );
  } catch (err) {
    // Never let audit logging crash the main flow
    console.error('Audit log error:', err.message);
  }
}
