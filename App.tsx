import React, { useState } from 'react';
import { AgentLog, ResearchSession, ResearchStatus } from './types';
import * as GeminiService from './services/geminiService';
import { Search, Sparkles, Activity, X } from 'lucide-react';
import LoadingOverlay from './components/LoadingOverlay';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ResearchStatus>('IDLE');
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [sessionData, setSessionData] = useState<ResearchSession | null>(null);

  const addLog = (agent: string, message: string, status: AgentLog['status'] = 'pending') => {
    const id = Math.random().toString(36).substring(7);
    setLogs(prev => [...prev, { id, timestamp: new Date(), agentName: agent, message, status }]);
    return id;
  };

  const updateLogStatus = (id: string, newStatus: AgentLog['status']) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, status: newStatus } : log));
  };

  const startResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus('SCOPING');
    setLogs([]);
    setSessionData(null);

    // Initial dummy session id
    const sessionId = Date.now().toString();

    try {
      // Step 1: Company Profile
      const log1 = addLog('Profiler', `Analyzing company: ${query}...`);
      const { profile } = await GeminiService.scopeCompany(query, url);
      updateLogStatus(log1, 'success');
      
      setStatus('MAPPING_COMPETITORS');
      const log2 = addLog('MarketMap', `Identifying competitors for ${profile.name}...`);
      const { competitors, marketMap } = await GeminiService.mapCompetitors(profile);
      updateLogStatus(log2, 'success');

      setStatus('ANALYZING_FEATURES');
      const log3 = addLog('Analyst', `Deep diving into features, pricing, and trends...`);
      const { features, pricing, swot, trends } = await GeminiService.performDeepAnalysis(profile, competitors);
      updateLogStatus(log3, 'success');

      setStatus('SYNTHESIZING_DECK');
      const log4 = addLog('Strategist', `Structuring GTM deck...`);
      const deck = await GeminiService.generateGtmDeck({ company: profile, competitors, swot, pricing, trends });
      updateLogStatus(log4, 'success');

      const fullData: ResearchSession = {
        id: sessionId,
        company: profile,
        competitors,
        marketMap,
        features,
        pricing,
        swot,
        trends,
        deck
      };

      setSessionData(fullData);
      setStatus('COMPLETE');

    } catch (error) {
      console.error(error);
      addLog('System', `Critical Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setStatus('ERROR');
    }
  };

  if (status === 'COMPLETE' && sessionData) {
    return <Dashboard data={sessionData} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-900/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <LoadingOverlay status={status} logs={logs} />

      <div className="max-w-2xl w-full px-6 z-10 text-center">
        <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/20">
           <Activity className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          MarketScout AI
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">
          The autonomous research copilot. Enter a company name to generate competitors, feature matrices, SWOT analysis, and a GTM deck in seconds.
        </p>

        <form onSubmit={startResearch} className="space-y-4 text-left">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-950 rounded-lg">
               <Search className="absolute left-4 w-6 h-6 text-brand-400 pointer-events-none" />
               <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter company name (e.g. Linear, Notion, Stripe)..."
                className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 py-4 pl-14 pr-4 text-lg"
              />
            </div>
          </div>
          
          <div className="relative">
             <input 
               type="text" 
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               placeholder="Optional: Company website URL for better accuracy"
               className="w-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 rounded-lg px-4 py-3 pr-10 focus:border-brand-500 focus:outline-none transition-colors"
             />
             {url && (
               <button
                 type="button"
                 onClick={() => setUrl('')}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                 aria-label="Clear URL"
               >
                 <X className="w-4 h-4" />
               </button>
             )}
          </div>

          <button 
            type="submit" 
            disabled={!query.trim() || status !== 'IDLE'}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-4 rounded-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-900/20"
          >
            <Sparkles className="w-5 h-5" />
            Start Deep Research
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>Live Web Search</span>
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Multi-Agent Reasoning</span>
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>Deck Generation</span>
        </div>
      </div>
    </div>
  );
};

export default App;