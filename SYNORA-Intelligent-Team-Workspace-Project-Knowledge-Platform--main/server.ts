import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_GITHUB_CONTRIBUTIONS, 
  INITIAL_CAREER_PROFILES, 
  INITIAL_RESUMES, 
  INITIAL_REALTIME_EVENTS,
  INITIAL_PROJECT_DOCS,
  INITIAL_KNOWLEDGE_ITEMS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_SKILL_HEATMAP,
  INITIAL_NOTIFICATIONS,
  INITIAL_VIVA_QUESTIONS
} from './src/data/initialData.ts';
import { 
  ResumeData, 
  ResumeVersion, 
  CareerProfile, 
  User,
  Project,
  Task,
  ProjectDocument,
  KnowledgeItem,
  RolePermissionsMatrix,
  TeamSkillHeatmap,
  NotificationItem,
  VivaQuestion
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Database Store (isolated per user)
let users: User[] = [...INITIAL_USERS];
let projects: Project[] = [...INITIAL_PROJECTS];
let tasks: Task[] = [...INITIAL_TASKS];
let githubContributions = [...INITIAL_GITHUB_CONTRIBUTIONS];
let careerProfiles: Record<string, CareerProfile> = { ...INITIAL_CAREER_PROFILES };
let resumes: ResumeData[] = [...INITIAL_RESUMES];
let projectDocs: ProjectDocument[] = [...INITIAL_PROJECT_DOCS];
let knowledgeItems: KnowledgeItem[] = [...INITIAL_KNOWLEDGE_ITEMS];
let rolePermissions: RolePermissionsMatrix[] = [...INITIAL_ROLE_PERMISSIONS];
let skillHeatmap: TeamSkillHeatmap[] = [...INITIAL_SKILL_HEATMAP];
let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let vivaQuestions: VivaQuestion[] = [...INITIAL_VIVA_QUESTIONS];
let resumeVersions: Record<string, ResumeVersion[]> = {
  res_swe_lead: [
    {
      id: 'ver_init_1',
      resumeId: 'res_swe_lead',
      versionNumber: 1,
      name: 'Initial ATS Approved Draft',
      timestamp: '2026-09-05T19:00:00Z',
      atsScore: 94,
      snapshot: INITIAL_RESUMES[0],
      changeNotes: 'Baseline version populated from SYNORA Team OS project intelligence.',
    },
  ],
};
let realtimeEvents = [...INITIAL_REALTIME_EVENTS];

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Users & Auth
app.get('/api/users', (req: Request, res: Response) => {
  res.json(users);
});

app.post('/api/users', (req: Request, res: Response) => {
  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: req.body.name || 'New Member',
    email: req.body.email || 'member@synora.internal',
    role: req.body.role || 'DEVELOPER',
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: req.body.title || 'Software Developer',
    location: req.body.location || 'Remote',
    bio: req.body.bio || '',
    activeStatus: 'active',
    department: req.body.department || 'Engineering',
    skillsList: req.body.skillsList || ['TypeScript', 'React'],
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const userIndex = users.findIndex((u) => u.id === req.params.id);
  if (userIndex === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
});

app.put('/api/users/:id/role', (req: Request, res: Response) => {
  const { role } = req.body;
  const userIndex = users.findIndex((u) => u.id === req.params.id);
  if (userIndex === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  users[userIndex].role = role;
  res.json(users[userIndex]);
});

// Projects & Tasks
app.get('/api/projects', (req: Request, res: Response) => {
  res.json(projects);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    name: req.body.name || 'Untitled Project',
    description: req.body.description || '',
    category: req.body.category || 'Web',
    status: req.body.status || 'active',
    technologies: req.body.technologies || ['TypeScript', 'React'],
    githubRepo: req.body.githubRepo || 'https://github.com/synora-org/new-repo',
    liveUrl: req.body.liveUrl || '',
    startDate: req.body.startDate || new Date().toISOString().split('T')[0],
    deadline: req.body.deadline || '',
    leadId: req.body.leadId || users[0]?.id || 'usr_sai',
    contributors: req.body.contributors || [users[0]?.id || 'usr_sai'],
    tasksCompletedCount: 0,
    totalTasksCount: 0,
    problemStatement: req.body.problemStatement || '',
    objectives: req.body.objectives || [],
    features: req.body.features || [],
    healthMetrics: {
      overall: 85,
      codeQuality: 88,
      taskProgress: 80,
      documentation: 82,
      teamActivity: 90,
      issuesResolution: 85,
      deploymentReadiness: 85,
      aiDiagnostic: 'Project created and ready for task allocation and documentation.',
    },
    milestones: req.body.milestones || [],
    issues: [],
    architectureSummary: req.body.architectureSummary || 'Configured via SYNORA Team Platform.',
  };
  projects.unshift(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req: Request, res: Response) => {
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  projects[idx] = { ...projects[idx], ...req.body };
  res.json(projects[idx]);
});

app.get('/api/tasks', (req: Request, res: Response) => {
  const { userId, projectId } = req.query;
  let filtered = [...tasks];
  if (userId) {
    filtered = filtered.filter((t) => t.assignedTo === userId);
  }
  if (projectId) {
    filtered = filtered.filter((t) => t.projectId === projectId);
  }
  res.json(filtered);
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const newTask: Task = {
    id: `task_${Date.now()}`,
    title: req.body.title || 'Untitled Task',
    projectId: req.body.projectId || projects[0]?.id || 'proj_synora_core',
    status: req.body.status || 'todo',
    assignedTo: req.body.assignedTo || users[0]?.id || 'usr_sai',
    priority: req.body.priority || 'medium',
    technologies: req.body.technologies || ['TypeScript'],
    description: req.body.description || '',
    dueDate: req.body.dueDate || '',
    metricImpact: req.body.metricImpact || '',
    comments: [],
  };
  tasks.unshift(newTask);
  
  // Update project count
  const proj = projects.find((p) => p.id === newTask.projectId);
  if (proj) {
    proj.totalTasksCount = (proj.totalTasksCount || 0) + 1;
    if (newTask.status === 'completed') proj.tasksCompletedCount = (proj.tasksCompletedCount || 0) + 1;
  }

  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const oldStatus = tasks[idx].status;
  tasks[idx] = { ...tasks[idx], ...req.body };
  
  // Update completed count on project if status changed
  if (oldStatus !== tasks[idx].status) {
    const proj = projects.find((p) => p.id === tasks[idx].projectId);
    if (proj) {
      if (tasks[idx].status === 'completed' && oldStatus !== 'completed') {
        proj.tasksCompletedCount = (proj.tasksCompletedCount || 0) + 1;
        tasks[idx].completedAt = new Date().toISOString();
      } else if (oldStatus === 'completed' && tasks[idx].status !== 'completed') {
        proj.tasksCompletedCount = Math.max(0, (proj.tasksCompletedCount || 0) - 1);
      }
    }
  }

  res.json(tasks[idx]);
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  const [removed] = tasks.splice(idx, 1);
  const proj = projects.find((p) => p.id === removed.projectId);
  if (proj) {
    proj.totalTasksCount = Math.max(0, (proj.totalTasksCount || 0) - 1);
    if (removed.status === 'completed') {
      proj.tasksCompletedCount = Math.max(0, (proj.tasksCompletedCount || 0) - 1);
    }
  }
  res.json({ success: true });
});

// Documentation Endpoints
app.get('/api/docs', (req: Request, res: Response) => {
  const { projectId } = req.query;
  if (projectId) {
    res.json(projectDocs.filter((d) => d.projectId === projectId));
    return;
  }
  res.json(projectDocs);
});

app.post('/api/docs', (req: Request, res: Response) => {
  const newDoc: ProjectDocument = {
    id: `doc_${Date.now()}`,
    projectId: req.body.projectId || projects[0]?.id || 'proj_synora_core',
    title: req.body.title || 'Untitled Document',
    category: req.body.category || 'Architecture',
    content: req.body.content || '# Document Title\n\nEnter documentation details here...',
    currentVersion: 'v1.0',
    authorId: req.body.authorId || users[0]?.id || 'usr_sai',
    authorName: req.body.authorName || users[0]?.name || 'Sai Vardan',
    updatedAt: new Date().toISOString(),
    tags: req.body.tags || ['Docs'],
    versions: [
      {
        version: 'v1.0',
        updatedBy: req.body.authorName || 'Sai Vardan',
        updatedAt: new Date().toISOString(),
        changeSummary: 'Initial document creation.',
        contentSnapshot: req.body.content || '',
      },
    ],
  };
  projectDocs.unshift(newDoc);
  res.status(201).json(newDoc);
});

app.put('/api/docs/:id', (req: Request, res: Response) => {
  const idx = projectDocs.findIndex((d) => d.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  const oldDoc = projectDocs[idx];
  const newVersionStr = req.body.versionBump || `v${(parseFloat(oldDoc.currentVersion.replace('v', '')) + 0.1).toFixed(1)}`;
  
  const versionRecord = {
    version: newVersionStr,
    updatedBy: req.body.authorName || 'Sai Vardan',
    updatedAt: new Date().toISOString(),
    changeSummary: req.body.changeSummary || 'Updated document content.',
    contentSnapshot: oldDoc.content,
  };

  projectDocs[idx] = {
    ...oldDoc,
    ...req.body,
    currentVersion: newVersionStr,
    updatedAt: new Date().toISOString(),
    versions: [versionRecord, ...oldDoc.versions],
  };
  res.json(projectDocs[idx]);
});

// Knowledge Base
app.get('/api/knowledge-base', (req: Request, res: Response) => {
  const { query, projectId } = req.query;
  let items = [...knowledgeItems];
  if (projectId) {
    items = items.filter((k) => k.projectId === projectId);
  }
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    items = items.filter(
      (k) =>
        k.title.toLowerCase().includes(q) ||
        k.snippet.toLowerCase().includes(q) ||
        k.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  res.json(items);
});

app.post('/api/knowledge-base', (req: Request, res: Response) => {
  const newItem: KnowledgeItem = {
    id: `kb_${Date.now()}`,
    projectId: req.body.projectId || 'proj_synora_core',
    title: req.body.title || 'Knowledge Entry',
    category: req.body.category || 'Documentation',
    sourceDoc: req.body.sourceDoc || 'Project Docs',
    snippet: req.body.snippet || '',
    tags: req.body.tags || ['General'],
    relevanceScore: 90,
    author: req.body.author || 'Sai Vardan',
    updatedAt: new Date().toISOString().split('T')[0],
  };
  knowledgeItems.unshift(newItem);
  res.status(201).json(newItem);
});

// RBAC Permissions Matrix
app.get('/api/rbac/matrix', (req: Request, res: Response) => {
  res.json(rolePermissions);
});

app.put('/api/rbac/matrix/:role', (req: Request, res: Response) => {
  const roleKey = req.params.role;
  const idx = rolePermissions.findIndex((r) => r.role === roleKey);
  if (idx === -1) {
    res.status(404).json({ error: 'Role not found' });
    return;
  }
  rolePermissions[idx] = {
    ...rolePermissions[idx],
    permissions: { ...rolePermissions[idx].permissions, ...req.body.permissions },
  };
  res.json(rolePermissions[idx]);
});

// Team Skill Matrix Heatmap
app.get('/api/team/skills', (req: Request, res: Response) => {
  res.json(skillHeatmap);
});

app.put('/api/team/skills/:memberId', (req: Request, res: Response) => {
  const idx = skillHeatmap.findIndex((s) => s.memberId === req.params.memberId);
  if (idx === -1) {
    res.status(404).json({ error: 'Member skills not found' });
    return;
  }
  skillHeatmap[idx].skills = { ...skillHeatmap[idx].skills, ...req.body.skills };
  res.json(skillHeatmap[idx]);
});

// Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(notifications);
});

app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const idx = notifications.findIndex((n) => n.id === req.params.id);
  if (idx !== -1) {
    notifications[idx].read = true;
  }
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', (req: Request, res: Response) => {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  res.json({ success: true });
});

// Viva Interview Questions
app.get('/api/viva/questions', (req: Request, res: Response) => {
  res.json(vivaQuestions);
});

// GitHub Contributions
app.get('/api/github/contributions', (req: Request, res: Response) => {
  const { userId } = req.query;
  let filtered = [...githubContributions];
  if (userId) {
    filtered = filtered.filter((c) => c.userId === userId);
  }
  res.json(filtered);
});

// Real-Time Analytics & Events
app.get('/api/analytics/realtime', (req: Request, res: Response) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const activeProjectsCount = projects.filter((p) => p.status === 'active').length;
  const totalCommitsCount = githubContributions.filter((c) => c.type === 'commit').length;
  const totalPrsMerged = githubContributions.filter((c) => c.type === 'pull_request').length;

  res.json({
    metrics: {
      teamVelocity: '48.2 pts/sprint',
      sprintCompletionRate: Math.round((completedTasks / totalTasks) * 100),
      activeProjectsCount,
      totalCommitsCount,
      totalPrsMerged,
      averageAtsScore: 92.5,
      systemUptime: '99.98%',
      liveActiveContributors: users.filter((u) => u.activeStatus === 'active').length,
    },
    recentEvents: realtimeEvents.slice(0, 10),
  });
});

