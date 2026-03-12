"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaHourglassStart, FaCoffee, FaPlay, FaForward } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useTheme } from "@/contexts/ThemeContext";
// import { useWakeLock } from "./useWakeLock";
import { recordPomoSession } from "./PomodoroStats";
import { incrementTaskPomo } from "./PomodoroTasks";
import dynamic from "next/dynamic";
import styles from "./timer.module.css";
import ShareButton from "@/components/ShareButton";
import ScrollWheelPicker from "@/components/ScrollWheelPicker";
import pickerStyles from "@/components/scrollWheelPicker.module.css";
import { playMp3, stopAudio } from "@/components/soundUtils";

const PomodoroStats = dynamic(() => import("./PomodoroStats"), { ssr: false });
const PomodoroTasks = dynamic(() => import("./PomodoroTasks"), { ssr: false });
type TimerMode = "timer" | "pomodoro" | "interval" | "multi";
type PomodoroPhase = "work" | "break" | "longBreak";
type IntervalPhase = "work" | "rest";

const PRESETS = [
    { label: '1m', seconds: 60 }, { label: '3m', seconds: 180 }, { label: '5m', seconds: 300 },
    { label: '10m', seconds: 600 }, { label: '15m', seconds: 900 }, { label: '30m', seconds: 1800 }, { label: '1h', seconds: 3600 },
];
const POMO_DEFAULTS = { work: 25, break: 5, longBreak: 15, sessionsBeforeLong: 4 };
const STORAGE_KEY = 'timer_state';
const ALARM_AUTO_STOP_SEC = 30;
const FIXED_SOUND = "early-sunrise" as const;
interface MultiTimer { id: string; label: string; duration: number; timeLeft: number; isRunning: boolean; endTime: number; }

