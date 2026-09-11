import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Users2, 
  GitPullRequest, 
  UserCircle, 
  FileText, 
  Globe, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown,
  LogOut,
  Radio,
  Briefcase,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEME_CONFIGS, UiTheme } from '../context/ThemeContext';
import { UserRole } from '../types';

export type ActiveTab = 
  | 'team-dashboard' 
  | 'projects' 
  | 'team-roles' 
  | 'github' 
  | 'career-profile' 
  | 'resume-builder' 
  | 'portfolio' 
  | 'career-insights';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAiGenerator?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab, onOpenAiGenerator }) => {
  const { currentUser, users, switchUser, updateRole } = useAuth();
  const { themeConfig, currentTheme, setTheme, isLight } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'Lead Engineer':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'Senior Developer':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'Contributor':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Intern':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <aside className={`w-64 ${themeConfig.classes.bgSidebar} border-r ${themeConfig.classes.borderSubtle} flex flex-col justify-between h-screen shrink-0 sticky top-0 z-40 no-print select-none transition-colors duration-200`}>
      {/* Brand Header */}
      <div className={`p-4 border-b ${themeConfig.classes.borderSubtle}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-violet-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-semibold tracking-tight text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>SYNORA</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${themeConfig.classes.borderSubtle} ${themeConfig.classes.accentText}`}>OS</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-none mt-0.5">Team OS & Career Intel</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* WORKSPACE SECTION */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Workspace</span>
            <span className={`text-[9px] font-mono px-1 rounded ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'}`}>TEAM</span>
          </div>
          <nav className="space-y-1">
            <button
              id="nav-team-dashboard"
              onClick={() => onSelectTab('team-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'team-dashboard'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Team Dashboard</span>
            </button>

            <button
              id="nav-projects"
              onClick={() => onSelectTab('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Projects & Tasks</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">4</span>
              </div>
            </button>

            <button
              id="nav-team-roles"
              onClick={() => onSelectTab('team-roles')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'team-roles'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Users2 className="w-4 h-4" />
              <span>Team & Roles</span>
            </button>

            <button
              id="nav-github"
              onClick={() => onSelectTab('github')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'github'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
              <div className="flex-1 text-left flex items-center justify-between">
                <span>GitHub Intel</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">Verified</span>
              </div>
            </button>
          </nav>
        </div>

        {/* PERSONAL SECTION */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Personal</span>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-1 rounded">CAREER</span>
          </div>
          <nav className="space-y-1">
            <button
              id="nav-career-profile"
              onClick={() => onSelectTab('career-profile')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'career-profile'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              id="nav-resume-builder"
              onClick={() => onSelectTab('resume-builder')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'resume-builder'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4" />
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Resume Builder</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${themeConfig.classes.borderSubtle} ${themeConfig.classes.accentText}`}>AI ATS</span>
              </div>
            </button>

            <button
              id="nav-portfolio"
              onClick={() => onSelectTab('portfolio')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'portfolio'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>My Portfolio</span>
            </button>

            <button
              id="nav-career-insights"
              onClick={() => onSelectTab('career-insights')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'career-insights'
                  ? themeConfig.classes.activeNav
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <div className="flex-1 text-left flex items-center justify-between">
                <span>Career Insights</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">91%</span>
              </div>
            </button>
          </nav>
        </div>

        {/* AI Action Card */}
        <div className={`p-3 rounded-xl ${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} shadow-sm`}>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className={`w-4 h-4 ${themeConfig.classes.accentText}`} />
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>SYNORA AI Pipeline</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Compile verified GitHub commits and sprint tasks into ATS-optimized bullets.
          </p>
          <button
            id="nav-btn-generate-ai-resume"
            onClick={onOpenAiGenerator}
            className={`w-full py-1.5 px-2.5 rounded-lg ${themeConfig.classes.primaryBtn} ${themeConfig.classes.primaryBtnHover} text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>
        </div>

        {/* Quick UI Color Theme Palette Switcher */}
        <div className={`p-2.5 rounded-xl ${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
              <Palette className="w-3.5 h-3.5 text-violet-400" />
              <span>UI Theme Color</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Quick Pick</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {(Object.keys(THEME_CONFIGS) as UiTheme[]).map((key) => {
              const th = THEME_CONFIGS[key];
              const isSelected = currentTheme === key;
              return (
                <button
                  key={key}
                  title={th.name}
                  onClick={() => setTheme(key)}
                  className={`h-6 rounded-lg relative transition-all cursor-pointer flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-white scale-105 shadow-md' : 'opacity-65 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${th.previewColors[1]}, ${th.previewColors[2]})`,
                  }}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400 truncate text-center">
            {themeConfig.name}
          </div>
        </div>
      </div>

      {/* User Profile & Role Switcher */}
      <div className={`p-3 border-t ${themeConfig.classes.borderSubtle} relative`}>
        <button
          id="nav-user-profile-menu-button"
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800/50 transition-all text-left cursor-pointer`}
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-full object-cover border border-violet-500/30 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentUser?.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getRoleBadgeColor(currentUser?.role)}`}>
                {currentUser?.role}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Dropdown for Role & User Switching */}
        {showUserMenu && (
          <div className="absolute bottom-16 left-3 right-3 bg-[#131722] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Switch Active User & Role
            </div>
            <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setShowUserMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all ${
                    currentUser?.id === u.id
                      ? 'bg-violet-600/20 text-violet-300 font-medium border border-violet-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.role}</div>
                  </div>
                  {currentUser?.id === u.id && (
                    <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 mt-1 border-t border-slate-800 text-[11px] text-slate-400 px-2 flex items-center justify-between">
              <span>{currentUser?.department}</span>
              <span className="text-emerald-400 font-mono">Isolated Scope</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
