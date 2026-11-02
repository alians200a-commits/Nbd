import React from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { useApp } from '../context/AppContext';
import { TABLER_CHAPTERS } from '../data/tablerData';
import { TabType } from '../components/Sidebar';

interface TablerHomeViewProps {
  onNavigateTab: (tab: TabType, params?: { chapter?: number }) => void;
}

export const TablerHomeView: React.FC<TablerHomeViewProps> = ({ onNavigateTab }) => {
  const { state } = useApp();

  const finishedCount = Object.keys(state.finishedTopics).length;
  const mistakesCount = Object.keys(state.mistakes).length;
  const progressPercent = Math.min(100, Math.round((finishedCount / 11) * 100));

  return (
    <div className="space-y-4">
      {/* Hero Card (Tabler bg-azure-lt) */}
      <div className="card bg-[#e6f4fe] border-0 shadow-sm rounded-3xl overflow-hidden p-6 sm:p-8">
        <div className="row align-items-center g-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 space-y-3">
            <span className="badge bg-[#0054a6] text-white px-3 py-1 rounded-full text-xs font-bold inline-block">
              رحلتك في الأحياء
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182433] leading-tight">
              خلّ المعلومة تشوفها بعينك، مو تحفظها وبس.
            </h2>
            <p className="text-[#626976] text-sm leading-relaxed max-w-xl">
              ابدأ بدرس، استكشف المجسم الحقيقي، جاوب الأسئلة، وخلي النظام يرجعلك أخطاءك بوقت مناسب.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('chapters')}
                className="btn btn-primary bg-[#0054a6] hover:bg-[#004284] text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition"
              >
                <TablerIcon name="book" size={18} />
                <span>ابدأ الدروس</span>
              </button>
              <button
                onClick={() => onNavigateTab('lab')}
                className="btn btn-outline-primary border border-[#0054a6] text-[#0054a6] hover:bg-[#0054a6]/10 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition"
              >
                <TablerIcon name="brain" size={18} />
                <span>استكشف المجسمات</span>
              </button>
            </div>
          </div>

          <div className="md:w-1/3 w-full">
            <div className="card bg-white border border-[#e6e8eb] shadow-sm rounded-2xl p-5">
              <div className="text-base font-bold text-[#182433] mb-2">تقدّمك في المنهج</div>
              <div className="w-full bg-[#e6e8eb] h-3 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-[#2fb344] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-[#626976] mb-2 font-mono">
                <span>{progressPercent}% مكتمل</span>
                <span>{finishedCount} من 11 فصلاً</span>
              </div>
              <div className="text-[11px] text-[#868e96] border-t border-[#f1f3f5] pt-2">
                يُحفظ على هذا الجهاز فقط. حساب الطالب والمزامنة غير مربوطين بعد.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-white border border-[#e6e8eb] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e6f4fe] text-[#0054a6] flex items-center justify-center">
            <TablerIcon name="book" size={24} />
          </div>
          <div>
            <span className="text-xs text-[#626976] block">فصول تمت مراجعتها</span>
            <div className="text-xl font-bold text-[#182433]">{finishedCount} / 11</div>
          </div>
        </div>

        <div className="card bg-white border border-[#e6e8eb] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#ffeceb] text-[#d63939] flex items-center justify-center">
            <TablerIcon name="bookmark" size={24} />
          </div>
          <div>
            <span className="text-xs text-[#626976] block">أخطاء محفوظة للمتابعة</span>
            <div className="text-xl font-bold text-[#182433]">{mistakesCount}</div>
          </div>
        </div>

        <div className="card bg-white border border-[#e6e8eb] rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e6fffa] text-[#0ca678] flex items-center justify-center">
            <TablerIcon name="calendar-event" size={24} />
          </div>
          <div>
            <span className="text-xs text-[#626976] block">أسئلة تستحق المراجعة</span>
            <div className="text-xl font-bold text-[#182433]">
              {mistakesCount > 0 ? `${mistakesCount} أسئلة` : 'مكتملة حالياً'}
            </div>
          </div>
        </div>
      </div>

      {/* Next Study Step Card */}
      <div className="card bg-white border border-[#e6e8eb] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#0054a6]">خطوتك التالية في الدراسة</div>
            <h3 className="text-lg font-bold text-[#182433]">الفصل الأول — الجهاز العصبي</h3>
            <p className="text-xs text-[#626976]">
              الخلية العصبية والدماغ والحبل الشوكي • صفحة الكتاب المنهجي: ص 5
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigateTab('lab')}
              className="flex-1 md:flex-initial btn btn-primary bg-[#0054a6] hover:bg-[#004284] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <TablerIcon name="brain" size={16} />
              <span>افتح مجسم الدماغ 3D</span>
            </button>
            <button
              onClick={() => onNavigateTab('quiz')}
              className="flex-1 md:flex-initial btn btn-outline-secondary border border-[#dce1e7] hover:bg-[#f8fafc] text-[#182433] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <TablerIcon name="clipboard-check" size={16} />
              <span>اختبر فهمك</span>
            </button>
          </div>
        </div>
      </div>

      {/* Open-Source Provenance & Ethics Ribbon */}
      <div className="card bg-[#f8fafc] border border-[#e6e8eb] rounded-2xl p-5 text-xs text-[#626976] leading-relaxed">
        <div className="flex items-center justify-between mb-2">
          <strong className="text-[#182433] text-sm flex items-center gap-2">
            <TablerIcon name="search" size={18} />
            <span>أمانة المصدر العلمي والتصميمي</span>
          </strong>
          <button
            onClick={() => onNavigateTab('sources')}
            className="text-[#0054a6] hover:underline font-bold text-xs"
          >
            عرض وثيقة المصادر والرخص ←
          </button>
        </div>
        <p>
          واجهة <b>نَبْض 8.0</b> مبنية بالكامل على مكونات مكتبة <b>Tabler</b> وأيقونات <b>Tabler Icons</b> الرسمية من GitHub، والمجسمات التشريحية مستدعاة من مشاريع <b>OrganUI</b> المفتوحة. لا توجد أي عناصر واجهة أو أيقونات مُولّدة اصطناعياً.
        </p>
      </div>
    </div>
  );
};
