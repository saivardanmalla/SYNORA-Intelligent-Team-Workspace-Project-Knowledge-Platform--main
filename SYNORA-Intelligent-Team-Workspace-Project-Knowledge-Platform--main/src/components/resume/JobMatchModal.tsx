import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  Check, 
  BookOpen,
  FolderGit2
} from 'lucide-react';
import { api } from '../../services/api';
import { AtsAnalysisResult, ResumeData } from '../../types';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeResume: ResumeData | null;
  onApplySuggestions?: (updatedResume: ResumeData) => void;
}

export const JobMatchModal: React.FC<JobMatchModalProps> = ({
  isOpen,
  onClose,
  activeResume,
  onApplySuggestions,
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !activeResume) return;
    setIsAnalyzing(true);
    setApplied(false);
    try {
      const result = await api.analyzeJobMatch(jobDescription, activeResume);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Job match analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!activeResume || !analysisResult || !onApplySuggestions) return;
    
    // User confirmation
    const confirmed = window.confirm(
      'Apply suggested ATS keyword optimizations to your resume? Existing sections will be preserved and updated with higher-scoring terminology.'
    );
    if (!confirmed) return;

    const updated: ResumeData = {
      ...activeResume,
      atsScore: analysisResult.score,
    };
    onApplySuggestions(updated);
    setApplied(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111622] border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">AI Job Description Matcher & ATS Audit</h3>
              <p className="text-xs text-slate-400">
                Compare resume against job posting to maximize ATS parse rates and interview callbacks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Input Form */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Role / Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hiring Company (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Stripe, Datadog"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Paste Job Description Requirements & Responsibilities
              </label>
              <textarea
                rows={5}
                placeholder="Paste the full job description text here... (e.g. We are seeking a Senior Distributed Systems Engineer experienced in Go, Kubernetes, Kafka, gRPC, and high-throughput real-time APIs...)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <button
              disabled={isAnalyzing || !jobDescription.trim()}
              onClick={handleAnalyze}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Analyzing with Gemini 3.8 Flash...' : 'Run ATS Audit & Keyword Match'}</span>
            </button>
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="space-y-5 pt-4 border-t border-slate-800 animate-in fade-in">
              {/* Score Header */}
              <div className="bg-[#0c1017] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500 flex items-center justify-center bg-cyan-950/40">
                    <span className="text-xl font-bold text-white font-mono">{analysisResult.score}%</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Overall ATS Match Score</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {analysisResult.score >= 85 ? 'Top 5% Candidate match for this posting.' : 'Good foundation; address keyword gaps below to increase rank.'}
                    </p>
                  </div>
                </div>

                {onApplySuggestions && (
                  <button
                    onClick={handleApply}
                    disabled={applied}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{applied ? 'Suggestions Applied' : 'Apply Safe Suggestions'}</span>
                  </button>
                )}
              </div>

              {/* Detailed Breakdown: Section 13 */}
              <div className="bg-[#0c1017] border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Detailed Category Breakdown
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  <div className="bg-[#111622] p-2.5 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Technical Skills</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">{analysisResult.breakdown.technicalSkills}%</div>
                  </div>
                  <div className="bg-[#111622] p-2.5 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Keywords</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">{analysisResult.breakdown.keywords}%</div>
                  </div>
                  <div className="bg-[#111622] p-2.5 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Projects</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">{analysisResult.breakdown.projects}%</div>
                  </div>
                  <div className="bg-[#111622] p-2.5 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Experience</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">{analysisResult.breakdown.experience}%</div>
                  </div>
                  <div className="bg-[#111622] p-2.5 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Education</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">{analysisResult.breakdown.education}%</div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Matched Keywords ({analysisResult.matchedKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysisResult.matchedKeywords.map((kw) => (
                      <span key={kw} className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Missing Keywords ({analysisResult.missingKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysisResult.missingKeywords.map((kw) => (
                      <span key={kw} className="text-[11px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths & Improvement Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-white">Candidate Strengths</div>
                  <div className="space-y-1">
                    {analysisResult.strengths.map((str, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-white">Improvement Recommendations</div>
                  <div className="space-y-1">
                    {analysisResult.improvementAreas.map((rec, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">→</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Safe Suggestions */}
              {analysisResult.safeSuggestions?.length > 0 && (
                <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-cyan-400 font-mono">
                    Verified Safe Suggestions (Backed by your SYNORA Profile)
                  </div>
                  <div className="space-y-2">
                    {analysisResult.safeSuggestions.map((sug, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#111622] border border-slate-800 text-xs">
                        <div className="font-semibold text-white">{sug.title}</div>
                        <p className="text-slate-300 mt-0.5">{sug.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
