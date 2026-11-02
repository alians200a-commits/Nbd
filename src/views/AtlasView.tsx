import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  ExternalLink,
  BookOpen,
  Search,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { ATLAS_MODELS, SCENES } from '../data';
import { AtlasModel, Scene3D } from '../types';

interface AtlasViewProps {
  onNavigateToPage?: (page: number) => void;
}

export const AtlasView: React.FC<AtlasViewProps> = ({ onNavigateToPage }) => {
  const [activeTab, setActiveTab] = useState<'atlas3d' | 'teachingLab'>('atlas3d');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [teachingSceneIndex, setTeachingSceneIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(0);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [userPartGuess, setUserPartGuess] = useState<number | null>(null);

  const modelViewerRef = useRef<any>(null);

  // Filter 3D models
  const filteredModels = ATLAS_MODELS.filter((m) =>
    (m.title + ' ' + m.chapter + ' ' + m.description).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentModel: AtlasModel = filteredModels[selectedIndex] || ATLAS_MODELS[0];
  const currentScene: Scene3D = SCENES[teachingSceneIndex] || SCENES[0];

  const toggleRotation = () => {
    setIsRotating((prev) => !prev);
    if (modelViewerRef.current) {
      modelViewerRef.current.autoRotate = !isRotating;
    }
  };

  const resetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.resetTurntableRotation?.();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Selector: 3D Reference Atlas vs Interactive Teaching Lab */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0c1c2e] p-2 rounded-2xl border border-[#213e5a]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('atlas3d')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
              activeTab === 'atlas3d'
                ? 'bg-[#1a4454] text-[#7bf0da] border border-[#2c727d]'
                : 'text-[#87a9bc] hover:bg-[#11273f]'
            }`}
          >
            <Layers size={17} />
            <span>الأطلس التشريحي المرجعي (25 مجسماً 3D)</span>
          </button>
          <button
            onClick={() => setActiveTab('teachingLab')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
              activeTab === 'teachingLab'
                ? 'bg-[#1a4454] text-[#7bf0da] border border-[#2c727d]'
                : 'text-[#87a9bc] hover:bg-[#11273f]'
            }`}
          >
            <Sparkles size={17} />
            <span>المختبر التعليمي لأجزاء الأعضاء (16 مشهداً)</span>
          </button>
        </div>

        <div className="text-xs text-[#7c9cb0] px-3 py-1">
          {activeTab === 'atlas3d' ? 'دقة تشريحية عالية 360°' : 'تسمية وحفظ أجزاء العضو المنهجية'}
        </div>
      </div>

      {activeTab === 'atlas3d' ? (
        /* ATLAS 3D MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Viewport */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative w-full h-[420px] sm:h-[540px] rounded-3xl border border-[#265063] bg-radial from-[#1b4b55] via-[#0d2436] to-[#07111d] overflow-hidden shadow-2xl shadow-black/60">
              {/* @ts-ignore */}
              <model-viewer
                ref={modelViewerRef}
                src={currentModel.url}
                alt={currentModel.title}
                camera-controls
                auto-rotate={isRotating ? 'auto-rotate' : undefined}
                rotation-per-second="15deg"
                shadow-intensity="1"
                exposure="1.1"
                environment-image="neutral"
                interaction-prompt="none"
                loading="eager"
                touch-action="pan-y"
              >
                {/* Fallback slot */}
                <div slot="poster" className="w-full h-full flex items-center justify-center text-xs text-[#89b2c3]">
                  جاري تحميل النموذج التشريحي...
                </div>
              {/* @ts-ignore */}
              </model-viewer>

              {/* Viewport Overlay Controls */}
              <div className="absolute top-4 right-4 bg-[#071321]/80 backdrop-blur-md border border-[#365b63] px-3 py-1.5 rounded-xl text-xs text-[#c5e6e8] pointer-events-none">
                حرّك بإصبعك • كبّر بإصبعين • تدوير 360°
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
                <button
                  onClick={toggleRotation}
                  className="flex items-center gap-1.5 bg-[#09202b]/90 hover:bg-[#133748] text-[#e0fbff] border border-[#2d5f69] px-3 py-2 rounded-xl text-xs font-bold transition"
                >
                  {isRotating ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isRotating ? 'إيقاف الدوران' : 'تشغيل الدوران'}</span>
                </button>
                <button
                  onClick={resetCamera}
                  className="flex items-center gap-1.5 bg-[#09202b]/90 hover:bg-[#133748] text-[#e0fbff] border border-[#2d5f69] px-3 py-2 rounded-xl text-xs font-bold transition"
                >
                  <RotateCcw size={14} />
                  <span>إعادة المنظور</span>
                </button>
              </div>
            </div>

            {/* Quick Models Grid Carousel */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#8fb5c7]">اختر عضواً تشريحياً من الفهرس:</span>
                <span className="text-xs text-[#6bb6c4]">{filteredModels.length} مجسماً متاحاً</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                {filteredModels.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`text-right p-2.5 rounded-xl border text-xs font-bold transition flex flex-col justify-between ${
                      selectedIndex === idx
                        ? 'border-[#6fe8d5] bg-[#123647] text-[#6bf4c7] shadow-sm shadow-[#42c5b444]'
                        : 'border-[#1f3b52] bg-[#0c1f32] text-[#cbe5f1] hover:border-[#336181]'
                    }`}
                  >
                    <span className="truncate">{m.title}</span>
                    <span className="text-[10px] text-[#7ea0b3] font-normal truncate mt-1">{m.chapter.split('–')[1] || m.chapter}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Organ Details and Educational Context Panel */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#102b3c] to-[#0b1e30] border border-[#275064] rounded-3xl p-6 flex flex-col justify-between">
            <div>
              {/* Search input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ابحث: قلب، عين، كلية، كبد..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full bg-[#081d2c] border border-[#3d6777] rounded-xl px-9 py-2.5 text-xs text-[#effbff] placeholder-[#6b8f9e] focus:outline-none focus:border-[#6fe8d5]"
                />
                <Search size={15} className="absolute right-3 top-3 text-[#6b8f9e]" />
              </div>

              {/* Title and chapter info */}
              <div className="mb-4">
                <span className="text-xs font-bold text-[#f2c575] block mb-1">
                  {currentModel.chapter} • ص {currentModel.page}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#effbff] tracking-tight mb-2">
                  {currentModel.title}
                </h2>
                <span className="inline-block bg-[#1a3749] text-[#7bf0da] border border-[#2c5965] text-xs px-2.5 py-1 rounded-full mb-3 font-semibold">
                  {currentModel.quality}
                </span>
                <p className="text-xs sm:text-sm text-[#a2c4d4] leading-relaxed">
                  {currentModel.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mb-6">
                {onNavigateToPage && (
                  <button
                    onClick={() => onNavigateToPage(currentModel.page)}
                    className="w-full flex items-center justify-center gap-2 bg-[#76e9d5] hover:bg-[#59dac5] text-[#061824] font-bold py-2.5 px-4 rounded-xl text-xs transition"
                  >
                    <BookOpen size={16} />
                    <span>افتح صفحة الكتاب المنهجي (ص {currentModel.page})</span>
                  </button>
                )}
                <a
                  href={currentModel.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#164553] hover:bg-[#216071] text-[#effbff] py-2 px-4 rounded-xl text-xs border border-[#2d7379] transition font-semibold"
                >
                  <ExternalLink size={14} />
                  <span>صفحة ترخيص ومصدر النموذج التشريحي</span>
                </a>
              </div>
            </div>

            {/* License & Attribution Footnote */}
            <div className="pt-4 border-t border-[#1e4254] text-[11px] text-[#7e9dae] leading-relaxed">
              <div className="flex items-center gap-1.5 text-[#f2c575] font-bold mb-1">
                <Info size={13} />
                <span>الترخيص الأكاديمي المفتوح:</span>
              </div>
              <p>ترخيص: <b>{currentModel.license}</b></p>
              <p className="mt-1">
                تم الاستناد لبيانات OrganUI و BodyParts3D ومبادرة Human Reference Atlas لدعم المنهج الدراسي العراقي.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* TEACHING LAB MODE (Parts inspection and mnemonic cards) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scene Selector */}
          <div className="lg:col-span-4 bg-[#0c1c2e] border border-[#213e5a] rounded-3xl p-5">
            <h3 className="text-sm font-bold text-[#8fc3d4] mb-3">اختر العضو لدراسة أجزائه:</h3>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setTeachingSceneIndex(idx);
                    setSelectedPartIndex(0);
                    setUserPartGuess(null);
                  }}
                  className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    teachingSceneIndex === idx
                      ? 'border-[#6fe8d5] bg-[#143d4d] text-[#7bf0da]'
                      : 'border-[#19334c] bg-[#091728] text-[#c0dbe8] hover:border-[#2a5578]'
                  }`}
                >
                  <span>{scene.title}</span>
                  <span className="text-[10px] text-[#7397ad] font-normal">
                    {scene.parts.length} أجزاء • ص {scene.page}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Parts breakdown and mnemonic flashcards */}
          <div className="lg:col-span-8 bg-[#0c1f33] border border-[#224262] rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1c3852] mb-5">
                <div>
                  <span className="text-xs text-[#f2c575] font-bold block mb-1">
                    الفصل {currentScene.ch} • صفحة الكتاب {currentScene.page}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#effbff]">
                    {currentScene.title}
                  </h3>
                  <p className="text-xs text-[#8ab2c7] mt-0.5">{currentScene.caption}</p>
                </div>

                <button
                  onClick={() => {
                    setQuizMode(!quizMode);
                    setUserPartGuess(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                    quizMode
                      ? 'bg-[#18453f] border-[#55d9be] text-[#6bf4c7]'
                      : 'bg-[#12283e] border-[#294a6b] text-[#9fc7dc]'
                  }`}
                >
                  <HelpCircle size={15} />
                  <span>{quizMode ? 'إنهاء وضع الاختبار' : 'اختبر حفظك للأجزاء'}</span>
                </button>
              </div>

              {/* Parts Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentScene.parts.map((part, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setSelectedPartIndex(pIdx);
                      setUserPartGuess(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                      selectedPartIndex === pIdx
                        ? 'bg-[#1a4454] border-[#6fe8d5] text-[#6bf4c7] shadow-sm'
                        : 'bg-[#091728] border-[#1d3954] text-[#b3d4e4] hover:border-[#2e5e88]'
                    }`}
                  >
                    {part[0]}
                  </button>
                ))}
              </div>

              {/* Selected Part Detail Card */}
              {selectedPartIndex !== null && currentScene.parts[selectedPartIndex] && (
                <div className="bg-gradient-to-br from-[#122c42] to-[#0c1d2e] border border-[#275373] rounded-2xl p-6 relative overflow-hidden">
                  <div className="text-xs text-[#84eedf] font-bold mb-1">
                    الجزء رقم {selectedPartIndex + 1} من {currentScene.parts.length}
                  </div>
                  <h4 className="text-xl font-bold text-[#effbff] mb-3">
                    {currentScene.parts[selectedPartIndex][0]}
                  </h4>

                  <p className="text-sm text-[#b8ddec] leading-relaxed mb-4">
                    {currentScene.parts[selectedPartIndex][1]}
                  </p>

                  {/* Mnemonic / Memory Formula */}
                  {currentScene.parts[selectedPartIndex][2] && (
                    <div className="bg-[#091a2a] border border-[#1e4663] rounded-xl p-3.5 flex items-center justify-between text-xs">
                      <span className="text-[#f2c575] font-bold">معادلة الحفظ السريع:</span>
                      <span className="font-mono text-[#7bf0da] font-black">
                        {currentScene.parts[selectedPartIndex][2]}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quiz Mode interactive section */}
            {quizMode && (
              <div className="mt-6 pt-5 border-t border-[#1d3954]">
                <div className="text-xs text-[#f2c575] font-bold mb-2">
                  سؤال تفاعلي: ما هو دور "{currentScene.parts[selectedPartIndex || 0][0]}"؟
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentScene.parts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserPartGuess(idx)}
                      className={`text-right p-3 rounded-xl border text-xs transition ${
                        userPartGuess === idx
                          ? idx === (selectedPartIndex || 0)
                            ? 'bg-[#15463f] border-[#6fe8d5] text-[#6bf4c7] font-bold'
                            : 'bg-[#471e28] border-[#ff8195] text-[#ffb0be]'
                          : 'bg-[#091728] border-[#203a54] text-[#b4d2e2]'
                      }`}
                    >
                      {p[1]}
                    </button>
                  ))}
                </div>
                {userPartGuess !== null && (
                  <div className="mt-3 text-xs font-bold text-center">
                    {userPartGuess === (selectedPartIndex || 0) ? (
                      <span className="text-[#6bf4c7]">✓ أحسنت! إجابة دقيقة مطابقة للمنهج.</span>
                    ) : (
                      <span className="text-[#ff99aa]">حاول مرة أخرى، راجع وظيفة هذا الجزء أعلاه.</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
