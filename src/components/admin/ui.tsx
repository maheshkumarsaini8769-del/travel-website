'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, Loader2, Search, X } from 'lucide-react'

// ---------------------------------------------------------------------------
// Toast system
// ---------------------------------------------------------------------------

interface Toast {
  id: number
  kind: 'success' | 'error' | 'info'
  message: string
}

const ToastCtx = createContext<{ toast: (kind: Toast['kind'], message: string) => void }>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((kind: Toast['kind'], message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, kind, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500)
  }, [])

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur-xl ${
              t.kind === 'success'
                ? 'border-emerald-400/30 bg-emerald-950/90 text-emerald-100'
                : t.kind === 'error'
                ? 'border-rose-400/30 bg-rose-950/90 text-rose-100'
                : 'border-sky-400/30 bg-sky-950/90 text-sky-100'
            }`}
          >
            {t.kind === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : t.kind === 'error' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="shrink-0 opacity-60 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="h-7 w-7 animate-spin text-orange-400" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400">
        <Search className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-slate-300">{title}</p>
      {hint && <p className="max-w-sm text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-950/20 px-6 py-14 text-center">
      <AlertTriangle className="h-8 w-8 text-rose-400" />
      <p className="text-sm text-rose-200">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:border-orange-400/40">
          Try again
        </button>
      )}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}>{children}</div>
}

export function Badge({ color = 'slate', children }: { color?: 'slate' | 'green' | 'amber' | 'rose' | 'sky' | 'orange' | 'violet'; children: ReactNode }) {
  const map: Record<string, string> = {
    slate: 'border-slate-400/30 bg-slate-500/10 text-slate-300',
    green: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
    rose: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
    sky: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
    orange: 'border-orange-400/30 bg-orange-500/10 text-orange-300',
    violet: 'border-violet-400/30 bg-violet-500/10 text-violet-300',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${map[color]}`}>{children}</span>
}

export function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    pending: 'amber', confirmed: 'sky', 'in-progress': 'violet', completed: 'green', cancelled: 'rose', refunded: 'rose',
    paid: 'green', partial: 'amber', new: 'sky', contacted: 'sky', 'follow-up': 'amber', interested: 'violet', converted: 'green', lost: 'rose',
    published: 'green', draft: 'slate', archived: 'slate', active: 'green', maintenance: 'amber', inactive: 'slate', received: 'green', failed: 'rose',
  }
  return <Badge color={(colorMap[status] ?? 'slate') as 'slate'}>{status.replace('-', ' ')}</Badge>
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-[#0d0d10] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:border-orange-400/50'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return <input {...rest} className={`${inputCls} ${className}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return <textarea {...rest} className={`${inputCls} ${className}`} />
}

export function Select({ options, ...props }: { options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', ...rest } = props
  return (
    <select {...rest} className={`${inputCls} appearance-none ${className}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0d0d10]">
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-600">{hint}</span>}
    </label>
  )
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_4px_20px_rgba(249,115,22,0.25)]',
    ghost: 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-400/30 hover:bg-rose-500/25',
    outline: 'bg-transparent text-slate-300 border border-white/15 hover:border-orange-400/40',
  }
  return (
    <button type={type} {...rest} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function IconButton({ children, title, onClick, danger }: { children: ReactNode; title: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
        danger ? 'border-rose-400/20 text-rose-300 hover:bg-rose-500/10' : 'border-white/10 text-slate-300 hover:border-orange-400/40 hover:text-orange-300'
      }`}
    >
      {children}
    </button>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search…'}
        className={`${inputCls} pl-9`}
      />
    </div>
  )
}

export function Pagination({ page, total, limit, onPage }: { page: number; total: number; limit: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit))
  if (pages <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
      <span>
        Page {page} of {pages} · {total} total
      </span>
      <div className="flex gap-1.5">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-semibold disabled:opacity-40">
          Prev
        </button>
        <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-semibold disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal + Confirm
// ---------------------------------------------------------------------------

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d11] p-6 shadow-2xl`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <IconButton title="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete' }: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-5 text-sm text-slate-400">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}