import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-gray-800 mb-4 font-mono">
          404
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
