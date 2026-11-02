import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Brain,
  HelpCircle,
  BookOpen,
  Map,
  Headphones,
  FileText,
  Heart,
  Smile,
  Mic,
  MicOff,
  RotateCcw
} from 'lucide-react';
import { TabType } from '../components/Sidebar';
import { CHAPTERS, MINISTERIAL_QS } from '../data';

interface TablerAssistantViewProps {
  onNavigateTab: (tab: TabType, params?: any) => void;
}

interface Message {
  id: string;
  sender: 'teacher' | 'student';
  text: string;
  time: string;
  type?: 'text' | 'mindmap' | 'podcast' | 'infographic' | 'quiz' | 'audioLesson';
  payload?: any;
}

export const TablerAssistantView: React.FC<TablerAssistantViewProps> = ({ onNavigateTab }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'teacher',
      text: 'هلا بيك يا بطل! أنا ست نور، معلّمتك الخصوصية لمادة الأحياء للثالث المتوسط. ❤️\nلا تشيل هم الأحياء ولا كثافة المنهج بعد اليوم! وياي رح نفهم كل مجسم، نحفظ كل تعليل وزاري، ونثبت المعلومة بدون نسيان.\nشنو تحب نشرح اليوم؟ تكدر تسألني عن أي موضوع بالكتاب أو تطلب خريطة ذهنية أو بودكاست ملخص أو تسميع صوتي!',
      time: 'الآن',
      type: 'text'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isPlayingTeacherAudio, setIsPlayingTeacherAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const teacherAudioPath = '/assets/aistudio/generated_speech_3fb8f480_4e77_4f77_bac5_2e2acb43e0ee_1__72fb6ed5.wav';

  const toggleTeacherAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingTeacherAudio) {
      audioRef.current.pause();
      setIsPlayingTeacherAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingTeacherAudio(true);
      }).catch(err => {
        console.error('Playback error', err);
      });
    }
  };

  const handleSend = (textToSend?: string) => {
    const txt = (textToSend || inputVal).trim();
    if (!txt) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'student',
      text: txt,
      time: 'الآن'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Generate intelligent Iraqi teacher response
    setTimeout(() => {
      const reply = generateTeacherResponse(txt);
      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  const generateTeacherResponse = (query: string): Message => {
    const q = query.toLowerCase();

    // 1. Audio / Tetanus request
    if (q.includes('صوت') || q.includes('الكزاز') || q.includes('احجي') || q.includes('اسمع') || q.includes('تسجيل')) {
      return {
        id: 'tc_' + Date.now(),
        sender: 'teacher',
        text: 'تدلل يا بطل! هذا تسجيل بصوتي المباشر أشرحلك بيه عن مرض الكزاز وخطورته على الجهاز العصبي، اسمع شلون البكتيريا تفرز سموم تسبب تشنج العضلات:\n\nاضغط على زر التشغيل بالأسفل لتسمع الشرح الصوتي بلهجتنا العراقية الحنونة!',
        time: 'الآن',
        type: 'audioLesson'
      };
    }

    // 2. Mind map request
    if (q.includes('خريطة') || q.includes('مخطط') || q.includes('ذهنية')) {
      return {
        id: 'tc_' + Date.now(),
        sender: 'teacher',
        text: 'عفية عليك! الخريطة الذهنية هي أحسن طريقة تثبت الفصول المعقدة بالدماغ وتمنع النسيان. جهزتلك خريطة ذهنية مبسطة لأقسام الجهاز العصبي:',
        time: 'الآن',
        type: 'mindmap',
        payload: {
          title: 'خريطة الجهاز العصبي (CNS & PNS)',
          branches: [
            { name: '1. المركزي (CNS)', items: ['المخ (الحواس والذكاء والذاكرة)', 'المخيخ (توازن حركة العضلات)', 'النخاع المستطيل (القلب والتنفس)', 'الحبل الشوكي (الأفعال الانعكاسية)'] },
            { name: '2. المحيطي (PNS)', items: ['31 زوج أعصاب شوكية', '12 زوج أعصاب قحفية'] },
            { name: '3. الذاتي (ANS)', items: ['الودي (السمبثاوي: طوارئ وخوف)', 'جار الودي (الباراسمبثاوي: راحة وهدوء)'] }
          ]
        }
      };
    }

    // 3. Podcast summary
    if (q.includes('بودكاست') || q.includes('ملخص') || q.includes('دقيقتين')) {
      return {
        id: 'tc_' + Date.now(),
        sender: 'teacher',
        text: '🎙️ بودكاست كبسولة الأحياء في دقيقتين:\n\n"ركّز وياي يا بطل.. اليوم موضوعنا عن القلب والدورة الدموية. القلب مضخة عضلية مخروطية بيها 4 ردهات: أذينين وبطينين. الدم يخرج من البطين الأيسر عبر الشريان الأبهر لكل الجسم (دورة كبرى)، ويرجع للأذين الأيمن محمل بثنائي أوكسيد الكربون. ومن البطين الأيمن يروح للرئتين عبر الشريان الرئوي حتى يتنقى ويرجع مؤكسج للأذين الأيسر (دورة صغرى اكتشفها ابن النفيس). هذا السؤال جاي وزاري أكثر من 8 مرات!"',
        time: 'الآن',
        type: 'podcast'
      };
    }

    // 4. Motivation & Exam anxiety tips
    if (q.includes('خايف') || q.includes('قلق') || q.includes('انسى') || q.includes('نسيان') || q.includes('نصيحة') || q.includes('تحفيز')) {
      return {
        id: 'tc_' + Date.now(),
        sender: 'teacher',
        text: 'يا بعد عيني لا تقلق أبداً! النسيان شعور طبيعي جداً لأن معلومات الأحياء هواية، بس علاجها كلش بسيط وياي:\n\n1. لا تقرأ قراءة عيون فقط! لازم القلم بإيدك وترسم حتى لو رسم تقريبي.\n2. اربط التعليل بالسبب المنطقي بجسمك (مثلاً: ليش القلب بيه صمامات؟ حتى الدم ما يرجع ليورا!).\n3. نام زين ليلة الامتحان، لأن الدماغ ينقل المعلومات من الذاكرة المؤقتة للذاكرة الدائمة وقت النوم العميق.\n4. ثق بنفسك.. أنت كدها ورح تفرح أهلك بأحلى معدل!',
        time: 'الآن',
        type: 'text'
      };
    }

    // 5. Ministerial Questions
    if (q.includes('وزاري') || q.includes('سؤال') || q.includes('امتحان') || q.includes('تعليل')) {
      return {
        id: 'tc_' + Date.now(),
        sender: 'teacher',
        text: 'عاشت إيدك على هذا السؤال الذكي! جهزتلك أهم الأسئلة الوزارية المكررة الخاصة بهذا الموضوع مع أجوبتها النموذجية المعتمدة بمركز الفحص الوزاري:',
        time: 'الآن',
        type: 'quiz',
        payload: {
          items: [
            { q: 'علل: وجود الأقراص البينية في عضلة القلب؟ (وزاري مكرر 2012/1، 2014/2)', a: 'لأنها تمثل الغشاء الخلوي الفاصل بين خلايا عضلة القلب، مما يسمح بنقل الإيعاز العصبي والانقباض المنتظم كوحدة وظيفية واحدة.' },
            { q: 'ما موقع ووظيفة قناة هافرس؟ (وزاري مكرر 2005/1، 2014/1)', a: 'الموقع: تتوسط الدوائر المتحدة المركز للخلايا العظمية في نسيج العظم. الوظيفة: تمر من خلالها الأوعية الدموية والأعصاب المغذية للعظم.' }
          ]
        }
      };
    }

    // Default friendly teacher response
    return {
      id: 'tc_' + Date.now(),
      sender: 'teacher',
      text: `عفية عليك يا شاطر! بخصوص سؤالك عن "${query}":\nهذا الموضوع كلش مهم بالكتاب، ومفتاحه إنك تفهم أولاً تركيب العضو من خلال المختبر التشريحي، وبعدين تربطه بوظيفته.\nتحب نفتح المجسم ثلاثي الأبعاد مالته لو أعطيك ملخص سؤال وجواب وزاري عليه؟`,
      time: 'الآن',
      type: 'text'
    };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      {/* Audio element holding the authentic Iraqi teacher voice file */}
      <audio
        ref={audioRef}
        src={teacherAudioPath}
        onEnded={() => setIsPlayingTeacherAudio(false)}
        onError={() => setIsPlayingTeacherAudio(false)}
      />

      {/* Teacher Profile Card */}
      <div className="bg-white border border-[#e6e8eb] p-5 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0054a6] to-[#4dabf7] text-white flex items-center justify-center font-black text-2xl shadow-md">
              👩‍🏫
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#2fb344] border-2 border-white rounded-full" title="متصلة الآن لمساعدتك" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#182433]">الست نور · معلّمة الأحياء العراقية</h2>
              <span className="badge bg-[#e6fffa] text-[#0ca678] text-[10px] px-2 py-0.5 rounded-full font-bold">
                صوت عراقي حقيقي
              </span>
            </div>
            <p className="text-xs text-[#626976]">
              شرح مبسط، خرائط ذهنية، بودكاست، وأسئلة وزارية مؤكدة بلهجة دافئة ومشجعة
            </p>
          </div>
        </div>

        {/* Audio Teacher Play Button */}
        <button
          onClick={toggleTeacherAudio}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-sm ${
            isPlayingTeacherAudio
              ? 'bg-[#d63939] text-white animate-pulse'
              : 'bg-[#e6f4fe] text-[#0054a6] hover:bg-[#d0ebfd]'
          }`}
        >
          {isPlayingTeacherAudio ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlayingTeacherAudio ? 'إيقاف صوت المعلمة' : '🎙️ استمع لشرح المعلمة بالصوت العراقي'}</span>
        </button>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => handleSend('🎙️ اسمعيني تسجيل صوتي بالصوت العراقي الحقيقي عن مرض الكزاز')}
          className="bg-white border border-[#dce1e7] hover:border-[#0054a6] hover:text-[#0054a6] text-[#495057] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-bold"
        >
          🎙️ تسجيل صوتي (مرض الكزاز)
        </button>
        <button
          onClick={() => handleSend('سويلي خريطة ذهنية سريعة للجهاز العصبي')}
          className="bg-white border border-[#dce1e7] hover:border-[#0054a6] hover:text-[#0054a6] text-[#495057] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-bold"
        >
          🗺️ خريطة ذهنية للجهاز العصبي
        </button>
        <button
          onClick={() => handleSend('انطيني بودكاست ملخص لدوران الدم في دقيقتين')}
          className="bg-white border border-[#dce1e7] hover:border-[#0054a6] hover:text-[#0054a6] text-[#495057] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-bold"
        >
          🎧 بودكاست كبسولة في دقيقتين
        </button>
        <button
          onClick={() => handleSend('أنا قلقان وبسرعة أنسى، انطيني نصيحة لتثبيت الحفظ')}
          className="bg-white border border-[#dce1e7] hover:border-[#0054a6] hover:text-[#0054a6] text-[#495057] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-bold"
        >
          💖 حل مشكلة النسيان والتوتر
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white border border-[#e6e8eb] rounded-3xl p-5 shadow-sm space-y-4 min-h-[380px] max-h-[520px] overflow-y-auto">
        {messages.map((m) => {
          const isTeacher = m.sender === 'teacher';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isTeacher ? 'justify-start' : 'justify-end'}`}
            >
              {isTeacher && (
                <div className="w-8 h-8 rounded-full bg-[#e6f4fe] text-[#0054a6] flex items-center justify-center font-bold text-sm shrink-0">
                  👩‍🏫
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                isTeacher
                  ? 'bg-[#f8fafc] border border-[#e6e8eb] text-[#182433]'
                  : 'bg-[#0054a6] text-white shadow-sm'
              }`}>
                <p className="whitespace-pre-line font-medium">{m.text}</p>

                {/* Audio lesson card */}
                {m.type === 'audioLesson' && (
                  <div className="mt-3 p-3 bg-[#e6f4fe] border border-[#b8e2fb] rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Volume2 size={18} className="text-[#0054a6]" />
                      <span className="font-bold text-[#0054a6]">تسجيل صوتي: مرض الكزاز ومخاطره</span>
                    </div>
                    <button
                      onClick={toggleTeacherAudio}
                      className="bg-[#0054a6] text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1"
                    >
                      {isPlayingTeacherAudio ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isPlayingTeacherAudio ? 'إيقاف' : 'تشغيل'}</span>
                    </button>
                  </div>
                )}

                {/* Mind map payload */}
                {m.type === 'mindmap' && m.payload && (
                  <div className="mt-3 p-4 bg-white border border-[#dce1e7] rounded-2xl space-y-3">
                    <strong className="text-[#0054a6] font-bold block pb-1 border-b border-[#f1f3f5]">
                      {m.payload.title}
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {m.payload.branches.map((b: any, idx: number) => (
                        <div key={idx} className="bg-[#f8fafc] p-2.5 rounded-xl border border-[#e6e8eb]">
                          <strong className="text-[#182433] block mb-1 text-[11px]">{b.name}</strong>
                          <ul className="list-disc list-inside space-y-0.5 text-[10px] text-[#626976]">
                            {b.items.map((item: string, iIdx: number) => (
                              <li key={iIdx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quiz items payload */}
                {m.type === 'quiz' && m.payload && (
                  <div className="mt-3 space-y-2">
                    {m.payload.items.map((it: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-[#dce1e7] space-y-1">
                        <strong className="text-[#d9480f] block text-[11px]">{it.q}</strong>
                        <p className="text-[#2b354f] text-[11px] leading-relaxed">
                          <strong>الجواب النموذجي: </strong>{it.a}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <span className={`block text-[10px] mt-2 ${isTeacher ? 'text-[#868e96]' : 'text-white/70'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white border border-[#e6e8eb] p-2.5 rounded-3xl shadow-sm flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="اسأل الست نور أي سؤال بالأحياء (مثلاً: ما وظيفة المحور؟، اشرحيلي الشهيق والزفير...)"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-[#182433] focus:outline-none placeholder-[#868e96]"
        />

        <button
          type="button"
          onClick={() => handleSend('🎙️ اسمعيني الشرح الصوتي للكزاز')}
          className="p-2.5 text-[#0054a6] hover:bg-[#e6f4fe] rounded-2xl transition"
          title="تسجيل صوتي"
        >
          <Mic size={18} />
        </button>

        <button
          type="submit"
          className="bg-[#0054a6] hover:bg-[#004284] text-white p-2.5 rounded-2xl transition shadow-sm"
          title="إرسال"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
