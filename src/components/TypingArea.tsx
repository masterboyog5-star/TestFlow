import { useEffect, useRef } from 'react';
import { useTypingStore } from '../store/useTypingStore';
import type { CharState } from '../store/useTypingStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const TypingArea: React.FC = () => {
  const { 
    paragraphText, charStates, currentIndex, typeChar, backspace, status,
  } = useTypingStore();
  
  const { typingSettings, displaySettings } = useSettingsStore(state => state.settings);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'idle' && status !== 'typing') return;
      
      // Prevent default scrolling for space
      if (e.key === ' ') e.preventDefault();
      
      if (e.key === 'Backspace') {
        backspace();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        typeChar(e.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, typeChar, backspace]);
  
  // Auto-scroll to keep caret in view if needed
  useEffect(() => {
    if (!containerRef.current) return;
    const activeWord = containerRef.current.querySelector('.active-char');
    if (activeWord) {
      activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex]);
  
  const renderChar = (char: string, index: number, state: CharState) => {
    const isActive = index === currentIndex;
    const isError = state === 'incorrect';
    const isCorrect = state === 'correct' || state === 'corrected';
    
    let charClass = "transition-colors duration-150 ";
    
    if (isError) {
      charClass += "text-error ";
      if (typingSettings.errorHighlight === 'Red + underline') {
        charClass += "underline decoration-error decoration-2 underline-offset-4 ";
      }
    } else if (isCorrect) {
      charClass += "text-textMain ";
    } else {
      charClass += "text-textSecondary ";
    }
    
    // Space character rendering
    const displayChar = char === ' ' ? '\u00A0' : char;
    
    return (
      <span key={index} className="relative inline-block">
        {isActive && (
          <motion.span 
            layoutId="caret"
            className={clsx(
              "absolute left-0 top-0 bottom-0 bg-cyan opacity-80",
              typingSettings.caret === 'Block' ? 'w-full' : 
              typingSettings.caret === 'Underline' ? 'w-full h-[2px] top-auto bottom-0' : 'w-[2px]'
            )}
            style={{ 
              boxShadow: '0 0 8px rgba(0,245,255,0.8)' 
            }}
            transition={typingSettings.smoothCaret ? { type: 'spring', stiffness: 500, damping: 30 } : { duration: 0 }}
          />
        )}
        <span className={clsx(charClass, isActive && "active-char relative z-10", isError && "neon-text-error")}>
          {displayChar}
        </span>
      </span>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className={clsx(
        "text-left relative w-full focus:outline-none overflow-hidden",
        displaySettings.textWidth
      )}
      style={{
        fontSize: `${displaySettings.fontSize}px`,
        lineHeight: displaySettings.lineHeight,
        fontFamily: displaySettings.fontFamily === 'Inter' ? undefined : displaySettings.fontFamily
      }}
    >
      {paragraphText.split('').map((char, i) => renderChar(char, i, charStates[i]))}
    </div>
  );
};
