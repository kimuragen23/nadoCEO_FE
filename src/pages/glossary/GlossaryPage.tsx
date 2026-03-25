import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';

const API_BASE = '/api/v1';

interface GlossaryTerm {
  term: string;
  lastSearchedAt: string;
}

export function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const { userId } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/learning-path/glossary?studentId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => setTerms(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = search
    ? terms.filter((t) => t.term.toLowerCase().includes(search.toLowerCase()))
    : terms;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', color: '#1e293b' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}>
            <ArrowLeft size={20} color="#475569" />
          </button>
          <BookOpen size={20} color="#d97706" />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>용어집</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>내가 검색한 용어 모음</p>
          </div>
          <span style={{ marginLeft: 'auto', backgroundColor: '#fffbeb', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
            {terms.length}개
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="용어 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              height: '44px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#1e293b',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '16px 24px' }}>
        {loading && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '80px 0' }}>로딩 중...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ef4444', padding: '80px 0' }}>오류: {error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#64748b', fontWeight: 500 }}>
              {search ? '검색 결과가 없습니다' : '아직 검색한 용어가 없습니다'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>오른쪽 용어 채팅에서 검색하면 자동으로 저장됩니다</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map((t, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#fffbeb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#d97706', fontWeight: 700, fontSize: '14px' }}>{t.term.charAt(0).toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{t.term}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{formatDate(t.lastSearchedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
