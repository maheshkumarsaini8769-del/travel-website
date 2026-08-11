import PackageForm from '@/components/admin/PackageForm'

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">New Package</h1>
      <p className="mt-1 text-sm text-slate-400">Create a new package — it is saved to MongoDB.</p>
      <div className="mt-6">
        <PackageForm />
      </div>
    </div>
  )
}