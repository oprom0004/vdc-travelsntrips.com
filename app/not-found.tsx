"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, getMessages, withLocalePrefix } from "@/lib/i18n";

export default function NotFound() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const messages = getMessages(locale);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-10">
      <div className="bg-white border border-brand-border rounded-xl p-10 text-center card-shadow">
        <h1 className="text-2xl font-bold text-brand-secondary mb-3">{messages.meta.notFoundTitle}</h1>
        <p className="text-brand-muted mb-6">{messages.meta.notFoundDescription}</p>
        <Link href={withLocalePrefix(locale, "/")} className="btn-primary px-6 py-2 inline-block">{messages.ui.keywordBreadcrumbHome}</Link>
      </div>
    </div>
  );
}