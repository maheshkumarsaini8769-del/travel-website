'use client'

import { useCallback, useEffect, useState } from 'react'
import { Building2, Compass, FileText, Home, Megaphone, PanelBottom, Share2, Search, Wallet, Shield, Eye, EyeOff } from 'lucide-react'
import { Button, Field, PageHeader, Spinner, useToast } from '@/components/admin/ui'
import type { SiteSettings } from '@/lib/settings'

type SectionKey = keyof SiteSettings

const TABS: { key: SectionKey | 'security'; label: string; icon: typeof Home }[] = [
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'hero', label: 'Hero', icon: Compass },
  { key: 'about', label: 'About', icon: FileText },
  { key: 'contact', label: 'Contact', icon: Megaphone },
  { key: 'footer', label: 'Footer', icon: PanelBottom },
  { key: 'social', label: 'Social', icon: Share2 },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'booking', label: 'Booking Rules', icon: Wallet },
  { key: 'security', label: 'Security', icon: Shield },
]

type EditorValue = string | number | boolean | string[]

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

  const set = (key: string, value: EditorValue) => {
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

  const Input = ({ k, label, type = 'text', placeholder }: { k: string; label: string; type?: string; placeholder?: string }) => (
    <Field label={label}>
      <input
        type={type}
        value={section[k] as string}
        onChange={(e) => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
      />
    </Field>
  )

  const Area = ({ k, label, rows = 3 }: { k: string; label: string; rows?: number }) => (
    <Field label={label}>
      <textarea
        rows={rows}
        value={section[k] as string}
        onChange={(e) => set(k, e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-orange-400/50"
      />
    </Field>
  )

  const ListField = ({ k, label }: { k: string; label: string }) => (
    <Field label={label} hint="One per line">
      <textarea
        rows={3}
        value={(section[k] as string[] | undefined)?.join('\n') ?? ''}
        onChange={(e) => set(k, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors focus:border-orange-400/50"
      />
    </Field>
  )

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
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
        )}

        {tab === 'hero' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input k="eyebrow" label="Eyebrow" />
            <Input k="title1" label="Headline part 1" />
            <Input k="title2" label="Headline part 2" />
            <Input k="primaryCta" label="Primary button text" />
            <Input k="secondaryCta" label="Secondary button text" />
            <div className="sm:col-span-2">
              <Area k="description" label="Description" rows={3} />
            </div>
          </div>
        )}

        {tab === 'about' && (
          <div className="grid gap-4">
            <Input k="title" label="Title" />
            <Area k="description" label="Description" rows={6} />
          </div>
        )}

        {tab === 'contact' && (
          <div className="grid gap-4">
            <Input k="headline" label="Headline" />
            <Area k="subheadline" label="Sub-headline" rows={2} />
          </div>
        )}

        {tab === 'footer' && (
          <div className="grid gap-4">
            <Area k="about" label="About text" rows={5} />
            <Input k="copyright" label="Copyright line" />
          </div>
        )}

        {tab === 'social' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input k="facebook" label="Facebook URL" />
            <Input k="instagram" label="Instagram URL" />
            <Input k="youtube" label="YouTube URL" />
            <Input k="whatsapp" label="WhatsApp URL" />
          </div>
        )}

        {tab === 'seo' && (
          <div className="grid gap-4">
            <Input k="defaultTitle" label="Default page title" />
            <Area k="defaultDescription" label="Default meta description" rows={3} />
          </div>
        )}

        {tab === 'booking' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input k="advancePercent" label="Advance payment %" type="number" />
            <Input k="minAdvanceDays" label="Min advance days before travel" type="number" />
            <div className="sm:col-span-2">
              <Area k="cancellationPolicy" label="Cancellation policy text" rows={4} />
            </div>
          </div>
        )}

        {tab === 'security' && <SecurityTab />}
      </div>

      <p className="mt-4 text-xs text-slate-600">{savedMsg ? 'Saved — changes are live.' : 'Changes apply instantly across the website.'}</p>
    </div>
  )
}

function SecurityTab() {
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [busy, setBusy] = useState(false)

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast('error', 'Fill in all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast('error', 'New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast('error', 'New password must be at least 6 characters')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        toast('success', 'Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast('error', data.error ?? 'Failed to change password')
      }
    } catch {
      toast('error', 'Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-bold text-white">Change Password</h3>
      <p className="mt-1 text-sm text-slate-400">Update your admin login password.</p>

      <div className="mt-6 space-y-4">
        <Field label="Current password">
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 pr-11 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <Field label="New password">
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 pr-11 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <Field label="Confirm new password">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full rounded-xl border border-white/10 bg-[#0d0d10] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50"
          />
        </Field>
      </div>

      <button
        onClick={changePassword}
        disabled={busy || !currentPassword || !newPassword || !confirmPassword}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Changing…' : 'Change Password'}
        <Shield className="h-4 w-4" />
      </button>
    </div>
  )
}