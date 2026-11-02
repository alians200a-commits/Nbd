import React, { useState } from 'react';
import {
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  Clock,
  Printer,
  Share2,
  BookOpen,
  Star,
  Copy,
  Check,
  Send,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS } from '../data';

export const ParentsView: React.FC = () => {
  const { state } = useApp();
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const totalFinishedTopics = Object.keys(state.finishedTopics).length;
  const totalMistakes = Object.keys(state.mistakes).length;
  const finishedHomework = state.homework.filter(h => h.done).length;

  // Calculate realistic Exam Readiness Score (مقياس الجاهزية للامتحان)
  const calculateReadinessScore = () => {
    // 40% from curriculum progress (out of 11 chapters)
    const curriculumFactor = Math.min(40, (totalFinishedTopics / 15) * 40);

    // 35% from test scores
    const avgTestScore = state.tests.length > 0
      ? state.tests.reduce((acc, t) => acc + (t.score / (t.total || 1)), 0) / state.tests.length
      : 0.7; // baseline 70%
    const testFactor = avgTestScore * 35;

    // 25% from mistake resolution (low mistakes = high score)
    const mistakePenalty = Math.min(25, totalMistakes * 2.5);
    const vaultFactor = Math.max(0, 25 - mistakePenalty);

    return Math.min(100, Math.round(curriculumFactor + testFactor + vaultFactor));
  };

  const readinessScore = calculateReadinessScore();

  const getReadinessLevel = (score: number) => {
    if (score >= 85) return { text: 'جاهزية ممتازة (مؤهل لدرجة 95+ في الوزاري)', color: 'text-[#0ca678]', bg: 'bg-[#e6fffa]' };
    if (score >= 65) return { text: 'جاهزية جيدة (يحتاج تصفية خزنة الأخطاء)', color: 'text-[#0054a6]', bg: 'bg-[#e6f4fe]' };
    return { text: 'يحتاج تركيز ومتابعة يومية للواجبات', color: 'text-[#d9480f]', bg: 'bg-[#fff4e6]' };
  };

  const readiness = getReadinessLevel(readinessScore);

  const reportText = `تقرير إنجاز الطالب في مادة الأحياء (الثالث المتوسط) — منصة نَبْض
مقياس الجاهزية للامتحان الوزاري: ${readinessScore}% (${readiness.text})
الفصول والموضوعات المنجزة: ${totalFinishedTopics} من 58
الواجبات المكتملة: ${finishedHomework} من ${state.homework.length}
الأسئلة المتعثرة قيد المراجعة في خزنة الأخطاء: ${totalMistakes}
النقاط المعرفية المحرزة: ${state.points} نقطة
تاريخ التقرير: ${new Date().toLocaleDateString('ar-IQ')}
نصيحة المنصة: الاستمرار في حل بنك الأسئلة الوزارية وتصفية خزنة الأخطاء لضمان التفوق التام.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0054a6] to-[#003875] text-white flex items-center justify-center font-bold shadow-md">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#182433]">بوابة متابعة أولياء الأمور وتقارير الأداء</h2>
            <p className="text-xs text-[#626976]">
              مقياس الجاهزية الحقيقي للامتحان الوزاري، تقارير واتساب الفورية، وتنبيهات الواجبات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="bg-[#2fb344] hover:bg-[#259b3a] text-white font-bold text-xs px-4 py-2 rounded-2xl transition flex items-center gap-1.5 shadow-sm"
          >
            {copiedReport ? <Check size={15} /> : <Share2 size={15} />}
            <span>{copiedReport ? 'تم نسخ التقرير لواتساب' : 'مشاركة تقرير واتساب للأهل'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-white border border-[#dce1e7] hover:bg-[#f8fafc] text-[#182433] font-bold text-xs px-4 py-2 rounded-2xl transition flex items-center gap-1.5"
          >
            <Printer size={15} />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Main Readiness Gauge Card */}
      <div className="bg-gradient-to-br from-[#0054a6] to-[#002f5e] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#b8e2fb] font-bold block mb-1">
              مؤشر الذكاء الاصطناعي التراكمي
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">مقياس الجاهزية للامتحان الوزاري</h3>
            <p className="text-xs text-[#d0ebfd] max-w-md mt-1">
              درجة تقديرية مبنية على إتقان الفصول، حل الأسئلة الوزارية، وتصفية خزنة الأخطاء
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
            <div className="text-4xl sm:text-5xl font-black text-[#6bf4c7] font-mono">
              {readinessScore}%
            </div>
            <div className="text-xs text-right">
              <span className="block font-bold text-white">التقييم التقديري:</span>
              <span className="text-[#6bf4c7] font-bold">{readiness.text}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#6bf4c7] h-full rounded-full transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e6e8eb] rounded-3xl p-5 text-center shadow-sm">
          <span className="text-xs text-[#868e96] block mb-1">الموضوعات المنجزة</span>
          <div className="text-3xl font-black text-[#0054a6]">{totalFinishedTopics} / 58</div>
          <span className="text-[11px] text-[#626976] mt-1 block">من فصول المنهج</span>
        </div>

        <div className="bg-white border border-[#e6e8eb] rounded-3xl p-5 text-center shadow-sm">
          <span className="text-xs text-[#868e96] block mb-1">الواجبات المكتملة</span>
          <div className="text-3xl font-black text-[#0ca678]">{finishedHomework} / {state.homework.length}</div>
          <span className="text-[11px] text-[#626976] mt-1 block">مهام محلولة</span>
        </div>

        <div className="bg-white border border-[#e6e8eb] rounded-3xl p-5 text-center shadow-sm">
          <span className="text-xs text-[#868e96] block mb-1">خزنة الأخطاء</span>
          <div className="text-3xl font-black text-[#d63939]">{totalMistakes}</div>
          <span className="text-[11px] text-[#626976] mt-1 block">أسئلة تحتاج تثبيت</span>
        </div>

        <div className="bg-white border border-[#e6e8eb] rounded-3xl p-5 text-center shadow-sm">
          <span className="text-xs text-[#868e96] block mb-1">النقاط والمكافآت</span>
          <div className="text-3xl font-black text-[#f59f00]">{state.points}</div>
          <span className="text-[11px] text-[#626976] mt-1 block">نقطة تميز</span>
        </div>
      </div>

      {/* Parent Alerts Box */}
      <div className="bg-white border border-[#e6e8eb] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-[#182433] flex items-center gap-2">
          <ShieldAlert size={18} className="text-[#0054a6]" />
          <span>تنبيهات وتوصيات ولي الأمر للمرحلة الحالية:</span>
        </h3>

        <div className="space-y-3">
          {totalMistakes > 5 && (
            <div className="bg-[#fff5f5] border border-[#ffe3e3] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#c92a2a]">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong>تنبيه تراكم أخطاء:</strong> يوجد لدى الطالب {totalMistakes} أسئلة متعثرة في خزنة الأخطاء. يُوصى بفتح الخزنة وإجراء اختبار الأخطاء فقط اليوم.
              </div>
            </div>
          )}

          <div className="bg-[#f8fafc] border border-[#e6e8eb] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#495057]">
            <CheckCircle size={18} className="text-[#0ca678] shrink-0 mt-0.5" />
            <div>
              <strong>متابعة الواجبات:</strong> المنهج العراقي يتطلب الرسم اليدوي (كالخلية العصبية والسن والقوس الانعكاسي). تأكد من قيام الطالب برسم التراكيب بيده في كراس الواجبات.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
