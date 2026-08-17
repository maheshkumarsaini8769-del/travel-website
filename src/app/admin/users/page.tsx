'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import { Badge, Button, ConfirmDialog, Field, Modal, PageHeader, Spinner, useToast } from '@/components/admin/ui'

interface AdminUser {
  id: string
  username: string
  name: string
  role: string
  permissions: string[]
  active: boolean
  lastLoginAt?: number | null
  createdAt: number
}

const ROLES: { value: string; label: string; hint: string }[] = [
  { value: 'superadmin', label: 'Super Admin', hint: 'Full access' },
  { value: 'manager', label: 'Manager', hint: 'Everything except user management' },
  { value: 'booking-staff', label: 'Booking Staff', hint: 'Bookings, leads, customers, payments' },
  { value: 'content-manager', label: 'Content Manager', hint: 'Packages, destinations, hotels, CMS' },
]

const ROLE_COLORS: Record<string, 'orange' | 'green' | 'sky' | 'slate'> = {
  superadmin: 'orange',
  manager: 'green',
  'booking-staff': 'sky',
  'content-manager': 'slate',
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [toDelete, setToDelete] = useState<AdminUser | null>(null)
  const [form, setForm] = useState({ username: '', name: '', role: 'manager', password: '', active: true })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) setUsers((await res.json()) as AdminUser[])
      else toast('error', 'Could not load users')
    } catch {
      toast('error', 'Could not load users')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    if (!form.username.trim() || form.password.length < 8) {
      toast('error', 'Username and an 8+ char password are required')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null
        toast('error', j?.error ?? 'Create failed')
        return
      }
      toast('success', 'User created')
      setOpen(false)
      setForm({ username: '', name: '', role: 'manager', password: '', active: true })
      await load()
    } finally {
      setBusy(false)
    }
  }

  const toggleActive = async (u: AdminUser) => {
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !u.active }),
    })
    if (res.ok) {
      toast('success', u.active ? 'User deactivated' : 'User activated')
      await load()
    } else toast('error', 'Update failed')
  }

  if (loading) return <Spinner label="Loading users…" />

  return (
    <div>
      <PageHeader
        title="Admin Users"
        subtitle="Who can sign into this panel — with roles"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> New User
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Last login</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white/5 p-2 text-slate-400">
                        {u.role === 'superadmin' ? <ShieldCheck className="h-3.5 w-3.5 text-orange-400" /> : <UserRound className="h-3.5 w-3.5" />}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{u.name || u.username}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-slate-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={ROLE_COLORS[u.role] ?? 'slate'}>{u.role}</Badge>
                    <p className="mt-1 text-[10px] text-slate-600">{ROLES.find((r) => r.value === u.role)?.hint}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN') : 'Never'}</td>
                  <td className="px-5 py-4">
                    <Badge color={u.active ? 'green' : 'rose'}>{u.active ? 'Active' : 'Disabled'}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => void toggleActive(u)} className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-bold ${u.active ? 'border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'}`}>
                        {u.active ? 'Disable' : 'Enable'}
                      </button>
                      {u.role !== 'superadmin' || users.filter((x) => x.role === 'superadmin' && x.active).length > 1 ? (
                        <button onClick={() => setToDelete(u)} className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New admin user">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username">
              <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" placeholder="rahul" />
            </Field>
            <Field label="Display name">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" placeholder="Rahul Sharma" />
            </Field>
          </div>
          <Field label="Role">
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label} — {r.hint}</option>)}
            </select>
          </Field>
          <Field label="Password" hint="At least 8 characters">
            <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-400/50" autoComplete="new-password" />
          </Field>
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-4 w-4 accent-orange-500" />
            <span className="text-sm text-slate-300">Active immediately</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? 'Creating…' : 'Create user'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          const res = await fetch(`/api/admin/users/${toDelete.id}`, { method: 'DELETE' })
          if (res.ok) {
            toast('success', 'User deleted')
            await load()
          } else {
            const j = (await res.json().catch(() => null)) as { error?: string } | null
            toast('error', j?.error ?? 'Delete failed')
          }
        }}
        title="Delete user?"
        message={`${toDelete?.name || toDelete?.username} will lose access permanently.`}
      />
    </div>
  )
}