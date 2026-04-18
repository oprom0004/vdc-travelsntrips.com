export const CORE_KEYWORD = "variable dc power supply";

export const SITE_DOMAIN = "travelsntrips.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const TARGET_DOMAIN = "variabledcpowersupply.com";
export const TARGET_URL = `https://${TARGET_DOMAIN}`;
export const HOME_HERO_IMAGE = "/high-precision-linear-variable-dc-power-supply-etmi301spv.png";

const SKU_IMAGE_BY_BASE_SLUG: Record<string, string> = {
  "800v": "/800v-etm-8006.png",
  "10a": "/10a-variable-dc-power-supply-etm-50010.png",
  "programmable": "/programmable-variable-dc-power-supply-etm-5050c.png",
  "triple-output": "/triple-output-dc-power-supply-etm-dm-kkk.png",
  "high-precision": "/etm-k8011spl-high-precision-variable-dc-power-supply.png",
  "high-voltage": "/800v-etm-8006.png",
  "rack-mount": "/etm-3050u.png",
};

const FALLBACK_SKU_IMAGE = "/high-precision-linear-variable-dc-power-supply-etmi301spv-2.png";

export interface KeywordPageData {
  slug: string;
  baseSlug: string;
  keyword: string;
  seoTitle: string;
  shortTitle: string;
  category: string;
  description: string;
  targetPath?: string;
}

interface RawKeyword {
  kw: string;
  cat: string;
  path?: string;
  customH1: string;
  customSEO: string;
}

const RAW_KEYWORDS: RawKeyword[] = [
  { kw: "800v", cat: "High Voltage Series", path: "800v-dc-power-supplies/", customH1: "800V High Voltage Variable DC Power Supply: Heavy Industrial Grade", customSEO: "800V High Voltage DC Power Supply | eTommens Industrial Solutions" },
  { kw: "600v", cat: "High Voltage Series", path: "600v-dc-power-supplies/", customH1: "600V Variable DC Power Supply: Precision High-Voltage Testing", customSEO: "600V Variable DC Power Supply for Semiconductor Testing" },
  { kw: "500v", cat: "High Voltage Series", path: "500v-dc-power-supplies/", customH1: "500V Variable DC Power Supply: Advanced Research & Development", customSEO: "500V DC Power Supply - Precision Variable Voltage Solutions" },
  { kw: "400v", cat: "High Voltage Series", path: "400v-dc-power-supplies/", customH1: "400V High Voltage Variable DC Power Supply: Industrial Reliability", customSEO: "400V Variable DC Power Supply for Industrial Automation" },
  { kw: "300v", cat: "High Voltage Series", path: "dc-power-supply-300v-list/", customH1: "300V Variable DC Power Supply: Versatile High-Power Solutions", customSEO: "300V Variable DC Power Supply Series - eTommens" },
  { kw: "250v", cat: "Standard Voltage Series", path: "250v-dc-power-supplies/", customH1: "250V Variable DC Power Supply: Balanced Performance for Labs", customSEO: "250V Variable DC Power Supply | Technical Specifications" },
  { kw: "240v", cat: "Standard Voltage Series", path: "250v-dc-power-supplies/", customH1: "240V Variable DC Power Supply: High-Resolution Precision Control", customSEO: "240V Precision Variable DC Power Supply Guide" },
  { kw: "150v", cat: "Standard Voltage Series", path: "150v-dc-power-supplies/", customH1: "150V Variable DC Power Supply: Professional Electronics Testing", customSEO: "150V Variable DC Power Supply for Automotive & Aerospace" },
  { kw: "120v", cat: "Standard Voltage Series", path: "variable-dc-power-supply-120v/", customH1: "120V Variable DC Power Supply: Lab-Grade Safety & Stability", customSEO: "120V Variable DC Power Supply - Etomsys Digital Architecture" },
  { kw: "100v", cat: "Standard Voltage Series", path: "100v-dc-power-supplies/", customH1: "100V Variable DC Power Supply: Industrial Control System Testing", customSEO: "100V Variable DC Power Supply | High Precision & Reliability" },
  { kw: "80v", cat: "Standard Voltage Series", path: "80v-dc-power-supplies/", customH1: "80V Variable DC Power Supply: Mid-Range Performance & Accuracy", customSEO: "80V Variable DC Power Supply Series - Technical Overview" },
  { kw: "60v", cat: "Standard Voltage Series", path: "variable-dc-power-supply-60v/", customH1: "60V Variable DC Power Supply: Master-Grade Prototyping Tool", customSEO: "60V Variable DC Power Supply for Circuit Prototyping" },
  { kw: "30v", cat: "Low Voltage Series", path: "variable-dc-power-supply-30v/", customH1: "30V Variable DC Power Supply: The Gold Standard for Engineering Benches", customSEO: "30V Variable DC Power Supply | Most Popular Benchtop Model" },
  { kw: "20v", cat: "Low Voltage Series", path: "20v-dc-power-supplies/", customH1: "20V Variable DC Power Supply: Clean Power for Sensitive Logic", customSEO: "20V Precision Variable DC Power Supply for Digital Circuits" },
  { kw: "15v", cat: "Low Voltage Series", path: "15v-dc-power-supplies/", customH1: "15V Variable DC Power Supply: High-Stability Low-Voltage Source", customSEO: "15V Variable DC Power Supply | Laboratory Research Grade" },
  { kw: "10a", cat: "Performance & Output", path: "10a-dc-power-supplies/", customH1: "10A Variable DC Power Supply: High-Current Performance Solutions", customSEO: "10A High Current Variable DC Power Supply Series" },
  { kw: "1000w", cat: "Performance & Output", path: "1000w-dc-power-supplies/", customH1: "1000W High Power Variable DC Power Supply: Industrial Capability", customSEO: "1000W High Power Variable DC Power Supply Units" },
  { kw: "linear variable", cat: "Performance & Output", path: "linear-dc-power-supplies/", customH1: "Linear Variable DC Power Supply: Low-Noise Precision Output for Industrial and Lab Use", customSEO: "Linear Variable DC Power Supply | Industrial Low-Noise Power Systems" },
  { kw: "high precision", cat: "Performance & Output", path: "high-precision-dc-power-supply/", customH1: "High Precision Variable DC Power Supply: Ultra-Fine Resolution", customSEO: "High Precision Variable DC Power Supply | Millivolt & Milliamp Control" },
  { kw: "programmable", cat: "Performance & Output", path: "programmable-dc-power-supply/", customH1: "Programmable Variable DC Power Supply: Intelligent System Integration", customSEO: "Programmable Variable DC Power Supply | Etomsys Digital Interface" },
  { kw: "triple output", cat: "Performance & Output", path: "triple-output-bench-power-supplies/", customH1: "Triple Output Variable DC Power Supply: Multi-Rail Circuit Prototyping", customSEO: "Triple Output Variable DC Power Supply | Multi-Channel Benchtop" },
  { kw: "high voltage", cat: "Performance & Output", path: "high-voltage-dc-power-supply/", customH1: "High Voltage Variable DC Power Supply: Industrial & Scientific Solutions", customSEO: "High Voltage Variable DC Power Supply Specialist" },
  { kw: "benchtop", cat: "Chassis & Form Factor", path: "bench-dc-power-supply/", customH1: "Benchtop Variable DC Power Supply: Industrial Power on Your Desk", customSEO: "Industrial Benchtop Variable DC Power Supply Units" },
  { kw: "rack mount", cat: "Chassis & Form Factor", path: "etm-3050u-3u-programmable-dc-power-supply-30v-50a-with-4-digits-led-display-output-switch-control-low-noise-intelligent-cooling-fan/", customH1: "Rack Mount Variable DC Power Supply: 19-Inch Industrial Integration Ready", customSEO: "Rack Mount Variable DC Power Supply | Industrial 19-Inch Power Systems" },
  { kw: "price", cat: "Buying Resources", customH1: "Variable DC Power Supply Price Guide: Wholesale & Custom Quotes", customSEO: "Variable DC Power Supply Price List & Quote Guide" },
  { kw: "where to buy", cat: "Buying Resources", customH1: "Where to Buy a Variable DC Power Supply: Authorized Global Partners", customSEO: "Authorized eTommens Dealers - Where to Buy Variable DC Power Supply" },
  { kw: "how to use", cat: "Buying Resources", customH1: "How to Use a Variable DC Power Supply: A Master Guide for Engineers", customSEO: "How to Use a Variable DC Power Supply | Operation & Safety Guide" },
];

