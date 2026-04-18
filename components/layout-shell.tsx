"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { getFrenchShortTitle, getTargetHomeUrl, KEYWORD_PAGES } from "@/lib/site";
import { getLocaleFromPathname, getMessages, translateCategory, type Locale, withLocalePrefix } from "@/lib/i18n";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const locale = getLocaleFromPathname(pathname);
  const messages = getMessages(locale);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const targetHomeUrl = getTargetHomeUrl(locale);

  const categories = useMemo(() => Array.from(new Set(KEYWORD_PAGES.map((page) => page.category))), []);
  const homePath = withLocalePrefix(locale, "/");

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!langMenuRef.current) return;
      if (!langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    try {
      const preferred = window.localStorage.getItem("preferred_locale");
      if (preferred !== "en" && preferred !== "fr") return;
      if (preferred === locale) return;
      if (pathname !== "/" && pathname !== "/fr") return;
      router.replace(preferred === "fr" ? "/fr" : "/");
    } catch {
      // ignore storage issues
    }
  }, [locale, pathname, router]);

  const getPathForLocale = (targetLocale: Locale) => {
    const basePath = pathname || "/";
    const search = typeof window !== "undefined" ? window.location.search : "";
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    let nextPath = basePath;
    if (targetLocale === "fr") {
      nextPath = basePath.startsWith("/fr") ? basePath : basePath === "/" ? "/fr" : `/fr${basePath}`;
    } else {
      nextPath = basePath.startsWith("/fr") ? (basePath === "/fr" ? "/" : basePath.replace(/^\/fr/, "")) : basePath;
    }

    return `${nextPath}${search}${hash}`;
  };

  const switchLocale = (targetLocale: Locale) => {
    try {
      window.localStorage.setItem("preferred_locale", targetLocale);
    } catch {
      // ignore storage issues
    }
    setIsLangOpen(false);
    setIsMenuOpen(false);
    router.push(getPathForLocale(targetLocale));
  };

  const activeLangLabel = locale.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <header className="sticky top-0 z-50 bg-white border-b-[3px] border-brand-primary h-[70px] flex items-center professional-shadow">
        <div className="w-full max-w-[1440px] mx-auto px-10 flex justify-between items-center">
          <Link href={homePath} className="flex items-center gap-2">
            <div className="text-[22px] font-[800] text-brand-primary tracking-tighter uppercase">
              TRAVELS<span className="text-brand-secondary font-[300]">N</span>TRIPS
              <span className="text-brand-muted font-[400] text-sm ml-2 hidden sm:inline">| Industrial Tech</span>
            </div>
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6">
              <li><Link href={withLocalePrefix(locale, "/#catalog")} className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">{messages.ui.navCatalog}</Link></li>
              <li><Link href={withLocalePrefix(locale, "/#applications")} className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">{messages.ui.navApplications}</Link></li>
              <li><Link href={withLocalePrefix(locale, "/variable-dc-power-supply-high-voltage")} className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">{messages.ui.navHighVoltage}</Link></li>
              <li><Link href={withLocalePrefix(locale, "/variable-dc-power-supply-high-precision")} className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">{messages.ui.navPrecision}</Link></li>
              <li><Link href={withLocalePrefix(locale, "/variable-dc-power-supply-how-to-use")} className="text-[13px] font-[700] uppercase text-brand-secondary hover:text-brand-primary transition-colors">{messages.ui.navSupport}</Link></li>
              <li>
                <a
                  href={targetHomeUrl}
                  target="_blank"
                  rel="nofollow"
                  className="bg-brand-primary text-white text-[12px] font-black uppercase px-4 py-2 rounded-[3px] hover:bg-brand-secondary transition-all shadow-sm flex items-center gap-1.5"
                >
                  {messages.ui.navInventory}
                </a>
              </li>
              <li>
                <div className="relative" ref={langMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsLangOpen((v) => !v)}
                    className="inline-flex items-center gap-1 text-[12px] font-black uppercase text-brand-primary hover:text-brand-secondary"
                  >
                    {activeLangLabel}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {isLangOpen && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-brand-border rounded shadow-md z-50 py-1">
                      <button
                        type="button"
                        onClick={() => switchLocale("en")}
                        className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase hover:bg-slate-50 ${locale === "en" ? "text-brand-primary" : "text-brand-secondary"}`}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => switchLocale("fr")}
                        className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase hover:bg-slate-50 ${locale === "fr" ? "text-brand-primary" : "text-brand-secondary"}`}
                      >
                        FR
                      </button>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </nav>

          <button className="lg:hidden p-2 text-brand-secondary" onClick={() => setIsMenuOpen((v) => !v)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-white border-b border-brand-border py-6 px-10 space-y-4 lg:hidden professional-shadow">
            <Link href={withLocalePrefix(locale, "/#catalog")} className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>{messages.ui.navCatalog}</Link>
            <Link href={withLocalePrefix(locale, "/#applications")} className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>{messages.ui.navApplications}</Link>
            <Link href={withLocalePrefix(locale, "/variable-dc-power-supply-high-voltage")} className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>{messages.ui.navHighVoltage}</Link>
            <Link href={withLocalePrefix(locale, "/variable-dc-power-supply-how-to-use")} className="block text-sm font-bold uppercase text-brand-secondary" onClick={() => setIsMenuOpen(false)}>{messages.ui.mobileSupportGuide}</Link>
            <a href={targetHomeUrl} target="_blank" rel="nofollow" className="block text-sm font-bold uppercase text-brand-accent">{messages.ui.navInventory}</a>
            <div className="pt-2 border-t border-brand-border">
              <div className="text-[11px] font-black uppercase text-brand-muted mb-2">Language</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => switchLocale("en")}
                  className={`px-3 py-1 rounded border text-xs font-bold uppercase ${locale === "en" ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-brand-secondary border-brand-border"}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => switchLocale("fr")}
                  className={`px-3 py-1 rounded border text-xs font-bold uppercase ${locale === "fr" ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-brand-secondary border-brand-border"}`}
                >
                  FR
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto overflow-hidden">
        <aside className="hidden lg:flex w-[260px] bg-white border-r border-brand-border p-6 flex-col gap-6 overflow-y-auto">
          {categories.map((category) => (
            <div key={category}>
              <div className="text-[11px] font-[700] uppercase text-brand-muted tracking-[1px] mb-3">{translateCategory(locale, category)}</div>
              <div className="flex flex-wrap gap-2">
                {KEYWORD_PAGES.filter((page) => page.category === category).map((page) => {
                  const href = withLocalePrefix(locale, `/${page.slug}`);
                  const active = pathname === href;
                  const label = locale === "fr" ? getFrenchShortTitle(page) : page.shortTitle;
                  return (
                    <Link
                      key={page.slug}
                      href={href}
                      className={`px-[8px] py-[4px] border rounded-[4px] text-[11px] font-[500] transition-colors ${
                        active
                          ? "bg-brand-primary text-white border-brand-primary"
                          : "bg-[#eef2f7] text-brand-primary border-brand-border hover:border-brand-primary"
                      }`}
                    >
                      {label}
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
              (c) {currentYear} {messages.ui.footer}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
