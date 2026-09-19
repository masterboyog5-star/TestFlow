import React from 'react';
import { useHistoryStore } from '../store/useHistoryStore';
import { useParagraphStore } from '../store/useParagraphStore';
import { Trash2, AlertCircle } from 'lucide-react';

export const History: React.FC = () => {
  const { sessions, clearHistory } = useHistoryStore();
  const { getParagraphById } = useParagraphStore();
  
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-textSecondary h-[50vh] gap-4">
        <AlertCircle size={48} className="opacity-20" />
        <p className="tracking-widest">NO HISTORY FOUND</p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold text-cyan tracking-wider">TEST HISTORY</h2>
        <button 
          onClick={clearHistory}
          className="flex items-center gap-2 text-sm text-error hover:bg-error/10 px-3 py-1 rounded transition-colors"
        >
          <Trash2 size={16} /> CLEAR
        </button>
      </div>
      
      <div className="space-y-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-surface border border-panel rounded-lg overflow-hidden">
            <div className="bg-panel px-6 py-3 flex justify-between items-center">
              <span className="text-textSecondary text-sm">
                {new Date(session.completedAt || session.startedAt).toLocaleString()}
              </span>
              <span className="text-electric text-sm font-bold tracking-widest">{session.totalRounds} ROUNDS</span>
            </div>
            
            <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <Stat value={session.averageWpm} label="AVG WPM" highlight />
              <Stat value={`${session.averageAccuracy}%`} label="AVG ACCURACY" />
              <Stat value={session.averageCpm} label="AVG CPM" />
              <Stat value={session.totalMistakes} label="TOTAL ERRORS" isError={session.totalMistakes > 0} />
              <Stat value={`${session.totalDuration}s`} label="TOTAL TIME" />
            </div>
            
            {session.rounds.length > 0 && (
              <div className="px-6 pb-6">
                <h4 className="text-xs font-bold text-textSecondary tracking-widest mb-3 border-b border-panel pb-2">ROUND BREAKDOWN</h4>
                <div className="space-y-2">
                  {session.rounds.map(r => {
                    const paragraph = getParagraphById(r.paragraphId);
                    return (
                      <div key={r.id} className="flex justify-between text-sm items-center hover:bg-white/5 p-2 rounded transition-colors">
                        <span className="text-textSecondary w-20">Round {r.roundNumber}</span>
                        <span className="flex-1 truncate text-textSecondary px-4 opacity-50">{paragraph?.title || 'Unknown Paragraph'}</span>
                        <div className="flex gap-6 font-mono text-right">
                          <span className="text-electric w-16">{r.wpm} WPM</span>
                          <span className="text-cyan w-16">{r.accuracy}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat = ({ value, label, highlight, isError }: { value: string | number, label: string, highlight?: boolean, isError?: boolean }) => (
  <div className="flex flex-col">
    <span className={`font-mono text-2xl font-bold ${highlight ? 'text-electric' : isError ? 'text-error' : 'text-textMain'}`}>
      {value}
    </span>
    <span className="text-[10px] text-textSecondary tracking-widest mt-1">{label}</span>
  </div>
);
