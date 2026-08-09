import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import StarRating from '@/components/ui/StarRating'
import TrustBadges from '@/components/ui/TrustBadges'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { hotels, formatHotelPrice } from '@/data/hotels'
import { ctaImages } from '@/data/images'
import { waLink } from '@/data/contact'
import { waHotelMessage } from '@/lib/helpers'
import { BedDouble, Check, MapPin, Wallet } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hotels & Stays | Sunsky Tourism',
  description:
    'Handpicked hotels, palaces, desert camps, houseboats and beach resorts across India — with the best available rates and honest booking advice.',
}

export default function HotelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Hotels & Stays"
        title="Stay in places worth staying for."
        description="From royal palace hotels to lake houseboats and luxury desert camps — handpicked stays at rates better than booking portals."
        image={ctaImages.cinematic}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TrustBadges className="mb-12" />

          <div className="mb-14 grid gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:grid-cols-3 sm:p-9">
            {[
              { icon: BedDouble, title: '6 featured stays', text: 'Palaces, camps, houseboats and resorts — a taste of what we book.' },
              { icon: Wallet, title: 'Best available rate', text: 'We compare and negotiate, so you never overpay for a night.' },
              { icon: MapPin, title: '50+ partner properties', text: 'From Sikar to Srinagar and beyond, we book across India and the world.' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-white">{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{f.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel, i) => (
              <StaggerItem key={hotel.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      loading="lazy" decoding="async"
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden="true" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                      {hotel.type}
                    </span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold text-white">
                      {Math.round(((hotel.originalPrice - hotel.priceFrom) / hotel.originalPrice) * 100)}% off
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-white">{hotel.name}</h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="h-3.5 w-3.5 text-orange-400" />
                          {hotel.city}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400">
                        {hotel.distanceNote}
                      </span>
                    </div>
                    <div className="mt-3">
                      <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{hotel.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {hotel.amenities.slice(0, 5).map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300"
                        >
                          <Check className="h-3 w-3 text-emerald-400" />
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Starting / night</p>
                        <p className="text-xl font-bold text-white">
                          {formatHotelPrice(hotel.priceFrom)}
                          <span className="ml-1.5 text-sm font-normal text-slate-500 line-through">
                            {formatHotelPrice(hotel.originalPrice)}
                          </span>
                        </p>
                      </div>
                      <a
                        href={waLink(waHotelMessage(hotel.name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                      >
                        Check Availability
                      </a>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <SectionHeading
              eyebrow="More options"
              title="Looking for a specific hotel?"
              description="Tell us the city, dates and budget — we will come back with 3–5 handpicked options at our negotiated rates, anywhere in India or the world."
              className="mb-0"
            />
            <a
              href={waLink('Hello Sunsky Tourism, I need hotel recommendations. Please share options based on my city and budget.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Hotel Recommendations
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
