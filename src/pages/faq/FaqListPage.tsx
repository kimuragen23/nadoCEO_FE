import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFaqs, FaqItem } from '../../api/client';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Sparkles, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_COURSE_ID = '00000000-0000-0000-0000-000000000001';

function FaqCard({ faq }: { faq: FaqItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-slate-800 leading-snug flex-1">Q. {faq.question}</p>
        <div className="flex items-center gap-2 shrink-0">
          {faq.upvotes > 0 && (
            <span className="inline-flex items-center bg-blue-50 text-blue-600 border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-medium">
              <ThumbsUp className="w-3 h-3 mr-1" />
              {faq.upvotes}
            </span>
          )}
          <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-medium">
            {faq.source === 'student' ? '학생' : '강사'}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expanded ? (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 mb-2">A.</p>
          <div className="text-sm text-slate-700 leading-relaxed prose prose-sm prose-slate max-w-none">
            <ReactMarkdown>{faq.answer}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 mt-2 truncate">A. {faq.answer.split('\n')[0]}</p>
      )}
    </div>
  );
}

export function FaqListPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getFaqs(DEFAULT_COURSE_ID)
      .then(setFaqs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">FAQ 모음</h1>
              <p className="text-xs text-slate-500">코칭에서 축적된 질문과 답변</p>
            </div>
          </div>
          <span className="ml-auto bg-purple-50 text-purple-600 border border-purple-100 text-xs px-3 py-1 rounded-full font-medium">
            {faqs.length}개
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-6">
        {loading && <p className="text-center text-slate-400 py-20">로딩 중...</p>}
        {error && <p className="text-center text-red-500 py-20">{error}</p>}
        {!loading && !error && faqs.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">아직 FAQ가 없습니다</p>
            <p className="text-sm text-slate-400 mt-1">코칭에서 "도움됨"이나 "해결완료"를 누르면 FAQ로 저장됩니다</p>
          </div>
        )}
        {!loading && faqs.length > 0 && (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqCard key={faq.id} faq={faq} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
