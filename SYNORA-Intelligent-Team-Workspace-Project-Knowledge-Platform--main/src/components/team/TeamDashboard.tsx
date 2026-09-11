import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  GitCommit, 
  GitPullRequest, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Users, 
  Zap, 
  ArrowUpRight,
  Clock,
  ChevronRight,
  Briefcase,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { Project, Task, RealtimeMetricEvent } from '../../types';

interface TeamDashboardProps {
  onNavigateToResume: () => void;
  onNavigateToProjects: () => void;
  onNavigateToCareerInsights: () => void;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({
  onNavigateToResume,
  onNavigateToProjects,
  onNavigateToCareerInsights,
}) => {
  const { currentUser, users } = useAuth();
  const { themeConfig, isLight } = useTheme();
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentEvents, setRecentEvents] = useState<RealtimeMetricEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [anData, projData] = await Promise.all([
          api.getRealtimeAnalytics(),
          api.getProjects(),
        ]);
        setAnalytics(anData.metrics);
        setRecentEvents(anData.recentEvents);
        setProjects(projData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadDashboardData();

    // Periodic real-time poll to update telemetry
    const interval = setInterval(async () => {
      try {
        const anData = await api.getRealtimeAnalytics();
        setAnalytics(anData.metrics);
        setRecentEvents(anData.recentEvents);
      } catch (e) {
        // silent
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateEvent = async (type: string) => {
    setIsSimulating(true);
    let msg = '';
    if (type === 'commit') {
      msg = `pushed commit "feat(gemini): ground ATS project bullets in AST git diff" to synora-core`;
    } else if (type === 'pr') {
      msg = `merged PR #148 "perf: optimize memory footprint for multi-page resume rendering"`;
    } else {
      msg = `re-analyzed resume ATS score: Software Engineer score increased to 96%`;
    }

    try {
      const newEvt = await api.emitEvent(type, msg, currentUser?.name || 'Developer');
      setRecentEvents((prev) => [newEvt, ...prev.slice(0, 9)]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Real-time Hero Banner */}
      <div className={`relative overflow-hidden rounded-2xl ${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} p-6 shadow-xl`}>
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${themeConfig.classes.borderSubtle} ${themeConfig.classes.activeNav}`}>
              <Zap className={`w-3.5 h-3.5 ${themeConfig.classes.accentText}`} />
              <span>SYNORA Real-Time Team Operating System</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h2 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Welcome back, {currentUser?.name}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Active role: <span className={`${themeConfig.classes.accentText} font-semibold`}>{currentUser?.role}</span> in {currentUser?.department}.
              All commits and sprint tasks are automatically indexed to power your verified ATS resume and portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="dashboard-btn-simulate-commit"
              disabled={isSimulating}
              onClick={() => handleSimulateEvent('commit')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <GitCommit className="w-4 h-4 text-emerald-400" />
              <span>Simulate Commit</span>
            </button>

            <button
              id="dashboard-btn-simulate-pr"
              disabled={isSimulating}
              onClick={() => handleSimulateEvent('pr')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <GitPullRequest className="w-4 h-4 text-purple-400" />
              <span>Simulate PR Merge</span>
            </button>

            <button
              id="dashboard-btn-view-resumes"
              onClick={onNavigateToResume}
              className={`px-4 py-2 rounded-xl ${themeConfig.classes.primaryBtn} ${themeConfig.classes.primaryBtnHover} text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer`}
            >
              <FileText className="w-4 h-4" />
              <span>Open AI Resume Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Sprint Velocity */}
        <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-4 relative overflow-hidden shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Team Sprint Velocity</span>
            <span className={`p-2 rounded-lg ${themeConfig.classes.activeNav}`}>
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{analytics?.teamVelocity || '48.2 pts'}</span>
            <span className="text-[11px] text-emerald-400 font-medium">+14% vs Sprint 23</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/70 h-1.5 rounded-full overflow-hidden">
            <div className="bg-violet-500 h-full rounded-full" style={{ width: '84%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Sprint Goal: 55 pts</span>
            <span>84% achieved</span>
          </div>
        </div>

        {/* Metric 2: Sprint Completion Rate */}
        <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-4 relative overflow-hidden shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Task Completion Rate</span>
            <span className="p-2 rounded-lg bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{analytics?.sprintCompletionRate || 88}%</span>
            <span className="text-[11px] text-emerald-400 font-medium">On Track</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/70 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analytics?.sprintCompletionRate || 88}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>42 of 48 Tasks Complete</span>
            <span>6 in review</span>
          </div>
        </div>

        {/* Metric 3: Average Resume ATS Score */}
        <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-4 relative overflow-hidden shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Resume ATS Score</span>
            <span className={`p-2 rounded-lg ${themeConfig.classes.activeNav}`}>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{analytics?.averageAtsScore || 94}%</span>
            <span className="text-[11px] text-cyan-400 font-medium">94/100 Top Tier</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/70 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: '94%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>OCR Strict Compliance</span>
            <span>Verified Grounding</span>
          </div>
        </div>

        {/* Metric 4: Live Contributors */}
        <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-4 relative overflow-hidden shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Contributors</span>
            <span className="p-2 rounded-lg bg-purple-950/70 text-purple-400 border border-purple-800/40">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{users.length} Engineers</span>
            <span className="text-[11px] text-purple-400 font-medium">100% Online</span>
          </div>
          <div className="mt-3 flex -space-x-1.5 overflow-hidden">
            {users.map((u) => (
              <img
                key={u.id}
                src={u.avatar}
                alt={u.name}
                title={`${u.name} (${u.role})`}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-violet-950/50 object-cover"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Zero-Trust Scopes</span>
            <span>RBAC Active</span>
          </div>
        </div>
      </div>

      {/* Section 24 Requirement: Career Profile Summary Cards on Team Dashboard */}
      <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-5 shadow-sm`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${themeConfig.classes.borderSubtle}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Your SYNORA Career & Verification Snapshot</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium">
                Connected to {currentUser?.email}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              SYNORA continuously translates your team tasks, git commits, and code reviews into verified resume achievements.
            </p>
          </div>
          <button
            id="dashboard-btn-career-insights"
            onClick={onNavigateToCareerInsights}
            className={`text-xs ${themeConfig.classes.accentText} hover:opacity-80 font-medium flex items-center gap-1 shrink-0 cursor-pointer`}
          >
            <span>Full Career Readiness Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Career Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          <div className={`p-3 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/50'}`}>
            <div className="text-[11px] text-slate-400">Resume Score</div>
            <div className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>94%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">ATS Optimized</div>
          </div>
          <div className={`p-3 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/50'}`}>
            <div className="text-[11px] text-slate-400">Career Readiness</div>
            <div className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>88%</div>
            <div className={`text-[10px] ${themeConfig.classes.accentText} mt-0.5`}>Target: Lead Eng</div>
          </div>
          <div className={`p-3 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/50'}`}>
            <div className="text-[11px] text-slate-400">Projects Tracked</div>
            <div className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{projects.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verified in Git</div>
          </div>
          <div className={`p-3 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/50'}`}>
            <div className="text-[11px] text-slate-400">Verified Skills</div>
            <div className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>26</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Validated by AST</div>
          </div>
          <div className={`p-3 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/50'}`}>
            <div className="text-[11px] text-slate-400">Certifications</div>
            <div className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>3</div>
            <div className="text-[10px] text-purple-400 mt-0.5">GCP / AWS / GenAI</div>
          </div>
          <div className={`p-3 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/50'}`}>
            <div className="text-[11px] text-slate-400">GitHub Evidences</div>
            <div className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>142</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">PRs & Commits</div>
          </div>
        </div>

        {/* AI Career Suggestions Card */}
        <div className={`mt-4 p-3.5 rounded-lg border ${themeConfig.classes.borderSubtle} ${themeConfig.classes.activeNav} flex flex-col md:flex-row md:items-center justify-between gap-3`}>
          <div className="flex items-start gap-2.5">
            <Sparkles className={`w-4 h-4 ${themeConfig.classes.accentText} shrink-0 mt-0.5`} />
            <div>
              <div className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>AI Career Suggestion</div>
              <p className="text-xs text-slate-300 mt-0.5">
                Your latest work on <span className={`${themeConfig.classes.accentText} font-medium`}>Cloud Mesh Zero-Trust Auth</span> is ready to export as an ATS bullet with verified AST metrics.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToResume}
            className={`px-3 py-1.5 rounded-lg ${themeConfig.classes.primaryBtn} ${themeConfig.classes.primaryBtnHover} text-white text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all cursor-pointer`}
          >
            <span>Add to Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Projects Status & Live Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Projects Health & Workloads */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Active Projects Health</h3>
                <p className="text-xs text-slate-400">Deliverables tied to developer career portfolios</p>
              </div>
              <button
                onClick={onNavigateToProjects}
                className={`text-xs ${themeConfig.classes.accentText} hover:opacity-80 font-medium flex items-center gap-1 cursor-pointer`}
              >
                <span>View All Tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => {
                const percent = Math.round((proj.tasksCompletedCount / proj.totalTasksCount) * 100);
                return (
                  <div key={proj.id} className={`p-3.5 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-900/40 hover:bg-slate-900/70'} transition-all`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{proj.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
                            {proj.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-sm font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{percent}%</span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {proj.tasksCompletedCount}/{proj.totalTasksCount} tasks
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-slate-800/70 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percent === 100 ? 'bg-emerald-500' : percent > 80 ? 'bg-violet-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    {/* Tech tags */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                      {proj.technologies.slice(0, 5).map((tech) => (
                        <span key={tech} className={`text-[10px] px-2 py-0.5 rounded ${isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800/80 text-slate-300'}`}>
                          {tech}
                        </span>
                      ))}
                      {proj.technologies.length > 5 && (
                        <span className="text-[10px] text-slate-400">+{proj.technologies.length - 5} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Workload Distribution */}
          <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-5 shadow-sm`}>
            <h3 className={`text-sm font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Team Member Workloads & Role Capacity</h3>
            <p className="text-xs text-slate-400 mb-4">Real-time task distribution balancing developer sprints</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.map((u) => (
                <div key={u.id} className={`p-3 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/40'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-violet-500/30" />
                    <div>
                      <div className={`text-xs font-semibold leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{u.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{u.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">Active</span>
                    <div className="text-[10px] text-slate-400 font-mono">100% SLA</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Real-Time Event Stream */}
        <div className="space-y-4">
          <div className={`${themeConfig.classes.bgCard} border ${themeConfig.classes.borderSubtle} rounded-xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Live Telemetry Stream</h3>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'}`}>
                REALTIME
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Git pushes, PR reviews, task completions, and ATS optimization events in real time.
            </p>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {recentEvents.map((evt) => (
                <div key={evt.id} className={`p-2.5 rounded-lg border ${themeConfig.classes.borderSubtle} ${isLight ? 'bg-slate-50' : 'bg-slate-900/40'} text-xs`}>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span className={`${themeConfig.classes.accentText} font-medium`}>{evt.actor}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                  <p className={`${isLight ? 'text-slate-700' : 'text-slate-200'} leading-snug`}>{evt.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Verification Shield Box */}
          <div className={`p-4 rounded-xl border ${themeConfig.classes.borderSubtle} ${themeConfig.classes.activeNav} text-xs shadow-sm`}>
            <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Hallucination Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              SYNORA checks every AI-generated resume bullet against the candidate’s verified GitHub AST and sprint logs before allowing it into export.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
