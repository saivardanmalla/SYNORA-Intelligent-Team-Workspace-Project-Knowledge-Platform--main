import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navigation, ActiveTab } from './components/Navigation';
import { Header } from './components/Header';
import { TeamDashboard } from './components/team/TeamDashboard';
import { ProjectsList } from './components/team/ProjectsList';
import { TeamMembers } from './components/team/TeamMembers';
import { GithubActivity } from './components/team/GithubActivity';
import { CareerProfileView } from './components/career/CareerProfileView';
import { ResumeDashboard } from './components/resume/ResumeDashboard';
import { ResumeEditor } from './components/resume/ResumeEditor';
import { ResumePreview } from './components/resume/ResumePreview';
import { PortfolioView } from './components/career/PortfolioView';
import { CareerInsightsView } from './components/career/CareerInsightsView';
import { AiResumeGeneratorModal } from './components/resume/AiResumeGeneratorModal';
import { JobMatchModal } from './components/resume/JobMatchModal';
import { ResumeData, Project } from './types';
import { api } from './services/api';
import { X, Printer } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { themeConfig, isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('team-dashboard');
  const [activeEditingResume, setActiveEditingResume] = useState<ResumeData | null>(null);
  const [previewResumeModal, setPreviewResumeModal] = useState<ResumeData | null>(null);
  const [showAiResumeModal, setShowAiResumeModal] = useState(false);
  const [showJobMatchModal, setShowJobMatchModal] = useState(false);

  // When user clicks "Add to Resume" from a project or bullet
  const handleAddProjectToResume = (project: Project) => {
    setActiveTab('resume-builder');
    // will open the resume editor with this project appended or allow selection
  };

  const handleSaveResume = async (updated: ResumeData) => {
    try {
      const saved = await api.updateResume(updated.id, updated);
      setActiveEditingResume(saved);
    } catch (e) {
      console.error('Failed to save resume:', e);
    }
  };

  return (
    <div className={`flex h-screen ${themeConfig.classes.bgApp} ${isLight ? 'text-slate-800' : 'text-slate-100'} overflow-hidden font-sans antialiased transition-colors duration-200`}>
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveEditingResume(null);
        }}
        onOpenAiGenerator={() => setShowAiResumeModal(true)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header is shown on top when not in full-screen editor mode */}
        {!activeEditingResume && (
          <Header
            activeTab={activeTab}
            onCreateResume={() => {
              setActiveTab('resume-builder');
              setActiveEditingResume(null);
            }}
            onOpenAiGenerator={() => setShowAiResumeModal(true)}
            onOpenJobMatch={() => setShowJobMatchModal(true)}
          />
        )}

        {/* Scrollable Body Pane */}
        <main className={`flex-1 overflow-y-auto ${themeConfig.classes.bgApp} transition-colors duration-200`}>
          {activeTab === 'team-dashboard' && (
            <TeamDashboard
              onNavigateToResume={() => setActiveTab('resume-builder')}
              onNavigateToProjects={() => setActiveTab('projects')}
              onNavigateToCareerInsights={() => setActiveTab('career-insights')}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsList
              onAddProjectToResume={handleAddProjectToResume}
              onGenerateBullets={(project) => {
                setActiveTab('resume-builder');
              }}
            />
          )}

          {activeTab === 'team-roles' && <TeamMembers />}

          {activeTab === 'github' && (
            <GithubActivity
              onAddBulletToResume={(bullet) => {
                setActiveTab('resume-builder');
              }}
            />
          )}

          {activeTab === 'career-profile' && <CareerProfileView />}

          {activeTab === 'resume-builder' && (
            <>
              {activeEditingResume ? (
                <ResumeEditor
                  resume={activeEditingResume}
                  onBack={() => setActiveEditingResume(null)}
                  onSave={handleSaveResume}
                />
              ) : (
                <ResumeDashboard
                  onEditResume={(res) => setActiveEditingResume(res)}
                  onPreviewResume={(res) => setPreviewResumeModal(res)}
                />
              )}
            </>
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView onOpenResumeBuilder={() => setActiveTab('resume-builder')} />
          )}

          {activeTab === 'career-insights' && (
            <CareerInsightsView onApplyToResume={() => setActiveTab('resume-builder')} />
          )}
        </main>
      </div>

      {/* AI Resume Generator Modal */}
      <AiResumeGeneratorModal
        isOpen={showAiResumeModal}
        onClose={() => setShowAiResumeModal(false)}
        onCreated={(newResume) => {
          setActiveTab('resume-builder');
          setActiveEditingResume(newResume);
        }}
      />

      {/* Job Match Modal */}
      <JobMatchModal
        isOpen={showJobMatchModal}
        onClose={() => setShowJobMatchModal(false)}
        activeResume={activeEditingResume}
        onApplySuggestions={(updated) => {
          if (activeEditingResume) {
            setActiveEditingResume(updated);
          }
          setShowJobMatchModal(false);
        }}
      />

      {/* Full Preview Modal */}
      {previewResumeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between no-print">
              <div>
                <h3 className="text-sm font-bold text-white">{previewResumeModal.title}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {previewResumeModal.targetRole} • {previewResumeModal.template.toUpperCase()} Template
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setPreviewResumeModal(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#1a202c] flex justify-center">
              <ResumePreview resume={previewResumeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
