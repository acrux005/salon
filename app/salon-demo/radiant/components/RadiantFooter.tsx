import Link from "next/link";

export function RadiantFooter({ full = false }: { full?: boolean }) {
  if (full) {
    return (
      <footer className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-4">
            <div>
              <Link href="/salon-demo/radiant" className="flex items-center gap-2">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-950" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-950">Radiant</span>
              </Link>
              <p className="mt-4 text-sm text-gray-500">© {new Date().getFullYear()} Radiant Inc.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-950">Product</h4>
              <nav className="mt-4 space-y-3">
                <Link href="/salon-demo/radiant#pricing" className="block text-sm text-gray-600 hover:text-gray-950">Pricing</Link>
                <Link href="#" className="block text-sm text-gray-600 hover:text-gray-950">Analysis</Link>
                <Link href="#" className="block text-sm text-gray-600 hover:text-gray-950">API</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold text-gray-950">Company</h4>
              <nav className="mt-4 space-y-3">
                <Link href="/salon-demo/radiant/careers" className="block text-sm text-gray-600 hover:text-gray-950">Careers</Link>
                <Link href="#" className="block text-sm text-gray-600 hover:text-gray-950">Blog</Link>
                <Link href="/salon-demo/radiant/about" className="block text-sm text-gray-600 hover:text-gray-950">Company</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold text-gray-950">Support</h4>
              <nav className="mt-4 space-y-3">
                <Link href="#" className="block text-sm text-gray-600 hover:text-gray-950">Help center</Link>
                <Link href="#" className="block text-sm text-gray-600 hover:text-gray-950">Community</Link>
                <Link href="#" className="block text-sm text-gray-600 hover:text-gray-950">Terms of service</Link>
                <Link href="#" className="block text-sm text-gray-600 hover:text-gray-950">Privacy policy</Link>
              </nav>
            </div>
          </div>
          <div className="mt-12 flex justify-end gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-600" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600" aria-label="X">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-gray-200 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link href="/salon-demo/radiant/about" className="text-sm text-gray-600 hover:text-gray-950">About</Link>
          <Link href="/salon-demo/radiant/careers" className="text-sm text-gray-600 hover:text-gray-950">Careers</Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-950">Blog</Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-950">Privacy</Link>
        </nav>
        <p className="mt-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Radiant</p>
      </div>
    </footer>
  );
}
