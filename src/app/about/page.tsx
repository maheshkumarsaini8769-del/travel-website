import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import CountUp from '@/components/ui/CountUp'
import { StaggerGroup, StaggerItem } from '@/components/ui/TextReveal'
import ParallaxImage from '@/components/ui/ParallaxImage'
import { aboutImages, ctaImages } from '@/data/images'
import { contact } from '@/data/contact'
import { getSettings } from '@/lib/settings'
import { Award, Users, MapPin, HeartHandshake } from 'lucide-react'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'About Us | Sunsky Tourism',
  description:
    'Learn about Sunsky Tourism, Sikar\u2019s trusted travel agency — personalized planning, honest pricing and support that stays with you on the road.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us | Sunsky Tourism',
    description: 'Sikar\'s trusted travel agency — personalized planning, honest pricing and support.',
    url: 'https://www.sunskytourism.in/about',
    images: ['/images/hero.jpg'],
    locale: 'en_IN',
    type: 'website',
  },
}

const values = [
  {
    icon: HeartHandshake,
    title: 'Personal Attention',
    text: 'No call centres. You talk to people who know your trip and care about the details.',
  },
  {
    icon: MapPin,
    title: 'Local Knowledge',
    text: 'Based in Sikar with deep roots across Rajasthan and trusted partners worldwide.',
  },
  {
    icon: Users,
    title: 'Every Traveller',
    text: 'Families, honeymooners, students and groups — every journey planned with equal care.',
  },
  {
    icon: Award,
    title: 'Honest Pricing',
    text: 'Clear quotes with no hidden costs. What we promise is what you pay.',
  },
]

const stats = [
  { value: 10, suffix: '+', label: 'Destinations' },
  { value: 1000, suffix: '+', label: 'Happy Travellers' },
  { value: 5, suffix: '+', label: 'Years of Trust' },
  { value: 24, suffix: '/7', label: 'Trip Support' },
]

export default async function AboutPage() {
  const settings = await getSettings()
  const b = settings.business
  const a = settings.about
  const whatsappUrl = `https://wa.me/${b.whatsappPrimary}?text=${encodeURIComponent('Hello Sunsky Tourism, I want to know more about your travel packages.')}`
  return (
    <>
      <PageHero
        eyebrow="About Sunsky Tourism"
        title={a.title}
        description={a.description}
        image={ctaImages.about}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]} />

      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title="A local agency with a world of journeys."
                description="Sunsky Tourism started with a simple idea — travel should feel easy. From our office in Sikar, we plan journeys across Rajasthan, India and the world."
              />
              <div className="-mt-6 space-y-4 text-slate-400 sm:-mt-10">
                <p className="text-base leading-relaxed">
                  Founded and run by {contact.proprietor}, we built Sunsky Tourism on repeat
                  customers and word-of-mouth. Families return to us every season; students trust us
                  with their first big trip; groups hand us the checklist and simply enjoy.
                </p>
                <p className="text-base leading-relaxed">
                  Whether it is a weekend in Jaipur or a honeymoon in Dubai, every itinerary starts
                  the same way — a conversation about what you love, and a plan built around it.
                </p>
              </div>
            </div>
            <ParallaxImage
              src={aboutImages.planning}
              alt="Sunsky Tourism trip planning"
              speed={12}
              rounded="rounded-[28px]"
              className="h-[380px] sm:h-[480px] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center transition-colors duration-300 hover:border-orange-400/25 sm:p-8">
                  <p className="gradient-text text-3xl font-bold sm:text-4xl">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Why travellers choose Sunsky."
          />
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <StaggerItem key={v.title}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/25">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-white">{v.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{v.text}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10">
            <Image loading="lazy" decoding="async" src={aboutImages.experience} alt="Sunsky Tourism experience — trusted travel agency in Sikar Rajasthan" fill sizes="100vw" className="h-[320px] w-full object-cover sm:h-[400px]" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
              <p className="max-w-2xl text-xl font-semibold leading-snug text-white sm:text-2xl">
                &ldquo;We do not just sell trips — we build the plans our travellers tell their
                friends about.&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                {contact.proprietor} — Proprietor, Sunsky Tourism
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeading
            eyebrow="Visit Us"
            title="Come say hello in Sikar."
            description={`W.No. 45, Industrial Area, Sikar — call us at ${contact.phones[0]} or message on WhatsApp.`}
          />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Start a Conversation
          </a>
        </div>
      </section>
    </>
  )
}
