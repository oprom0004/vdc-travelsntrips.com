import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ArticleData } from "@/lib/content";
import type { KeywordPageData } from "@/lib/site";
import { getKeywordImage, TARGET_URL } from "@/lib/site";

export default function KeywordPage({ pageData, content }: { pageData: KeywordPageData; content: ArticleData | null }) {
  const keywordImage = getKeywordImage(pageData.baseSlug);

  return (
    <div className="p-10 flex flex-col gap-8 max-w-5xl">
      <nav className="flex items-center gap-2 text-[12px] text-brand-muted uppercase tracking-wider font-bold">
        <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-secondary">Variable DC Power Supply</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-secondary">{pageData.shortTitle} Series</span>
      </nav>

      <header>
        <h1 className="text-[32px] font-[800] text-brand-secondary leading-tight">{pageData.keyword}</h1>
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
          <div className="absolute bottom-[10px] text-[10px] text-[#999] uppercase tracking-widest bg-white/80 px-2 py-1 rounded">
            DC Power Supply Unit
          </div>
        </div>

        <div>
          <h2 className="text-[24px] font-[700] text-brand-secondary mb-4">{content?.title || `Programmable ${pageData.keyword} Unit`}</h2>
          <p className="text-[14px] text-brand-muted mb-6 leading-relaxed">
            {content?.summary || "Professional grade high-stability power source designed for laboratory testing, battery charging, and industrial automation."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border-b border-[#eee] pb-2"><div className="text-[11px] text-brand-muted uppercase">Output Voltage</div><div className="text-[15px] font-[700] text-brand-secondary">0 - {pageData.shortTitle}</div></div>
            <div className="border-b border-[#eee] pb-2"><div className="text-[11px] text-brand-muted uppercase">Output Current</div><div className="text-[15px] font-[700] text-brand-secondary">Variable Range</div></div>
            <div className="border-b border-[#eee] pb-2"><div className="text-[11px] text-brand-muted uppercase">Resolution</div><div className="text-[15px] font-[700] text-brand-secondary">10mV / 1mA</div></div>
            <div className="border-b border-[#eee] pb-2"><div className="text-[11px] text-brand-muted uppercase">Interface</div><div className="text-[15px] font-[700] text-brand-secondary">RS232 / USB</div></div>
          </div>
        </div>
      </div>

      <div className="bg-[#fff8f0] border border-[#ffdec2] rounded-[6px] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <strong className="text-brand-secondary block mb-1">Online Ordering with Inquiry Support</strong>
          <p className="text-[13px] text-[#856404]">Purchase in-stock DC power supplies online, or contact us for bulk pricing, lead time, and custom configurations.</p>
        </div>
        <a href={pageData.targetPath ? `${TARGET_URL}/${pageData.targetPath}` : TARGET_URL} target="_blank" rel="noopener noreferrer" className="btn-accent whitespace-nowrap px-8">
          Shop & Inquire
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
        <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase text-brand-muted hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to Catalog Index
        </Link>
      </div>
    </div>
  );
}
