import TourForm from '@/components/admin/TourForm'

export default function NewTourPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">New Tour</h1>
      <p className="mt-1 text-sm text-slate-400">Create a new tour activity with pricing.</p>
      <div className="mt-6">
        <TourForm />
      </div>
    </div>
  )
}
