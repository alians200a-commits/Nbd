import React from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { TabType } from '../components/Sidebar';

interface TablerAssistantViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const TablerAssistantView: React.FC<TablerAssistantViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="card bg-white border border-[#e6e8eb] rounded-3xl p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#e6fffa] text-[#0ca678] flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
          <TablerIcon name="message-chatbot" size={32} />
        </div>

        <div>
          <span className="badge bg-[#e6fffa] text-[#0ca678] px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
            صوت المعلّمة B · قيد الإنتاج
          </span>
          <h2 className="text-2xl font-extrabold text-[#182433]">معلّمة نَبْض الذكية</h2>
          <p className="text-xs sm:text-sm text-[#626976] leading-relaxed max-w-md mx-auto mt-2">
            التسجيل المرجعي B محفوظ بالنسخ الخاصة السابقة وليس منشوراً بالمستودع العام. يمكنك تجربة أداة التسميع الشفهي للتعاريف الوزارية والتحقق من دقة النطق.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigateTab('voiceCoach')}
            className="btn btn-primary bg-[#0054a6] hover:bg-[#004284] text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 transition"
          >
            <TablerIcon name="message-chatbot" size={18} />
            <span>افتح استوديو إنتاج الصوت والتسميع المنهجي</span>
          </button>
        </div>
      </div>
    </div>
  );
};
