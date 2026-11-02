import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Wind,
  Zap,
  Gauge,
  Flame,
  RotateCcw
} from 'lucide-react';

export const OrganSimView: React.FC = () => {
  const [effortLevel, setEffortLevel] = useState<'rest' | 'walk' | 'run'>('rest');

  const configs = {
    rest: {
      name: 'حالة راحة واسترخاء',
      heartRate: 72,
      breathRate: 14,
      bp: '120 / 80',
      lacticAcid: 'طبيعي (0.8 mmol/L)',
      fatigue: 'منعدم',
      color: '#6bf4c7'
    },
    walk: {
      name: 'نشاط بدني متوسط (مشي)',
      heartRate: 105,
      breathRate: 20,
      bp: '135 / 85',
      lacticAcid: 'منخفض (1.6 mmol/L)',
      fatigue: 'طفيف',
      color: '#f2c575'
    },
    run: {
      name: 'مجهود بدني أقصى (ركض سريع)',
      heartRate: 155,
      breathRate: 32,
      bp: '160 / 95',
      lacticAcid: 'مرتفع جداً (7.4 mmol/L) - بداية إعياء عضلي',
      fatigue: 'إعياء عضلي شديد (تراكم حامض اللبنيك)',
      color: '#ff8195'
    }
  };

  const currentConfig = configs[effortLevel];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#29423c] text-[#6bf4c7] flex items-center justify-center font-bold">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">محاكاة فسيولوجيا أجهزة الجسم الحيوية</h2>
            <p className="text-xs text-[#82a4b8]">دراسة التغيرات الحيوية: نبض القلب، التنفس، ضغط الدم، والإعياء العضلي</p>
          </div>
        </div>

        {/* Effort level buttons */}
        <div className="flex items-center gap-1.5 bg-[#091728] p-1 rounded-xl border border-[#1b3752]">
          <button
            onClick={() => setEffortLevel('rest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              effortLevel === 'rest' ? 'bg-[#15463f] text-[#6bf4c7]' : 'text-[#7e9fb1]'
            }`}
          >
            راحة (Rest)
          </button>
          <button
            onClick={() => setEffortLevel('walk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              effortLevel === 'walk' ? 'bg-[#3b321a] text-[#f2c575]' : 'text-[#7e9fb1]'
            }`}
          >
            مشي (Walk)
          </button>
          <button
            onClick={() => setEffortLevel('run')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              effortLevel === 'run' ? 'bg-[#471b26] text-[#ff8195]' : 'text-[#7e9fb1]'
            }`}
          >
            ركض (Run)
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1b3752]">
            <div>
              <span className="text-xs text-[#f2c575] font-bold block mb-1">
                الوضع الحالي للجسم:
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#effbff]">
                {currentConfig.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: currentConfig.color }} />
              <span className="text-xs font-bold" style={{ color: currentConfig.color }}>
                محاكاة مباشرة
              </span>
            </div>
          </div>

          {/* Graphical Vital Signs Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heart Rate Card */}
            <div className="bg-[#091728] border border-[#1b3954] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#89aabc] flex items-center gap-1.5">
                  <Heart size={16} className="text-[#ff8195]" />
                  <span>نبض القلب (Heart Rate)</span>
                </span>
                <span className="font-mono text-xs text-[#ff8195]">bpm</span>
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#effbff] font-mono">
                  {currentConfig.heartRate}
                </span>
                <span className="text-xs text-[#7d9eb0]">ضربة / دقيقة</span>
              </div>
              {/* Animated ECG Wave */}
              <svg viewBox="0 0 200 40" className="w-full h-10 select-none">
                <path
                  d="M 0 20 L 40 20 L 50 5 L 60 35 L 70 10 L 80 20 L 130 20 L 140 5 L 150 35 L 160 10 L 170 20 L 200 20"
                  stroke={currentConfig.color}
                  strokeWidth="2.5"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Respiration Card */}
            <div className="bg-[#091728] border border-[#1b3954] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#89aabc] flex items-center gap-1.5">
                  <Wind size={16} className="text-[#6fe9d5]" />
                  <span>معدل التنفس (Respiration)</span>
                </span>
                <span className="font-mono text-xs text-[#6fe9d5]">cpm</span>
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#effbff] font-mono">
                  {currentConfig.breathRate}
                </span>
                <span className="text-xs text-[#7d9eb0]">دورة شهيق/زفير</span>
              </div>
              {/* Animated Lung Wave */}
              <svg viewBox="0 0 200 40" className="w-full h-10 select-none">
                <path
                  d="M 0 20 Q 25 5 50 20 T 100 20 T 150 20 T 200 20"
                  stroke="#6fe9d5"
                  strokeWidth="3"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Blood Pressure Card */}
            <div className="bg-[#091728] border border-[#1b3954] rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#89aabc] flex items-center gap-1.5">
                  <Gauge size={16} className="text-[#f2c575]" />
                  <span>ضغط الدم الشرياني (BP)</span>
                </span>
                <span className="font-mono text-xs text-[#f2c575]">mmHg</span>
              </div>
              <div className="text-3xl font-black text-[#effbff] font-mono mb-1">
                {currentConfig.bp}
              </div>
              <span className="text-[11px] text-[#7fa3b7]">
                الضغط الانقباضي / الانبساطي
              </span>
            </div>

            {/* Lactic Acid & Muscle Fatigue */}
            <div className="bg-[#091728] border border-[#1b3954] rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#89aabc] flex items-center gap-1.5">
                  <Flame size={16} className="text-[#ff8195]" />
                  <span>حامض اللبنيك (Lactic Acid)</span>
                </span>
                <span className="font-mono text-xs text-[#ff8195]">mmol/L</span>
              </div>
              <div className="text-sm font-bold text-[#effbff] mb-1">
                {currentConfig.lacticAcid}
              </div>
              <span className="text-[11px] text-[#ff99aa]">
                حالة الإعياء: {currentConfig.fatigue}
              </span>
            </div>
          </div>
        </div>

        {/* Curriculum Context Explanation */}
        <div className="lg:col-span-4 bg-[#0d1e32] border border-[#213f5c] rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#effbff] pb-3 border-b border-[#1c3852]">
            الربط المنهجي بكتاب الأحياء:
          </h3>

          <div className="space-y-3 text-xs text-[#b0d2e2] leading-relaxed">
            <div className="bg-[#081827] p-3.5 rounded-xl border border-[#19364e]">
              <b className="text-[#6bf4c7] block mb-1">الفصل الثالث: الجهاز العضلي (ص 36)</b>
              <p>
                معادلة الإعياء العضلي: <br />
                <code className="text-[#f2c575] font-mono block mt-1">
                  سكر الكلوكوز + أوكسجين → CO₂ + ماء + طاقة + حامض اللبنيك
                </code>
                عند استمرار المجهود الشديد، يتراكم حامض اللبنيك مسبباً الإعياء وعدم قدرة العضلة على الاستجابة.
              </p>
            </div>

            <div className="bg-[#081827] p-3.5 rounded-xl border border-[#19364e]">
              <b className="text-[#6fe9d5] block mb-1">الفصل الخامس: جهاز الدوران (ص 58)</b>
              <p>
                يزيد القلب من معدل ضرباته أثناء الركض لضخ كميات أكبر من الأوكسجين إلى الألياف العضلية النشطة عبر الشريان الأبهر والتخلص السريع من ثنائي أوكسيد الكربون.
              </p>
            </div>

            <div className="bg-[#081827] p-3.5 rounded-xl border border-[#19364e]">
              <b className="text-[#f2c575] block mb-1">الفصل السادس: جهاز التنفس (ص 72)</b>
              <p>
                يتسارع عمل الحجاب الحاجز والعضلات بين الأضلاع لزيادة السعة التنفسية للرئتين وتبادل الغازات بين الحويصلات الهوائية والدم.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
