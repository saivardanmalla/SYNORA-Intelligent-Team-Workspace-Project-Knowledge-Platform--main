import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  switchUser: (userId: string) => void;
  updateRole: (userId: string, role: UserRole) => Promise<void>;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isLead: boolean;
  canManageTeam: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const fetchedUsers = await api.getUsers();
        setUsers(fetchedUsers);
        
        // Check saved user or default to Sai Vardan (primary authenticated engineer)
        const savedUserId = localStorage.getItem('synora_active_user_id');
        const found = fetchedUsers.find((u) => u.id === savedUserId) || fetchedUsers[0];
        setCurrentUser(found || null);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('synora_active_user_id', user.id);
      api.emitEvent('session', `Switched active session to ${user.name} (${user.role})`, user.name);
    }
  };

  const updateRole = async (userId: string, role: UserRole) => {
    try {
      const updated = await api.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      if (currentUser?.id === userId) {
        setCurrentUser(updated);
      }
      api.emitEvent('role_change', `Updated role for ${updated.name} to ${role}`, currentUser?.name || 'Admin');
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('synora_active_user_id', found.id);
      api.emitEvent('session', `User signed in: ${found.name}`, found.name);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Switch to first available user or guest
    if (users.length > 0) {
      switchUser(users[0].id);
    }
  };

  const isAdmin = currentUser?.role === 'Admin';
  const isLead = currentUser?.role === 'Lead Engineer' || isAdmin;
  const canManageTeam = isAdmin || currentUser?.role === 'Lead Engineer';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        switchUser,
        updateRole,
        login,
        logout,
        isAdmin,
        isLead,
        canManageTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
