import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = '/api/v1';
const DEFAULT_COURSE_ID = '00000000-0000-0000-0000-000000000001';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  upvotes: number;
  source: string;
}

export function FaqListPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/faq/${DEFAULT_COURSE_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => setFaqs(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', color: '#1e293b' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}>
            <ArrowLeft size={20} color="#475569" />
          </button>
          <Sparkles size={20} color="#9333ea" />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>FAQ 모음</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>코칭에서 축적된 질문과 답변</p>
          </div>
          <span style={{ marginLeft: 'auto', backgroundColor: '#faf5ff', color: '#9333ea', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
            {faqs.length}개
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '24px' }}>
        {loading && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '80px 0' }}>로딩 중...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ef4444', padding: '80px 0' }}>오류: {error}</p>}

        {!loading && !error && faqs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#64748b', fontWeight: 500 }}>아직 FAQ가 없습니다</p>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>코칭에서 "도움됨"이나 "해결완료"를 누르면 FAQ로 저장됩니다</p>
          </div>
        )}

        {!loading && faqs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0, flex: 1 }}>Q. {faq.question}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {faq.upvotes > 0 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
                          <ThumbsUp size={12} style={{ marginRight: '4px' }} />
                          {faq.upvotes}
                        </span>
                      )}
                      <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
                        {faq.source === 'student' ? '학생' : '강사'}
                      </span>
                      {isOpen ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                    </div>
                  </div>

                  {isOpen ? (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>A.</p>
                      <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{faq.answer}</p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      A. {faq.answer.split('\n')[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
