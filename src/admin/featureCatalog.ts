import appSource from '../App.tsx?raw';
import { TABLER_CHAPTERS } from '../data/tablerData';

/** Auto-discovered during EVERY Vite build; new student routes/views join without hand-editing dashboard. */
const registeredRoutes = Array.from(appSource.matchAll(/\bcase\s+['"]([a-zA-Z0-9]+)['"]\s*:/g), match => match[1]);
const viewFiles = Object.keys(import.meta.glob('../views/*.tsx')).map(path => path.split('/').pop()?.replace('.tsx','') || path);
const humanNames: Record<string,string> = {
  home:'الرئيسية',chapters:'الدروس',lab:'المختبر',atlas:'المجسمات',quiz:'الاختبارات',
  vault:'المراجعة',planner:'جدول الدراسة',assistant:'المساعد الذكي',sources:'المصادر',
  membraneSim:'محاكاة الغشاء',curriculum:'الكتاب المدرسي',experiments:'التجارب',
  reflex:'القوس الانعكاسي',ministryExam:'التدريب الوزاري',figureStudio:'الرسوم العلمية',
  examNight:'ليلة الامتحان',voiceCoach:'التدريب الصوتي',organSim:'محاكاة الأعضاء',
  games:'الألعاب التعليمية',parents:'ولي الأمر'
};
export const studentFeatures = [...new Set(['home','chapters',...registeredRoutes])].map(id => ({
  id, title: humanNames[id] || id, enabled: true
}));
export const discoveredViews = viewFiles;
export const biologyChapters = TABLER_CHAPTERS.map(c=>({id:c.id,title:c.name,description:c.desc}));

/** New admin modules placed in ./modules/*.tsx appear automatically after build. */
export interface AdminModule {
  title: string;
  description: string;
  icon?: string;
  Component: React.ComponentType;
}
const adminFiles = import.meta.glob<{ default: AdminModule }>('./modules/*.tsx', { eager:true });
export const adminModules = Object.entries(adminFiles).filter(([,value])=>Boolean(value.default?.Component))
  .map(([path, value])=>({id:path.split('/').pop()?.replace(/\.tsx$/,'') || path,...value.default}));
