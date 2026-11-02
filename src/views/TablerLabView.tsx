import React, { useState, useRef, useEffect } from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { TABLER_MODELS, TABLER_CHAPTERS, TablerModel } from '../data/tablerData';
import { useApp } from '../context/AppContext';

interface TablerLabViewProps {
  initialChapter?: number;
}

export const TablerLabView: React.FC<TablerLabViewProps> = ({ initialChapter }) => {
  const { state, completeTopic } = useApp();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [modelStatus, setModelStatus] = useState<string>('جاري تحميل المجسم من مشروع GitHub…');
  const [isDoneMarked, setIsDoneMarked] = useState<boolean>(false);

  const modelViewerRef = useRef<any>(null);

  // If initialChapter passed, find matching model
  useEffect(() => {
    if (initialChapter) {
      const idx = TABLER_MODELS.findIndex(m => m.chapter === initialChapter);
      if (idx !== -1) setSelectedIdx(idx);
    }
  }, [initialChapter]);

  const currentModel: TablerModel = TABLER_MODELS[selectedIdx] || TABLER_MODELS[0];
  const modelUrl = `https://cdn.jsdelivr.net/gh/organui/${currentModel.slug}-3d@main/public/models/${currentModel.slug}.glb`;
  const githubSourceUrl = `https://github.com/organui/${currentModel.slug}-3d`;
  const currentChapter = TABLER_CHAPTERS.find(c => c.id === currentModel.chapter);

  const handleMarkDone = () => {
    completeTopic(String(currentModel.chapter));
    setIsDoneMarked(true);
    setTimeout(() => setIsDoneMarked(false), 2500);
  };

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const onLoad = () => setModelStatus('المجسم جاهز. اسحب للتدوير وكبّر بإصبعين.');
    const onError = () => setModelStatus('تعذّر تنزيل هذا النموذج من المصدر. افتح رابط GitHub للتحقق منه.');

    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);

    return () => {
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
    };
  }, [currentModel]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 3D Model Display Card */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="card bg-white border border-[#e6e8eb] rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="card-header bg-[#f8fafc] border-b border-[#e6e8eb] px-6 py-4 flex items-center justify-between">
              <h3 className="card-title text-lg font-bold text-[#182433] m-0">
                {currentModel.name}
              </h3>
              <span className="badge bg-[#e6f4fe] text-[#0054a6] px-2.5 py-1 rounded-full text-xs font-bold">
                الفصل {currentModel.chapter} · {currentChapter?.name}
              </span>
            </div>

            <div className="card-body p-0 bg-[#f5f7fa]">
              <div className="model-holder h-[420px] sm:h-[460px] w-full relative">
                {/* @ts-ignore */}
                <model-viewer
                  ref={modelViewerRef}
                  src={modelUrl}
                  alt={currentModel.name}
                  camera-controls
                  auto-rotate
                  shadow-intensity="1"
                  environment-image="neutral"
                  interaction-prompt="none"
                  style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
                >
                  <div slot="poster" className="w-full h-full flex items-center justify-center text-xs text-[#868e96]">
                    جاري تحميل المجسم التشريحي...
                  </div>
                {/* @ts-ignore */}
                </model-viewer>
              </div>
            </div>

            <div className="card-footer bg-white border-t border-[#e6e8eb] p-3">
              <div className="alert alert-info bg-[#e6f4fe] border border-[#b8e2fb] text-[#0054a6] text-xs p-3 rounded-xl m-0 flex items-center justify-between">
                <span>{modelStatus}</span>
                <span className="text-[11px] text-[#4f7b9c]">حرّك بإصبعك • تدوير 360°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model Info & Organ List Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card bg-white border border-[#e6e8eb] rounded-3xl p-5 shadow-sm space-y-3">
            <div className="text-xs text-[#626976]">
              الفصل {currentModel.chapter} · {currentChapter?.name} (ص {currentChapter?.page})
            </div>
            <h3 className="text-lg font-bold text-[#182433] m-0">
              استكشف ثم اختبر نفسك
            </h3>
            <p className="text-xs text-[#626976] leading-relaxed">
              حرّك المجسم بإصبعك، كبّر، ولاحظ أجزاءه. البيانات من مستودعات مفتوحة المصدر، وليست أشكالاً مولّدة اصطناعياً.
            </p>

            <div className="d-grid gap-2 pt-2">
              <button
                onClick={handleMarkDone}
                className="w-full btn btn-primary bg-[#0054a6] hover:bg-[#004284] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <TablerIcon name="clipboard-check" size={16} />
                <span>{isDoneMarked ? '✓ تم حفظ تقدمك!' : 'علّم الفصل كمراجع'}</span>
              </button>
              <a
                href={githubSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn btn-outline-secondary border border-[#dce1e7] hover:bg-[#f8fafc] text-[#182433] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <TablerIcon name="book" size={16} />
                <span>افتح مشروع المصدر على GitHub</span>
              </a>
            </div>

            <div className="text-[11px] text-[#868e96] pt-2 border-t border-[#f1f3f5]">
              المجسم من OrganUI على GitHub؛ العرض يحتاج إنترنت. تحقّق من حقوق الملف قبل استخدامه تجارياً.
            </div>
            <div className="text-xs">
              الترخيص المذكور: <span className="badge bg-[#e6f4fe] text-[#0054a6] px-2 py-0.5 rounded-full font-mono">{currentModel.license}</span>
            </div>
          </div>

          {/* Organ list */}
          <div className="card bg-white border border-[#e6e8eb] rounded-3xl overflow-hidden shadow-sm">
            <div className="card-header bg-[#f8fafc] border-b border-[#e6e8eb] px-4 py-3">
              <h3 className="card-title text-sm font-bold text-[#182433] m-0">
                مكتبة المجسمات (14 نموذجاً من GitHub)
              </h3>
            </div>
            <div className="list-group list-group-flush max-h-64 overflow-y-auto">
              {TABLER_MODELS.map((m, idx) => (
                <button
                  key={m.slug}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full text-right p-3 border-b border-[#f1f3f5] text-xs font-bold transition flex items-center justify-between ${
                    selectedIdx === idx
                      ? 'bg-[#e6f4fe] text-[#0054a6]'
                      : 'hover:bg-[#f8fafc] text-[#182433]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <TablerIcon name="brain" size={16} />
                    <span>{m.name}</span>
                  </span>
                  <small className="text-[#868e96] font-mono">ف {m.chapter}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
