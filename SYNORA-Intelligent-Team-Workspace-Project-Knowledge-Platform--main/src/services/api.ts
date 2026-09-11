import { 
  User, 
  Project, 
  Task, 
  GitHubContribution, 
  CareerProfile, 
  ResumeData, 
  ResumeVersion,
  AtsAnalysisResult,
  SkillGapAnalysis,
  ProjectDocument,
  KnowledgeItem,
  RolePermissionsMatrix,
  TeamSkillHeatmap,
  NotificationItem,
  DoubtClassification,
  DebuggerAnalysis,
  VivaQuestion,
  SmartTaskRecommendation
} from '../types';

export const api = {
  // Users & Auth
  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async updateUserRole(userId: string, role: string): Promise<User> {
    const res = await fetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  // Projects & Tasks
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(projectId: string, projectData: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async getTasks(userId?: string, projectId?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (userId) params.set('userId', userId);
    if (projectId) params.set('projectId', projectId);
    const res = await fetch(`/api/tasks?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(taskId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  async createMember(userData: Partial<User>): Promise<User> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to create member');
    return res.json();
  },

  async updateMember(userId: string, userData: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to update member');
    return res.json();
  },

  // Documentation
  async getDocs(projectId?: string): Promise<ProjectDocument[]> {
    const url = projectId ? `/api/docs?projectId=${encodeURIComponent(projectId)}` : '/api/docs';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch documentation');
    return res.json();
  },

  async createDoc(docData: Partial<ProjectDocument>): Promise<ProjectDocument> {
    const res = await fetch('/api/docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });
    if (!res.ok) throw new Error('Failed to create document');
    return res.json();
  },

  async updateDoc(docId: string, docData: Partial<ProjectDocument> & { versionBump?: string; changeSummary?: string }): Promise<ProjectDocument> {
    const res = await fetch(`/api/docs/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });
    if (!res.ok) throw new Error('Failed to update document');
    return res.json();
  },

  // Knowledge Base
  async getKnowledgeItems(query?: string, projectId?: string): Promise<KnowledgeItem[]> {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (projectId) params.set('projectId', projectId);
    const res = await fetch(`/api/knowledge-base?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch knowledge base');
    return res.json();
  },

  async createKnowledgeItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const res = await fetch('/api/knowledge-base', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to create knowledge item');
    return res.json();
  },

  // RBAC
  async getRolePermissions(): Promise<RolePermissionsMatrix[]> {
    const res = await fetch('/api/rbac/matrix');
    if (!res.ok) throw new Error('Failed to fetch role permissions');
    return res.json();
  },

  async updateRolePermissions(role: string, permissions: Record<string, boolean>): Promise<RolePermissionsMatrix> {
    const res = await fetch(`/api/rbac/matrix/${encodeURIComponent(role)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions }),
    });
    if (!res.ok) throw new Error('Failed to update permissions');
    return res.json();
  },

  // Team Skills Heatmap
  async getTeamSkills(): Promise<TeamSkillHeatmap[]> {
    const res = await fetch('/api/team/skills');
    if (!res.ok) throw new Error('Failed to fetch team skills');
    return res.json();
  },

  async updateMemberSkills(memberId: string, skills: Record<string, number>): Promise<TeamSkillHeatmap> {
    const res = await fetch(`/api/team/skills/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) throw new Error('Failed to update member skills');
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' });
  },

  // Workspace AI APIs
  async classifyDoubt(query: string, projectId?: string): Promise<DoubtClassification> {
    const res = await fetch('/api/ai/doubt-classifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, projectId }),
    });
    if (!res.ok) throw new Error('Failed to classify doubt');
    return res.json();
  },

  async runCodeDebugger(errorMsg: string, codeSnippet: string, stackTrace: string, language?: string): Promise<DebuggerAnalysis> {
    const res = await fetch('/api/ai/debugger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ errorMsg, codeSnippet, stackTrace, language }),
    });
    if (!res.ok) throw new Error('Failed to run code debugger');
    return res.json();
  },

  async getSmartTaskAssignment(taskTitle: string, taskDescription: string, technologies: string[], priority?: string): Promise<{ recommendations: SmartTaskRecommendation[] }> {
    const res = await fetch('/api/ai/smart-assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskTitle, taskDescription, technologies, priority }),
    });
    if (!res.ok) throw new Error('Failed to get task recommendations');
    return res.json();
  },

  async askProjectCopilot(query: string, projectId?: string, conversationHistory?: any[]): Promise<{ answer: string; citations: any[]; modelUsed: string }> {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, projectId, conversationHistory }),
    });
    if (!res.ok) throw new Error('Failed to get copilot answer');
    return res.json();
  },

  async generateDocument(projectId: string, docType: string, customNotes?: string): Promise<{ title: string; content: string; category: string; modelUsed: string }> {
    const res = await fetch('/api/ai/doc-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, docType, customNotes }),
    });
    if (!res.ok) throw new Error('Failed to generate document');
    return res.json();
  },

  async evaluateVivaAnswer(questionId: string, questionText: string, expectedConcepts: string[], userAnswer: string): Promise<any> {
    const res = await fetch('/api/ai/viva-eval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, questionText, expectedConcepts, userAnswer }),
    });
    if (!res.ok) throw new Error('Failed to evaluate viva answer');
    return res.json();
  },

  async getVivaQuestions(): Promise<VivaQuestion[]> {
    const res = await fetch('/api/viva/questions');
    if (!res.ok) throw new Error('Failed to fetch viva questions');
    return res.json();
  },

  async getGithubContributions(userId?: string): Promise<GitHubContribution[]> {
    const params = new URLSearchParams();
    if (userId) params.set('userId', userId);
    const res = await fetch(`/api/github/contributions?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch github contributions');
    return res.json();
  },

  // Analytics
  async getRealtimeAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics/realtime');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async emitEvent(type: string, message: string, actor: string): Promise<any> {
    const res = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message, actor }),
    });
    if (!res.ok) throw new Error('Failed to emit event');
    return res.json();
  },

  // Career Profile
  async getCareerProfile(userId: string): Promise<CareerProfile> {
    const res = await fetch(`/api/career-profile/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch career profile');
    return res.json();
  },

  async updateCareerProfile(userId: string, profile: Partial<CareerProfile>): Promise<CareerProfile> {
    const res = await fetch(`/api/career-profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update career profile');
    return res.json();
  },

  // Resumes
  async getResumes(userId?: string): Promise<ResumeData[]> {
    const url = userId ? `/api/resumes?userId=${userId}` : '/api/resumes';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch resumes');
    return res.json();
  },

  async getResume(id: string): Promise<ResumeData> {
    const res = await fetch(`/api/resumes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch resume');
    return res.json();
  },

  async createResume(resume: Partial<ResumeData>): Promise<ResumeData> {
    const res = await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });
    if (!res.ok) throw new Error('Failed to create resume');
    return res.json();
  },

  async updateResume(id: string, resume: Partial<ResumeData>): Promise<ResumeData> {
    const res = await fetch(`/api/resumes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });
    if (!res.ok) throw new Error('Failed to update resume');
    return res.json();
  },

  async deleteResume(id: string): Promise<void> {
    const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete resume');
  },

  async duplicateResume(id: string): Promise<ResumeData> {
    const all = await this.getResumes();
    const original = all.find((r) => r.id === id);
    if (!original) throw new Error('Resume not found to duplicate');
    const clone = {
      ...original,
      title: `${original.title} (Copy)`,
    };
    delete (clone as any).id;
    return this.createResume(clone);
  },

  // Versions
  async getResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
    const res = await fetch(`/api/resumes/${resumeId}/versions`);
    if (!res.ok) throw new Error('Failed to fetch versions');
    return res.json();
  },

  async saveResumeVersion(resumeId: string, name: string, changeNotes?: string, snapshot?: ResumeData): Promise<ResumeVersion> {
    const res = await fetch(`/api/resumes/${resumeId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, changeNotes, snapshot }),
    });
    if (!res.ok) throw new Error('Failed to save version');
    return res.json();
  },

  async restoreResumeVersion(resumeId: string, versionId: string): Promise<ResumeData> {
    const res = await fetch(`/api/resumes/${resumeId}/restore-version/${versionId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to restore version');
    return res.json();
  },

  // AI Services
  async generateAiSummary(profile: CareerProfile, targetRole?: string): Promise<{ summary: string; modelUsed: string }> {
    const res = await fetch('/api/ai/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, targetRole }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate summary');
    }
    return res.json();
  },

  async generateAiBullets(payload: {
    projectName: string;
    projectDescription?: string;
    userRole?: string;
    technologies: string[];
    tasksCompleted?: any[];
    gitHubContributions?: any[];
    verifiedImpact?: string;
  }): Promise<{ bullets: string[]; modelUsed: string }> {
    const res = await fetch('/api/ai/generate-bullets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate bullets');
    }
    return res.json();
  },

  async rewriteBullet(bullet: string, mode: 'shorten' | 'technical' | 'ats'): Promise<{ bullet: string; modelUsed: string }> {
    const res = await fetch('/api/ai/rewrite-bullet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bullet, mode }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to rewrite bullet');
    }
    return res.json();
  },

  async refineBulletPoint(
    bullet: string,
    targetRole?: string,
    action: 'technical' | 'shorten' | 'ats' = 'ats',
    technologies?: string[]
  ): Promise<{ refined: string; modelUsed: string }> {
    const res = await this.rewriteBullet(bullet, action);
    return { refined: res.bullet, modelUsed: res.modelUsed };
  },

  async analyzeJobDescription(jobDescription: string, resumeData: ResumeData): Promise<AtsAnalysisResult> {
    const res = await fetch('/api/ai/analyze-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, resumeData }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to analyze job description');
    }
    return res.json();
  },

  async analyzeJobMatch(jobDescription: string, resumeData: ResumeData): Promise<AtsAnalysisResult> {
    return this.analyzeJobDescription(jobDescription, resumeData);
  },

  async getCareerInsights(profileOrUserId: CareerProfile | string, targetRole?: string): Promise<SkillGapAnalysis> {
    let profile: CareerProfile;
    if (typeof profileOrUserId === 'string') {
      profile = await this.getCareerProfile(profileOrUserId);
    } else {
      profile = profileOrUserId;
    }
    const res = await fetch('/api/ai/career-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, targetRole }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to fetch career insights');
    }
    return res.json();
  },
};
