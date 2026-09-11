import React, { useState } from 'react';
import { 
  Users2, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Check, 
  AlertCircle, 
  Mail, 
  Github, 
  Linkedin,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const TeamMembers: React.FC = () => {
  const { users, currentUser, updateRole, isAdmin, isLead } = useAuth();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    try {
      await updateRole(userId, newRole);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const rolesList: UserRole[] = ['Admin', 'Lead Engineer', 'Senior Developer', 'Contributor', 'Intern'];

  const permissionsMatrix = [
    { permission: 'Manage Platform & Organization Settings', admin: true, lead: false, senior: false, contributor: false, intern: false },
    { permission: 'Assign & Update User Roles (RBAC)', admin: true, lead: true, senior: false, contributor: false, intern: false },
    { permission: 'Create & Archive Projects', admin: true, lead: true, senior: true, contributor: false, intern: false },
    { permission: 'Assign Tasks & Review Pull Requests', admin: true, lead: true, senior: true, contributor: false, intern: false },
    { permission: 'Log Commits & Complete Sprint Deliverables', admin: true, lead: true, senior: true, contributor: true, intern: true },
    { permission: 'Compile ATS Resume with Gemini 3.8 Flash', admin: true, lead: true, senior: true, contributor: true, intern: true },
    { permission: 'Publish Verified Developer Portfolio', admin: true, lead: true, senior: true, contributor: true, intern: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800/40">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">Role-Based Access Control & Team Governance</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            SYNORA isolates candidate resumes and career profiles per authenticated user while allowing collaborative sprint orchestration across role tiers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Your Privileges:</span>
          <span className="text-blue-400 font-semibold">{currentUser?.role}</span>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Active Team Engineers ({users.length})</div>
          <div className="text-xs text-slate-400">
            {isAdmin || isLead ? '✓ Role Editing Enabled' : '🔒 View Only (Admin/Lead required to modify)'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e14] text-slate-400 font-medium uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Engineer</th>
                <th className="py-3 px-4">Department & Title</th>
                <th className="py-3 px-4">Active Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">RBAC Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((user) => {
                const isCurrentUser = user.id === currentUser?.id;
                return (
                  <tr key={user.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isCurrentUser && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{user.title}</div>
                      <div className="text-[11px] text-slate-400">{user.department}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-emerald-400 font-mono text-[11px] capitalize">{user.activeStatus}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isAdmin || isLead ? (
                        <select
                          disabled={updatingUserId === user.id}
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="bg-slate-850 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
                        >
                          {rolesList.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-[#111622] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">SYNORA Role Permissions Matrix</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Hierarchical privilege structure ensuring security compliance and team governance.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-[#0b0e14] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">System Capability</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Lead Eng</th>
                <th className="py-2.5 px-3 text-center">Senior Dev</th>
                <th className="py-2.5 px-3 text-center">Contributor</th>
                <th className="py-2.5 px-3 text-center">Intern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/20">
                  <td className="py-2.5 px-3 text-slate-200 font-sans text-xs">{row.permission}</td>
                  <td className="py-2.5 px-3 text-center">{row.admin ? <span className="text-emerald-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="py-2.5 px-3 text-center">{row.lead ? <span className="text-emerald-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="py-2.5 px-3 text-center">{row.senior ? <span className="text-emerald-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="py-2.5 px-3 text-center">{row.contributor ? <span className="text-emerald-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="py-2.5 px-3 text-center">{row.intern ? <span className="text-emerald-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
