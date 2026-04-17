"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { KEYWORD_PAGES, TARGET_URL } from "@/lib/site";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const categories = useMemo(() => Array.from(new Set(KEYWORD_PAGES.map((page) => page.category))), []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <header className="sticky top-0 z-50 bg-white border-b-[3px] border-brand-primary h-[70px] flex items-center professional-shadow">
        <div className="w-full max-w-[1440px] mx-auto px-10 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-[22px] font-[800] text-brand-primary tracking-tighter uppercase">
              TRAVELS<span className="text-brand-secondary font-[300]">N</span>TRIPS
              <span className="text-brand-muted font-[400] text-sm ml-2 hidden sm:inline">| Industrial Tech</span>
            </div>
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6">
              <li><Link href="/#catalog" className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">Catalog</Link></li>
              <li><Link href="/#applications" className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">Applications</Link></li>
              <li><Link href="/variable-dc-power-supply-high-voltage" className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">High Voltage</Link></li>
              <li><Link href="/variable-dc-power-supply-high-precision" className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">Precision Units</Link></li>
              <li><Link href="/variable-dc-power-supply-how-to-use" className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">Support</Link></li>
              <li>
                <a
                  href={TARGET_URL}
                  target="_blank"
                  rel="nofollow"
                  className="bg-brand-primary text-white text-[12px] font-black uppercase px-4 py-2 rounded-[3px] hover:bg-brand-secondary transition-all shadow-sm flex items-center gap-1.5"
                >
                  Inventory & Pricing
                </a>
              </li>
            </ul>
          </nav>

          <button className="lg:hidden p-2 text-brand-secondary" onClick={() => setIsMenuOpen((v) => !v)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-white border-b border-brand-border py-6 px-10 space-y-4 lg:hidden professional-shadow">
            <Link href="/#catalog" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
            <Link href="/#applications" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>Applications</Link>
            <Link href="/variable-dc-power-supply-high-voltage" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>High Voltage</Link>
            <Link href="/variable-dc-power-supply-how-to-use" className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>Support Guide</Link>
            <a href={TARGET_URL} target="_blank" rel="nofollow" className="block text-sm font-bold uppercase text-brand-accent">Inventory & Pricing</a>
          </div>
        )}
      </header>

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto overflow-hidden">
        <aside className="hidden lg:flex w-[260px] bg-white border-r border-brand-border p-6 flex-col gap-6 overflow-y-auto">
          {categories.map((category) => (
            <div key={category}>
              <div className="text-[11px] font-[700] uppercase text-brand-muted tracking-[1px] mb-3">{category}</div>
              <div className="flex flex-wrap gap-2">
                {KEYWORD_PAGES.filter((page) => page.category === category).map((page) => {
                  const active = pathname === `/${page.slug}`;
                  return (
                    <Link
                      key={page.slug}
                      href={`/${page.slug}`}
                      className={`px-[8px] py-[4px] border rounded-[4px] text-[11px] font-[500] transition-colors ${
                        active
                          ? "bg-brand-primary text-white border-brand-primary"
                          : "bg-[#eef2f7] text-brand-primary border-brand-border hover:border-brand-primary"
                      }`}
                    >
                      {page.shortTitle}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto bg-brand-bg">
          {children}
          <footer className="py-10 px-10 border-t border-brand-border mt-auto">
            <p className="text-[12px] text-brand-muted text-center">
              (c) {currentYear} travelsntrips.com Technical Division. All rights reserved. Precision Engineering for Industrial Power.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
