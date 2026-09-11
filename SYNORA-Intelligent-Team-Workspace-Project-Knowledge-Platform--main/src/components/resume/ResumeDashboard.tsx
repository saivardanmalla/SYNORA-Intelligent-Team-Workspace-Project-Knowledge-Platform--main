import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Download, 
  Edit3, 
  ExternalLink, 
  Printer, 
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ResumeData } from '../../types';
import { AiResumeGeneratorModal } from './AiResumeGeneratorModal';
import { JobMatchModal } from './JobMatchModal';

interface ResumeDashboardProps {
  onEditResume: (resume: ResumeData) => void;
  onPreviewResume: (resume: ResumeData) => void;
}

export const ResumeDashboard: React.FC<ResumeDashboardProps> = ({
  onEditResume,
  onPreviewResume,
}) => {
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showJobMatchModal, setShowJobMatchModal] = useState(false);
  const [selectedForJobMatch, setSelectedForJobMatch] = useState<ResumeData | null>(null);

  const loadResumes = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const list = await api.getResumes(currentUser.id);
      setResumes(list);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [currentUser]);

  const handleCreateNew = async () => {
    if (!currentUser) return;
    try {
      const profile = await api.getCareerProfile(currentUser.id);
      const newResumeData: Partial<ResumeData> = {
        userId: currentUser.id,
        title: 'Software Engineer Resume',
        targetRole: 'Software Engineer',
        template: 'ats_classic',
        atsScore: 88,
        fontFamily: 'inter',
        fontSize: 'standard',
        spacing: 'normal',
        margins: 'normal',
        showPageNumbers: true,
        sectionsOrder: ['contact', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements'],
        enabledSections: {
          contact: true,
          summary: true,
          skills: true,
          experience: true,
          projects: true,
          education: true,
          certifications: true,
          achievements: true,
          custom: false,
        },
        contact: {
          fullName: profile.fullName || currentUser.name,
          targetTitle: 'Software Engineer',
          email: profile.email || currentUser.email,
          phone: profile.phone || '',
          location: profile.location || '',
          github: profile.github || '',
          linkedin: profile.linkedin || '',
          portfolio: profile.portfolio || '',
        },
        summary: profile.summary || '',
        skills: profile.skills || [],
        experience: profile.experience || [],
        projects: [],
        education: profile.education || [],
        certifications: profile.certifications || [],
        achievements: profile.achievements || [],
        customSections: [],
      };

      const created = await api.createResume(newResumeData);
      setResumes((prev) => [created, ...prev]);
      onEditResume(created);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicate = async (resume: ResumeData) => {
    try {
      const duplicated = await api.duplicateResume(resume.id);
      setResumes((prev) => [duplicated, ...prev]);
    } catch (e) {
      console.error('Duplicate failed:', e);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Are you sure you want to delete this resume? This cannot be undone.');
    if (!ok) return;
    try {
      await api.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">ATS-Optimized Resumes</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Create role-specific resumes grounded in verified SYNORA deliverables. Test against any job description with real-time keyword match audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="dashboard-btn-job-match"
            onClick={() => {
              setSelectedForJobMatch(resumes[0] || null);
              setShowJobMatchModal(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Job Match</span>
          </button>

          <button
            id="dashboard-btn-generate-ai"
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>

          <button
            id="dashboard-btn-create-resume"
            onClick={handleCreateNew}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Resume</span>
          </button>
        </div>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <div className="text-xs">Loading resumes...</div>
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">No resumes created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Generate an ATS-ready resume in seconds using your verified GitHub commits and sprint tasks.
            </p>
          </div>
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate with AI</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-[#111622] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{resume.title}</h3>
                    <div className="text-xs text-blue-400 font-medium mt-0.5">{resume.targetRole}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {resume.template.replace('_', ' ')}
                  </span>
                </div>

                {/* ATS Score Meter */}
                <div className="mt-4 p-3 rounded-lg bg-[#0c1017] border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">ATS Audit Score</span>
                    <span className="font-bold text-emerald-400 font-mono">{resume.atsScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                      style={{ width: `${resume.atsScore}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                    <span>{resume.projects.length} Projects</span>
                    <span>{resume.experience.length} Roles</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditResume(resume)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onPreviewResume(resume)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all cursor-pointer"
                    title="Live Preview"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(resume)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
                    title="Duplicate Resume"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Generator Modal */}
      <AiResumeGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onCreated={(newResume) => {
          setResumes((prev) => [newResume, ...prev]);
          onEditResume(newResume);
        }}
      />

      {/* Job Match Modal */}
      <JobMatchModal
        isOpen={showJobMatchModal}
        onClose={() => setShowJobMatchModal(false)}
        activeResume={selectedForJobMatch || resumes[0] || null}
        onApplySuggestions={(updated) => {
          setResumes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          setShowJobMatchModal(false);
        }}
      />
    </div>
  );
};
