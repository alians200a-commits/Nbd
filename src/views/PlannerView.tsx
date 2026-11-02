import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Bookmark,
  BookOpen,
  Sparkles,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PlannerViewProps {
  onNavigateToPage?: (page: number) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ onNavigateToPage }) => {
  const { state, toggleHomework, addPoints } = useApp();
  const [newHwTitle, setNewHwTitle] = useState<string>('');
  const [newHwChapter, setNewHwChapter] = useState<number>(1);

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle.trim()) return;

    state.homework.push({
      id: 'hw-' + Date.now(),
      title: newHwTitle.trim(),
      chapter: newHwChapter,
      done: false,
      dueDate: 'هذا الأسبوع'
    });
    setNewHwTitle('');
    addPoints(5);
  };

  const weeklySchedule = [
    { day: 'السبت', target: 'الفصل الأول: الجهاز العصبي ومحاكاة القوس الانعكاسي', pages: 'ص 5 - 14' },
    { day: 'الأحد', target: 'الفصل الثاني: الجهاز الهيكلي، العظام والمفاصل', pages: 'ص 15 - 30' },
    { day: 'الإثنين', target: 'الفصل الثالث: الجهاز العضلي وأنواع العضلات والإعياء', pages: 'ص 31 - 40' },
    { day: 'الثلاثاء', target: 'الفصل الرابع: الجهاز الهضمي والأسنان والغدد الملحقة', pages: 'ص 41 - 56' },
    { day: 'الأربعاء', target: 'الفصل الخامس: جهاز الدوران ونبض القلب والدم', pages: 'ص 57 - 70' },
    { day: 'الخميس', target: 'الفصل السادس والسابع: التنفس والإخراج البولي', pages: 'ص 71 - 92' },
    { day: 'الجمعة', target: 'مراجعة أسبوعية شاملة وحل 20 سؤالاً وزارياً من بنك الأسئلة', pages: 'مراجعة عامة' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#283b54] text-[#84d9f5] flex items-center justify-center font-bold">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">جدول الدراسة الأسبوعي وخطة المنهج</h2>
            <p className="text-xs text-[#82a4b8]">تنظيم المذاكرة اليومية وتتبع إنجاز الواجبات المنزلية</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#091728] border border-[#1d3952] px-3.5 py-1.5 rounded-xl text-xs">
          <Flame size={16} className="text-[#f2c575]" />
          <span className="text-[#cbe4f2]">سلسلة الالتزام: <b>4 أيام متتالية</b></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Plan */}
        <div className="lg:col-span-7 bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-[#effbff] flex items-center gap-2 pb-3 border-b border-[#1b3752]">
            <Sparkles size={16} className="text-[#f2c575]" />
            <span>الجدول الدراسي المقترح للمنهج (7 أيام):</span>
          </h3>

          <div className="space-y-2.5">
            {weeklySchedule.map((plan, idx) => (
              <div
                key={idx}
                className="bg-[#091728] border border-[#1b364e] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-bold text-[#6fe9d5] block mb-0.5">{plan.day}</span>
                  <h4 className="text-sm font-semibold text-[#effbff]">{plan.target}</h4>
                </div>
                <span className="text-xs text-[#86a8ba] bg-[#12283e] px-2.5 py-1 rounded-lg border border-[#224462] self-start sm:self-auto font-mono">
                  {plan.pages}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Homework & Bookmarks Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Homework Checklist */}
          <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#effbff] pb-3 border-b border-[#1b3752]">
              قائمة الواجبات والمهام المدرسية:
            </h3>

            {/* Add homework form */}
            <form onSubmit={handleAddHomework} className="space-y-2">
              <input
                type="text"
                placeholder="أضف واجباً جديداً (مثال: حفظ وظائف الطحال)..."
                value={newHwTitle}
                onChange={(e) => setNewHwTitle(e.target.value)}
                className="w-full bg-[#081827] border border-[#224765] rounded-xl px-3 py-2 text-xs text-[#effbff] placeholder-[#64889c] focus:outline-none focus:border-[#6fe8d5]"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newHwChapter}
                  onChange={(e) => setNewHwChapter(Number(e.target.value))}
                  className="bg-[#081827] border border-[#224765] rounded-xl px-3 py-1.5 text-xs text-[#effbff] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => (
                    <option key={c} value={c}>الفصل {c}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="flex-1 bg-[#1a4b59] hover:bg-[#256374] text-[#7bf0da] text-xs font-bold py-1.5 rounded-xl border border-[#2d7380] transition flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>إضافة مهمة</span>
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {state.homework.map((hw) => (
                <div
                  key={hw.id}
                  onClick={() => toggleHomework(hw.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                    hw.done
                      ? 'bg-[#0f2a28] border-[#20574d] text-[#6bf4c7] line-through opacity-70'
                      : 'bg-[#091728] border-[#1b364e] text-[#cbe5f2] hover:border-[#2f5c80]'
                  }`}
                >
                  <button className="mt-0.5 text-[#6fe9d5]">
                    {hw.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                  <div className="flex-1">
                    <span className="font-semibold block">{hw.title}</span>
                    <span className="text-[10px] text-[#7698ab]">الفصل {hw.chapter} • الموعد: {hw.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarked Pages */}
          <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#effbff] flex items-center gap-2">
              <Bookmark size={16} className="text-[#f2c575]" />
              <span>الصفحات المحفوظة في العلامات المرجعية:</span>
            </h3>

            {state.bookmarkedPages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {state.bookmarkedPages.map((pg) => (
                  <button
                    key={pg}
                    onClick={() => onNavigateToPage?.(pg)}
                    className="flex items-center gap-1.5 bg-[#091728] hover:bg-[#132c45] border border-[#224462] text-[#86e6d8] px-3 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    <BookOpen size={13} />
                    <span>صفحة {pg}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7b9daf]">
                لم تقم بحفظ أي صفحات بعد. يمكنك الضغط على أيقونة الإشارة المرجعية أثناء قراءة دروس الكتاب.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
