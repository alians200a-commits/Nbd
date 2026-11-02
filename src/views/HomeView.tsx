import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Layers,
  FlaskConical,
  Award,
  Image,
  CheckCircle,
  ArrowLeft,
  Volume2,
  Calendar,
  Flame,
  Star,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS, QUESTIONS } from '../data';
import { TabType } from '../components/Sidebar';

interface HomeViewProps {
  onNavigateTab: (tab: TabType, params?: { chapter?: number; page?: number }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateTab }) => {
  const { state, addPoints } = useApp();
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Pick a featured daily question
  const dailyQuestion = QUESTIONS[0] || {
    id: 'daily',
    q: 'ما الوحدة الأساسية في بناء وتركيب الجهاز العصبي؟',
    a: ['الخلية العصبية (العصبونة)', 'الحبل الشوكي', 'الغدة النخامية', 'الخلية العضلية'],
    correct: 0,
    explain: 'الخلية العصبية هي وحدة البناء والوظيفة في الجهاز العصبي عند الإنسان.',
    ch: 1,
    page: 6
  };

  const handleAnswerDaily = (idx: number) => {
    if (dailyAnswered) return;
    setSelectedOption(idx);
    setDailyAnswered(true);
    if (idx === dailyQuestion.correct) {
      addPoints(20);
    }
  };

  const completedCount = Object.keys(state.finishedTopics).length;
  const mistakesCount = Object.keys(state.mistakes).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-[#2b516f] bg-gradient-to-br from-[#10273a] via-[#0d2036] to-[#071324] p-6 sm:p-8 shadow-2xl shadow-black/50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#25ccbe]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#173e4d] text-[#6bf4c7] px-3 py-1 rounded-full text-xs font-bold mb-3 border border-[#276a73]">
            <Sparkles size={14} />
            <span>نظام التعلّم التفاعلي V7.8 • الثالث المتوسط</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#effaff] tracking-tight mb-3">
            نَبْض — مختبر الأحياء الذكي
          </h2>
          <p className="text-sm sm:text-base text-[#a3c3d5] max-w-2xl leading-relaxed mb-6">
            منصتكم التفاعلية الشاملة لدراسة كتاب الأحياء الوزاري العراقي: أطلس تشريحي 3D، استوديو الرسوم الوزارية، تجارب علمية تحاكي وظائف الأعضاء، وبنك أسئلة وزارية مدعوم بالتقييم الفوري.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('atlas')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#6fe9d5] to-[#40d2c6] text-[#052834] font-bold px-5 py-3 rounded-xl hover:brightness-110 transition shadow-lg shadow-[#3ce0cf33]"
            >
              <Layers size={18} />
              <span>استكشف الأطلس 3D ←</span>
            </button>
            <button
              onClick={() => onNavigateTab('curriculum')}
              className="flex items-center gap-2 bg-[#122e47] hover:bg-[#1a3d5e] text-[#d6effa] font-semibold px-4 py-3 rounded-xl border border-[#274f72] transition"
            >
              <BookOpen size={18} />
              <span>تصفح دروس الكتاب الوزاري</span>
            </button>
            <button
              onClick={() => onNavigateTab('ministryExam')}
              className="flex items-center gap-2 bg-[#1f283d] hover:bg-[#283552] text-[#fed37f] font-semibold px-4 py-3 rounded-xl border border-[#483f2e] transition"
            >
              <Award size={18} />
              <span>محاكي الامتحان الوزاري</span>
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 pt-6 border-t border-[#1d3d57] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0b1c2f]/80 p-3 rounded-xl border border-[#1e3c5a] text-center">
            <div className="text-xl sm:text-2xl font-black text-[#6fe9d5]">25</div>
            <div className="text-xs text-[#8cb2c5]">مجسماً تشريحياً 3D</div>
          </div>
          <div className="bg-[#0b1c2f]/80 p-3 rounded-xl border border-[#1e3c5a] text-center">
            <div className="text-xl sm:text-2xl font-black text-[#f2c575]">431</div>
            <div className="text-xs text-[#8cb2c5]">سؤالاً وزارياً مدققاً</div>
          </div>
          <div className="bg-[#0b1c2f]/80 p-3 rounded-xl border border-[#1e3c5a] text-center">
            <div className="text-xl sm:text-2xl font-black text-[#6bf4c7]">18</div>
            <div className="text-xs text-[#8cb2c5]">رسماً وزارياً للاختبار</div>
          </div>
          <div className="bg-[#0b1c2f]/80 p-3 rounded-xl border border-[#1e3c5a] text-center">
            <div className="text-xl sm:text-2xl font-black text-[#6698ff]">16</div>
            <div className="text-xs text-[#8cb2c5]">تجربة بحثية تفاعلية</div>
          </div>
        </div>
      </section>

      {/* Grid: Daily Question & Progress Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Question Studio */}
        <div className="lg:col-span-2 bg-[#0e2136] border border-[#234360] rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f2c575]">
              <Flame size={16} />
              <span>سؤال اليوم الوزاري للتنشيط السريع</span>
            </div>
            <span className="text-xs text-[#86a5b8]">الفصل الأول • ص {dailyQuestion.page}</span>
          </div>

          <h3 className="text-lg font-bold text-[#effbff] mb-4 leading-relaxed">
            {dailyQuestion.q}
          </h3>

          <div className="space-y-2 mb-4">
            {dailyQuestion.a.map((option, idx) => {
              let btnClass = 'border-[#264461] bg-[#0c1a2d] text-[#cde6f2] hover:border-[#386b8f]';
              if (dailyAnswered) {
                if (idx === dailyQuestion.correct) {
                  btnClass = 'border-[#50decf] bg-[#123e42] text-[#6bf4c7] font-bold';
                } else if (idx === selectedOption) {
                  btnClass = 'border-[#ff8195] bg-[#3e1b27] text-[#ff99aa]';
                } else {
                  btnClass = 'border-[#1e354c] bg-[#091524] text-[#6e8a9d] opacity-60';
                }
              }
              return (
                <button
                  key={idx}
                  disabled={dailyAnswered}
                  onClick={() => handleAnswerDaily(idx)}
                  className={`w-full text-right p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {dailyAnswered && idx === dailyQuestion.correct && (
                    <CheckCircle size={18} className="text-[#6bf4c7]" />
                  )}
                </button>
              );
            })}
          </div>

          {dailyAnswered && (
            <div className="mt-4 p-4 rounded-xl bg-[#0b273b] border border-[#2b5f70] text-sm text-[#c8eff0] leading-relaxed">
              <strong className="text-[#84f1df] block mb-1">
                {selectedOption === dailyQuestion.correct ? '✓ إجابة ممتازة! (+20 نقطة)' : 'توضيح الإجابة الصحيحة:'}
              </strong>
              {dailyQuestion.explain}
            </div>
          )}
        </div>

        {/* User Progress & Quick Stats */}
        <div className="bg-[#0e2136] border border-[#234360] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#effbff] flex items-center gap-2">
                <Star size={18} className="text-[#f2c575]" />
                <span>إنجازاتي الحالية</span>
              </h3>
              <span className="text-xs text-[#8aaec3]">سجل المذاكرة</span>
            </div>

            <div className="space-y-3">
              <div className="bg-[#091728] p-3 rounded-xl border border-[#1b344c] flex items-center justify-between">
                <span className="text-xs text-[#9eb6c5]">الموضوعات المكتملة:</span>
                <span className="font-bold text-[#6bf4c7]">{completedCount} / 58</span>
              </div>
              <div className="bg-[#091728] p-3 rounded-xl border border-[#1b344c] flex items-center justify-between">
                <span className="text-xs text-[#9eb6c5]">الأخطاء التي تحتاج مراجعة:</span>
                <span className="font-bold text-[#ff8195]">{mistakesCount} سؤال</span>
              </div>
              <div className="bg-[#091728] p-3 rounded-xl border border-[#1b344c] flex items-center justify-between">
                <span className="text-xs text-[#9eb6c5]">الهوية الصوتية المعتمدة:</span>
                <span className="font-bold text-[#f2c575]">المتحدث B (المعلّمة)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1d354c]">
            <button
              onClick={() => onNavigateTab('vault')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#14324d] hover:bg-[#1a4063] text-[#7de3f7] text-xs font-bold border border-[#295679] transition flex items-center justify-center gap-2"
            >
              <span>فتح خزنة الأخطاء والمراجعة</span>
              <ArrowLeft size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Chapters Carousel / Navigation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#effbff]">فصول المنهج الدراسي (الثالث المتوسط)</h3>
            <p className="text-xs text-[#8eb0c3]">اضغط على أي فصل لفتح دروسه ونماذجه ثلاثية الأبعاد واختباراته</p>
          </div>
          <button
            onClick={() => onNavigateTab('curriculum')}
            className="text-xs text-[#6fe9d5] hover:underline flex items-center gap-1 font-bold"
          >
            <span>عرض كل الفصول</span>
            <ChevronLeft size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              onClick={() => onNavigateTab('curriculum', { chapter: ch.id, page: ch.start })}
              className="bg-[#0d1e33] border border-[#213e5b] hover:border-[#387a93] rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 rounded-xl bg-[#122841] border border-[#264462] group-hover:scale-110 transition-transform">
                  {ch.icon}
                </span>
                <span className="text-[11px] font-bold text-[#8fb9cf] bg-[#14283c] px-2 py-1 rounded-md border border-[#23415c]">
                  الفصل {ch.id}
                </span>
              </div>

              <h4 className="font-bold text-[#effbff] text-base mb-1 group-hover:text-[#6fe9d5] transition-colors">
                {ch.name}
              </h4>
              <p className="text-xs text-[#8ba9bc] line-clamp-2 mb-3">
                {ch.detail}
              </p>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-[#1a334b] text-[#7195ab]">
                <span>ص {ch.start} - ص {ch.end}</span>
                <span className="text-[#6fe9d5] group-hover:translate-x-[-4px] transition-transform font-bold">
                  تصفح الدرس ←
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h3 className="text-xl font-bold text-[#effbff] mb-4">المختبرات والأنشطة التفاعلية</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateTab('experiments')}
            className="bg-gradient-to-br from-[#10273a] to-[#0c1e30] border border-[#254d66] rounded-2xl p-5 cursor-pointer hover:border-[#4295a3] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-[#194b57] text-[#6fe9d5] flex items-center justify-center mb-3">
              <FlaskConical size={20} />
            </div>
            <h4 className="font-bold text-[#effbff] mb-1">استوديو التجارب والأبحاث</h4>
            <p className="text-xs text-[#8ba9bc] leading-relaxed mb-3">
              16 تجربة علمية تفاعلية تحاكي نقل الإيعاز، نبض القلب، الشهيق والزفير، وعمل الكلية.
            </p>
            <span className="text-xs text-[#6fe9d5] font-bold">بدء التجارب ←</span>
          </div>

          <div
            onClick={() => onNavigateTab('figureStudio')}
            className="bg-gradient-to-br from-[#10273a] to-[#0c1e30] border border-[#254d66] rounded-2xl p-5 cursor-pointer hover:border-[#4295a3] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-[#29422e] text-[#75f0a8] flex items-center justify-center mb-3">
              <Image size={20} />
            </div>
            <h4 className="font-bold text-[#effbff] mb-1">استوديو الرسوم والمخططات</h4>
            <p className="text-xs text-[#8ba9bc] leading-relaxed mb-3">
              تدرّب على الرسوم الوزارية المقررة، تأشير الأجزاء، وفحص دقة الحفظ بالدرجات الشفافة.
            </p>
            <span className="text-xs text-[#75f0a8] font-bold">فتح الرسوم ←</span>
          </div>

          <div
            onClick={() => onNavigateTab('voiceCoach')}
            className="bg-gradient-to-br from-[#10273a] to-[#0c1e30] border border-[#254d66] rounded-2xl p-5 cursor-pointer hover:border-[#4295a3] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3d2e1b] text-[#f2c575] flex items-center justify-center mb-3">
              <Volume2 size={20} />
            </div>
            <h4 className="font-bold text-[#effbff] mb-1">المعلّمة الصوتية والتسميع</h4>
            <p className="text-xs text-[#8ba9bc] leading-relaxed mb-3">
              استمع لهوية المعلّمة الصوتية المعتمدة B، مع ميزة التسميع الشفهي للتعاريف الوزارية.
            </p>
            <span className="text-xs text-[#f2c575] font-bold">استماع وتسميع ←</span>
          </div>
        </div>
      </div>
    </div>
  );
};
