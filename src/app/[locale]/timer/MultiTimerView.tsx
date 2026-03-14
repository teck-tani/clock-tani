"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { useTranslations } from "next-intl";
import styles from "./multiTimer.module.css";
import pickerStyles from "@/components/scrollWheelPicker.module.css";
import ScrollWheelPicker from "@/components/ScrollWheelPicker";
import SoundPicker from "@/components/SoundPicker";
import ShareButton from "@/components/ShareButton";
import { type SoundType, playMp3, stopAudio, migrateSoundType } from "@/components/soundUtils";

// ===== 상수 =====
const MAX_TIMERS = 10;
const ALARM_AUTO_STOP_SEC = 30;
const STORAGE_KEY = 'multi_timer_state';
const TEMPLATE_STORAGE_KEY = 'multi_timer_templates';

const TIMER_COLORS = [
    '#667eea', '#22c55e', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#ec4899', '#f97316',
] as const;

const PRESETS = [
    { sec: 1, label: '+1s' },
    { sec: 5, label: '+5s' },
    { sec: 60, label: '+1m' },
    { sec: 300, label: '+5m' },
] as const;

// ===== 내장 템플릿 =====
const BUILT_IN_TEMPLATES = [
    { name: 'cooking', timers: [{ label: '파스타', duration: 600 }, { label: '소스', duration: 1200 }] },
    { name: 'laundry', timers: [{ label: '세탁', duration: 2400 }, { label: '건조', duration: 3600 }] },
    { name: 'workout', timers: [{ label: '세트 1', duration: 60 }, { label: '휴식', duration: 30 }, { label: '세트 2', duration: 60 }] },
] as const;

// ===== 인터페이스 =====
interface MultiTimer {
    id: string;
    label: string;
    duration: number;
    timeLeft: number;
    isRunning: boolean;
    endTime: number;
    color: string;
    completedAt?: number;
}

interface SavedTemplate {
    name: string;
    timers: { label: string; duration: number }[];
}

// ===== 유틸 =====
function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getNextColor(timers: MultiTimer[]): string {
    const usedColors = new Set(timers.map(t => t.color));
    return TIMER_COLORS.find(c => !usedColors.has(c)) ?? TIMER_COLORS[timers.length % TIMER_COLORS.length];
}

