import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECALL_CARDS } from '../data';
import { RecallCard } from '../types';

export const VaultView: React.FC = () => {
  const { state, removeMistake, addPoints } = useApp();
  const [activeTab, setActiveTab] = useState<'mistakes' | 'flashcards'>('mistakes');
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const mistakeEntries = Object.entries(state.mistakes);
  const currentCard: RecallCard | undefined = RECALL_CARDS[currentCardIdx];

  const handleNextCard = (mastered: boolean) => {
    if (mastered) addPoints(10);
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % RECALL_CARDS.length);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#44232a] text-[#ff8195] flex items-center justify-center font-bold">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">خزنة الأخطاء وبطاقات الاستذكار السريع</h2>
            <p className="text-xs text-[#82a4b8]">
              {mistakeEntries.length} أسئلة بحاجة لمراجعة وتثبيت قبل الامتحان الوزاري
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'mistakes'
                ? 'bg-[#184557] text-[#7bf0da] border border-[#2b7180]'
                : 'text-[#87a9bc] hover:bg-[#122841]'
            }`}
          >
            خزنة الأخطاء ({mistakeEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'flashcards'
                ? 'bg-[#184557] text-[#7bf0da] border border-[#2b7180]'
                : 'text-[#87a9bc] hover:bg-[#122841]'
            }`}
          >
            بطاقات الاستذكار (18 بطاقة)
          </button>
        </div>
      </div>

      {activeTab === 'mistakes' ? (
        /* MISTAKES LIST VIEW */
        mistakeEntries.length > 0 ? (
          <div className="space-y-4">
            {mistakeEntries.map(([key, item]) => (
              <div
                key={key}
                className="bg-[#0b1f33] border border-[#203e5c] rounded-2xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#f2c575]">
                    الفصل {item.chapter} • صفحة الكتاب {item.page}
                  </span>
                  <span className="text-[#80a4b7]">تاريخ الخطأ: {item.date}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#effbff] leading-relaxed">
                  {item.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#241318] border border-[#4a1c26] p-3 rounded-xl">
                    <span className="text-[#ff99aa] block mb-1">إجابتك السابقة (غير صحيحة):</span>
                    <b className="text-[#ffb3c0]">{item.chosen}</b>
                  </div>
                  <div className="bg-[#122e2c] border border-[#21574e] p-3 rounded-xl">
                    <span className="text-[#6bf4c7] block mb-1">الإجابة المنهجية الصحيحة:</span>
                    <b className="text-[#86f5dc]">{item.correct}</b>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => removeMistake(key)}
                    className="flex items-center gap-1.5 bg-[#17463f] hover:bg-[#205e55] text-[#7bf0da] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#297066] transition"
                  >
                    <CheckCircle size={14} />
                    <span>حفظت السؤال (إزالة من الخزنة +5 نقاط)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#154639] text-[#6bf4c7] flex items-center justify-center mx-auto text-2xl font-black">
              ✓
            </div>
            <h3 className="text-xl font-bold text-[#effbff]">خزنة الأخطاء فارغة تماماً!</h3>
            <p className="text-xs sm:text-sm text-[#8eb0c3] max-w-md mx-auto leading-relaxed">
              ممتاز! لم تسجل أي أخطاء حالياً. عند إجابتك بشكل خاطئ في الاختبارات أو محاكي الامتحان الوزاري، ستُحفظ الأسئلة هنا تلقائياً لتعيد مراجعتها.
            </p>
          </div>
        )
      ) : (
        /* FLASHCARDS INTERACTIVE VIEW */
        currentCard && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs text-[#8ab2c5]">
              <span>البطاقة رقم {currentCardIdx + 1} من {RECALL_CARDS.length}</span>
              <span>الفصل {currentCard.ch} • ص {currentCard.page}</span>
            </div>

            {/* Flashcard Box with Flip action */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[280px] bg-gradient-to-br from-[#102b40] to-[#0c1f32] border border-[#275373] hover:border-[#438aa3] rounded-3xl p-8 cursor-pointer flex flex-col justify-between text-center transition-all shadow-xl shadow-black/50 select-none"
            >
              <div className="text-xs font-bold text-[#f2c575]">
                {isFlipped ? 'الإجابة والدليل المنهجي' : 'سؤال الاستذكار السريع (اضغط لقلب البطاقة)'}
              </div>

              {!isFlipped ? (
                <div className="my-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#effbff] leading-relaxed">
                    {currentCard.q}
                  </h3>
                  <span className="text-xs text-[#73a2b7] mt-3 block">
                    المختبر المصاحب: {currentCard.lab}
                  </span>
                </div>
              ) : (
                <div className="my-auto space-y-4">
                  <div className="text-lg font-bold text-[#6bf4c7]">
                    {currentCard.a[currentCard.correct]}
                  </div>
                  <p className="text-xs sm:text-sm text-[#c4ebf2] leading-relaxed bg-[#081827] p-4 rounded-2xl border border-[#1d3d57]">
                    {currentCard.why}
                  </p>
                  <div className="text-[11px] text-[#f2c575]">
                    الدليل من الكتاب: {currentCard.evidence}
                  </div>
                </div>
              )}

              <div className="text-xs text-[#78a2b5]">
                اضغط في أي مكان لقلب البطاقة ↺
              </div>
            </div>

            {/* Rating Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleNextCard(false)}
                className="py-3 rounded-2xl bg-[#132c42] hover:bg-[#1a3d5c] text-[#a1cbde] text-xs font-bold border border-[#234b6e] transition"
              >
                أحتاج مراجعتها لاحقاً
              </button>
              <button
                onClick={() => handleNextCard(true)}
                className="py-3 rounded-2xl bg-gradient-to-r from-[#6fe9d5] to-[#40d2c6] text-[#052834] text-xs font-black transition shadow-lg shadow-[#3ce0cf33]"
              >
                حفظتها بامتياز (+10 نقاط) ←
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
