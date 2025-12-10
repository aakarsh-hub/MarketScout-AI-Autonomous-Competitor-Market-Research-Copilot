export interface CompanyProfile {
  name: string;
  website?: string;
  industry: string;
  description: string;
  targetAudience: string;
  valueProposition: string;
}

export interface Competitor {
  name: string;
  website: string;
  type: 'Direct' | 'Indirect';
  description: string;
  strengths: string[];
  weaknesses: string[];
  marketShareEstimate?: string; // Low, Medium, High
}

export interface Feature {
  name: string;
  category: string;
  myCompany: boolean | string;
  competitors: Record<string, boolean | string>;
}

export interface PricingPlan {
  name: string;
  price: string;
  model: 'Seat-based' | 'Usage-based' | 'Flat-rate' | 'Freemium' | 'Tiered';
  features: string[];
}

export interface PricingComparison {
  companyPlans: PricingPlan[];
  competitorPlans: Record<string, PricingPlan[]>;
  summary: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Trend {
  title: string;
  description: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  source?: string;
}

export interface MarketMapData {
  name: string;
  x: number; // e.g., Price (Low to High)
  y: number; // e.g., Feature Completeness (Low to High)
  z: number; // e.g., Market Presence (Bubble size)
}

export interface Slide {
  title: string;
  content: string[]; // Bullet points
  notes?: string;
  type: 'Title' | 'List' | 'Matrix' | 'Chart' | 'Split';
}

export interface ResearchSession {
  id: string;
  company: CompanyProfile;
  competitors: Competitor[];
  features: Feature[];
  pricing: PricingComparison;
  swot: SWOT;
  trends: Trend[];
  marketMap: MarketMapData[];
  deck: Slide[];
}

export type ResearchStatus = 'IDLE' | 'SCOPING' | 'MAPPING_COMPETITORS' | 'ANALYZING_FEATURES' | 'SYNTHESIZING_DECK' | 'COMPLETE' | 'ERROR';

export interface AgentLog {
  id: string;
  timestamp: Date;
  agentName: string;
  message: string;
  status: 'pending' | 'success' | 'error';
}