import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Brain,
  HelpCircle,
  FileQuestion,
  Stethoscope,
  Trash2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TablerVaultView: React.FC = () => {
  const { state, removeMistake, addMistake, addPoints } = useApp();
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  // Remedial quiz from mistakes
  const [isTakingMistakesQuiz, setIsTakingMistakesQuiz] = useState<boolean>(false);
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizUserChoice, setQuizUserChoice] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);

  // Diagnostic filter
  const [errorDoctorFilter, setErrorDoctorFilter] = useState<'all' | 'concept' | 'memorization' | 'confusion'>('all');

  const mistakesList = Object.entries(state.mistakes);

  // Helper to diagnose error category
  const diagnoseError = (item: any) => {
    const q = item.question || '';
    if (q.includes('قارن') || q.includes('الفرق بين') || q.includes('ما الفرق')) {
      return {
        type: 'confusion',
        label: 'خلط بين مصطلحين متشابهين',
        treatment: 'مراجعة جدول المقارنة والتركيز على الفوارق الجوهرية بدون حفظ سطحي.',
        icon: '🔄',
        badgeColor: 'bg-[#fff4e6] text-[#d9480f]'
      };
    }
    if (q.includes('علل') || q.includes('لماذا') || q.includes('ما سبب') || q.includes('فسر')) {
      return {
        type: 'concept',
        label: 'عدم فهم المفهوم أو الآلية الحيوية',
        treatment: 'فتح مجسم العضو ومحاكاة الوظيفة لفهم السبب الطبيعي قبل صياغة الجواب.',
        icon: '💡',
        badgeColor: 'bg-[#e6fcf5] text-[#0ca678]'
      };
    }
    return {
      type: 'memorization',
      label: 'نسيان الحفظ الدقيق للمصطلح',
      treatment: 'تطبيق التكرار المتباعد وكتابة الجواب بالورقة والقلم ثلاث مرات.',
      icon: '🧠',
      badgeColor: 'bg-[#e6f4fe] text-[#0054a6]'
    };
  };

  const filteredMistakes = mistakesList.filter(([_, item]) => {
    if (errorDoctorFilter === 'all') return true;
    return diagnoseError(item).type === errorDoctorFilter;
  });

  const startMistakesQuiz = () => {
    if (mistakesList.length === 0) return;
    setIsTakingMistakesQuiz(true);
    setQuizIdx(0);
    setQuizUserChoice(null);
    setQuizResult(null);
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    setQuizResult(isCorrect);
    if (isCorrect) {
      addPoints(15);
    }
  };

  const handleNextQuizQuestion = (shouldRemove: boolean) => {
    const currentKey = mistakesList[quizIdx]?.[0];
    if (shouldRemove && currentKey) {
      removeMistake(currentKey);
    }
    if (quizIdx < mistakesList.length - 1) {
      setQuizIdx(prev => prev + 1);
      setQuizUserChoice(null);
      setQuizResult(null);
    } else {
      setIsTakingMistakesQuiz(false);
      setQuizIdx(0);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d63939] to-[#a51d24] text-white flex items-center justify-center font-bold shadow-md">
            <Bookmark size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#182433]">خزنة الأخطاء والتكرار المتباعد</h2>
            <p className="text-xs text-[#626976]">
              تحفظ تلقائياً أي سؤال تتعثر به في الامتحانات والاختبارات لتكراره وفق جدول تثبيت الذاكرة
            </p>
          </div>
        </div>

        {mistakesList.length > 0 && !isTakingMistakesQuiz && (
          <button
            onClick={startMistakesQuiz}
            className="bg-[#0054a6] hover:bg-[#004284] text-white px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-sm"
          >
            <Sparkles size={16} />
            <span>توليد امتحان فقط من أخطائي السابقة ({mistakesList.length})</span>
          </button>
        )}
      </div>

      {/* Active Mistakes Quiz Mode */}
      {isTakingMistakesQuiz && mistakesList.length > 0 && (
        <div className="bg-white border-2 border-[#0054a6] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#f1f3f5] pb-4">
            <div className="flex items-center gap-2">
              <span className="badge bg-[#e6f4fe] text-[#0054a6] px-3 py-1 rounded-full text-xs font-black">
                سؤال علاجي {quizIdx + 1} من {mistakesList.length}
              </span>
              <span className="text-xs text-[#868e96]">
                الفصل {mistakesList[quizIdx][1].chapter} (ص {mistakesList[quizIdx][1].page})
              </span>
            </div>
            <button
              onClick={() => setIsTakingMistakesQuiz(false)}
              className="text-xs text-[#868e96] hover:text-[#182433]"
            >
              إلغاء الامتحان
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-black text-[#182433] leading-relaxed">
            {mistakesList[quizIdx][1].question}
          </h3>

          {quizResult === null ? (
            <div className="space-y-4 pt-2">
              <div className="bg-[#fff5f5] border border-[#ffe3e3] p-4 rounded-2xl text-xs text-[#c92a2a] space-y-1">
                <strong>خطؤك السابق المسجل:</strong>
                <p>{mistakesList[quizIdx][1].chosen}</p>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setQuizResult(true)}
                  className="bg-[#0054a6] hover:bg-[#004284] text-white px-6 py-2.5 rounded-xl text-xs font-black transition"
                >
                  كشف الإجابة النموذجية واختبار استرجاعي
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2 animate-fadeIn">
              <div className="bg-[#e6fffa] border border-[#96f2d7] p-4 rounded-2xl text-xs sm:text-sm text-[#0ca678] space-y-2">
                <strong className="block font-bold">✓ الإجابة النموذجية المعتمدة:</strong>
                <p className="leading-relaxed text-[#087f5b] whitespace-pre-line">
                  {mistakesList[quizIdx][1].correct}
                </p>
              </div>

              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-[#e6e8eb] text-xs text-center space-y-3">
                <p className="text-[#495057] font-semibold">هل تذكرت الجواب الصحيح وحفظته تماماً؟</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleNextQuizQuestion(true)}
                    className="bg-[#2fb344] hover:bg-[#259b3a] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <CheckCircle size={15} />
                    <span>نعم، حفظته (إزالة من الخزنة)</span>
                  </button>
                  <button
                    onClick={() => handleNextQuizQuestion(false)}
                    className="bg-[#f1f3f5] hover:bg-[#e9ecef] text-[#495057] px-5 py-2 rounded-xl text-xs font-bold transition"
                  >
                    أحتاج تكراره لاحقاً (إبقاء بالخزنة)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Doctor of Errors (طبيب الأخطاء) Filter Bar */}
      {!isTakingMistakesQuiz && (
        <div className="bg-white border border-[#e6e8eb] p-4 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f1f3f5]">
            <Stethoscope size={18} className="text-[#0054a6]" />
            <h3 className="text-xs sm:text-sm font-black text-[#182433]">
              طبيب الأخطاء التشخيصي (تشخيص أسباب الخطأ وطرق معالجتها)
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => setErrorDoctorFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                errorDoctorFilter === 'all'
                  ? 'bg-[#182433] text-white'
                  : 'bg-[#f1f3f5] text-[#626976] hover:bg-[#e9ecef]'
              }`}
            >
              جميع الأخطاء ({mistakesList.length})
            </button>
            <button
              onClick={() => setErrorDoctorFilter('concept')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                errorDoctorFilter === 'concept'
                  ? 'bg-[#0ca678] text-white'
                  : 'bg-[#f1f3f5] text-[#626976] hover:bg-[#e9ecef]'
              }`}
            >
              <span>💡 سوء فهم المفهوم</span>
            </button>
            <button
              onClick={() => setErrorDoctorFilter('confusion')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                errorDoctorFilter === 'confusion'
                  ? 'bg-[#d9480f] text-white'
                  : 'bg-[#f1f3f5] text-[#626976] hover:bg-[#e9ecef]'
              }`}
            >
              <span>🔄 خلط بين مصطلحين</span>
            </button>
            <button
              onClick={() => setErrorDoctorFilter('memorization')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                errorDoctorFilter === 'memorization'
                  ? 'bg-[#0054a6] text-white'
                  : 'bg-[#f1f3f5] text-[#626976] hover:bg-[#e9ecef]'
              }`}
            >
              <span>🧠 نسيان الحفظ الدقيق</span>
            </button>
          </div>
        </div>
      )}

      {/* List of Mistakes */}
      {!isTakingMistakesQuiz && (
        <div className="card bg-white border border-[#e6e8eb] rounded-3xl overflow-hidden shadow-sm">
          {filteredMistakes.length > 0 ? (
            <div className="divide-y divide-[#f1f3f5]">
              {filteredMistakes.map(([key, item]) => {
                const diag = diagnoseError(item);
                const isReviewing = activeReviewId === key;

                return (
                  <div key={key} className="p-5 transition hover:bg-[#fbfcfd] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`badge px-2.5 py-0.5 rounded-md text-[10px] font-bold ${diag.badgeColor}`}>
                            {diag.icon} {diag.label}
                          </span>
                          <span className="text-[11px] text-[#868e96]">
                            الفصل {item.chapter} · ص {item.page}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-[#182433] leading-relaxed">
                          {item.question}
                        </h4>

                        <div className="text-xs text-[#d63939] bg-[#fff5f5] px-3 py-1.5 rounded-xl inline-block border border-[#ffe3e3]">
                          إجابتك السابقة: {item.chosen}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveReviewId(isReviewing ? null : key)}
                          className="btn btn-sm bg-[#e6f4fe] hover:bg-[#d0ebfd] text-[#0054a6] font-bold text-xs px-3.5 py-2 rounded-xl transition"
                        >
                          {isReviewing ? 'إخفاء المعالجة' : 'كشف العلاج والحل'}
                        </button>
                        <button
                          onClick={() => removeMistake(key)}
                          className="p-2 text-[#868e96] hover:text-[#d63939] rounded-xl hover:bg-[#fff5f5] transition"
                          title="حذف من الخزنة"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Doctor Advice & Answer */}
                    {isReviewing && (
                      <div className="bg-[#f8fafc] border border-[#e6e8eb] p-4 rounded-2xl text-xs space-y-3 animate-fadeIn">
                        <div className="bg-white p-3 rounded-xl border border-[#dce1e7] space-y-1">
                          <strong className="text-[#0ca678] block font-bold">
                            ✓ الإجابة النموذجية المعتمدة:
                          </strong>
                          <p className="text-[#2b354f] leading-relaxed whitespace-pre-line">
                            {item.correct}
                          </p>
                        </div>

                        <div className="bg-[#fff9db] border border-[#f59f00] p-3 rounded-xl text-[#7a4e00] space-y-1">
                          <strong>وصفة طبيب الأخطاء لتثبيت المعلومة:</strong>
                          <p>{diag.treatment}</p>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => {
                              removeMistake(key);
                              setActiveReviewId(null);
                            }}
                            className="bg-[#2fb344] hover:bg-[#259b3a] text-white px-4 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
                          >
                            <CheckCircle size={14} />
                            <span>تم الحفظ والإتقان (إزالة من الخزنة)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-xs sm:text-sm text-[#868e96] space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#e6fffa] text-[#0ca678] flex items-center justify-center mx-auto text-2xl font-black">
                ✓
              </div>
              <div className="font-extrabold text-[#182433] text-base">خزنة الأخطاء نظيفة بالكامل!</div>
              <p className="max-w-md mx-auto leading-relaxed">
                أي سؤال تخطئ به أثناء حل الاختبارات أو الامتحان الوزاري سينتقل إلى هنا تلقائياً لتدريبك عليه حتى الإتقان الكامل.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