// 각 탭별 독립 타이머 상태
interface ModeTimerState {
    duration: number;
    timeLeft: number;
    isRunning: boolean;
    isSetting: boolean;
    endTime: number;
}
const DEFAULT_MT: ModeTimerState = { duration: 0, timeLeft: 0, isRunning: false, isSetting: true, endTime: 0 };

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ===== Main Component =====
export default function TimerView({ fixedMode }: { fixedMode?: TimerMode }) {
    const t = useTranslations('Clock.Timer');
    const { theme } = useTheme();

    // Mode
    const [mode, setMode] = useState<TimerMode>(fixedMode ?? "timer");

    // 탭별 완전 독립 타이머 상태
    const [modeTimers, setModeTimers] = useState<Record<TimerMode, ModeTimerState>>({
        timer: { ...DEFAULT_MT }, pomodoro: { ...DEFAULT_MT }, interval: { ...DEFAULT_MT }, multi: { ...DEFAULT_MT },
    });
    // 현재 탭의 타이머 상태 파생
    const { duration, timeLeft, isRunning, isSetting } = modeTimers[mode];
    const updateMode = useCallback((m: TimerMode, updates: Partial<ModeTimerState>) => {
        setModeTimers(prev => ({ ...prev, [m]: { ...prev[m], ...updates } }));
    }, []);

    // 알람 모달
    const [alarmSource, setAlarmSource] = useState<TimerMode | null>(null);
    const [showAlarmModal, setShowAlarmModal] = useState(false);
    const [inputValues, setInputValues] = useState({ h: 0, m: 0, s: 0 });

    // Sound
    const [vibrationOn, setVibrationOn] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Pomodoro
    const [pomoWork, setPomoWork] = useState(POMO_DEFAULTS.work);
    const [pomoBreak, setPomoBreak] = useState(POMO_DEFAULTS.break);
    const [pomoLongBreak, setPomoLongBreak] = useState(POMO_DEFAULTS.longBreak);
    const [pomoPhase, setPomoPhase] = useState<PomodoroPhase>("work");
    const [pomoSession, setPomoSession] = useState(1);
    const [pomoAutoStart, setPomoAutoStart] = useState(true);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    // Interval
    const [intervalWork, setIntervalWork] = useState(20);
    const [intervalRest, setIntervalRest] = useState(10);
    const [intervalRounds, setIntervalRounds] = useState(8);
    const [intervalPhase, setIntervalPhase] = useState<IntervalPhase>("work");
    const [intervalCurrentRound, setIntervalCurrentRound] = useState(1);
    const [intervalPresetType, setIntervalPresetType] = useState<"tabata" | "hiit" | "custom">("tabata");

    // Multi-timer
    const [multiTimers, setMultiTimers] = useState<MultiTimer[]>([]);

    // rAF
    const rafRef = useRef<number>(0);

    // Alarm auto-stop
    const alarmAutoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [alarmCountdown, setAlarmCountdown] = useState(ALARM_AUTO_STOP_SEC);
    const alarmCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const alarmModalRef = useRef<HTMLDivElement>(null);

    // Share
    const [shareCopied, setShareCopied] = useState(false);

    // ===== Load on mount =====
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const s = JSON.parse(raw);
                if (s.mode) setMode(s.mode);
                if (s.vibrationOn !== undefined) setVibrationOn(s.vibrationOn);
                if (s.pomoWork) setPomoWork(s.pomoWork);
                if (s.pomoBreak) setPomoBreak(s.pomoBreak);
                if (s.pomoLongBreak) setPomoLongBreak(s.pomoLongBreak);
                if (s.pomoAutoStart !== undefined) setPomoAutoStart(s.pomoAutoStart);
                if (s.pomoPhase) setPomoPhase(s.pomoPhase);
                if (s.pomoSession) setPomoSession(s.pomoSession);
                if (s.inputValues) setInputValues(s.inputValues);
                if (s.intervalWork) setIntervalWork(s.intervalWork);
                if (s.intervalRest) setIntervalRest(s.intervalRest);
                if (s.intervalRounds) setIntervalRounds(s.intervalRounds);
                if (s.intervalCurrentRound) setIntervalCurrentRound(s.intervalCurrentRound);
                if (s.multiTimers && Array.isArray(s.multiTimers)) {
                    const now = Date.now();
                    setMultiTimers(s.multiTimers.map((t: MultiTimer) => {
                        if (t.isRunning && t.endTime) {
                            const remaining = Math.max(0, Math.ceil((t.endTime - now) / 1000));
                            return remaining > 0 ? { ...t, timeLeft: remaining } : { ...t, timeLeft: 0, isRunning: false };
                        }
                        return t;
                    }));
                }

                // 새 포맷: modeTimers 전체 복원
                if (s.modeTimers) {
                    const now = Date.now();
                    const loaded = { ...s.modeTimers } as Record<TimerMode, ModeTimerState>;
                    for (const m of ['timer', 'pomodoro', 'interval'] as TimerMode[]) {
                        if (loaded[m]?.isRunning && loaded[m]?.endTime) {
                            const remaining = Math.max(0, Math.ceil((loaded[m].endTime - now) / 1000));
                            if (remaining > 0) {
                                loaded[m] = { ...loaded[m], timeLeft: remaining };
                            } else {
                                loaded[m] = { ...loaded[m], timeLeft: 0, isRunning: false };
                            }
                        }
                    }
                    setModeTimers(prev => ({ ...prev, ...loaded }));
                } else if (s.isSetting === false && s.duration) {
                    // 이전 포맷 하위호환
                    const m: TimerMode = s.mode ?? 'timer';
                    let tl = s.timeLeft ?? 0;
                    let running = false;
                    if (s.isRunning && s.endTime) {
                        const remaining = Math.max(0, Math.ceil((s.endTime - Date.now()) / 1000));
                        if (remaining > 0) { tl = remaining; running = true; }
                        else { tl = 0; }
                    }
                    setModeTimers(prev => ({
                        ...prev,
                        [m]: { duration: s.duration, timeLeft: tl, isRunning: running, isSetting: false, endTime: running ? s.endTime : 0 },
                    }));
                }
            }
        } catch (e) {
            if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                console.warn('Timer: localStorage quota exceeded. Clearing old data.');
                try { localStorage.removeItem(STORAGE_KEY); } catch {}
            }
        }
    }, []);

    // ===== Save on change =====
    useEffect(() => {
        try {
            // endTime은 실행 중인 모드만 저장
            const saveable: Record<string, ModeTimerState> = {};
            for (const m of ['timer', 'pomodoro', 'interval', 'multi'] as TimerMode[]) {
                const mt = modeTimers[m];
                saveable[m] = { ...mt, timeLeft: mt.isRunning ? mt.timeLeft : mt.timeLeft };
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                mode, vibrationOn,
                pomoWork, pomoBreak, pomoLongBreak, pomoAutoStart,
                pomoPhase, pomoSession, inputValues, modeTimers: saveable,
                intervalWork, intervalRest, intervalRounds, intervalCurrentRound,
                multiTimers: multiTimers.map(t => ({ ...t })),
            }));
        } catch (e) {
            if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                console.warn('Timer: localStorage quota exceeded while saving.');
            }
        }
    }, [mode, vibrationOn, pomoWork, pomoBreak, pomoLongBreak,
        pomoAutoStart, modeTimers, pomoPhase, pomoSession, inputValues,
        intervalWork, intervalRest, intervalRounds, intervalCurrentRound, multiTimers]);

    // ===== Sound =====
    const stopSound = useCallback(() => {
        stopAudio(audioRef.current);
        audioRef.current = null;
        if (alarmIntervalRef.current) { clearInterval(alarmIntervalRef.current); alarmIntervalRef.current = null; }
        if (alarmAutoStopRef.current) { clearTimeout(alarmAutoStopRef.current); alarmAutoStopRef.current = null; }
        if (alarmCountdownRef.current) { clearInterval(alarmCountdownRef.current); alarmCountdownRef.current = null; }
    }, []);

    const playSound = useCallback(() => {
        stopSound();
        audioRef.current = playMp3(FIXED_SOUND);
    }, [stopSound]);

    const startAlarmLoop = useCallback(() => {
        playSound();
        alarmIntervalRef.current = setInterval(playSound, 4000);
        setAlarmCountdown(ALARM_AUTO_STOP_SEC);
        alarmCountdownRef.current = setInterval(() => {
            setAlarmCountdown(prev => prev <= 1 ? 0 : prev - 1);
        }, 1000);
        alarmAutoStopRef.current = setTimeout(() => {
            setShowAlarmModal(false); setAlarmSource(null); stopSound();
        }, ALARM_AUTO_STOP_SEC * 1000);
    }, [playSound, stopSound]);

    // ===== Unified rAF for ALL modes =====
    useEffect(() => {
        const anyRunning = modeTimers.timer.isRunning || modeTimers.pomodoro.isRunning || modeTimers.interval.isRunning;
        if (!anyRunning) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            return;
        }
        const tick = () => {
            const now = Date.now();
            setModeTimers(prev => {
                let changed = false;
                const next = { ...prev };
                for (const m of ['timer', 'pomodoro', 'interval'] as TimerMode[]) {
                    if (prev[m].isRunning && prev[m].endTime > 0) {
                        const remaining = Math.max(0, Math.ceil((prev[m].endTime - now) / 1000));
                        if (remaining !== prev[m].timeLeft) {
                            next[m] = { ...prev[m], timeLeft: remaining };
                            changed = true;
                        }
                    }
                }
                return changed ? next : prev;
            });
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [modeTimers.timer.isRunning, modeTimers.pomodoro.isRunning, modeTimers.interval.isRunning]);

    // ===== Alarm trigger for ALL modes =====
    useEffect(() => {
        for (const m of ['timer', 'pomodoro', 'interval'] as TimerMode[]) {
            const mt = modeTimers[m];
            if (mt.timeLeft === 0 && mt.isRunning) {
                updateMode(m, { isRunning: false });

                if (m === 'interval') {
                    // Interval auto-next (work↔rest)
                    if (intervalPhase === 'work') {
                        setIntervalPhase('rest');
                        updateMode('interval', { duration: intervalRest, timeLeft: intervalRest, isRunning: true, isSetting: false, endTime: Date.now() + intervalRest * 1000 });
                    } else {
                        if (intervalCurrentRound >= intervalRounds) {
                            setAlarmSource('interval');
                            setShowAlarmModal(true);
                            startAlarmLoop();
                            if (vibrationOn && navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
                        } else {
                            setIntervalPhase('work');
                            setIntervalCurrentRound(prev => prev + 1);
                            updateMode('interval', { duration: intervalWork, timeLeft: intervalWork, isRunning: true, isSetting: false, endTime: Date.now() + intervalWork * 1000 });
                        }
                    }
                    continue;
                }

                if (m === 'pomodoro' && pomoPhase === 'work') {
                    recordPomoSession(pomoWork);
                    if (activeTaskId) incrementTaskPomo(activeTaskId);
                }

                setAlarmSource(m);
                setShowAlarmModal(true);
                startAlarmLoop();
                if (vibrationOn && navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                    const body = m === 'pomodoro'
                        ? (pomoPhase === 'work' ? t('pomodoro.workDone') : t('pomodoro.breakDone'))
                        : t('controls.confirm');
                    new Notification(t('modal.title'), { body, icon: '/icon.svg' });
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modeTimers.timer.timeLeft, modeTimers.timer.isRunning,
        modeTimers.pomodoro.timeLeft, modeTimers.pomodoro.isRunning,
        modeTimers.interval.timeLeft, modeTimers.interval.isRunning]);

    // Tab title — 실행 중인 모드 중 현재 탭 우선 표시
    useEffect(() => {
        const running = (['timer', 'pomodoro', 'interval'] as TimerMode[]).filter(m => modeTimers[m].isRunning || (!modeTimers[m].isSetting && modeTimers[m].timeLeft > 0));
        if (running.length > 0) {
            const dm = running.includes(mode) ? mode : running[0];
            const mt = modeTimers[dm];
            const prefix = dm === 'pomodoro' ? (pomoPhase === 'work' ? '🔴 ' : '🟢 ')
                : dm === 'interval' ? (intervalPhase === 'work' ? '💪 ' : '😮‍💨 ') : '';
            document.title = `${prefix}${formatTime(mt.timeLeft)} - Timer`;
        } else { document.title = 'Timer'; }
        return () => { document.title = 'Timer'; };
    }, [modeTimers, mode, pomoPhase, intervalPhase]);

    // Notification permission
    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission();
    }, []);

    // Focus trap
    useEffect(() => {
        if (showAlarmModal && alarmModalRef.current) {
            const modal = alarmModalRef.current;
            const focusable = modal.querySelectorAll<HTMLElement>('button');
            if (focusable.length > 0) focusable[0].focus();
            const handleTab = (e: KeyboardEvent) => {
                if (e.key !== 'Tab' || focusable.length === 0) return;
                const first = focusable[0]; const last = focusable[focusable.length - 1];
                if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
                else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
            };
            modal.addEventListener('keydown', handleTab);
            return () => modal.removeEventListener('keydown', handleTab);
        }
    }, [showAlarmModal]);

    // ===== Multi-timer rAF =====
    const multiRafRef = useRef<number>(0);
    useEffect(() => {
        const hasRunning = multiTimers.some(t => t.isRunning);
        if (!hasRunning) { if (multiRafRef.current) cancelAnimationFrame(multiRafRef.current); return; }
        const tickMulti = () => {
            setMultiTimers(prev => prev.map(timer => {
                if (!timer.isRunning) return timer;
                const remaining = Math.max(0, Math.ceil((timer.endTime - Date.now()) / 1000));
                if (remaining === 0 && timer.timeLeft > 0) {
                    startAlarmLoop();
                    setAlarmSource('multi');
                    setShowAlarmModal(true);
                    if (vibrationOn && navigator.vibrate) navigator.vibrate([300, 100, 300]);
                    return { ...timer, timeLeft: 0, isRunning: false };
                }
                return { ...timer, timeLeft: remaining };
            }));
            multiRafRef.current = requestAnimationFrame(tickMulti);
        };
        multiRafRef.current = requestAnimationFrame(tickMulti);
        return () => { if (multiRafRef.current) cancelAnimationFrame(multiRafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multiTimers.map(t => t.isRunning).join(',')]);

    // ===== Handlers =====
    const handleStopAlarm = useCallback(() => { setShowAlarmModal(false); setAlarmSource(null); stopSound(); }, [stopSound]);

    const startTimer = useCallback((seconds: number, timerMode?: TimerMode) => {
        const m = timerMode ?? mode;
        updateMode(m, {
            duration: seconds, timeLeft: seconds, isSetting: false, isRunning: true,
            endTime: Date.now() + seconds * 1000,
        });
    }, [mode, updateMode]);

    const handlePreset = (seconds: number) => {
        const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60;
        setInputValues({ h, m, s }); startTimer(seconds);
    };

    const handleStart = () => {
        if (isSetting) {
            let totalSeconds: number;
            if (mode === 'pomodoro') { totalSeconds = pomoWork * 60; setPomoPhase('work'); setPomoSession(1); }
            else if (mode === 'interval') {
                totalSeconds = intervalWork;
                setIntervalPhase('work'); setIntervalCurrentRound(1);
            }
            else { totalSeconds = (inputValues.h * 3600) + (inputValues.m * 60) + inputValues.s; }
            if (totalSeconds === 0) return;
            startTimer(totalSeconds);
        } else {
            // Resume
            updateMode(mode, { isRunning: true, endTime: Date.now() + timeLeft * 1000 });
        }
    };

    const handleReset = useCallback(() => {
        updateMode(mode, { ...DEFAULT_MT });
        setInputValues({ h: 0, m: 0, s: 0 });
        if (showAlarmModal && alarmSource === mode) { setShowAlarmModal(false); setAlarmSource(null); stopSound(); }
        if (mode === 'pomodoro') { setPomoPhase('work'); setPomoSession(1); }
        if (mode === 'interval') { setIntervalPhase('work'); setIntervalCurrentRound(1); }
    }, [stopSound, mode, updateMode, showAlarmModal, alarmSource]);

    // Extend (+1m, +5m)
    const handleExtend = (extraSec: number) => {
        const mt = modeTimers[mode];
        updateMode(mode, {
            timeLeft: mt.timeLeft + extraSec,
            duration: mt.duration + extraSec,
            endTime: mt.isRunning ? mt.endTime + extraSec * 1000 : mt.endTime,
        });
    };

    // Pomodoro next phase
    const handlePomoNext = useCallback(() => {
        stopSound(); setShowAlarmModal(false); setAlarmSource(null);
        let nextDuration: number;
        if (pomoPhase === 'work') {
            if (pomoSession % POMO_DEFAULTS.sessionsBeforeLong === 0) { setPomoPhase('longBreak'); nextDuration = pomoLongBreak * 60; }
            else { setPomoPhase('break'); nextDuration = pomoBreak * 60; }
        } else { setPomoSession(prev => prev + 1); setPomoPhase('work'); nextDuration = pomoWork * 60; }
        startTimer(nextDuration, 'pomodoro');
        if (!pomoAutoStart) updateMode('pomodoro', { isRunning: false });
    }, [pomoPhase, pomoSession, pomoWork, pomoBreak, pomoLongBreak, pomoAutoStart, stopSound, startTimer, updateMode]);

    // Interval presets
    const applyIntervalPreset = (type: "tabata" | "hiit" | "custom") => {
        setIntervalPresetType(type);
        if (type === "tabata") { setIntervalWork(20); setIntervalRest(10); setIntervalRounds(8); }
        else if (type === "hiit") { setIntervalWork(40); setIntervalRest(20); setIntervalRounds(6); }
    };

    const getShareText = () => {
        const h = inputValues.h; const m = inputValues.m; const s = inputValues.s;
        const parts: string[] = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        if (s > 0) parts.push(`${s}s`);
        const timeStr = parts.length > 0 ? parts.join(' ') : '0s';
        const params = new URLSearchParams();
        if (h > 0) params.set('h', String(h));
        if (m > 0) params.set('m', String(m));
        if (s > 0) params.set('s', String(s));
        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}${typeof window !== 'undefined' ? window.location.pathname : ''}/timer?${params.toString()}`;
        return `⏱️ Timer: ${timeStr}\n━━━━━━━━━━━━━━\n${url}\n\n📍 clock-tani.com/ko/timer`;
    };

    // Share
    const handleShare = async () => {
        const params = new URLSearchParams();
        if (inputValues.h > 0) params.set('h', String(inputValues.h));
        if (inputValues.m > 0) params.set('m', String(inputValues.m));
        if (inputValues.s > 0) params.set('s', String(inputValues.s));
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        try { await navigator.clipboard.writeText(url); setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); } catch {}
    };

    // URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const h = parseInt(params.get('h') || '0'); const m = parseInt(params.get('m') || '0'); const s = parseInt(params.get('s') || '0');
        if (h > 0 || m > 0 || s > 0) setInputValues({ h, m, s });
    }, []);

    // Multi-timer handlers
    const addMultiTimer = () => {
        if (multiTimers.length >= 4) return;
        setMultiTimers(prev => [...prev, {
            id: Date.now().toString(36), label: `${t('multi.timer')} ${prev.length + 1}`,
            duration: 300, timeLeft: 300, isRunning: false, endTime: 0,
        }]);
    };
    const removeMultiTimer = (id: string) => setMultiTimers(prev => prev.filter(t => t.id !== id));
    const startMultiTimer = (id: string) => {
        setMultiTimers(prev => prev.map(timer => {
            if (timer.id !== id || timer.timeLeft === 0) return timer;
            return { ...timer, isRunning: true, endTime: Date.now() + timer.timeLeft * 1000 };
        }));
    };
    const stopMultiTimer = (id: string) => setMultiTimers(prev => prev.map(timer => timer.id === id ? { ...timer, isRunning: false } : timer));
    const resetMultiTimer = (id: string) => setMultiTimers(prev => prev.map(timer => timer.id === id ? { ...timer, timeLeft: timer.duration, isRunning: false } : timer));
    const setMultiDuration = (id: string, dur: number) => setMultiTimers(prev => prev.map(timer => timer.id === id && !timer.isRunning ? { ...timer, duration: dur, timeLeft: dur } : timer));

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (mode === 'multi') return;
            switch (e.code) {
                case 'Space': e.preventDefault(); if (showAlarmModal) return;
                    if (isSetting) handleStart();
                    else { if (isRunning) updateMode(mode, { isRunning: false }); else updateMode(mode, { isRunning: true, endTime: Date.now() + timeLeft * 1000 }); }
                    break;
                case 'KeyR': e.preventDefault(); handleReset(); break;
                case 'Escape': if (showAlarmModal) { e.preventDefault(); handleStopAlarm(); } break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRunning, isSetting, timeLeft, showAlarmModal, mode, handleReset, handleStopAlarm, updateMode]);

    // ===== Derived =====
    const progress = duration > 0 ? ((duration - timeLeft) / duration) : 0;
    const phaseColor = pomoPhase === 'work' ? '#ef4444' : pomoPhase === 'break' ? '#22c55e' : '#3b82f6';
    const phaseColorDark = pomoPhase === 'work' ? '#dc2626' : pomoPhase === 'break' ? '#16a34a' : '#2563eb';
    const ringColor = mode === 'pomodoro' ? phaseColor : mode === 'interval' ? (intervalPhase === 'work' ? '#f59e0b' : '#22c55e') : '#667eea';
    const isCountingDown = !isSetting && (isRunning || timeLeft > 0);
    const alarmMode = alarmSource ?? mode;

    // ===== RENDER =====
    return (
        <div className={styles.wrapper}>

            {/* Alarm Modal */}
            {showAlarmModal && (
                <div className={styles.alarmOverlay} role="alertdialog" aria-modal="true" aria-label={t('modal.title')} ref={alarmModalRef}>
                    <div className={styles.alarmModal}>
                        <div className={styles.alarmHeader} style={{
                            background: alarmMode === 'pomodoro' ? `linear-gradient(135deg, ${phaseColor}, ${phaseColorDark})`
                                : alarmMode === 'interval' ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}>
                            <span className={styles.alarmTitle}>
                                {alarmMode === 'pomodoro' ? (pomoPhase === 'work' ? t('pomodoro.workDone') : t('pomodoro.breakDone'))
                                    : alarmMode === 'interval' ? t('interval.completed') : t('modal.title')}
                            </span>
                            <button className={styles.alarmClose} onClick={handleStopAlarm} aria-label="close">&times;</button>
                        </div>
                        <div className={styles.alarmBody}>
                            <div className={styles.alarmIcon} style={{
                                background: alarmMode === 'pomodoro' ? `linear-gradient(135deg, ${phaseColor}, ${phaseColorDark})`
                                    : 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
                                boxShadow: `0 4px 15px rgba(238,90,90,0.4)`,
                            }}>
                                {pomoPhase !== 'work' && alarmMode === 'pomodoro'
                                    ? <FaCoffee style={{ fontSize: '30px', color: 'white' }} />
                                    : <FaHourglassStart style={{ fontSize: '30px', color: 'white' }} />}
                            </div>
                            {alarmMode === 'pomodoro' && <div className={styles.alarmSessionText}>{t('pomodoro.session')} {pomoSession} / {POMO_DEFAULTS.sessionsBeforeLong}</div>}
                            <div className={styles.autoStopText}>{alarmCountdown > 0 ? `${alarmCountdown}s` : ''}</div>
                        </div>
                        <div className={styles.alarmFooter}>
                            {alarmMode === 'pomodoro' && (
                                <button onClick={handlePomoNext} className={styles.alarmNextBtn} style={{
                                    background: `linear-gradient(135deg, ${phaseColor}, ${pomoPhase === 'work' ? '#16a34a' : '#ef4444'})`,
                                }}>
                                    <FaForward /> {pomoPhase === 'work' ? t('pomodoro.startBreak') : t('pomodoro.startWork')}
                                </button>
                            )}
                            <button onClick={handleStopAlarm} className={styles.alarmConfirmBtn} style={{
                                background: alarmMode === 'pomodoro' ? undefined : 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: alarmMode === 'pomodoro' ? undefined : 'white',
                            }}>{t('controls.confirm')}</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                {/* Mode Toggle */}
                {!fixedMode && <div className={styles.modeToggle} role="tablist">
                    {(['timer', 'pomodoro', 'interval', 'multi'] as TimerMode[]).map(m => (
                        <button key={m} role="tab" aria-selected={mode === m}
                            onClick={() => setMode(m)}
                            className={`${styles.modeBtn} ${mode === m ? styles.active : ''} ${mode === m ? (m === 'pomodoro' ? styles.pomoActive : m === 'interval' ? styles.timerActive : styles.timerActive) : ''}`}
                            style={mode === m && m === 'interval' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : undefined}>
                            {m === 'timer' ? t('mode.timer') : m === 'pomodoro' ? t('mode.pomodoro') : m === 'interval' ? t('interval.title') : t('multi.title')}
                            {/* 다른 탭에서 타이머 실행 중일 때 남은 시간 표시 */}
                            {m !== mode && modeTimers[m].isRunning && (
                                <span style={{ fontSize: '10px', marginLeft: '3px', opacity: 0.9 }}>({formatTime(modeTimers[m].timeLeft)})</span>
                            )}
                        </button>
                    ))}
                </div>}

                {/* ===== MULTI-TIMER MODE ===== */}
                {mode === 'multi' ? (
                    <div className={styles.mainCard}>
                        <div className={styles.multiContainer}>
                            {multiTimers.map(timer => (
                                <div key={timer.id} className={`${styles.multiCard} ${timer.isRunning ? styles.multiCardRunning : ''}`}>
                                    <div className={styles.multiHeader}>
                                        <span className={styles.multiLabel}>{timer.label}</span>
                                        <button onClick={() => removeMultiTimer(timer.id)} className={styles.multiRemoveBtn}>✕</button>
                                    </div>
                                    {!timer.isRunning && timer.timeLeft === timer.duration ? (
                                        <div className={styles.multiInputRow}>
                                            <input type="number" className={styles.multiInput} value={Math.floor(timer.duration / 3600)}
                                                onChange={e => { const h = Math.max(0, parseInt(e.target.value) || 0); setMultiDuration(timer.id, h * 3600 + Math.floor((timer.duration % 3600) / 60) * 60 + timer.duration % 60); }} />
                                            <span className={styles.multiSep}>:</span>
                                            <input type="number" className={styles.multiInput} value={Math.floor((timer.duration % 3600) / 60)}
                                                onChange={e => { const m = Math.min(59, Math.max(0, parseInt(e.target.value) || 0)); setMultiDuration(timer.id, Math.floor(timer.duration / 3600) * 3600 + m * 60 + timer.duration % 60); }} />
                                            <span className={styles.multiSep}>:</span>
                                            <input type="number" className={styles.multiInput} value={timer.duration % 60}
                                                onChange={e => { const s = Math.min(59, Math.max(0, parseInt(e.target.value) || 0)); setMultiDuration(timer.id, Math.floor(timer.duration / 3600) * 3600 + Math.floor((timer.duration % 3600) / 60) * 60 + s); }} />
                                        </div>
                                    ) : (
                                        <div className={styles.multiTimeDisplay} style={{ color: timer.timeLeft === 0 ? '#ef4444' : timer.isRunning ? '#22c55e' : '#667eea' }}>
                                            {formatTime(timer.timeLeft)}
                                        </div>
                                    )}
                                    <div className={styles.multiControls}>
                                        {!timer.isRunning && timer.timeLeft > 0 && <button onClick={() => startMultiTimer(timer.id)} className={`${styles.multiBtn} ${styles.multiBtnStart}`}><FaPlay style={{ fontSize: '0.7rem' }} /></button>}
                                        {timer.isRunning && <button onClick={() => stopMultiTimer(timer.id)} className={`${styles.multiBtn} ${styles.multiBtnStop}`}>{t('controls.stop')}</button>}
                                        <button onClick={() => resetMultiTimer(timer.id)} className={`${styles.multiBtn} ${styles.multiBtnReset}`}>{t('controls.reset')}</button>
                                    </div>
                                </div>
                            ))}
                            {multiTimers.length < 4 && (
                                <button onClick={addMultiTimer} className={styles.multiAddBtn}>+ {t('multi.add')}</button>
                            )}
                            {multiTimers.length >= 4 && <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>{t('multi.max')}</div>}
                        </div>
                    </div>
                ) : (
                    /* ===== SINGLE TIMER MODES (timer/pomodoro/interval) ===== */
                    <div className={styles.mainCard}>
                        {/* Pomodoro Phase */}
                        {mode === 'pomodoro' && !isSetting && (
                            <div className={styles.phaseIndicator}>
                                <div className={styles.phaseBadge} style={{ background: phaseColor + '22', color: phaseColor, border: `1.5px solid ${phaseColor}44` }}>
                                    {pomoPhase === 'work' ? `🔴 ${t('pomodoro.work')}` : pomoPhase === 'break' ? `🟢 ${t('pomodoro.break')}` : `🔵 ${t('pomodoro.longBreak')}`}
                                </div>
                                <div className={styles.sessionBadge}>{t('pomodoro.session')} {pomoSession}</div>
                            </div>
                        )}

                        {/* Interval Phase */}
                        {mode === 'interval' && !isSetting && (
                            <div className={styles.intervalPhaseDisplay}>
                                <div className={styles.intervalPhaseBadge} style={{
                                    background: (intervalPhase === 'work' ? '#f59e0b' : '#22c55e') + '22',
                                    color: intervalPhase === 'work' ? '#f59e0b' : '#22c55e',
                                    border: `1.5px solid ${(intervalPhase === 'work' ? '#f59e0b' : '#22c55e')}44`,
                                }}>
                                    {intervalPhase === 'work' ? `💪 ${t('interval.work')}` : `😮‍💨 ${t('interval.rest')}`}
                                </div>
                                <div className={styles.intervalRoundBadge}>{t('interval.currentRound')} {intervalCurrentRound}/{intervalRounds}</div>
                            </div>
                        )}

                        {/* Setting UI */}
                        {isSetting ? (
                            <>
                                {mode === 'timer' && (
                                    <>
                                        <div className={styles.presetContainer}>
                                            {PRESETS.map(p => (<button key={p.label} onClick={() => handlePreset(p.seconds)} className={styles.presetBtn}>{p.label}</button>))}
                                        </div>
                                        <div className={pickerStyles.timePickerRow}>
                                            <ScrollWheelPicker value={inputValues.h} onChange={v => setInputValues({ ...inputValues, h: v })} min={0} max={23} label={t('labels.hour')} />
                                            <span className={pickerStyles.timePickerSeparator}>:</span>
                                            <ScrollWheelPicker value={inputValues.m} onChange={v => setInputValues({ ...inputValues, m: v })} min={0} max={59} label={t('labels.minute')} />
                                            <span className={pickerStyles.timePickerSeparator}>:</span>
                                            <ScrollWheelPicker value={inputValues.s} onChange={v => setInputValues({ ...inputValues, s: v })} min={0} max={59} label={t('labels.second')} />
                                        </div>
                                    </>
                                )}
                                {mode === 'pomodoro' && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <div className={styles.pomoGrid}>
                                            {([
                                                { label: t('pomodoro.work'), value: pomoWork, setter: setPomoWork, color: '#ef4444', icon: '🔴' },
                                                { label: t('pomodoro.break'), value: pomoBreak, setter: setPomoBreak, color: '#22c55e', icon: '🟢' },
                                                { label: t('pomodoro.longBreak'), value: pomoLongBreak, setter: setPomoLongBreak, color: '#3b82f6', icon: '🔵' },
                                            ] as const).map(item => (
                                                <div key={item.label} className={styles.pomoCard}>
                                                    <div className={styles.pomoLabel}>{item.icon} {item.label}</div>
                                                    <div className={styles.pomoAdjustRow}>
                                                        <button onClick={() => item.setter(Math.max(1, item.value - 5))} className={styles.pomoAdjustBtn}>−</button>
                                                        <span className={styles.pomoValue} style={{ color: item.color }}>{item.value}</span>
                                                        <button onClick={() => item.setter(Math.min(90, item.value + 5))} className={styles.pomoAdjustBtn}>+</button>
                                                    </div>
                                                    <div className={styles.pomoUnit}>{t('labels.minute')}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <label className={styles.autoStartLabel}>
                                            <input type="checkbox" checked={pomoAutoStart} onChange={e => setPomoAutoStart(e.target.checked)} />
                                            {t('pomodoro.autoStart')}
                                        </label>
                                    </div>
                                )}
                                {mode === 'interval' && (
                                    <>
                                        <div className={styles.intervalPresets}>
                                            {(['tabata', 'hiit', 'custom'] as const).map(type => (
                                                <button key={type} onClick={() => applyIntervalPreset(type)}
                                                    className={`${styles.intervalPresetBtn} ${intervalPresetType === type ? styles.intervalPresetActive : ''}`}>
                                                    {t(`interval.${type}Preset`)}
                                                </button>
                                            ))}
                                        </div>
                                        <div className={styles.intervalGrid}>
                                            <div className={styles.intervalCard}>
                                                <div className={styles.intervalCardLabel}>💪 {t('interval.work')} (s)</div>
                                                <div className={styles.pomoAdjustRow}>
                                                    <button onClick={() => setIntervalWork(Math.max(5, intervalWork - 5))} className={styles.pomoAdjustBtn}>−</button>
                                                    <span className={styles.intervalCardValue} style={{ color: '#f59e0b' }}>{intervalWork}</span>
                                                    <button onClick={() => setIntervalWork(Math.min(300, intervalWork + 5))} className={styles.pomoAdjustBtn}>+</button>
                                                </div>
                                            </div>
                                            <div className={styles.intervalCard}>
                                                <div className={styles.intervalCardLabel}>😮‍💨 {t('interval.rest')} (s)</div>
                                                <div className={styles.pomoAdjustRow}>
                                                    <button onClick={() => setIntervalRest(Math.max(5, intervalRest - 5))} className={styles.pomoAdjustBtn}>−</button>
                                                    <span className={styles.intervalCardValue} style={{ color: '#22c55e' }}>{intervalRest}</span>
                                                    <button onClick={() => setIntervalRest(Math.min(120, intervalRest + 5))} className={styles.pomoAdjustBtn}>+</button>
                                                </div>
                                            </div>
                                            <div className={styles.intervalCard}>
                                                <div className={styles.intervalCardLabel}>🔄 {t('interval.rounds')}</div>
                                                <div className={styles.pomoAdjustRow}>
                                                    <button onClick={() => setIntervalRounds(Math.max(1, intervalRounds - 1))} className={styles.pomoAdjustBtn}>−</button>
                                                    <span className={styles.intervalCardValue} style={{ color: '#667eea' }}>{intervalRounds}</span>
                                                    <button onClick={() => setIntervalRounds(Math.min(20, intervalRounds + 1))} className={styles.pomoAdjustBtn}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                            </>
                        ) : (
                            /* Progress Ring */
                            <>
                                <div className={styles.ringContainer} role="timer" aria-live="polite" aria-label={formatTime(timeLeft)}>
                                    <svg viewBox="0 0 100 100" className={styles.ringSvg}>
                                        <circle cx="50" cy="50" r="45" className={styles.ringBg} />
                                        <circle cx="50" cy="50" r="45" className={styles.ringProgress} stroke={ringColor} strokeDasharray={`${progress * 283} 283`} />
                                    </svg>
                                    <div className={styles.ringTime} style={{ color: ringColor }}>{formatTime(timeLeft)}</div>
                                    {duration > 0 && duration !== timeLeft && (
                                        <div className={styles.ringDuration}>{formatTime(duration)}</div>
                                    )}
                                </div>
                                {/* Extend buttons */}
                                {isCountingDown && mode !== 'interval' && (
                                    <div className={styles.extendRow}>
                                        <button onClick={() => handleExtend(60)} className={styles.extendBtn}>{t('extend.plus1')}</button>
                                        <button onClick={() => handleExtend(300)} className={styles.extendBtn}>{t('extend.plus5')}</button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Control Buttons */}
                        <div className={styles.controlRow}>
                            {!isRunning && (
                                <button onClick={handleStart} className={styles.startBtn}
                                    style={mode === 'pomodoro' ? { background: `linear-gradient(135deg, ${phaseColor}, ${phaseColorDark})`, boxShadow: `0 4px 15px ${phaseColor}66` }
                                        : mode === 'interval' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 15px rgba(245,158,11,0.4)' } : undefined}
                                    aria-label={isSetting ? t('controls.start') : t('controls.continue')}>
                                    <FaPlay style={{ fontSize: '0.8rem' }} />
                                    {isSetting ? t('controls.start') : t('controls.continue')}
                                </button>
                            )}
                            {isRunning && <button onClick={() => updateMode(mode, { isRunning: false })} className={styles.stopBtn}>{t('controls.stop')}</button>}
                            <button onClick={handleReset} className={styles.resetBtn}>{t('controls.reset')}</button>
                        </div>
                    </div>
                )}

                {/* Feature buttons row */}
                <div className={styles.featureRow}>
                    {mode === 'timer' && (
                        <>
                            <button onClick={handleShare} className={`${styles.featureBtn} ${shareCopied ? styles.featureActive : ''}`}>
                                🔗 {shareCopied ? t('share.copied') : t('share.copy')}
                            </button>
                            <ShareButton shareText={getShareText()} />
                        </>
                    )}
                </div>

                {/* Keyboard shortcuts */}
                {mode !== 'multi' && (
                    <div className={styles.shortcutHint}>
                        <span><kbd className={styles.kbd}>Space</kbd> {t('controls.start')}/{t('controls.stop')}</span>
                        <span><kbd className={styles.kbd}>R</kbd> {t('controls.reset')}</span>
                        <span><kbd className={styles.kbd}>Esc</kbd> {t('modal.title')}</span>
                    </div>
                )}

                {/* Pomodoro Stats & Tasks */}
                {mode === 'pomodoro' && (
                    <>
                        <PomodoroTasks activeTaskId={activeTaskId} onSelectTask={setActiveTaskId} />
                        <PomodoroStats />
                    </>
                )}
            </div>

            {/* SEO Content Section - mode별 다른 콘텐츠 */}
            <TimerSeoSection mode={mode} />
        </div>
    );
}

// ===== TimerSeoSection =====
const featureKeys = ['f1', 'f2', 'f3', 'f4'] as const;
const howToStepKeys = ['step1', 'step2', 'step3', 'step4'] as const;
const useCaseKeys = ['u1', 'u2', 'u3', 'u4'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4'] as const;

function TimerSeoSection({ mode }: { mode: string }) {
    const t = useTranslations('Clock.Timer');
    const seoMode = mode === 'multi-timer' ? 'multi' : mode;

    return (
        <div className={styles.seoWrapper}>
            <article className={styles.seoArticle}>
                {/* 도구 설명 */}
                <section className={styles.seoSection}>
                    <h2 className={styles.seoTitle}>{t(`seo.${seoMode}.description.title`)}</h2>
                    <p className={styles.seoDesc}>{t(`seo.${seoMode}.description.p1`)}</p>
                </section>

                {/* 주요 기능 */}
                <section className={styles.seoSection}>
                    <h2 className={styles.seoTitle}>{t(`seo.${seoMode}.features.title`)}</h2>
                    <div className={styles.seoGrid}>
                        {featureKeys.map((key) => (
                            <div key={key} className={styles.seoCard}>
                                <h3 className={styles.seoCardTitle}>{t(`seo.${seoMode}.features.list.${key}.title`)}</h3>
                                <p className={styles.seoCardDesc}>{t(`seo.${seoMode}.features.list.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 사용 방법 */}
                <section className={styles.seoSection}>
                    <h2 className={styles.seoTitle}>{t(`seo.${seoMode}.howto.title`)}</h2>
                    <div className={styles.seoCard} style={{ padding: '20px 24px' }}>
                        {howToStepKeys.map((key) => (
                            <p key={key} className={styles.seoStep} dangerouslySetInnerHTML={{ __html: t.raw(`seo.${seoMode}.howto.steps.${key}`) }} />
                        ))}
                    </div>
                </section>

                {/* 활용 사례 */}
                <section className={styles.seoSection}>
                    <h2 className={styles.seoTitle}>{t(`seo.${seoMode}.usecases.title`)}</h2>
                    <div className={styles.seoGrid}>
                        {useCaseKeys.map((key) => (
                            <div key={key} className={styles.seoCard}>
                                <h3 className={styles.seoCardTitle}>{t(`seo.${seoMode}.usecases.list.${key}.title`)}</h3>
                                <p className={styles.seoCardDesc}>{t(`seo.${seoMode}.usecases.list.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className={styles.seoSection}>
                    <h2 className={styles.seoTitle}>{t(`seo.${seoMode}.faq.title`)}</h2>
                    <div className={styles.seoCard} style={{ padding: '24px' }}>
                        {faqKeys.map((key, index) => (
                            <details key={key} className={styles.seoFaqItem} style={{ borderBottom: index < faqKeys.length - 1 ? '1px solid var(--seo-border)' : 'none' }}>
                                <summary className={styles.seoFaqQ}>{t(`seo.${seoMode}.faq.list.${key}.q`)}</summary>
                                <p className={styles.seoFaqA}>{t(`seo.${seoMode}.faq.list.${key}.a`)}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* 개인정보 안내 */}
                <section className={styles.seoSection}>
                    <div className={styles.seoCard} style={{ padding: '20px 24px' }}>
                        <h2 className={styles.seoCardTitle} style={{ marginBottom: '8px' }}>{t('seo.privacy.title')}</h2>
                        <p className={styles.seoCardDesc}>{t('seo.privacy.text')}</p>
                    </div>
                </section>
            </article>
        </div>
    );
}


