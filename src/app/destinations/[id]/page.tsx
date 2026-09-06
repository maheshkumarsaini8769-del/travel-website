import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getDestinationBySlug, getDestinations } from '@/lib/data'
import { tours } from '@/data/tours'
import Gallery from '@/components/ui/Gallery'
import SectionHeading from '@/components/ui/SectionHeading'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import { getSettings, waUrl } from '@/lib/settings'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import JsonLd from '@/components/seo/JsonLd'
import { ArrowLeft, CalendarDays, MapPin, Sparkles, MessageCircle, Navigation, Clock, ArrowRight } from 'lucide-react'
import { contact, mapsUrl } from '@/data/contact'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  const all = await getDestinations()
  return all.map((d) => ({ id: d.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dest = await getDestinationBySlug(params.id)
  if (!dest) return { title: 'Destination Not Found | Sunsky Tourism' }
  return {
    title: `${dest.name} | Sunsky Tourism`,
    description: `${dest.tagline} — ${dest.description} Plan your trip to ${dest.name} with Sunsky Tourism.`,
    alternates: { canonical: `/destinations/${dest.id}` },
    openGraph: {
      title: `${dest.name} | Sunsky Tourism`,
      description: `${dest.tagline} — ${dest.description} Plan your trip to ${dest.name} with Sunsky Tourism.`,
      url: `https://www.sunskytourism.in/destinations/${dest.id}`,
      images: [{ url: dest.image, width: 1200, height: 630, alt: dest.name }],
    },
  }
}

export default async function DestinationDetailPage({ params }: Props) {
  const [dest, allDests, settings] = await Promise.all([
    getDestinationBySlug(params.id),
    getDestinations(),
    getSettings(),
  ])
  if (!dest) notFound()

  const destTours = tours.filter((t) =>
    t.destinationId === dest.id || t.destination.toLowerCase() === dest.name.toLowerCase()
  )

  const b = settings.business

return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: dest.name,
            description: `${dest.tagline} — ${dest.description} Best time to visit: ${dest.bestTime}.`,
            image: [`https://www.sunskytourism.in${dest.image}`],
            url: `https://www.sunskytourism.in/destinations/${dest.id}`,
            touristType: [...dest.highlights],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.sunskytourism.in',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Destinations',
                item: 'https://www.sunskytourism.in/destinations',
              },
              { '@type': 'ListItem', position: 3, name: dest.name },
            ],
          },
        ]}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md transition-colors hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" />
            All Destinations
          </Link>
      </div>
      <section className="relative flex min-h-[65vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={dest.image} alt={dest.name} fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/90 via-black/20 to-transparent" aria-hidden="true" />
        </div>
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5" />
            {dest.region}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {dest.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-orange-300 sm:text-xl">{dest.tagline}</p>
        </div>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Destinations', url: '/destinations' },
          { name: dest.name, url: `/destinations/${dest.id}` },
        ]}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <SectionHeading align="left" eyebrow="Overview" title={dest.name} />
              <p className="-mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                {dest.overview}
              </p>

              <div className="mt-12">
                <SectionHeading align="left" eyebrow="Gallery" title="A glimpse of the journey." />
                <div className="-mt-8">
                  <Gallery images={dest.gallery} alt={dest.name} />
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Best time to visit
                    </p>
                    <p className="mt-1.5 font-bold text-white">{dest.bestTime}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Popular places
                </p>
                <ul className="mt-4 space-y-2.5">
                  {dest.popularPlaces.map((place) => (
                    <li key={place} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                      {place}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Highlights
                </p>
                <ul className="mt-4 space-y-2.5">
                  {dest.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {destTours.length > 0 && (
                <div className="rounded-3xl border border-orange-400/20 bg-orange-500/[0.05] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                    Tours & Activities
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    {destTours.length} tour{destTours.length > 1 ? 's' : ''} available in {dest.name}
                  </p>
                  <a
                    href="#tours"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    View Tours & Prices
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <a
                  href={waUrl(b.whatsappPrimary, `Hi Sunsky Tourism, I'm interested in visiting ${dest.name}. Please share itinerary and pricing details.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Plan {dest.name} Trip
                </a>
              </div>
            </aside>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                The experience
              </p>
              <p className="mt-4 text-lg font-medium leading-relaxed text-white sm:text-xl">
                {dest.experience}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                Visit us in Sikar
              </p>
              <p className="mt-4 text-lg font-medium leading-relaxed text-white">
                {contact.address}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-orange-400/50"
                >
                  <Navigation className="h-4 w-4 text-orange-400" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {destTours.length > 0 && (
        <section id="tours" className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Tours & Activities"
              title={`Things to do in ${dest.name}.`}
            />
            <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destTours.map((tour) => (
                <StaggerItem key={tour.id}>
                  <Link
                    href={`/tours/${tour.id}`}
                    className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        loading="lazy" decoding="async"
                        src={tour.images[0]}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                      <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                        <Clock className="h-3 w-3 text-orange-300" />
                        {tour.durationLabel}
                      </span>
                      <span className="absolute top-4 right-4 rounded-full border border-orange-400/40 bg-orange-500/15 px-3 py-1 text-[11px] font-bold text-orange-300 backdrop-blur-md">
                        {tour.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white">{tour.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{tour.tagline}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">₹{tour.price.toLocaleString('en-IN')}</span>
                          {tour.originalPrice > tour.price && (
                            <span className="text-xs text-slate-500 line-through">₹{tour.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-orange-400 transition-colors group-hover:text-orange-300">
                          Book Now
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Explore More"
            title="Other destinations you might love."
          />
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allDests
              .filter((d) => d.id !== dest.id)
              .slice(0, 3)
              .map((d) => (
                <StaggerItem key={d.id}>
                  <Link
                    href={`/destinations/${d.id}`}
                    className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-orange-400/30"
                  >
                    <div className="relative h-48 overflow-hidden">
<Image
                        loading="lazy" decoding="async"
                        src={d.image}
                        alt={d.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white">{d.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{d.tagline}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  )
}
