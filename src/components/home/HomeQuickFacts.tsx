import Link from 'next/link'
import { MapPin, Phone, Mail, Award, Clock, ArrowRight, ShieldCheck, Compass } from 'lucide-react'
import { contact } from '@/data/contact'

export default function HomeQuickFacts() {
  return (
    <section className="relative border-t border-white/5 bg-[#09090d] py-20 sm:py-24" aria-labelledby="quick-facts-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
            <Compass className="h-3.5 w-3.5" />
            Verified Travel Information
          </span>
          <h2 id="quick-facts-heading" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            About Sunsky Tourism — Quick Facts for Travelers
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Direct, factual information about our travel agency services, location, and booking assistance in Sikar, Rajasthan.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Fact 1: Who is Sunsky Tourism */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-orange-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Who is Sunsky Tourism?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                <strong>Sunsky Tourism is a government-registered travel agency</strong> located in Sikar, Rajasthan, founded by Dharmpal Bagotiya. The company specializes in personalized tour packages, domestic and international vacations, flight bookings, hotel reservations, visa assistance, and cab rentals.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5">
              <Link href="/about" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300">
                Read our story <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Fact 2: Location */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-orange-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Where is Sunsky Tourism located?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                <strong>Sunsky Tourism is located at W.No. 45, Industrial Area, Sikar, Rajasthan 332001, India</strong>. We serve travelers across Sikar, Shekhawati, Jhunjhunu, Churu, and Jaipur with complete in-person and online travel booking support.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5">
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300">
                View office & directions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Fact 3: Services Provided */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-orange-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">What travel services are provided?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Sunsky Tourism provides end-to-end travel solutions including <strong>customized Rajasthan heritage tours, India holiday packages, international trips, airline ticketing, hotel stays, visa guidance, and airport transfers</strong>.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300">
                Explore all services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Fact 4: Destinations Covered */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-orange-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Which destinations do you cover?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Popular destinations include <strong>Jaipur, Udaipur, Jaisalmer, Jodhpur, Kashmir, Goa, Himachal, Kerala</strong> within India, and international getaways to <strong>Dubai, Thailand, Bali, Singapore, Maldives, and Europe</strong>.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5">
              <Link href="/destinations" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300">
                Browse destinations <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Fact 5: Operating Hours */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-orange-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Operating Hours & Availability</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Our Sikar travel office is open <strong>Monday through Saturday from 09:00 AM to 07:00 PM IST</strong>. 24/7 on-tour customer support is provided for all active package travelers via WhatsApp and direct call.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5">
              <a href={`tel:${contact.phoneLinks[0]}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300">
                Call now: {contact.phones[0]} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Fact 6: How to contact */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-orange-500/30">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">How to plan & book a trip?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                You can plan your journey directly by calling <strong>+91 94620 18302</strong>, messaging us on WhatsApp, or visiting our Sikar office. We provide customized quotes, free itineraries, and honest transparent pricing.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5">
              <Link href="/plan-your-trip" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300">
                Plan your trip online <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
