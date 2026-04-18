import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ArticleData } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { getMessages, withLocalePrefix } from "@/lib/i18n";
import type { KeywordPageData } from "@/lib/site";
import { getFrenchKeyword, getKeywordImage, getTargetHomeUrl, TARGET_URL } from "@/lib/site";

export default function KeywordPage({ pageData, content, locale = "en" }: { pageData: KeywordPageData; content: ArticleData | null; locale?: Locale }) {
  const keywordImage = getKeywordImage(pageData.baseSlug);
  const messages = getMessages(locale);
  const targetHomeUrl = getTargetHomeUrl(locale);
  const displayKeyword = locale === "fr" ? getFrenchKeyword(pageData) : pageData.keyword;
  const productUnitLabel = locale === "fr" ? "Unite alimentation DC" : "DC Power Supply Unit";
  const breadcrumbProduct = locale === "fr" ? "Alimentation DC variable" : "Variable DC Power Supply";
  const fallbackSummary = locale === "fr"
    ? "Source d'alimentation professionnelle a haute stabilite pour essais laboratoire, charge batterie et automatisation industrielle."
    : "Professional grade high-stability power source designed for laboratory testing, battery charging, and industrial automation.";
  const fallbackTitle = locale === "fr" ? `Unite programmable ${displayKeyword}` : `Programmable ${pageData.keyword} Unit`;
  const specLabels = locale === "fr"
    ? ["Tension de sortie", "Courant de sortie", "Resolution", "Interface"]
    : ["Output Voltage", "Output Current", "Resolution", "Interface"];
  const specValues = locale === "fr"
    ? [`0 - ${pageData.shortTitle}`, "Plage variable", "10mV / 1mA", "RS232 / USB"]
    : [`0 - ${pageData.shortTitle}`, "Variable Range", "10mV / 1mA", "RS232 / USB"];

  return (
    <div className="p-10 flex flex-col gap-8 max-w-5xl">
      <nav className="flex items-center gap-2 text-[12px] text-brand-muted uppercase tracking-wider font-bold">
        <Link href={withLocalePrefix(locale, "/")} className="hover:text-brand-primary transition-colors">{messages.ui.keywordBreadcrumbHome}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-secondary">{breadcrumbProduct}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-secondary">{pageData.shortTitle} {messages.ui.keywordBreadcrumbSeries}</span>
      </nav>

      <header>
        <h1 className="text-[32px] font-[800] text-brand-secondary leading-tight">{displayKeyword}</h1>
      </header>

      <div className="bg-white rounded-lg border border-brand-border p-8 card-shadow grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
        <div className="bg-[#f0f0f0] border border-[#ddd] rounded-[4px] h-[240px] flex items-center justify-center relative overflow-hidden">
          <Image
            src={keywordImage}
            alt={`${pageData.keyword} product image`}
            fill
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-contain p-3"
          />
          <div className="absolute bottom-[10px] text-[10px] text-[#999] uppercase tracking-widest bg-white/80 px-2 py-1 rounded">{productUnitLabel}</div>
        </div>

        <div>
          <h2 className="text-[24px] font-[700] text-brand-secondary mb-4">{content?.title || fallbackTitle}</h2>
          <p className="text-[14px] text-brand-muted mb-6 leading-relaxed">
            {content?.summary || fallbackSummary}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {specLabels.map((label, idx) => (
              <div key={label} className="border-b border-[#eee] pb-2">
                <div className="text-[11px] text-brand-muted uppercase">{label}</div>
                <div className="text-[15px] font-[700] text-brand-secondary">{specValues[idx]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#fff8f0] border border-[#ffdec2] rounded-[6px] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <strong className="text-brand-secondary block mb-1">{messages.ui.keywordSpecCtaTitle}</strong>
          <p className="text-[13px] text-[#856404]">{messages.ui.keywordSpecCtaDesc}</p>
        </div>
        <a href={pageData.targetPath ? `${TARGET_URL}/${pageData.targetPath}` : targetHomeUrl} target="_blank" className="btn-accent whitespace-nowrap px-8">
          {messages.ui.keywordSpecCtaBtn}
        </a>
      </div>

      <article className="bg-white rounded-lg border border-brand-border p-10 card-shadow prose prose-slate max-w-none">
        {(content?.sections || []).map((section, idx) => (
          <section key={`${section.heading}-${idx}`} className="mb-10 last:mb-0">
            <h2 className="text-[22px] font-[700] text-brand-secondary mb-4 uppercase tracking-tight border-b border-brand-border pb-2">{section.heading}</h2>
            <div className="text-brand-text leading-relaxed space-y-4 text-[15px]">
              {section.content.split("\n").map((para, pIdx) => <p key={pIdx}>{para}</p>)}
            </div>
          </section>
        ))}
      </article>

      <div className="mt-4">
        <Link href={withLocalePrefix(locale, "/")} className="inline-flex items-center gap-2 text-[12px] font-bold uppercase text-brand-muted hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-3 h-3" />
          {messages.ui.keywordBack}
        </Link>
      </div>
    </div>
  );
}
