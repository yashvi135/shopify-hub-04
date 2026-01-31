import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'STORE_OWNER';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentStoreId: string | null;
  setCurrentStoreId: (id: string | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('SUPER_ADMIN');
  const [currentStoreId, setCurrentStoreId] = useState<string | null>('1');

  return (
    <RoleContext.Provider value={{ role, setRole, currentStoreId, setCurrentStoreId }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
