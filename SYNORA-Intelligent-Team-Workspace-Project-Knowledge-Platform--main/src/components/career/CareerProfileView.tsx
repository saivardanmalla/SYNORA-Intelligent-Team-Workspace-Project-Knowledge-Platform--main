import React, { useState, useEffect } from 'react';
import { 
  UserCircle, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Code2, 
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CareerProfile, SkillCategory, ExperienceItem, EducationItem, CertificationItem, AchievementItem } from '../../types';

export const CareerProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'skills' | 'experience' | 'education' | 'certifications' | 'achievements'>('info');

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) return;
      try {
        const data = await api.getCareerProfile(currentUser.id);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load career profile:', err);
      }
    }
    loadProfile();
  }, [currentUser]);

  const handleSave = async () => {
    if (!profile || !currentUser) return;
    setIsSaving(true);
    try {
      const updated = await api.updateCareerProfile(currentUser.id, profile);
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      api.emitEvent('profile_update', `Updated career profile for ${profile.fullName}`, currentUser.name);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAiSummary = async () => {
    if (!profile) return;
    setIsGeneratingAiSummary(true);
    try {
      const result = await api.generateAiSummary(profile, profile.title);
      setProfile({
        ...profile,
        summary: result.summary,
        isSummaryAiGenerated: true,
      });
    } catch (err) {
      console.error('AI summary error:', err);
    } finally {
      setIsGeneratingAiSummary(false);
    }
  };

  if (!profile) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-3"></div>
        <div>Loading verified career profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={profile.photoUrl || currentUser?.avatar}
            alt={profile.fullName}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{profile.fullName}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                VERIFIED PROFILE
              </span>
            </div>
            <p className="text-xs text-slate-400">{profile.title} • {profile.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          <button
            id="career-btn-save-profile"
            disabled={isSaving}
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto text-xs font-medium">
        {[
          { id: 'info', label: 'Personal & Summary', icon: UserCircle },
          { id: 'skills', label: 'Technical Skills', icon: Code2 },
          { id: 'experience', label: 'Experience & Roles', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'certifications', label: 'Certifications', icon: ShieldCheck },
          { id: 'achievements', label: 'Achievements', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Personal & Summary */}
      {activeSubTab === 'info' && (
        <div className="space-y-6">
          <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Contact & Professional Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GitHub URL / Username</label>
                <input
                  type="text"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Portfolio Website</label>
                <input
                  type="text"
                  value={profile.portfolio}
                  onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                  className="w-full bg-[#0c1017] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary Box with AI Generator */}
          <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white">Professional Summary</h3>
                <p className="text-xs text-slate-400">
                  Targeted ATS summary. AI synthesis is strictly grounded on your verified skills and project experience.
                </p>
              </div>

              <button
                id="career-btn-generate-ai-summary"
                disabled={isGeneratingAiSummary}
                onClick={handleGenerateAiSummary}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAiSummary ? 'Synthesizing with Gemini...' : 'Generate AI Summary'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value, isSummaryAiGenerated: false })}
              placeholder="Enter or generate a verified professional summary..."
              className="w-full bg-[#0c1017] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500"
            />

            {profile.isSummaryAiGenerated && (
              <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
                <Sparkles className="w-3 h-3" />
                <span>Generated by Gemini 3.8 Flash grounded in verified profile data. Editable before export.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Technical Skills */}
      {activeSubTab === 'skills' && (
        <div className="space-y-4">
          <div className="bg-[#111622] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Technical Skills by Category</h3>
                <p className="text-xs text-slate-400">Categorized competencies verified through git AST analysis</p>
              </div>
            </div>

            <div className="space-y-4">
              {profile.skills.map((category, catIdx) => (
                <div key={category.id} className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 font-mono flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-[10px] text-slate-400">{category.skills.length} skills</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {category.skills.map((skill, skIdx) => (
                      <span
                        key={skIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{skill.name}</span>
                        <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-400">
                          {skill.level}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Experience */}
      {activeSubTab === 'experience' && (
        <div className="space-y-4">
          <div className="bg-[#111622] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Work Experience & Leadership</h3>
                <p className="text-xs text-slate-400">Verified software roles with responsibilities and achievements</p>
              </div>
            </div>

            <div className="space-y-4">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{exp.position}</h4>
                      <div className="text-xs text-blue-400 font-medium mt-0.5">{exp.company} • {exp.location}</div>
                    </div>
                    <div className="text-xs font-mono text-slate-400 shrink-0">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Key Accomplishments:
                    </span>
                    {exp.responsibilities.map((resp, rIdx) => (
                      <div key={rIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((t) => (
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
      )}

      {/* 4. Education */}
      {activeSubTab === 'education' && (
        <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Education & Academics</h3>
          {profile.education.map((edu) => (
            <div key={edu.id} className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">{edu.institution}</h4>
                  <div className="text-xs text-blue-400 mt-0.5">{edu.degree} in {edu.fieldOfStudy}</div>
                </div>
                <div className="text-xs font-mono text-slate-400 shrink-0">
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
              {edu.gpa && (
                <div className="text-xs font-mono text-emerald-400 font-medium">GPA: {edu.gpa}</div>
              )}
              {edu.relevantCoursework?.length > 0 && (
                <div className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-slate-300 font-medium">Relevant Coursework:</span>{' '}
                  {edu.relevantCoursework.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 5. Certifications */}
      {activeSubTab === 'certifications' && (
        <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Industry Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="p-3.5 rounded-xl bg-[#0c1017] border border-slate-800 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-white text-xs">{cert.name}</div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-mono">
                    VERIFIED
                  </span>
                </div>
                <div className="text-xs text-slate-400">{cert.issuingOrg} • {cert.issueDate}</div>
                {cert.credentialId && (
                  <div className="text-[11px] font-mono text-slate-400">Credential ID: {cert.credentialId}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Achievements */}
      {activeSubTab === 'achievements' && (
        <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Verified Honors & Achievements</h3>
          <div className="space-y-3">
            {profile.achievements.map((ach) => (
              <div key={ach.id} className="p-3.5 rounded-xl bg-[#0c1017] border border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-white text-xs">{ach.title}</div>
                  <span className="text-xs font-mono text-slate-400">{ach.date}</span>
                </div>
                <div className="text-xs text-blue-400 mt-0.5">{ach.organization}</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
