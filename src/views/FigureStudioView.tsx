import React, { useState } from 'react';
import {
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { DIAGRAMS } from '../data';
import { Diagram } from '../types';
import { useApp } from '../context/AppContext';

export const FigureStudioView: React.FC = () => {
  const { addPoints } = useApp();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activeQuizLabel, setActiveQuizLabel] = useState<string | null>(null);
  const [testedLabels, setTestedLabels] = useState<Record<string, boolean>>({});

  const currentDiagram: Diagram = DIAGRAMS[selectedIdx] || DIAGRAMS[0];

  const handleSelectDiagram = (idx: number) => {
    setSelectedIdx(idx);
    setShowLabels(true);
    setActiveQuizLabel(null);
    setTestedLabels({});
  };

  const handleTestLabel = (label: string) => {
    setTestedLabels(prev => ({ ...prev, [label]: true }));
    addPoints(5);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#20473a] text-[#7bf0da] flex items-center justify-center font-bold">
            <ImageIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">استوديو الرسوم والمخططات الوزارية</h2>
            <p className="text-xs text-[#82a4b8]">18 رسماً تشريحياً وزارياً مقرراً للحفظ مع اختبار التأشيرات</p>
          </div>
        </div>

        <button
          onClick={() => setShowLabels(!showLabels)}
          className="flex items-center gap-2 bg-[#143247] hover:bg-[#1d4663] text-[#7bf0da] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#265773] transition"
        >
          {showLabels ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{showLabels ? 'إخفاء التأشيرات للاختبار' : 'إظهار التأشيرات النموذجية'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Diagram Picker Sidebar */}
        <div className="lg:col-span-4 bg-[#0d1e32] border border-[#213f5c] rounded-3xl p-5">
          <h3 className="text-xs font-bold text-[#8fb4c6] mb-3">اختر رسماً تشريحياً:</h3>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {DIAGRAMS.map((diag, idx) => (
              <button
                key={diag.id}
                onClick={() => handleSelectDiagram(idx)}
                className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  selectedIdx === idx
                    ? 'border-[#6fe8d5] bg-[#143e4d] text-[#7bf0da]'
                    : 'border-[#1b354d] bg-[#091728] text-[#c2dfec] hover:border-[#2a5578]'
                }`}
              >
                <span>{diag.title}</span>
                <span className="text-[10px] text-[#7196ac] font-normal">
                  ص {diag.page}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Diagram Viewport & Labels Practice */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1b3752]">
              <div>
                <span className="text-xs text-[#f2c575] font-bold block mb-1">
                  الفصل {currentDiagram.chapter} • صفحة الكتاب {currentDiagram.page}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#effbff]">
                  {currentDiagram.title}
                </h3>
              </div>
              <div className="text-xs text-[#8ab1c3] bg-[#091728] border border-[#1b364e] px-3 py-1.5 rounded-xl">
                {currentDiagram.labels.length} تأشيرات مقررة
              </div>
            </div>

            {/* Diagram Image */}
            <div className="bg-[#081726] border border-[#1d3d57] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <img
                src={currentDiagram.src}
                alt={currentDiagram.title}
                className="max-h-96 object-contain rounded-xl border border-[#244b6c] shadow-lg shadow-black/40"
              />

              {!showLabels && (
                <div className="absolute top-4 right-4 bg-[#ff8195]/20 text-[#ffb0be] border border-[#ff8195]/40 px-3 py-1 rounded-xl text-xs font-bold">
                  وضع الاختبار: التأشيرات مخفية
                </div>
              )}
            </div>

            {/* Labels List & Identification Test */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#8fb4c6]">
                  التأشيرات والبيانات الوزارية المقررة على الرسم:
                </span>
                <span className="text-xs text-[#6bf4c7]">
                  تم تأكيد {Object.keys(testedLabels).length} من {currentDiagram.labels.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentDiagram.labels.map((label, lIdx) => {
                  const isTested = testedLabels[label];
                  return (
                    <button
                      key={lIdx}
                      onClick={() => handleTestLabel(label)}
                      className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between text-right ${
                        isTested
                          ? 'bg-[#15463f] border-[#6fe8d5] text-[#6bf4c7]'
                          : 'bg-[#091728] border-[#1b364e] text-[#c2dfec] hover:border-[#2f638b]'
                      }`}
                    >
                      <span>{showLabels ? label : `تأشير (${lIdx + 1})`}</span>
                      {isTested && <CheckCircle size={14} className="text-[#6bf4c7]" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-[#092233] border border-[#214d60] text-xs text-[#a2d4e2] leading-relaxed">
                <span className="text-[#f2c575] font-bold block mb-1">توجيه وزاري:</span>
                في الامتحانات الوزارية، تأتي الرسوم إما بطلب "ارسم مع التأشير" أو "أشر على الرسم المعطى". تأكد من حفظ موقع النواة، المحور، والتشجرات بدقة.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
