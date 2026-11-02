import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Settings,
  Info
} from 'lucide-react';
import { VERIFIED_RECORDS } from '../data';
import { useApp } from '../context/AppContext';

export const VoiceCoachView: React.FC = () => {
  const { addPoints } = useApp();
  const [selectedRecordIdx, setSelectedRecordIdx] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [evalResult, setEvalResult] = useState<{ match: number; feedback: string } | null>(null);

  const currentRecord = VERIFIED_RECORDS[selectedRecordIdx] || VERIFIED_RECORDS[0];

  const startVoiceRecognition = () => {
    // Check SpeechRecognition
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      // Mock / fallback recitation prompt if browser lacks speech recognition
      const input = prompt('متصفحك لا يدعم التعرف المباشر على الصوت. اكتب تسميعك هنا للتقييم:');
      if (input) {
        evaluateRecitation(input);
      }
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'ar-IQ'; // Iraqi Arabic or Standard Arabic
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('جاري الاستماع لصوتك...');
        setEvalResult(null);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        evaluateRecitation(text);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('تعذر التقاط الصوت أو انتهت المهلة. يمكنك إعادة المحاولة.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const evaluateRecitation = (text: string) => {
    setTranscript(text);
    // Simple fuzzy word match
    const modelWords = currentRecord.answer.split(/\s+/).filter(w => w.length > 2);
    const spokenWords = text.split(/\s+/);
    let matched = 0;
    modelWords.forEach(w => {
      if (spokenWords.some(sw => sw.includes(w) || w.includes(sw))) {
        matched++;
      }
    });

    const matchRatio = Math.round((matched / Math.max(1, modelWords.length)) * 100);
    let feedback = '';
    if (matchRatio >= 65) {
      feedback = 'تسميع ممتاز ومتقن! ذكرت المصطلحات العلمية الأساسية المطلوبة وزارياً (+15 نقطة).';
      addPoints(15);
    } else if (matchRatio >= 40) {
      feedback = 'تسميع جيد، لكن تنقصك بعض الكلمات الدقيقة في التعريف. استمع لنموذج النطق وحاول مرة ثانية.';
      addPoints(5);
    } else {
      feedback = 'تحتاج إلى تثبيت التعريف أكثر. راجع النص النموذجي أعلاه ثم أعد التسميع.';
    }

    setEvalResult({ match: matchRatio, feedback });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1e32] border border-[#213f5c] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3f301d] text-[#f2c575] flex items-center justify-center font-bold">
            <Mic size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#effbff]">تدريب التسميع الصوتي</h2>
            <p className="text-xs text-[#82a4b8]">استمع إلى الشروح المعتمدة، وتدرّب على تسميع التعاريف</p>
          </div>
        </div>

        <div className="w-full sm:max-w-sm rounded-xl bg-[#133f43] border border-[#27736b] px-4 py-3 text-right">
          <div className="font-bold text-[#c6fff2] text-xs mb-2">شرح المعلّمة المعتمد — الخلية العصبية</div>
          <audio controls preload="none" className="w-full h-10" src={import.meta.env.BASE_URL + 'nabd-voice/neuron-baghdad-sulafat.wav'} aria-label="استمع إلى شرح الخلية العصبية" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Definitions List */}
        <div className="lg:col-span-4 bg-[#0d1e32] border border-[#213f5c] rounded-3xl p-5">
          <h3 className="text-xs font-bold text-[#8fb4c6] mb-3">اختر تعريفاً وزارياً للتسميع:</h3>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {VERIFIED_RECORDS.map((rec, idx) => (
              <button
                key={rec.id}
                onClick={() => {
                  setSelectedRecordIdx(idx);
                  setTranscript('');
                  setEvalResult(null);
                }}
                className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  selectedRecordIdx === idx
                    ? 'border-[#6fe8d5] bg-[#143e4d] text-[#7bf0da]'
                    : 'border-[#1b354d] bg-[#091728] text-[#c2dfec] hover:border-[#2a5578]'
                }`}
              >
                <span>{rec.prompt}</span>
                <span className="text-[10px] text-[#7196ac] font-normal">
                  ص {rec.page}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Recitation Studio */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0b1f33] border border-[#214362] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1b3752]">
              <div>
                <span className="text-xs text-[#f2c575] font-bold block mb-1">
                  الفصل {currentRecord.chapter} • صفحة الكتاب {currentRecord.page}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#effbff]">
                  {currentRecord.prompt}
                </h3>
              </div>

              <span className="text-xs text-[#91b8c3]">لكل تعريف تسجيله الخاص بعد الاعتماد؛ ماكو صوت آلي بديل.</span>
            </div>

            {/* Model Textbook Answer */}
            <div className="bg-[#081827] border border-[#1c3c58] rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-[#6bf4c7]">التعريف المنهجي المعتمد وزارياً:</span>
              <p className="text-sm sm:text-base text-[#effbff] leading-loose">
                {currentRecord.answer}
              </p>
            </div>

            {/* Voice Recitation Action Box */}
            <div className="bg-[#0e243a] border border-[#234b6e] rounded-2xl p-6 text-center space-y-4">
              <div className="text-xs text-[#8cb4c7] font-bold">
                اضغط على الميكروفون وتحدث بصوت واضح لتسميع التعريف غيباً:
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-xl ${
                    isListening
                      ? 'bg-[#ff4d6a] text-white animate-pulse shadow-[#ff4d6a44]'
                      : 'bg-gradient-to-tr from-[#32e0cd] to-[#4590db] text-[#062436] hover:scale-105 shadow-[#31bdb344]'
                  }`}
                  title="بدء التسميع الصوتي"
                >
                  {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                </button>
              </div>

              <div className="text-xs font-bold text-[#7bf0da]">
                {isListening ? '🎤 جاري الاستماع لتسميعك... تحدث الآن' : 'اضغط للبدء بالتسميع الشفهي'}
              </div>

              {/* Transcribed text */}
              {transcript && (
                <div className="text-right p-4 rounded-xl bg-[#081827] border border-[#1b3750] text-xs text-[#b8ddec]">
                  <span className="text-[#84a3b5] block mb-1">ما تم التقاطه صوتياً:</span>
                  <p className="font-semibold text-sm text-[#eef9fc]">{transcript}</p>
                </div>
              )}

              {/* Evaluation score & feedback */}
              {evalResult && (
                <div className="p-4 rounded-xl bg-[#092233] border border-[#215166] text-right space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6bf4c7]">نسبة التطابق المنهجي:</span>
                    <span className="text-base font-extrabold text-[#f2c575] font-mono">
                      {evalResult.match}%
                    </span>
                  </div>
                  <p className="text-xs text-[#bde7f2] leading-relaxed">
                    {evalResult.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#112338] border border-[#204060] text-xs text-[#9fc2d4] leading-relaxed">
              شروحات نَبْض تُنشر بعد مراجعة المعلومة والنطق. ضبط الصوت وتوليده واعتماده مهام الإدارة فقط؛ هنا تستمع وتتدرّب على التسميع.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
