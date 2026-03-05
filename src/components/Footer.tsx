import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Footer() {
    const t = useTranslations('Footer');
    return (
        <footer>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8, fontSize: '0.85rem' }}>
                    <Link href="/privacy" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('privacy')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/terms" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('terms')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/about" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('about')}</Link>
                </div>
                <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            </div>
        </footer>
    );
}
