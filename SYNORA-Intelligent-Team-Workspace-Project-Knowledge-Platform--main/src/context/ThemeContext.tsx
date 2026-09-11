import React, { createContext, useContext, useState, useEffect } from 'react';

export type UiTheme = 
  | 'violet-indigo' 
  | 'midnight-cobalt' 
  | 'cyber-emerald' 
  | 'solar-amber' 
  | 'obsidian-titanium' 
  | 'studio-light';

export interface ThemeConfig {
  id: UiTheme;
  name: string;
  category: 'dark' | 'light';
  description: string;
  previewColors: [string, string, string]; // [background, primaryAccent, secondaryAccent]
  classes: {
    bgApp: string;
    bgSidebar: string;
    bgHeader: string;
    bgCard: string;
    bgCardHover: string;
    borderSubtle: string;
    borderActive: string;
    primaryBtn: string;
    primaryBtnHover: string;
    accentText: string;
    accentGradient: string;
    activeNav: string;
    glowColor: string;
    ringColor: string;
  };
}

export const THEME_CONFIGS: Record<UiTheme, ThemeConfig> = {
  'violet-indigo': {
    id: 'violet-indigo',
    name: 'Electric Violet & Indigo',
    category: 'dark',
    description: 'Deep cosmic navy with radiant violet, electric indigo, and cyan neon highlights.',
    previewColors: ['#0c101d', '#8b5cf6', '#06b6d4'],
    classes: {
      bgApp: 'bg-[#0c101d]',
      bgSidebar: 'bg-[#101526]',
      bgHeader: 'bg-[#101526]/90',
      bgCard: 'bg-[#141b30]',
      bgCardHover: 'hover:bg-[#1a233e]',
      borderSubtle: 'border-violet-900/30',
      borderActive: 'border-violet-500/50',
      primaryBtn: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-violet-600/25',
      primaryBtnHover: 'hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400',
      accentText: 'text-violet-400',
      accentGradient: 'from-violet-400 via-indigo-400 to-cyan-400',
      activeNav: 'bg-violet-600/15 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/10',
      glowColor: 'shadow-violet-500/20',
      ringColor: 'focus:ring-violet-500',
    },
  },
  'midnight-cobalt': {
    id: 'midnight-cobalt',
    name: 'Midnight Sapphire',
    category: 'dark',
    description: 'Deep oceanic midnight canvas with vibrant sapphire blue and cobalt accents.',
    previewColors: ['#090e1a', '#2563eb', '#38bdf8'],
    classes: {
      bgApp: 'bg-[#090e1a]',
      bgSidebar: 'bg-[#0d1527]',
      bgHeader: 'bg-[#0d1527]/90',
      bgCard: 'bg-[#121c33]',
      bgCardHover: 'hover:bg-[#172442]',
      borderSubtle: 'border-blue-900/30',
      borderActive: 'border-blue-500/50',
      primaryBtn: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/25',
      primaryBtnHover: 'hover:from-blue-500 hover:to-cyan-500',
      accentText: 'text-blue-400',
      accentGradient: 'from-blue-400 to-cyan-400',
      activeNav: 'bg-blue-600/15 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10',
      glowColor: 'shadow-blue-500/20',
      ringColor: 'focus:ring-blue-500',
    },
  },
  'cyber-emerald': {
    id: 'cyber-emerald',
    name: 'Cyber Emerald & Mint',
    category: 'dark',
    description: 'High-tech graphite obsidian with glowing emerald, mint, and teal matrix vibes.',
    previewColors: ['#0a110f', '#10b981', '#2dd4bf'],
    classes: {
      bgApp: 'bg-[#09120e]',
      bgSidebar: 'bg-[#0c1813]',
      bgHeader: 'bg-[#0c1813]/90',
      bgCard: 'bg-[#10201a]',
      bgCardHover: 'hover:bg-[#152a22]',
      borderSubtle: 'border-emerald-900/30',
      borderActive: 'border-emerald-500/50',
      primaryBtn: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/25',
      primaryBtnHover: 'hover:from-emerald-500 hover:to-teal-400',
      accentText: 'text-emerald-400',
      accentGradient: 'from-emerald-400 via-teal-300 to-cyan-400',
      activeNav: 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10',
      glowColor: 'shadow-emerald-500/20',
      ringColor: 'focus:ring-emerald-500',
    },
  },
  'solar-amber': {
    id: 'solar-amber',
    name: 'Solar Amber & Crimson',
    category: 'dark',
    description: 'Warm charcoal dusk with radiant amber, tangerine, and rich crimson highlights.',
    previewColors: ['#130e0f', '#f59e0b', '#f43f5e'],
    classes: {
      bgApp: 'bg-[#120d0f]',
      bgSidebar: 'bg-[#181114]',
      bgHeader: 'bg-[#181114]/90',
      bgCard: 'bg-[#20171b]',
      bgCardHover: 'hover:bg-[#2a1e23]',
      borderSubtle: 'border-amber-900/30',
      borderActive: 'border-amber-500/50',
      primaryBtn: 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-lg shadow-amber-600/25',
      primaryBtnHover: 'hover:from-amber-500 hover:via-orange-500 hover:to-rose-500',
      accentText: 'text-amber-400',
      accentGradient: 'from-amber-400 via-orange-400 to-rose-400',
      activeNav: 'bg-amber-600/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10',
      glowColor: 'shadow-amber-500/20',
      ringColor: 'focus:ring-amber-500',
    },
  },
  'obsidian-titanium': {
    id: 'obsidian-titanium',
    name: 'Obsidian Titanium',
    category: 'dark',
    description: 'Ultra-modern stealth aesthetic with pure slate monochrome contrast and cool silver accents.',
    previewColors: ['#09090b', '#e4e4e7', '#71717a'],
    classes: {
      bgApp: 'bg-[#09090b]',
      bgSidebar: 'bg-[#101014]',
      bgHeader: 'bg-[#101014]/90',
      bgCard: 'bg-[#18181b]',
      bgCardHover: 'hover:bg-[#202024]',
      borderSubtle: 'border-zinc-800',
      borderActive: 'border-zinc-500',
      primaryBtn: 'bg-zinc-100 hover:bg-white text-zinc-900 font-semibold shadow-lg shadow-white/10',
      primaryBtnHover: 'hover:bg-white hover:text-black',
      accentText: 'text-zinc-200',
      accentGradient: 'from-zinc-100 via-zinc-300 to-zinc-400',
      activeNav: 'bg-zinc-800 text-zinc-100 border border-zinc-700',
      glowColor: 'shadow-zinc-500/20',
      ringColor: 'focus:ring-zinc-400',
    },
  },
  'studio-light': {
    id: 'studio-light',
    name: 'Studio Clean Light',
    category: 'light',
    description: 'Refined, crisp light canvas with high-contrast slate typography and rich indigo accents.',
    previewColors: ['#f8fafc', '#4f46e5', '#0ea5e9'],
    classes: {
      bgApp: 'bg-[#f8fafc]',
      bgSidebar: 'bg-[#ffffff]',
      bgHeader: 'bg-[#ffffff]/90',
      bgCard: 'bg-[#ffffff]',
      bgCardHover: 'hover:bg-[#f1f5f9]',
      borderSubtle: 'border-slate-200',
      borderActive: 'border-indigo-400',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20',
      primaryBtnHover: 'hover:bg-indigo-700',
      accentText: 'text-indigo-600',
      accentGradient: 'from-indigo-600 via-violet-600 to-blue-600',
      activeNav: 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm',
      glowColor: 'shadow-indigo-500/15',
      ringColor: 'focus:ring-indigo-500',
    },
  },
};

interface ThemeContextType {
  currentTheme: UiTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: UiTheme) => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<UiTheme>(() => {
    const saved = localStorage.getItem('synora_ui_theme') as UiTheme;
    return saved && THEME_CONFIGS[saved] ? saved : 'violet-indigo';
  });

  useEffect(() => {
    localStorage.setItem('synora_ui_theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (THEME_CONFIGS[currentTheme].category === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }, [currentTheme]);

  const themeConfig = THEME_CONFIGS[currentTheme];
  const isLight = themeConfig.category === 'light';

  return (
    <ThemeContext.Provider value={{ currentTheme, themeConfig, setTheme: setCurrentTheme, isLight }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
