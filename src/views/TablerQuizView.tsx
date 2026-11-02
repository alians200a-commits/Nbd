import React, { useState } from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { QUESTIONS, MINISTERIAL_QS } from '../data';
import { useApp } from '../context/AppContext';

export const TablerQuizView: React.FC = () => {
  const { addPoints, addMistake } = useApp();
  const [activeMode, setActiveMode] = useState<'topicQuiz' | 'ministerialBank'>('topicQuiz');
  const [qIndex, setQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const sampleQuestions = [
    {
      q: "ما الوحدة الأساسية في بناء الجهاز العصبي؟",
      a: ["النسيج العصبي", "الخلية العصبية", "العصب الحسي", "الحبل الشوكي"],
      correct: 1,
      explain: "الخلية العصبية وحدة البناء والوظيفة في الجهاز العصبي. (ص 6)"
    },
    {
      q: "أي أجزاء الدماغ مسؤول عن توازن الجسم وتنسيق حركات العضلات الإرادية؟",
      a: ["المخ", "المخيخ", "النخاع المستطيل", "الحبل الشوكي"],
      correct: 1,
      explain: "المخيخ هو المسؤول عن تنظيم حركة العضلات الإرادية في الجسم. (ص 7)"
    },
    {
      q: "أين يتمركز مركز الأفعال الانعكاسية السريعة لحماية الجسم من الخطر؟",
      a: ["المخ", "الحبل الشوكي", "المعدة", "القلب"],
      correct: 1,
      explain: "الحبل الشوكي يحتوي على المادة الرمادية التي تمثل مركز القوس الانعكاسي. (ص 10)"
    },
    {
      q: "ما وظيفة التفرعات الشجيرية في الخلية العصبية؟",
      a: ["نقل الإيعاز خارج الخلية", "استقبال النبضات العصبية ونقلها لجسم الخلية", "عزل المحور العصبي", "إفراز الهرمونات"],
      correct: 1,
      explain: "التشجرات تستقبل الاتصال العصبي من الخلايا المجاورة. (ص 6)"
    }
  ];

  const currentQ = sampleQuestions[qIndex];

  const handleChoose = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
      addPoints(10);
    } else {
      addMistake(`tabler-q-${qIndex}`, {
        question: currentQ.q,
        chosen: currentQ.a[idx],
        correct: currentQ.a[currentQ.correct],
        chapter: 1,
        page: 6
      });
    }
  };

  const handleNext = () => {
    setQIndex((prev) => (prev + 1) % sampleQuestions.length);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleRestart = () => {
    setQIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Quiz card */}
      <div className="card bg-white border border-[#e6e8eb] rounded-3xl shadow-sm overflow-hidden">
        <div className="card-header bg-[#f8fafc] border-b border-[#e6e8eb] p-5 flex items-center justify-between">
          <div>
            <h3 className="card-title text-base font-bold text-[#182433] m-0">
              اختبار الفهم · الجهاز العصبي
            </h3>
            <span className="text-[11px] text-[#868e96] block mt-0.5">
              أسئلة تعليمية مرتبطة بالكتاب وليست موسومة بأنها وزارية
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-[#e6f4fe] text-[#0054a6] px-2.5 py-1 rounded-full text-xs font-bold">
              السؤال {qIndex + 1} من {sampleQuestions.length}
            </span>
            <span className="badge bg-[#e6fffa] text-[#0ca678] px-2.5 py-1 rounded-full text-xs font-bold font-mono">
              الصحيح: {score}
            </span>
          </div>
        </div>

        <div className="card-body p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#182433] leading-relaxed mb-4">
            {currentQ.q}
          </h2>

          {/* Options list */}
          <div className="space-y-2">
            {currentQ.a.map((opt, idx) => {
              let btnClass = "border-[#dce1e7] bg-white text-[#182433] hover:border-[#0054a6] hover:bg-[#f8fafc]";
              if (isAnswered) {
                if (idx === currentQ.correct) {
                  btnClass = "border-[#2fb344] bg-[#e6fffa] text-[#0ca678] font-bold";
                } else if (idx === selectedAnswer) {
                  btnClass = "border-[#d63939] bg-[#ffeceb] text-[#d63939] font-bold";
                } else {
                  btnClass = "border-[#f1f3f5] bg-[#f8fafc] text-[#868e96] opacity-60";
                }
              }
              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleChoose(idx)}
                  className={`w-full text-right p-3.5 rounded-xl border text-sm transition flex items-center justify-between ${btnClass}`}
                >
                  <span>
                    <b className="font-mono ml-2">{String.fromCharCode(65 + idx)}.</b>
                    {opt}
                  </span>
                  {isAnswered && idx === currentQ.correct && (
                    <span className="text-[#0ca678] font-bold text-xs">✓ صحيح</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback alert */}
          {isAnswered && (
            <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
              selectedAnswer === currentQ.correct
                ? 'bg-[#e6fffa] border border-[#a3e8d2] text-[#0ca678]'
                : 'bg-[#fff9db] border border-[#ffe066] text-[#7c5e10]'
            }`}>
              <b>{selectedAnswer === currentQ.correct ? 'إجابة صحيحة. ' : 'نحتاج نراجعها. '}</b>
              {currentQ.explain}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-[#f1f3f5]">
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="btn btn-primary bg-[#0054a6] hover:bg-[#004284] disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              السؤال التالي
            </button>
            <button
              onClick={handleRestart}
              className="btn btn-outline-secondary border border-[#dce1e7] hover:bg-[#f8fafc] text-[#182433] font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              إعادة الاختبار
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