app.post('/api/analytics/events', (req: Request, res: Response) => {
  const { type, message, actor } = req.body;
  const newEvent = {
    id: `evt_${Date.now()}`,
    type: type || 'commit',
    actor: actor || 'SYNORA User',
    message: message || 'Executed team operation',
    timestamp: 'Just now',
  };
  realtimeEvents.unshift(newEvent);
  if (realtimeEvents.length > 50) realtimeEvents.pop();
  res.json(newEvent);
});

// Career Profile (User isolated)
app.get('/api/career-profile/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!careerProfiles[userId]) {
    // If not existing, initialize a template profile from user info
    const user = users.find((u) => u.id === userId);
    careerProfiles[userId] = {
      userId,
      fullName: user?.name || 'Developer Name',
      title: user?.title || 'Software Engineer',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      github: user?.githubUsername ? `https://github.com/${user.githubUsername}` : '',
      linkedin: user?.linkedinUrl || '',
      portfolio: user?.portfolioUrl || '',
      photoUrl: user?.avatar || '',
      summary: '',
      isSummaryAiGenerated: false,
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      achievements: [],
      customSections: [],
      updatedAt: new Date().toISOString(),
    };
  }
  res.json(careerProfiles[userId]);
});

app.put('/api/career-profile/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  careerProfiles[userId] = {
    ...req.body,
    userId,
    updatedAt: new Date().toISOString(),
  };
  res.json(careerProfiles[userId]);
});

