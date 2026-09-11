import React from 'react';
import { ResumeData, ResumeTemplateType } from '../../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe, 
  ExternalLink,
  Code2
} from 'lucide-react';

interface ResumePreviewProps {
  resume: ResumeData;
  scale?: number;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, scale = 1 }) => {
  const {
    template = 'ats_classic',
    fontFamily = 'inter',
    fontSize = 'standard',
    spacing = 'normal',
    margins = 'normal',
    enabledSections,
    sectionsOrder,
    contact,
    summary,
    skills,
    experience,
    projects,
    education,
    certifications,
    achievements,
    customSections,
  } = resume;

  // Typography class helpers
  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
        return 'font-sans';
      default:
        return 'font-sans';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'compact':
        return 'text-[11px] leading-[1.35]';
      case 'spacious':
        return 'text-[13px] leading-[1.6]';
      default:
        return 'text-[12px] leading-[1.45]';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'tight':
        return 'space-y-2.5';
      case 'relaxed':
        return 'space-y-5';
      default:
        return 'space-y-3.5';
    }
  };

  const getMarginClass = () => {
    switch (margins) {
      case 'narrow':
        return 'p-6';
      case 'wide':
        return 'p-10';
      default:
        return 'p-8';
    }
  };

  // Section heading style based on selected template
  const renderSectionHeader = (title: string) => {
    switch (template) {
      case 'modern':
        return (
          <div className="border-b-2 border-blue-600 pb-1 mb-2.5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 font-sans">{title}</h2>
          </div>
        );
      case 'minimal':
        return (
          <div className="mb-2">
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-slate-700">{title}</h2>
            <div className="w-6 h-[1px] bg-slate-400 mt-0.5"></div>
          </div>
        );
      case 'developer':
        return (
          <div className="border-b border-slate-300 pb-1 mb-2 font-mono flex items-center gap-1.5 text-slate-800">
            <span className="text-blue-600 font-bold">#</span>
            <h2 className="text-xs font-bold uppercase tracking-wide">{title}</h2>
          </div>
        );
      case 'ai_ml':
        return (
          <div className="border-b border-indigo-200 pb-1 mb-2.5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-indigo-950 font-mono">
              // {title}
            </h2>
          </div>
        );
      case 'student':
        return (
          <div className="border-b-2 border-slate-400 pb-1 mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-sans">{title}</h2>
          </div>
        );
      case 'hackathon':
        return (
          <div className="bg-slate-100 px-2 py-0.5 mb-2 rounded border-l-2 border-purple-600">
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-900 font-sans">{title}</h2>
          </div>
        );
      case 'professional':
        return (
          <div className="border-b border-slate-400 pb-1 mb-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-serif">{title}</h2>
          </div>
        );
      case 'ats_classic':
      default:
        return (
          <div className="border-b border-slate-900 pb-0.5 mb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black">{title}</h2>
          </div>
        );
    }
  };

  // Section Renderers
  const renderContact = () => {
    if (!enabledSections.contact) return null;
    return (
      <header className="text-center pb-2 border-b border-slate-200 mb-3">
        <h1 className="text-xl font-bold tracking-tight text-black font-sans uppercase">
          {contact.fullName || 'Sai Vardan'}
        </h1>
        {contact.targetTitle && (
          <p className="text-xs font-medium text-slate-700 mt-0.5 font-sans">
            {contact.targetTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-700 mt-1.5 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.location && <span>• {contact.location}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {contact.github && <span>• {contact.github}</span>}
          {contact.portfolio && <span>• {contact.portfolio}</span>}
        </div>
      </header>
    );
  };

  const renderSummary = () => {
    if (!enabledSections.summary || !summary) return null;
    return (
      <section className="text-left">
        {renderSectionHeader('Professional Summary')}
        <p className="text-slate-800 text-justify leading-relaxed">
          {summary}
        </p>
      </section>
    );
  };

  const renderSkills = () => {
    if (!enabledSections.skills || skills.length === 0) return null;
    return (
      <section className="text-left">
        {renderSectionHeader('Technical Skills')}
        <div className="space-y-1 text-slate-800">
          {skills.map((cat) => (
            <div key={cat.id} className="leading-snug">
              <span className="font-semibold text-black">{cat.name}: </span>
              <span className="text-slate-800">
                {cat.skills.map((s) => s.name).join(', ')}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderExperience = () => {
    if (!enabledSections.experience || experience.length === 0) return null;
    return (
      <section className="text-left">
        {renderSectionHeader('Professional Experience')}
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-black">
                  {exp.position} <span className="font-normal text-slate-700">| {exp.company}</span>
                </div>
                <div className="text-[11px] text-slate-700 font-mono shrink-0">
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.location && (
                <div className="text-[10px] text-slate-600 italic">{exp.location}</div>
              )}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[11px]">
                  {exp.responsibilities.map((bullet, idx) => (
                    <li key={idx} className="leading-snug">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!enabledSections.projects || projects.length === 0) return null;
    return (
      <section className="text-left">
        {renderSectionHeader('Technical Projects')}
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-black">
                  {proj.name}
                  {proj.role && <span className="font-normal text-slate-700"> – {proj.role}</span>}
                </div>
                <div className="text-[10px] text-slate-600 font-mono">
                  {proj.githubUrl && <span>{proj.githubUrl}</span>}
                </div>
              </div>

              {proj.technologies && proj.technologies.length > 0 && (
                <div className="text-[10px] text-slate-700 font-mono">
                  <span className="font-semibold">Stack:</span> {proj.technologies.join(', ')}
                </div>
              )}

              {proj.bullets && proj.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-[11px]">
                  {proj.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (!enabledSections.education || education.length === 0) return null;
    return (
      <section className="text-left">
        {renderSectionHeader('Education')}
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-black">
                  {edu.institution} <span className="font-normal text-slate-700">| {edu.degree} in {edu.fieldOfStudy}</span>
                </div>
                <div className="text-[11px] text-slate-700 font-mono shrink-0">
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-700">
                {edu.location && <span>{edu.location}</span>}
                {edu.gpa && <span className="font-semibold">GPA: {edu.gpa}</span>}
              </div>
              {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                <div className="text-[10px] text-slate-600 mt-0.5">
                  Coursework: {edu.relevantCoursework.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (!enabledSections.certifications || certifications.length === 0) return null;
    return (
      <section className="text-left">
        {renderSectionHeader('Certifications & Credentials')}
        <div className="space-y-1 text-slate-800 text-[11px]">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <div>
                <span className="font-semibold text-black">{cert.name}</span> – {cert.issuingOrg}
                {cert.credentialId && <span className="text-slate-600 font-mono"> (ID: {cert.credentialId})</span>}
              </div>
              <span className="text-slate-600 font-mono text-[10px]">{cert.issueDate}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderAchievements = () => {
    if (!enabledSections.achievements || achievements.length === 0) return null;
    return (
      <section className="text-left">
        {renderSectionHeader('Achievements & Awards')}
        <div className="space-y-1 text-slate-800 text-[11px]">
          {achievements.map((ach) => (
            <div key={ach.id}>
              <div className="flex justify-between">
                <span className="font-semibold text-black">{ach.title}</span>
                <span className="text-slate-600 font-mono text-[10px]">{ach.date}</span>
              </div>
              <p className="text-slate-700 leading-snug">{ach.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCustomSections = () => {
    if (!enabledSections.custom || customSections.length === 0) return null;
    return (
      <>
        {customSections.filter((cs) => cs.enabled).map((sec) => (
          <section key={sec.id} className="text-left">
            {renderSectionHeader(sec.name)}
            <div className="space-y-1.5 text-slate-800 text-[11px]">
              {sec.items.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between font-semibold text-black">
                    <span>{item.title} {item.subtitle && <span className="font-normal text-slate-700">– {item.subtitle}</span>}</span>
                    {item.date && <span className="text-slate-600 font-mono text-[10px] font-normal">{item.date}</span>}
                  </div>
                  {item.description && <p className="text-slate-700 leading-snug">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </>
    );
  };

  // Render ordered sections
  const renderSectionById = (id: string) => {
    switch (id) {
      case 'contact':
        return renderContact();
      case 'summary':
        return renderSummary();
      case 'skills':
        return renderSkills();
      case 'experience':
        return renderExperience();
      case 'projects':
        return renderProjects();
      case 'education':
        return renderEducation();
      case 'certifications':
        return renderCertifications();
      case 'achievements':
        return renderAchievements();
      case 'custom':
        return renderCustomSections();
      default:
        return null;
    }
  };

  return (
    <div
      id="resume-printable-area"
      className={`bg-white text-black shadow-2xl rounded-sm mx-auto transition-all ${getFontFamilyClass()} ${getFontSizeClass()} ${getMarginClass()}`}
      style={{
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      <div className={getSpacingClass()}>
        {sectionsOrder.map((sectionId) => (
          <React.Fragment key={sectionId}>
            {renderSectionById(sectionId)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
