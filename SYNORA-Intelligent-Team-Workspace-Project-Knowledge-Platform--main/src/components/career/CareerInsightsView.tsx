import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  DollarSign, 
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SkillGapAnalysis } from '../../types';

interface CareerInsightsViewProps {
  onApplyToResume?: () => void;
}

const TARGET_ROLES = [
  'Senior Full Stack Engineer',
  'Lead Distributed Systems Engineer',
  'AI / ML Systems Engineer',
  'DevOps & Cloud Platform Architect',
  'Frontend Principal Engineer',
];

export const CareerInsightsView: React.FC<CareerInsightsViewProps> = ({ onApplyToResume }) => {
  const { currentUser } = useAuth();
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const [insights, setInsights] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const loadInsights = async (role: string) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.getCareerInsights(currentUser.id, role);
      setInsights(data);
    } catch (err) {
      console.error('Failed to load career insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights(targetRole);
  }, [currentUser, targetRole]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">AI Career Insights & Skill Gap Analysis</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            SYNORA analyzes market hiring bars against your verified GitHub commits, projects, and skills to provide strategic promotion and hiring pathways.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-mono">Target Benchmark:</span>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-[#0c1017] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
          >
            {TARGET_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading || !insights ? (
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
          <div className="text-xs font-mono">Evaluating career readiness against market benchmarks...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Readiness Score Card */}
          <div className="bg-[#111622] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-950 to-blue-950 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <span className="text-3xl font-black text-white font-mono">{insights.readinessScore}%</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Career Readiness Rating</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      HIGH POTENTIAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    You match <span className="text-emerald-400 font-semibold">{insights.readinessScore}%</span> of the core technical requirements for <span className="text-blue-400 font-semibold">{targetRole}</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono text-xs hidden sm:block">
                  <div className="text-slate-400">Market Target Comp</div>
                  <div className="text-emerald-400 font-bold">$165,000 – $210,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Gap Analysis (Strong vs Learning vs Missing) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Matched Skills */}
            <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths & Matched Skills ({insights.strong.length})</span>
              </div>
              <p className="text-xs text-slate-400">
                Skills proven through completed sprint deliverables and git code repositories.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {insights.strong.map((sk) => (
                  <span
                    key={sk}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-mono"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Skill Gaps to Close ({insights.missing.length})</span>
              </div>
              <p className="text-xs text-slate-400">
                Key technologies commonly required in candidate screening for this title.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {insights.missing.map((sk) => (
                  <span
                    key={sk}
                    className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/40 font-mono"
                  >
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Roadmap (Section 21) */}
          <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Targeted Learning Roadmap</h3>
            </div>
            <p className="text-xs text-slate-400">
              Actionable sequence to close skill gaps and qualify for high-tier engineering bands.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.learningRoadmap.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2 text-xs relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      PHASE {idx + 1} • {step.timeline}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm mt-1">{step.milestone}</h4>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {step.topics.map((t) => (
                      <span key={t} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">Recommended Projects:</div>
                    <div className="text-cyan-400 font-medium">{step.recommendedProjects.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">AI Career Next Steps & Recommendations</h3>
            </div>
            <div className="space-y-1.5">
              {insights.recommendations.map((rec, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-blue-400 font-bold">→</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
