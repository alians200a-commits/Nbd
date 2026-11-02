import React from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { TABLER_CHAPTERS } from '../data/tablerData';
import { useApp } from '../context/AppContext';
import { TabType } from '../components/Sidebar';

interface TablerChaptersViewProps {
  onNavigateTab: (tab: TabType, params?: { chapter?: number }) => void;
}

export const TablerChaptersView: React.FC<TablerChaptersViewProps> = ({ onNavigateTab }) => {
  const { state } = useApp();

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#182433]">فصول الأحياء</h2>
        <p className="text-xs text-[#626976]">
          11 فصلاً وفق فهرس الكتاب العراقي. اختر الفصل لتنتقل إلى مجسمه المرتبط إن كان متوفراً، أو تصفح دروسه واختباراته.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TABLER_CHAPTERS.map((ch) => {
          const isDone = state.finishedTopics[String(ch.id)];
          return (
            <div
              key={ch.id}
              className="card bg-white border border-[#e6e8eb] hover:border-[#0054a6] rounded-2xl p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-[#e6f4fe] text-[#0054a6] flex items-center justify-center">
                    <TablerIcon name={ch.icon} size={22} />
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                    isDone ? 'bg-[#e6fffa] text-[#0ca678]' : 'bg-[#f1f3f5] text-[#495057]'
                  }`}>
                    {isDone ? 'تمت مراجعته' : `الفصل ${ch.id}`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#182433] mt-3 mb-1">
                  {ch.name}
                </h3>
                <p className="text-xs text-[#626976] leading-relaxed mb-4">
                  {ch.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#f1f3f5] text-xs">
                <span className="text-[#868e96] font-mono">ص {ch.page}</span>
                <button
                  onClick={() => onNavigateTab('lab', { chapter: ch.id })}
                  className="btn btn-outline-primary border border-[#0054a6] text-[#0054a6] hover:bg-[#0054a6] hover:text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>افتح الموضوع</span>
                  <TablerIcon name="book" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
