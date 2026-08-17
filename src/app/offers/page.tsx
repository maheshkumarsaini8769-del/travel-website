import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import TrustBadges from '@/components/ui/TrustBadges'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { offers } from '@/data/offers'
import { ctaImages } from '@/data/images'
import { waLink } from '@/data/contact'
import { ArrowRight, BadgePercent, Copy, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Offers & Deals | Sunsky Tourism',
  description:
    'Current Sunsky Tourism offers — festive season sale, honeymoon specials, group deals, Dubai flash sales and loyalty discounts. Limited periods, real savings.',
  alternates: { canonical: '/offers' },
}

export default function OffersPage() {
  return (
    <>
      <PageHero
        eyebrow="Offers & Deals"
        title="Travel more, pay less."
        description="Limited-time offers on our most-loved packages and stays. Quote the code on WhatsApp or over the phone — that's all it takes."
        image={ctaImages.cinematic}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TrustBadges className="mb-12" />
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <StaggerItem key={offer.id}>
                <article
                  className={`group flex h-full flex-col overflow-hidden rounded-[24px] border transition-colors duration-500 ${
                    offer.featured
                      ? 'border-orange-400/40 bg-gradient-to-br from-orange-500/10 to-transparent'
                      : 'border-white/10 bg-white/[0.03] hover:border-orange-400/30'
                  }`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      loading="lazy" decoding="async"
                      src={offer.image}
                      alt={offer.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-1.5 text-sm font-bold text-white shadow-lg">
                      <BadgePercent className="h-4 w-4" />
                      {offer.discount}% OFF
                    </span>
                    {offer.featured ? (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5" />
                        Top Deal
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-bold text-white">{offer.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{offer.description}</p>
                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-orange-400/40 bg-orange-500/5 px-4 py-3">
                      <div>
                        <p className="text-[11px] text-slate-500">Use code</p>
                        <p className="font-mono text-sm font-bold tracking-widest text-orange-300">{offer.code}</p>
                      </div>
                      <Copy className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{offer.terms}</p>
                    <p className="mt-2 text-[11px] font-semibold text-slate-400">Valid till {offer.validTill}</p>
                    <a
                      href={waLink(`Hello Sunsky Tourism, I want to use the ${offer.code} offer. Please share the details.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition-all duration-300 hover:gap-3"
                    >
                      Claim this offer
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  )
}
