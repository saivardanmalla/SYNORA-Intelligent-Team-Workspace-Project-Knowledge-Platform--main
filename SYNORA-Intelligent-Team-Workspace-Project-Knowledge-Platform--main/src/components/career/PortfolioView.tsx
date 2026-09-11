import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Github, 
  Linkedin, 
  Mail, 
  ShieldCheck, 
  FileCode2, 
  CheckCircle2, 
  Share2,
  Lock,
  Unlock,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CareerProfile, Project } from '../../types';

interface PortfolioViewProps {
  onOpenResumeBuilder: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onOpenResumeBuilder }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const [prof, projList] = await Promise.all([
          api.getCareerProfile(currentUser.id),
          api.getProjects(),
        ]);
        setProfile(prof);
        setProjects(projList);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [currentUser]);

  const shareableUrl = `https://synora.ai/p/${currentUser?.githubUsername || 'developer'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!profile) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-3"></div>
        <div>Loading verified developer portfolio...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Portfolio Control Bar */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
              <Globe className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">Live Public Developer Portfolio</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            A verified engineering showcase linking recruiters and hiring managers directly to your code evidence and AST metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              isPublic
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isPublic ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isPublic ? 'Public Showcase' : 'Private'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* Live Showcase Preview Box */}
      <div className="bg-[#0b0e14] border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Profile Bio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <img
              src={profile.photoUrl || currentUser?.avatar}
              alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{profile.fullName}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  VERIFIED DEV
                </span>
              </div>
              <p className="text-sm text-blue-400 font-medium mt-0.5">{profile.title}</p>
              <p className="text-xs text-slate-400 mt-1">{profile.location}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-800 transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-800 transition-all"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
            )}
            <button
              onClick={onOpenResumeBuilder}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Resume</span>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            About & Technical Focus
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            {profile.summary}
          </p>
        </div>

        {/* Technical Competencies */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Verified Stack & Technical Proficiencies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.skills.map((cat) => (
              <div key={cat.id} className="p-3.5 rounded-xl bg-[#111622] border border-slate-800 space-y-1.5">
                <div className="text-xs font-semibold text-white">{cat.name}</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono border border-slate-700/60"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects with Git Evidence */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Featured Verified Engineering Projects
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Backed by Git AST Evidence
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-xl bg-[#111622] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                    {proj.githubRepo && (
                      <a
                        href={proj.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white p-1"
                        title="View Source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                  <div className="mt-2 text-xs text-emerald-400 font-medium bg-emerald-950/20 p-2 rounded border border-emerald-800/30">
                    Impact: {proj.verifiedImpact}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                  {proj.technologies.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
