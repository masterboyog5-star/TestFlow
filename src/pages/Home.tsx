import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTypingStore } from '../store/useTypingStore';

export const Home = () => {
  const navigate = useNavigate();
  const { settings, rounds } = useSettingsStore();
  const startSession = useTypingStore(state => state.startSession);

  const handleStart = () => {
    startSession(rounds);
    navigate('/test');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl text-center animate-in fade-in zoom-in duration-700">
      
      <div className="relative mb-12">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-electric via-cyan to-bright rounded-full"></div>
        <h1 className="relative text-5xl md:text-7xl font-black mb-4 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,245,255,0.8)]">
          TYPEFLOW
        </h1>
        <div className="inline-block relative">
          <span className="text-electric font-mono text-sm tracking-[0.3em] font-bold uppercase bg-electric/10 px-4 py-1 rounded-full border border-electric/30">
            Advanced Typing Engine
          </span>
        </div>
      </div>

      <p className="text-textSecondary text-lg md:text-xl mb-16 space-y-1 font-sans max-w-2xl mx-auto">
        <span className="block">Train your speed. Forge your accuracy.</span>
        <span className="block">Master multi-round challenges with deep analytics.</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
        <div className="bg-surface/80 backdrop-blur-md p-6 rounded-2xl border border-panel hover:border-cyan/50 transition-colors shadow-2xl flex flex-col items-center justify-center gap-2">
          <span className="text-textSecondary text-sm font-bold tracking-widest uppercase">Current Mode</span>
          <span className="text-3xl font-mono text-white neon-text-cyan">{settings.testSettings.mode}</span>
        </div>
        
        <div className="bg-surface/80 backdrop-blur-md p-6 rounded-2xl border border-panel hover:border-cyan/50 transition-colors shadow-2xl flex flex-col items-center justify-center gap-2">
          <span className="text-textSecondary text-sm font-bold tracking-widest uppercase">Total Rounds</span>
          <span className="text-3xl font-mono text-white neon-text-cyan">{rounds.length}</span>
        </div>
      </div>
      
      <button 
        onClick={handleStart}
        className="group relative w-full max-w-md py-5 bg-electric/10 text-electric border-2 border-electric rounded-xl font-bold text-xl tracking-[0.2em] hover:bg-electric hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(0,168,255,0.3)] hover:shadow-[0_0_40px_rgba(0,168,255,0.6)]"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          START TEST
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
        </span>
      </button>
    </div>
  );
};
