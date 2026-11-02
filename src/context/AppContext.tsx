import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from '../types';

const STORAGE_KEY = 'nabd_biology_mvp_v1';

interface AppContextType {
  state: AppState;
  addPoints: (amount: number) => void;
  recordTest: (chapter: number, score: number, total: number) => void;
  addMistake: (key: string, data: { question: string; chosen: string; correct: string; chapter: number; page: number }) => void;
  removeMistake: (key: string) => void;
  completeTopic: (topicId: string) => void;
  toggleBookmark: (page: number) => void;
  toggleHomework: (id: string) => void;
  setSpeaker: (speaker: 'B' | 'A') => void;
}

const defaultState: AppState = {
  points: 120,
  tests: [],
  mistakes: {},
  cards: {},
  finishedTopics: {},
  homework: [
    { id: 'hw-1', title: 'مراجعة أجزاء الخلية العصبية ووظائف التشجرات', chapter: 1, done: false, dueDate: 'غداً' },
    { id: 'hw-2', title: 'حفظ مكونات القوس الانعكاسي مع الرسم', chapter: 1, done: false, dueDate: 'هذا الأسبوع' },
    { id: 'hw-3', title: 'المقارنة بين العضلات الهيكلية والملساء والقلبية', chapter: 3, done: false, dueDate: 'الأسبوع القادم' },
  ],
  studySessions: [],
  dailyProgress: {},
  bookmarkedPages: [6, 18, 33],
  teacherVoiceSpeaker: 'B',
  speechRate: 1.0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error('Error loading Nabd state', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving Nabd state', e);
    }
  }, [state]);

  const addPoints = (amount: number) => {
    setState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const recordTest = (chapter: number, score: number, total: number) => {
    const today = new Date().toISOString().split('T')[0];
    const earnedPoints = score * 10;
    setState(prev => ({
      ...prev,
      points: prev.points + earnedPoints,
      tests: [{ date: today, chapter, score, total }, ...prev.tests],
    }));
  };

  const addMistake = (key: string, data: { question: string; chosen: string; correct: string; chapter: number; page: number }) => {
    setState(prev => ({
      ...prev,
      mistakes: {
        ...prev.mistakes,
        [key]: { ...data, date: new Date().toISOString().split('T')[0] }
      }
    }));
  };

  const removeMistake = (key: string) => {
    setState(prev => {
      const next = { ...prev.mistakes };
      delete next[key];
      return { ...prev, mistakes: next, points: prev.points + 5 };
    });
  };

  const completeTopic = (topicId: string) => {
    setState(prev => ({
      ...prev,
      points: prev.points + 15,
      finishedTopics: { ...prev.finishedTopics, [topicId]: true }
    }));
  };

  const toggleBookmark = (page: number) => {
    setState(prev => {
      const exists = prev.bookmarkedPages.includes(page);
      return {
        ...prev,
        bookmarkedPages: exists
          ? prev.bookmarkedPages.filter(p => p !== page)
          : [...prev.bookmarkedPages, page]
      };
    });
  };

  const toggleHomework = (id: string) => {
    setState(prev => ({
      ...prev,
      homework: prev.homework.map(h => h.id === id ? { ...h, done: !h.done } : h)
    }));
  };

  const setSpeaker = (speaker: 'B' | 'A') => {
    setState(prev => ({ ...prev, teacherVoiceSpeaker: speaker }));
  };

  return (
    <AppContext.Provider value={{
      state,
      addPoints,
      recordTest,
      addMistake,
      removeMistake,
      completeTopic,
      toggleBookmark,
      toggleHomework,
      setSpeaker
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
