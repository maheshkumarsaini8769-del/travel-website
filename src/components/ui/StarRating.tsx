import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  reviewCount?: number
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  const pct = (rating / 5) * 100
  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex" aria-label={`Rated ${rating} out of 5 stars`}>
        <div className="flex gap-0.5 text-slate-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <div className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400" style={{ width: `${pct}%` }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 shrink-0 fill-current" />
          ))}
        </div>
      </div>
      <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
      {reviewCount ? (
        <span className="text-xs text-slate-400">
          ({reviewCount.toLocaleString('en-IN')} reviews)
        </span>
      ) : null}
    </div>
  )
}
