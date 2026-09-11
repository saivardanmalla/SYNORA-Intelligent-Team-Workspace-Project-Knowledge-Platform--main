import React from 'react';
import { 
  Sparkles, 
  Shield, 
  Activity, 
  Bell, 
  Plus, 
  Search,
  ExternalLink,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import { ActiveTab } from './Navigation';

interface HeaderProps {
  activeTab: ActiveTab;
  onCreateResume?: () => void;
  onOpenAiGenerator?: () => void;
  onOpenJobMatch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onCreateResume, 
  onOpenAiGenerator,
  onOpenJobMatch 
}) => {
  const { currentUser } = useAuth();
  const { themeConfig, isLight } = useTheme();

  const getTitle = () => {
    switch (activeTab) {
      case 'team-dashboard':
        return {
          heading: 'Team Dashboard & Real-Time Analytics',
          sub: 'Live sprint telemetry, developer workloads, and cross-functional team velocity.',
        };
      case 'projects':
        return {
          heading: 'Projects & Tasks Intelligence',
          sub: 'Track deliverables, verify user contributions, and export accomplishments to resumes.',
        };
      case 'team-roles':
        return {
          heading: 'Team Members & Role-Based Access Control (RBAC)',
          sub: 'Manage engineering roles, task assignment permissions, and data scopes.',
        };
      case 'github':
        return {
          heading: 'GitHub Activity & Verified Contributions',
          sub: 'Real-time commit trees, merged pull requests, and verified evidence logs.',
        };
      case 'career-profile':
        return {
          heading: 'Centralized Career Profile',
          sub: 'Single source of truth for skills, education, experience, and verified project outcomes.',
        };
      case 'resume-builder':
        return {
          heading: 'AI Resume Builder',
          sub: 'Build a professional, ATS-friendly resume from your verified SYNORA career profile.',
        };
      case 'portfolio':
        return {
          heading: 'My Developer Portfolio',
          sub: 'Publicly shareable profile showcasing verified SYNORA projects, skills, and credentials.',
        };
      case 'career-insights':
        return {
          heading: 'AI Career Insights & Skill Gap Analysis',
          sub: 'AI-driven readiness metrics, ATS keyword matching, and personalized learning roadmaps.',
        };
      default:
        return { heading: 'SYNORA Team OS', sub: 'Operating System for engineering teams' };
    }
  };

  const { heading, sub } = getTitle();

  return (
    <header className={`${themeConfig.classes.bgHeader} backdrop-blur border-b ${themeConfig.classes.borderSubtle} px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 no-print transition-colors duration-200`}>
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2.5">
          <h1 className={`text-lg font-semibold tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{heading}</h1>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900/90 text-slate-300'}`}>
            {activeTab.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">{sub}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Real-time telemetry ticker */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-slate-400">Live Telemetry:</span>
          <span className="font-mono text-emerald-400 font-medium">48.2 pts/sprint</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">ATS Accuracy:</span>
          <span className={`font-mono font-medium ${themeConfig.classes.accentText}`}>94%</span>
        </div>

        {/* Dynamic UI Theme & Color Selector */}
        <ThemeSelector />

        {/* Action buttons depending on context */}
        {(activeTab === 'resume-builder' || activeTab === 'career-profile') && (
          <div className="flex items-center gap-2">
            <button
              id="header-btn-job-match"
              onClick={onOpenJobMatch}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Job Match</span>
            </button>

            <button
              id="header-btn-generate-ai"
              onClick={onOpenAiGenerator}
              className={`px-3 py-1.5 rounded-lg ${themeConfig.classes.primaryBtn} ${themeConfig.classes.primaryBtnHover} text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate with AI</span>
            </button>

            <button
              id="header-btn-create-resume"
              onClick={onCreateResume}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Resume</span>
            </button>
          </div>
        )}

        {/* Current user role badge */}
        <div className={`flex items-center gap-2 pl-2 border-l ${themeConfig.classes.borderSubtle}`}>
          <div className="text-right hidden sm:block">
            <div className={`text-xs font-semibold leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentUser?.name}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{currentUser?.role}</div>
          </div>
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full object-cover border border-violet-500/30 ring-1 ring-violet-500/20"
          />
        </div>
      </div>
    </header>
  );
};
