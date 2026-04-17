import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { KEYWORD_PAGES, TARGET_URL, TARGET_DOMAIN } from "../constants";
import { generateKeywordContent } from "../services/geminiService";

export default function KeywordPage() {
  const { slug } = useParams();
  const pageData = KEYWORD_PAGES.find(p => p.slug === slug);
  const [content, setContent] = React.useState<any>(() => {
    const preloaded = (window as any).__PRELOADED_STATE__;
    // Check if preloaded state matches a keyword page (it has a summary)
    if (preloaded && preloaded.summary) {
      return preloaded;
    }
    return null;
  });
  const [loading, setLoading] = React.useState(!content);

  React.useEffect(() => {
    if (pageData) {
      document.title = pageData.seoTitle;
      const isCorrectContent = content && content.title && content.title.toLowerCase().includes(slug?.toLowerCase() || "");
      
      if (!isCorrectContent) {
        setLoading(true);
        setContent(null);
        fetch(`/api/content/keyword_${pageData.baseSlug}`)
          .then(res => res.json())
          .then(data => {
            if (data && !data.error) {
              setContent(data);
            }
            setLoading(false);
          });
      }
    }
  }, [pageData, slug]);

  if (!pageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <Link to="/" className="text-brand-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col gap-8 max-w-5xl">
      <nav className="flex items-center gap-2 text-[12px] text-brand-muted uppercase tracking-wider font-bold">
        <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-secondary">Variable DC Power Supply</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-secondary">{pageData.shortTitle} Series</span>
      </nav>

      <header>
        <h1 className="text-[32px] font-[800] text-brand-secondary leading-tight">
          {pageData.keyword}
        </h1>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-lg border border-brand-border card-shadow">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          <p className="text-brand-muted font-bold uppercase text-xs tracking-widest">Generating Technical Data...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-10"
        >
          <div className="bg-white rounded-lg border border-brand-border p-8 card-shadow grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
            <div className="bg-[#f0f0f0] border border-[#ddd] rounded-[4px] h-[240px] flex items-center justify-center relative">
              <div className="w-[40px] h-[40px] rounded-full border-[4px] border-[#ccc] bg-white mx-[10px]"></div>
              <div className="w-[80px] h-[40px] bg-[#1a1a1a] rounded-[2px] text-[#00ff00] font-mono p-[5px] text-[14px] flex items-center justify-center text-center leading-none">
                {pageData.shortTitle}
              </div>
              <div className="w-[40px] h-[40px] rounded-full border-[4px] border-[#ccc] bg-white mx-[10px]"></div>
              <div className="absolute bottom-[10px] text-[10px] text-[#999] uppercase tracking-widest">DC Power Supply Unit</div>
            </div>

            <div>
              <h2 className="text-[24px] font-[700] text-brand-secondary mb-4">
                {content?.title || `Programmable ${pageData.keyword} Unit`}
              </h2>
              <p className="text-[14px] text-brand-muted mb-6 leading-relaxed">
                {content?.summary || `Professional grade high-stability power source designed for laboratory testing, battery charging, and industrial automation.`}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-b border-[#eee] pb-2">
                  <div className="text-[11px] text-brand-muted uppercase">Output Voltage</div>
                  <div className="text-[15px] font-[700] text-brand-secondary">0 - {pageData.shortTitle}</div>
                </div>
                <div className="border-b border-[#eee] pb-2">
                  <div className="text-[11px] text-brand-muted uppercase">Output Current</div>
                  <div className="text-[15px] font-[700] text-brand-secondary">Variable Range</div>
                </div>
                <div className="border-b border-[#eee] pb-2">
                  <div className="text-[11px] text-brand-muted uppercase">Resolution</div>
                  <div className="text-[15px] font-[700] text-brand-secondary">10mV / 1mA</div>
                </div>
                <div className="border-b border-[#eee] pb-2">
                  <div className="text-[11px] text-brand-muted uppercase">Interface</div>
                  <div className="text-[15px] font-[700] text-brand-secondary">RS232 / USB</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fff8f0] border border-[#ffdec2] rounded-[6px] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <strong className="text-brand-secondary block mb-1">Direct Technical Sales & Distribution</strong>
              <p className="text-[13px] text-[#856404]">Find technical manuals, bulk pricing, and custom configurations at our official portal.</p>
            </div>
            <a 
              href={pageData.targetPath ? `${TARGET_URL}/${pageData.targetPath}` : TARGET_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-accent whitespace-nowrap px-8"
            >
              Verify Technical Specs
            </a>
          </div>

          <article className="bg-white rounded-lg border border-brand-border p-10 card-shadow prose prose-slate max-w-none">
            {content?.sections?.map((section: any, idx: number) => (
              <section key={idx} className="mb-10 last:mb-0">
                <h2 className="text-[22px] font-[700] text-brand-secondary mb-4 uppercase tracking-tight border-b border-brand-border pb-2">
                  {section.heading}
                </h2>
                <div className="text-brand-text leading-relaxed space-y-4 text-[15px]">
                  {section.content.split('\n').map((para: string, pIdx: number) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </motion.div>
      )}

      <div className="mt-4">
        <Link to="/" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase text-brand-muted hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to Catalog Index
        </Link>
      </div>
    </div>
  );
}
