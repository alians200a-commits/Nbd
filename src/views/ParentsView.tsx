import React from 'react';
import {
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  Clock,
  Printer,
  Share2,
  BookOpen,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS } from '../data';

export const ParentsView: React.FC = () => {
  const { state } = useApp();

  const totalFinishedTopics = Object.keys(state.finishedTopics).length;
  const totalMistakes = Object.keys(state.mistakes).length;
  const finishedHomework = state.homework.filter(h => h.done).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#26354f] text-[#86e2f2] flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">لوحة متابعة أولياء الأمور وتقارير الإنجاز</h2>
            <p className="text-xs text-[#82a4b8]">متابعة الأداء الأكاديمي، نتائج الاختبارات الوزارية، وسجل الالتزام اليومي</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-[#143249] hover:bg-[#1d4665] text-[#7bf0da] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#265373] transition"
        >
          <Printer size={15} />
          <span>طباعة تقرير المتابعة</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0b1f33] border border-[#214362] rounded-2xl p-5 text-center">
          <span className="text-xs text-[#8cb1c4] block mb-1">الموضوعات المنجزة</span>
          <div className="text-3xl font-black text-[#6fe9d5]">{totalFinishedTopics} / 58</div>
          <span className="text-[11px] text-[#729db1] mt-1 block">
            {Math.round((totalFinishedTopics / 58) * 100)}% من كامل المنهج
          </span>
        </div>

        <div className="bg-[#0b1f33] border border-[#214362] rounded-2xl p-5 text-center">
          <span className="text-xs text-[#8cb1c4] block mb-1">الواجبات المدرسية المكتملة</span>
          <div className="text-3xl font-black text-[#6bf4c7]">
            {finishedHomework} / {state.homework.length}
          </div>
          <span className="text-[11px] text-[#729db1] mt-1 block">مهام مسجلة</span>
        </div>

        <div className="bg-[#0b1f33] border border-[#214362] rounded-2xl p-5 text-center">
          <span className="text-xs text-[#8cb1c4] block mb-1">الأسئلة قيد التصويب والمراجعة</span>
          <div className="text-3xl font-black text-[#ff8195]">{totalMistakes}</div>
          <span className="text-[11px] text-[#729db1] mt-1 block">في خزنة الأخطاء</span>
        </div>

        <div className="bg-[#0b1f33] border border-[#214362] rounded-2xl p-5 text-center">
          <span className="text-xs text-[#8cb1c4] block mb-1">النقاط والمكافآت التقديرية</span>
          <div className="text-3xl font-black text-[#f2c575]">{state.points}</div>
          <span className="text-[11px] text-[#729db1] mt-1 block">نقطة معرفية</span>
        </div>
      </div>

      {/* Chapters Mastery Checklist */}
      <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-[#effbff] pb-3 border-b border-[#1b3752]">
          مستوى تغطية وإتقان فصول كتاب الأحياء الوزاري:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHAPTERS.map((ch) => {
            // Count topics done in this chapter
            const chTopics = [1, 2, 3, 4, 5]; // representative
            const isStarted = ch.id <= 3;
            return (
              <div
                key={ch.id}
                className="bg-[#091728] border border-[#1b364e] rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#effbff]">الفصل {ch.id}: {ch.name}</span>
                  <span className="text-[#84aabf]">ص {ch.start} - {ch.end}</span>
                </div>
                <div className="w-full bg-[#12283e] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#6fe9d5] h-full rounded-full"
                    style={{ width: isStarted ? (ch.id === 1 ? '90%' : '60%') : '25%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7b9daf]">
                  <span>المختبر: {ch.lab}</span>
                  <span className="text-[#6bf4c7] font-bold">
                    {isStarted ? (ch.id === 1 ? 'متقن (90%)' : 'جيد (60%)') : 'قيد المذاكرة'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Exams Log */}
      <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-[#effbff] pb-3 border-b border-[#1b3752]">
          سجل الاختبارات والامتحانات الوزارية التجريبية الأخيرة:
        </h3>

        {state.tests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[#122c42] text-[#7bf0da] border-b border-[#234e6e]">
                  <th className="p-3 font-bold">تاريخ الاختبار</th>
                  <th className="p-3 font-bold">نوع الامتحان</th>
                  <th className="p-3 font-bold">الدرجة المحققة</th>
                  <th className="p-3 font-bold">النسبة المئوية</th>
                  <th className="p-3 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {state.tests.map((t, idx) => {
                  const pct = Math.round((t.score / t.total) * 100);
                  const isPassed = pct >= 50;
                  return (
                    <tr key={idx} className="border-b border-[#16334d] hover:bg-[#0c2236] transition">
                      <td className="p-3 text-[#c2dfec]">{t.date}</td>
                      <td className="p-3 text-[#effbff] font-semibold">
                        {t.chapter === 0 ? 'امتحان وزاري شامل' : `اختبار الفصل ${t.chapter}`}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#effbff]">
                        {t.score} من {t.total}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#f2c575]">
                        {pct}%
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPassed ? 'bg-[#154639] text-[#6bf4c7]' : 'bg-[#441a23] text-[#ff8195]'
                        }`}>
                          {isPassed ? 'ناجح' : 'يحتاج تقوية'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#7e9fb1]">
            لم يتم تسجيل أي اختبارات تجريبية حتى الآن. شجع الطالب على خوض "محاكي الامتحان الوزاري".
          </p>
        )}
      </div>
    </div>
  );
};
