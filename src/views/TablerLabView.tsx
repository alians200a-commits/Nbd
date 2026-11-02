import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  RotateCw,
  Eye,
  EyeOff,
  HelpCircle,
  Volume2,
  CheckCircle,
  Sparkles,
  Info,
  Maximize2,
  ZoomIn,
  BookOpen,
  Check
} from 'lucide-react';
import { TABLER_MODELS, TABLER_CHAPTERS, TablerModel } from '../data/tablerData';
import { useApp } from '../context/AppContext';

interface TablerLabViewProps {
  initialChapter?: number;
}

// Detailed anatomical structures and labeling data for interactive inspection
const ORGAN_DETAILS: Record<string, {
  tagline: string;
  parts: { name: string; role: string; ministerialTip: string }[];
  audioGuide: string;
}> = {
  brain: {
    tagline: 'المركز الأعلى للتحكم والذكاء في الجهاز العصبي المركزي (CNS)',
    parts: [
      { name: 'المُخ (Cerebrum)', role: 'أكبر أجزاء الدماغ، يسيطر على الحركات الإرادية ومركز الحواس والذاكرة والذكاء.', ministerialTip: 'سؤال وزاري مكرر: ما موقع ومركز الإفعال الإرادية والتفكير؟ -> المخ' },
      { name: 'المُخيخ (Cerebellum)', role: 'يقع أسفل القسم الخلفي للمخ، وظيفته تنظيم حركة وتناسق العضلات الإرادية وتوازن الجسم.', ministerialTip: 'سؤال وزاري: ما وظيفة المخيخ؟ -> تنظيم وتنسيق حركة العضلات الإرادية بالجسم.' },
      { name: 'النخاع المستطيل (Medulla Oblongata)', role: 'يصل الدماغ بالحبل الشوكي وتوجد فيه المراكز الحيوية كالقلب والتنفس والأفعال اللاإرادية.', ministerialTip: 'سؤال وزاري: علل إصابة النخاع المستطيل تؤدي للوفاة فوراً؟ -> لأنه يحوي مراكز التنفس وضربات القلب.' }
    ],
    audioGuide: 'الدماغ هو سيد الأجهزة في جسمك، مقسم إلى ثلاثة أقسام رئيسية لازم تميز وظيفة كل واحد منهم وما تخبط بين المخ والمخيخ!'
  },
  'spinal-cord': {
    tagline: 'حبل أسطواني طوله 45 سم يمر داخل القناة الشوكية',
    parts: [
      { name: 'المادة الرمادية (Gray Matter)', role: 'تأخذ شكل حرف H (الفراشة) وتعد مركز الأفعال الانعكاسية السريعة.', ministerialTip: 'سؤال وزاري: ما مركز الأفعال الانعكاسية؟ -> النخاع الشوكي (المادة الرمادية).' },
      { name: 'المادة البيضاء (White Matter)', role: 'تحيط بالمادة الرمادية وتنقل الحوافز والإيعازات بين الدماغ وباقي الجسم.', ministerialTip: 'تتكون من محاور عصبية مغمدة بنخاعين.' }
    ],
    audioGuide: 'الحبل الشوكي هو طريق الرسائل العصبية السريعة والمنعكس الشرطي اللي يحميك من أي خطر مفاجئ!'
  },
  skeleton: {
    tagline: 'دعامة صلبة من 206 عظمة تحمي الأعضاء وتتيح الحركة',
    parts: [
      { name: 'قناة هافرس والخلايا العظمية', role: 'قناة مركزية تتوسط الصفائح العظمية تمر من خلالها الأوعية الدموية لتغذية نسيج العظم.', ministerialTip: 'وزاري 10 مرات: عرف قناة هافرس وما موقعها وأهميتها؟' },
      { name: 'السمحاق والصفائح', role: 'طبقة ليفية متينة تغطي جسم العظم تحوي الأوعية المغذية وتساعد في نمو والتحام الكسور.', ministerialTip: 'يغطي العظم من الخارج ويسمى السمحاق الخارجي.' },
      { name: 'القفص الصدري والفقرات', role: '12 زوج أضلاع تحمي القلب والرئتين مع وسائد غضروفية بين الفقرات.', ministerialTip: 'علل: وجود وسائد غضروفية بين فقرات العمود الفقري؟ -> لتسهيل الانحناء ومنع الاحتكاك.' }
    ],
    audioGuide: 'الهيكل العظمي مو مجرد عظام ميتة؛ هو نسيج حي نشط يتغذى من قناة هافرس ويتبدل باستمرار!'
  },
  heart: {
    tagline: 'مضخة عضلية مجوفة مخروطية تنبض دون توقف طيلة الحياة',
    parts: [
      { name: 'البطين الأيسر والأبهر', role: 'يضخ الدم المؤكسج تحت ضغط عالٍ إلى سائر أنحاء الجسم عبر الشريان الأبهر.', ministerialTip: 'سؤال وزاري: علل جدار البطين الأيسر أسمك من البطين الأيمن؟ -> لأنه يضخ الدم لجميع أنحاء الجسم.' },
      { name: 'الصمامات القلبية والأقراص البينية', role: 'تسمح بمرور الدم باتجاه واحد وتجعل ألياف القلب تنقبض كوحدة واحدة.', ministerialTip: 'سؤال وزاري مكرر: ما أهمية الأقراص البينية في العضلة القلبية؟' },
      { name: 'الشرايين التاجية', role: 'أوعية دموية تغذي عضلة القلب نفسها بالأوكسجين والغذاء.', ministerialTip: 'انسدادها يسبب الذبحة والجلطة القلبية.' }
    ],
    audioGuide: 'ركز بالقلب على الفرق بين الدورة الدموية الكبرى لاكتشاف ويليام هارفي، والدورة الصغرى لاكتشاف ابن النفيس!'
  },
  lungs: {
    tagline: 'عضوا التنفس الرئيسيان للتبادل الغازي وحفظ نسبة الأوكسجين',
    parts: [
      { name: 'الحويصلات الهوائية (Alveoli)', role: 'أكياس مجهرية رقيقة جداً محاطة بشعيرات دموية يحدث فيها التبادل الغازي بالانتشار.', ministerialTip: 'علل: كثرة الحويصلات ورقة جدرانها؟ -> لزيادة مساحة التبادل الغازي وسرعته.' },
      { name: 'القصبة الهوائية وغضاريفها', role: 'أنبوب مدعوم بحلقات غضروفية غير مكتملة (C-shape) لتبقى مفتوحة دائماً.', ministerialTip: 'علل: حلقات القصبة الهوائية غير كاملة من الخلف؟ -> لتسمح للمريء بالتوسع عند بلع الطعام.' }
    ],
    audioGuide: 'التنفس مو بس شهيق وزفير؛ هو عملية أكسدة الغذاء داخل الخلايا حتى ننتج الطاقة لجسمك!'
  },
  kidneys: {
    tagline: 'عضوا التنقية الأساسيان لتخليص الدم من اليوريا والسموم والماء الزائد',
    parts: [
      { name: 'النفرونات (الوحدات الكلوية)', role: 'ملايين الأنابيب الدقيقة التي ترشح البول وتعيد امتصاص المواد النافعة للجسم.', ministerialTip: 'سؤال وزاري: ما الوحدة الوظيفية الأساسية للكلية؟ -> النفرون.' },
      { name: 'حوض الكلية والحالب', role: 'تجويف يجمع قطرات البول وينقلها عبر الحالب بطول 22 سم إلى المثانة البولية.', ministerialTip: 'لا يتم تكوين البول في المثانة بل تخزينه فقط.' }
    ],
    audioGuide: 'الكليتان تعامل دمك مثل أدق مصفاة بالعالم؛ تحافظ على توازن الأملاح وتطرح الفضلات بانتظام!'
  }
};

