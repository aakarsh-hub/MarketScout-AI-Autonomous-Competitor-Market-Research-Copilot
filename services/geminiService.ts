import { GoogleGenAI, Type } from "@google/genai";
import { ResearchSession, CompanyProfile, Competitor, Feature, PricingComparison, SWOT, Trend, Slide, MarketMapData } from "../types";

// Helper to sanitize JSON string if the model returns markdown code blocks
const cleanJson = (text: string): string => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean.trim();
};

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

// ---------------------------------------------------------
// AGENT 1: SCOPING & PROFILING
// ---------------------------------------------------------
export const scopeCompany = async (companyName: string, url?: string): Promise<{ profile: CompanyProfile }> => {
  const ai = getClient();
  const prompt = `
    Conduct research on the company "${companyName}" ${url ? `(${url})` : ''}.
    Identify its industry, core description, target audience (ICP), and main value proposition.
    Return strictly JSON matching this schema:
    {
      "name": "Exact Company Name",
      "website": "URL",
      "industry": "Industry Name",
      "description": "2 sentence description",
      "targetAudience": "Target segment (e.g. SMB, Enterprise B2B)",
      "valueProposition": "Main differentiator"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      // responseMimeType cannot be used with googleSearch
    }
  });

  return { profile: JSON.parse(cleanJson(response.text || '{}')) };
};

// ---------------------------------------------------------
// AGENT 2: COMPETITOR MAPPING & MARKET LANDSCAPE
// ---------------------------------------------------------
export const mapCompetitors = async (profile: CompanyProfile): Promise<{ competitors: Competitor[], marketMap: MarketMapData[] }> => {
  const ai = getClient();
  const prompt = `
    Based on this company profile: ${JSON.stringify(profile)}, find 4-5 key competitors.
    For each, identify if they are direct or indirect, their strengths/weaknesses.
    Also, assign coordinates for a "Market Map" where X-axis is Price (1-100) and Y-axis is Feature Completeness/Enterprise-Readiness (1-100), and Z is Market Presence (10-100).
    Include the target company in the market map data.
    
    Return strictly JSON:
    {
      "competitors": [
        { "name": "...", "website": "...", "type": "Direct", "description": "...", "strengths": ["..."], "weaknesses": ["..."] }
      ],
      "marketMap": [
        { "name": "...", "x": 50, "y": 50, "z": 80 }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      // responseMimeType cannot be used with googleSearch
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// ---------------------------------------------------------
// AGENT 3: DEEP ANALYSIS (Features, Pricing, SWOT, Trends)
// ---------------------------------------------------------
export const performDeepAnalysis = async (profile: CompanyProfile, competitors: Competitor[]) => {
  const ai = getClient();
  
  const compNames = competitors.map(c => c.name).join(", ");
  
  const prompt = `
    Perform a deep dive analysis comparing ${profile.name} against: ${compNames}.
    
    1. **Feature Matrix**: List 5-7 key features in this industry. For each, indicate if ${profile.name} and each competitor supports it (true/false or a short string describing the level of support).
    2. **Pricing**: Estimate pricing models.
    3. **SWOT**: Create a SWOT analysis for ${profile.name}.
    4. **Trends**: Identify 3 recent market trends or customer sentiment themes from reviews.

    Return strictly JSON:
    {
      "features": [
        { "name": "Feature Name", "category": "Category", "myCompany": true, "competitors": { "Competitor A": true, "Competitor B": "Partial" } }
      ],
      "pricing": {
        "companyPlans": [{ "name": "Plan", "price": "$X", "model": "Seat-based", "features": ["..."] }],
        "competitorPlans": { "Competitor A": [{ "name": "...", "price": "...", "model": "...", "features": ["..."] }] },
        "summary": "Brief analysis of pricing strategy."
      },
      "swot": {
        "strengths": ["..."], "weaknesses": ["..."], "opportunities": ["..."], "threats": ["..."]
      },
      "trends": [
        { "title": "...", "description": "...", "sentiment": "Neutral" }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      // responseMimeType cannot be used with googleSearch
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// ---------------------------------------------------------
// AGENT 4: DECK GENERATOR
// ---------------------------------------------------------
export const generateGtmDeck = async (sessionData: Partial<ResearchSession>): Promise<Slide[]> => {
  const ai = getClient();
  
  const prompt = `
    Act as a Strategy Consultant. Create a 10-slide GTM (Go-to-Market) deck structure for ${sessionData.company?.name} based on the research provided below.
    
    Research Context:
    Profile: ${JSON.stringify(sessionData.company)}
    Competitors: ${JSON.stringify(sessionData.competitors?.map(c => c.name))}
    SWOT: ${JSON.stringify(sessionData.swot)}
    Pricing Summary: ${sessionData.pricing?.summary}
    Trends: ${JSON.stringify(sessionData.trends)}

    Structure the deck as:
    1. Title Slide
    2. Company Snapshot
    3. Market Problem & Opportunity
    4. Competitive Landscape
    5. Feature Comparison
    6. Pricing Strategy
    7. Customer Insights & Trends
    8. SWOT Analysis
    9. Strategic GTM Recommendations
    10. Next Steps / Roadmap

    Return strictly JSON:
    [
      { "title": "Slide Title", "type": "List", "content": ["Bullet 1", "Bullet 2"], "notes": "Speaker notes" }
    ]
  `;

  // We can use the pro model here for better reasoning on strategy, no search needed
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Using flash for speed/quota safety, but Pro is better for reasoning
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  const parsed = JSON.parse(cleanJson(response.text || '[]'));
  // Ensure we have an array
  return Array.isArray(parsed) ? parsed : parsed.slides || [];
};