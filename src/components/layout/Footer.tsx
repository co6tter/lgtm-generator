import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-600">
            © {currentYear} LGTM Generator. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900"
              aria-label="Privacy Policy"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900"
              aria-label="Terms of Service"
            >
              Terms
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
              aria-label="GitHub Repository"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
