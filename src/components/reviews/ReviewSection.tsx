import SectionHeading from '@/components/ui/SectionHeading'
import ReviewForm from '@/components/reviews/ReviewForm'
import { ShieldCheck, Star, MessageCircle } from 'lucide-react'
import { waLink } from '@/data/contact'

interface ReviewSectionProps {
  compact?: boolean
}

export default function ReviewSection({ compact = false }: ReviewSectionProps) {
  return (
    <section className={`relative ${compact ? 'py-20 sm:py-24' : 'py-24 sm:py-32'}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(249,115,22,0.05),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Leave a Review"
              title="Travelled with us? Tell everyone."
              description={
                compact
                  ? 'Your feedback helps other travellers — and helps us serve you better next time.'
                  : 'Every review is read by our team and verified before publishing. Genuine feedback, good or bad, goes straight on the website.'
              }
              align="left"
            />
            <ul className="mt-2 space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                Reviews are verified before they go live — no fake endorsements.
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Star className="h-5 w-5" />
                </span>
                Your rating shows publicly next to your first name.
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <a
                  href={waLink('Hello Sunsky Tourism, I would like to share feedback about my trip.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 transition-colors hover:text-[#25D366]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span>
                    Prefer chatting? Send feedback on{' '}
                    <span className="font-semibold underline-offset-4 group-hover:underline">WhatsApp</span>.
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <ReviewForm />
        </div>
      </div>
    </section>
  )
}