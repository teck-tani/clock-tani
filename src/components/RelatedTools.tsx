import { Link } from '@/navigation';
import { getRelatedTools } from '@/config/tools';
import { getTranslations } from 'next-intl/server';

interface RelatedToolsProps {
    currentHref: string;
}

export default async function RelatedTools({ currentHref }: RelatedToolsProps) {
    const t = await getTranslations('RelatedTools');
    const tTools = await getTranslations('Index.tools');
    const tools = getRelatedTools(currentHref);

    if (tools.length === 0) return null;

    return (
        <nav className="related-tools" aria-label={t('title')}>
            <h2 className="related-tools-title">{t('title')}</h2>
            <div className="related-tools-grid">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="related-tools-card"
                            prefetch={false}
                        >
                            <span className="related-tools-icon"><Icon /></span>
                            <span className="related-tools-label">{tTools(tool.labelKey)}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
