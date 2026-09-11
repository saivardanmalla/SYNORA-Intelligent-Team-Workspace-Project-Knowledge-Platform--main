export type UserRole = 
  | 'OWNER' 
  | 'ADMIN' 
  | 'TEAM_LEAD' 
  | 'DEVELOPER' 
  | 'DESIGNER' 
  | 'MEMBER' 
  | 'VIEWER'
  // Legacy aliases for backward compatibility:
  | 'Admin' 
  | 'Lead Engineer' 
  | 'Senior Developer' 
  | 'Contributor' 
  | 'Intern';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  location: string;
  phone?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  activeStatus: 'active' | 'away' | 'offline';
  department: string;
  skillsList?: string[];
  education?: string;
  certificationsCount?: number;
  achievementsCount?: number;
  completedTasksCount?: number;
  contributionsScore?: number;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  assignedTo: string; // userId
  priority: TaskPriority;
  technologies: string[];
  description: string;
  dueDate?: string;
  labels?: string[];
  metricImpact?: string;
  completedAt?: string;
  githubPrUrl?: string;
  comments?: TaskComment[];
  aiAssignedReason?: string;
}

export type ProjectCategory = 
  | 'AI/ML' 
  | 'Web' 
  | 'Mobile' 
  | 'Cloud' 
  | 'Cybersecurity' 
  | 'Data Science' 
  | 'IoT' 
  | 'Hackathon' 
  | 'College Project';

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  tasksCount: number;
}

export interface ProjectIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  author: string;
  assignee?: string;
  createdAt: string;
  description: string;
}

export interface ProjectHealthMetrics {
  overall: number; // 0 - 100
  codeQuality: number;
  taskProgress: number;
  documentation: number;
  teamActivity: number;
  issuesResolution: number;
  deploymentReadiness: number;
  aiDiagnostic: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category?: ProjectCategory;
  problemStatement?: string;
  objectives?: string[];
  features?: string[];
  status: 'planning' | 'active' | 'testing' | 'completed';
  technologies: string[];
  githubRepo: string;
  liveUrl?: string;
  startDate?: string;
  deadline?: string;
  leadId: string;
  contributors: string[]; // userIds
  tasksCompletedCount: number;
  totalTasksCount: number;
  documentationUrl?: string;
  verifiedImpact?: string;
  healthMetrics?: ProjectHealthMetrics;
  milestones?: ProjectMilestone[];
  issues?: ProjectIssue[];
  architectureSummary?: string;
}

export interface DocumentVersionInfo {
  version: string;
  updatedBy: string;
  updatedAt: string;
  changeSummary: string;
  contentSnapshot?: string;
}

export type DocumentCategory = 
  | 'README' 
  | 'Problem Statement' 
  | 'Requirements' 
  | 'Architecture' 
  | 'Database Design' 
  | 'API Documentation' 
  | 'Installation' 
  | 'Testing' 
  | 'Deployment' 
  | 'User Guide' 
  | 'Troubleshooting' 
  | 'Final Report';

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: DocumentCategory;
  content: string;
  currentVersion: string;
  authorId: string;
  authorName: string;
  updatedAt: string;
  tags: string[];
  versions: DocumentVersionInfo[];
}

export interface KnowledgeItem {
  id: string;
  projectId: string;
  title: string;
  category: 'Documentation' | 'Code' | 'Architecture' | 'APIs' | 'Decisions' | 'Issues' | 'GitHub';
  sourceDoc: string;
  snippet: string;
  tags: string[];
  relevanceScore?: number;
  author: string;
  updatedAt: string;
}

export interface DoubtClassification {
  query: string;
  category: 'Authentication' | 'Bug' | 'Frontend' | 'Backend' | 'Database' | 'API' | 'AI/ML' | 'DevOps' | 'Cloud' | 'Architecture' | 'Documentation' | 'General';
  severity: 'low' | 'medium' | 'high' | 'critical';
  project: string;
  module: string;
  probableCause: string;
  relevantDocumentation: string;
  recommendedMember: {
    id: string;
    name: string;
    role: string;
    matchReason: string;
  };
  suggestedSolution: string[];
  suggestedTaskTitle: string;
}

export interface DebuggerAnalysis {
  errorClassification: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rootCause: string;
  affectedModule: string;
  explanation: string;
  recommendedFix: string;
  prevention: string;
  relatedDocumentation: string;
  confidenceScore: number;
}

