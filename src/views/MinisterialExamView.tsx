import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Flame,
  Bookmark
} from 'lucide-react';
import { QUESTIONS, CHAPTERS } from '../data';
import { Question } from '../types';
import { useApp } from '../context/AppContext';

export const MinisterialExamView: React.FC = () => {
  const { recordTest, addMistake } = useApp();
  const [examState, setExamState] = useState<'intro' | 'running' | 'finished'>('intro');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20 minutes in seconds

  const startExam = () => {
    // Shuffle and pick 15 diverse questions across chapters
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 15);
    setExamQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedQuestions({});
    setTimeLeft(20 * 60);
    setExamState('running');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (examState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examState, timeLeft]);

  const submitExam = () => {
    setExamState('finished');
    // Calculate final score
    let correctCount = 0;
    examQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correctCount++;
      } else {
        // Record mistake
        addMistake(q.id, {
          question: q.q,
          chosen: userAnswers[idx] !== undefined ? q.a[userAnswers[idx]] : 'لم يُجب عليه',
          correct: q.a[q.correct],
          chapter: q.ch,
          page: q.page
        });
      }
    });

    recordTest(0, correctCount, examQuestions.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQ = examQuestions[currentIndex];

  const calculateScore = () => {
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correct++;
    });
    return {
      correct,
      total: examQuestions.length,
      percentage: Math.round((correct / examQuestions.length) * 100)
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Intro View */}
      {examState === 'intro' && (
        <div className="max-w-2xl mx-auto bg-[#0b1f33] border border-[#214362] rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-black/50">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#30e2cb] to-[#3f88d2] text-[#052436] font-black flex items-center justify-center mx-auto text-3xl shadow-lg shadow-[#31bdb333]">
            <Award size={36} />
          </div>

          <div>
            <span className="text-xs font-bold text-[#f2c575] uppercase tracking-wider block mb-1">
              محاكي الاختبار الوزاري المعتمد
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#effbff]">
              امتحان الأحياء الشامل (الثالث المتوسط)
            </h2>
            <p className="text-sm text-[#93b7c8] mt-3 leading-relaxed">
              يحاكي هذا الاختبار نمط الأسئلة الوزارية وتوزيعها على فصول الكتاب الـ11. يتكون الامتحان من 15 سؤالاً باختيار من متعدد مع توقيت زمني دقيق وتقييم وزاري نهائي.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-right text-xs bg-[#091728] border border-[#1b364e] p-4 rounded-2xl">
            <div>
              <span className="text-[#789daf] block">عدد الأسئلة:</span>
              <b className="text-sm text-[#effbff]">15 سؤالاً</b>
            </div>
            <div>
              <span className="text-[#789daf] block">الزمن المتاح:</span>
              <b className="text-sm text-[#effbff]">20 دقيقة</b>
            </div>
            <div>
              <span className="text-[#789daf] block">درجة النجاح:</span>
              <b className="text-sm text-[#6bf4c7]">50 من 100</b>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6fe9d5] to-[#40d2c6] hover:brightness-110 text-[#052834] font-black text-base transition shadow-lg shadow-[#3ce0cf33]"
          >
            بدء الامتحان الوزاري الآن ←
          </button>
        </div>
      )}

      {/* Running Exam View */}
      {examState === 'running' && currentQ && (
        <div className="space-y-6">
          {/* Exam Header Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#effbff]">
                السؤال رقم {currentIndex + 1} من {examQuestions.length}
              </span>
              <span className="text-xs text-[#7e9fb1]">
                (الفصل {currentQ.ch} • ص {currentQ.page})
              </span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold ${
              timeLeft < 180 ? 'bg-[#3b171f] border-[#ff8195] text-[#ff8195] animate-pulse' : 'bg-[#102a3f] border-[#255269] text-[#7bf0da]'
            }`}>
              <Clock size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={submitExam}
              className="bg-[#d4485e] hover:bg-[#b53448] text-[#fff] text-xs font-bold px-4 py-2 rounded-xl transition shadow"
            >
              إنهاء وتسليم الامتحان
            </button>
          </div>

          {/* Question Index Grid */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {examQuestions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurrent = currentIndex === idx;
              const isMarked = markedQuestions[idx];
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition flex items-center justify-center border relative ${
                    isCurrent
                      ? 'bg-[#6fe9d5] text-[#052834] border-[#6fe9d5]'
                      : isAnswered
                      ? 'bg-[#183f47] text-[#6bf4c7] border-[#296a75]'
                      : 'bg-[#091728] text-[#799bb0] border-[#1c364e]'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isMarked && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f2c575] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Question Box */}
          <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1b3752]">
              <span className="text-xs text-[#f2c575] font-bold">
                موضوع: {currentQ.topic}
              </span>
              <button
                onClick={() => setMarkedQuestions(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }))}
                className={`flex items-center gap-1.5 text-xs font-bold transition ${
                  markedQuestions[currentIndex] ? 'text-[#f2c575]' : 'text-[#7e9eb0] hover:text-[#effbff]'
                }`}
              >
                <Bookmark size={15} fill={markedQuestions[currentIndex] ? 'currentColor' : 'none'} />
                <span>{markedQuestions[currentIndex] ? 'مُميز للمراجعة' : 'تمييز السؤال'}</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#effbff] leading-relaxed">
              {currentQ.q}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.a.map((option, oIdx) => {
                const isSelected = userAnswers[currentIndex] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => setUserAnswers(prev => ({ ...prev, [currentIndex]: oIdx }))}
                    className={`w-full text-right p-4 rounded-2xl border text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#6fe8d5] bg-[#143e4c] text-[#7bf0da] font-bold shadow-sm'
                        : 'border-[#1f3d59] bg-[#091728] text-[#c4e1ee] hover:border-[#32648a]'
                    }`}
                  >
                    <span>{option}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#6fe8d5] bg-[#6fe8d5]' : 'border-[#2d5677]'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#052834]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next / Prev question buttons */}
            <div className="pt-4 border-t border-[#1b3752] flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#142e47] hover:bg-[#1c3d5d] disabled:opacity-40 text-[#a8d3e6] border border-[#244b6e] transition"
              >
                ← السؤال السابق
              </button>

              <button
                onClick={() => {
                  if (currentIndex < examQuestions.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                  } else {
                    submitExam();
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#6fe9d5] hover:bg-[#50dfcb] text-[#052834] transition shadow-md shadow-[#50dfcb22]"
              >
                {currentIndex < examQuestions.length - 1 ? 'السؤال التالي →' : 'إنهاء وتسليم الامتحان'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finished Result View */}
      {examState === 'finished' && (
        <div className="space-y-6">
          {(() => {
            const { correct, total, percentage } = calculateScore();
            const isPassed = percentage >= 50;

            return (
              <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-8 text-center space-y-6">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black ${
                  isPassed ? 'bg-[#154639] text-[#6bf4c7] border-2 border-[#52d9be]' : 'bg-[#471924] text-[#ff8195] border-2 border-[#ff8195]'
                }`}>
                  {percentage}%
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-[#effbff]">
                    {isPassed ? 'مبارك! اجتزت الاختبار الوزاري بنجاح' : 'تحتاج إلى تعزيز ومراجعة الفصول'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8db1c3] mt-2">
                    أجبت بشكل صحيح على <b>{correct}</b> من أصل <b>{total}</b> أسئلة وزارية.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={startExam}
                    className="flex items-center gap-2 bg-[#6fe9d5] hover:bg-[#50dfcb] text-[#052834] text-xs font-bold px-5 py-3 rounded-xl transition"
                  >
                    <RotateCcw size={16} />
                    <span>إعادة الاختبار بأسئلة جديدة</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#effbff]">مراجعة إجاباتك بالتفصيل:</h3>
            {examQuestions.map((q, idx) => {
              const userPick = userAnswers[idx];
              const isCorrect = userPick === q.correct;
              return (
                <div
                  key={idx}
                  className={`bg-[#0b1f33] border rounded-2xl p-5 space-y-3 ${
                    isCorrect ? 'border-[#1f5647]' : 'border-[#592634]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#f2c575]">السؤال {idx + 1} (ص {q.page})</span>
                    <span className={`font-bold flex items-center gap-1 ${isCorrect ? 'text-[#6bf4c7]' : 'text-[#ff8195]'}`}>
                      {isCorrect ? <CheckCircle size={15} /> : <XCircle size={15} />}
                      <span>{isCorrect ? 'إجابة صحيحة' : 'إجابة غير صحيحة'}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#effbff] leading-relaxed">
                    {q.q}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#091728] p-3 rounded-xl border border-[#1d354a]">
                      <span className="text-[#84a3b5] block mb-1">إجابتك:</span>
                      <b className={isCorrect ? 'text-[#6bf4c7]' : 'text-[#ff99aa]'}>
                        {userPick !== undefined ? q.a[userPick] : 'لم تجب على السؤال'}
                      </b>
                    </div>
                    <div className="bg-[#091728] p-3 rounded-xl border border-[#1d354a]">
                      <span className="text-[#84a3b5] block mb-1">الإجابة الوزارية الصحيحة:</span>
                      <b className="text-[#6bf4c7]">{q.a[q.correct]}</b>
                    </div>
                  </div>

                  <div className="bg-[#092233] p-3 rounded-xl border border-[#214d60] text-xs text-[#bee5ee] leading-relaxed">
                    <span className="text-[#7bf0da] font-bold block mb-0.5">التوضيح:</span>
                    {q.explain}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
