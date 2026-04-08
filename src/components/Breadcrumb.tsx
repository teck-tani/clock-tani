import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

/** 사용자에게 보이는 브레드크럼 네비게이션 (서버 컴포넌트) */
export default async function Breadcrumb({ items }: BreadcrumbProps) {
    const t = await getTranslations('Breadcrumb');

    return (
        <nav
            aria-label={t('label')}
            style={{
                maxWidth: 900,
                margin: '0 auto',
                padding: '12px 16px 4px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary, #888)',
            }}
        >
            <ol
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    gap: '4px',
                    alignItems: 'center',
                }}
            >
                <li>
                    <Link
                        href="/"
                        style={{ color: 'var(--text-secondary, #888)', textDecoration: 'none' }}
                        prefetch={false}
                    >
                        {t('home')}
                    </Link>
                </li>
                {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span aria-hidden="true" style={{ color: 'var(--text-secondary, #666)' }}>/</span>
                        {item.href ? (
                            <Link
                                href={item.href}
                                style={{ color: 'var(--text-secondary, #888)', textDecoration: 'none' }}
                                prefetch={false}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span style={{ color: 'var(--text-primary, #333)' }}>{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
