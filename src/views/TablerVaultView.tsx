import React, { useState } from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { useApp } from '../context/AppContext';

export const TablerVaultView: React.FC = () => {
  const { state, removeMistake } = useApp();
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  const mistakesList = Object.entries(state.mistakes);

  const handleReview = (key: string) => {
    setActiveReviewId(key);
  };

  const handleResolve = (key: string) => {
    removeMistake(key);
    setActiveReviewId(null);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[#182433]">خزنة الأخطاء</h2>
          <p className="text-xs text-[#626976]">
            الأسئلة التي أخطأت بها ترجع لك وفق فترات متزايدة حتى تتأكد من تثبيتها بالكامل.
          </p>
        </div>
        <span className="badge bg-[#ffeceb] text-[#d63939] px-3 py-1 rounded-full text-xs font-bold">
          {mistakesList.length} أخطاء تحتاج متابعة
        </span>
      </div>

      <div className="card bg-white border border-[#e6e8eb] rounded-3xl overflow-hidden shadow-sm">
        {mistakesList.length > 0 ? (
          <div className="list-group list-group-flush divide-y divide-[#f1f3f5]">
            {mistakesList.map(([key, item]) => {
              const isReviewing = activeReviewId === key;
              return (
                <div key={key} className="p-4 transition hover:bg-[#fbfcfd]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <strong className="text-sm text-[#182433] leading-relaxed block">
                        {item.question}
                      </strong>
                      <div className="text-xs text-[#868e96] flex items-center gap-2">
                        <span>مرات الخطأ: 1</span>
                        <span>·</span>
                        <span>الفصل {item.chapter} (ص {item.page})</span>
                        <span>·</span>
                        <span className="text-[#d63939]">إجابتك السابقة: {item.chosen}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReview(key)}
                        className="btn btn-outline-primary border border-[#0054a6] text-[#0054a6] hover:bg-[#0054a6] hover:text-white px-3 py-1.5 rounded-xl font-bold text-xs transition"
                      >
                        راجعني
                      </button>
                    </div>
                  </div>

                  {isReviewing && (
                    <div className="mt-3 p-4 bg-[#f8fafc] border border-[#e6e8eb] rounded-2xl text-xs space-y-2">
                      <div className="font-bold text-[#0ca678]">
                        الإجابة الصحيحة المعتمدة: {item.correct}
                      </div>
                      <div className="text-[#626976]">
                        هل حفظت الإجابة النموذجية وتريد إزالتها من خزنة الأخطاء؟
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleResolve(key)}
                          className="btn btn-success bg-[#2fb344] hover:bg-[#259b3a] text-white px-3 py-1.5 rounded-xl font-bold text-xs"
                        >
                          ✓ تم الحفظ (إزالة من الخزنة)
                        </button>
                        <button
                          onClick={() => setActiveReviewId(null)}
                          className="btn btn-outline-secondary border border-[#dce1e7] px-3 py-1.5 rounded-xl text-xs"
                        >
                          إغلاق
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-xs sm:text-sm text-[#868e96] space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#e6fffa] text-[#0ca678] flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div className="font-bold text-[#182433]">لا توجد أخطاء محفوظة حالياً</div>
            <p>اختبر نفسك في قسم الاختبارات حتى تبدأ المراجعة الذكية.</p>
          </div>
        )}
      </div>
    </div>
  );
};
