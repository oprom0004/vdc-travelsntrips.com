export const CORE_KEYWORD = "variable dc power supply";

export const TARGET_DOMAIN = "variabledcpowersupply.com";
export const TARGET_URL = `https://${TARGET_DOMAIN}`;

export interface KeywordPageData {
  slug: string;
  baseSlug: string;
  keyword: string; // Used for H1
  seoTitle: string; // Used for Browser Tab Title
  shortTitle: string;
  category: string;
  description: string;
  targetPath?: string;
}

const RAW_KEYWORDS = [
  { kw: "800v", cat: "High Voltage Series", path: "800v-dc-power-supplies/", customH1: "800V High Voltage Variable DC Power Supply: Heavy Industrial Grade", customSEO: "800V High Voltage DC Power Supply | eTommens Industrial Solutions" },
  { kw: "600v", cat: "High Voltage Series", path: "600v-dc-power-supplies/", customH1: "600V Variable DC Power Supply: Precision High-Voltage Testing", customSEO: "600V Variable DC Power Supply for Semiconductor Testing" },
  { kw: "500v", cat: "High Voltage Series", path: "500v-dc-power-supplies/", customH1: "500V Variable DC Power Supply: Advanced Research & Development", customSEO: "500V DC Power Supply - Precision Variable Voltage Solutions" },
  { kw: "400v", cat: "High Voltage Series", path: "400v-dc-power-supplies/", customH1: "400V High Voltage Variable DC Power Supply: Industrial Reliability", customSEO: "400V Variable DC Power Supply for Industrial Automation" },
  { kw: "300v", cat: "High Voltage Series", path: "dc-power-supply-300v-list/", customH1: "300V Variable DC Power Supply: Versatile High-Power Solutions", customSEO: "300V Variable DC Power Supply Series - eTommens" },
  { kw: "250v", cat: "Standard Voltage Series", path: "250v-dc-power-supplies/", customH1: "250V Variable DC Power Supply: Balanced Performance for Labs", customSEO: "250V Variable DC Power Supply | Technical Specifications" },
  { kw: "240v", cat: "Standard Voltage Series", path: "250v-dc-power-supplies/", customH1: "240V Variable DC Power Supply: High-Resolution Precision Control", customSEO: "240V Precision Variable DC Power Supply Guide" },
  { kw: "150v", cat: "Standard Voltage Series", path: "150v-dc-power-supplies/", customH1: "150V Variable DC Power Supply: Professional Electronics Testing", customSEO: "150V Variable DC Power Supply for Automotive & Aerospace" },
  { kw: "120v", cat: "Standard Voltage Series", path: "variable-dc-power-supply-120v/", customH1: "120V Variable DC Power Supply: Lab-Grade Safety & Stability", customSEO: "120V Variable DC Power Supply - Etomsys™ Digital Architecture" },
  { kw: "100v", cat: "Standard Voltage Series", path: "100v-dc-power-supplies/", customH1: "100V Variable DC Power Supply: Industrial Control System Testing", customSEO: "100V Variable DC Power Supply | High Precision & Reliability" },
  { kw: "80v", cat: "Standard Voltage Series", path: "80v-dc-power-supplies/", customH1: "80V Variable DC Power Supply: Mid-Range Performance & Accuracy", customSEO: "80V Variable DC Power Supply Series - Technical Overview" },
  { kw: "60v", cat: "Standard Voltage Series", path: "variable-dc-power-supply-60v/", customH1: "60V Variable DC Power Supply: Master-Grade Prototyping Tool", customSEO: "60V Variable DC Power Supply for Circuit Prototyping" },
  { kw: "30v", cat: "Low Voltage Series", path: "variable-dc-power-supply-30v/", customH1: "30V Variable DC Power Supply: The Gold Standard for Engineering Benches", customSEO: "30V Variable DC Power Supply | Most Popular Benchtop Model" },
  { kw: "20v", cat: "Low Voltage Series", path: "20v-dc-power-supplies/", customH1: "20V Variable DC Power Supply: Clean Power for Sensitive Logic", customSEO: "20V Precision Variable DC Power Supply for Digital Circuits" },
  { kw: "15v", cat: "Low Voltage Series", path: "15v-dc-power-supplies/", customH1: "15V Variable DC Power Supply: High-Stability Low-Voltage Source", customSEO: "15V Variable DC Power Supply | Laboratory Research Grade" },
  { kw: "10a", cat: "Performance & Output", path: "10a-dc-power-supplies/", customH1: "10A Variable DC Power Supply: High-Current Performance Solutions", customSEO: "10A High Current Variable DC Power Supply Series" },
  { kw: "1000w", cat: "Performance & Output", path: "1000w-dc-power-supplies/", customH1: "1000W High Power Variable DC Power Supply: Industrial Capability", customSEO: "1000W High Power Variable DC Power Supply Units" },
  { kw: "high precision", cat: "Performance & Output", path: "high-precision-dc-power-supply/", customH1: "High Precision Variable DC Power Supply: Ultra-Fine Resolution", customSEO: "High Precision Variable DC Power Supply | Millivolt & Milliamp Control" },
  { kw: "programmable", cat: "Performance & Output", path: "programmable-dc-power-supply/", customH1: "Programmable Variable DC Power Supply: Intelligent System Integration", customSEO: "Programmable Variable DC Power Supply | Etomsys™ Digital Interface" },
  { kw: "triple output", cat: "Performance & Output", path: "triple-output-bench-power-supplies/", customH1: "Triple Output Variable DC Power Supply: Multi-Rail Circuit Prototyping", customSEO: "Triple Output Variable DC Power Supply | Multi-Channel Benchtop" },
  { kw: "high voltage", cat: "Performance & Output", path: "high-voltage-dc-power-supply/", customH1: "High Voltage Variable DC Power Supply: Industrial & Scientific Solutions", customSEO: "High Voltage Variable DC Power Supply Specialist" },
  { kw: "benchtop", cat: "Chassis & Form Factor", path: "bench-dc-power-supply/", customH1: "Benchtop Variable DC Power Supply: Industrial Power on Your Desk", customSEO: "Industrial Benchtop Variable DC Power Supply Units" },
  { kw: "price", cat: "Buying Resources", customH1: "Variable DC Power Supply Price Guide: Wholesale & Custom Quotes", customSEO: "Variable DC Power Supply Price List & Quote Guide" },
  { kw: "where to buy", cat: "Buying Resources", customH1: "Where to Buy a Variable DC Power Supply: Authorized Global Partners", customSEO: "Authorized eTommens Dealers - Where to Buy Variable DC Power Supply" },
  { kw: "how to use", cat: "Buying Resources", customH1: "How to Use a Variable DC Power Supply: A Master Guide for Engineers", customSEO: "How to Use a Variable DC Power Supply | Operation & Safety Guide" },
];

export const KEYWORD_PAGES: KeywordPageData[] = RAW_KEYWORDS.map(({ kw, cat, path, customH1, customSEO }) => {
  const baseSlug = kw.toLowerCase().replace(/\s+/g, '-');
  const corePrefix = CORE_KEYWORD.toLowerCase().replace(/\s+/g, '-');
  
  // Natural Language Keyword/H1 logic
  const coreCap = CORE_KEYWORD.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const h1 = customH1 || `${kw.toUpperCase()} ${coreCap} Series`;
  const seo = customSEO || `${h1} | eTommens Official Technical Site`;

  return {
    slug: `${corePrefix}-${baseSlug}`,
    keyword: h1,
    seoTitle: seo,
    shortTitle: kw.toUpperCase(),
    category: cat,
    description: `Professional technical specifications for ${kw} variable dc power supply units. Engineered for reliability and precision in laboratory and industrial settings.`,
    baseSlug,
    targetPath: path
  };
});
