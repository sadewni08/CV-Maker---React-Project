import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
}

export interface CVData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  isActive: boolean;
  nationality: string;
  employmentStatus: string;
  termsAccepted: boolean;
  preferredLanguages: string[];
  workExperience: WorkExperience[];
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

interface CVContextType {
  cvs: CVData[];
  createCV: (
      cv: Omit<CVData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => string;
  updateCV: (id: string, updates: Partial<CVData>) => boolean;
  deleteCV: (id: string) => boolean;
  getCVById: (id: string) => CVData | undefined;
  getUserCVs: () => CVData[];
}

/* ------------------------------------------------------------------ */
/* 2.  Context setup                                                   */
/* ------------------------------------------------------------------ */
const CVContext = createContext<CVContextType | undefined>(undefined);

export const useCV = (): CVContextType => {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error('useCV must be used within a CVProvider');
  return ctx;
};

interface Props {
  children: ReactNode;
}

/* ------------------------------------------------------------------ */
/* 3.  Helper functions                                                */
/* ------------------------------------------------------------------ */
const LS_KEY = 'cvs';

const safeParse = (json: string | null): CVData[] => {
  try {
    const data = JSON.parse(json ?? '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (data: CVData[]) =>
    localStorage.setItem(LS_KEY, JSON.stringify(data));

/* ------------------------------------------------------------------ */
/* 4.  Provider implementation                                        */
/* ------------------------------------------------------------------ */
export const CVProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  const [cvs, setCVs] = useState<CVData[]>([]);

  /* ----- Load CVs whenever the logged-in user changes -------------- */
  useEffect(() => {
    if (!user) return setCVs([]);
    const all = safeParse(localStorage.getItem(LS_KEY));
    setCVs(all.filter((cv) => cv.userId === user.id));
  }, [user]);

  /* ----- Keep multiple tabs in sync -------------------------------- */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) {
        const all = safeParse(e.newValue);
        setCVs(all.filter((cv) => cv.userId === user?.id));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  /* ----- Internal setter that always mirrors localStorage ---------- */
  const write = (next: CVData[]) => {
    saveToLocalStorage(next);
    setCVs(next);
  };

  /* ----------------------- CRUD API -------------------------------- */
  const createCV = (
      data: Omit<CVData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): string => {
    if (!user) throw new Error('User must be authenticated');

    const newCV: CVData = {
      ...data,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    write([...cvs, newCV]);
    return newCV.id;
  };

  const updateCV = (id: string, updates: Partial<CVData>): boolean => {
    if (!user) return false;

    const idx = cvs.findIndex((cv) => cv.id === id && cv.userId === user.id);
    if (idx === -1) return false;

    const next = [...cvs];
    next[idx] = { ...next[idx], ...updates, updatedAt: new Date().toISOString() };
    write(next);
    return true;
  };

  const deleteCV = (id: string): boolean => {
    if (!user) return false;
    const next = cvs.filter((cv) => !(cv.id === id && cv.userId === user.id));
    if (next.length === cvs.length) return false;
    write(next);
    return true;
  };

  const getCVById = (id: string) =>
      user ? cvs.find((cv) => cv.id === id && cv.userId === user.id) : undefined;

  const getUserCVs = () => (user ? cvs : []);

  /* ------------------------------------------------------------------ */
  /* 5.  Context value                                                  */
  /* ------------------------------------------------------------------ */
  const value: CVContextType = {
    cvs,
    createCV,
    updateCV,
    deleteCV,
    getCVById,
    getUserCVs,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};
