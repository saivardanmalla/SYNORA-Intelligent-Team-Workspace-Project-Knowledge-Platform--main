import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  GitBranch, 
  ShieldCheck, 
  Filter, 
  ChevronRight,
  FileCode2,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Project, Task } from '../../types';

interface ProjectsListProps {
  onAddProjectToResume?: (project: Project) => void;
  onGenerateBullets?: (project: Project) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  onAddProjectToResume,
  onGenerateBullets,
}) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterMineOnly, setFilterMineOnly] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, taskData] = await Promise.all([
          api.getProjects(),
          api.getTasks(),
        ]);
        setProjects(projData);
        setTasks(taskData);
        if (projData.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projData[0].id);
        }
      } catch (err) {
        console.error('Failed to load project data:', err);
      }
    }
    loadData();
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === selectedProject?.id);
  const myTasks = projectTasks.filter((t) => t.assignedTo === currentUser?.id);
  const displayedTasks = filterMineOnly ? myTasks : projectTasks;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner explaining project-to-resume pipeline */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
              <FolderGit2 className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">SYNORA Project Intelligence Engine</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every completed sprint task and verified git pull request here can be converted with 1-click into ATS-formatted resume bullets with proven metric impacts.
          </p>
        </div>

        {selectedProject && (
          <div className="flex items-center gap-2 shrink-0">
            {onGenerateBullets && (
              <button
                id="btn-generate-project-bullets"
                onClick={() => onGenerateBullets(selectedProject)}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Resume Bullets</span>
              </button>
            )}

            {onAddProjectToResume && (
              <button
                id="btn-add-to-resume"
                onClick={() => onAddProjectToResume(selectedProject)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Resume</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2-Column Split: Project Navigation on Left, Project Details & Tasks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Project Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Project</span>
            <span className="text-xs text-slate-400">{projects.length} Total</span>
          </div>

          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            const percent = Math.round((proj.tasksCompletedCount / proj.totalTasksCount) * 100);

            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-[#111622] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-white text-sm">{proj.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                    {proj.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{percent}% Complete</span>
                  <span>{proj.tasksCompletedCount}/{proj.totalTasksCount} tasks</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Project Deep Dive & Completed Tasks */}
        <div className="lg:col-span-2 space-y-4">
          {selectedProject ? (
            <>
              {/* Project Header Box */}
              <div className="bg-[#111622] border border-slate-800 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{selectedProject.name}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedProject.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedProject.githubRepo && (
                      <a
                        href={selectedProject.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>GitHub Repo</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                    {selectedProject.documentationUrl && (
                      <a
                        href={selectedProject.documentationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Docs</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Verified Impact & Technologies */}
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Verified System Impact
                    </span>
                    <p className="text-xs text-emerald-400 font-medium mt-1 leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-800/40">
                      ✓ {selectedProject.verifiedImpact || 'Delivered with 100% test coverage and zero regressions.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Technologies & Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedProject.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks & Completed Contributions */}
              <div className="bg-[#111622] border border-slate-800 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Sprint Tasks & Evidence Logs</h4>
                    <p className="text-xs text-slate-400">Tasks assigned and completed across the project</p>
                  </div>

                  <button
                    onClick={() => setFilterMineOnly(!filterMineOnly)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                      filterMineOnly
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{filterMineOnly ? 'Showing My Tasks Only' : 'Show All Team Tasks'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {displayedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-[#0c1017] border border-slate-800/80 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              task.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">{task.title}</div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{task.description}</p>
                            {task.metricImpact && (
                              <div className="mt-1.5 text-[11px] text-cyan-400 font-mono">
                                ↳ Metric: {task.metricImpact}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                              task.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                                : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                            }`}
                          >
                            {task.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>Stack:</span>
                          {task.technologies.slice(0, 3).map((tech) => (
                            <span key={tech} className="bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                        {task.completedAt && (
                          <span>Verified: {new Date(task.completedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-[#111622] rounded-xl border border-slate-800">
              Select a project from the left to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