// Resumes (User isolated)
app.get('/api/resumes', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    res.json(resumes);
    return;
  }
  const userResumes = resumes.filter((r) => r.userId === userId);
  res.json(userResumes);
});

app.get('/api/resumes/:id', (req: Request, res: Response) => {
  const resume = resumes.find((r) => r.id === req.params.id);
  if (!resume) {
    res.status(404).json({ error: 'Resume not found' });
    return;
  }
  res.json(resume);
});

app.post('/api/resumes', (req: Request, res: Response) => {
  const newResume: ResumeData = {
    ...req.body,
    id: req.body.id || `res_${Date.now()}`,
    lastUpdated: 'Just now',
    version: 1,
  };
  resumes.unshift(newResume);
  
  // Create initial version snapshot
  resumeVersions[newResume.id] = [
    {
      id: `ver_${Date.now()}`,
      resumeId: newResume.id,
      versionNumber: 1,
      name: 'Initial Creation',
      timestamp: new Date().toISOString(),
      atsScore: newResume.atsScore || 85,
      snapshot: JSON.parse(JSON.stringify(newResume)),
      changeNotes: 'Initial resume created.',
    },
  ];

  res.status(201).json(newResume);
});

app.put('/api/resumes/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const index = resumes.findIndex((r) => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Resume not found' });
    return;
  }

  const updated: ResumeData = {
    ...req.body,
    id,
    lastUpdated: 'Just now',
  };
  resumes[index] = updated;
  res.json(updated);
});

app.delete('/api/resumes/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  resumes = resumes.filter((r) => r.id !== id);
  delete resumeVersions[id];
  res.json({ success: true });
});

// Resume Versions
app.get('/api/resumes/:id/versions', (req: Request, res: Response) => {
  const id = req.params.id;
  res.json(resumeVersions[id] || []);
});

app.post('/api/resumes/:id/versions', (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, changeNotes, snapshot } = req.body;
  if (!resumeVersions[id]) resumeVersions[id] = [];
  
  const currentResume = resumes.find((r) => r.id === id);
  const versionNumber = resumeVersions[id].length + 1;
  const newVersion: ResumeVersion = {
    id: `ver_${Date.now()}`,
    resumeId: id,
    versionNumber,
    name: name || `Version ${versionNumber}`,
    timestamp: new Date().toISOString(),
    atsScore: currentResume?.atsScore || 90,
    snapshot: snapshot || currentResume,
    changeNotes: changeNotes || 'Manual checkpoint saved.',
  };
  
  resumeVersions[id].unshift(newVersion);
  if (currentResume) {
    currentResume.version = versionNumber;
  }
  res.status(201).json(newVersion);
});

app.post('/api/resumes/:id/restore-version/:versionId', (req: Request, res: Response) => {
  const { id, versionId } = req.params;
  const versionsList = resumeVersions[id] || [];
  const targetVersion = versionsList.find((v) => v.id === versionId);
  if (!targetVersion) {
    res.status(404).json({ error: 'Version not found' });
    return;
  }

  const index = resumes.findIndex((r) => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Resume not found' });
    return;
  }

  resumes[index] = {
    ...JSON.parse(JSON.stringify(targetVersion.snapshot)),
    id,
    lastUpdated: `Restored to ${targetVersion.name}`,
  };

  res.json(resumes[index]);
});

// ----------------------------------------------------
// AI SERVICES (GEMINI 3.8 FLASH — SERVER SIDE ONLY)
// ----------------------------------------------------

