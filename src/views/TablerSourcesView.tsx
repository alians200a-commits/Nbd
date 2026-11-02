import React from 'react';
import { TablerIcon } from '../components/TablerIcon';
import { TABLER_SOURCES } from '../data/tablerData';

export const TablerSourcesView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="card bg-white border border-[#e6e8eb] rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <span className="badge bg-[#e6f4fe] text-[#0054a6] px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
            توثيق المصادر والرخص V8.0
          </span>
          <h2 className="text-2xl font-extrabold text-[#182433]">
            المشاريع مفتوحة المصدر المستخدمة فعلياً
          </h2>
          <p className="text-xs text-[#626976] leading-relaxed mt-1">
            لا تُستخدم رسومات أو أيقونات مولّدة بالذكاء الاصطناعي في واجهة نَبْض. تم تجميع المكونات من مكتبات ومشاريع GitHub مفتوحة المصدر حقيقية.
          </p>
        </div>

        <div className="list-group list-group-flush divide-y divide-[#f1f3f5] border border-[#e6e8eb] rounded-2xl overflow-hidden">
          {TABLER_SOURCES.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="list-group-item list-group-item-action p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#f8fafc] text-decoration-none transition"
            >
              <div>
                <strong className="text-sm text-[#0054a6]">{src.name}</strong>
                <span className="text-[#626976] text-xs block sm:inline sm:mr-2">· {src.desc}</span>
              </div>
              <span className="badge bg-[#f1f3f5] text-[#495057] px-2.5 py-1 rounded-md text-xs font-mono self-start sm:self-auto">
                {src.license}
              </span>
            </a>
          ))}
        </div>

        <div className="alert alert-warning bg-[#fff9db] border border-[#ffe066] text-[#7c5e10] p-4 rounded-2xl text-xs leading-relaxed">
          <b>تنبيه بخصوص المجسمات التشريحية:</b> المجسمات تُستدعى من مستودعات GitHub المفتوحة عند الاستعراض وليست مخزنة في المستودع العام. تحقق من الترخيص الأصلي لكل نموذج قبل إطلاق أي خدمة تجارياً أو إعادة توزيع الملفات.
        </div>
      </div>
    </div>
  );
};
