export const CORE_KEYWORD = "variable dc power supply";

export const TARGET_DOMAIN = "variabledcpowersupply.com";
export const TARGET_URL = `https://${TARGET_DOMAIN}`;

export interface KeywordPageData {
  slug: string;
  baseSlug: string;
  keyword: string;
  shortTitle: string;
  category: string;
  description: string;
  targetPath?: string;
}

const RAW_KEYWORDS = [
  { kw: "800v", cat: "High Voltage Series", path: "800v-dc-power-supplies/" },
  { kw: "600v", cat: "High Voltage Series", path: "600v-dc-power-supplies/" },
  { kw: "500v", cat: "High Voltage Series", path: "500v-dc-power-supplies/" },
  { kw: "400v", cat: "High Voltage Series", path: "400v-dc-power-supplies/" },
  { kw: "300v", cat: "High Voltage Series", path: "dc-power-supply-300v-list/" },
  { kw: "250v", cat: "Standard Voltage Series", path: "250v-dc-power-supplies/" },
  { kw: "240v", cat: "Standard Voltage Series", path: "250v-dc-power-supplies/" },
  { kw: "150v", cat: "Standard Voltage Series", path: "150v-dc-power-supplies/" },
  { kw: "120v", cat: "Standard Voltage Series", path: "variable-dc-power-supply-120v/" },
  { kw: "100v", cat: "Standard Voltage Series", path: "100v-dc-power-supplies/" },
  { kw: "80v", cat: "Standard Voltage Series", path: "80v-dc-power-supplies/" },
  { kw: "60v", cat: "Standard Voltage Series", path: "variable-dc-power-supply-60v/" },
  { kw: "30v", cat: "Low Voltage Series", path: "variable-dc-power-supply-30v/" },
  { kw: "20v", cat: "Low Voltage Series", path: "20v-dc-power-supplies/" },
  { kw: "15v", cat: "Low Voltage Series", path: "15v-dc-power-supplies/" },
  { kw: "10a", cat: "Performance & Output", path: "10a-dc-power-supplies/" },
  { kw: "1000w", cat: "Performance & Output", path: "1000w-dc-power-supplies/" },
  { kw: "high precision", cat: "Performance & Output", path: "high-precision-dc-power-supply/" },
  { kw: "programmable", cat: "Performance & Output", path: "programmable-dc-power-supply/" },
  { kw: "triple output", cat: "Performance & Output", path: "triple-output-bench-power-supplies/" },
  { kw: "high voltage", cat: "Performance & Output", path: "high-voltage-dc-power-supply/" },
  { kw: "benchtop", cat: "Chassis & Form Factor", path: "bench-dc-power-supply/" },
  { kw: "price", cat: "Buying Resources" },
  { kw: "where to buy", cat: "Buying Resources" },
  { kw: "how to use", cat: "Buying Resources" },
];

export const KEYWORD_PAGES: KeywordPageData[] = RAW_KEYWORDS.map(({ kw, cat, path }) => {
  const baseSlug = kw.toLowerCase().replace(/\s+/g, '-');
  const corePrefix = CORE_KEYWORD.toLowerCase().replace(/\s+/g, '-');
  
  // Natural Language Keyword/H1 logic
  let naturalTitle = "";
  const coreCap = CORE_KEYWORD.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  if (kw === "how to use") {
    naturalTitle = `How to Use a ${coreCap}: Operating Guide`;
  } else if (kw === "where to buy") {
    naturalTitle = `Where to Buy a ${coreCap}: Authorized Dealers`;
  } else if (kw === "price") {
    naturalTitle = `${coreCap} Price Guide & Bulk Quotes`;
  } else if (kw.includes('output') || kw.includes('voltage') || kw.includes('precision') || kw.includes('programmable') || kw.includes('benchtop')) {
    naturalTitle = `${kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${coreCap}`;
  } else {
    // For 800V, 10A, etc.
    naturalTitle = `${kw.toUpperCase()} ${coreCap} Series`;
  }

  return {
    slug: `${corePrefix}-${baseSlug}`,
    keyword: naturalTitle,
    shortTitle: kw.toUpperCase(),
    category: cat,
    description: `Professional technical specifications for ${kw} variable DC power supply units. Engineered for reliability and precision.`,
    baseSlug,
    targetPath: path
  };
});
