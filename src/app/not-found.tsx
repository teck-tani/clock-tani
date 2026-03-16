import Link from 'next/link';

// 전역 404 페이지
export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 700, color: '#0891b2', marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 16, color: '#334155' }}>
        페이지를 찾을 수 없습니다
      </h2>
      <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: 32, maxWidth: 400 }}>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/ko"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          borderRadius: 8,
          background: '#0891b2',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
