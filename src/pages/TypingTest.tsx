import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingStore } from '../store/useTypingStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { TypingArea } from '../components/TypingArea';
import { Settings as SettingsIcon } from 'lucide-react';
import { clsx } from 'clsx';

export const TypingTest = () => {
  const navigate = useNavigate();
  const { 
    status, timeLeft, wpm, accuracy, cpm, mistakes, currentIndex, paragraphText,
    currentRoundIndex, roundsCount, tickTimer, startNextRound, roundResults
  } = useTypingStore();
  
  const { displaySettings } = useSettingsStore(state => state.settings);
  
  useEffect(() => {
    if (status !== 'idle' && status !== 'typing' && status !== 'round_complete' && status !== 'session_complete') {
       navigate('/');
    }
  }, [status, navigate]);

  // Timer Interval
  useEffect(() => {
    let interval: number | undefined;
    if (status === 'typing') {
      interval = window.setInterval(() => {
        tickTimer();
      }, 100); // Check more frequently than 1s for better accuracy, tickTimer uses Date.now()
    }
    return () => clearInterval(interval);
  }, [status, tickTimer]);
  
  if (status === 'session_complete') {
    // Calculate final results
    const avgWpm = Math.round(roundResults.reduce((acc, r) => acc + r.wpm, 0) / roundResults.length) || 0;
    const avgAcc = Math.round(roundResults.reduce((acc, r) => acc + r.accuracy, 0) / roundResults.length) || 0;
    const avgCpm = Math.round(roundResults.reduce((acc, r) => acc + r.cpm, 0) / roundResults.length) || 0;
    const totalMistakes = roundResults.reduce((acc, r) => acc + r.mistakes, 0);
    const totalTime = roundResults.reduce((acc, r) => acc + r.duration, 0);
    
    return (
      <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-500">
        <h2 className="text-3xl font-bold mb-8 tracking-widest text-textSecondary">TEST COMPLETE</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12 w-full max-w-4xl">
          <StatBox label="AVERAGE WPM" value={avgWpm} highlight />
          <StatBox label="AVERAGE ACCURACY" value={`${avgAcc}%`} />
          <StatBox label="AVERAGE CPM" value={avgCpm} />
          <StatBox label="TOTAL MISTAKES" value={totalMistakes} isError={totalMistakes > 0} />
          <StatBox label="TOTAL TIME" value={`${totalTime}s`} />
        </div>
        
        <div className="w-full max-w-4xl bg-surface p-6 rounded-lg border border-panel mb-8">
          <h3 className="text-lg text-textSecondary mb-4">ROUND PERFORMANCE</h3>
          <div className="space-y-2">
            {roundResults.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-panel last:border-0">
                <span>Round {r.roundNumber}</span>
                <div className="flex gap-8 font-mono">
                  <span className="text-electric">{r.wpm} WPM</span>
                  <span className="text-cyan">{r.accuracy}%</span>
                  <span className="text-textSecondary">{r.duration}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-panel rounded hover:bg-surface transition-colors">HOME</button>
          <button onClick={() => navigate('/settings')} className="px-6 py-2 bg-panel rounded hover:bg-surface transition-colors">SETTINGS</button>
        </div>
      </div>
    );
  }
  
  if (status === 'round_complete') {
    const lastResult = roundResults[roundResults.length - 1];
    return (
      <div className="flex flex-col items-center w-full animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold mb-8 text-textSecondary tracking-wider">ROUND {lastResult?.roundNumber} COMPLETE</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 w-full max-w-4xl">
          <StatBox label="WPM" value={lastResult?.wpm || 0} highlight size="lg" />
          <StatBox label="ACCURACY" value={`${lastResult?.accuracy || 0}%`} size="lg" />
          <StatBox label="CPM" value={lastResult?.cpm || 0} size="lg" />
          <StatBox label="MISTAKES" value={lastResult?.mistakes || 0} isError={(lastResult?.mistakes || 0) > 0} size="lg" />
          <StatBox label="TIME" value={`${lastResult?.duration || 0}s`} size="lg" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="px-6 py-2 border border-panel rounded text-textSecondary hover:text-textMain transition-colors">EXIT</button>
          <button 
            onClick={startNextRound}
            className="px-8 py-3 bg-electric/10 text-electric border border-electric rounded font-bold hover:bg-electric hover:text-background transition-all neon-border-electric"
          >
            {currentRoundIndex < roundsCount - 1 ? 'NEXT ROUND' : 'FINISH TEST'}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col items-center max-w-5xl animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-end mb-4">
        <div className="flex gap-8">
          {displaySettings.showTime && (
             <div className="text-4xl font-bold font-mono text-cyan neon-text-cyan">{timeLeft}s</div>
          )}
          <div className="flex gap-6 text-xl font-mono text-textSecondary pb-1">
            {displaySettings.showWpm && <div><span className="text-textMain">{wpm}</span> WPM</div>}
            {displaySettings.showAccuracy && <div><span className="text-textMain">{accuracy}%</span> ACC</div>}
            {displaySettings.showCpm && <div><span className="text-textMain">{cpm}</span> CPM</div>}
            {displaySettings.showMistakes && <div><span className={mistakes > 0 ? "text-error" : "text-textMain"}>{mistakes}</span> ERR</div>}
          </div>
        </div>
        <div className="flex items-center gap-4 text-textSecondary font-sans">
          <span className="tracking-widest text-sm uppercase bg-panel px-3 py-1 rounded-full text-textMain border border-surface shadow-[0_0_10px_rgba(0,0,0,0.5)]">Round {currentRoundIndex + 1} / {roundsCount}</span>
          <button onClick={() => navigate('/settings')} className="hover:text-cyan transition-colors bg-surface p-2 rounded-full border border-panel hover:border-cyan/50">
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-surface rounded-full mb-12 overflow-hidden border border-panel relative">
        <div 
          className="absolute top-0 left-0 h-full bg-cyan transition-all duration-300 shadow-[0_0_10px_rgba(0,245,255,0.8)]"
          style={{ width: `${(currentIndex / Math.max(1, paragraphText.length)) * 100}%` }}
        />
      </div>
      
      {/* Typing Area */}
      <div className="w-full flex justify-center mt-4">
        <TypingArea />
      </div>
    </div>
  );
};

// Helper Component for Stats
const StatBox = ({ label, value, highlight, isError, size = 'md' }: { label: string, value: string | number, highlight?: boolean, isError?: boolean, size?: 'md' | 'lg' }) => (
  <div className="flex flex-col items-center bg-surface p-4 rounded border border-panel">
    <div className={clsx(
      "font-bold font-mono mb-2",
      size === 'lg' ? 'text-4xl' : 'text-3xl',
      highlight ? 'text-electric neon-text-electric' : 
      isError ? 'text-error neon-text-error' : 'text-textMain'
    )}>
      {value}
    </div>
    <div className="text-xs text-textSecondary tracking-widest">{label}</div>
  </div>
);