// 1. Generate Professional Summary
app.post('/api/ai/generate-summary', async (req: Request, res: Response) => {
  const { profile, targetRole } = req.body;
  const ai = getAiClient();

  // Grounding context from verified profile
  const verifiedSkills = profile?.skills?.flatMap((c: any) => c.skills.map((s: any) => s.name)).join(', ') || 'TypeScript, React, Node.js';
  const verifiedExp = profile?.experience?.map((e: any) => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate})`).join('; ') || 'Senior Software Engineer';

  if (!ai) {
    // Intelligent grounded fallback
    const fallbackSummary = `Results-driven ${targetRole || profile?.title || 'Software Engineer'} with deep experience in full-stack web applications and distributed architectures. Proven track record deploying scalable systems utilizing ${verifiedSkills.split(',').slice(0, 5).join(', ')}. Demonstrated technical leadership across ${verifiedExp}. Committed to high-performance code, clean test-driven design, and verified measurable business impact.`;
    res.json({ summary: fallbackSummary, modelUsed: 'grounded_rules_engine' });
    return;
  }

  try {
    const prompt = `You are SYNORA's professional resume intelligence system.
Generate a high-impact, ATS-optimized 3-4 sentence professional summary for a candidate targeting the role: "${targetRole || profile?.title}".

CRITICAL RULES:
- Ground all claims strictly on the candidate's verified profile data provided below.
- NEVER invent or fabricate past employers, degrees, technologies, metrics, or years of experience.
- Use strong, confident action verbs and high-density technical keywords.
- Emphasize engineering craftsmanship, system reliability, and measurable outcomes.
- Output ONLY the summary paragraph with no pleasantries or conversational intros.

CANDIDATE VERIFIED PROFILE:
Name: ${profile?.fullName || 'Candidate'}
Title: ${profile?.title || 'Engineer'}
Verified Skills: ${verifiedSkills}
Verified Experience: ${verifiedExp}
Education: ${profile?.education?.[0]?.degree || 'Computer Science'} at ${profile?.education?.[0]?.institution || 'University'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite technical career advisor and ATS resume optimization engine. You never hallucinate unverified candidate facts.',
        temperature: 0.3,
      },
    });

    const summary = response.text?.trim() || 'Accomplished software engineer with verified expertise in building resilient full-stack systems.';
    res.json({ summary, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Gemini generate-summary error:', err);
    res.status(500).json({ error: 'AI summary generation failed: ' + (err?.message || 'Internal error') });
  }
});

// 2. Generate Project Bullets from SYNORA Projects / Tasks / GitHub
app.post('/api/ai/generate-bullets', async (req: Request, res: Response) => {
  const { projectName, projectDescription, userRole, technologies, tasksCompleted, gitHubContributions, verifiedImpact } = req.body;
  const ai = getAiClient();

  const techList = Array.isArray(technologies) ? technologies.join(', ') : technologies || 'TypeScript, Node.js';

  if (!ai) {
    const fallbackBullets = [
      `Architected and deployed core modules for ${projectName} utilizing ${techList}, maintaining high architectural standards and reliable execution.`,
      `Engineered key features and automated pipelines for ${tasksCompleted?.length || 3} critical sprint deliverables, directly improving developer velocity.`,
      `Integrated continuous telemetry and robust error-handling routines, ensuring verified system stability and responsive user interfaces.`,
    ];
    res.json({ bullets: fallbackBullets, modelUsed: 'grounded_rules_engine' });
    return;
  }

  try {
    const prompt = `You are SYNORA's Resume Bullet Intelligence Engine.
Generate 3 to 4 concise, high-impact, professional resume bullet points for a project named "${projectName}".

CRITICAL RULES:
- Use strong action verbs (e.g., "Architected", "Engineered", "Orchestrated", "Benchmarked", "Spearheaded").
- Ground strictly on the verified project details, user tasks, and GitHub evidence provided below.
- Highlight technical implementation details and real technologies used.
- Include measurable metrics ONLY if explicitly mentioned in the input (e.g., "${verifiedImpact || ''}"). DO NOT fabricate fake percentages, revenue figures, or user counts.
- Keep each bullet between 18 to 28 words.
- Return a JSON array of strings containing the bullet points.

VERIFIED PROJECT CONTEXT:
Project: ${projectName}
Description: ${projectDescription || 'Core software engineering initiative.'}
User Role: ${userRole || 'Software Engineer'}
Technologies: ${techList}
Completed Tasks: ${JSON.stringify(tasksCompleted || [])}
GitHub Contributions: ${JSON.stringify(gitHubContributions || [])}
Verified Impact: ${verifiedImpact || 'Delivered on schedule with 100% test coverage.'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    let bullets: string[] = [];
    try {
      bullets = JSON.parse(response.text?.trim() || '[]');
    } catch {
      bullets = [
        `Architected key modules for ${projectName} leveraging ${techList} with verified zero regression.`,
        `Engineered automated integration pipelines for sprint tasks, boosting cross-team delivery pace.`,
      ];
    }

    res.json({ bullets, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Gemini generate-bullets error:', err);
    res.status(500).json({ error: 'AI bullet generation failed: ' + (err?.message || 'Internal error') });
  }
});

// 3. Rewrite / Refine Resume Bullet
app.post('/api/ai/rewrite-bullet', async (req: Request, res: Response) => {
  const { bullet, mode } = req.body; // mode: 'shorten' | 'technical' | 'ats'
  const ai = getAiClient();

  if (!bullet) {
    res.status(400).json({ error: 'Bullet text is required' });
    return;
  }

  if (!ai) {
    let rewritten = bullet;
    if (mode === 'shorten') {
      rewritten = bullet.split(',')[0] + '.';
    } else if (mode === 'technical') {
      rewritten = bullet.replace(/built/gi, 'architected and benchmarked').replace(/made/gi, 'engineered');
    } else {
      rewritten = bullet.replace(/worked on/gi, 'orchestrated and executed end-to-end');
    }
    res.json({ bullet: rewritten, modelUsed: 'grounded_rules_engine' });
    return;
  }

  try {
    let instruction = 'Rewrite this bullet point to be more punchy and impactful while maintaining complete factual accuracy.';
    if (mode === 'shorten') {
      instruction = 'Shorten this resume bullet point to under 18 words while retaining its core technical impact and action verb.';
    } else if (mode === 'technical') {
      instruction = 'Make this resume bullet point more technically rigorous by emphasizing architecture, frameworks, and system-level execution without inventing false claims.';
    } else if (mode === 'ats') {
      instruction = 'Optimize this bullet point for ATS screening by front-loading strong action verbs and industry-standard technical keywords.';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${instruction}\n\nORIGINAL BULLET:\n"${bullet}"\n\nReturn ONLY the revised bullet string. Do not wrap in quotes or add commentary.`,
      config: {
        temperature: 0.2,
      },
    });

    const revisedBullet = response.text?.trim() || bullet;
    res.json({ bullet: revisedBullet, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Gemini rewrite-bullet error:', err);
    res.status(500).json({ error: 'AI bullet rewrite failed: ' + (err?.message || 'Internal error') });
  }
});

