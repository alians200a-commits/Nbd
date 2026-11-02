import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  Youtube,
  Download,
  AlertTriangle,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';
import { TABLER_CHAPTERS } from '../data/tablerData';

export const TablerPlannerView: React.FC = () => {
  const [days, setDays] = useState<number>(20);
  const [studyHoursPerDay, setStudyHoursPerDay] = useState<number>(2);

  // Focus mode
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [focusTimerSeconds, setFocusTimerSeconds] = useState<number>(25 * 60); // 25 min Pomodoro
  const [isFocusTimerRunning, setIsFocusTimerRunning] = useState<boolean>(false);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'teachers' | 'resources'>('plan');

  // Plan generation
  const [planList, setPlanList] = useState<{
    day: number;
    chapterName: string;
    chapterId: number;
    pages: string;
    targetCount: number;
    done: boolean;
  }[]>(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const chIdx = Math.min(10, Math.floor((i * 11) / 20));
      const ch = TABLER_CHAPTERS[chIdx];
      return {
        day: i + 1,
        chapterName: ch?.name || 'مراجعة وتثبيت وزاري',
        chapterId: ch?.id || 1,
        pages: `ص ${ch?.page || 5} إلى ${ch ? ch.page + 10 : 20}`,
        targetCount: 15,
        done: i === 0
      };
    });
  });

  const generatePlan = () => {
    if (!days || days < 1) return;
    const newPlan = Array.from({ length: days }, (_, i) => {
      const isReviewDay = i >= days - 2;
      if (isReviewDay) {
        return {
          day: i + 1,
          chapterName: 'مراجعة شاملة ليلة الامتحان وخزنة الأخطاء',
          chapterId: 0,
          pages: 'مراجعة التعاريف والتعاليل والرسوم الوزارية فقط',
          targetCount: 30,
          done: false
        };
      }
      const chIdx = Math.min(10, Math.floor((i * 11) / (days - 2)));
      const ch = TABLER_CHAPTERS[chIdx];
      return {
        day: i + 1,
        chapterName: ch?.name || 'مراجعة فصل',
        chapterId: ch?.id || 1,
        pages: `ص ${ch?.page || 5} إلى ${ch ? ch.page + 12 : 20}`,
        targetCount: Math.round(132 / days) + 5,
        done: false
      };
    });
    setPlanList(newPlan);
  };

  const toggleDay = (idx: number) => {
    setPlanList(prev => prev.map((p, i) => i === idx ? { ...p, done: !p.done } : p));
  };

  // Focus timer ticking
  React.useEffect(() => {
    let timer: any;
    if (isFocusMode && isFocusTimerRunning && focusTimerSeconds > 0) {
      timer = setInterval(() => {
        setFocusTimerSeconds(prev => {
          if (prev <= 1) {
            setIsFocusTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFocusMode, isFocusTimerRunning, focusTimerSeconds]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Curated Iraqi biology YouTube teachers
  const curatedTeachers = [
    {
      name: 'الأستاذ يوسف حاتم',
      role: 'مؤلف ملزمة كنز الأحياء',
      tag: 'أفضل للوزاريات والحلول النموذجية',
      color: 'bg-[#e6f4fe] text-[#0054a6]',
      summary: 'شرح مكثف يعتمد على أسئلة الفحص والسنوات الوزارية وتقسيم درجات الوزاري بدقة.',
      topics: ['حلول الأسئلة الوزارية من 2000 إلى 2023', 'مرشحات ليلة الامتحان', 'تأشيرات ملزمة كنز الأحياء'],
      link: 'https://www.youtube.com/results?search_query=يوسف+حاتم+احياء+ثالث+متوسط'
    },
    {
      name: 'الأستاذ ماهر نايف',
      role: 'مدرس الأحياء المتميز',
      tag: 'أفضل لتثبيت الرسوم والمفاهيم',
      color: 'bg-[#e6fffa] text-[#0ca678]',
      summary: 'طريقة تدريس تعتمد على الرسم اليدوي خطوة بخطوة وتبسيط المصطلحات المعقدة.',
      topics: ['شرح رسم الخلية العصبية', 'مخطط الدورة الدموية', 'طرق حفظ التعاليل بدون نسيان'],
      link: 'https://www.youtube.com/results?search_query=ماهر+نايف+احياء+ثالث+متوسط'
    },
    {
      name: 'الأستاذ أحمد حسان',
      role: 'خبير تدريس الأحياء الوزارية',
      tag: 'أفضل للشرح السريع والمراجعة المركزة',
      color: 'bg-[#fff4e6] text-[#d9480f]',
      summary: 'فيديوهات مركزة ومقاطع قصيرة تلخص الفصل في نصف ساعة مع أهم النقاط.',
      topics: ['المراجعة المركزة للامتحان الوزاري', 'المقارنات الشاملة', 'الأخطاء الشائعة في الدفتر الامتحاني'],
      link: 'https://www.youtube.com/results?search_query=احمد+حسان+احياء+ثالث+متوسط'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Distraction-Free Focus Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 z-50 bg-[#071321] text-white flex flex-col items-center justify-center p-6 space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <span className="badge bg-[#e6f4fe]/10 text-[#7bf0da] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#7bf0da]/30">
              🔒 وضع منع التشتت والتركيز الأقصى
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">جلسة دراسة مركزة للأحياء</h2>
            <p className="text-xs text-[#9ab1c5] max-w-md mx-auto">
              ركّز في ملزمتك الآن بدون إشعارات أو تطبيقات أخرى حتى يرن جرس الإنجاز!
            </p>
          </div>

          {/* Big Countdown */}
          <div className="w-56 h-56 rounded-full border-4 border-[#36e0dd]/40 flex flex-col items-center justify-center bg-[#0d2238] shadow-2xl shadow-[#36e0dd]/20">
            <span className="text-5xl font-mono font-black text-[#36e0dd] tracking-wider">
              {formatTimer(focusTimerSeconds)}
            </span>
            <span className="text-xs text-[#9ab1c5] mt-2 font-medium">متبقي على نهاية الجلسة</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFocusTimerRunning(!isFocusTimerRunning)}
              className="bg-[#36e0dd] hover:bg-[#20b8b5] text-[#071321] font-black px-6 py-3 rounded-2xl text-xs transition flex items-center gap-2"
            >
              {isFocusTimerRunning ? <RotateCcw size={16} /> : <Play size={16} />}
              <span>{isFocusTimerRunning ? 'إيقاف مؤقت' : 'بدء التركيز'}</span>
            </button>
            <button
              onClick={() => {
                setIsFocusMode(false);
                setIsFocusTimerRunning(false);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-2xl text-xs transition flex items-center gap-2"
            >
              <Minimize2 size={16} />
              <span>إنهاء جلسة التركيز</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation & Sub-Tabs */}
      <div className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0054a6] to-[#002f5e] text-white flex items-center justify-center font-bold shadow-md">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#182433]">جدول المراجعة الذكي ومصادر التفوق</h2>
            <p className="text-xs text-[#626976]">
              تقسيم ذكي لمنهج الأحياء الـ 132 صفحة وفق الأيام المتبقية، مع مقارنة شروحات أفضل الأساتذة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFocusMode(true);
              setIsFocusTimerRunning(true);
            }}
            className="bg-[#d63939] hover:bg-[#b52626] text-white font-black px-4 py-2 rounded-2xl text-xs transition flex items-center gap-2 shadow-sm"
          >
            <Maximize2 size={15} />
            <span>بدء وضع منع التشتت (Focus)</span>
          </button>
        </div>
      </div>

      {/* Segment Selector */}
      <div className="flex items-center gap-2 bg-white border border-[#e6e8eb] p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('plan')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'plan' ? 'bg-[#0054a6] text-white shadow-sm' : 'text-[#626976] hover:bg-[#f8fafc]'
          }`}
        >
          <Calendar size={14} />
          <span>خطة المراجعة اليومية</span>
        </button>
        <button
          onClick={() => setActiveSubTab('teachers')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'teachers' ? 'bg-[#0054a6] text-white shadow-sm' : 'text-[#626976] hover:bg-[#f8fafc]'
          }`}
        >
          <Youtube size={14} />
          <span>مقارنة شروحات كبار الأساتذة</span>
        </button>
        <button
          onClick={() => setActiveSubTab('resources')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'resources' ? 'bg-[#0054a6] text-white shadow-sm' : 'text-[#626976] hover:bg-[#f8fafc]'
          }`}
        >
          <BookOpen size={14} />
          <span>المصادر والملازم المجانية</span>
        </button>
      </div>

      {/* SubTab 1: Study Plan */}
      {activeSubTab === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Settings Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#e6e8eb] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#182433] pb-3 border-b border-[#f1f3f5]">
                إعدادات الخطة الذكية
              </h3>

              <div>
                <label className="text-xs font-bold text-[#182433] block mb-1.5">
                  كم يوم باقي للامتحان الوزاري؟
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full bg-[#f8fafc] border border-[#dce1e7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#182433] focus:outline-none focus:border-[#0054a6]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#182433] block mb-1.5">
                  ساعات الدراسة اليومية المخصصة للأحياء:
                </label>
                <select
                  value={studyHoursPerDay}
                  onChange={(e) => setStudyHoursPerDay(Number(e.target.value))}
                  className="w-full bg-[#f8fafc] border border-[#dce1e7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#182433]"
                >
                  <option value={1}>ساعة واحدة يومياً</option>
                  <option value={2}>ساعتان يومياً (موصى به)</option>
                  <option value={3}>3 ساعات (مكثف للامتحان)</option>
                </select>
              </div>

              <button
                onClick={generatePlan}
                className="w-full bg-[#0054a6] hover:bg-[#004284] text-white font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles size={16} />
                <span>إعادة توليد وتوزيع الخطة</span>
              </button>

              <div className="text-xs text-[#626976] bg-[#f8fafc] p-3.5 rounded-2xl border border-[#e6e8eb] space-y-1">
                <strong className="text-[#182433] block font-bold">معدل الإنجاز اليومي المحسوب:</strong>
                <p>
                  قراءة <strong>{Math.ceil(132 / Math.max(1, days - 2))}</strong> صفحة يومياً مع حل 15 سؤالاً وزارياً. اليومان الأخيران مخصصان لخزنة الأخطاء وليلة الامتحان!
                </p>
              </div>
            </div>
          </div>

          {/* Daily Schedule List */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-[#e6e8eb] rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#f8fafc] border-b border-[#e6e8eb] px-6 py-4 flex items-center justify-between">
                <h3 className="text-sm font-black text-[#182433]">
                  جدول المهام اليومية ({planList.length} يوماً)
                </h3>
                <span className="badge bg-[#e6fffa] text-[#0ca678] text-xs px-3 py-1 rounded-full font-bold">
                  {planList.filter(p => p.done).length} / {planList.length} أيام مكتملة
                </span>
              </div>

              <div className="divide-y divide-[#f1f3f5] max-h-[480px] overflow-y-auto">
                {planList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleDay(idx)}
                    className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition ${
                      item.done ? 'bg-[#fbfcfd]' : 'hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                        item.done ? 'bg-[#2fb344] border-[#2fb344] text-white' : 'border-[#dce1e7] bg-white'
                      }`}>
                        {item.done && <Check size={14} />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <strong className={`text-xs sm:text-sm font-bold ${
                            item.done ? 'text-[#868e96] line-through' : 'text-[#182433]'
                          }`}>
                            اليوم {item.day}: {item.chapterName}
                          </strong>
                        </div>
                        <span className="text-[11px] text-[#626976] block mt-0.5">
                          {item.pages} · هدف: حل {item.targetCount} سؤالاً وزارياً
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.done ? 'bg-[#e6fffa] text-[#0ca678]' : 'bg-[#f1f3f5] text-[#868e96]'
                    }`}>
                      {item.done ? 'منجز' : 'قيد الإنجاز'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: YouTube Teachers Comparison */}
      {activeSubTab === 'teachers' && (
        <div className="space-y-4">
          <div className="bg-[#e6f4fe] border border-[#b8e2fb] p-4 rounded-3xl text-xs text-[#0054a6] leading-relaxed">
            <strong>نظام التوصية الذكية للمحاضرات:</strong> تم اختيار أفضل أساتذة العراق لمادة الأحياء حسب نوع نقطة الضعف عند الطالب، مع احترام حقوق أصحاب القنوات وروابط المشاهدة المباشرة على يوتيوب.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {curatedTeachers.map((tc, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e6e8eb] hover:border-[#b8e2fb] rounded-3xl p-5 shadow-sm space-y-4 transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className={`badge px-2.5 py-1 rounded-lg text-[10px] font-black ${tc.color}`}>
                    {tc.tag}
                  </span>
                  <h3 className="text-base font-black text-[#182433]">{tc.name}</h3>
                  <span className="text-xs text-[#868e96] block">{tc.role}</span>
                  <p className="text-xs text-[#495057] leading-relaxed">{tc.summary}</p>

                  <div className="pt-2 border-t border-[#f1f3f5] space-y-1">
                    <strong className="text-[11px] text-[#182433] block">أبرز الموضوعات:</strong>
                    <ul className="text-[11px] text-[#626976] list-disc list-inside space-y-0.5">
                      {tc.topics.map((t, tIdx) => (
                        <li key={tIdx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={tc.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#f8fafc] hover:bg-[#e6f4fe] text-[#0054a6] border border-[#dce1e7] hover:border-[#0054a6] font-bold py-2 rounded-xl text-xs text-center transition flex items-center justify-center gap-2 mt-3"
                >
                  <Youtube size={15} />
                  <span>فتح المحاضرات على يوتيوب</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: Free Resources */}
      {activeSubTab === 'resources' && (
        <div className="bg-white border border-[#e6e8eb] rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-base font-black text-[#182433]">المصادر والملازم المعتمدة للمنهج العراقي</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#f8fafc] border border-[#e6e8eb] p-4 rounded-2xl space-y-2">
              <strong className="text-[#182433] text-sm block font-bold">كتاب الأحياء الرسمي (136 صفحة)</strong>
              <p className="text-[#626976] leading-relaxed">
                نسخة وزارة التربية العراقية المعتمدة لكتاب علم الأحياء - الإنسان وصحته للثالث المتوسط.
              </p>
              <span className="badge bg-[#e6fffa] text-[#0ca678] px-2 py-0.5 rounded text-[10px] font-bold">
                مدمج بالكامل داخل تطبيق نَبْض
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-[#e6e8eb] p-4 rounded-2xl space-y-2">
              <strong className="text-[#182433] text-sm block font-bold">ملزمة كنز الأحياء (143 صفحة)</strong>
              <p className="text-[#626976] leading-relaxed">
                ملزمة الأستاذ يوسف حاتم المتضمنة لجميع الأسئلة الوزارية والتعاليل والتعاريف من عام 2000 حتى 2023.
              </p>
              <span className="badge bg-[#e6f4fe] text-[#0054a6] px-2 py-0.5 rounded text-[10px] font-bold">
                مفهرسة في بنك الأسئلة
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