export interface VivaQuestion {
  id: string;
  question: string;
  module: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedConcepts: string[];
  userAnswer?: string;
  evaluation?: {
    score: number; // 0 - 100
    clarity: string;
    depth: string;
    missingConcepts: string[];
    feedback: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'mention' | 'github' | 'ai' | 'risk' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface TeamSkillHeatmap {
  memberId: string;
  memberName: string;
  memberRole: string;
  avatar: string;
  skills: Record<string, number>; // e.g. { 'React': 92, 'TypeScript': 88, 'FastAPI': 85 }
}

export interface SmartTaskRecommendation {
  userId: string;
  name: string;
  role: string;
  avatar: string;
  suitabilityScore: number; // 0 - 100
  reasons: string[];
  workloadStatus: 'Light' | 'Balanced' | 'Heavy';
}

export interface RolePermissionsMatrix {
  role: UserRole;
  label: string;
  description: string;
  permissions: {
    manageTeam: boolean;
    createProjects: boolean;
    editProjects: boolean;
    manageTasks: boolean;
    manageDocumentation: boolean;
    accessAi: boolean;
    manageIntegrations: boolean;
    viewAnalytics: boolean;
    deleteResources: boolean;
  };
}

export interface GitHubContribution {
  id: string;
  userId: string;
  repository: string;
  type: 'commit' | 'pull_request' | 'release' | 'issue';
  title: string;
  description: string;
  technologies: string[];
  linesAdded: number;
  linesRemoved: number;
  timestamp: string;
  evidenceUrl: string;
  suggestedBullet?: string;
}

export interface SkillCategory {
  id: string;
  name: 'Programming Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Cloud' | 'DevOps' | 'AI/ML' | 'Tools' | 'Other';
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; verified: boolean }[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  type: 'full_time' | 'internship' | 'contract' | 'open_source';
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  relevantCoursework: string[];
  achievements?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verified: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  verified: boolean;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  items?: string[];
}

export interface CustomSection {
  id: string;
  name: string;
  type: 'publications' | 'hackathons' | 'open_source' | 'leadership' | 'volunteer' | 'extracurricular' | 'custom';
  enabled: boolean;
  items: CustomSectionItem[];
}

export interface CareerProfile {
  userId: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  photoUrl?: string;
  summary: string;
  isSummaryAiGenerated?: boolean;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  customSections: CustomSection[];
  updatedAt: string;
}

export type ResumeTemplateType = 
  | 'ats_classic' 
  | 'modern' 
  | 'minimal' 
  | 'professional' 
  | 'developer' 
  | 'ai_ml' 
  | 'student' 
  | 'hackathon';

export interface ResumeProjectItem {
  id: string;
  name: string;
  role: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  bullets: string[];
  isFromSynoraProject?: boolean;
  synoraProjectId?: string;
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  template: ResumeTemplateType;
  atsScore: number;
  lastUpdated: string;
  status: 'draft' | 'ready' | 'reviewed';
  
  // Custom styling & typography controls
  fontFamily: 'inter' | 'serif' | 'mono' | 'sans';
  fontSize: 'compact' | 'standard' | 'spacious';
  spacing: 'tight' | 'normal' | 'relaxed';
  margins: 'narrow' | 'normal' | 'wide';
  showPageNumbers: boolean;

  // Active section configuration and ordering
  sectionsOrder: string[];
  enabledSections: {
    contact: boolean;
    summary: boolean;
    skills: boolean;
    experience: boolean;
    projects: boolean;
    education: boolean;
    certifications: boolean;
    achievements: boolean;
    custom: boolean;
  };

  // Section Content
  contact: {
    fullName: string;
    targetTitle: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ResumeProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  customSections: CustomSection[];

  // Versioning
  version: number;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: number;
  name: string;
  timestamp: string;
  atsScore: number;
  snapshot: ResumeData;
  changeNotes?: string;
}

export interface AtsAnalysisResult {
  score: number;
  breakdown: {
    technicalSkills: number;
    keywords: number;
    projects: number;
    experience: number;
    education: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvementAreas: string[];
  safeSuggestions: {
    title: string;
    category: 'skill' | 'bullet' | 'formatting';
    suggestion: string;
    verifiedInProfile: boolean;
  }[];
}

export interface SkillGapAnalysis {
  targetRole: string;
  readinessScore: number;
  strong: string[];
  learning: string[];
  missing: string[];
  recommendations: string[];
  learningRoadmap: {
    milestone: string;
    topics: string[];
    timeline: string;
    recommendedProjects: string[];
  }[];
}

export interface RealtimeMetricEvent {
  id: string;
  type: 'commit' | 'task_completed' | 'pr_merged' | 'ats_boost' | 'build_passed';
  message: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}
