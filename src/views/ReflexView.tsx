import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReflexView: React.FC = () => {
  const { addPoints } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [handPulled, setHandPulled] = useState<boolean>(false);

  const steps = [
    {
      num: 1,
      title: '1. المستقبل الحسي (Sensory Receptor)',
      desc: 'تتحسس نهايات الأعصاب في الجلد المؤثر المفاجئ (وخزة دبوس أو حرارة شديدة) ويتولد سيال عصبي فوري.',
      organ: 'جلد الأصابع'
    },
    {
      num: 2,
      title: '2. العصب الحسي (Sensory Neuron)',
      desc: 'ينقل السيال العصبي الحسي بسرعة هائلة من المستقبل في الجلد إلى الحبل الشوكي عبر الجذر الظهري.',
      organ: 'ألياف العصب الحسي'
    },
    {
      num: 3,
      title: '3. الخلية العصبية الموصلة (Interneuron)',
      desc: 'تتمركز في المادة الرمادية (الفراشة) داخل الحبل الشوكي، وتعمل كمركز تحويل سريع جداً دون انتظار الدماغ.',
      organ: 'الحبل الشوكي (المادة السنجابية)'
    },
    {
      num: 4,
      title: '4. العصب الحركي (Motor Neuron)',
      desc: 'يحمل الأمر الحركي الانعكاسي عبر الجذر البطني من الحبل الشوكي إلى العضلة المستجيبة.',
      organ: 'ألياف العصب الحركي'
    },
    {
      num: 5,
      title: '5. العضو المستجيب (Effector Muscle)',
      desc: 'تتقلص العضلة الثنائية للذراع على الفور وتسحب اليد بعيداً عن مصدر الخطر لحماية الجسم.',
      organ: 'عضلة الذراع الهيكلية'
    }
  ];

  const handleTriggerReflex = () => {
    setIsPlaying(true);
    setCurrentStep(1);
    setHandPulled(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep > 0 && currentStep < 5) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
    } else if (currentStep === 5) {
      setHandPulled(true);
      setIsPlaying(false);
      addPoints(10);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setHandPulled(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2b4c2b] text-[#7bf0da] flex items-center justify-center font-bold">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">محاكاة القوس الانعكاسي (Reflex Arc)</h2>
            <p className="text-xs text-[#82a4b8]">الفصل الأول — الجهاز العصبي • ص 10 (سؤال وزاري متكرر)</p>
          </div>
        </div>
        <button
          onClick={handleTriggerReflex}
          disabled={isPlaying}
          className="flex items-center gap-2 bg-[#6fe9d5] hover:bg-[#50dfcb] disabled:opacity-40 text-[#052834] text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#50dfcb33]"
        >
          <Play size={16} />
          <span>تحفيز المنعكس (وخزة دبوس)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Simulation Graphic */}
        <div className="lg:col-span-8 bg-[#0b1f33] border border-[#21415f] rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1b3750] mb-4">
              <span className="text-xs font-bold text-[#f2c575]">
                مسار السيال العصبي عبر القوس الانعكاسي
              </span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-[#8ab2c5] hover:text-[#effbff]"
              >
                <RotateCcw size={14} />
                <span>إعادة التجربة</span>
              </button>
            </div>

            {/* Interactive SVG Diagram */}
            <div className="bg-[#081827] border border-[#1b3a54] rounded-2xl p-4 flex items-center justify-center">
              <svg viewBox="0 0 600 320" className="w-full h-72 select-none">
                {/* Finger & Pin (Left side) */}
                <g transform="translate(60, 220)">
                  {/* Pin */}
                  <path d="M 0 35 L 25 15 L 20 40 Z" fill="#ff8195" />
                  <line x1="25" y1="15" x2="35" y2="7" stroke="#ff4d6a" strokeWidth="3" />
                  {/* Hand/Finger */}
                  <path
                    d={handPulled
                      ? "M 15 -35 C 30 -35 45 -20 45 0 C 45 15 35 25 20 25"
                      : "M 25 0 C 40 0 55 15 55 35 C 55 50 45 60 30 60"}
                    fill="#3b6982"
                    stroke="#64b4d6"
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  <text x="35" y="-10" textAnchor="middle" fill="#7bf0da" fontSize="11" fontWeight="bold">
                    جلد الإصبع
                  </text>
                  {currentStep >= 1 && (
                    <circle cx="28" cy="10" r="9" fill="#ff4d6a" className="animate-ping" opacity="0.75" />
                  )}
                </g>

                {/* Sensory Nerve Path (Blue line from finger up to spinal cord) */}
                <path
                  d="M 100 230 C 160 170 200 90 350 90"
                  stroke={currentStep >= 2 ? '#45e6d6' : '#225169'}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="6,4"
                  className={currentStep === 2 ? 'animate-pulse' : ''}
                />
                <text x="210" y="130" fill="#7bf0da" fontSize="11" fontWeight="bold">
                  عصب حسي (الجذر الظهري)
                </text>

                {/* Spinal Cord Cross Section (Center right) */}
                <g transform="translate(370, 70)">
                  {/* Spinal Cord Outer boundary */}
                  <ellipse cx="90" cy="80" rx="80" ry="65" fill="#153247" stroke="#3d6f8a" strokeWidth="3" />
                  {/* Gray Matter (Butterfly shape) */}
                  <path
                    d="M 60 55 C 80 70 80 90 60 105 C 85 95 95 95 120 105 C 100 90 100 70 120 55 C 95 65 85 65 60 55 Z"
                    fill={currentStep >= 3 ? '#50e9db' : '#254e66'}
                    stroke="#73d9e8"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                  <text x="90" y="84" textAnchor="middle" fill="#effbff" fontSize="10" fontWeight="bold">
                    خلية موصلة
                  </text>
                  <text x="90" y="20" textAnchor="middle" fill="#eaf8ff" fontSize="12" fontWeight="bold">
                    الحبل الشوكي
                  </text>
                </g>

                {/* Motor Nerve Path (Green line from spinal cord down to muscle) */}
                <path
                  d="M 400 170 C 350 250 260 250 180 230"
                  stroke={currentStep >= 4 ? '#6bf4c7' : '#225169'}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="6,4"
                  className={currentStep === 4 ? 'animate-pulse' : ''}
                />
                <text x="290" y="250" fill="#6bf4c7" fontSize="11" fontWeight="bold">
                  عصب حركي (الجذر البطني)
                </text>

                {/* Arm Muscle Effector */}
                <g transform="translate(140, 200)">
                  <ellipse
                    cx="25"
                    cy="25"
                    rx={handPulled ? 22 : 30}
                    ry={handPulled ? 32 : 18}
                    fill={currentStep >= 5 ? '#a83b4c' : '#572d38'}
                    stroke="#ff8195"
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  <text x="25" y="28" textAnchor="middle" fill="#effbff" fontSize="10" fontWeight="bold">
                    عضلة الذراع
                  </text>
                </g>

                {/* Impulse traveling dot */}
                {isPlaying && currentStep === 2 && (
                  <circle cx="180" cy="150" r="7" fill="#fff" filter="drop-shadow(0 0 6px #50e9db)" />
                )}
                {isPlaying && currentStep === 4 && (
                  <circle cx="320" cy="220" r="7" fill="#fff" filter="drop-shadow(0 0 6px #6bf4c7)" />
                )}
              </svg>
            </div>
          </div>

          {/* Current Step Status Card */}
          <div className="mt-4 p-4 rounded-2xl bg-[#091929] border border-[#1b3b55] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#75f0a8] font-bold block mb-1">
                {currentStep === 0 ? 'اضغط "تحفيز المنعكس" لمشاهدة الحركة' : `المرحلة ${currentStep} من 5:`}
              </span>
              <p className="text-sm font-bold text-[#effbff]">
                {currentStep === 0 ? 'الجهاز العصبي في حالة راحة ومراقبة' : steps[currentStep - 1]?.title}
              </p>
            </div>
            {handPulled && (
              <span className="bg-[#14423b] text-[#6bf4c7] border border-[#2e8275] px-3 py-1.5 rounded-xl text-xs font-bold animate-bounce">
                ✓ تم سحب اليد بنجاح! (+10 نقاط)
              </span>
            )}
          </div>
        </div>

        {/* Reflex Arc Steps Breakdown */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-[#8fb4c6]">المراحل الخمس للقوس الانعكاسي:</h3>
          {steps.map((st) => {
            const isCurrent = currentStep === st.num;
            const isDone = currentStep >= st.num;
            return (
              <div
                key={st.num}
                className={`p-3.5 rounded-2xl border transition ${
                  isCurrent
                    ? 'bg-[#153e4c] border-[#6fe8d5] text-[#7bf0da]'
                    : isDone
                    ? 'bg-[#0b2436] border-[#22506e] text-[#cbe5f2]'
                    : 'bg-[#091728] border-[#183149] text-[#7195aa]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{st.title}</span>
                  {isDone && <CheckCircle size={14} className="text-[#6bf4c7]" />}
                </div>
                <p className="text-[11px] leading-relaxed mb-2 opacity-90">
                  {st.desc}
                </p>
                <span className="text-[10px] text-[#f2c575] font-semibold block">
                  العضو: {st.organ}
                </span>
              </div>
            );
          })}

          <div className="p-4 rounded-2xl bg-[#112338] border border-[#204060] text-xs text-[#9fc2d4] leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#f2c575] font-bold mb-1">
              <Lightbulb size={14} />
              <span>فائدة وزارية مهمة:</span>
            </div>
            تحدث الأفعال الانعكاسية دون تدخل الدماغ لتوفير أقصى سرعة استجابة لحماية الجسم من الأذى، ويعود القرار فيها للحبل الشوكي.
          </div>
        </div>
      </div>
    </div>
  );
};
