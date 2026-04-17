import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X, ExternalLink, ChevronRight } from "lucide-react";
import { TARGET_DOMAIN, TARGET_URL, KEYWORD_PAGES } from "../constants";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Group keywords for sidebar
  const categories = Array.from(new Set(KEYWORD_PAGES.map(p => p.category)));

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "eTommens",
    "url": TARGET_URL,
    "logo": `${TARGET_URL}/logo.png`,
    "description": "Manufacturer of high-precision variable DC power supplies featuring Etomsys control technology.",
    "brand": {
      "@type": "Brand",
      "name": "eTommens"
    },
    "knowsAbout": ["Variable DC Power Supply", "Etomsys Digital Control", "Precision Power Electronics"]
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <header className="sticky top-0 z-50 bg-white border-b-[3px] border-brand-primary h-[70px] flex items-center professional-shadow">
        <div className="w-full max-w-[1440px] mx-auto px-10 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-[22px] font-[800] text-brand-primary tracking-tighter uppercase">
              TRAVELS<span className="text-brand-secondary font-[300]">N</span>TRIPS 
              <span className="text-brand-muted font-[400] text-sm ml-2 hidden sm:inline">| Industrial Tech</span>
            </div>
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {[
                { name: 'Catalog', path: '/#catalog' },
                { name: 'Applications', path: '/#applications' },
                { name: 'High Voltage', path: '/variable-dc-power-supply-high-voltage' },
                { name: 'Precision Units', path: '/variable-dc-power-supply-high-precision' },
                { name: 'Support', path: '/variable-dc-power-supply-how-to-use' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href={TARGET_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand-primary text-white text-[12px] font-black uppercase px-4 py-2 rounded-[3px] hover:bg-brand-secondary transition-all shadow-sm flex items-center gap-1.5"
                >
                  Inventory & Pricing
                </a>
              </li>
            </ul>
          </nav>

          <button 
            className="lg:hidden p-2 text-brand-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-white border-b border-brand-border py-6 px-10 space-y-4 lg:hidden professional-shadow">
            <Link to="/#catalog" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
            <Link to="/#applications" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>Applications</Link>
            <Link to="/variable-dc-power-supply-high-voltage" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>High Voltage</Link>
            <Link to="/variable-dc-power-supply-how-to-use" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>Support Guide</Link>
            <a href={TARGET_URL} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold uppercase text-brand-accent">Inventory & Pricing</a>
          </div>
        )}
      </header>

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[260px] bg-white border-r border-brand-border p-6 flex-col gap-6 overflow-y-auto">
          {categories.map(category => (
            <div key={category}>
              <div className="text-[11px] font-[700] uppercase text-brand-muted tracking-[1px] mb-3">{category}</div>
              <div className="flex flex-wrap gap-2">
                {KEYWORD_PAGES.filter(p => p.category === category).map(page => (
                  <Link 
                    key={page.slug} 
                    to={`/${page.slug}`}
                    className={`px-[8px] py-[4px] border rounded-[4px] text-[11px] font-[500] transition-colors ${
                      location.pathname === `/${page.slug}` 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'bg-[#eef2f7] text-brand-primary border-brand-border hover:border-brand-primary'
                    }`}
                  >
                    {page.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto bg-brand-bg">
          {children}
          
          <footer className="py-10 px-10 border-t border-brand-border mt-auto">
            <p className="text-[12px] text-brand-muted text-center">
              © 2026 travelsntrips.com Technical Division. All rights reserved. Precision Engineering for Industrial Power.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
