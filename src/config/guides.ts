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
    { slug: 'focus-music-productivity', titleKey: 'focusMusic', descKey: 'focusMusicDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/pomodoro' },
    { slug: 'hiit-workout-timer-guide', titleKey: 'hiitWorkout', descKey: 'hiitWorkoutDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/interval' },
    { slug: 'cooking-timer-guide', titleKey: 'cookingTimer', descKey: 'cookingTimerDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/multi-timer' },
    { slug: 'exam-time-management', titleKey: 'examTime', descKey: 'examTimeDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/timer' },
    { slug: 'sleep-alarm-science', titleKey: 'sleepAlarm', descKey: 'sleepAlarmDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/alarm' },
    { slug: 'remote-work-time-tools', titleKey: 'remoteWork', descKey: 'remoteWorkDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/pomodoro' },
    { slug: 'korean-lunar-calendar-guide', titleKey: 'lunarCalendar', descKey: 'lunarCalendarDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/dday-counter' },
    { slug: 'stopwatch-sports-training', titleKey: 'sportsTraining', descKey: 'sportsTrainingDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/stopwatch' },
    { slug: 'server-time-sync-guide', titleKey: 'serverTimeSync', descKey: 'serverTimeSyncDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/server-time' },
    { slug: 'ticketing-timing-guide', titleKey: 'ticketingTiming', descKey: 'ticketingTimingDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/clock' },
    { slug: 'multiple-timezone-work', titleKey: 'multiTimezone', descKey: 'multiTimezoneDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/clock' },
    { slug: 'study-timer-techniques', titleKey: 'studyTimer', descKey: 'studyTimerDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/timer' },
    { slug: 'new-year-countdown-dday', titleKey: 'newYearCountdown', descKey: 'newYearCountdownDesc', date: '2026-04-08', lastModified: '2026-04-08', relatedTool: '/dday-counter' },
];

export function findGuideBySlug(slug: string): GuideDef | undefined {
    return ALL_GUIDES.find(g => g.slug === slug);
}
