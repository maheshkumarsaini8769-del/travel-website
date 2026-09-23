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

import ZenuxOAuth from 'zenuxs-oauth'

function sign(value: string): string {
  return createHmac('sha256', process.env.ADMIN_SECRET ?? 'sunsky-dev-secret').update(value).digest('hex')
}

export interface AdminMeta {
  email?: string
  name?: string
  role?: AdminRole
  permissions?: string[]
}

export function createAdminToken(adminId: string, meta?: AdminMeta): string {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * SESSION_DAYS
  const payload = {
    adminId,
    email: meta?.email || '',
    name: meta?.name || '',
    role: meta?.role || 'superadmin',
    permissions: meta?.permissions || ['*'],
    expiry,
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const mac = sign(payloadB64)
  return `v2.${payloadB64}.${mac}`
}

export interface AdminSession {
  adminId: string
  expiry: number
  resolved?: ResolvedAdmin
}

export function getAdminSession(): AdminSession | null {
  const token = cookies().get(ADMIN_COOKIE)?.value
  if (!token) return null

  // Support v2 self-contained token
  if (token.startsWith('v2.')) {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [, payloadB64, mac] = parts
    if (!payloadB64 || !mac) return null
    const expected = sign(payloadB64)
    const a = Buffer.from(mac)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    try {
      const json = Buffer.from(payloadB64, 'base64url').toString('utf8')
      const p = JSON.parse(json)
      const exp = Number(p.expiry)
      if (!Number.isFinite(exp) || exp < Date.now()) return null
      const resolved: ResolvedAdmin = {
        id: p.adminId,
        email: p.email || 'admin@sunskytourism.in',
        username: p.email || 'admin',
        name: p.name || 'Admin',
        role: p.role || 'superadmin',
        permissions: p.permissions || ['*'],
        fromDb: p.adminId !== ENV_ADMIN_ID,
      }
      return { adminId: p.adminId, expiry: exp, resolved }
    } catch {
      return null
    }
  }

  // Support legacy expiry.adminId.mac token
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
  email: string
  username: string
  name: string
  role: AdminRole
  permissions: string[]
  fromDb: boolean
}

export const ENV_ADMIN_ID = 'env-admin'

const adminCache = new Map<string, { admin: ResolvedAdmin; cachedAt: number }>()
const CACHE_TTL_MS = 60 * 1000 // 60 seconds memory cache

export function clearAdminSessionCache(adminId?: string) {
  if (adminId) {
    adminCache.delete(adminId)
  } else {
    adminCache.clear()
  }
}

async function resolveAdminFromDb(adminId: string): Promise<ResolvedAdmin | null> {
  const cached = adminCache.get(adminId)
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.admin
  }

  try {
    const col = await adminsCollection()
    const doc = await col.findOne({ _id: adminId })
    if (!doc || !doc.active) return null
    const admin: ResolvedAdmin = {
      id: doc._id,
      email: doc.email,
      username: doc.username ?? doc.email,
      name: doc.name,
      role: doc.role,
      permissions: doc.permissions,
      fromDb: true,
    }
    adminCache.set(adminId, { admin, cachedAt: Date.now() })
    return admin
  } catch {
    return cached?.admin ?? null
  }
}

export function resolveEnvAdmin(): ResolvedAdmin {
  return {
    id: ENV_ADMIN_ID,
    email: 'admin@sunskytourism.in',
    username: 'admin',
    name: 'Admin',
    role: 'superadmin',
    permissions: ['*'],
    fromDb: false,
  }
}

