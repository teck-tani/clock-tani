export interface GuideDef {
    slug: string;
    titleKey: string;
    descKey: string;
    date: string;
    lastModified: string;
    relatedTool: string; // tool href like '/pomodoro'
}

export const ALL_GUIDES: GuideDef[] = [
    { slug: 'pomodoro-technique-guide', titleKey: 'pomodoro', descKey: 'pomodoroDesc', date: '2026-03-10', lastModified: '2026-03-16', relatedTool: '/pomodoro' },
    { slug: 'tabata-timer-guide', titleKey: 'tabata', descKey: 'tabataDesc', date: '2026-03-10', lastModified: '2026-03-16', relatedTool: '/interval' },
    { slug: 'time-zone-calculation', titleKey: 'timezone', descKey: 'timezoneDesc', date: '2026-03-10', lastModified: '2026-03-16', relatedTool: '/clock' },
    { slug: 'dday-countdown-usage', titleKey: 'dday', descKey: 'ddayDesc', date: '2026-03-10', lastModified: '2026-03-16', relatedTool: '/dday-counter' },
    { slug: 'time-management-techniques', titleKey: 'timeManagement', descKey: 'timeManagementDesc', date: '2026-03-10', lastModified: '2026-03-16', relatedTool: '/timer' },
    { slug: 'online-vs-device-clock', titleKey: 'onlineVsDevice', descKey: 'onlineVsDeviceDesc', date: '2026-03-10', lastModified: '2026-03-16', relatedTool: '/server-time' },
    { slug: 'alarm-setting-tips', titleKey: 'alarmTips', descKey: 'alarmTipsDesc', date: '2026-03-10', lastModified: '2026-03-16', relatedTool: '/alarm' },
];

export function findGuideBySlug(slug: string): GuideDef | undefined {
    return ALL_GUIDES.find(g => g.slug === slug);
}
