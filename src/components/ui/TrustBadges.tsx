import { BadgeCheck, ShieldCheck, Clock, Wallet } from 'lucide-react'

const items = [
  { icon: BadgeCheck, label: 'Registered Agency' },
  { icon: ShieldCheck, label: 'No Hidden Charges' },
  { icon: Clock, label: '24×7 Trip Support' },
  { icon: Wallet, label: 'Best Price Promise' },
]

export default function TrustBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-3 lg:grid-cols-4 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <Icon className="h-5 w-5 shrink-0 text-orange-400" />
            <span className="text-xs font-semibold text-slate-200 sm:text-sm">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
