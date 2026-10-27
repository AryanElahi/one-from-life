import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Lesson, Keep, Reflection, UserQuota, TopicType, AppView, ThemeMode } from '../types';

interface AppContextType {
  user: User | null;
  token: string | null;
  currentLesson: Lesson | null;
  quota: UserQuota | null;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  reflectModalLesson: Lesson | null;
  setReflectModalLesson: (lesson: Lesson | null) => void;
  shareCardLesson: Lesson | null;
  setShareCardLesson: (lesson: Lesson | null) => void;
  reportModalLesson: Lesson | null;
  setReportModalLesson: (lesson: Lesson | null) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  login: (email: string) => Promise<void>;
  signup: (data: { email: string; displayName: string; age: number; country: string; city?: string; anonymousMode?: boolean }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  publishLesson: (data: { text: string; context?: string; topics: TopicType[] }) => Promise<Lesson>;
  toggleKeep: (lessonId: string) => Promise<boolean>;
  saveReflection: (lessonId: string, text: string) => Promise<void>;
  markNeeded: (lessonId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TOKEN_KEY = 'one_from_a_life_token';
const THEME_KEY = 'one_from_a_life_theme';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [quota, setQuota] = useState<UserQuota | null>({
    keepsUsedThisMonth: 0,
    maxKeepsPerMonth: 3,
    neededUsedThisWeek: 0,
    maxNeededPerWeek: 1,
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [activeView, setActiveView] = useState<AppView>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reflectModalLesson, setReflectModalLesson] = useState<Lesson | null>(null);
  const [shareCardLesson, setShareCardLesson] = useState<Lesson | null>(null);
  const [reportModalLesson, setReportModalLesson] = useState<Lesson | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setCurrentLesson(data.currentLesson || null);
          if (data.quota) setQuota(data.quota);
        } else {
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch (err) {
      console.error('Error loading session:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    }
  }, [token]);

  const login = async (email: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Unable to log in');
    }
    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    setCurrentLesson(data.currentLesson || null);
    if (data.quota) setQuota(data.quota);
    localStorage.setItem(TOKEN_KEY, data.token);
    setAuthModalOpen(false);
    showToast(`خوش آمدید، ${data.user.displayName}`);
  };

  const signup = async (data: { email: string; displayName: string; age: number; country: string; city?: string; anonymousMode?: boolean }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'امکان ثبت‌نام وجود ندارد');
    }
    const resData = await res.json();
    setUser(resData.user);
    setToken(resData.token);
    setCurrentLesson(null);
    if (resData.quota) setQuota(resData.quota);
    localStorage.setItem(TOKEN_KEY, resData.token);
    setAuthModalOpen(false);
    showToast(`به آرشیو خوش آمدید، ${resData.user.displayName}`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrentLesson(null);
    localStorage.removeItem(TOKEN_KEY);
    setActiveView('landing');
    showToast('با آرامش از حساب خارج شدید.');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) throw new Error('وارد نشده‌اید');
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'خطا در به‌روزرسانی نمایه');
    }
    const resData = await res.json();
    setUser(resData.user);
    if (resData.currentLesson) setCurrentLesson(resData.currentLesson);
    showToast('مشخصات و حضور شما به‌روزرسانی شد.');
  };

  const publishLesson = async (data: { text: string; context?: string; topics: TopicType[] }): Promise<Lesson> => {
    if (!token) {
      setAuthModalOpen(true);
      throw new Error('لطفاً برای ثبت درس زندگی خود، ابتدا وارد شوید.');
    }
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'درس شما منتشر نشد. هیچ تغییری اعمال نشد.');
    }
    const resData = await res.json();
    setCurrentLesson(resData.lesson);
    showToast(
      resData.replacedPrevious
        ? 'درس پیشین شما به بخش خصوصی «سفر شما» منتقل شد. بینش جدید شما اکنون در آرشیو عمومی است.'
        : 'درس شما در آرشیو زنده به یادگار سپرده شد.'
    );
    return resData.lesson;
  };

  const toggleKeep = async (lessonId: string): Promise<boolean> => {
    if (!token) {
      setAuthModalOpen(true);
      showToast('برای همراه داشتن درس‌ها با خود، وارد شوید یا حسابی آرام بسازید.');
      return false;
    }

    const res = await fetch('/api/user/keeps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lessonId }),
    });

    if (!res.ok) {
      const err = await res.json();
      showToast(err.error || 'امکان نگه‌داشتن این درس نیست.');
      return false;
    }

    const data = await res.json();
    if (data.quota) setQuota(data.quota);
    if (data.kept) {
      showToast('این درس در بخش «توشه راه (نگه‌داشته‌ها)» همراه شماست.');
    } else {
      showToast('از بخش توشه راه رها شد.');
    }
    return data.kept;
  };

  const saveReflection = async (lessonId: string, text: string) => {
    if (!token) {
      setAuthModalOpen(true);
      throw new Error('برای ثبت تأملات شخصی ابتدا وارد شوید');
    }

    const res = await fetch('/api/user/reflections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lessonId, text }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'خطا در ذخیره تأمل');
    }

    showToast('تأمل محرمانه شما در خلوتگاه شخصی‌تان ثبت شد.');
  };

  const markNeeded = async (lessonId: string) => {
    if (!token) {
      setAuthModalOpen(true);
      return;
    }

    const res = await fetch(`/api/lessons/${lessonId}/needed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      showToast(err.error || 'امکان ثبت بازخورد وجود ندارد.');
      return;
    }

    if (quota) {
      setQuota({ ...quota, neededUsedThisWeek: quota.neededUsedThisWeek + 1 });
    }
    showToast('پیامی آرام ثبت شد که این درس گره‌گشای دل کسی در این روز بود.');
  };

  const refreshUser = async () => {
    if (token) await fetchCurrentUser(token);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        currentLesson,
        quota,
        activeView,
        setActiveView,
        theme,
        setTheme,
        toggleTheme,
        authModalOpen,
        setAuthModalOpen,
        shareModalOpen,
        setShareModalOpen,
        reflectModalLesson,
        setReflectModalLesson,
        shareCardLesson,
        setShareCardLesson,
        reportModalLesson,
        setReportModalLesson,
        settingsOpen,
        setSettingsOpen,
        login,
        signup,
        logout,
        updateProfile,
        publishLesson,
        toggleKeep,
        saveReflection,
        markNeeded,
        refreshUser,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
