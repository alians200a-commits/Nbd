import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Info,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { EXPERIMENTS } from '../data';
import { Experiment } from '../types';
import { useApp } from '../context/AppContext';
import { MembraneTransport3D } from '../components/MembraneTransport3D';

export const ExperimentsView: React.FC = () => {
  const { addPoints } = useApp();
  const [viewMode, setViewMode] = useState<'experiments' | 'membrane3d'>('experiments');
  const [selectedExpIdx, setSelectedExpIdx] = useState<number>(0);
  const [activeStateIdx, setActiveStateIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(true);

  const currentExp: Experiment = EXPERIMENTS[selectedExpIdx] || EXPERIMENTS[0];

  const handleSelectExp = (idx: number) => {
    setSelectedExpIdx(idx);
    setActiveStateIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsRunningSim(true);
  };

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    if (optionIdx === currentExp.right) {
      addPoints(15);
    }
  };

  // Render dynamic SVG animation based on experiment ID and state
  const renderExperimentVisual = () => {
    const isStateActive = activeStateIdx === 0;

    switch (currentExp.id) {
      case 'neuron':
        return (
          <svg viewBox="0 0 500 220" className="w-full h-56 select-none">
            {/* Background grid */}
            <defs>
              <linearGradient id="axonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#45e6d6" />
                <stop offset="100%" stopColor="#3b9df7" />
              </linearGradient>
            </defs>
            {/* Soma (Cell Body) */}
            <circle cx="80" cy="110" r="42" fill="#13475e" stroke="#52e0d3" strokeWidth="3" />
            <circle cx="80" cy="110" r="14" fill="#0d2b38" stroke="#87f2e6" strokeWidth="2" />
            <text x="80" y="114" textAnchor="middle" fill="#effbff" fontSize="11" fontWeight="bold">نواة</text>
            <text x="80" y="70" textAnchor="middle" fill="#7bf0da" fontSize="11">جسم الخلية</text>

            {/* Dendrites */}
            <path d="M 40 85 L 15 65 M 40 135 L 15 155 M 65 68 L 45 40 M 65 152 L 45 180" stroke="#52e0d3" strokeWidth="3" strokeLinecap="round" />

            {/* Axon */}
            <path d="M 122 110 L 400 110" stroke="url(#axonGrad)" strokeWidth="8" strokeLinecap="round" />

            {/* Myelin Sheaths */}
            {[140, 200, 260, 320].map((x, i) => (
              <g key={i}>
                <rect x={x} y="94" width="45" height="32" rx="7" fill="#1d3f57" stroke="#36869b" strokeWidth="2" />
                <text x={x + 22} y="114" textAnchor="middle" fill="#9dc0d4" fontSize="9">غمد</text>
              </g>
            ))}

            {/* Terminal Branches */}
            <path d="M 400 110 L 440 85 M 400 110 L 450 110 M 400 110 L 440 135" stroke="#52e0d3" strokeWidth="3" strokeLinecap="round" />
            <circle cx="440" cy="85" r="4" fill="#52e0d3" />
            <circle cx="450" cy="110" r="4" fill="#52e0d3" />
            <circle cx="440" cy="135" r="4" fill="#52e0d3" />

            {/* Traveling Nerve Impulse Animation */}
            {isStateActive && isRunningSim && (
              <circle r="7" fill="#fff580" filter="drop-shadow(0 0 6px #ffe600)">
                <animateMotion
                  path="M 70 110 L 445 110"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            <text x="250" y="165" textAnchor="middle" fill="#8cb9cc" fontSize="12">
              {isStateActive ? '⚡ سريان الإيعاز العصبي باتجاه التفرعات الانتهائية' : 'حالة راحة: لا يوجد سريان إيعاز عصبي'}
            </text>
          </svg>
        );

      case 'heart':
        return (
          <svg viewBox="0 0 500 220" className="w-full h-56 select-none">
            {/* Heart chambers */}
            <g transform="translate(250, 110)">
              <path
                d="M 0 -35 C -30 -80 -80 -40 -80 10 C -80 60 0 95 0 95 C 0 95 80 60 80 10 C 80 -40 30 -80 0 -35 Z"
                fill={isStateActive ? '#a12b3c' : '#73212e'}
                stroke="#ff8195"
                strokeWidth="3"
                className={isStateActive ? 'animate-pulse' : ''}
              />
              <circle cx="-30" cy="-5" r="8" fill="#44a0ff" />
              <text x="-30" y="15" textAnchor="middle" fill="#effbff" fontSize="10">أذين أيمن</text>
              <circle cx="30" cy="-5" r="8" fill="#ff4d6a" />
              <text x="30" y="15" textAnchor="middle" fill="#effbff" fontSize="10">أذين أيسر</text>
            </g>
            <text x="250" y="195" textAnchor="middle" fill="#8cb9cc" fontSize="12">
              {isStateActive ? '🫀 انقباض بطيني وضخ الدم عبر الشريان الأبهر' : 'انبساط عضلة القلب وامتلاء التجاويف بالدم'}
            </text>
          </svg>
        );

      case 'lungs':
        return (
          <svg viewBox="0 0 500 220" className="w-full h-56 select-none">
            {/* Trachea */}
            <path d="M 250 20 L 250 80" stroke="#7beed7" strokeWidth="8" strokeLinecap="round" />
            <path d="M 250 80 L 200 120 M 250 80 L 300 120" stroke="#7beed7" strokeWidth="6" strokeLinecap="round" />
            {/* Left and Right Lungs */}
            <ellipse
              cx="180"
              cy="135"
              rx={isStateActive ? 52 : 38}
              ry={isStateActive ? 58 : 44}
              fill="#22536c"
              stroke="#5bd8ea"
              strokeWidth="3"
              className="transition-all duration-700"
            />
            <ellipse
              cx="320"
              cy="135"
              rx={isStateActive ? 52 : 38}
              ry={isStateActive ? 58 : 44}
              fill="#22536c"
              stroke="#5bd8ea"
              strokeWidth="3"
              className="transition-all duration-700"
            />
            {/* Diaphragm */}
            <path
              d={isStateActive ? "M 130 190 Q 250 205 370 190" : "M 130 190 Q 250 165 370 190"}
              stroke="#f2c575"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            <text x="250" y="175" textAnchor="middle" fill="#f2c575" fontSize="11">الحجاب الحاجز</text>
            <text x="250" y="210" textAnchor="middle" fill="#8cb9cc" fontSize="12">
              {isStateActive ? 'شهيق: تسطح الحجاب الحاجز وتوسع القفص الصدري' : 'زفير: تقوس الحجاب الحاجز للأعلى واندفاع الهواء'}
            </text>
          </svg>
        );

      case 'eye':
        return (
          <svg viewBox="0 0 500 220" className="w-full h-56 select-none">
            {/* Eyeball */}
            <circle cx="250" cy="110" r="70" fill="#0f2638" stroke="#48869c" strokeWidth="3" />
            {/* Iris */}
            <circle cx="250" cy="110" r="42" fill="#1b4b60" stroke="#6be0d2" strokeWidth="2" />
            {/* Pupil */}
            <circle
              cx="250"
              cy="110"
              r={isStateActive ? 12 : 28}
              fill="#060e17"
              stroke="#345e6b"
              strokeWidth="2"
              className="transition-all duration-500"
            />
            <text x="250" y="200" textAnchor="middle" fill="#8cb9cc" fontSize="12">
              {isStateActive ? 'ضوء ساطع: تضيق حدقة العين لحماية الشبكية' : 'ضوء خافت: اتساع حدقة العين لدخول أكبر قدر من الضوء'}
            </text>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 500 220" className="w-full h-56 select-none">
            <rect x="50" y="40" width="400" height="130" rx="16" fill="#0d2436" stroke="#25516a" strokeWidth="2" />
            <circle cx="250" cy="100" r="35" fill="#1b435a" stroke="#6fe9d5" strokeWidth="3" />
            <text x="250" y="105" textAnchor="middle" fill="#effbff" fontSize="14" fontWeight="bold">
              {currentExp.name}
            </text>
            <text x="250" y="150" textAnchor="middle" fill="#9ec5d4" fontSize="12">
              الحالة الحالية: {currentExp.states[activeStateIdx]}
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#194b57] text-[#6fe9d5] flex items-center justify-center font-bold">
            <FlaskConical size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">استوديو الأبحاث والتجارب العلمية</h2>
            <p className="text-xs text-[#82a4b8]">16 تجربة تفاعلية + مختبر حركة الجزيئات وانتشار الغشاء الخلوي ثلاثي الأبعاد</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-[#091728] p-1.5 rounded-2xl border border-[#1b3752]">
          <button
            onClick={() => setViewMode('experiments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'experiments' ? 'bg-[#15463f] text-[#6bf4c7]' : 'text-[#7e9fb1] hover:text-[#effbff]'
            }`}
          >
            <FlaskConical size={14} />
            <span>تجارب المنهج الـ16</span>
          </button>
          <button
            onClick={() => setViewMode('membrane3d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'membrane3d' ? 'bg-[#0054a6] text-white shadow-md' : 'text-[#7e9fb1] hover:text-[#effbff]'
            }`}
          >
            <Activity size={14} />
            <span>محاكاة انتشار الغشاء الخلوي 3D</span>
            <span className="badge bg-cyan-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded font-bold">جديد</span>
          </button>
        </div>

        <div className="text-xs text-[#f2c575] bg-[#212718] border border-[#44461c] px-3 py-1.5 rounded-xl font-bold">
          +15 نقطة لكل تجربة صحيحة
        </div>
      </div>

      {viewMode === 'membrane3d' ? (
        <div className="space-y-4">
          <div className="bg-[#0b1f33] border border-[#214161] rounded-3xl p-5 text-white">
            <h3 className="text-lg font-extrabold text-[#effbff] flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              محاكاة حركة الجزيئات والانتشار في الغشاء الخلوي (الفصل الأول - ص 10)
            </h3>
            <p className="text-xs text-[#8cb9cc] mt-1">
              حرّك المجسم، بدّل بين آليات الانتشار البسيط والانتشار الميسر والنقل الفعال بمضخة ATP، واختبر توازن التراكيز.
            </p>
          </div>
          <MembraneTransport3D />
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Experiments List Sidebar */}
        <div className="lg:col-span-4 bg-[#0d1e32] border border-[#213f5c] rounded-3xl p-5">
          <h3 className="text-xs font-bold text-[#8fb4c6] mb-3">قائمة التجارب العلمية:</h3>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {EXPERIMENTS.map((exp, idx) => (
              <button
                key={exp.id}
                onClick={() => handleSelectExp(idx)}
                className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  selectedExpIdx === idx
                    ? 'border-[#6fe8d5] bg-[#143e4d] text-[#7bf0da]'
                    : 'border-[#1b354d] bg-[#091728] text-[#c2dfec] hover:border-[#2a5578]'
                }`}
              >
                <span>{exp.name}</span>
                <span className="text-[10px] text-[#7196ac] font-normal">
                  الفصل {exp.chapter} • ص {exp.page}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Experiment Stage & Interactive Questions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stage Viewport */}
          <div className="bg-[#0b1f33] border border-[#224463] rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1b3752] mb-4">
              <div>
                <span className="text-xs text-[#f2c575] font-bold block mb-1">
                  الفصل {currentExp.chapter} • ص {currentExp.page}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#effbff]">
                  {currentExp.name}
                </h3>
              </div>

              {/* State Toggles */}
              <div className="flex items-center gap-1.5 bg-[#081726] p-1 rounded-xl border border-[#1b3b55]">
                {currentExp.states.map((st, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setActiveStateIdx(sIdx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeStateIdx === sIdx
                        ? 'bg-[#1b4e5a] text-[#7bf0da] shadow-sm'
                        : 'text-[#82a4b8] hover:text-[#effbff]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Visual Stage */}
            <div className="bg-[#081827] border border-[#1d3d57] rounded-2xl p-4 flex items-center justify-center relative">
              {renderExperimentVisual()}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#82a4b8]">
              <span>حالة التجربة: <b>{currentExp.states[activeStateIdx]}</b></span>
              <button
                onClick={() => setIsRunningSim(!isRunningSim)}
                className="text-[#6fe8d5] hover:underline font-bold"
              >
                {isRunningSim ? 'إيقاف الحركة مؤقتاً' : 'استئناف المحاكاة'}
              </button>
            </div>
          </div>

          {/* Question & Hypothesis Box */}
          <div className="bg-[#0e2238] border border-[#224463] rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f2c575] mb-2">
              <Lightbulb size={16} />
              <span>فرضية وسؤال التجربة:</span>
            </div>

            <h4 className="text-lg font-bold text-[#effbff] mb-4 leading-relaxed">
              {currentExp.prompt}
            </h4>

            <div className="space-y-2 mb-4">
              {currentExp.options.map((opt, oIdx) => {
                let btnStyle = 'border-[#203f5c] bg-[#0c1a2c] text-[#c7e3f0] hover:border-[#386c91]';
                if (isAnswered) {
                  if (oIdx === currentExp.right) {
                    btnStyle = 'border-[#5ce0ca] bg-[#144247] text-[#6bf4c7] font-bold';
                  } else if (oIdx === selectedOption) {
                    btnStyle = 'border-[#ff8195] bg-[#3d1924] text-[#ff99aa]';
                  } else {
                    btnStyle = 'border-[#1b3348] bg-[#091523] text-[#648194] opacity-50';
                  }
                }
                return (
                  <button
                    key={oIdx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(oIdx)}
                    className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && oIdx === currentExp.right && (
                      <CheckCircle size={17} className="text-[#6bf4c7]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Scientific Takeaway */}
            {isAnswered && (
              <div className="mt-4 p-4 rounded-xl bg-[#092232] border border-[#24586d] text-xs sm:text-sm text-[#ceeff2] leading-relaxed space-y-2">
                <div className="font-bold text-[#7bf0da]">
                  {selectedOption === currentExp.right ? '✓ استنتاج علمي صحيح!' : 'ملاحظة علمية للتصحيح:'}
                </div>
                <p>{currentExp.explanation}</p>
                <div className="pt-2 border-t border-[#1b4354] text-[#f2c575] font-semibold text-xs">
                  الخلاصة المنهجية: {currentExp.takeaway}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
