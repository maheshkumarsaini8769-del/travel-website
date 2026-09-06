'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Building2, Compass, FileText, Home, Megaphone, PanelBottom, Share2, Search, Wallet, Shield, Trash2, Plus, Mail } from 'lucide-react'
import { Button, Field, PageHeader, Spinner, useToast } from '@/components/admin/ui'
import type { SiteSettings } from '@/lib/settings'

type SectionKey = keyof SiteSettings
type EditorValue = string | number | boolean | string[]

const TABS: { key: SectionKey | 'security'; label: string; icon: typeof Home }[] = [
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'hero', label: 'Hero', icon: Compass },
  { key: 'about', label: 'About', icon: FileText },
  { key: 'contact', label: 'Contact', icon: Megaphone },
  { key: 'footer', label: 'Footer', icon: PanelBottom },
  { key: 'social', label: 'Social', icon: Share2 },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'booking', label: 'Booking Rules', icon: Wallet },
  { key: 'security', label: 'Admin Emails', icon: Shield },
]

const FieldCtx = createContext<{ section: Record<string, EditorValue>; setField: (key: string, value: EditorValue) => void }>({ section: {}, setField: () => {} })

function Input({ k, label, type = 'text', placeholder }: { k: string; label: string; type?: string; placeholder?: string }) {
  const { section, setField } = useContext(FieldCtx)
  return (
    <Field label={label}>
      <input
        type={type}
        value={(section[k] as string) ?? ''}
        onChange={(e) => setField(k, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
      />
    </Field>
  )
}

function Area({ k, label, rows = 3 }: { k: string; label: string; rows?: number }) {
  const { section, setField } = useContext(FieldCtx)
  return (
    <Field label={label}>
      <textarea
        rows={rows}
        value={(section[k] as string) ?? ''}
        onChange={(e) => setField(k, e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-orange-400/50"
      />
    </Field>
  )
}

function ListField({ k, label }: { k: string; label: string }) {
  const { section, setField } = useContext(FieldCtx)
  return (
    <Field label={label} hint="One per line">
      <textarea
        rows={3}
        value={(section[k] as string[] | undefined)?.join('\n') ?? ''}
        onChange={(e) => setField(k, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-orange-400/50"
      />
    </Field>
  )
}

function FieldGrid({ section, setField, children }: { section: Record<string, EditorValue>; setField: (key: string, value: EditorValue) => void; children: ReactNode }) {
  return (
    <FieldCtx.Provider value={{ section, setField }}>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </FieldCtx.Provider>
  )
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState<SectionKey | 'security'>('business')
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [busy, setBusy] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) setSettings((await res.json()) as SiteSettings)
    } catch {
      /* leave null → fallback below */
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (!settings) {
    return <Spinner label="Loading settings…" />
  }

  const isSecurity = tab === 'security'
  const section = isSecurity ? {} : (settings[tab as SectionKey] as unknown as Record<string, EditorValue>)

  const setField = (key: string, value: EditorValue) => {
    if (isSecurity) return
    setSettings((s) => (s ? ({ ...s, [tab]: { ...(s[tab as SectionKey] as Record<string, unknown>), [key]: value } } as SiteSettings) : s))
    setSavedMsg('')
  }

  const save = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: tab, value: section }),
      })
      if (!res.ok) throw new Error()
      toast('success', 'Settings saved — live on the website')
      setSavedMsg('Saved')
    } catch {
      toast('error', 'Save failed — database not connected?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Business info, website text and booking rules"
        actions={
          !isSecurity ? (
            <Button onClick={save} disabled={busy}>
              {busy ? 'Saving…' : 'Save section'}
            </Button>
          ) : null
        }
      />

      <div className="mb-6 flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${tab === t.key ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        {tab === 'business' && (
          <FieldGrid section={section} setField={setField}>
            <Input k="brand" label="Brand name" />
            <Input k="tagline" label="Tagline" />
            <Input k="headline" label="Headline" />
            <Input k="proprietor" label="Proprietor" />
            <Input k="proprietorTitle" label="Proprietor title" />
            <Input k="email" label="Email" type="email" />
            <Input k="website" label="Website" />
            <div className="sm:col-span-2">
              <Input k="address" label="Address (short)" />
            </div>
            <div className="sm:col-span-2">
              <Area k="addressFull" label="Full address" rows={2} />
            </div>
            <ListField k="phones" label="Phone numbers" />
            <ListField k="phoneLinks" label="Call links (tel: links)" />
            <Input k="whatsappPrimary" label="Primary WhatsApp number" />
            <Input k="whatsappSecondary" label="Secondary WhatsApp number" />
            <Input k="latitude" label="Google Maps Latitude" placeholder="e.g. 27.6094" />
            <Input k="longitude" label="Google Maps Longitude" placeholder="e.g. 75.1399" />
          </FieldGrid>
        )}

        {tab === 'hero' && (
          <FieldGrid section={section} setField={setField}>
            <Input k="eyebrow" label="Eyebrow" />
            <Input k="title1" label="Headline part 1" />
            <Input k="title2" label="Headline part 2" />
            <Input k="primaryCta" label="Primary button text" />
            <Input k="secondaryCta" label="Secondary button text" />
            <div className="sm:col-span-2">
              <Area k="description" label="Description" rows={3} />
            </div>
          </FieldGrid>
        )}

        {tab === 'about' && (
          <FieldGrid section={section} setField={setField}>
            <Input k="title" label="Title" />
            <Area k="description" label="Description" rows={6} />
          </FieldGrid>
        )}

        {tab === 'contact' && (
          <FieldGrid section={section} setField={setField}>
            <Input k="headline" label="Headline" />
            <Area k="subheadline" label="Sub-headline" rows={2} />
          </FieldGrid>
        )}

        {tab === 'footer' && (
          <FieldGrid section={section} setField={setField}>
            <Area k="about" label="About text" rows={5} />
            <Input k="copyright" label="Copyright line" />
          </FieldGrid>
        )}

        {tab === 'social' && (
          <FieldGrid section={section} setField={setField}>
            <Input k="facebook" label="Facebook URL" />
            <Input k="instagram" label="Instagram URL" />
            <Input k="youtube" label="YouTube URL" />
            <Input k="whatsapp" label="WhatsApp URL" />
          </FieldGrid>
        )}

        {tab === 'seo' && (
          <FieldGrid section={section} setField={setField}>
            <Input k="defaultTitle" label="Default page title" />
            <Area k="defaultDescription" label="Default meta description" rows={3} />
          </FieldGrid>
        )}

        {tab === 'booking' && (
          <FieldGrid section={section} setField={setField}>
            <Input k="advancePercent" label="Advance payment %" type="number" />
            <Input k="minAdvanceDays" label="Min advance days before travel" type="number" />
            <div className="sm:col-span-2">
              <Area k="cancellationPolicy" label="Cancellation policy text" rows={4} />
            </div>
          </FieldGrid>
        )}

        {tab === 'security' && <SecurityTab />}
      </div>

      <p className="mt-4 text-xs text-slate-600">{savedMsg ? 'Saved — changes are live.' : 'Changes apply instantly across the website.'}</p>
    </div>
  )
}

