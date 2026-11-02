import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Zap,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Info,
  ChevronLeft
} from 'lucide-react';
import { MembraneTransport3D } from '../components/MembraneTransport3D';
import { useApp } from '../context/AppContext';

export const MembraneSimView: React.FC = () => {
  const { addPoints } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'3d' | 'compare' | 'qa' | 'challenge'>('3d');
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number>(0);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Curricular Q&A & Ministerial Challenges
  const QUIZ_QUESTIONS = [
    {
      question: 'لماذا يوصف الغشاء البلازمي للخلية بأنه "اختياري النفوذية" (نصف ناضح)؟',
      options: [
        'لأنه يسمح بمرور الماء فقط ويمنع جميع الأملاح والبروتينات دون استثناء.',
        'لأنه يسمح بمرور مواد معينة ويمنع أو يبطئ مرور أخرى تبعاً لحجم جزيئاتها وحاجة الخلية.',
        'لأنه صلب لا يسمح بمرور أي مادة إلا بعد تفكك الغشاء الخلوي كلياً.',
        'لأنه مصنوع من مادة السليلوز غير المنفذة للغازات الحيوية.'
      ],
      correct: 1,
      explanation: 'الجواب الوزاري النموذجي: يُعد الغشاء البلازمي غشاءً اختيارياً لأن له نفاذية تفاضلية تسمح بمرور جزيئات معينة مثل الماء والغازات، بينما يمنع الجزيئات الكبيرة أو ينظم دخولها عبر القنوات البروتينية.'
    },
    {
      question: 'ما الفرق الجوهري بين "الانتشار البسيط" و"النقل الفعال (النشط)"؟',
      options: [
        'الانتشار البسيط يحتاج طاقة ATP، بينما النقل الفعال يحدث تلقائياً بدون طاقة.',
        'الانتشار البسيط يحدث داخل النواة فقط، والنقل الفعال يحدث خارج الخلية فقط.',
        'الانتشار البسيط ينقل من التركيز العالي إلى الواطئ دون طاقة؛ والنقل الفعال ينقل ضد التدرج (من الواطئ للعالي) باستهلاك طاقة ATP ومضخات.',
        'لا يوجد فرق، كلاهما مصطلحان يعبران عن نفس الآلية الحيوية لنقل الصوديوم.'
      ],
      correct: 2,
      explanation: 'سؤال وزاري مكرر: الانتشار البسيط حركة تلقائية تنحدر مع تدرج التركيز (طاقة صفر). أما النقل الفعال فهو ضد التدرج ويستهلك طاقة ATP ومضخة بروتينية.'
    },
    {
      question: 'أين تتجه الذيول الكارهة للماء (Hydrophobic Tails) لجزيئات الفوسفولبيد في الغشاء البلازمي؟',
      options: [
        'نحو الداخل متقابلة لتشكل مركز الغشاء غير القطبي المعزول عن الوسط المائي.',
        'نحو الخارج لتلامس السائل بين الخلوي مباشرة.',
        'نحو السيتوبلازم فقط لتلتصق بالنواة.',
        'تلتف حول القنوات البروتينية فقط ولا توجد في باقي أجزاء الغشاء.'
      ],
      correct: 0,
      explanation: 'تتجه الرؤوس المحبة للماء نحو السطحين الخارجي والداخلي لتلامس الماء، بينما تختبئ الذيول الكارهة للماء في الداخل متقابلة لتكوّن حاجزاً عازلاً.'
    },
    {
      question: 'ما المركب الكيميائي الخلوي الذي يعتبر "عملة الطاقة" المباشرة لعمل مضخات النقل النشط؟',
      options: [
        'حمض اللاكتيك (Lactic Acid)',
        'ثنائي أوكسيد الكربون (CO₂)',
        'أدينوسين ثلاثي الفوسفات (ATP)',
        'الكلايكوجين المخزون في الكبد'
      ],
      correct: 2,
      explanation: 'جزيء ATP (Adenosine Triphosphate) يحرر رابطة فوسفات عالية الطاقة عند تحوله إلى ADP + Pi مما يعطي المضخة البروتينية الطاقة اللازمة لتغيير شكلها وضخ الأيونات.'
    }
  ];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    setUserSelectedAnswer(idx);
    setIsAnswerSubmitted(true);
    if (idx === QUIZ_QUESTIONS[selectedQuizIdx].correct) {
      setQuizScore((prev) => prev + 1);
      addPoints(25);
    }
  };

  const handleNextQuiz = () => {
    if (selectedQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setSelectedQuizIdx((prev) => prev + 1);
      setUserSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setSelectedQuizIdx(0);
      setUserSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* View Header */}
      <div className="bg-gradient-to-r from-[#0b1d33] via-[#0d2745] to-[#0b1d33] border border-[#1e3f66] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shadow-inner">
              <Activity size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  الفصل الأول: بناء جسم الإنسان (ص 9 - 13)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  رسوميات تفاعلية 3D
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                محاكاة الغشاء الخلوي: الانتشار والنقل الفعال
              </h1>
              <p className="text-sm text-cyan-100/70 mt-1 max-w-2xl leading-relaxed">
                مختبر تفاعلي ثلاثي الأبعاد لدراسة حركة الجزيئات عبر ثنائي الطبقة الدهنية الفوسفاتية (Phospholipid Bilayer)،
                وتمثيل آليات الانتشار البسيط، الانتشار الميسر، والنقل النشط المستهلك لطاقة ATP.
              </p>
            </div>
          </div>

          {/* Subtab Navigation Buttons */}
          <div className="flex items-center gap-1.5 bg-[#071524] p-1.5 rounded-2xl border border-[#1a385c]">
            <button
              onClick={() => setActiveSubTab('3d')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === '3d'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={15} />
              <span>المحاكي 3D</span>
            </button>
            <button
              onClick={() => setActiveSubTab('compare')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === 'compare'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers size={15} />
              <span>جدول المقارنة الوزاري</span>
            </button>
            <button
              onClick={() => setActiveSubTab('qa')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === 'qa'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={15} />
              <span>التعاليل والأسئلة</span>
            </button>
            <button
              onClick={() => setActiveSubTab('challenge')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === 'challenge'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award size={15} />
              <span>اختبار الفهم (+25 نقطة)</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Sub-Content */}
      {activeSubTab === '3d' && (
        <div className="space-y-6">
          {/* Main 3D Simulation Canvas Component */}
          <MembraneTransport3D />

          {/* Quick Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm hover:border-cyan-400 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-[#1e293b] mb-1">الانتشار البسيط (Simple Diffusion)</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                تمر جزيئات الغازات الذائبة مثل الأوكسجين وثنائي أوكسيد الكربون مباشرة بين جزيئات الفوسفولبيد الدهنية بدون الحاجة لأي قناة وبدون استهلاك طاقة خلوية.
              </p>
              <div className="mt-3 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg inline-block">
                طاقة: 0 · الاتجاه: مع تدرج التركيز
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm hover:border-emerald-400 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-[#1e293b] mb-1">الانتشار الميسر (Facilitated Diffusion)</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                الجزيئات الكبيرة أو القطبية (كالسكر والأيونات) لا تذوب في الدهون، فتسلك قنوات بروتينية مائية خاصة تفتح لها ممراً سهلاً نحو التركيز الأقل.
              </p>
              <div className="mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                طاقة: 0 · وسيط: قناة بروتينية
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm hover:border-purple-400 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-[#1e293b] mb-1">النقل الفعال / النشط (Active Transport)</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                ضخ الأيونات قسرياً ضد منحدر التركيز الطبيعي (من الواطئ إلى العالي)؛ يغير البروتين الحامل شكله الفراغي باستهلاك طاقة ATP الخلوية.
              </p>
              <div className="mt-3 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg inline-block">
                طاقة: مستهلك لـ ATP · الاتجاه: ضد تدرج التركيز
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'compare' && (
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0]">
            <Layers className="text-[#0054a6]" size={24} />
            <div>
              <h2 className="text-xl font-bold text-[#1e293b]">
                المقارنة الوزارية الرسمية بين طرق النقل عبر الغشاء البلازمي
              </h2>
              <p className="text-xs text-[#64748b]">
                سؤال وزاري متكرر لأكثر من 8 أدوار امتحانية في العراق
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#334155] border-b border-[#e2e8f0]">
                  <th className="p-3.5 font-bold">وجه المقارنة</th>
                  <th className="p-3.5 font-bold text-sky-600">الانتشار البسيط</th>
                  <th className="p-3.5 font-bold text-emerald-600">الانتشار الميسر</th>
                  <th className="p-3.5 font-bold text-purple-600">النقل الفعال (النشط)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[#475569]">
                <tr>
                  <td className="p-3.5 font-bold bg-[#fcfcfd]">اتجاه حركة المواد</td>
                  <td className="p-3.5">من التركيز العالي إلى التركيز الواطئ (مع منحدر التركيز)</td>
                  <td className="p-3.5">من التركيز العالي إلى التركيز الواطئ (مع منحدر التركيز)</td>
                  <td className="p-3.5 font-bold text-purple-700 bg-purple-50/40">
                    من التركيز الواطئ إلى التركيز العالي (ضد منحدر التركيز)
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold bg-[#fcfcfd]">الحاجة إلى طاقة (ATP)</td>
                  <td className="p-3.5 text-emerald-600 font-bold">لا يحتاج طاقة (عملية فيزيائية غير نشطة)</td>
                  <td className="p-3.5 text-emerald-600 font-bold">لا يحتاج طاقة خلوية</td>
                  <td className="p-3.5 font-bold text-red-600 bg-red-50/40">
                    يحتاج إلى استهلاك طاقة عالية (ATP ← ADP + Pi)
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold bg-[#fcfcfd]">الحاجة إلى وسيط بروتيني ناقل</td>
                  <td className="p-3.5">لا يحتاج؛ يعبر الفوسفولبيد مباشرة</td>
                  <td className="p-3.5 font-bold text-emerald-700">يحتاج قناة بروتينية (Protein Channel)</td>
                  <td className="p-3.5 font-bold text-purple-700">يحتاج مضخة بروتينية حاملة (Carrier Protein)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold bg-[#fcfcfd]">أمثلة من جسم الإنسان</td>
                  <td className="p-3.5">تبادل الأوكسجين وCO₂ في الحويصلات الرئوية وخلايا الأنسجة</td>
                  <td className="p-3.5">دخول جزيئات الكلوكوز إلى خلايا العضلات عبر بروتينات GLUT</td>
                  <td className="p-3.5">مضخة الصوديوم والبوتاسيوم (Na⁺/K⁺ Pump) في الأعصاب لإعادة جهد الراحة</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold bg-[#fcfcfd]">حالة الاتزان النهائي</td>
                  <td className="p-3.5">يتوقف النقل الصافي عند تساوي التركيزين على جانبي الغشاء</td>
                  <td className="p-3.5">يتوقف عند تساوي التركيزين</td>
                  <td className="p-3.5 font-bold text-purple-700">
                    يستمر الضخ لتراكم المادة في جهة واحدة وتوليد تدرج كهروكيميائي
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'qa' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e2e8f0] p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              أهم التعاليل والأسئلة الوزارية الخاصة بالغشاء البلازمي والنقل
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                  سؤال وزاري (مكرر 6 مرات)
                </span>
                <h4 className="text-sm font-bold text-[#1e293b] mt-1">
                  علل: يعتبر الغشاء البلازمي غشاءً نصف ناضح (اختياري النفوذية)؟
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed mt-2 bg-white p-3 rounded-xl border border-[#e2e8f0]">
                  <strong>الجواب الوزاري:</strong> لأنه يسمح بمرور مواد معينة (كالماء والأملاح البسيطة والغازات الذائبة) ولا يسمح بمرور مواد أخرى (كالبروتينات والجزيئات الكبيرة) تبعاً لحجم جزيئاتها وحاجة الخلية الحيوية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                  سؤال وزاري
                </span>
                <h4 className="text-sm font-bold text-[#1e293b] mt-1">
                  ما التركيب الكيميائي للغشاء البلازمي؟ وما دور كل مكوّن؟
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed mt-2 bg-white p-3 rounded-xl border border-[#e2e8f0]">
                  <strong>الجواب:</strong> يتألف من طبقتين مزدوجتين من جزيئات دهنية مفسفرة (Phospholipids) ذات طرف أليف للماء وطرف نافر من الماء، تتخللها جزيئات بروتينية مطمورة ومحيطية تعمل كقنوات ومضخات لنقل المواد بآليات الانتشار الميسر والنقل الفعال.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                  تعريف وزاري
                </span>
                <h4 className="text-sm font-bold text-[#1e293b] mt-1">
                  عرف النقل الفعال (النشط) في الأحياء؟
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed mt-2 bg-white p-3 rounded-xl border border-[#e2e8f0]">
                  <strong>الجواب:</strong> هو قابلية الخلية على امتصاص أو ضخ مواد معينة من محيطها الخارجي إلى داخلها (أو العكس) بالرغم من أن تركيز تلك المواد داخل الخلية أعلى بكثير من تركيزها في الخارج، وتتم هذه العملية بمساعدة جزيئات حاملة بروتينية وباستهلاك طاقة حيوية (ATP).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'challenge' && (
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1e293b]">تحدي الفهم الوزاري الذاتي</h3>
                <p className="text-xs text-[#64748b]">
                  سؤال {selectedQuizIdx + 1} من {QUIZ_QUESTIONS.length} · النقاط المكتسبة: {quizScore * 25}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
            <h4 className="text-base font-bold text-[#1e293b] leading-relaxed">
              {QUIZ_QUESTIONS[selectedQuizIdx].question}
            </h4>
          </div>

          <div className="space-y-2.5">
            {QUIZ_QUESTIONS[selectedQuizIdx].options.map((opt, i) => {
              const isSelected = userSelectedAnswer === i;
              const isCorrect = i === QUIZ_QUESTIONS[selectedQuizIdx].correct;

              let btnStyle = 'bg-white hover:bg-slate-50 border-[#cbd5e1] text-[#334155]';
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-800';
                } else {
                  btnStyle = 'opacity-50 border-slate-200';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectAnswer(i)}
                  className={`w-full text-right p-4 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrect && <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />}
                </button>
              );
            })}
          </div>

          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-cyan-800">
                <Sparkles size={16} />
                تفسير الإجابة الوزارية النموذجية:
              </div>
              <p className="leading-relaxed">{QUIZ_QUESTIONS[selectedQuizIdx].explanation}</p>
              <div className="pt-2">
                <button
                  onClick={handleNextQuiz}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs transition"
                >
                  {selectedQuizIdx < QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي ←' : 'إعادة التحدي'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
