import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { SearchProvider } from "@/components/SearchProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mini Tools Collection",
  description: "A collection of useful mini tools for everyday tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter antialiased min-h-screen`}
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        <SearchProvider>
          <header className="border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🛠️</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Mini Tools</h1>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 max-w-lg mx-8">
                  <SearchBar />
                </div>
                
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#" className="text-sm hover:text-blue-600 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    Tools
                  </a>
                  <a href="#" className="text-sm hover:text-blue-600 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    About
                  </a>
                  <a href="#" className="text-sm hover:text-blue-600 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    GitHub
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <Sidebar />
          <main className="ml-0 md:ml-80 transition-all duration-300 p-8 pt-16 md:pt-8">
            {children}
          </main>
        </SearchProvider>
      </body>
    </html>
  );
}
