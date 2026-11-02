import React from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { useApp } from '../context/AppContext';
import { TABLER_CHAPTERS } from '../data/tablerData';
import { TabType } from '../components/Sidebar';
import {
  Award,
  Layers,
  Bookmark,
  MessageCircle,
  Calendar,
  Moon,
  Users,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Volume2
} from 'lucide-react';

interface TablerHomeViewProps {
  onNavigateTab: (tab: TabType, params?: { chapter?: number }) => void;
}

export const TablerHomeView: React.FC<TablerHomeViewProps> = ({ onNavigateTab }) => {
  const { state } = useApp();

  const finishedCount = Object.keys(state.finishedTopics).length;
  const mistakesCount = Object.keys(state.mistakes).length;
  const progressPercent = Math.min(100, Math.round((finishedCount / 11) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0054a6] via-[#004284] to-[#002852] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="badge bg-white/10 text-[#7bf0da] px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20 inline-flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>منصة نَبْض التفاعلية · منهج الأحياء للثالث المتوسط العراقي</span>
          </span>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight text-white">
            افهم كل تفصيلة، شوف العضو بثلاثة أبعاد، واضمن الـ 100 بالوزاري!
          </h1>

          <p className="text-xs sm:text-sm text-[#d0ebfd] leading-relaxed">
            حل شامل لمشكلة كثافة المنهج والنسيان: مجسمات تشريحية 360°، بنك الأسئلة الوزارية الكامل من ملزمة كنز الأحياء (486 سؤالاً)، خزنة الأخطاء بالتكرار المتباعد، ومعلّمة صوتية بلهجة عراقية حنونة.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => onNavigateTab('ministryExam')}
              className="bg-[#36e0dd] hover:bg-[#20b8b5] text-[#071321] font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 shadow-md"
            >
              <Award size={18} />
              <span>بنك الأسئلة الوزارية (486 سؤالاً)</span>
            </button>
            <button
              onClick={() => onNavigateTab('lab')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 border border-white/20"
            >
              <Layers size={18} />
              <span>المختبر التشريحي 3D</span>
            </button>
            <button
              onClick={() => onNavigateTab('assistant')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 border border-white/20"
            >
              <Volume2 size={18} />
              <span>المعلّمة الصوتية (ست نور)</span>
            </button>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#36e0dd]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Feature Navigation Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-[#182433]">أقسام المنصة الذكية المتكاملة:</h2>
          <span className="text-xs text-[#868e96]">كل ما تحتاجه للدرجة الكاملة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Ministerial Bank */}
          <div
            onClick={() => onNavigateTab('ministryExam')}
            className="bg-white border border-[#e6e8eb] hover:border-[#0054a6] rounded-3xl p-5 shadow-sm transition cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#e6f4fe] text-[#0054a6] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#182433] group-hover:text-[#0054a6] transition">
                بنك الأسئلة الوزارية
              </h3>
              <p className="text-xs text-[#626976] mt-1 leading-relaxed">
                كل أسئلة الملزمة المؤشرة بسنواتها وأدوارها من 2000 إلى 2023 مع الأجوبة النموذجية.
              </p>
            </div>
          </div>

          {/* Card 2: 3D Anatomy Lab */}
          <div
            onClick={() => onNavigateTab('lab')}
            className="bg-white border border-[#e6e8eb] hover:border-[#0ca678] rounded-3xl p-5 shadow-sm transition cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#e6fffa] text-[#0ca678] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#182433] group-hover:text-[#0ca678] transition">
                المختبر التشريحي 3D
              </h3>
              <p className="text-xs text-[#626976] mt-1 leading-relaxed">
                أعضاء حقيقية 360°، إخفاء التسميات للاختبار الذاتي، وفحص وظيفة كل تركيب.
              </p>
            </div>
          </div>

          {/* Card 3: The Mistakes Vault */}
          <div
            onClick={() => onNavigateTab('vault')}
            className="bg-white border border-[#e6e8eb] hover:border-[#d63939] rounded-3xl p-5 shadow-sm transition cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff5f5] text-[#d63939] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition">
              <Bookmark size={24} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#182433] group-hover:text-[#d63939] transition">
                  خزنة الأخطاء
                </h3>
                {mistakesCount > 0 && (
                  <span className="badge bg-[#ffe3e3] text-[#c92a2a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {mistakesCount} أخطاء
                  </span>
                )}
              </div>
              <p className="text-xs text-[#626976] mt-1 leading-relaxed">
                طبيب الأخطاء التشخيصي + توليد امتحان مخصص فقط من أخطائك السابقة.
              </p>
            </div>
          </div>

          {/* Card 4: Exam Night Mode */}
          <div
            onClick={() => onNavigateTab('examNight')}
            className="bg-white border border-[#e6e8eb] hover:border-[#f59f00] rounded-3xl p-5 shadow-sm transition cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff9db] text-[#f59f00] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition">
              <Moon size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#182433] group-hover:text-[#f59f00] transition">
                وضع ليلة الامتحان
              </h3>
              <p className="text-xs text-[#626976] mt-1 leading-relaxed">
                المرشحات الذهبية، التعاليل الأكثر تكراراً، أهم المقارنات، والرسوم الإلزامية.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Tools Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Iraqi Voice Tutor */}
        <div
          onClick={() => onNavigateTab('assistant')}
          className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#0054a6] transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e6f4fe] text-[#0054a6] flex items-center justify-center shrink-0">
            <Volume2 size={24} />
          </div>
          <div>
            <strong className="text-sm font-black text-[#182433] block">المعلّمة الصوتية (ست نور)</strong>
            <span className="text-xs text-[#626976] mt-0.5 block">شرح صوتي عراقي حقيقي + خرائط ذهنية</span>
          </div>
        </div>

        {/* Study Planner */}
        <div
          onClick={() => onNavigateTab('planner')}
          className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#0054a6] transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e6fffa] text-[#0ca678] flex items-center justify-center shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <strong className="text-sm font-black text-[#182433] block">جدول المراجعة الذكي</strong>
            <span className="text-xs text-[#626976] mt-0.5 block">تقسيم الـ 132 صفحة + وضع منع التشتت</span>
          </div>
        </div>

        {/* Parents Portal */}
        <div
          onClick={() => onNavigateTab('parents')}
          className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#0054a6] transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#fff4e6] text-[#d9480f] flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <strong className="text-sm font-black text-[#182433] block">متابعة الأهل والجاهزية</strong>
            <span className="text-xs text-[#626976] mt-0.5 block">مقياس الجاهزية للوزاري + تقارير واتساب</span>
          </div>
        </div>
      </div>

      {/* Chapters Fast Navigator */}
      <div className="bg-white border border-[#e6e8eb] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1f3f5] pb-3">
          <h3 className="text-base font-black text-[#182433]">فصول المنهج العراقي (11 فصلاً):</h3>
          <button
            onClick={() => onNavigateTab('chapters')}
            className="text-xs font-bold text-[#0054a6] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الدروس</span>
            <ArrowLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {TABLER_CHAPTERS.map(ch => (
            <button
              key={ch.id}
              onClick={() => onNavigateTab('chapters', { chapter: ch.id })}
              className="text-right p-3 rounded-2xl border border-[#e6e8eb] hover:border-[#0054a6] bg-[#f8fafc] hover:bg-[#e6f4fe] transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="badge bg-[#e6f4fe] text-[#0054a6] text-[10px] font-bold px-2 py-0.5 rounded-md">
                  فصل {ch.id}
                </span>
                <span className="text-[10px] text-[#868e96]">ص {ch.page}</span>
              </div>
              <strong className="text-xs font-bold text-[#182433] block truncate">
                {ch.name}
              </strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
