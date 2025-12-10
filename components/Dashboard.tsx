import React, { useState } from 'react';
import { ResearchSession, Slide, PricingPlan } from '../types';
import { 
  Building2, 
  Users, 
  Table, 
  DollarSign, 
  TrendingUp, 
  Presentation, 
  Download, 
  Share2 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis,
  Cell
} from 'recharts';

interface DashboardProps {
  data: ResearchSession;
}

const COLORS = ['#0ea5e9', '#ef4444', '#22c55e', '#eab308', '#a855f7'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'pricing' | 'swot' | 'deck'>('overview');

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${data.company.name.replace(/\s+/g, '_')}_Research.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-brand-100 p-2 rounded-lg">
            <Building2 className="text-brand-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{data.company.name}</h1>
            <p className="text-sm text-slate-500">{data.company.industry}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportJSON} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
            <Share2 className="w-4 h-4" />
            Share Report
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 overflow-x-auto">
        <nav className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'features', label: 'Feature Matrix', icon: Table },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'swot', label: 'SWOT & Trends', icon: TrendingUp },
            { id: 'deck', label: 'GTM Deck', icon: Presentation },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Company Profile</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">Value Proposition</span>
                    <p className="text-slate-700 mt-1">{data.company.valueProposition}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">Target Audience</span>
                    <p className="text-slate-700 mt-1">{data.company.targetAudience}</p>
                  </div>
                  <div>
                     <span className="text-xs font-semibold text-slate-400 uppercase">Description</span>
                    <p className="text-slate-700 mt-1">{data.company.description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Competitive Landscape Map</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <XAxis type="number" dataKey="x" name="Price" unit="%" label={{ value: 'Price', position: 'bottom' }} />
                      <YAxis type="number" dataKey="y" name="Completeness" unit="%" label={{ value: 'Completeness', angle: -90, position: 'left' }} />
                      <ZAxis type="number" dataKey="z" range={[100, 500]} name="Market Presence" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Competitors" data={data.marketMap} fill="#8884d8">
                        {data.marketMap.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.name === data.company.name ? '#0ea5e9' : COLORS[index % COLORS.length]} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-slate-400 mt-2">X: Price Index | Y: Feature Completeness | Size: Market Presence</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Competitors Identified</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.competitors.map((comp, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-brand-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{comp.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${comp.type === 'Direct' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{comp.type}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{comp.description}</p>
                    <div className="space-y-1">
                        <p className="text-xs text-green-600"><span className="font-semibold">Strength:</span> {comp.strengths[0]}</p>
                        <p className="text-xs text-red-500"><span className="font-semibold">Weakness:</span> {comp.weaknesses[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === 'features' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Feature Category</th>
                    <th className="px-6 py-3 font-medium">Feature</th>
                    <th className="px-6 py-3 font-medium text-brand-600 bg-brand-50/50">{data.company.name}</th>
                    {data.competitors.map((c, i) => (
                      <th key={i} className="px-6 py-3 font-medium">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.features.map((feat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-medium">{feat.category}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{feat.name}</td>
                      <td className="px-6 py-4 bg-brand-50/30">
                        {feat.myCompany === true ? <span className="text-green-600 font-bold">✓</span> : 
                         feat.myCompany === false ? <span className="text-slate-300">-</span> : 
                         <span className="text-slate-700">{String(feat.myCompany)}</span>}
                      </td>
                      {data.competitors.map((c, i) => {
                        const val = feat.competitors[c.name];
                        return (
                          <td key={i} className="px-6 py-4">
                             {val === true ? <span className="text-green-600 font-bold">✓</span> : 
                              val === false ? <span className="text-slate-300">-</span> : 
                              <span className="text-slate-700">{String(val)}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold mb-2">Pricing Analysis</h3>
              <p className="text-slate-600">{data.pricing.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* My Company Pricing */}
              <div className="border-2 border-brand-200 rounded-xl bg-white overflow-hidden shadow-sm relative">
                <div className="bg-brand-50 p-4 border-b border-brand-100">
                    <h4 className="font-bold text-brand-700 text-lg">{data.company.name}</h4>
                    <span className="text-xs text-brand-600 uppercase tracking-wide">Primary Subject</span>
                </div>
                <div className="p-4 space-y-4">
                   {data.pricing.companyPlans.map((plan, i) => (
                     <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                       <div className="flex justify-between items-baseline mb-1">
                         <span className="font-bold text-slate-900">{plan.name}</span>
                         <span className="text-lg font-bold text-slate-900">{plan.price}</span>
                       </div>
                       <p className="text-xs text-slate-500 mb-2">{plan.model}</p>
                       <ul className="text-sm text-slate-600 space-y-1">
                         {plan.features.slice(0, 3).map((f, fi) => <li key={fi}>• {f}</li>)}
                       </ul>
                     </div>
                   ))}
                </div>
              </div>

              {/* Competitors */}
              {Object.entries(data.pricing.competitorPlans).map(([compName, plans]: [string, PricingPlan[]], idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                   <div className="bg-slate-50 p-4 border-b border-slate-200">
                      <h4 className="font-bold text-slate-700 text-lg">{compName}</h4>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">Competitor</span>
                  </div>
                  <div className="p-4 space-y-4">
                   {plans.map((plan, i) => (
                     <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                       <div className="flex justify-between items-baseline mb-1">
                         <span className="font-bold text-slate-900">{plan.name}</span>
                         <span className="text-sm font-semibold text-slate-700">{plan.price}</span>
                       </div>
                       <p className="text-xs text-slate-500 mb-2">{plan.model}</p>
                       <ul className="text-sm text-slate-600 space-y-1">
                         {plan.features.slice(0, 3).map((f, fi) => <li key={fi}>• {f}</li>)}
                       </ul>
                     </div>
                   ))}
                </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SWOT TAB */}
        {activeTab === 'swot' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h3 className="text-green-800 font-bold flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5" /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {data.swot.strengths.map((item, i) => (
                      <li key={i} className="flex gap-2 text-green-900">
                        <span className="block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <h3 className="text-red-800 font-bold flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 rotate-180" /> Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {data.swot.weaknesses.map((item, i) => (
                      <li key={i} className="flex gap-2 text-red-900">
                         <span className="block w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-blue-800 font-bold flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5" /> Opportunities
                  </h3>
                   <ul className="space-y-2">
                    {data.swot.opportunities.map((item, i) => (
                      <li key={i} className="flex gap-2 text-blue-900">
                         <span className="block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                  <h3 className="text-orange-800 font-bold flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5" /> Threats
                  </h3>
                   <ul className="space-y-2">
                    {data.swot.threats.map((item, i) => (
                      <li key={i} className="flex gap-2 text-orange-900">
                         <span className="block w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Market Trends & Sentiment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.trends.map((trend, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        trend.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                        trend.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>{trend.sentiment}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{trend.title}</h4>
                    <p className="text-sm text-slate-600 mb-3">{trend.description}</p>
                    {trend.source && (
                       <p className="text-xs text-slate-400 italic">Source: {trend.source}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DECK TAB */}
        {activeTab === 'deck' && (
          <div className="max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Generated GTM Deck</h3>
                <button className="text-brand-600 font-medium hover:underline text-sm">Download PDF (Mock)</button>
             </div>
             
             <div className="space-y-8">
               {data.deck.map((slide, idx) => (
                 <div key={idx} className="bg-white aspect-video shadow-lg border border-slate-200 rounded-lg p-12 flex flex-col relative overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-4 right-4 text-slate-300 font-mono text-xl font-bold opacity-30">{idx + 1}</div>
                    
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b-4 border-brand-500 pb-4 inline-block">{slide.title}</h2>
                    
                    <div className="flex-1">
                      {slide.type === 'List' || slide.type === 'Title' ? (
                        <ul className="space-y-4">
                          {slide.content.map((point, pi) => (
                            <li key={pi} className="flex items-start gap-3 text-lg text-slate-700">
                              <span className="text-brand-500 text-2xl">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : (
                         <div className="text-slate-500 italic flex items-center justify-center h-full bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            [Chart/Matrix Placeholder based on data]
                         </div>
                      )}
                    </div>

                    {slide.notes && (
                      <div className="mt-8 pt-4 border-t border-slate-100 text-sm text-slate-400 italic">
                        <span className="font-semibold not-italic text-slate-500">Speaker Notes:</span> {slide.notes}
                      </div>
                    )}
                 </div>
               ))}
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;