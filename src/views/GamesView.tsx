import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  RotateCcw,
  Trophy,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GamesView: React.FC = () => {
  const { addPoints } = useApp();
  const [activeGame, setActiveGame] = useState<'memory' | 'sorting'>('memory');

  // Memory Game State
  const initialCards = [
    { id: 1, text: 'الخلية العصبية', pairId: 'a', matched: false, flipped: false },
    { id: 2, text: 'وحدة بناء الجهاز العصبي', pairId: 'a', matched: false, flipped: false },
    { id: 3, text: 'الأقراص البينية', pairId: 'b', matched: false, flipped: false },
    { id: 4, text: 'تميز العضلة القلبية', pairId: 'b', matched: false, flipped: false },
    { id: 5, text: 'حامض اللبنيك', pairId: 'c', matched: false, flipped: false },
    { id: 6, text: 'يسبب الإعياء العضلي', pairId: 'c', matched: false, flipped: false },
    { id: 7, text: 'المخيخ', pairId: 'd', matched: false, flipped: false },
    { id: 8, text: 'تنسيق حركات العضلات', pairId: 'd', matched: false, flipped: false },
  ];

  const [cards, setCards] = useState(() => [...initialCards].sort(() => 0.5 - Math.random()));
  const [firstPick, setFirstPick] = useState<number | null>(null);
  const [secondPick, setSecondPick] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || secondPick !== null) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    if (firstPick === null) {
      setFirstPick(index);
    } else {
      setSecondPick(index);
      // Check match
      if (cards[firstPick].pairId === cards[index].pairId) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === firstPick || i === index ? { ...c, matched: true } : c
          ));
          setFirstPick(null);
          setSecondPick(null);
          setMatchedPairs(prev => prev + 1);
          addPoints(15);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === firstPick || i === index ? { ...c, flipped: false } : c
          ));
          setFirstPick(null);
          setSecondPick(null);
        }, 900);
      }
    }
  };

  const resetMemoryGame = () => {
    setCards([...initialCards].sort(() => 0.5 - Math.random()));
    setFirstPick(null);
    setSecondPick(null);
    setMatchedPairs(0);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2e3e26] text-[#7bf0da] flex items-center justify-center font-bold">
            <Gamepad2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">ألعاب ومسابقات الأحياء العلمية</h2>
            <p className="text-xs text-[#82a4b8]">تثبيت المصطلحات والمطابقة التشريحية بأسلوب تفاعلي ممتع</p>
          </div>
        </div>

        <button
          onClick={resetMemoryGame}
          className="flex items-center gap-1.5 bg-[#143249] hover:bg-[#1d4665] text-[#7bf0da] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#265373] transition"
        >
          <RotateCcw size={14} />
          <span>إعادة اللعبة</span>
        </button>
      </div>

      {/* Memory Cards Match Grid */}
      <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1b3752]">
          <div>
            <span className="text-xs font-bold text-[#f2c575] block mb-1">
              لعبة مطابقة بطاقات الذاكرة (Memory Match)
            </span>
            <p className="text-xs text-[#89acc0]">
              اقلب البطاقات وطابق بين كل مصطلح بيولوجي ووظيفته المقررة وزارياً
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#091728] px-3.5 py-1.5 rounded-xl border border-[#1b364e] text-xs">
            <Trophy size={15} className="text-[#f2c575]" />
            <span className="text-[#effbff]">أزواج مكتملة: <b>{matchedPairs} / 4</b></span>
          </div>
        </div>

        {matchedPairs === 4 ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#154639] text-[#6bf4c7] flex items-center justify-center mx-auto text-3xl font-black">
              🏆
            </div>
            <h3 className="text-2xl font-extrabold text-[#effbff]">أحسنت! أكملت المطابقة بامتياز</h3>
            <p className="text-xs sm:text-sm text-[#8bb1c4]">
              حصلت على +60 نقطة معرفية لتثبيت المصطلحات الوزارية.
            </p>
            <button
              onClick={resetMemoryGame}
              className="px-6 py-2.5 rounded-xl bg-[#6fe9d5] hover:bg-[#50dfcb] text-[#052834] text-xs font-bold transition shadow-lg shadow-[#50dfcb22]"
            >
              العب جولة جديدة ↺
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card, idx) => {
              const isShown = card.flipped || card.matched;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-32 rounded-2xl border p-4 flex items-center justify-center text-center cursor-pointer select-none transition-all duration-300 font-bold text-xs sm:text-sm ${
                    card.matched
                      ? 'bg-[#123e38] border-[#55d9be] text-[#6bf4c7] shadow-sm'
                      : isShown
                      ? 'bg-[#153e52] border-[#6fe8d5] text-[#effbff] shadow-md shadow-[#6fe8d522]'
                      : 'bg-[#081728] border-[#1b364e] text-[#608093] hover:border-[#2f5c80]'
                  }`}
                >
                  {isShown ? (
                    <span className="leading-relaxed">{card.text}</span>
                  ) : (
                    <span className="text-2xl opacity-40">؟</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
