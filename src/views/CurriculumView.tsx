import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Volume2,
  VolumeX,
  Search,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { CHAPTERS, TOPICS, PAGES, FIGURES } from '../data';
import { Chapter, Topic } from '../types';
import { useApp } from '../context/AppContext';

interface CurriculumViewProps {
  initialChapter?: number;
  initialPage?: number;
  onNavigateToQuiz?: (topicId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  initialChapter = 1,
  initialPage = 6,
  onNavigateToQuiz
}) => {
  const { state, toggleBookmark, completeTopic } = useApp();
  const [currentChapterId, setCurrentChapterId] = useState<number>(initialChapter);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentChapter = CHAPTERS.find((c) => c.id === currentChapterId) || CHAPTERS[0];

  // Topics for this chapter
  const chapterTopics = TOPICS.filter((t) => t.ch === currentChapterId);

  // Sync initialPage if props change
  useEffect(() => {
    if (initialPage) {
      setCurrentPage(initialPage);
      const ch = CHAPTERS.find((c) => initialPage >= c.start && initialPage <= c.end);
      if (ch) setCurrentChapterId(ch.id);
    }
  }, [initialPage]);

  // Page text
  const pageText = PAGES[String(currentPage)] || 'لا يتوفر نص لهذه الصفحة في النسخة المتاحة.';
  const hasFigure = FIGURES[String(currentPage)];
  const isBookmarked = state.bookmarkedPages.includes(currentPage);

  // Audio Speech Synthesis
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('المتصفح الحالي لا يدعم قراءة النصوص الصوتية.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(pageText.slice(0, 500));
    utterance.lang = 'ar-SA';
    utterance.rate = state.speechRate || 0.95;

    // Pick female Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar') && v.name.toLowerCase().includes('female')) ||
                    voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) utterance.voice = arVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentPage]);

  const goToNextPage = () => {
    if (currentPage < currentChapter.end) {
      setCurrentPage((prev) => prev + 1);
    } else if (currentChapterId < CHAPTERS.length) {
      const nextCh = CHAPTERS.find((c) => c.id === currentChapterId + 1);
      if (nextCh) {
        setCurrentChapterId(nextCh.id);
        setCurrentPage(nextCh.start);
      }
    }
  };

  const goToPrevPage = () => {
    if (currentPage > currentChapter.start) {
      setCurrentPage((prev) => prev - 1);
    } else if (currentChapterId > 1) {
      const prevCh = CHAPTERS.find((c) => c.id === currentChapterId - 1);
      if (prevCh) {
        setCurrentChapterId(prevCh.id);
        setCurrentPage(prevCh.end);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Chapter Navigation Bar */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setCurrentChapterId(ch.id);
                setCurrentPage(ch.start);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                currentChapterId === ch.id
                  ? 'bg-[#184457] border-[#55d9be] text-[#7bf0da] shadow-sm'
                  : 'bg-[#0d1e30] border-[#1d354a] text-[#8aaec0] hover:border-[#2b587a]'
              }`}
            >
              <span>{ch.icon}</span>
              <span>الفصل {ch.id}: {ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chapter Topics Sidebar */}
        <div className="lg:col-span-4 bg-[#0d1e32] border border-[#213f5c] rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#f2c575]">فهرس مواضيع الفصل {currentChapter.id}</span>
              <span className="text-[11px] text-[#799eb0]">ص {currentChapter.start} - ص {currentChapter.end}</span>
            </div>

            <h3 className="text-lg font-bold text-[#effbff] mb-4">
              {currentChapter.name}
            </h3>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {chapterTopics.map((topic) => {
                const isCompleted = state.finishedTopics[topic.id];
                const isSelected = topic.page === currentPage;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setCurrentPage(topic.page)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#163a4d] border-[#5ce0ca] text-[#7bf0da]'
                        : 'bg-[#091728] border-[#1b344c] text-[#c2dfec] hover:border-[#2b597c]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{topic.title}</span>
                      <span className="text-[10px] text-[#7a9cb0]">ص {topic.page}</span>
                    </div>
                    <p className="text-[11px] text-[#86a6b8] line-clamp-2 mb-2">
                      {topic.summary}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#18334b]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          completeTopic(topic.id);
                        }}
                        className={`flex items-center gap-1 text-[11px] font-bold ${
                          isCompleted ? 'text-[#6bf4c7]' : 'text-[#7e9fb1] hover:text-[#9fe2d4]'
                        }`}
                      >
                        <CheckCircle size={13} />
                        <span>{isCompleted ? 'تم إنجازه' : 'تحديد كمكتمل'}</span>
                      </button>
                      {onNavigateToQuiz && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToQuiz(topic.quiz);
                          }}
                          className="text-[11px] text-[#f2c575] hover:underline font-bold"
                        >
                          اختبر نفسك ←
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#1a354c] text-xs text-[#7d9eb0]">
            <div>المختبر المصاحب: <b>{currentChapter.lab}</b></div>
          </div>
        </div>

        {/* Textbook Reader Main Panel */}
        <div className="lg:col-span-8 bg-[#0e2238] border border-[#234563] rounded-3xl p-6 flex flex-col justify-between">
          <div>
            {/* Top Reader Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1f3c57] mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#effbff]">
                  صفحة الكتاب الوزاري: {currentPage}
                </span>
                <span className="text-xs text-[#7b9daf]">من {currentChapter.end}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice read aloud */}
                <button
                  onClick={handleToggleSpeak}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    isSpeaking
                      ? 'bg-[#3b2d18] border-[#f2c575] text-[#f2c575]'
                      : 'bg-[#12283e] border-[#294c6f] text-[#a0c5db] hover:border-[#386b99]'
                  }`}
                  title="استماع صوتي للصفحة"
                >
                  {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{isSpeaking ? 'إيقاف الاستماع' : 'استمع للصفحة'}</span>
                </button>

                {/* Bookmark toggle */}
                <button
                  onClick={() => toggleBookmark(currentPage)}
                  className={`p-2 rounded-xl text-xs font-bold transition border ${
                    isBookmarked
                      ? 'bg-[#183d36] border-[#55d9be] text-[#6bf4c7]'
                      : 'bg-[#12283e] border-[#294c6f] text-[#a0c5db] hover:border-[#386b99]'
                  }`}
                  title="حفظ الصفحة في العلامات المرجعية"
                >
                  <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Official Diagram Figure on this page if present */}
            {hasFigure && (
              <div className="mb-6 p-4 rounded-2xl bg-[#091728] border border-[#214360] flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-xs text-[#f2c575] font-bold self-start mb-2">
                  <ImageIcon size={15} />
                  <span>رسم وزاري معتمد لهذه الصفحة:</span>
                </div>
                <img
                  src={hasFigure}
                  alt={`رسم وزاري صفحة ${currentPage}`}
                  className="max-h-72 object-contain rounded-xl border border-[#2b5172]"
                />
              </div>
            )}

            {/* Page content text */}
            <div className="bg-[#091728]/80 border border-[#1b354d] rounded-2xl p-6 leading-loose text-sm sm:text-base text-[#d8edf6] whitespace-pre-wrap font-normal max-h-[500px] overflow-y-auto">
              {pageText}
            </div>
          </div>

          {/* Bottom Pagination Controls */}
          <div className="mt-6 pt-4 border-t border-[#1f3c57] flex items-center justify-between">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 5}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#142e47] hover:bg-[#1c3d5d] disabled:opacity-40 disabled:cursor-not-allowed text-[#a8d3e6] border border-[#244b6e] transition"
            >
              <ChevronRight size={16} />
              <span>الصفحة السابقة</span>
            </button>

            <span className="text-xs text-[#7a9bb0] font-mono">
              ص {currentPage}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= 132}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#142e47] hover:bg-[#1c3d5d] disabled:opacity-40 disabled:cursor-not-allowed text-[#a8d3e6] border border-[#244b6e] transition"
            >
              <span>الصفحة التالية</span>
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
