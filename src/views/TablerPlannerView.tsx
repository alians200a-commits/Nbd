import React, { useState } from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { TABLER_CHAPTERS } from '../data/tablerData';

export const TablerPlannerView: React.FC = () => {
  const [days, setDays] = useState<number>(20);
  const [planList, setPlanList] = useState<{ title: string; done: boolean }[]>(() => {
    return Array.from({ length: 11 }, (_, i) => ({
      title: `اليوم ${i + 1} — ${TABLER_CHAPTERS[i]?.name || 'مراجعة عامة'}`,
      done: false
    }));
  });

  const generatePlan = () => {
    if (!days || days < 1 || days > 120) return;
    const newPlan = Array.from({ length: days }, (_, i) => ({
      title: `اليوم ${i + 1} — ${TABLER_CHAPTERS[Math.min(10, Math.floor((i * 11) / days))]?.name}`,
      done: false
    }));
    setPlanList(newPlan);
  };

  const toggleItem = (idx: number) => {
    setPlanList(prev => prev.map((p, i) => i === idx ? { ...p, done: !p.done } : p));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left config card */}
        <div className="lg:col-span-5">
          <div className="card bg-white border border-[#e6e8eb] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="card-title text-base font-bold text-[#182433] pb-3 border-b border-[#f1f3f5] m-0">
              صمّم جدولك
            </h3>
            <div>
              <label className="form-label block text-xs font-bold text-[#182433] mb-1.5" htmlFor="days-input">
                كم يوم باقي للامتحان؟
              </label>
              <input
                id="days-input"
                type="number"
                min="1"
                max="120"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="form-control w-full bg-[#f8fafc] border border-[#dce1e7] rounded-xl px-3 py-2 text-xs text-[#182433] focus:outline-none focus:border-[#0054a6]"
              />
            </div>
            <button
              onClick={generatePlan}
              className="btn btn-primary bg-[#0054a6] hover:bg-[#004284] text-white font-bold w-full py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <TablerIcon name="calendar-event" size={16} />
              <span>أنشئ الخطة</span>
            </button>
            <p className="text-xs text-[#868e96] leading-relaxed pt-2 border-t border-[#f1f3f5]">
              الجدول الحالي يوزع الفصول بالتساوي وفق الأيام المتبقية لمساعدتك في إنهاء المنهج بانتظام.
            </p>
          </div>
        </div>

        {/* Right daily checklist */}
        <div className="lg:col-span-7">
          <div className="card bg-white border border-[#e6e8eb] rounded-3xl overflow-hidden shadow-sm">
            <div className="card-header bg-[#f8fafc] border-b border-[#e6e8eb] px-6 py-4 flex items-center justify-between">
              <h3 className="card-title text-base font-bold text-[#182433] m-0">
                قائمة الدراسة اليومية
              </h3>
              <span className="badge bg-[#e6fffa] text-[#0ca678] text-xs px-2.5 py-0.5 rounded-full font-bold">
                {planList.filter(p => p.done).length} / {planList.length} منجز
              </span>
            </div>
            <div className="list-group list-group-flush divide-y divide-[#f1f3f5] max-h-96 overflow-y-auto">
              {planList.map((item, idx) => (
                <label
                  key={idx}
                  className="list-group-item p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[#fbfcfd] transition text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(idx)}
                    className="form-check-input w-4 h-4 text-[#0054a6] rounded"
                  />
                  <span className={item.done ? "text-[#868e96] line-through font-normal" : "text-[#182433] font-semibold"}>
                    {item.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
