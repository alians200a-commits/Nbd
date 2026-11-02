import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  CheckCircle,
  XCircle,
  Sparkles,
  BookOpen,
  Filter,
  BookmarkPlus,
  RefreshCw,
  Award
} from 'lucide-react';
import { MINISTERIAL_QS, QUESTIONS, CHAPTERS } from '../data';
import { MinisterialQuestion, Question } from '../types';
import { useApp } from '../context/AppContext';

interface QuizViewProps {
  initialTopicId?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ initialTopicId }) => {
  const { addPoints, addMistake } = useApp();
  const [activeTab, setActiveTab] = useState<'mcq' | 'ministerialBank'>('mcq');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);

  // Filter MCQ questions
  const filteredQuestions = QUESTIONS.filter((q) => {
    const matchCh = selectedChapter === 0 || q.ch === selectedChapter;
    const matchSearch = (q.q + ' ' + q.explain + ' ' + q.topic).toLowerCase().includes(searchTerm.toLowerCase());
    return matchCh && matchSearch;
  });

  const currentQ: Question | undefined = filteredQuestions[currentQIndex] || filteredQuestions[0];

  // Filter Ministerial Questions Bank
  const filteredMinisterialQs = MINISTERIAL_QS.filter((q) => {
    const matchCh = selectedChapter === 0 || q.chapter === selectedChapter;
    const matchSearch = (q.question + ' ' + q.answer).toLowerCase().includes(searchTerm.toLowerCase());
    return matchCh && matchSearch;
  });

  const handleSelectAnswer = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    setTotalAnswered((prev) => prev + 1);

    if (idx === currentQ.correct) {
      setScore((prev) => prev + 1);
      addPoints(10);
    } else {
      // Add to mistakes vault
      addMistake(currentQ.id, {
        question: currentQ.q,
        chosen: currentQ.a[idx],
        correct: currentQ.a[currentQ.correct],
        chapter: currentQ.ch,
        page: currentQ.page
      });
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mcq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'mcq'
                ? 'bg-[#184557] text-[#7bf0da] border border-[#2b7180]'
                : 'text-[#87a9bc] hover:bg-[#122841]'
            }`}
          >
            اختبارات الاختيار من متعدد التفاعلية
          </button>
          <button
            onClick={() => setActiveTab('ministerialBank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ministerialBank'
                ? 'bg-[#184557] text-[#7bf0da] border border-[#2b7180]'
                : 'text-[#87a9bc] hover:bg-[#122841]'
            }`}
          >
            بنك الأسئلة الوزارية الكامل (431 سؤالاً)
          </button>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#89a8bc]">النتيجة في الجلسة:</span>
          <span className="font-bold text-[#6bf4c7]">{score} صحيحة من {totalAnswered}</span>
        </div>
      </div>

      {/* Chapter Filter pills */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => {
              setSelectedChapter(0);
              setCurrentQIndex(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              selectedChapter === 0
                ? 'bg-[#1b4e5f] border-[#6fe8d5] text-[#7bf0da]'
                : 'bg-[#0a1728] border-[#1c374f] text-[#86a8bc]'
            }`}
          >
            جميع الفصول
          </button>
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChapter(ch.id);
                setCurrentQIndex(0);
                setSelectedAnswer(null);
                setIsAnswered(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                selectedChapter === ch.id
                  ? 'bg-[#1b4e5f] border-[#6fe8d5] text-[#7bf0da]'
                  : 'bg-[#0a1728] border-[#1c374f] text-[#86a8bc]'
              }`}
            >
              الفصل {ch.id}: {ch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث في الأسئلة الوزارية: عصب، هضم، كلية، طحال..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentQIndex(0);
          }}
          className="w-full bg-[#0a1b2d] border border-[#234563] rounded-xl px-9 py-2.5 text-xs sm:text-sm text-[#effbff] placeholder-[#628497] focus:outline-none focus:border-[#6fe8d5]"
        />
        <Search size={16} className="absolute right-3 top-3.5 text-[#628497]" />
      </div>

      {activeTab === 'mcq' ? (
        /* MCQ QUIZ INTERACTIVE VIEW */
        currentQ ? (
          <div className="bg-[#0b1f33] border border-[#224463] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1b3752]">
              <div>
                <span className="text-xs font-bold text-[#f2c575] block mb-1">
                  الفصل {currentQ.ch} • صفحة الكتاب {currentQ.page} • المصدر: {currentQ.source}
                </span>
                <span className="text-xs text-[#82a4b8]">
                  السؤال رقم {currentQIndex + 1} من {filteredQuestions.length}
                </span>
              </div>
              <div className="text-xs bg-[#12283e] border border-[#264868] text-[#9fc4d7] px-3 py-1.5 rounded-xl">
                الموضوع: {currentQ.topic}
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-[#effbff] leading-relaxed">
              {currentQ.q}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.a.map((option, idx) => {
                let btnStyle = 'border-[#22415f] bg-[#091728] text-[#c4e1ee] hover:border-[#33688e]';
                if (isAnswered) {
                  if (idx === currentQ.correct) {
                    btnStyle = 'border-[#55d9be] bg-[#144243] text-[#6bf4c7] font-bold';
                  } else if (idx === selectedAnswer) {
                    btnStyle = 'border-[#ff8195] bg-[#3e1b27] text-[#ff99aa]';
                  } else {
                    btnStyle = 'border-[#1b334a] bg-[#071321] text-[#638093] opacity-50';
                  }
                }
                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-right p-4 rounded-2xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === currentQ.correct && (
                      <CheckCircle size={18} className="text-[#6bf4c7]" />
                    )}
                    {isAnswered && idx === selectedAnswer && idx !== currentQ.correct && (
                      <XCircle size={18} className="text-[#ff8195]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-[#092233] border border-[#24586d] text-xs sm:text-sm text-[#ceeff2] leading-relaxed space-y-1">
                <strong className="text-[#7bf0da] block mb-1">
                  {selectedAnswer === currentQ.correct ? '✓ إجابة نموذجية! (+10 نقاط)' : 'توضيح السؤال المنهجي:'}
                </strong>
                <p>{currentQ.explain}</p>
                {selectedAnswer !== currentQ.correct && (
                  <div className="text-[#ff99aa] text-xs pt-1">
                    تمت إضافة هذا السؤال تلقائياً إلى "خزنة الأخطاء" لمراجعته لاحقاً.
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-[#1b3752] flex items-center justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#142e47] hover:bg-[#1c3d5d] disabled:opacity-40 text-[#a8d3e6] border border-[#244b6e] transition"
              >
                ← السؤال السابق
              </button>

              <button
                onClick={nextQuestion}
                disabled={currentQIndex >= filteredQuestions.length - 1}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#6fe9d5] hover:bg-[#50dfcb] disabled:opacity-40 text-[#052834] transition shadow-md shadow-[#50dfcb22]"
              >
                السؤال التالي →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-[#82a4b8] bg-[#0b1f33] border border-[#224463] rounded-3xl">
            لا توجد أسئلة تطابق بحثك في هذا الفصل.
          </div>
        )
      ) : (
        /* MINISTERIAL QUESTIONS BANK (431 official questions) */
        <div className="space-y-4">
          <div className="text-xs text-[#8ab2c5]">
            عرض {filteredMinisterialQs.length} سؤالاً وزارياً مدققاً:
          </div>

          <div className="space-y-3">
            {filteredMinisterialQs.slice(0, 30).map((mq) => (
              <div
                key={mq.id}
                className="bg-[#0b1f33] border border-[#203e5c] rounded-2xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#f2c575]">
                    الفصل {mq.chapter} • ص {mq.pdfPage}
                  </span>
                  {mq.years && mq.years.length > 0 && (
                    <span className="text-[10px] bg-[#1a3a4c] text-[#7bf0da] px-2.5 py-0.5 rounded-full border border-[#2c6172]">
                      ورد في الامتحانات: {mq.years.join('، ')}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#effbff] leading-relaxed">
                  {mq.question}
                </h4>

                <div className="bg-[#081827] border border-[#1b364e] rounded-xl p-3.5 text-xs sm:text-sm text-[#b6d8e8] leading-relaxed">
                  <span className="text-[#6bf4c7] font-bold block mb-1">الجواب النموذجي المنهجي:</span>
                  {mq.answer}
                </div>
              </div>
            ))}
          </div>

          {filteredMinisterialQs.length > 30 && (
            <div className="text-center text-xs text-[#82a4b8] py-4">
              يتم عرض أول 30 سؤالاً لتسريع التصفح. استخدم البحث بالاسم أو الفصل لتضييق النتائج.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
