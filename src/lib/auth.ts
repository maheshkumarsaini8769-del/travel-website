import { cookies, headers } from 'next/headers'
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { adminsCollection, auditLogsCollection, ensureIndexesOnce, type AdminDoc, type AdminRole, ROLE_PERMISSIONS } from './db'

export const ADMIN_COOKIE = 'admin_session'
const SESSION_DAYS = 7

// ---------------------------------------------------------------------------
// Password hashing (scrypt, per-user salt — never plaintext)
// ---------------------------------------------------------------------------

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const s = salt ?? randomBytes(16).toString('hex')
  const hash = scryptSync(password, s, 32).toString('hex')
  return { salt: s, hash }
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const candidate = scryptSync(password, salt, 32)
    const expected = Buffer.from(hash, 'hex')
    return candidate.length === expected.length && timingSafeEqual(candidate, expected)
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Roles & permissions
// ---------------------------------------------------------------------------

export function hasPermission(admin: Pick<AdminDoc, 'role' | 'permissions'>, perm: string): boolean {
  const custom = admin.permissions ?? []
  if (custom.includes('*')) return true
  if (custom.includes(perm)) return true
  const mod = perm.split('.')[0]
  if (custom.includes(`${mod}.*`)) return true
  const rolePerms = ROLE_PERMISSIONS[admin.role] ?? []
  if (rolePerms.includes('*')) return true
  if (rolePerms.includes(perm)) return true
  const roleModule = perm.split('.')[0]
  return rolePerms.includes(`${roleModule}.*`)
}

// ---------------------------------------------------------------------------
// Session tokens — signed, expire after 7 days
// ---------------------------------------------------------------------------

function sign(value: string): string {
  return createHmac('sha256', process.env.ADMIN_SECRET ?? 'sunsky-dev-secret').update(value).digest('hex')
}

export function createAdminToken(adminId: string): string {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * SESSION_DAYS
  return `${expiry}.${adminId}.${sign(`${expiry}.${adminId}`)}`
}

export interface AdminSession {
  adminId: string
  expiry: number
}

export function getAdminSession(): AdminSession | null {
  const token = cookies().get(ADMIN_COOKIE)?.value
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [expiry, adminId, mac] = parts
  if (!expiry || !adminId || !mac) return null
  const exp = Number(expiry)
  if (!Number.isFinite(exp) || exp < Date.now()) return null
  const expected = sign(`${expiry}.${adminId}`)
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  return { adminId, expiry: exp }
}

// Admin record resolved either from DB or the env fallback
export interface ResolvedAdmin {
  id: string
  username: string
  name: string
  role: AdminRole
  permissions: string[]
  fromDb: boolean
}

export const ENV_ADMIN_ID = 'env-admin'

async function resolveAdminFromDb(adminId: string): Promise<ResolvedAdmin | null> {
  try {
    const col = await adminsCollection()
    const doc = await col.findOne({ _id: adminId })
    if (!doc || !doc.active) return null
    return {
      id: doc._id,
      username: doc.username,
      name: doc.name,
      role: doc.role,
      permissions: doc.permissions,
      fromDb: true,
    }
  } catch {
    return null
  }
}

export function resolveEnvAdmin(): ResolvedAdmin {
  return {
    id: ENV_ADMIN_ID,
    username: 'admin',
    name: 'Admin',
    role: 'superadmin',
    permissions: ['*'],
    fromDb: false,
  }
}

export async function getCurrentAdmin(): Promise<ResolvedAdmin | null> {
  const session = getAdminSession()
  if (!session) return null
  if (session.adminId === ENV_ADMIN_ID) return resolveEnvAdmin()
  return resolveAdminFromDb(session.adminId)
}

export async function requireAdmin(permission?: string): Promise<Response> {
  const admin = await getCurrentAdmin()
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (permission && !hasPermission(admin, permission)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null as never
}

export function setAdminSessionCookie(adminId: string): void {
  cookies().set(ADMIN_COOKIE, createAdminToken(adminId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecureRequest(),
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: '/',
  })
}

export function clearAdminSessionCookie(): void {
  cookies().set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: isSecureRequest(), maxAge: 0, path: '/' })
}

function isSecureRequest(): boolean {
  try {
    const proto = headers().get('x-forwarded-proto')
    return proto === 'https'
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Audit logging (best-effort, never breaks the request)
// ---------------------------------------------------------------------------

export async function audit(admin: string, action: string, resource: string, resourceId?: string, metadata?: unknown): Promise<void> {
  try {
    ensureIndexesOnce()
    const col = await auditLogsCollection()
    await col.insertOne({
      _id: crypto.randomUUID(),
      admin,
      action,
      resource,
      resourceId,
      metadata: metadata === undefined ? undefined : JSON.stringify(metadata),
      timestamp: Date.now(),
    })
  } catch {
    // audit is best-effort
  }
}

export function auditSync(admin: string, action: string, resource: string, resourceId?: string, metadata?: unknown): void {
  void audit(admin, action, resource, resourceId, metadata)
}
