import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ALL_TOOLS } from '@/config/tools';
import { ALL_GUIDES } from '@/config/guides';

export default function Footer() {
    const t = useTranslations('Footer');
    const tTools = useTranslations('Index.tools');
    const tGuides = useTranslations('Guides.titles');
    return (
        <footer>
            <div className="container">
                <div className="footer-tools">
                    {ALL_TOOLS.map((tool) => (
                        <Link key={tool.href} href={tool.href} prefetch={false}>
                            {tTools(tool.labelKey)}
                        </Link>
                    ))}
                </div>
                <div className="footer-tools" style={{ marginTop: 4 }}>
                    {ALL_GUIDES.map((guide) => (
                        <Link key={guide.slug} href={`/guides/${guide.slug}`} prefetch={false}>
                            {tGuides(guide.titleKey)}
                        </Link>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8, fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <Link href="/privacy" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('privacy')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/terms" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('terms')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/cookie-policy" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('cookiePolicy')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/about" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('about')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/contact" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('contact')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/faq" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('faq')}</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link href="/guides" style={{ color: '#999', textDecoration: 'none' }} prefetch={false}>{t('guides')}</Link>
                </div>
                <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            </div>
        </footer>
    );
}
