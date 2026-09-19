import React, { useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useParagraphStore } from '../store/useParagraphStore';
import { Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

const categories = ['TEST', 'ROUNDS', 'TYPING', 'DISPLAY'];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState(categories[0]);
  const { settings, rounds, updateTypingSettings, updateDisplaySettings, addRound, removeRound, updateRound } = useSettingsStore();
  const { paragraphs } = useParagraphStore();
  
  return (
    <div className="w-full max-w-5xl flex gap-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-48 flex flex-col gap-2 border-r border-panel pr-4">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={clsx(
              "text-left px-4 py-2 rounded tracking-widest text-sm transition-all",
              activeTab === cat 
                ? "bg-electric/10 text-electric border-l-2 border-electric" 
                : "text-textSecondary hover:text-textMain hover:bg-surface"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="flex-1 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-cyan tracking-wider">{activeTab} SETTINGS</h2>
        
        {activeTab === 'TYPING' && (
          <div className="space-y-8">
            <SettingRow title="Case Sensitivity" description="Require matching uppercase and lowercase letters.">
              <Toggle 
                checked={settings.typingSettings.caseSensitivity} 
                onChange={(v) => updateTypingSettings({ caseSensitivity: v })} 
              />
            </SettingRow>
            <SettingRow title="Error Behavior" description="How the test handles typos.">
              <Select 
                value={settings.typingSettings.errorBehavior} 
                onChange={(v) => updateTypingSettings({ errorBehavior: v as any })}
                options={['Continue after error', 'Require correction']} 
              />
            </SettingRow>
            <SettingRow title="Caret Style" description="Visual appearance of the cursor.">
              <Select 
                value={settings.typingSettings.caret} 
                onChange={(v) => updateTypingSettings({ caret: v as any })}
                options={['Line', 'Block', 'Underline']} 
              />
            </SettingRow>
            <SettingRow title="Smooth Caret" description="Animate caret movement.">
              <Toggle 
                checked={settings.typingSettings.smoothCaret} 
                onChange={(v) => updateTypingSettings({ smoothCaret: v })} 
              />
            </SettingRow>
            <SettingRow title="Error Highlight" description="Visual indication of mistakes.">
              <Select 
                value={settings.typingSettings.errorHighlight} 
                onChange={(v) => updateTypingSettings({ errorHighlight: v as any })}
                options={['Red', 'Red + underline']} 
              />
            </SettingRow>
          </div>
        )}
        
        {activeTab === 'ROUNDS' && (
          <div className="space-y-6">
            <p className="text-textSecondary text-sm mb-4">Configure multiple rounds for your typing session. Each round can have a different paragraph and timer.</p>
            
            {rounds.map((round, index) => (
              <div key={round.id} className="bg-surface p-4 rounded border border-panel flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-electric">Round {index + 1}</h4>
                  {rounds.length > 1 && (
                    <button onClick={() => removeRound(round.id)} className="text-error hover:bg-error/10 p-2 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-textSecondary block mb-1">Timer (Seconds)</label>
                    <input 
                      type="number" 
                      value={round.timerSeconds}
                      onChange={(e) => updateRound(round.id, { timerSeconds: parseInt(e.target.value) || 60 })}
                      className="bg-background border border-panel rounded px-3 py-2 text-textMain w-full focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-textSecondary block mb-1">Paragraph</label>
                    <select 
                      value={round.paragraphId}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateRound(round.id, { 
                          paragraphId: val, 
                          customText: val === 'custom' ? round.customText || 'Type your custom paragraph here...' : undefined 
                        });
                      }}
                      className="bg-background border border-panel rounded px-3 py-2 text-textMain w-full focus:outline-none focus:border-cyan appearance-none"
                    >
                      {paragraphs.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.wordCount} words)</option>
                      ))}
                      <option value="custom">Custom Text...</option>
                    </select>
                  </div>
                </div>
                
                {round.paragraphId === 'custom' && (
                  <div className="mt-2">
                    <label className="text-xs text-textSecondary block mb-1">Custom Paragraph</label>
                    <textarea 
                      value={round.customText || ''}
                      onChange={(e) => updateRound(round.id, { customText: e.target.value })}
                      className="bg-background border border-panel rounded px-3 py-2 text-textMain w-full h-24 focus:outline-none focus:border-cyan resize-y"
                      placeholder="Enter your custom paragraph here..."
                    />
                  </div>
                )}
              </div>
            ))}
            
            <button 
              onClick={() => addRound({ id: Math.random().toString(), paragraphId: paragraphs[0].id, timerSeconds: 60 })}
              className="w-full flex items-center justify-center gap-2 py-3 bg-panel hover:bg-surface border border-dashed border-textSecondary text-textSecondary hover:text-textMain rounded transition-colors"
            >
              <Plus size={16} /> Add Round
            </button>
          </div>
        )}
        
        {activeTab === 'DISPLAY' && (
          <div className="space-y-8">
            <SettingRow title="Font Size" description="Size of the typing text.">
              <input 
                type="range" min="16" max="48" 
                value={settings.displaySettings.fontSize}
                onChange={(e) => updateDisplaySettings({ fontSize: parseInt(e.target.value) })}
                className="accent-cyan"
              />
              <span className="w-8 text-right font-mono">{settings.displaySettings.fontSize}px</span>
            </SettingRow>
            
            <SettingRow title="Font Family" description="Typeface for the typing area.">
              <Select 
                value={settings.displaySettings.fontFamily} 
                onChange={(v) => updateDisplaySettings({ fontFamily: v })}
                options={['Inter', 'Fira Code', 'Roboto Mono', 'sans-serif']} 
              />
            </SettingRow>
            
            <div className="pt-4 border-t border-panel">
              <h3 className="mb-4 text-sm font-bold text-textSecondary tracking-widest">VISIBILITY</h3>
              <div className="grid grid-cols-2 gap-4">
                <VisibilityToggle label="WPM" checked={settings.displaySettings.showWpm} onChange={(v) => updateDisplaySettings({ showWpm: v })} />
                <VisibilityToggle label="Accuracy" checked={settings.displaySettings.showAccuracy} onChange={(v) => updateDisplaySettings({ showAccuracy: v })} />
                <VisibilityToggle label="CPM" checked={settings.displaySettings.showCpm} onChange={(v) => updateDisplaySettings({ showCpm: v })} />
                <VisibilityToggle label="Mistakes" checked={settings.displaySettings.showMistakes} onChange={(v) => updateDisplaySettings({ showMistakes: v })} />
                <VisibilityToggle label="Timer" checked={settings.displaySettings.showTime} onChange={(v) => updateDisplaySettings({ showTime: v })} />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'TEST' && (
          <div className="space-y-8">
            <SettingRow title="Timer Start" description="When does the timer begin counting down?">
              <Select 
                value={settings.testSettings.timerStart} 
                onChange={() => {}} 
                options={['First character typed']} 
              />
            </SettingRow>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Settings Components
const SettingRow = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-panel last:border-0">
    <div>
      <h3 className="text-textMain font-medium">{title}</h3>
      <p className="text-textSecondary text-sm">{description}</p>
    </div>
    <div className="flex items-center gap-4">
      {children}
    </div>
  </div>
);

const Select = ({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="bg-surface border border-panel rounded px-3 py-2 text-textMain text-sm focus:outline-none focus:border-cyan appearance-none cursor-pointer"
  >
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={clsx(
      "w-12 h-6 rounded-full relative transition-colors duration-300",
      checked ? "bg-cyan" : "bg-panel"
    )}
  >
    <div className={clsx(
      "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300",
      checked ? "left-7" : "left-1"
    )} />
  </button>
);

const VisibilityToggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={clsx(
      "flex justify-between items-center p-3 rounded border transition-colors",
      checked ? "border-cyan bg-cyan/5 text-cyan" : "border-panel bg-surface text-textSecondary hover:text-textMain"
    )}
  >
    <span className="text-sm font-bold tracking-widest">{label}</span>
    <div className={clsx("w-2 h-2 rounded-full", checked ? "bg-cyan neon-border-cyan" : "bg-panel")} />
  </button>
);