export const KEYWORD_PAGES: KeywordPageData[] = RAW_KEYWORDS.map(({ kw, cat, path, customH1, customSEO }) => {
  const baseSlug = kw.toLowerCase().replace(/\s+/g, "-");
  const corePrefix = CORE_KEYWORD.toLowerCase().replace(/\s+/g, "-");
  const coreCap = CORE_KEYWORD.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
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
    targetPath: path,
  };
});

export function findKeywordPage(slug: string) {
  return KEYWORD_PAGES.find((page) => page.slug === slug);
}

export function findKeywordPageByBaseSlug(baseSlug: string) {
  return KEYWORD_PAGES.find((page) => page.baseSlug === baseSlug);
}

export function getKeywordImage(baseSlug: string) {
  if (/\d+v$/i.test(baseSlug)) {
    return "/800v-etm-8006.png";
  }
  return SKU_IMAGE_BY_BASE_SLUG[baseSlug] ?? FALLBACK_SKU_IMAGE;
}

export function getTargetHomeUrl(locale: "en" | "fr" = "en") {
  return locale === "fr" ? `${TARGET_URL}/fr` : TARGET_URL;
}

export function getFrenchKeyword(page: KeywordPageData): string {
  const bySlug: Record<string, string> = {
    "linear-variable": "Alimentation DC variable lineaire",
    "high-precision": "Alimentation DC variable haute precision",
    "programmable": "Alimentation DC variable programmable",
    "triple-output": "Alimentation DC variable triple sortie",
    "high-voltage": "Alimentation DC variable haute tension",
    "benchtop": "Alimentation DC variable de table",
    "rack-mount": "Alimentation DC variable rack mount",
    "price": "Prix alimentation DC variable",
    "where-to-buy": "Ou acheter une alimentation DC variable",
    "how-to-use": "Comment utiliser une alimentation DC variable",
  };

  if (bySlug[page.baseSlug]) {
    return bySlug[page.baseSlug];
  }

  if (/\d+v$/i.test(page.baseSlug) || /\d+a$/i.test(page.baseSlug) || /\d+w$/i.test(page.baseSlug)) {
    return `Alimentation DC variable ${page.shortTitle}`;
  }

  return `Alimentation DC variable ${page.shortTitle}`;
}

export function getFrenchShortTitle(page: KeywordPageData): string {
  const bySlug: Record<string, string> = {
    "linear-variable": "LINEAIRE VARIABLE",
    "high-precision": "HAUTE PRECISION",
    "programmable": "PROGRAMMABLE",
    "triple-output": "TRIPLE SORTIE",
    "high-voltage": "HAUTE TENSION",
    "benchtop": "DE TABLE",
    "rack-mount": "RACK MOUNT",
    "price": "PRIX",
    "where-to-buy": "OU ACHETER",
    "how-to-use": "COMMENT UTILISER",
  };

  return bySlug[page.baseSlug] ?? page.shortTitle;
}