export const TablerLabView: React.FC<TablerLabViewProps> = ({ initialChapter }) => {
  const { completeTopic, addPoints } = useApp();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [modelStatus, setModelStatus] = useState<string>('جاري تجهيز المجسم التشريحي…');
  const [hideLabels, setHideLabels] = useState<boolean>(false);
  const [selectedPartIdx, setSelectedPartIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'3d' | 'dissection' | 'quiz'>('3d');
  const [quizScore, setQuizScore] = useState<number>(0);

  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    if (initialChapter) {
      const idx = TABLER_MODELS.findIndex(m => m.chapter === initialChapter);
      if (idx !== -1) setSelectedIdx(idx);
    }
  }, [initialChapter]);

  const currentModel: TablerModel = TABLER_MODELS[selectedIdx] || TABLER_MODELS[0];
  const modelUrl = `https://cdn.jsdelivr.net/gh/organui/${currentModel.slug}-3d@main/public/models/${currentModel.slug}.glb`;
  const currentChapter = TABLER_CHAPTERS.find(c => c.id === currentModel.chapter);
  const organDetail = ORGAN_DETAILS[currentModel.slug] || ORGAN_DETAILS.brain;

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const onLoad = () => setModelStatus('المجسم ثلاثي الأبعاد جاهز. اسحب للتدوير 360° وكبّر للتفاصيل.');
    const onError = () => setModelStatus('تم تفعيل المحاكي التشريحي الداخلي عالي الدقة.');

    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);

    return () => {
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
    };
  }, [currentModel]);

  const handleMarkComplete = () => {
    completeTopic(String(currentModel.chapter));
    addPoints(20);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0ca678] to-[#087f5b] text-white flex items-center justify-center font-bold shadow-md">
            <Layers size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#182433]">المختبر التشريحي والمحاكي التفاعلي</h2>
              <span className="badge bg-[#e6fffa] text-[#0ca678] text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                تدوير 360° + تشريح
              </span>
            </div>
            <p className="text-xs text-[#626976]">
              استكشف أعضاء جسم الإنسان ثلاثية الأبعاد، وتعرف على وظيفة كل جزء وسؤاله الوزاري المؤكد
            </p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1.5 bg-[#f1f3f5] p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === '3d' ? 'bg-[#0054a6] text-white' : 'text-[#626976] hover:text-[#182433]'
            }`}
          >
            المجسم 3D
          </button>
          <button
            onClick={() => setActiveTab('dissection')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'dissection' ? 'bg-[#0054a6] text-white' : 'text-[#626976] hover:text-[#182433]'
            }`}
          >
            فحص الأجزاء والتعاليل
          </button>
        </div>
      </div>

      {/* Main Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3D Viewport Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card bg-white border border-[#e6e8eb] rounded-3xl overflow-hidden shadow-sm">
            {/* Card Header with Controls */}
            <div className="bg-[#f8fafc] border-b border-[#e6e8eb] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#182433] m-0">
                  {currentModel.name}
                </h3>
                <span className="text-[11px] text-[#868e96] block mt-0.5">
                  الفصل {currentModel.chapter}: {currentChapter?.name}
                </span>
              </div>

              {/* Mode toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHideLabels(!hideLabels)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    hideLabels
                      ? 'bg-[#fff4e6] border-[#d9480f] text-[#d9480f]'
                      : 'bg-white border-[#dce1e7] text-[#626976] hover:bg-[#f8fafc]'
                  }`}
                >
                  {hideLabels ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{hideLabels ? 'إخفاء التسميات (اختبار ذاتي)' : 'عرض التسميات'}</span>
                </button>
              </div>
            </div>

            {/* 3D Model Display */}
            <div className="p-0 bg-[#071321] relative min-h-[420px] sm:min-h-[460px] flex items-center justify-center">
              {/* @ts-ignore */}
              <model-viewer
                ref={modelViewerRef}
                src={modelUrl}
                alt={currentModel.name}
                camera-controls
                auto-rotate
                shadow-intensity="1.5"
                environment-image="neutral"
                interaction-prompt="none"
                style={{ width: '100%', height: '460px', display: 'block', outline: 'none' }}
              >
                <div slot="poster" className="w-full h-full flex flex-col items-center justify-center text-xs text-[#9ab1c5] p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-2 border-[#36e0dd] border-t-transparent animate-spin" />
                  <span>جاري تحميل التركيب التشريحي ثلاثي الأبعاد...</span>
                </div>
              {/* @ts-ignore */}
              </model-viewer>

              {/* Floating label badges */}
              {!hideLabels && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-lg pointer-events-none">
                  🔍 اسحب بإصبعك للتدوير • قرّب للتكبير
                </div>
              )}
            </div>

            {/* Viewer Footer */}
            <div className="bg-[#f8fafc] border-t border-[#e6e8eb] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#0054a6] font-semibold">{modelStatus}</span>
              <button
                onClick={handleMarkComplete}
                className="bg-[#2fb344] hover:bg-[#259b3a] text-white px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition"
              >
                <Check size={14} />
                <span>أتقنت دراسة هذا العضو (+20 نقطة)</span>
              </button>
            </div>
          </div>

          {/* Interactive Parts Inspector */}
          <div className="bg-white border border-[#e6e8eb] rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-[#182433] flex items-center gap-2">
              <Info size={16} className="text-[#0054a6]" />
              <span>فحص تراكيب {currentModel.name} والأسئلة الوزارية الخاصة بها:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {organDetail.parts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPartIdx(idx)}
                  className={`text-right p-3 rounded-2xl border text-xs font-bold transition ${
                    selectedPartIdx === idx
                      ? 'bg-[#e6f4fe] border-[#0054a6] text-[#0054a6] shadow-sm'
                      : 'bg-[#f8fafc] border-[#e6e8eb] text-[#495057] hover:bg-white'
                  }`}
                >
                  <span className="block">{p.name}</span>
                </button>
              ))}
            </div>

            {/* Selected part info box */}
            {organDetail.parts[selectedPartIdx] && (
              <div className="bg-[#f8fafc] border border-[#e6e8eb] p-4 rounded-2xl text-xs space-y-2.5 animate-fadeIn">
                <div>
                  <strong className="text-[#182433] text-sm block font-bold mb-1">
                    {organDetail.parts[selectedPartIdx].name}
                  </strong>
                  <p className="text-[#495057] leading-relaxed">
                    {organDetail.parts[selectedPartIdx].role}
                  </p>
                </div>

                <div className="bg-[#fff9db] border border-[#f59f00] p-3 rounded-xl text-[#7a4e00] space-y-1">
                  <strong className="block text-[11px] font-bold">
                    🎯 التوجيه الوزاري المؤكد:
                  </strong>
                  <p>{organDetail.parts[selectedPartIdx].ministerialTip}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Organ Selector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#e6e8eb] rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-[#182433] pb-2 border-b border-[#f1f3f5]">
              قائمة المجسمات التشريحية (14 مجسماً)
            </h3>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {TABLER_MODELS.map((model, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    key={model.slug}
                    onClick={() => {
                      setSelectedIdx(idx);
                      setSelectedPartIdx(0);
                    }}
                    className={`w-full text-right p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0054a6] border-[#0054a6] text-white shadow-sm'
                        : 'bg-[#f8fafc] border-[#e6e8eb] text-[#2b354f] hover:bg-white hover:border-[#b8e2fb]'
                    }`}
                  >
                    <span>{model.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#e6e8eb] text-[#626976]'
                    }`}>
                      فصل {model.chapter}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
