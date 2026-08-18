'use client'

import { useState } from 'react'
import { Star, Send, CheckCircle2, AlertCircle, PencilLine, UserRound } from 'lucide-react'
import { packages } from '@/data/packages'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FetchedReview {
  name: string
  rating: number
  text: string
  packageId: string
  packageName: string
}

export default function ReviewForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [packageId, setPackageId] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [edited, setEdited] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editPhone, setEditPhone] = useState('')
  const [loadingEdit, setLoadingEdit] = useState(false)

  const chosen = rating || hoverRating

  const fetchMyReview = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoadingEdit(true)
    setError('')
    try {
      const res = await fetch(`/api/reviews?phone=${encodeURIComponent(editPhone)}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Could not look up your review.')
        return
      }
      if (!data?.found) {
        setError('No review found for this number. Write a new review below!')
        return
      }
      const r: FetchedReview = data.review
      setName(r.name)
      setPhone(editPhone)
      setRating(r.rating)
      setPackageId(r.packageId)
      setText(r.text)
      setShowEdit(false)
      setEdited(true)
      setStatus('idle')
      setError('')
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoadingEdit(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1) {
      setError('Please select a star rating.')
      return
    }
    if (name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).')
      return
    }
    const digits = phone.replace(/\D/g, '').trim()
    if (digits.length < 10 || digits.length > 15) {
      setError('Please enter a valid phone number — it is only used to verify you and never shown publicly.')
      return
    }
    if (text.trim().length < 10) {
      setError('Please write a review of at least 10 characters.')
      return
    }

    setStatus('submitting')
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: digits,
          rating,
          text: text.trim(),
          packageId: packageId || undefined,
          packageName: packages.find((p) => p.id === packageId)?.name,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setError(data?.error ?? 'Could not submit — please try again.')
        return
      }
      setEdited(!!data?.edited)
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Network error — please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center rounded-[28px] border border-orange-400/30 bg-white/[0.03] px-6 py-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-[0_0_40px_rgba(249,115,22,0.35)]">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-white">
          {edited ? 'Review updated!' : `Thank you, ${name.trim().split(' ')[0]}!`}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          {edited
            ? 'Your updated review has been submitted for re-verification — it will show again once approved.'
            : 'Your review has been received and goes live once our team verifies it. You can edit it later any time with the same phone number.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setName('')
            setPhone('')
            setRating(0)
            setPackageId('')
            setText('')
            setEdited(false)
            setStatus('idle')
          }}
          className="mt-8 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-orange-400/50"
        >
          {edited ? 'Write a new review' : 'Share another experience'}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-white">{edited ? 'Editing your review' : 'Write a review'}</p>
        <button
          type="button"
          onClick={() => setShowEdit((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-orange-400/50 hover:text-white"
        >
          <PencilLine className="h-3.5 w-3.5" />
          {showEdit ? 'Hide' : 'Already reviewed? Edit it'}
        </button>
      </div>

      {showEdit ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs text-slate-400">
            Enter the phone number you reviewed with — your review will be loaded so you can edit it. One
            review per person, and only you can change yours.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-orange-400/60"
            />
            <button
              type="button"
              onClick={() => fetchMyReview()}
              disabled={loadingEdit}
              className="shrink-0 rounded-xl border border-orange-400/40 bg-orange-500/15 px-5 py-2.5 text-sm font-semibold text-orange-300 transition-colors hover:bg-orange-500/25 disabled:opacity-60"
            >
              {loadingEdit ? 'Loading…' : 'Load my review'}
            </button>
          </div>
        </div>
      ) : null}

      {edited ? (
        <p className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          You are editing the review for +{phone} — saving will update it (it will be re-verified).
        </p>
      ) : null}

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-400">Your rating</p>
        <div className="mt-3 flex gap-1.5" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform duration-150 hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  n <= chosen ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-600'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 self-center text-sm font-bold text-white">
            {chosen ? `${chosen}/5` : 'Tap to rate'}
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rv-name" className="text-sm font-semibold text-white">
            Your name
          </label>
          <input
            id="rv-name"
            type="text"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rakesh Sharma"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-orange-400/60"
          />
        </div>
        <div>
          <label htmlFor="rv-phone" className="text-sm font-semibold text-white">
            Phone number
          </label>
          <div className="relative mt-2">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="rv-phone"
              type="tel"
              maxLength={15}
              value={phone}
              disabled={edited}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className={`w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-orange-400/60 ${edited ? 'opacity-60' : ''}`}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">One review per number — never shown publicly.</p>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="rv-package" className="text-sm font-semibold text-white">
          Which trip was it? <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <select
          id="rv-package"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-orange-400/60"
        >
          <option value="" className="bg-[#0d0d0f]">
            General feedback / other
          </option>
          {packages.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#0d0d0f]">
              {p.name} — {p.region}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="rv-text" className="text-sm font-semibold text-white">
          Your review
        </label>
        <textarea
          id="rv-text"
          rows={5}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How was your experience with Sunsky Tourism? Hotels, cabs, planning, support — anything you want to share."
          className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-orange-400/60"
        />
        <p className="mt-1.5 text-right text-[11px] text-slate-500">{text.length}/2000</p>
      </div>

      {error ? (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(249,115,22,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> {edited ? 'Update my review' : 'Submit review'}
          </>
        )}
      </button>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
        Reviews are verified before publishing — only genuine feedback appears on the website.
      </p>
    </form>
  )
}