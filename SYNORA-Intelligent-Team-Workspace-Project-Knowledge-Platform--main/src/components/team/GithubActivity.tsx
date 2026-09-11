import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  GitCommit, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Plus, 
  ShieldCheck, 
  Filter, 
  Copy,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { GitHubContribution } from '../../types';

interface GithubActivityProps {
  onAddBulletToResume?: (bullet: string) => void;
}

export const GithubActivity: React.FC<GithubActivityProps> = ({ onAddBulletToResume }) => {
  const { currentUser } = useAuth();
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    async function loadGithubData() {
      try {
        const data = await api.getGithubContributions(currentUser?.id);
        setContributions(data);
      } catch (err) {
        console.error('Failed to load GitHub activity:', err);
      }
    }
    loadGithubData();
  }, [currentUser]);

  const handleCopyBullet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = filterType === 'all' 
    ? contributions 
    : contributions.filter((c) => c.type === filterType);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <Code2 className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">GitHub → Resume Intelligence</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            SYNORA analyzes verified code commits and merged PRs from your repositories to formulate ATS-standard accomplishment bullets backed by real git evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-400">Account:</span>
          <span className="text-emerald-400">{currentUser?.githubUsername || 'saivardan-dev'}</span>
        </div>
      </div>

      {/* Suggested Resume Contributions (Core Requirement from Section 18) */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Suggested Resume Contributions (AI Verified)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Extracted from high-impact PRs with verified technical depth and AST diff validation.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-mono ${filterType === 'all' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('pull_request')}
              className={`px-2.5 py-1 rounded-md font-mono ${filterType === 'pull_request' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-400'}`}
            >
              PRs
            </button>
            <button
              onClick={() => setFilterType('commit')}
              className={`px-2.5 py-1 rounded-md font-mono ${filterType === 'commit' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-400'}`}
            >
              Commits
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#0c1017] border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {item.repository}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                        item.type === 'pull_request'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800/40'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                      }`}
                    >
                      {item.type === 'pull_request' ? 'PULL REQUEST' : 'COMMIT'}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">+{item.linesAdded}</span>
                  <span className="text-[11px] font-mono text-rose-400 font-medium">-{item.linesRemoved}</span>
                  <a
                    href={item.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all ml-1"
                    title="View Evidence on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Verified AI Resume Bullet Card */}
              {item.suggestedBullet && (
                <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                        Synthesized ATS Bullet
                      </span>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans">
                        "{item.suggestedBullet}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyBullet(item.suggestedBullet!, item.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    {onAddBulletToResume && (
                      <button
                        onClick={() => onAddBulletToResume(item.suggestedBullet!)}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Resume</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Technologies Tagging */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-mono">AST Tags:</span>
                {item.technologies.map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
