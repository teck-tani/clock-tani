import { Link } from '@/navigation';
import { ALL_GUIDES } from '@/config/guides';
import { getTranslations } from 'next-intl/server';

interface RelatedGuidesProps {
    currentToolHref: string;
}

/** 현재 도구와 관련된 가이드 2~3개를 표시하는 서버 컴포넌트 */
export default async function RelatedGuides({ currentToolHref }: RelatedGuidesProps) {
    const t = await getTranslations('RelatedGuides');
    const tGuides = await getTranslations('Guides');

    // 현재 도구와 관련된 가이드 필터링 (최대 3개)
    const related = ALL_GUIDES.filter(g => g.relatedTool === currentToolHref).slice(0, 3);

    if (related.length === 0) return null;

    return (
        <nav className="related-guides" aria-label={t('title')} style={{
            maxWidth: 900,
            margin: '32px auto 0',
            padding: '0 16px',
        }}>
            <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: 12,
                color: 'var(--text-primary, #333)',
            }}>{t('title')}</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 12,
            }}>
                {related.map((guide) => (
                    <Link
                        key={guide.slug}
                        href={`/guides/${guide.slug}`}
                        prefetch={false}
                        style={{
                            display: 'block',
                            padding: '14px 16px',
                            borderRadius: 8,
                            border: '1px solid var(--card-border, #e5e7eb)',
                            background: 'var(--card-bg, #f9fafb)',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary, #222)' }}>
                            {tGuides(`titles.${guide.titleKey}`)}
                        </strong>
                        <p style={{
                            margin: '6px 0 0',
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary, #666)',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {tGuides(`descriptions.${guide.descKey}`)}
                        </p>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
