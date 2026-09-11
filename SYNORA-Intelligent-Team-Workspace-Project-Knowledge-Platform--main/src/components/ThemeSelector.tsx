import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme, THEME_CONFIGS, UiTheme } from '../context/ThemeContext';

export const ThemeSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentTheme, setTheme, themeConfig, isLight } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themesList = Object.values(THEME_CONFIGS);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/60 border border-slate-800">
        {themesList.slice(0, 4).map((th) => (
          <button
            key={th.id}
            title={th.name}
            onClick={() => setTheme(th.id)}
            className={`w-5 h-5 rounded-full relative transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${
              currentTheme === th.id ? 'ring-2 ring-white scale-110 shadow-sm' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              background: `linear-gradient(135deg, ${th.previewColors[1]}, ${th.previewColors[2]})`,
            }}
          >
            {currentTheme === th.id && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Toggle Button */}
      <button
        id="theme-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 transition-all cursor-pointer text-xs font-medium shadow-sm hover:border-slate-600"
        title="Change UI Theme & Colors"
      >
        <div 
          className="w-3.5 h-3.5 rounded-full shadow-inner flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${themeConfig.previewColors[1]}, ${themeConfig.previewColors[2]})`,
          }}
        />
        <span className="hidden sm:inline font-medium text-slate-200">{themeConfig.name}</span>
        <Palette className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Theme Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#121624] border border-slate-700/90 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 border-b border-slate-800 flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Palette className="w-3.5 h-3.5 text-violet-400" />
              <span>Workspace UI Colors</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">6 Curated Themes</span>
          </div>

          <div className="space-y-1 max-h-80 overflow-y-auto pr-0.5">
            {themesList.map((th) => {
              const isSelected = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  id={`theme-option-${th.id}`}
                  onClick={() => {
                    setTheme(th.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-600/20 border border-violet-500/50 text-white'
                      : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-5 h-5 rounded-md shrink-0 shadow-sm flex items-center justify-center border border-white/20"
                      style={{
                        background: `linear-gradient(135deg, ${th.previewColors[0]} 0%, ${th.previewColors[1]} 50%, ${th.previewColors[2]} 100%)`,
                      }}
                    >
                      {th.category === 'light' ? (
                        <Sun className="w-2.5 h-2.5 text-amber-400" />
                      ) : (
                        <Moon className="w-2.5 h-2.5 text-white/70" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate">{th.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{th.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    <div className="flex -space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-black/40" 
                        style={{ backgroundColor: th.previewColors[1] }} 
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-black/40" 
                        style={{ backgroundColor: th.previewColors[2] }} 
                      />
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 px-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Instant color switch</span>
            <span className="font-mono text-[10px] text-violet-400">Synced to device</span>
          </div>
        </div>
      )}
    </div>
  );
};