// Validate Zenuxs OAuth tokens from headers or cookies using inbuilt functions
export async function resolveAdminFromOAuth(): Promise<ResolvedAdmin | null> {
  try {
    const h = headers()
    const c = cookies()

    let accessToken = ''
    const authHeader = h.get('authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      accessToken = authHeader.slice(7).trim()
    }
    if (!accessToken) {
      accessToken = c.get('zenux_access_token')?.value || c.get('access_token')?.value || ''
    }
    const idToken = c.get('zenux_id_token')?.value || c.get('id_token')?.value || ''

    if (!accessToken && !idToken) return null

    const oauth = new ZenuxOAuth({
      clientId: process.env.NEXT_PUBLIC_ZENUX_CLIENT_ID || '1fe396337ca4c424',
    })

    let email = ''
    let name = ''

    // 1. Inbuilt decodeJWT() on idToken if available
    if (idToken) {
      try {
        const payload = oauth.decodeJWT(idToken)
        if (payload?.email) {
          email = String(payload.email).trim().toLowerCase()
        }
        if (payload?.name || payload?.nickname || payload?.preferred_username) {
          name = String(payload.name || payload.nickname || payload.preferred_username).trim()
        }
      } catch {}
    }

    // 2. Inbuilt decodeJWT() on accessToken if available
    if (!email && accessToken) {
      try {
        const payload = oauth.decodeJWT(accessToken)
        if (payload?.email) {
          email = String(payload.email).trim().toLowerCase()
        }
        if (payload?.name || payload?.nickname || payload?.preferred_username) {
          name = String(payload.name || payload.nickname || payload.preferred_username).trim()
        }
      } catch {}
    }

    // 3. Inbuilt getUserInfo() if email not extracted from decodeJWT
    if (!email && accessToken) {
      try {
        ;(oauth as any).setTokens({ access_token: accessToken, id_token: idToken })
        const userInfo = await oauth.getUserInfo()
        if (userInfo?.email) {
          email = String(userInfo.email).trim().toLowerCase()
        }
        if (userInfo?.name || userInfo?.nickname) {
          name = String(userInfo.name || userInfo.nickname).trim()
        }
      } catch {}
    }

    if (!email) return null

    // Check DB for existing admin or auto-provision
    const existing = await findAdminByEmail(email)
    if (existing) {
      if (!existing.active) return null
      return {
        id: existing._id,
        email: existing.email,
        username: existing.username ?? existing.email,
        name: existing.name,
        role: existing.role,
        permissions: existing.permissions,
        fromDb: true,
      }
    }

    const createdId = await createAdminFromEmail(email, name || email.split('@')[0])
    return {
      id: createdId ?? ENV_ADMIN_ID,
      email,
      username: email,
      name: name || email.split('@')[0],
      role: 'superadmin',
      permissions: ['*'],
      fromDb: Boolean(createdId),
    }
  } catch {
    return null
  }
}

export async function getCurrentAdmin(): Promise<ResolvedAdmin | null> {
  const session = getAdminSession()
  if (session) {
    if (session.resolved) return session.resolved
    if (session.adminId === ENV_ADMIN_ID) return resolveEnvAdmin()
    const dbAdmin = await resolveAdminFromDb(session.adminId)
    if (dbAdmin) return dbAdmin
  }

  // Fallback to validating Zenuxs OAuth token directly via inbuilt functions
  const oauthAdmin = await resolveAdminFromOAuth()
  if (oauthAdmin) return oauthAdmin

  return null
}

export async function findAdminByEmail(email: string): Promise<AdminDoc | null> {
  try {
    const col = await adminsCollection()
    return await col.findOne({ email: email.toLowerCase() })
  } catch {
    return null
  }
}

export async function createAdminFromEmail(email: string, name?: string): Promise<string | null> {
  try {
    ensureIndexesOnce()
    const col = await adminsCollection()
    const id = crypto.randomUUID()
    const { salt, hash } = hashPassword(crypto.randomUUID().slice(0, 12))
    await col.insertOne({
      _id: id,
      email: email.toLowerCase(),
      passwordHash: hash,
      salt,
      name: name ?? email.split('@')[0],
      role: 'superadmin',
      permissions: ['*'],
      active: true,
      createdAt: Date.now(),
    })
    return id
  } catch {
    return null
  }
}

export async function requireAdmin(permission?: string): Promise<Response> {
  const admin = await getCurrentAdmin()
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (permission && !hasPermission(admin, permission)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null as never
}

export function getAdminCookieOptions(): {
  httpOnly: boolean
  sameSite: 'lax'
  secure: boolean
  maxAge: number
  path: string
} {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecureRequest(),
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: '/',
  }
}

export function setAdminSessionCookie(adminId: string, meta?: AdminMeta): void {
  try {
    cookies().set(ADMIN_COOKIE, createAdminToken(adminId, meta), getAdminCookieOptions())
  } catch {}
}

export function clearAdminSessionCookie(): void {
  clearAdminSessionCache()
  const opts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isSecureRequest(),
    maxAge: 0,
    path: '/',
  }
  try {
    cookies().set(ADMIN_COOKIE, '', opts)
    cookies().set('zenux_access_token', '', opts)
    cookies().set('zenux_id_token', '', opts)
    cookies().set('access_token', '', opts)
    cookies().set('id_token', '', opts)
  } catch {}
}

function isSecureRequest(): boolean {
  try {
    const h = headers()
    const host = h.get('host') || ''
    if (host.includes('localhost') || host.includes('127.0.0.1')) return false
    const proto = h.get('x-forwarded-proto')
    if (proto === 'https') return true
    if (h.get('x-forwarded-ssl') === 'on') return true
    const referer = h.get('referer')
    if (referer && referer.startsWith('https://')) return true
    return process.env.NODE_ENV === 'production'
  } catch {
    return process.env.NODE_ENV === 'production'
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
