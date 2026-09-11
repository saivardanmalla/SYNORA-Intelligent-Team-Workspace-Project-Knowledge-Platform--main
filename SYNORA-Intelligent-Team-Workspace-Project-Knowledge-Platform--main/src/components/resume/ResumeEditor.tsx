import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Sparkles, 
  Eye, 
  Settings2, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Check, 
  FolderGit2, 
  FileText, 
  Printer, 
  Layers,
  Wand2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ResumeData, ResumeTemplateType, Project } from '../../types';
import { ResumePreview } from './ResumePreview';
import { api } from '../../services/api';
import { JobMatchModal } from './JobMatchModal';

interface ResumeEditorProps {
  resume: ResumeData;
  onBack: () => void;
  onSave: (updated: ResumeData) => Promise<void>;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume: initialResume,
  onBack,
  onSave,
}) => {
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [showSynoraProjectsModal, setShowSynoraProjectsModal] = useState(false);
  const [synoraProjects, setSynoraProjects] = useState<Project[]>([]);
  const [isEnhancingBullet, setIsEnhancingBullet] = useState<string | null>(null);
  const [showJobMatchModal, setShowJobMatchModal] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');

  useEffect(() => {
    async function loadProjects() {
      try {
        const pList = await api.getProjects();
        setSynoraProjects(pList);
      } catch (e) {
        console.error(e);
      }
    }
    loadProjects();
  }, []);

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await onSave(resume);
      setSaveMessage('Saved successfully');
      setTimeout(() => setSaveMessage(null), 2500);
    } catch (err) {
      console.error(err);
      setSaveMessage('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  // Section toggle & reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...resume.sectionsOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setResume({ ...resume, sectionsOrder: newOrder });
  };

  const toggleSection = (key: keyof typeof resume.enabledSections) => {
    setResume({
      ...resume,
      enabledSections: {
        ...resume.enabledSections,
        [key]: !resume.enabledSections[key],
      },
    });
  };

  // Import Project from SYNORA
  const handleImportSynoraProject = (proj: Project) => {
    const newProjItem = {
      id: `proj_${Date.now()}`,
      name: proj.name,
      role: 'Full Stack Engineer',
      technologies: proj.technologies,
      githubUrl: proj.githubRepo ? proj.githubRepo.replace('https://', '') : undefined,
      bullets: [
        `Architected key modules for ${proj.name} utilizing ${proj.technologies.slice(0, 3).join(', ')}, delivering high test reliability.`,
        `Resolved high-priority issues and integrated real-time workflows, resulting in verified team sprint completion.`,
      ],
      isFromSynoraProject: true,
      synoraProjectId: proj.id,
    };

    setResume({
      ...resume,
      projects: [...resume.projects, newProjItem],
      enabledSections: { ...resume.enabledSections, projects: true },
    });
    setShowSynoraProjectsModal(false);
  };

  // AI Bullet point enhancer (Section 10: Make more technical, shorten, make ATS-friendly)
  const handleEnhanceBullet = async (
    projectId: string,
    bulletIndex: number,
    action: 'technical' | 'shorten' | 'ats'
  ) => {
    const proj = resume.projects.find((p) => p.id === projectId);
    if (!proj) return;
    const currentBullet = proj.bullets[bulletIndex];
    const key = `${projectId}-${bulletIndex}`;
    setIsEnhancingBullet(key);

    try {
      const refined = await api.refineBulletPoint(
        currentBullet,
        resume.targetRole,
        action,
        proj.technologies
      );
      const updatedProjects = resume.projects.map((p) => {
        if (p.id !== projectId) return p;
        const newBullets = [...p.bullets];
        newBullets[bulletIndex] = refined.refined;
        return { ...p, bullets: newBullets };
      });
      setResume({ ...resume, projects: updatedProjects });
    } catch (err) {
      console.error('Bullet refine error:', err);
    } finally {
      setIsEnhancingBullet(null);
    }
  };

  // Pre-download validation and export (Section 14)
  const handlePrintDownload = () => {
    // Check validation
    if (!resume.contact.fullName) {
      alert('Validation alert: Please enter a Full Name in Contact Information before exporting.');
      return;
    }
    if (resume.projects.length === 0 && resume.experience.length === 0) {
      const proceed = confirm('Your resume has no projects or experience listed. Export anyway?');
      if (!proceed) return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090d14] flex flex-col">
      {/* Top Editor Toolbar */}
      <div className="bg-[#111622] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={resume.title}
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                className="text-sm font-semibold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none px-1"
              />
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 font-mono">
                {resume.template.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 px-1 font-mono">
              ATS Score: <span className="text-emerald-400 font-semibold">{resume.atsScore}%</span> • Target: {resume.targetRole}
            </div>
          </div>
        </div>

        {/* Center: View Mode Toggle on smaller screens */}
        <div className="flex items-center bg-[#0c1017] p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('editor')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              viewMode === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`hidden md:block px-2.5 py-1 rounded font-medium transition-all ${
              viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs text-emerald-400 font-mono hidden sm:inline-block">
              {saveMessage}
            </span>
          )}

          <button
            onClick={() => setShowJobMatchModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Job Match</span>
          </button>

          <button
            id="editor-btn-save-resume"
            disabled={isSaving}
            onClick={handleManualSave}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            id="editor-btn-download-pdf"
            onClick={handlePrintDownload}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Editor Controls */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="w-full md:w-1/2 border-r border-slate-800 overflow-y-auto p-5 space-y-6 no-print">
            {/* Editor Subtabs: Content vs Design */}
            <div className="flex border-b border-slate-800 gap-2 pb-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume Content & Sections</span>
              </button>

              <button
                onClick={() => setActiveTab('design')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'design'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Template & Typography Styling</span>
              </button>
            </div>

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-6 text-xs">
                {/* Section Manager / Reordering */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">Section Ordering & Visibility</span>
                    <span className="text-[10px] text-slate-400">Toggle or move sections</span>
                  </div>

                  <div className="space-y-1.5">
                    {resume.sectionsOrder.map((secId, idx) => {
                      const isEnabled = (resume.enabledSections as any)[secId];
                      return (
                        <div
                          key={secId}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#0c1017] border border-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isEnabled ?? true}
                              onChange={() => toggleSection(secId as any)}
                              className="rounded border-slate-700 bg-slate-900 text-blue-600"
                            />
                            <span className="capitalize font-medium text-slate-200">{secId}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => moveSection(idx, 'up')}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === resume.sectionsOrder.length - 1}
                              onClick={() => moveSection(idx, 'down')}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 1. Contact Information */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-white">Header & Contact Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={resume.contact.fullName}
                        onChange={(e) =>
                          setResume({
                            ...resume,
                            contact: { ...resume.contact, fullName: e.target.value },
                          })
                        }
                        className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">Target Title</label>
                      <input
                        type="text"
                        value={resume.contact.targetTitle || ''}
                        onChange={(e) =>
                          setResume({
                            ...resume,
                            contact: { ...resume.contact, targetTitle: e.target.value },
                          })
                        }
                        className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">Email</label>
                      <input
                        type="text"
                        value={resume.contact.email}
                        onChange={(e) =>
                          setResume({
                            ...resume,
                            contact: { ...resume.contact, email: e.target.value },
                          })
                        }
                        className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">Phone</label>
                      <input
                        type="text"
                        value={resume.contact.phone}
                        onChange={(e) =>
                          setResume({
                            ...resume,
                            contact: { ...resume.contact, phone: e.target.value },
                          })
                        }
                        className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">Location</label>
                      <input
                        type="text"
                        value={resume.contact.location}
                        onChange={(e) =>
                          setResume({
                            ...resume,
                            contact: { ...resume.contact, location: e.target.value },
                          })
                        }
                        className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 mb-1 block">GitHub</label>
                      <input
                        type="text"
                        value={resume.contact.github || ''}
                        onChange={(e) =>
                          setResume({
                            ...resume,
                            contact: { ...resume.contact, github: e.target.value },
                          })
                        }
                        className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Professional Summary */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">Professional Summary</h4>
                    <span className="text-[10px] text-slate-400">Live preview sync</span>
                  </div>
                  <textarea
                    rows={4}
                    value={resume.summary}
                    onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                    className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-3 text-slate-200 leading-relaxed"
                  />
                </div>

                {/* 3. Technical Projects (with Add from SYNORA project button) */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Technical Projects</h4>
                      <p className="text-[11px] text-slate-400">Grounded in verified sprint deliverables</p>
                    </div>

                    <button
                      id="btn-open-synora-projects-modal"
                      onClick={() => setShowSynoraProjectsModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>Add from SYNORA Project</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resume.projects.map((proj, pIdx) => (
                      <div key={proj.id} className="p-3.5 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              const updated = [...resume.projects];
                              updated[pIdx].name = e.target.value;
                              setResume({ ...resume, projects: updated });
                            }}
                            className="font-semibold text-white bg-transparent border-b border-slate-800 hover:border-slate-700 focus:border-blue-500 text-xs px-1"
                          />
                          <button
                            onClick={() => {
                              const updated = resume.projects.filter((_, idx) => idx !== pIdx);
                              setResume({ ...resume, projects: updated });
                            }}
                            className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bullets with AI Enhancer buttons */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                            Accomplishment Bullets (AI Enhanced):
                          </span>

                          {proj.bullets.map((bullet, bIdx) => {
                            const isEnhancing = isEnhancingBullet === `${proj.id}-${bIdx}`;
                            return (
                              <div key={bIdx} className="space-y-1 bg-[#111622] p-2 rounded-lg border border-slate-800">
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => {
                                    const updated = [...resume.projects];
                                    updated[pIdx].bullets[bIdx] = e.target.value;
                                    setResume({ ...resume, projects: updated });
                                  }}
                                  className="w-full bg-transparent border-none text-slate-200 text-xs leading-relaxed focus:outline-none"
                                />

                                <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-slate-800/80 text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <span className="text-cyan-400 font-mono flex items-center gap-1">
                                      <Wand2 className="w-3 h-3" />
                                      AI Enhance:
                                    </span>
                                    <button
                                      disabled={isEnhancing}
                                      onClick={() => handleEnhanceBullet(proj.id, bIdx, 'technical')}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      More Technical
                                    </button>
                                    <button
                                      disabled={isEnhancing}
                                      onClick={() => handleEnhanceBullet(proj.id, bIdx, 'ats')}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      ATS Optimized
                                    </button>
                                    <button
                                      disabled={isEnhancing}
                                      onClick={() => handleEnhanceBullet(proj.id, bIdx, 'shorten')}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                      Shorten
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => {
                                      const updated = [...resume.projects];
                                      updated[pIdx].bullets = updated[pIdx].bullets.filter((_, idx) => idx !== bIdx);
                                      setResume({ ...resume, projects: updated });
                                    }}
                                    className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          <button
                            onClick={() => {
                              const updated = [...resume.projects];
                              updated[pIdx].bullets.push('Developed core feature with verified test coverage.');
                              setResume({ ...resume, projects: updated });
                            }}
                            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer pt-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Bullet</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DESIGN TAB: Template Selector & Style Controls */}
            {activeTab === 'design' && (
              <div className="space-y-6 text-xs">
                {/* 8 Template Choices (Section 7) */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-white">Select ATS Layout Template</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'ats_classic', label: 'ATS Classic', sub: 'Traditional High Parse Rate' },
                      { id: 'modern', label: 'Modern', sub: 'High Contrast Accents' },
                      { id: 'minimal', label: 'Minimal', sub: 'Generous Whitespace' },
                      { id: 'professional', label: 'Professional', sub: 'Executive Corporate' },
                      { id: 'developer', label: 'Developer', sub: 'Code & Git Prominent' },
                      { id: 'ai_ml', label: 'AI/ML', sub: 'Models & Research' },
                      { id: 'student', label: 'Student', sub: 'Education & Projects' },
                      { id: 'hackathon', label: 'Hackathon', sub: 'Rapid Prototypes & Wins' },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => setResume({ ...resume, template: tpl.id as ResumeTemplateType })}
                        className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                          resume.template === tpl.id
                            ? 'bg-blue-600/20 text-blue-300 border-blue-500 font-semibold'
                            : 'bg-[#0c1017] text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold">{tpl.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{tpl.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Customization (Section 8) */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white">Typography & Spacing Controls</h4>

                  <div>
                    <label className="text-slate-400 mb-1.5 block">Font Family</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['inter', 'serif', 'mono', 'sans'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setResume({ ...resume, fontFamily: f as any })}
                          className={`p-2 rounded text-center uppercase font-mono text-[10px] border cursor-pointer ${
                            resume.fontFamily === f
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-[#0c1017] text-slate-300 border-slate-800'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1.5 block">Font Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['compact', 'standard', 'spacious'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setResume({ ...resume, fontSize: s as any })}
                          className={`p-2 rounded text-center capitalize text-xs border cursor-pointer ${
                            resume.fontSize === s
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-[#0c1017] text-slate-300 border-slate-800'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1.5 block">Spacing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['tight', 'normal', 'relaxed'].map((sp) => (
                        <button
                          key={sp}
                          onClick={() => setResume({ ...resume, spacing: sp as any })}
                          className={`p-2 rounded text-center capitalize text-xs border cursor-pointer ${
                            resume.spacing === sp
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-[#0c1017] text-slate-300 border-slate-800'
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1.5 block">Margins</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['narrow', 'normal', 'wide'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setResume({ ...resume, margins: m as any })}
                          className={`p-2 rounded text-center capitalize text-xs border cursor-pointer ${
                            resume.margins === m
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-[#0c1017] text-slate-300 border-slate-800'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: Live Interactive Resume Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="w-full md:w-1/2 bg-[#1a202c] overflow-y-auto p-6 flex flex-col items-center">
            <div className="w-full max-w-[210mm] mb-2 flex items-center justify-between text-xs text-slate-400 no-print">
              <span>Live ATS Document Preview (A4 Dimensions)</span>
              <span className="font-mono">ATS Strict Compatibility</span>
            </div>
            <ResumePreview resume={resume} />
          </div>
        )}
      </div>

      {/* MODAL: Add from SYNORA Project */}
      {showSynoraProjectsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-slate-800 rounded-2xl w-full max-w-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Import from SYNORA Workspace</h3>
              </div>
              <button
                onClick={() => setShowSynoraProjectsModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select any project from your team dashboard to automatically generate verified accomplishment bullets.
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {synoraProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleImportSynoraProject(p)}
                  className="p-3 rounded-xl bg-[#0c1017] border border-slate-800 hover:border-blue-500 cursor-pointer transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {p.tasksCompletedCount} tasks
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.technologies.slice(0, 4).map((t) => (
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
      )}

      {/* MODAL: Job Match ATS Analyzer */}
      <JobMatchModal
        isOpen={showJobMatchModal}
        onClose={() => setShowJobMatchModal(false)}
        activeResume={resume}
        onApplySuggestions={(updated) => {
          setResume(updated);
          setShowJobMatchModal(false);
        }}
      />
    </div>
  );
};
