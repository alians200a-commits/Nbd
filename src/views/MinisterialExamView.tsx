import React, { useState, useMemo } from 'react';
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Bookmark,
  Search,
  Filter,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  Sparkles,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MINISTERIAL_QS, QUESTIONS, CHAPTERS } from '../data';
import { MinisterialQuestion } from '../types';
import { useApp } from '../context/AppContext';

export const MinisterialExamView: React.FC = () => {
  const { addMistake, recordTest, addPoints } = useApp();

  // Mode: 'browse' (bank explorer) or 'exam' (timed mock exam)
  const [viewMode, setViewMode] = useState<'browse' | 'exam'>('browse');

  // Browse state
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMinisterialOnly, setFilterMinisterialOnly] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [savedToVault, setSavedToVault] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Filtered ministerial questions
  const filteredQuestions = useMemo(() => {
    return MINISTERIAL_QS.filter((q) => {
      if (selectedChapter !== 'all' && q.chapter !== selectedChapter) return false;
      if (filterMinisterialOnly && (!q.ministerial && (!q.pageYears || q.pageYears.length === 0))) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inQ = q.question.toLowerCase().includes(query);
        const inA = q.answer.toLowerCase().includes(query);
        const inYears = (q.years || []).some(y => String(y).includes(query));
        if (!inQ && !inA && !inYears) return false;
      }
      return true;
    });
  }, [selectedChapter, filterMinisterialOnly, searchQuery]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage]);

  const toggleRevealAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveToMistakes = (q: MinisterialQuestion) => {
    addMistake(q.id, {
      question: q.question,
      chosen: 'سؤال يحتاج مراجعة وتثبيت',
      correct: q.answer || 'مراجعة من صفحة الملزمة ص ' + q.pdfPage,
      chapter: q.chapter,
      page: q.pdfPage
    });
    setSavedToVault(prev => ({ ...prev, [q.id]: true }));
    setTimeout(() => {
      setSavedToVault(prev => ({ ...prev, [q.id]: false }));
    }, 2500);
  };

  // Exam state
  const [examState, setExamState] = useState<'intro' | 'running' | 'finished'>('intro');
  const [examChapter, setExamChapter] = useState<number | 'all'>('all');
  const [examQuestionCount, setExamQuestionCount] = useState<number>(15);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);

  const startExam = () => {
    let pool = [...QUESTIONS];
    if (examChapter !== 'all') {
      pool = pool.filter(q => q.ch === examChapter);
    }
    if (pool.length === 0) pool = [...QUESTIONS];

    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, Math.min(examQuestionCount, pool.length));
    setExamQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(examQuestionCount * 80); // 80 seconds per question
    setExamState('running');
  };

  // Timer effect
  React.useEffect(() => {
    let interval: any;
    if (examState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
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
    let correctCount = 0;
    examQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correctCount++;
      } else {
        addMistake(q.id || `exam-${idx}`, {
          question: q.q,
          chosen: userAnswers[idx] !== undefined ? q.a[userAnswers[idx]] : 'لم يجب عليه',
          correct: q.a[q.correct],
          chapter: q.ch,
          page: q.page
        });
      }
    });
    recordTest(examChapter === 'all' ? 0 : Number(examChapter), correctCount, examQuestions.length);
    addPoints(correctCount * 10);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#e6e8eb] p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0054a6] to-[#003875] text-white flex items-center justify-center font-bold shadow-md">
            <Award size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#182433]">
              بنك الأسئلة الوزارية الشامل والامتحان المحاكي
            </h2>
            <p className="text-xs text-[#626976]">
              مستخرج بالكامل من ملزمة كنز الأحياء وكتاب الوزارة الرسمي (486 سؤالاً مع الإجابات النموذجية)
            </p>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-1.5 bg-[#f1f3f5] p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'browse'
                ? 'bg-[#0054a6] text-white shadow-sm'
                : 'text-[#626976] hover:text-[#182433]'
            }`}
          >
            <BookOpen size={15} />
            <span>تصفح الأسئلة الوزارية ({MINISTERIAL_QS.length})</span>
          </button>
          <button
            onClick={() => setViewMode('exam')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'exam'
                ? 'bg-[#0054a6] text-white shadow-sm'
                : 'text-[#626976] hover:text-[#182433]'
            }`}
          >
            <Clock size={15} />
            <span>محاكي الامتحان الوزاري</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Ministerial Bank Browser */}
      {viewMode === 'browse' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-[#e6e8eb] p-4 rounded-3xl shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ابحث في نص السؤال، الجواب، أو السنة الوزارية (مثلاً: 2022، قناة هافرس، الإعياء...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#f8fafc] border border-[#dce1e7] rounded-2xl pr-10 pl-4 py-2.5 text-xs text-[#182433] placeholder-[#868e96] focus:outline-none focus:border-[#0054a6]"
                />
                <Search size={16} className="absolute right-3.5 top-3 text-[#868e96]" />
              </div>

              {/* Chapter dropdown */}
              <select
                value={selectedChapter}
                onChange={(e) => {
                  const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                  setSelectedChapter(val);
                  setCurrentPage(1);
                }}
                className="bg-[#f8fafc] border border-[#dce1e7] rounded-2xl px-4 py-2 text-xs font-bold text-[#182433] focus:outline-none focus:border-[#0054a6]"
              >
                <option value="all">جميع الفصول (11 فصلاً)</option>
                {CHAPTERS.map(ch => (
                  <option key={ch.id} value={ch.id}>الفصل {ch.id}: {ch.name}</option>
                ))}
              </select>

              {/* Ministerial only toggle */}
              <button
                onClick={() => {
                  setFilterMinisterialOnly(!filterMinisterialOnly);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  filterMinisterialOnly
                    ? 'bg-[#e6f4fe] border-[#0054a6] text-[#0054a6]'
                    : 'bg-white border-[#dce1e7] text-[#626976] hover:bg-[#f8fafc]'
                }`}
              >
                <Calendar size={14} />
                <span>الأسئلة الموسومة بسنوات فقط</span>
              </button>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-[#868e96] pt-1 border-t border-[#f1f3f5]">
              <span>
                عرض <strong>{filteredQuestions.length}</strong> سؤالاً مطابقاً
              </span>
              <span>
                الصفحة {currentPage} من {totalPages}
              </span>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedQuestions.map((q) => {
              const isAnswerOpen = !!revealedAnswers[q.id];
              const isSaved = !!savedToVault[q.id];
              const yearsList = q.years && q.years.length > 0 ? q.years : q.pageYears || [];

              return (
                <div
                  key={q.id}
                  className="bg-white border border-[#e6e8eb] hover:border-[#b8e2fb] rounded-3xl p-5 shadow-sm transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
                      <span className="badge bg-[#f1f3f5] text-[#495057] px-2.5 py-1 rounded-lg font-bold">
                        الفصل {q.chapter} · ص {q.pdfPage}
                      </span>
                      {yearsList.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="badge bg-[#fff4e6] text-[#d9480f] px-2 py-0.5 rounded-md font-bold text-[10px]">
                            وزاري مكرر:
                          </span>
                          {yearsList.slice(0, 4).map((yr, idx) => (
                            <span
                              key={idx}
                              className="badge bg-[#e6f4fe] text-[#0054a6] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                            >
                              {yr}
                            </span>
                          ))}
                          {yearsList.length > 4 && (
                            <span className="text-[10px] text-[#868e96]">+{yearsList.length - 4} أدوار</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#868e96] text-[10px]">مهم للمنهج</span>
                      )}
                    </div>

                    {/* Question Text */}
                    <h3 className="text-sm sm:text-base font-extrabold text-[#182433] leading-relaxed">
                      {q.question}
                    </h3>

                    {/* Answer area */}
                    {isAnswerOpen && (
                      <div className="bg-[#f8fafc] border-r-4 border-[#0054a6] p-4 rounded-xl text-xs sm:text-sm text-[#2b354f] leading-loose space-y-2 animate-fadeIn whitespace-pre-line">
                        <strong className="text-[#0054a6] block text-xs font-bold">
                          ✓ الإجابة النموذجية المعتمدة:
                        </strong>
                        <p>{q.answer || 'مراجعة نص الإجابة مباشرة من صفحة الملزمة ص ' + q.pdfPage}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-[#f1f3f5]">
                    <button
                      onClick={() => toggleRevealAnswer(q.id)}
                      className="btn btn-sm bg-[#e6f4fe] hover:bg-[#d0ebfd] text-[#0054a6] font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition"
                    >
                      {isAnswerOpen ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{isAnswerOpen ? 'إخفاء الإجابة' : 'عرض الإجابة النموذجية'}</span>
                    </button>

                    <button
                      onClick={() => handleSaveToMistakes(q)}
                      className={`btn btn-sm text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                        isSaved
                          ? 'bg-[#e6fffa] border-[#0ca678] text-[#0ca678]'
                          : 'bg-white border-[#dce1e7] text-[#626976] hover:bg-[#f8fafc]'
                      }`}
                      title="حفظ للمراجعة في خزنة الأخطاء والتكرار المتباعد"
                    >
                      {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                      <span>{isSaved ? 'حُفظ بالخزنة' : 'حفظ بالخزنة'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-xl border border-[#dce1e7] bg-white text-[#182433] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f8fafc]"
              >
                <ChevronRight size={16} />
              </button>
              <span className="text-xs font-bold text-[#495057] px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-xl border border-[#dce1e7] bg-white text-[#182433] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f8fafc]"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Timed Mock Exam */}
      {viewMode === 'exam' && (
        <div>
          {examState === 'intro' && (
            <div className="max-w-2xl mx-auto bg-white border border-[#e6e8eb] rounded-3xl p-8 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#e6f4fe] text-[#0054a6] font-black flex items-center justify-center mx-auto text-3xl shadow-sm">
                <Clock size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#182433]">محاكي الامتحان الوزاري التجريبي</h3>
                <p className="text-xs sm:text-sm text-[#626976] leading-relaxed max-w-md mx-auto mt-2">
                  نظام اختبارات يحاكي شروط وضوابط الامتحان الوزاري العراقي لمادة الأحياء، مع تصحيح فوري وتسجيل تلقائي لنقاط الضعف في خزنة الأخطاء.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right max-w-md mx-auto bg-[#f8fafc] p-4 rounded-2xl border border-[#e6e8eb]">
                <div>
                  <label className="text-xs font-bold text-[#495057] block mb-1.5">اختر نطاق الامتحان:</label>
                  <select
                    value={examChapter}
                    onChange={(e) => setExamChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full bg-white border border-[#dce1e7] rounded-xl px-3 py-2 text-xs font-bold text-[#182433]"
                  >
                    <option value="all">شامل لجميع الفصول (11 فصلاً)</option>
                    {CHAPTERS.map(ch => (
                      <option key={ch.id} value={ch.id}>الفصل {ch.id}: {ch.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#495057] block mb-1.5">عدد الأسئلة:</label>
                  <select
                    value={examQuestionCount}
                    onChange={(e) => setExamQuestionCount(Number(e.target.value))}
                    className="w-full bg-white border border-[#dce1e7] rounded-xl px-3 py-2 text-xs font-bold text-[#182433]"
                  >
                    <option value={10}>10 أسئلة (اختبار سريع)</option>
                    <option value={15}>15 سؤالاً (اختبار قياسي)</option>
                    <option value={25}>25 سؤالاً (امتحان شامل)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={startExam}
                  className="bg-[#0054a6] hover:bg-[#004284] text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition shadow-md shadow-[#0054a6]/20 inline-flex items-center gap-2"
                >
                  <Clock size={18} />
                  <span>ابدأ الامتحان الآن</span>
                </button>
              </div>
            </div>
          )}

          {examState === 'running' && examQuestions.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Exam Header */}
              <div className="bg-white border border-[#e6e8eb] p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="badge bg-[#e6f4fe] text-[#0054a6] px-3 py-1 rounded-full text-xs font-bold">
                    السؤال {currentIndex + 1} من {examQuestions.length}
                  </span>
                  <span className="text-xs text-[#868e96] hidden sm:inline">
                    الفصل {examQuestions[currentIndex]?.ch}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#d63939] bg-[#fff5f5] px-3 py-1 rounded-xl border border-[#ffe3e3]">
                  <Clock size={16} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white border border-[#e6e8eb] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-black text-[#182433] leading-relaxed">
                  {examQuestions[currentIndex]?.q}
                </h3>

                <div className="space-y-3">
                  {examQuestions[currentIndex]?.a.map((opt: string, idx: number) => {
                    const isSelected = userAnswers[currentIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [currentIndex]: idx }))}
                        className={`w-full text-right p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#e6f4fe] border-[#0054a6] text-[#0054a6] font-bold shadow-sm'
                            : 'bg-[#f8fafc] border-[#e6e8eb] text-[#2b354f] hover:bg-white hover:border-[#b8e2fb]'
                        }`}
                      >
                        <span>{opt}</span>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                          isSelected ? 'border-[#0054a6] bg-[#0054a6] text-white' : 'border-[#dce1e7]'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f1f3f5]">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl border border-[#dce1e7] text-xs font-bold text-[#495057] disabled:opacity-40 hover:bg-[#f8fafc]"
                  >
                    السابق
                  </button>

                  {currentIndex < examQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex(prev => prev + 1)}
                      className="bg-[#0054a6] hover:bg-[#004284] text-white px-5 py-2 rounded-xl text-xs font-bold transition"
                    >
                      التالي
                    </button>
                  ) : (
                    <button
                      onClick={submitExam}
                      className="bg-[#2fb344] hover:bg-[#259b3a] text-white px-6 py-2 rounded-xl text-xs font-black transition"
                    >
                      تسليم الإجابات وإنهاء الامتحان
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {examState === 'finished' && (
            <div className="max-w-2xl mx-auto bg-white border border-[#e6e8eb] rounded-3xl p-8 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#e6fffa] text-[#0ca678] font-black flex items-center justify-center mx-auto text-3xl shadow-sm">
                <CheckCircle size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#182433]">نتيجة الامتحان الوزاري التجريبي</h3>
                <div className="text-4xl font-black text-[#0054a6] mt-3">
                  {examQuestions.filter((q, idx) => userAnswers[idx] === q.correct).length} / {examQuestions.length}
                </div>
                <p className="text-xs text-[#868e96] mt-1">
                  نسبة الإتقان: {Math.round((examQuestions.filter((q, idx) => userAnswers[idx] === q.correct).length / examQuestions.length) * 100)}%
                </p>
              </div>

              <div className="text-right bg-[#f8fafc] border border-[#e6e8eb] p-5 rounded-2xl space-y-3">
                <strong className="text-xs font-bold text-[#182433] block">
                  تحليل الأداء وتوجيهات طبيب الأخطاء:
                </strong>
                <p className="text-xs text-[#626976] leading-relaxed">
                  تم تسجيل الأسئلة التي تعثرت بها تلقائياً داخل <strong>خزنة الأخطاء</strong> لتفعيل ميزة التكرار المتباعد وتثبيت حفظها قبل الامتحان الوزاري.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={startExam}
                  className="bg-[#0054a6] hover:bg-[#004284] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw size={15} />
                  <span>إعادة اختبار جديد</span>
                </button>
                <button
                  onClick={() => setViewMode('browse')}
                  className="border border-[#dce1e7] hover:bg-[#f8fafc] text-[#182433] px-6 py-2.5 rounded-xl text-xs font-bold transition"
                >
                  تصفح بنك الأسئلة بالكامل
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
