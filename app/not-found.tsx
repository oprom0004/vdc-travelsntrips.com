import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-10">
      <div className="bg-white border border-brand-border rounded-xl p-10 text-center card-shadow">
        <h1 className="text-2xl font-bold text-brand-secondary mb-3">Page Not Found</h1>
        <p className="text-brand-muted mb-6">The technical page you requested does not exist.</p>
        <Link href="/" className="btn-primary px-6 py-2 inline-block">Back to Home</Link>
      </div>
    </div>
  );
}