function SecurityTab() {
  const { toast } = useToast()
  const [emails, setEmails] = useState<{ email: string; name: string; role: string; active: boolean }[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setEmails(data.map((u: any) => ({ email: u.email, name: u.name, role: u.role, active: u.active })))
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  const addEmail = async () => {
    if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast('error', 'Valid email required')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim().toLowerCase(), name: newName.trim() || newEmail.split('@')[0], role: 'manager' }),
      })
      if (res.ok) {
        toast('success', 'Admin added — they can now login via Google OAuth')
        setNewEmail('')
        setNewName('')
        await load()
      } else {
        const j = await res.json().catch(() => null)
        toast('error', j?.error ?? 'Failed to add')
      }
    } catch { toast('error', 'Failed') }
    setBusy(false)
  }

  const removeEmail = async (email: string) => {
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, { method: 'DELETE' })
      if (res.ok) {
        toast('success', 'Removed')
        await load()
      } else {
        const j = await res.json().catch(() => null)
        toast('error', j?.error ?? 'Failed')
      }
    } catch { toast('error', 'Failed') }
  }

  return (
    <div className="max-w-lg">
      <h3 className="text-lg font-bold text-white">Admin Emails</h3>
      <p className="mt-1 text-sm text-slate-400">
        Only these emails can login via Google OAuth. No passwords needed.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="admin@example.com"
          onKeyDown={(e) => e.key === 'Enter' && addEmail()}
          className="flex-1 rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
        />
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name (optional)"
          onKeyDown={(e) => e.key === 'Enter' && addEmail()}
          className="w-40 rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
        />
        <button
          onClick={addEmail}
          disabled={busy || !newEmail.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-400 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <Spinner label="Loading…" />
      ) : (
        <div className="mt-6 space-y-2">
          {emails.map((a) => (
            <div key={a.email} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/5 p-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{a.email}</p>
                  <p className="text-[11px] text-slate-500">{a.name} · {a.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                  {a.active ? 'Active' : 'Disabled'}
                </span>
                <button
                  onClick={() => removeEmail(a.email)}
                  className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {emails.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No admin emails yet. Add one above.</p>
          )}
        </div>
      )}
    </div>
  )
}