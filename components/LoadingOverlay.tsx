import React, { useEffect, useRef } from 'react';
import { AgentLog, ResearchStatus } from '../types';
import { Loader2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface LoadingOverlayProps {
  status: ResearchStatus;
  logs: AgentLog[];
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status, logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (status === 'IDLE' || status === 'COMPLETE') return null;

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-slate-400 text-sm font-mono uppercase tracking-wider">Research Orchestrator</span>
        </div>

        {/* Console Area */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-4">
          {logs.map((log) => (
            <div key={log.id} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className="mt-1">
                {log.status === 'pending' && <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />}
                {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {log.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-500">{log.timestamp.toLocaleTimeString()}</span>
                  <span className={`font-bold ${
                    log.agentName === 'System' ? 'text-slate-400' : 'text-brand-400'
                  }`}>
                    [{log.agentName}]
                  </span>
                </div>
                <p className="text-slate-300 mt-1">{log.message}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Progress Indicator */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Processing...</span>
            <span className="capitalize">{status.replace('_', ' ').toLowerCase()}</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full bg-brand-500 transition-all duration-1000 ${
              status === 'SCOPING' ? 'w-[20%]' :
              status === 'MAPPING_COMPETITORS' ? 'w-[45%]' :
              status === 'ANALYZING_FEATURES' ? 'w-[75%]' :
              status === 'SYNTHESIZING_DECK' ? 'w-[90%]' : 'w-full'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;