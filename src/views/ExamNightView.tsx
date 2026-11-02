import React, { useState } from 'react';
import {
  Moon,
  Sparkles,
  BookOpen,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VERIFIED_RECORDS } from '../data';

export const ExamNightView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'definitions' | 'reasons' | 'comparisons' | 'drawings'>('definitions');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (idx: number) => {
    setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const highYieldReasons = [
    {
      q: 'لماذا سميت العضلات الهيكلية بهذا الاسم؟ ولماذا سميت الملساء بهذا الاسم؟',
      a: 'سميت الهيكلية لأنها ترتبط بالهيكل العظمي مباشرة وتحرك الجسم بإرادة الإنسان، بينما سميت الملساء لأن أليافها العضلية غير مخططة وغير مرتبطة بالهيكل العظمي وحركتها لا إرادية.'
    },
    {
      q: 'علل: احتواء عضلة القلب على أقراص بينية؟',
      a: 'لأن الأقراص البينية تمثل الغشاء الخلوي الفاصل بين كل خليتين من خلايا عضلة القلب، مما يسمح بانتقال الإيعاز العصبي والانقباض السريع لجميع خلايا القلب كوحدة واحدة.'
    },
    {
      q: 'علل: إصابة العضلات بالإعياء عند بذل مجهود شاق ومستمر؟',
      a: 'بسبب نقص الأوكسجين وتراكم حامض اللبنيك (Lactic acid) الناتج من أكسدة سكر الجلوكوز لاهوائياً، مما يؤدي لعدم استجابة العضلة للعمل رغم صدور الأوامر العصبية لها.'
    },
    {
      q: 'علل: وجود صمامات في الأوردة دون الشرايين؟',
      a: 'لأن ضغط الدم في الأوردة منخفض، فالصمامات تمنع رجوع الدم للخلف وتجبره على التدفق باتجاه القلب ضد الجاذبية الأرضية.'
    },
    {
      q: 'علل: خلو كريات الدم الحمر في الثدييات البالغة من النواة؟',
      a: 'لتوفير أقصى مساحة ممكنة لحمل صبغة الهيموغلوبين ونقل أكبر كمية من الأوكسجين وثنائي أوكسيد الكربون بكفاءة عالية.'
    }
  ];

  const highYieldComparisons = [
    {
      title: 'مقارنة بين أنواع العضلات (الهيكلية والملساء والقلبية)',
      headers: ['وجه المقارنة', 'العضلات الهيكلية', 'العضلات الملساء', 'العضلات القلبية'],
      rows: [
        ['الموقع', 'ترتبط بالعظام (الساق والذراع)', 'جدار المعدة والأمعاء والأوعية', 'جدار القلب فقط'],
        ['الإرادة', 'إرادية يتحكم بها الإنسان', 'لا إرادية لا يسيطر عليها', 'لا إرادية تنبض تلقائياً'],
        ['التخطيط', 'مخططة اسطوانية حمراء', 'غير مخططة مغزلية الشكل', 'مخططة متفرعة حمراء'],
        ['النواة', 'عديدة النوى جانبية الموقع', 'أحادية النواة مركزية الموقع', 'أحادية أو متعددة بوجود أقراص بينية'],
      ]
    },
    {
      title: 'مقارنة بين الشرايين والأوردة',
      headers: ['وجه المقارنة', 'الشرايين (Arteries)', 'الأوردة (Veins)'],
      rows: [
        ['اتجاه الدم', 'تنقل الدم من القلب إلى أنحاء الجسم', 'تنقل الدم من أنحاء الجسم إلى القلب'],
        ['نوع الدم المحمول', 'دم مؤكسج نقي أحمر قانٍ (عدا الرئوي)', 'دم غير مؤكسج داكن (عدا الرئوي)'],
        ['سماكة الجدار', 'جدرانها سميكة ومرنة لتتحمل الضغط', 'جدرانها أرق وأقل مرونة'],
        ['الصمامات', 'لا توجد بها صمامات داخلية', 'توجد صمامات تمنع رجوع الدم'],
      ]
    }
  ];

  const mustKnowDrawings = [
    { name: 'الخلية العصبية النموذجية', page: 6, focus: 'تأشير جسم الخلية، النواة، المحور، الغمد الدهني، والتشجرات' },
    { name: 'القوس الانعكاسي ومقطع الحبل الشوكي', page: 10, focus: 'المادة الرمادية (الفراشة)، العصب الحسي، والعصب الحركي' },
    { name: 'أنواع العضلات الثلاث', page: 33, focus: 'رسم العضلة الملساء المغزلية والقلبية المتفرعة بالأقراص البينية' },
    { name: 'تركيب السن الطولي', page: 43, focus: 'التاج، العنق، الجذر، الميناء، العاج، واللب' },
    { name: 'الجهاز البولي عند الإنسان', page: 83, focus: 'الكليتان، الحالبان، المثانة، والإحليل' },
    { name: 'مقطع طولي في الكلية', page: 84, focus: 'القشرة، اللب، وحوض الكلية' },
    { name: 'مخطط الدورة الدموية الكبرى والصغرى', page: 60, focus: 'مسار الدم من البطين الأيسر إلى الجسم والعودة للأذين الأيمن' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#17253d] to-[#0f1b2f] border border-[#274063] p-5 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#263b61] text-[#f2c575] flex items-center justify-center font-bold text-2xl shadow-lg">
            <Moon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#effbff]">مراجعة ليلة الامتحان والتركيز الوزاري</h2>
            <p className="text-xs text-[#95b8cb]">الملخصات الحاسمة والمقارنات الإلزامية وأسئلة التعليل الأكثر تكراراً</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#091524] p-1 rounded-2xl border border-[#1b344e]">
          <button
            onClick={() => setActiveCategory('definitions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCategory === 'definitions' ? 'bg-[#1b4e5f] text-[#7bf0da]' : 'text-[#82a4b8]'
            }`}
          >
            التعاريف الوزارية
          </button>
          <button
            onClick={() => setActiveCategory('reasons')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCategory === 'reasons' ? 'bg-[#1b4e5f] text-[#7bf0da]' : 'text-[#82a4b8]'
            }`}
          >
            علل لما يأتي
          </button>
          <button
            onClick={() => setActiveCategory('comparisons')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCategory === 'comparisons' ? 'bg-[#1b4e5f] text-[#7bf0da]' : 'text-[#82a4b8]'
            }`}
          >
            المقارنات
          </button>
          <button
            onClick={() => setActiveCategory('drawings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCategory === 'drawings' ? 'bg-[#1b4e5f] text-[#7bf0da]' : 'text-[#82a4b8]'
            }`}
          >
            الرسوم المقررة
          </button>
        </div>
      </div>

      {/* DEFINITIONS TAB */}
      {activeCategory === 'definitions' && (
        <div className="space-y-3">
          <div className="text-xs text-[#8ab1c3] mb-1">
            مجموعة من أهم التعاريف الوزارية الواردة في الامتحانات (مرتبطة بصفحات الكتاب):
          </div>
          {VERIFIED_RECORDS.map((rec, idx) => {
            const isOpen = openItems[idx];
            return (
              <div
                key={rec.id}
                className="bg-[#0b1f33] border border-[#203e5c] rounded-2xl p-4 transition-all"
              >
                <div
                  onClick={() => toggleItem(idx)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#f2c575]">الفصل {rec.chapter} • ص {rec.page}</span>
                    <h3 className="text-sm sm:text-base font-bold text-[#effbff]">{rec.prompt}</h3>
                  </div>
                  <span className="text-[#6fe9d5] p-1">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-[#1a3752] text-xs sm:text-sm text-[#bde3f0] leading-relaxed bg-[#081827] p-3 rounded-xl border border-[#19364e]">
                    <span className="text-[#6bf4c7] font-bold block mb-1">التعريف النموذجي:</span>
                    {rec.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* REASONS TAB */}
      {activeCategory === 'reasons' && (
        <div className="space-y-4">
          {highYieldReasons.map((item, idx) => (
            <div key={idx} className="bg-[#0b1f33] border border-[#203e5c] rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-[#f2c575] block">سؤال تعليل وزاري متكرر:</span>
              <h3 className="text-sm sm:text-base font-bold text-[#effbff] leading-relaxed">
                {item.q}
              </h3>
              <div className="bg-[#081827] p-3.5 rounded-xl border border-[#1a364e] text-xs sm:text-sm text-[#bfe7f5] leading-relaxed mt-2">
                <span className="text-[#6bf4c7] font-bold block mb-1">السبب العلمي:</span>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPARISONS TAB */}
      {activeCategory === 'comparisons' && (
        <div className="space-y-6">
          {highYieldComparisons.map((comp, idx) => (
            <div key={idx} className="bg-[#0b1f33] border border-[#203e5c] rounded-2xl p-5 space-y-4 overflow-hidden">
              <h3 className="text-base font-bold text-[#effbff] flex items-center gap-2">
                <Sparkles size={16} className="text-[#f2c575]" />
                <span>{comp.title}</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#122c42] text-[#7bf0da] border-b border-[#254f6e]">
                      {comp.headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comp.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-[#17324c] hover:bg-[#0d2238] transition">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`p-3 ${cIdx === 0 ? 'font-bold text-[#f2c575]' : 'text-[#c6e4f2]'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DRAWINGS TAB */}
      {activeCategory === 'drawings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mustKnowDrawings.map((draw, idx) => (
            <div key={idx} className="bg-[#0b1f33] border border-[#203e5c] rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#effbff] text-sm">{draw.name}</span>
                <span className="text-[#f2c575] bg-[#14263a] px-2 py-0.5 rounded-md border border-[#274665]">
                  ص {draw.page}
                </span>
              </div>
              <p className="text-xs text-[#8cb4c7] leading-relaxed">
                <b className="text-[#6bf4c7]">التركيز الوزاري:</b> {draw.focus}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
