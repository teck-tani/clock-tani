import Link from 'next/link';
import { headers } from 'next/headers';

export default async function NotFound() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const isEn = acceptLanguage.toLowerCase().startsWith('en');

  const title = isEn ? 'Page Not Found' : '페이지를 찾을 수 없습니다';
  const desc = isEn
    ? 'The page you requested does not exist or has been moved.'
    : '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.';
  const btnText = isEn ? 'Go to Homepage' : '홈으로 돌아가기';
  const homeHref = isEn ? '/en' : '/ko';

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
        {title}
      </h2>
      <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: 32, maxWidth: 400 }}>
        {desc}
      </p>
      <Link
        href={homeHref}
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
        {btnText}
      </Link>
    </div>
  );
}