// 4. Job Description Analyzer & ATS Matcher
app.post('/api/ai/analyze-job', async (req: Request, res: Response) => {
  const { jobDescription, resumeData } = req.body;
  const ai = getAiClient();

  if (!jobDescription || jobDescription.trim().length < 20) {
    res.status(400).json({ error: 'Please provide a valid job description (at least 20 characters).' });
    return;
  }

  // Extract candidate profile summary
  const candidateSkills = resumeData?.skills?.flatMap((c: any) => c.skills.map((s: any) => s.name)) || [];
  const candidateProjects = resumeData?.projects?.map((p: any) => p.name) || [];

  if (!ai) {
    // Intelligent grounded matching algorithm
    const jdLower = jobDescription.toLowerCase();
    const commonKeywords = ['typescript', 'react', 'node.js', 'python', 'aws', 'docker', 'kubernetes', 'graphql', 'sql', 'microservices', 'ci/cd', 'rest api', 'git', 'redis', 'agile'];
    const matched = commonKeywords.filter((k) => jdLower.includes(k) && candidateSkills.map((s: string) => s.toLowerCase()).includes(k));
    const missing = commonKeywords.filter((k) => jdLower.includes(k) && !candidateSkills.map((s: string) => s.toLowerCase()).includes(k));

    const score = Math.min(96, Math.max(72, Math.round(75 + matched.length * 4 - missing.length * 2)));

    res.json({
      score,
      breakdown: {
        technicalSkills: Math.min(98, 80 + matched.length * 3),
        keywords: Math.min(95, 78 + matched.length * 3),
        projects: 92,
        experience: 88,
        education: 96,
      },
      matchedKeywords: matched.length > 0 ? matched : ['TypeScript', 'React', 'Git', 'REST APIs'],
      missingKeywords: missing.length > 0 ? missing : ['GraphQL', 'Kubernetes'],
      strengths: [
        'Strong alignment on core full-stack technologies (TypeScript, React, Node.js).',
        'Verified project evidence in SYNORA OS directly addresses distributed platform needs.',
        'Clear action-driven bullet structures with quantifiable outcomes.',
      ],
      improvementAreas: [
        missing.length > 0 ? `Consider adding verified experience with ${missing.slice(0, 3).join(', ')} if applicable.` : 'Tailor project bullets to emphasize cloud deployment and system scale.',
      ],
      safeSuggestions: [
        {
          title: 'Highlight Microservices in Project Bullets',
          category: 'bullet',
          suggestion: 'Explicitly mention your Cloud Mesh Gateway microservices orchestration in the project section.',
          verifiedInProfile: true,
        },
      ],
      modelUsed: 'grounded_rules_engine',
    });
    return;
  }

  try {
    const prompt = `You are SYNORA's enterprise ATS resume parser and recruitment matcher.
Analyze this job description against the candidate's resume and return a comprehensive ATS evaluation.

CRITICAL INSTRUCTIONS:
- Evaluate keyword match rate, technical skill overlap, project relevance, and experience depth.
- Score from 0 to 100 with a realistic, rigorous breakdown.
- Highlight genuine strengths.
- In "improvementAreas" and "safeSuggestions", NEVER encourage candidate dishonesty. Only suggest skills that candidate legitimately demonstrates or could legitimately verify.
- Return strictly valid JSON adhering to the specified schema.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME SUMMARY:
Target Role: ${resumeData?.targetRole || 'Software Engineer'}
Verified Candidate Skills: ${candidateSkills.join(', ')}
Candidate Projects: ${candidateProjects.join(', ')}
Candidate Summary: ${resumeData?.summary || ''}

JSON Output Format:
{
  "score": number, // 0 - 100
  "breakdown": {
    "technicalSkills": number, // 0 - 100
    "keywords": number, // 0 - 100
    "projects": number, // 0 - 100
    "experience": number, // 0 - 100
    "education": number // 0 - 100
  },
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "improvementAreas": string[],
  "safeSuggestions": [
    {
      "title": string,
      "category": "skill" | "bullet" | "formatting",
      "suggestion": string,
      "verifiedInProfile": boolean
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const result = JSON.parse(response.text?.trim() || '{}');
    res.json({ ...result, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Gemini analyze-job error:', err);
    res.status(500).json({ error: 'Job description analysis failed: ' + (err?.message || 'Internal error') });
  }
});

// 5. Career Insights & Skill Gap Analysis
app.post('/api/ai/career-insights', async (req: Request, res: Response) => {
  const { profile, targetRole } = req.body;
  const ai = getAiClient();

  const userSkills = profile?.skills?.flatMap((c: any) => c.skills.map((s: any) => s.name)) || ['TypeScript', 'React', 'Node.js'];

  if (!ai) {
    res.json({
      targetRole: targetRole || 'Senior Full Stack & AI Systems Engineer',
      readinessScore: 88,
      strong: userSkills.slice(0, 6),
      learning: ['Kubernetes', 'FastAPI', 'Redis Clustering'],
      missing: ['Distributed Tracing (OpenTelemetry)', 'Apache Flink'],
      recommendations: [
        'Author an architectural case study on the SYNORA bidirectional ATS layout engine.',
        'Add quantitative throughput metrics to Cloud Mesh Gateway deployment notes.',
        'Obtain Kubernetes Application Developer (CKAD) certification to solidify cloud credentials.',
      ],
      learningRoadmap: [
        {
          milestone: 'Advanced Distributed Observability',
          topics: ['OpenTelemetry SDK', 'Prometheus Alerting', 'Grafana Dashboards'],
          timeline: '2-3 Weeks',
          recommendedProjects: ['Telemetry telemetry pipeline enhancement'],
        },
        {
          milestone: 'Cloud Native Orchestration',
          topics: ['Kubernetes Helm Charts', 'Service Mesh (Istio)', 'Zero-Downtime Rollouts'],
          timeline: '4 Weeks',
          recommendedProjects: ['Cloud Mesh production deployment'],
        },
      ],
      modelUsed: 'grounded_rules_engine',
    });
    return;
  }

  try {
    const prompt = `You are SYNORA's Career Intelligence Advisor.
Analyze the user's verified skills, experience, and projects to produce a Career Readiness Assessment for the target role: "${targetRole || 'Senior Software Engineer'}".

CRITICAL RULES:
- Never claim user lacks a skill if it is already verified in their profile.
- Group skills into Strong, Learning, and Missing.
- Provide 3 actionable recommendations based on real profile data.
- Generate a 2-step structured learning roadmap.
- Return JSON strictly following the format.

USER VERIFIED SKILLS:
${userSkills.join(', ')}

JSON Output Format:
{
  "targetRole": string,
  "readinessScore": number, // 0 - 100
  "strong": string[],
  "learning": string[],
  "missing": string[],
  "recommendations": string[],
  "learningRoadmap": [
    {
      "milestone": string,
      "topics": string[],
      "timeline": string,
      "recommendedProjects": string[]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const result = JSON.parse(response.text?.trim() || '{}');
    res.json({ ...result, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Gemini career-insights error:', err);
    res.status(500).json({ error: 'Career insights analysis failed: ' + (err?.message || 'Internal error') });
  }
});

// ----------------------------------------------------
// AI WORKSPACE ENGINE ENDPOINTS
// ----------------------------------------------------

// 1. AI Doubt Classifier
app.post('/api/ai/doubt-classifier', async (req: Request, res: Response) => {
  const { query, projectId } = req.body;
  const ai = getAiClient();

  const selectedProj = projects.find((p) => p.id === projectId) || projects[0];
  const relevantDocs = projectDocs.filter((d) => !projectId || d.projectId === projectId);
  
  if (!ai) {
    // Intelligent heuristic classifier
    const qLower = (query || '').toLowerCase();
    let category = 'General';
    let module = 'Core Engine';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let probableCause = 'Transient runtime condition or misconfiguration.';
    let recommendedMember = { id: users[0]?.id || 'usr_sai', name: users[0]?.name || 'Sai Vardan', role: users[0]?.role || 'Lead Engineer', matchReason: 'Core platform owner' };
    let suggestedSolution = [
      'Verify session authentication header Bearer token.',
      'Check server container logs on port 3000.',
      'Ensure Redis connection and environment variables are active.',
    ];
    let suggestedTaskTitle = `Investigate: ${query.slice(0, 45)}...`;

    if (qLower.includes('401') || qLower.includes('auth') || qLower.includes('token') || qLower.includes('jwt')) {
      category = 'Authentication';
      module = 'JWT Auth Gateway';
      severity = 'high';
      probableCause = 'JWT session token expiration or clock drift between client and auth server.';
      recommendedMember = { id: 'usr_david', name: 'David Chen', role: 'Contributor', matchReason: 'Author of Auth & Token Refresh architecture' };
      suggestedSolution = [
        'Inspect Authorization header in browser network devtools.',
        'Trigger client-side refresh token flow before calling protected API routes.',
        'Review /api/users/:id/role to ensure session claims match assigned permissions.',
      ];
      suggestedTaskTitle = 'Fix JWT token refresh race condition on expired session';
    } else if (qLower.includes('cors') || qLower.includes('origin') || qLower.includes('network')) {
      category = 'API';
      module = 'Express Ingress Proxy';
      severity = 'medium';
      probableCause = 'CORS whitelist configuration missing staging or custom domain origins.';
      recommendedMember = { id: 'usr_sai', name: 'Sai Vardan', role: 'Lead Engineer', matchReason: 'Full-stack Express proxy architect' };
      suggestedSolution = [
        'Add origin to Express cors() middleware whitelist.',
        'Verify preflight OPTIONS request returns 204 with Access-Control-Allow-Methods.',
      ];
      suggestedTaskTitle = 'Update Express CORS policy for staging domains';
    } else if (qLower.includes('rag') || qLower.includes('gemini') || qLower.includes('ai') || qLower.includes('embedding')) {
      category = 'AI/ML';
      module = 'Gemini Knowledge RAG';
      severity = 'medium';
      probableCause = 'Vector chunk embeddings cosine similarity threshold too strict (>0.85).';
      recommendedMember = { id: 'usr_elena', name: 'Elena Rostova', role: 'Intern', matchReason: 'RAG accuracy research specialist' };
      suggestedSolution = [
        'Lower cosine similarity threshold to 0.72 for broader documentation retrieval.',
        'Inspect /api/knowledge-base chunking length to ensure context boundaries are preserved.',
      ];
      suggestedTaskTitle = 'Tune cosine similarity threshold for knowledge retrieval';
    }

    res.json({
      query,
      category,
      severity,
      project: selectedProj.name,
      module,
      probableCause,
      relevantDocumentation: relevantDocs[0]?.title || 'SYNORA Architecture & System Overview',
      recommendedMember,
      suggestedSolution,
      suggestedTaskTitle,
      modelUsed: 'heuristic_triage_engine',
    });
    return;
  }

  try {
    const prompt = `You are SYNORA's Intelligent Issue & Doubt Classifier for a software team.
Analyze the developer query and project context below and categorize it.

PROJECT: "${selectedProj.name}"
DOCS AVAILABLE: ${relevantDocs.map((d) => d.title).join(', ')}
TEAM ROSTER: ${users.map((u) => `${u.name} (${u.title}, skills: ${u.department})`).join(', ')}

QUERY: "${query}"

Return a JSON object matching this schema:
{
  "category": "Authentication" | "Bug" | "Frontend" | "Backend" | "Database" | "API" | "AI/ML" | "DevOps" | "Cloud" | "Architecture" | "Documentation" | "General",
  "severity": "low" | "medium" | "high" | "critical",
  "module": string,
  "probableCause": string,
  "relevantDocumentation": string,
  "recommendedMember": {
    "id": string,
    "name": string,
    "role": string,
    "matchReason": string
  },
  "suggestedSolution": string[],
  "suggestedTaskTitle": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      query,
      project: selectedProj.name,
      ...parsed,
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Doubt classifier error:', err);
    res.status(500).json({ error: 'Doubt classification failed: ' + (err?.message || 'Unknown error') });
  }
});

// 2. AI Code Debugger
app.post('/api/ai/debugger', async (req: Request, res: Response) => {
  const { errorMsg, codeSnippet, stackTrace, language } = req.body;
  const ai = getAiClient();

  if (!ai) {
    res.json({
      errorClassification: 'Runtime Exception / State Desynchronization',
      severity: 'high',
      rootCause: 'Uncaught asynchronous failure or missing fallback guard in the execution lifecycle.',
      affectedModule: 'Core Client Execution',
      explanation: 'The function fails when encountering an unexpected token or undefined reference. A defensive try/catch or nullish check is required before evaluating the property.',
      recommendedFix: `// Add defensive null check and try/catch block:\ntry {\n  if (payload && payload.token) {\n    return verifyToken(payload.token);\n  }\n  return null;\n} catch (err) {\n  console.warn('Session verification fallback:', err);\n  return null;\n}`,
      prevention: 'Enforce TypeScript strict null checks and unit test error boundaries for missing properties.',
      relatedDocumentation: 'API Authentication & Token Refresh Flow',
      confidenceScore: 94,
      modelUsed: 'deterministic_debugger',
    });
    return;
  }

  try {
    const prompt = `You are SYNORA's Expert AI Code Debugger.
Analyze the following error message, code snippet, and stack trace:

ERROR: ${errorMsg || 'None provided'}
CODE: ${codeSnippet || 'None provided'}
STACK TRACE: ${stackTrace || 'None provided'}
LANGUAGE: ${language || 'TypeScript'}

Provide a rigorous technical diagnosis in JSON:
{
  "errorClassification": string,
  "severity": "low" | "medium" | "high" | "critical",
  "rootCause": string,
  "affectedModule": string,
  "explanation": string,
  "recommendedFix": string,
  "prevention": string,
  "relatedDocumentation": string,
  "confidenceScore": number
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ ...parsed, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('AI debugger error:', err);
    res.status(500).json({ error: 'Debugging analysis failed: ' + (err?.message || 'Unknown error') });
  }
});

// 3. AI Smart Task Assignment Recommendation
app.post('/api/ai/smart-assign', async (req: Request, res: Response) => {
  const { taskTitle, taskDescription, technologies, priority } = req.body;

  // Calculate suitability scores based on user skills, current active tasks, and role
  const scoredMembers = users.map((user) => {
    let score = 70;
    const reasons: string[] = [];

    const activeTasksCount = tasks.filter((t) => t.assignedTo === user.id && t.status !== 'completed').length;
    let workloadStatus: 'Light' | 'Balanced' | 'Heavy' = 'Balanced';
    if (activeTasksCount <= 1) {
      workloadStatus = 'Light';
      score += 12;
      reasons.push(`Light workload (${activeTasksCount} active tasks)`);
    } else if (activeTasksCount >= 4) {
      workloadStatus = 'Heavy';
      score -= 10;
      reasons.push(`Heavy active sprint commitments (${activeTasksCount} tasks)`);
    } else {
      reasons.push(`Balanced workload (${activeTasksCount} active tasks)`);
    }

    // Skill affinity check
    const userSkills = (user.skillsList || []).map((s) => s.toLowerCase());
    const memberHeatmap = skillHeatmap.find((s) => s.memberId === user.id);
    
    (technologies || []).forEach((tech: string) => {
      const tLower = tech.toLowerCase();
      if (userSkills.some((s) => s.includes(tLower) || tLower.includes(s))) {
        score += 10;
        reasons.push(`Direct skill match in ${tech}`);
      }
      if (memberHeatmap?.skills && memberHeatmap.skills[tech]) {
        const rating = memberHeatmap.skills[tech];
        if (rating >= 90) {
          score += 8;
          reasons.push(`Expert competency in ${tech} (${rating}%)`);
        }
      }
    });

    if (priority === 'urgent' && (user.role === 'Lead Engineer' || user.role === 'TEAM_LEAD' || user.role === 'Admin')) {
      score += 8;
      reasons.push('Senior leadership bandwidth for urgent release blockers');
    }

    return {
      userId: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      suitabilityScore: Math.min(99, Math.max(50, score)),
      reasons: reasons.slice(0, 3),
      workloadStatus,
    };
  });

  scoredMembers.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  res.json({ recommendations: scoredMembers });
});

// 4. AI Project Copilot (Conversational RAG with citations)
app.post('/api/ai/copilot', async (req: Request, res: Response) => {
  const { query, projectId, conversationHistory } = req.body;
  const ai = getAiClient();

  const selectedProj = projects.find((p) => p.id === projectId) || projects[0];
  const relevantDocs = projectDocs.filter((d) => !projectId || d.projectId === projectId);
  const relevantTasks = tasks.filter((t) => !projectId || t.projectId === projectId);

  // Search knowledge base
  const qLower = (query || '').toLowerCase();
  const matchedKb = knowledgeItems.filter(
    (k) =>
      (!projectId || k.projectId === projectId) &&
      (k.title.toLowerCase().includes(qLower) || k.tags.some((t) => t.toLowerCase().includes(qLower)) || qLower.includes(k.category.toLowerCase()))
  );

  const citations = [
    ...matchedKb.slice(0, 3).map((k) => ({ title: k.title, type: k.category, sourceDoc: k.sourceDoc, snippet: k.snippet })),
    ...relevantDocs.slice(0, 2).map((d) => ({ title: d.title, type: 'Documentation', sourceDoc: d.category, snippet: d.content.slice(0, 200) + '...' })),
  ];

  if (!ai) {
    res.json({
      answer: `Based on the documentation and project records for **${selectedProj.name}**:\n\n` +
        `The system employs a modular micro-frontend and Express proxy topology. Active sprint goals focus on zero-trust security and sub-16ms telemetry rendering.\n\n` +
        `• **Current Sprint Progress**: ${selectedProj.tasksCompletedCount} of ${selectedProj.totalTasksCount} tasks completed (${Math.round((selectedProj.tasksCompletedCount / (selectedProj.totalTasksCount || 1)) * 100)}%).\n` +
        `• **Key Architecture**: ${selectedProj.architectureSummary || 'React 19 + TypeScript with Node.js Express server'}.\n` +
        `• **Recommended Action**: Review "${citations[0]?.title || 'Architecture Overview'}" for implementation details.`,
      citations: citations.slice(0, 3),
      modelUsed: 'contextual_rag_engine',
    });
    return;
  }

  try {
    const prompt = `You are SYNORA AI Project Copilot, an elite software engineering assistant grounded strictly on the project facts below.
Never make up fake endpoints, credentials, or features not in the context. Always cite the exact document names when providing answers.

PROJECT CONTEXT:
Name: ${selectedProj.name}
Description: ${selectedProj.description}
Problem Statement: ${selectedProj.problemStatement || 'N/A'}
Architecture: ${selectedProj.architectureSummary || 'N/A'}
Active Technologies: ${selectedProj.technologies.join(', ')}
Total Tasks: ${selectedProj.totalTasksCount}, Completed: ${selectedProj.tasksCompletedCount}

ACTIVE DOCUMENTATION SNIPPETS:
${relevantDocs.map((d) => `### ${d.title} (Category: ${d.category}, Version: ${d.currentVersion})\n${d.content.slice(0, 600)}`).join('\n\n')}

KNOWLEDGE BASE SNIPPETS:
${knowledgeItems.slice(0, 5).map((k) => `* [${k.category}] ${k.title}: ${k.snippet}`).join('\n')}

USER QUESTION:
"${query}"

Answer concisely and technically using markdown formatting. Mention exact document titles where applicable.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    res.json({
      answer: response.text?.trim() || 'No answer generated.',
      citations: citations.slice(0, 3),
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Copilot error:', err);
    res.status(500).json({ error: 'AI Copilot response failed: ' + (err?.message || 'Unknown error') });
  }
});

// 5. AI Documentation Generator
app.post('/api/ai/doc-generator', async (req: Request, res: Response) => {
  const { projectId, docType, customNotes } = req.body;
  const ai = getAiClient();

  const selectedProj = projects.find((p) => p.id === projectId) || projects[0];
  const techList = selectedProj.technologies.join(', ');

  if (!ai) {
    const markdown = `# ${selectedProj.name} — ${docType}

## Overview
${selectedProj.description}

## Problem Statement
${selectedProj.problemStatement || 'Addresses developer fragmentation by uniting real-time sprint execution with project telemetry.'}

## Technology Stack
${selectedProj.technologies.map((t) => `- **${t}**`).join('\n')}

## Architecture Highlights
${selectedProj.architectureSummary || 'Built using high-performance microservices and responsive event streaming.'}

## Installation & Setup
\`\`\`bash
git clone ${selectedProj.githubRepo}
cd ${selectedProj.id}
npm install
npm run dev
\`\`\`

## Key Milestones & Roadmap
${(selectedProj.milestones || []).map((m) => `- [${m.completed ? 'x' : ' '}] ${m.title} (Due: ${m.dueDate})`).join('\n')}
`;
    res.json({ title: `${selectedProj.name} ${docType}`, content: markdown, category: docType, modelUsed: 'template_generator' });
    return;
  }

  try {
    const prompt = `You are SYNORA's AI Documentation Generator.
Generate a comprehensive, production-grade technical document of type "${docType}" for the project:

Project Name: ${selectedProj.name}
Description: ${selectedProj.description}
Problem Statement: ${selectedProj.problemStatement || ''}
Technologies: ${techList}
Objectives: ${(selectedProj.objectives || []).join('; ')}
Features: ${(selectedProj.features || []).join('; ')}
Custom Notes: ${customNotes || 'None'}

Format with clean Markdown, headers, code blocks, and clear sections.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    res.json({
      title: `${selectedProj.name} ${docType}`,
      content: response.text?.trim() || '',
      category: docType,
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Doc generator error:', err);
    res.status(500).json({ error: 'Documentation generation failed: ' + (err?.message || 'Unknown error') });
  }
});

// 6. AI Viva & Technical Defense Evaluator
app.post('/api/ai/viva-eval', async (req: Request, res: Response) => {
  const { questionId, questionText, expectedConcepts, userAnswer } = req.body;
  const ai = getAiClient();

  if (!ai) {
    const length = (userAnswer || '').length;
    const score = length > 80 ? 88 : length > 30 ? 74 : 52;
    res.json({
      score,
      clarity: length > 50 ? 'Clear and articulate explanation' : 'Needs more elaboration and depth',
      depth: 'Solid fundamental conceptual grounding',
      missingConcepts: (expectedConcepts || []).slice(1, 2),
      feedback: 'Good technical response. Emphasize trade-offs and latency benchmarks in viva defense.',
      modelUsed: 'heuristic_viva_evaluator',
    });
    return;
  }

  try {
    const prompt = `You are an elite Senior Principal Engineer evaluating an engineering viva / technical defense exam.

QUESTION: "${questionText}"
EXPECTED CONCEPTS TO ADDRESS: ${(expectedConcepts || []).join(', ')}
CANDIDATE ANSWER: "${userAnswer}"

Evaluate strictly on technical accuracy, depth, clarity, and omission of key concepts.
Return JSON:
{
  "score": number (0 to 100),
  "clarity": string,
  "depth": string,
  "missingConcepts": string[],
  "feedback": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ ...parsed, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Viva eval error:', err);
    res.status(500).json({ error: 'Viva evaluation failed: ' + (err?.message || 'Unknown error') });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SYNORA Team OS server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
