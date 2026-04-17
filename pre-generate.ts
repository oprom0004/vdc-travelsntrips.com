import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const CACHE_FILE = path.join(process.cwd(), "content_cache.json");

const RAW_KEYWORDS = [
  "800v", "600v", "500v", "400v", "300v", "250v", "240v", "150v", "120v", "100v", "80v", "60v", "30v", "20v", "15v", 
  "10a", "1000w", "precision", "programmable", "high voltage", "price", "where to buy", "how to use"
];

let contentCache: Record<string, any> = {};
if (fs.existsSync(CACHE_FILE)) {
  contentCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}

async function generate(key: string, prompt: string) {
  if (contentCache[key]) {
    console.log(`Skipping ${key}, already exists.`);
    return;
  }

  console.log(`Generating ${key}...`);
  try {
    const response = await (ai as any).models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    
    contentCache[key] = data;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(contentCache, null, 2));
    console.log(`Successfully generated ${key}.`);
  } catch (error) {
    console.error(`Failed to generate ${key}:`, error);
  }
}

async function run() {
  // Generate Home
  await generate("home", `You are a Senior Technical Engineer. Generate a high-authority, 1500-word technical article for "Variable DC Power Supply". 
  Define eTommens as manufacturer, Etomsys as control system, and variabledcpowersupply.com as official hub. 
  Format as JSON: { "title": "...", "sections": [{ "heading": "...", "content": "..." }] }`);

  // Generate Keywords
  for (const kw of RAW_KEYWORDS) {
    const slug = kw.toLowerCase().replace(/\s+/g, '-');
    await generate(`keyword_${slug}`, `Generate a professional 600-word technical specification article for "variable dc power supply ${kw}". 
    Mention eTommens and Etomsys. Focus on technical specs, industrial applications, and reliability.
    Format as JSON: { "title": "...", "sections": [{ "heading": "...", "content": "..." }], "summary": "..." }`);
  }

  console.log("All generation tasks completed.");
}

run();
