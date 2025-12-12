import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bitchfork',
  description: 'Track and review your favorite albums',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bitchfork',
  },
};

export const viewport: Viewport = {
  themeColor: '#14181c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-bf-bg/95 backdrop-blur border-b border-bf-border">
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 group">
                <span className="text-2xl">🍴</span>
                <h1 className="text-xl font-bold text-bf-text-light group-hover:text-bf-accent transition-colors">
                  Bitchfork
                </h1>
              </a>
              <a 
                href="/log"
                className="bg-bf-accent hover:bg-bf-accent-hover text-bf-bg font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                + Log Album
              </a>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-bf-border py-6 mt-auto">
            <div className="max-w-2xl mx-auto px-4 text-center text-bf-text/60 text-sm">
              <p>Made with 🎵 for album lovers</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

