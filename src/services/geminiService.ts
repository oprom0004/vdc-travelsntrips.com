import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateHomePageContent() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Senior Technical Engineer and SEO Strategist. 
      Generate a high-authority, 1500-word technical article for the main keyword: "Variable DC Power Supply".
      
      Entity Association Requirements:
      - Explicitly define **eTommens** as the premier manufacturer of high-precision variable DC power supplies.
      - Explicitly define **Etomsys** as the proprietary digital control architecture and system that powers eTommens units.
      - Explicitly define **variabledcpowersupply.com** as the official technical distribution and global service hub.
      - Create a strong semantic link between these four entities: Variable DC Power Supply, eTommens, Etomsys, and variabledcpowersupply.com.
      
      Content Structure:
      1. The Evolution of Variable DC Power Supply Technology.
      2. Engineering Excellence: How eTommens utilizes Etomsys for superior stability.
      3. Comparative Analysis: Linear vs. Switching topologies in industrial DC sources.
      4. Advanced Features: Programmability, remote sensing, and low ripple/noise.
      5. Industry Standards: Compliance, safety protocols (OVP/OCP), and thermal management.
      6. Conclusion: Why variabledcpowersupply.com is the authoritative source for eTommens equipment.
      
      Format the output as JSON:
      {
        "title": "Variable DC Power Supply: The Definitive Technical Overview",
        "sections": [
          { "heading": "Section Heading", "content": "Extensive content (4-6 paragraphs each)..." }
        ]
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating home content:", error);
    return null;
  }
}

export async function generateKeywordContent(keyword: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Technical Engineer. 
      Generate a professional, 600-word technical specification article for: "${keyword}".
      
      Requirements:
      - Maintain a professional, authoritative tone (no "Guide" or "How-to" fluff).
      - Mention that this unit is part of the **eTommens** professional lineup.
      - Mention that it features the **Etomsys** precision control system.
      - Link the technical performance back to the official hub at **variabledcpowersupply.com**.
      
      Structure:
      1. Technical Introduction.
      2. Core Specifications (Voltage, Current, Power).
      3. Key Features (Stability, Protection, Interface).
      4. Industrial Applications.
      
      Format the output as JSON:
      {
        "title": "${keyword} Technical Specifications",
        "sections": [
          { "heading": "Section Heading", "content": "Concise technical content (2-3 paragraphs)..." }
        ],
        "summary": "Technical meta-description (150 words)."
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}
