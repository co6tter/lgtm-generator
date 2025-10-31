import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              LGTM Generator
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/history" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              History
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
