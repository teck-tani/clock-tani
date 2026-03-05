import {
    FaClock, FaStopwatch, FaHourglassHalf, FaBell,
    FaServer, FaCalendarAlt, FaCode
} from "react-icons/fa";
import { GiTomato } from "react-icons/gi";
import { TbRepeat, TbTimeline } from "react-icons/tb";
import type { IconType } from "react-icons";

export type CategoryKey = 'time';

export interface ToolDef {
    href: string;
    labelKey: string;
    icon: IconType;
    category: CategoryKey;
}

export interface CategoryDef {
    key: CategoryKey;
    icon: IconType;
}

export const ALL_TOOLS: ToolDef[] = [
    { href: '/clock', labelKey: 'clock', icon: FaClock, category: 'time' },
    { href: '/stopwatch', labelKey: 'stopwatch', icon: FaStopwatch, category: 'time' },
    { href: '/timer', labelKey: 'timer', icon: FaHourglassHalf, category: 'time' },
    { href: '/pomodoro', labelKey: 'pomodoro', icon: GiTomato, category: 'time' },
    { href: '/interval', labelKey: 'interval', icon: TbRepeat, category: 'time' },
    { href: '/multi-timer', labelKey: 'multiTimer', icon: TbTimeline, category: 'time' },
    { href: '/alarm', labelKey: 'alarm', icon: FaBell, category: 'time' },
    { href: '/server-time', labelKey: 'serverTime', icon: FaServer, category: 'time' },
    { href: '/dday-counter', labelKey: 'ddayCounter', icon: FaCalendarAlt, category: 'time' },
];

export const CATEGORIES: CategoryDef[] = [
    { key: 'time', icon: FaClock },
];

export function getToolsByCategory(category: CategoryKey): ToolDef[] {
    return ALL_TOOLS.filter(t => t.category === category);
}

export function getCategoriesWithTools() {
    return CATEGORIES.map(cat => ({
        ...cat,
        tools: getToolsByCategory(cat.key),
    }));
}

export function findToolByPathname(pathname: string): ToolDef | undefined {
    const slug = pathname.replace(/^\/(ko|en)(?=\/|$)/, '').replace(/^\//, '');
    return ALL_TOOLS.find(t => t.href === `/${slug}`);
}

export function getAllToolHrefs(): string[] {
    return ['', ...ALL_TOOLS.map(t => t.href)];
}
