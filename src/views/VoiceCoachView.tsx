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
  const { state, setSpeaker, addPoints } = useApp();
  const [selectedRecordIdx, setSelectedRecordIdx] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [evalResult, setEvalResult] = useState<{ match: number; feedback: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentRecord = VERIFIED_RECORDS[selectedRecordIdx] || VERIFIED_RECORDS[0];

  const handleSpeakSample = () => {
    if (!('speechSynthesis' in window)) {
      alert('المتصفح لا يدعم القراءة الصوتية.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(currentRecord.answer);
    utt.lang = 'ar-SA';
    utt.rate = state.speechRate || 1.0;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar') && v.name.toLowerCase().includes('female')) ||
                    voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) utt.voice = arVoice;

    utt.onend = () => setIsPlayingAudio(false);
    utt.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utt);
    setIsPlayingAudio(true);
  };

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
            <h2 className="text-lg font-bold text-[#effbff]">المعلّمة الصوتية الذكية وهندسة الصوت</h2>
            <p className="text-xs text-[#82a4b8]">استمع لشرح التعاريف أو سمّع بصوتك للتقييم الآلي المعتمد</p>
          </div>
        </div>

        {/* Speaker Profile Badge */}
        <div className="flex items-center gap-2 bg-[#091728] border border-[#1e3b54] p-1 rounded-xl text-xs">
          <span className="text-[#88a9bc] px-2">الهوية الصوتية:</span>
          <button
            onClick={() => setSpeaker('B')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              state.teacherVoiceSpeaker === 'B'
                ? 'bg-[#1b4e5f] text-[#7bf0da]'
                : 'text-[#6b8c9e]'
            }`}
          >
            المتحدث B (المعتمد)
          </button>
          <button
            onClick={() => setSpeaker('A')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              state.teacherVoiceSpeaker === 'A'
                ? 'bg-[#1b4e5f] text-[#7bf0da]'
                : 'text-[#6b8c9e]'
            }`}
          >
            المتحدث A
          </button>
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

              {/* Read aloud button */}
              <button
                onClick={handleSpeakSample}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                  isPlayingAudio
                    ? 'bg-[#3e2c18] border-[#f2c575] text-[#f2c575]'
                    : 'bg-[#153447] border-[#296877] text-[#7bf0da]'
                }`}
              >
                {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isPlayingAudio ? 'إيقاف النموذج' : 'استمع للنموذج الصوتي'}</span>
              </button>
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

            {/* Note on Speaker B profile */}
            <div className="p-4 rounded-2xl bg-[#112338] border border-[#204060] text-xs text-[#9fc2d4] leading-relaxed flex items-start gap-3">
              <Info size={18} className="text-[#f2c575] shrink-0 mt-0.5" />
              <div>
                <b className="text-[#effbff] block mb-0.5">حول هوية صوت المعلّمة B:</b>
                تم تثبيت المتحدث B من التسجيل الثنائي كمرجع معتمد لأسلوب الشرح وتوجيه الطالب. تتيح المنصة التدريب الشفهي والتسميع الصوتي دون الحاجة لخوادم خارجية معتمدة على تقنيات المتصفح الحديثة.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