// ===== 메인 컴포넌트 =====
export default function MultiTimerView() {
    const t = useTranslations('Clock.Timer');
    const mt = useTranslations('Clock.Timer.multi');

    // 타이머 상태
    const [timers, setTimers] = useState<MultiTimer[]>([]);
    const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
    const [editingLabelValue, setEditingLabelValue] = useState('');

    // 사운드
    const [sound, setSound] = useState<SoundType>('early-sunrise');
    const [vibrationOn, setVibrationOn] = useState(true);
    const [volume, setVolume] = useState(80);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const alarmAutoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 템플릿
    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
    const [templateName, setTemplateName] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);

    // 공유
    const [shareCopied, setShareCopied] = useState(false);

    // rAF
    const rafRef = useRef<number>(0);
    const initializedRef = useRef(false);

    // ===== localStorage 로드 =====
    useEffect(() => {
        let loaded = false;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const s = JSON.parse(raw);
                if (s.sound) setSound(migrateSoundType(s.sound));
                if (s.vibrationOn !== undefined) setVibrationOn(s.vibrationOn);
                if (s.volume !== undefined) setVolume(s.volume);
                if (s.timers && Array.isArray(s.timers) && s.timers.length > 0) {
                    const now = Date.now();
                    setTimers(s.timers.map((timer: MultiTimer) => {
                        // 색상 마이그레이션
                        if (!timer.color) timer.color = TIMER_COLORS[0];
                        if (timer.isRunning && timer.endTime) {
                            const remaining = Math.max(0, Math.ceil((timer.endTime - now) / 1000));
                            return remaining > 0
                                ? { ...timer, timeLeft: remaining }
                                : { ...timer, timeLeft: 0, isRunning: false, completedAt: timer.endTime };
                        }
                        return timer;
                    }));
                    loaded = true;
                }
            }
            // 이전 포맷(timer_state)에서 마이그레이션
            if (!raw) {
                const oldRaw = localStorage.getItem('timer_state');
                if (oldRaw) {
                    const old = JSON.parse(oldRaw);
                    if (old.multiTimers && Array.isArray(old.multiTimers) && old.multiTimers.length > 0) {
                        const now = Date.now();
                        setTimers(old.multiTimers.map((timer: MultiTimer, i: number) => {
                            const migrated = { ...timer, color: timer.color || TIMER_COLORS[i % TIMER_COLORS.length] };
                            if (migrated.isRunning && migrated.endTime) {
                                const remaining = Math.max(0, Math.ceil((migrated.endTime - now) / 1000));
                                return remaining > 0
                                    ? { ...migrated, timeLeft: remaining }
                                    : { ...migrated, timeLeft: 0, isRunning: false };
                            }
                            return migrated;
                        }));
                        loaded = true;
                    }
                }
            }
        } catch { /* localStorage 오류 무시 */ }

        // URL 파라미터 우선 처리
        const params = new URLSearchParams(window.location.search);
        const timersParam = params.get('timers');
        if (timersParam) {
            const parsed = timersParam.split(',').map((item, i) => {
                const [timeStr, label] = item.split(':');
                let duration = 0;
                const match = timeStr.match(/^(\d+)(s|m|h)$/);
                if (match) {
                    const val = parseInt(match[1]);
                    if (match[2] === 's') duration = val;
                    else if (match[2] === 'm') duration = val * 60;
                    else if (match[2] === 'h') duration = val * 3600;
                }
                return {
                    id: Date.now().toString(36) + i,
                    label: label ? decodeURIComponent(label) : `${mt('timer')} ${i + 1}`,
                    duration, timeLeft: duration, isRunning: false, endTime: 0,
                    color: TIMER_COLORS[i % TIMER_COLORS.length],
                };
            }).filter(t => t.duration > 0).slice(0, MAX_TIMERS);
            if (parsed.length > 0) {
                setTimers(parsed);
                loaded = true;
            }
        }

        // 저장된 데이터도 URL도 없으면 기본 타이머 1개 추가
        if (!loaded) {
            setTimers([{
                id: Date.now().toString(36),
                label: `${mt('timer')} 1`,
                duration: 300, timeLeft: 300,
                isRunning: false, endTime: 0,
                color: TIMER_COLORS[0],
            }]);
        }

        // 템플릿 로드
        try {
            const tplRaw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            if (tplRaw) setSavedTemplates(JSON.parse(tplRaw));
        } catch { /* 무시 */ }

        initializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ===== localStorage 저장 (초기화 후에만) =====
    useEffect(() => {
        if (!initializedRef.current) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                timers: timers.map(t => ({ ...t })),
                sound, vibrationOn, volume,
            }));
        } catch { /* quota exceeded 무시 */ }
    }, [timers, sound, vibrationOn, volume]);

    // ===== 사운드 =====
    const stopSound = useCallback(() => {
        stopAudio(audioRef.current);
        audioRef.current = null;
        if (alarmIntervalRef.current) { clearInterval(alarmIntervalRef.current); alarmIntervalRef.current = null; }
        if (alarmAutoStopRef.current) { clearTimeout(alarmAutoStopRef.current); alarmAutoStopRef.current = null; }
    }, []);

    const playSoundOnce = useCallback(() => {
        stopAudio(audioRef.current);
        audioRef.current = playMp3(sound, volume / 100);
    }, [sound, volume]);

    const startAlarmLoop = useCallback(() => {
        stopSound();
        playSoundOnce();
        alarmIntervalRef.current = setInterval(playSoundOnce, 4000);
        alarmAutoStopRef.current = setTimeout(stopSound, ALARM_AUTO_STOP_SEC * 1000);
    }, [playSoundOnce, stopSound]);

    // 최신 콜백을 ref로 유지 (stale closure 방지)
    const startAlarmLoopRef = useRef(startAlarmLoop);
    const vibrationOnRef = useRef(vibrationOn);
    useEffect(() => { startAlarmLoopRef.current = startAlarmLoop; }, [startAlarmLoop]);
    useEffect(() => { vibrationOnRef.current = vibrationOn; }, [vibrationOn]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            stopAudio(audioRef.current);
            if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
            if (alarmAutoStopRef.current) clearTimeout(alarmAutoStopRef.current);
        };
    }, []);

    // ===== rAF 타이머 업데이트 =====
    useEffect(() => {
        const hasRunning = timers.some(t => t.isRunning);
        if (!hasRunning) { if (rafRef.current) cancelAnimationFrame(rafRef.current); return; }
        const tick = () => {
            setTimers(prev => {
                let changed = false;
                const next = prev.map(timer => {
                    if (!timer.isRunning) return timer;
                    const remaining = Math.max(0, Math.ceil((timer.endTime - Date.now()) / 1000));
                    if (remaining === 0 && timer.timeLeft > 0) {
                        changed = true;
                        // 타이머 완료
                        startAlarmLoopRef.current();
                        if (vibrationOnRef.current && typeof navigator !== 'undefined' && navigator.vibrate) {
                            navigator.vibrate([300, 100, 300, 100, 300]);
                        }
                        // 브라우저 알림
                        try {
                            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                                new Notification(mt('completed', { label: timer.label }), {
                                    body: timer.label,
                                    icon: '/icon.svg',
                                });
                            }
                        } catch { /* 무시 */ }
                        return { ...timer, timeLeft: 0, isRunning: false, completedAt: Date.now() };
                    }
                    if (remaining !== timer.timeLeft) {
                        changed = true;
                        return { ...timer, timeLeft: remaining };
                    }
                    return timer;
                });
                return changed ? next : prev;
            });
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timers.map(t => t.isRunning).join(',')]);

    // ===== 백그라운드 탭 완료 감지 (setInterval) =====
    const completionRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        const hasRunning = timers.some(t => t.isRunning);
        if (!hasRunning) {
            if (completionRef.current) { clearInterval(completionRef.current); completionRef.current = null; }
            return;
        }
        completionRef.current = setInterval(() => {
            const now = Date.now();
            setTimers(prev => {
                let changed = false;
                const next = prev.map(timer => {
                    if (!timer.isRunning || timer.endTime <= 0 || now < timer.endTime) return timer;
                    changed = true;
                    startAlarmLoopRef.current();
                    if (vibrationOnRef.current && typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate([300, 100, 300, 100, 300]);
                    }
                    return { ...timer, timeLeft: 0, isRunning: false, completedAt: now };
                });
                return changed ? next : prev;
            });
        }, 500);
        return () => { if (completionRef.current) { clearInterval(completionRef.current); completionRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timers.map(t => t.isRunning).join(',')]);

    // ===== 탭 타이틀 =====
    useEffect(() => {
        const running = timers.filter(t => t.isRunning);
        if (running.length > 0) {
            const shortest = running.reduce((a, b) => a.timeLeft < b.timeLeft ? a : b);
            document.title = `${formatTime(shortest.timeLeft)} | ${mt('title')}`;
        } else {
            document.title = mt('title');
        }
        return () => { document.title = mt('title'); };
    }, [timers, mt]);

    // 알림 권한 요청
    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);


    // ===== 타이머 핸들러 =====
    const addTimer = useCallback(() => {
        if (timers.length >= MAX_TIMERS) return;
        setTimers(prev => [...prev, {
            id: Date.now().toString(36),
            label: `${mt('timer')} ${prev.length + 1}`,
            duration: 300, timeLeft: 300,
            isRunning: false, endTime: 0,
            color: getNextColor(prev),
        }]);
    }, [timers.length, mt]);

    const removeTimer = useCallback((id: string) => {
        setTimers(prev => {
            const target = prev.find(t => t.id === id);
            // 완료된 타이머 삭제 시 알람 정지
            if (target?.completedAt) stopSound();
            return prev.filter(t => t.id !== id);
        });
    }, [stopSound]);

    const startTimer = useCallback((id: string) => {
        setTimers(prev => prev.map(timer => {
            if (timer.id !== id || timer.timeLeft === 0) return timer;
            return { ...timer, isRunning: true, endTime: Date.now() + timer.timeLeft * 1000, completedAt: undefined };
        }));
    }, []);

    const stopTimer = useCallback((id: string) => {
        setTimers(prev => prev.map(timer =>
            timer.id === id ? { ...timer, isRunning: false } : timer
        ));
    }, []);

    const resetTimer = useCallback((id: string) => {
        // 알람 정지
        stopSound();
        setTimers(prev => prev.map(timer =>
            timer.id === id ? { ...timer, timeLeft: timer.duration, isRunning: false, completedAt: undefined } : timer
        ));
    }, [stopSound]);

    const setDuration = useCallback((id: string, dur: number) => {
        setTimers(prev => prev.map(timer =>
            timer.id === id && !timer.isRunning ? { ...timer, duration: dur, timeLeft: dur, completedAt: undefined } : timer
        ));
    }, []);

    const addPreset = useCallback((id: string, sec: number) => {
        setTimers(prev => prev.map(timer => {
            if (timer.id !== id || timer.isRunning) return timer;
            const newDur = Math.min(86400, timer.duration + sec); // 최대 24시간
            return { ...timer, duration: newDur, timeLeft: newDur, completedAt: undefined };
        }));
    }, []);

    const setTimerColor = useCallback((id: string, color: string) => {
        setTimers(prev => prev.map(timer =>
            timer.id === id ? { ...timer, color } : timer
        ));
    }, []);

    // ===== 전체 제어 =====
    const startAll = useCallback(() => {
        setTimers(prev => prev.map(timer => {
            if (timer.isRunning || timer.timeLeft === 0) return timer;
            return { ...timer, isRunning: true, endTime: Date.now() + timer.timeLeft * 1000, completedAt: undefined };
        }));
    }, []);

    const stopAll = useCallback(() => {
        setTimers(prev => prev.map(timer =>
            timer.isRunning ? { ...timer, isRunning: false } : timer
        ));
    }, []);

    const resetAll = useCallback(() => {
        stopSound();
        setTimers(prev => prev.map(timer => ({
            ...timer, timeLeft: timer.duration, isRunning: false, completedAt: undefined,
        })));
    }, [stopSound]);

    // ===== 라벨 편집 =====
    const startEditLabel = useCallback((id: string, currentLabel: string) => {
        setEditingLabelId(id);
        setEditingLabelValue(currentLabel);
    }, []);

    const confirmEditLabel = useCallback(() => {
        if (editingLabelId) {
            const trimmed = editingLabelValue.trim().slice(0, 20);
            if (trimmed) {
                setTimers(prev => prev.map(timer =>
                    timer.id === editingLabelId ? { ...timer, label: trimmed } : timer
                ));
            }
            setEditingLabelId(null);
        }
    }, [editingLabelId, editingLabelValue]);

    // ===== 키보드 단축키 =====
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const digit = parseInt(e.key);
            if (!isNaN(digit) && digit >= 1 && digit <= timers.length) {
                e.preventDefault();
                const timer = timers[digit - 1];
                if (e.shiftKey) {
                    resetTimer(timer.id);
                } else {
                    if (timer.isRunning) stopTimer(timer.id);
                    else if (timer.timeLeft > 0) startTimer(timer.id);
                }
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'a': if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); startAll(); } break;
                case 's': if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); stopAll(); } break;
                case 'r': if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); resetAll(); } break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [timers, startTimer, stopTimer, resetTimer, startAll, stopAll, resetAll]);

    // ===== 템플릿 =====
    const applyTemplate = useCallback((tmpl: { timers: readonly { label: string; duration: number }[] }) => {
        setTimers(tmpl.timers.map((t, i) => ({
            id: Date.now().toString(36) + i,
            label: t.label,
            duration: t.duration, timeLeft: t.duration,
            isRunning: false, endTime: 0,
            color: TIMER_COLORS[i % TIMER_COLORS.length],
        })));
    }, []);

    const saveTemplate = useCallback(() => {
        const name = templateName.trim();
        if (!name || timers.length === 0) return;
        const newTpl: SavedTemplate = {
            name,
            timers: timers.map(t => ({ label: t.label, duration: t.duration })),
        };
        const updated = [...savedTemplates.filter(t => t.name !== name), newTpl].slice(0, 10);
        setSavedTemplates(updated);
        setTemplateName('');
        try { localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updated)); } catch { /* 무시 */ }
    }, [templateName, timers, savedTemplates]);

    const deleteTemplate = useCallback((name: string) => {
        const updated = savedTemplates.filter(t => t.name !== name);
        setSavedTemplates(updated);
        try { localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updated)); } catch { /* 무시 */ }
    }, [savedTemplates]);

    // ===== 공유 =====
    const handleShare = useCallback(async () => {
        if (timers.length === 0) return;
        const timersParam = timers.map(t => {
            let timeStr: string;
            if (t.duration >= 3600 && t.duration % 3600 === 0) timeStr = `${t.duration / 3600}h`;
            else if (t.duration >= 60 && t.duration % 60 === 0) timeStr = `${t.duration / 60}m`;
            else timeStr = `${t.duration}s`;
            return `${timeStr}:${encodeURIComponent(t.label)}`;
        }).join(',');
        const url = `${window.location.origin}${window.location.pathname}?timers=${timersParam}`;
        try {
            await navigator.clipboard.writeText(url);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        } catch { /* 무시 */ }
    }, [timers]);

    const getShareText = useCallback(() => {
        const lines = timers.map(t => `${t.label}: ${formatTime(t.duration)}`);
        return `${mt('title')}\n${lines.join('\n')}`;
    }, [timers, mt]);


    // ===== RENDER =====
    const hasTimers = timers.length > 0;

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.mainCard}>
                    {/* 전체 제어 버튼 */}
                    {timers.length > 1 && (
                        <div className={styles.bulkControls}>
                            <button onClick={startAll} className={`${styles.bulkBtn} ${styles.bulkBtnStart}`}>
                                <FaPlay style={{ fontSize: '0.6rem' }} /> {mt('startAll')}
                            </button>
                            <button onClick={stopAll} className={`${styles.bulkBtn} ${styles.bulkBtnStop}`}>
                                <FaPause style={{ fontSize: '0.6rem' }} /> {mt('stopAll')}
                            </button>
                            <button onClick={resetAll} className={`${styles.bulkBtn} ${styles.bulkBtnReset}`}>
                                <FaRedo style={{ fontSize: '0.55rem' }} /> {mt('resetAll')}
                            </button>
                        </div>
                    )}

                    {/* 타이머 카드 그리드 */}
                    <div className={styles.timerGrid}>
                        {timers.map((timer) => {
                            const progress = timer.duration > 0 ? (timer.duration - timer.timeLeft) / timer.duration : 0;
                            const isSetting = !timer.isRunning && timer.timeLeft === timer.duration && !timer.completedAt;
                            const isCompleted = timer.timeLeft === 0 && !timer.isRunning && timer.completedAt;

                            return (
                                <div
                                    key={timer.id}
                                    className={`${styles.card} ${timer.isRunning ? styles.cardRunning : ''} ${isCompleted ? styles.cardCompleted : ''}`}
                                    style={{ borderColor: timer.isRunning ? timer.color + '66' : isCompleted ? '#ef444466' : undefined }}
                                >
                                    {/* 헤더: 라벨 + 삭제 */}
                                    <div className={styles.cardHeader}>
                                        {editingLabelId === timer.id ? (
                                            <input
                                                className={styles.labelInput}
                                                value={editingLabelValue}
                                                onChange={e => setEditingLabelValue(e.target.value.slice(0, 20))}
                                                onBlur={confirmEditLabel}
                                                onKeyDown={e => { if (e.key === 'Enter') confirmEditLabel(); if (e.key === 'Escape') setEditingLabelId(null); }}
                                                autoFocus
                                                maxLength={20}
                                            />
                                        ) : (
                                            <span
                                                className={styles.labelDisplay}
                                                style={{ color: timer.color }}
                                                onClick={() => startEditLabel(timer.id, timer.label)}
                                                title={mt('editLabel')}
                                            >
                                                {timer.label}
                                            </span>
                                        )}
                                        <button onClick={() => removeTimer(timer.id)} className={styles.removeBtn} aria-label={mt('remove')}>
                                            ✕
                                        </button>
                                    </div>

                                    {/* 색상 선택 (세팅 모드에서만) */}
                                    {isSetting && (
                                        <div className={styles.colorDots}>
                                            {TIMER_COLORS.map(c => (
                                                <button
                                                    key={c}
                                                    className={`${styles.colorDot} ${timer.color === c ? styles.colorDotActive : ''}`}
                                                    style={{ color: c }}
                                                    onClick={() => setTimerColor(timer.id, c)}
                                                    aria-label={c}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* 시간 입력 또는 디스플레이 */}
                                    {isSetting ? (
                                        <>
                                            <div className={pickerStyles.timePickerRowCompact}>
                                                <ScrollWheelPicker
                                                    compact
                                                    value={Math.floor(timer.duration / 3600)}
                                                    onChange={(h) => {
                                                        setDuration(timer.id, h * 3600 + Math.floor((timer.duration % 3600) / 60) * 60 + timer.duration % 60);
                                                    }}
                                                    min={0} max={23}
                                                    label={t('labels.hour')}
                                                />
                                                <span className={pickerStyles.timePickerSeparatorCompact}>:</span>
                                                <ScrollWheelPicker
                                                    compact
                                                    value={Math.floor((timer.duration % 3600) / 60)}
                                                    onChange={(m) => {
                                                        setDuration(timer.id, Math.floor(timer.duration / 3600) * 3600 + m * 60 + timer.duration % 60);
                                                    }}
                                                    min={0} max={59}
                                                    label={t('labels.minute')}
                                                />
                                                <span className={pickerStyles.timePickerSeparatorCompact}>:</span>
                                                <ScrollWheelPicker
                                                    compact
                                                    value={timer.duration % 60}
                                                    onChange={(s) => {
                                                        setDuration(timer.id, Math.floor(timer.duration / 3600) * 3600 + Math.floor((timer.duration % 3600) / 60) * 60 + s);
                                                    }}
                                                    min={0} max={59}
                                                    label={t('labels.second')}
                                                />
                                            </div>
                                            {/* 프리셋 버튼 */}
                                            <div className={styles.presets}>
                                                {PRESETS.map(p => (
                                                    <button key={p.sec} onClick={() => addPreset(timer.id, p.sec)} className={styles.presetBtn}>
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* 프로그레스 바 */}
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={`${styles.progressFill} ${isCompleted ? styles.progressComplete : ''}`}
                                                    style={{
                                                        width: `${progress * 100}%`,
                                                        background: isCompleted ? '#ef4444' : timer.color,
                                                    }}
                                                />
                                            </div>
                                            {/* 시간 표시 */}
                                            <div
                                                className={styles.timeDisplay}
                                                style={{ color: isCompleted ? '#ef4444' : timer.isRunning ? timer.color : '#667eea' }}
                                            >
                                                {formatTime(timer.timeLeft)}
                                            </div>
                                            {/* 완료 배지 */}
                                            {isCompleted && timer.completedAt && (
                                                <div className={styles.completedBadge}>
                                                    ✓ {mt('completedAt')} {new Date(timer.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* 컨트롤 버튼 */}
                                    <div className={styles.controls}>
                                        {!timer.isRunning && timer.timeLeft > 0 && (
                                            <button onClick={() => startTimer(timer.id)} className={`${styles.btn} ${styles.btnStart}`}>
                                                <FaPlay style={{ fontSize: '0.65rem' }} />
                                                {isSetting ? t('controls.start') : t('controls.continue')}
                                            </button>
                                        )}
                                        {timer.isRunning && (
                                            <button onClick={() => stopTimer(timer.id)} className={`${styles.btn} ${styles.btnStop}`}>
                                                <FaPause style={{ fontSize: '0.65rem' }} />
                                                {t('controls.stop')}
                                            </button>
                                        )}
                                        <button onClick={() => resetTimer(timer.id)} className={`${styles.btn} ${styles.btnReset}`}>
                                            <FaRedo style={{ fontSize: '0.55rem' }} />
                                            {t('controls.reset')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 타이머 추가 */}
                    {timers.length < MAX_TIMERS ? (
                        <button onClick={addTimer} className={styles.addBtn} style={{ marginTop: '12px' }}>
                            + {mt('add')}
                        </button>
                    ) : (
                        <div className={styles.maxText}>{mt('max')}</div>
                    )}
                </div>

                {/* 사운드 설정 */}
                <div className={styles.soundSection}>
                    <div className={styles.soundTitle}>{t('sounds.title')}</div>
                    <SoundPicker
                        sound={sound}
                        onSoundChange={setSound}
                        vibration={vibrationOn}
                        onVibrationChange={setVibrationOn}
                        t={(key: string) => t(`sounds.picker.${key}`)}
                        volume={volume}
                    />
                    <div className={styles.volumeRow}>
                        <span className={styles.volumeLabel}>{t('volume.label')}</span>
                        <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} className={styles.volumeSlider} />
                        <span className={styles.volumeValue}>{volume}%</span>
                    </div>
                </div>

                {/* 기능 버튼 */}
                <div className={styles.featureRow}>
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        style={{
                            padding: '5px 10px', border: '1px solid #e0e0e0', borderRadius: '16px',
                            background: showTemplates ? '#667eea' : 'transparent',
                            color: showTemplates ? 'white' : '#666',
                            cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s',
                        }}
                    >
                        📋 {mt('templates')}
                    </button>
                    <button
                        onClick={handleShare}
                        style={{
                            padding: '5px 10px', border: '1px solid #e0e0e0', borderRadius: '16px',
                            background: shareCopied ? '#667eea' : 'transparent',
                            color: shareCopied ? 'white' : '#666',
                            cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s',
                        }}
                    >
                        🔗 {shareCopied ? t('share.copied') : t('share.copy')}
                    </button>
                    <ShareButton shareText={getShareText()} />
                </div>

                {/* 템플릿 섹션 */}
                {showTemplates && (
                    <div className={styles.templateSection}>
                        <div className={styles.templateTitle}>{mt('templates')}</div>
                        <div className={styles.templateList}>
                            {BUILT_IN_TEMPLATES.map(tmpl => (
                                <button key={tmpl.name} onClick={() => applyTemplate(tmpl)} className={styles.templateBtn}>
                                    {mt(`builtinTemplate.${tmpl.name}`)}
                                </button>
                            ))}
                            {savedTemplates.map(tmpl => (
                                <span key={tmpl.name} className={styles.savedTemplateItem}>
                                    <span onClick={() => applyTemplate(tmpl)} style={{ cursor: 'pointer' }}>{tmpl.name}</span>
                                    <button onClick={() => deleteTemplate(tmpl.name)} className={styles.templateDeleteBtn}>✕</button>
                                </span>
                            ))}
                        </div>
                        {hasTimers && (
                            <div className={styles.templateSaveRow}>
                                <input
                                    className={styles.templateNameInput}
                                    value={templateName}
                                    onChange={e => setTemplateName(e.target.value)}
                                    placeholder={mt('templateName')}
                                    maxLength={20}
                                />
                                <button onClick={saveTemplate} className={styles.templateSaveBtn}>
                                    {mt('saveTemplate')}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 키보드 단축키 */}
                <div className={styles.shortcutHint}>
                    <span><kbd className={styles.kbd}>1</kbd>~<kbd className={styles.kbd}>9</kbd> {mt('shortcutToggle')}</span>
                    <span><kbd className={styles.kbd}>A</kbd> {mt('startAll')}</span>
                    <span><kbd className={styles.kbd}>S</kbd> {mt('stopAll')}</span>
                    <span><kbd className={styles.kbd}>R</kbd> {mt('resetAll')}</span>
                </div>
            </div>
        </div>
    );
}
