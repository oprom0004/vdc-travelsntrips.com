import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Cpu, Settings, ShieldCheck, Zap } from "lucide-react";
import type { ArticleData } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { getMessages, translateCategory, withLocalePrefix } from "@/lib/i18n";
import { CORE_KEYWORD, getTargetHomeUrl, HOME_HERO_IMAGE, KEYWORD_PAGES } from "@/lib/site";

export default function HomePage({ homeContent, locale = "en" }: { homeContent: ArticleData | null; locale?: Locale }) {
  const now = new Date();
  const currentQuarter = `Q${Math.floor(now.getMonth() / 3) + 1}`;
  const currentYear = now.getFullYear();
  const messages = getMessages(locale);
  const targetHomeUrl = getTargetHomeUrl(locale);
  const stats = locale === "fr"
    ? [
        { label: "Plage de tension", value: "0 - 800V DC" },
        { label: "Logique de controle", value: "Etomsys DSP" },
        { label: "Resolution", value: "10mV / 1mA" },
        { label: "Marche", value: "Industrie mondiale" },
      ]
    : [
        { label: "Voltage Range", value: "0 - 800V DC" },
        { label: "Control Logic", value: "Etomsys DSP" },
        { label: "Resolution", value: "10mV / 1mA" },
        { label: "Market", value: "Global Industrial" },
      ];
  const industryLogos = locale === "fr"
    ? ["Fabricants Fortune 500", "Laboratoires de recherche", "OEM automobiles mondiaux", "Leaders semiconducteurs"]
    : ["Fortune 500 Manufacturers", "Top-Tier Research Labs", "Global Automotive OEMs", "Semiconductor Giants"];
  const applications = locale === "fr"
    ? [
        { title: "Semi-conducteur", desc: "Tests wafer et burn-in", icon: Cpu },
        { title: "Automobile", desc: "Batterie et chaine EV", icon: Zap },
        { title: "Aerospatial", desc: "Avionique et systemes satellite", icon: ShieldCheck },
        { title: "Industrie", desc: "Automatisation et controle moteur", icon: Settings },
      ]
    : [
        { title: "Semiconductor", desc: "Wafer testing & burn-in", icon: Cpu },
        { title: "Automotive", desc: "EV powertrain & battery", icon: Zap },
        { title: "Aerospace", desc: "Avionics & satellite systems", icon: ShieldCheck },
        { title: "Industrial", desc: "Automation & motor control", icon: Settings },
      ];
  const takeaways = locale === "fr"
    ? [
        { title: "Logique Etomsys", desc: "Boucle numerique a reponse rapide." },
        { title: "Haute stabilite", desc: "Faible ondulation pour tests sensibles." },
        { title: "Support mondial", desc: "Service technique et distribution complete." },
        { title: "Securite", desc: "Protections redondantes OVP/OCP." },
      ]
    : [
        { title: "Etomsys Logic", desc: "Microsecond-level digital control loop." },
        { title: "High Stability", desc: "Ultra-low ripple for sensitive testing." },
        { title: "Global Support", desc: "Full technical service & distribution." },
        { title: "Safety First", desc: "Redundant OVP/OCP protection." },
      ];

  return (
    <div className="p-10 flex flex-col gap-10 max-w-6xl mx-auto">
      <header>
        <h1 className="text-[32px] font-[800] text-brand-secondary leading-tight uppercase">{messages.ui.homeHeroTitle || `Professional ${CORE_KEYWORD} Solutions`}</h1>
        {locale === "fr" && (
          <p className="mt-2 text-[12px] text-brand-muted">
            Egalement recherche sous le terme "variable dc power supply" en sourcing international.
          </p>
        )}
      </header>

      <section className="bg-white rounded-lg border border-brand-border p-8 card-shadow grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
        <div className="bg-[#f0f0f0] border border-[#ddd] rounded-[4px] h-[260px] flex items-center justify-center relative overflow-hidden">
          <Image
            src={HOME_HERO_IMAGE}
            alt="High precision linear variable DC power supply ETMI301SPV"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-contain p-3"
            priority
          />
          <div className="absolute bottom-[15px] text-[10px] text-[#999] uppercase tracking-[3px] font-bold bg-white/80 px-2 py-1 rounded">Precision Control Unit</div>
        </div>

        <div>
          <h2 className="text-[24px] font-[700] text-brand-secondary mb-4">{homeContent?.title || "Industrial Variable DC Power Systems"}</h2>
          <p className="text-[14px] text-brand-muted mb-6 leading-relaxed">
            {homeContent?.summary || "Professional grade high-stability power source designed for laboratory testing, battery charging, and industrial automation."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((item) => (
              <div key={item.label} className="border-b border-[#eee] pb-2">
                <div className="text-[11px] text-brand-muted uppercase font-bold">{item.label}</div>
                <div className="text-[15px] font-[700] text-brand-secondary">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <a href={targetHomeUrl} target="_blank" className="btn-primary px-8 py-2.5 text-[13px] font-black uppercase tracking-wider">{messages.ui.ctaShop}</a>
            <a href={targetHomeUrl} target="_blank" className="btn-secondary px-8 py-2.5 text-[13px] font-bold uppercase border-2 inline-flex items-center">{messages.ui.ctaQuote}</a>
          </div>
          <p className="mt-3 text-[11px] text-brand-muted">{messages.ui.ctaHint}</p>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-8 py-6 border-y border-brand-border bg-slate-50/30 rounded-lg px-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-brand-primary tracking-[2px] mb-1">{messages.ui.globalFootprint}</span>
          <span className="text-[14px] font-bold text-brand-secondary uppercase">{messages.ui.trustedBy}</span>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4 items-center opacity-60 grayscale">
          {industryLogos.map((client) => (
            <span key={client} className="text-[11px] font-black uppercase tracking-widest text-brand-muted border-l border-brand-border pl-4">{client}</span>
          ))}
        </div>
      </section>

      <section id="applications" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {applications.map((app) => (
          <div key={app.title} className="bg-white border border-brand-border p-5 rounded-lg card-shadow flex items-start gap-4 hover:border-brand-primary/20 transition-all">
            <div className="p-2 bg-slate-50 rounded border border-slate-100"><app.icon className="w-4 h-4 text-brand-secondary" /></div>
            <div>
              <h4 className="text-[13px] font-black text-brand-secondary uppercase tracking-tight mb-0.5">{app.title}</h4>
              <p className="text-[11px] text-brand-muted leading-tight">{app.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="catalog" className="bg-white rounded-lg border border-brand-border p-10 card-shadow">
        <div className="flex items-center justify-between mb-10 border-b border-brand-border pb-4">
          <h3 className="text-[18px] font-[800] text-brand-secondary uppercase tracking-tight flex items-center gap-3">
            <Settings className="w-5 h-5 text-brand-primary" />
            {messages.ui.technicalSeries}
          </h3>
          <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{messages.ui.updated} {currentQuarter} {currentYear}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {Array.from(new Set(KEYWORD_PAGES.map((p) => p.category))).map((category) => (
            <div key={category}>
              <h4 className="text-[12px] font-[900] text-brand-primary uppercase tracking-[2px] mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                {translateCategory(locale, category)}
              </h4>
              <ul className="space-y-1">
                {KEYWORD_PAGES.filter((p) => p.category === category).map((page) => (
                  <li key={page.slug}>
                    <Link href={withLocalePrefix(locale, `/${page.slug}`)} className="group flex items-center justify-between py-2.5 border-b border-transparent hover:border-brand-border/30 transition-all">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-[600] text-brand-muted group-hover:text-brand-secondary transition-colors">{page.shortTitle}</span>
                        <span className="text-[9px] text-brand-muted/60 uppercase font-bold group-hover:text-brand-primary transition-colors">
                          {page.baseSlug.includes("v") ? `Up to ${page.baseSlug.toUpperCase()}` : "Precision Control"}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <article className="bg-white rounded-lg border border-brand-border p-12 card-shadow prose prose-slate max-w-none">
          <h2 className="text-[26px] font-[800] text-brand-secondary mb-8 uppercase tracking-tight border-b-2 border-brand-primary inline-block pb-1">
            {homeContent?.title || "Variable DC Power Supply: Technical Overview"}
          </h2>

          {(homeContent?.sections || []).map((section, idx) => (
            <section key={`${section.heading}-${idx}`} className="mb-12 last:mb-0">
              <h3 className="text-[20px] font-[800] text-brand-secondary mb-5 uppercase tracking-tight flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-secondary/20"></div>
                {section.heading}
              </h3>
              <div className="text-brand-text leading-relaxed space-y-5 text-[16px]">
                {section.content.split("\n").map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <aside className="flex flex-col gap-6">
          <div className="bg-brand-secondary text-white rounded-lg p-8 card-shadow sticky top-10">
            <h4 className="text-[12px] font-black uppercase tracking-[2px] text-brand-primary mb-6">{messages.ui.keyTakeaways}</h4>
            <ul className="space-y-6">
              {takeaways.map((item) => (
                <li key={item.title} className="border-l border-white/10 pl-4">
                  <div className="text-[13px] font-black uppercase mb-1">{item.title}</div>
                  <div className="text-[11px] text-white/50 leading-tight">{item.desc}</div>
                </li>
              ))}
            </ul>
            <div className="mt-10 pt-6 border-t border-white/10">
              <a href={targetHomeUrl} target="_blank" rel="nofollow" className="btn-accent w-full block text-center py-3 text-xs font-bold uppercase tracking-wider">{messages.ui.navInventory}</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
