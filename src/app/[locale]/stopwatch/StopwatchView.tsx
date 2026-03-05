"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useStopwatchSettings } from "@/contexts/StopwatchSettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FaVolumeUp, FaVolumeMute, FaMobileAlt } from "react-icons/fa";
import ShareButton from "@/components/ShareButton";

interface LapRecord {
    lapNumber: number;
    lapTime: number;      // 구간 시간 (이전 랩부터 현재까지)
    totalTime: number;    // 누적 시간
    timestamp: string;    // 저장 시점
}

const STORAGE_KEY = 'stopwatch_laps';

export default function StopwatchView() {
    const t = useTranslations('Clock.Stopwatch.controls');
    const { settings, toggleSound, toggleVibration, playLapSound, triggerVibration } = useStopwatchSettings();
    const { theme } = useTheme();
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<LapRecord[]>([]);
    const [confirmClear, setConfirmClear] = useState(false);
    const startTimeRef = useRef<number>(0);
    const requestRef = useRef<number>(0);
    const lastLapTimeRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const lapsRef = useRef<LapRecord[]>([]);

    // refs를 state와 동기화
    useEffect(() => { timeRef.current = time; }, [time]);
    useEffect(() => { lapsRef.current = laps; }, [laps]);

    // localStorage에서 랩 데이터 로드 + 마지막 시간 복원
    useEffect(() => {
        const savedLaps = localStorage.getItem(STORAGE_KEY);
        if (savedLaps) {
            try {
                const parsed: LapRecord[] = JSON.parse(savedLaps);
                setLaps(parsed);
                // 마지막 랩의 totalTime으로 시간 복원
                if (parsed.length > 0) {
                    const lastLap = parsed[parsed.length - 1];
                    setTime(lastLap.totalTime);
                    lastLapTimeRef.current = lastLap.totalTime;
                }
            } catch (e) {
                console.error('Failed to load laps from localStorage');
            }
        }
    }, []);

    // 랩 데이터가 변경될 때 localStorage에 저장
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (laps.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(laps));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [laps]);

    const update = useCallback(() => {
        setTime(Date.now() - startTimeRef.current);
        requestRef.current = requestAnimationFrame(update);
    }, []);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - time;
            requestRef.current = requestAnimationFrame(update);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isRunning, update]);

    const formatTime = (ms: number, forceHours: boolean = false) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);

        if (hours > 0 || forceHours) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
    };

    const formatMainTime = (ms: number) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);

        if (hours > 0) {
            return {
                main: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
                cs: `.${String(centiseconds).padStart(2, '0')}`,
                hasHours: true
            };
        }
        return {
            main: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
            cs: `.${String(centiseconds).padStart(2, '0')}`,
            hasHours: false
        };
    };

    const handleLap = useCallback(() => {
        const currentTime = timeRef.current;
        if (currentTime === 0) return;

        // 소리 + 진동 피드백
        playLapSound();
        triggerVibration();

        const lapTime = currentTime - lastLapTimeRef.current;

        const newLap: LapRecord = {
            lapNumber: lapsRef.current.length + 1,
            lapTime: lapTime,
            totalTime: currentTime,
            timestamp: new Date().toISOString()
        };

        setLaps(prev => [...prev, newLap]);
        lastLapTimeRef.current = currentTime;
    }, [playLapSound, triggerVibration]);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setTime(0);
        lastLapTimeRef.current = 0;
    }, []);

    const handleClearLaps = useCallback(() => {
        if (!confirmClear) {
            setConfirmClear(true);
            // 3초 후 자동으로 확인 상태 해제
            setTimeout(() => setConfirmClear(false), 3000);
            return;
        }
        setLaps([]);
        localStorage.removeItem(STORAGE_KEY);
        lastLapTimeRef.current = 0;
        setConfirmClear(false);
    }, [confirmClear]);

    const handleDeleteLap = (lapNumber: number) => {
        setLaps(prev => {
            const newLaps = prev.filter(lap => lap.lapNumber !== lapNumber);
            // 랩 번호 재정렬
            return newLaps.map((lap, idx) => ({ ...lap, lapNumber: idx + 1 }));
        });
    };

    const handleExportExcel = () => {
        if (laps.length === 0) return;

        // CSV 형식으로 생성 (Excel 호환)
        const headers = ['Lap #', 'Lap Time', 'Total Time', 'Timestamp'];
        const hasHours = laps.some(lap => lap.totalTime >= 3600000);
        const rows = laps.map(lap => [
            lap.lapNumber,
            formatTime(lap.lapTime, hasHours),
            formatTime(lap.totalTime, hasHours),
            `"${new Date(lap.timestamp).toLocaleString()}"`
        ]);

        // BOM 추가하여 한글 깨짐 방지
        const BOM = '\uFEFF';
        const csvContent = BOM + [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stopwatch_laps_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 공유 텍스트 생성
    const getShareText = () => {
        if (laps.length === 0) return '';

        const hasHours = laps.some(lap => lap.totalTime >= 3600000);

        const lapLines = laps.map((lap, idx) => {
            const isFastest = idx === fastestLapIndex && laps.length > 1;
            const isSlowest = idx === slowestLapIndex && laps.length > 1;
            const marker = isFastest ? ' ⚡' : isSlowest ? ' 🐢' : '';
            return `#${lap.lapNumber}: ${formatTime(lap.lapTime, hasHours)}${marker}`;
        }).join('\n');

        const statsText = laps.length > 1
            ? `\n${t('avgLapTime')}: ${formatTime(averageLapTime, hasHours)}\n${t('bestRecord')}: ${formatTime(bestLapTime, hasHours)}\n${t('worstRecord')}: ${formatTime(worstLapTime, hasHours)}`
            : '';

        return `🏃 ${t('lapList')} (${laps.length})\n━━━━━━━━━━━━━━\n${lapLines}${statsText}\n\n📍 clock-tani.com/stopwatch`;
    };

    // 키보드 단축키 핸들러
    const handleToggle = useCallback(() => {
        setIsRunning(prev => !prev);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 입력 필드에서는 단축키 무시
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    handleToggle();
                    break;
                case 'KeyL':
                    e.preventDefault();
                    handleLap();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    handleReset();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleToggle, handleLap, handleReset]);

    // 가장 빠른/느린 랩 찾기
    const fastestLapIndex = laps.length > 1
        ? laps.reduce((minIdx, lap, idx) => lap.lapTime < laps[minIdx].lapTime ? idx : minIdx, 0)
        : -1;
    const slowestLapIndex = laps.length > 1
        ? laps.reduce((maxIdx, lap, idx) => lap.lapTime > laps[maxIdx].lapTime ? idx : maxIdx, 0)
        : -1;

    // 1시간 이상인 기록이 있으면 모든 시간에 시간 형식 적용
    const hasHoursInLaps = laps.some(lap => lap.totalTime >= 3600000) || time >= 3600000;

    // 통계 계산
    const averageLapTime = laps.length > 0
        ? laps.reduce((sum, lap) => sum + lap.lapTime, 0) / laps.length
        : 0;
    const bestLapTime = laps.length > 0 && fastestLapIndex >= 0
        ? laps[fastestLapIndex].lapTime
        : 0;
    const worstLapTime = laps.length > 0 && slowestLapIndex >= 0
        ? laps[slowestLapIndex].lapTime
        : 0;

    const timeDisplay = formatMainTime(time);

    return (
        <div className="sw-view-container" role="region" aria-label={t('start')}>
            {/* 시간 표시 */}
            <div
                className={`sw-time-display ${timeDisplay.hasHours ? 'sw-time-has-hours' : ''}`}
                role="timer"
                aria-live="off"
                aria-atomic="true"
                aria-label={formatTime(time)}
                style={{ color: theme === 'dark' ? '#67e8f9' : '#0891b2' }}
            >
                <span className={`sw-time-main ${timeDisplay.hasHours ? 'sw-time-main-hours' : ''}`}>
                    {timeDisplay.main}
                </span>
                <span className={`sw-time-cs ${timeDisplay.hasHours ? 'sw-time-cs-hours' : ''}`}>
                    {timeDisplay.cs}
                </span>
                {isRunning && <span className="sw-running-dot" aria-hidden="true" />}
            </div>

            {/* 스톱워치 전용 설정 */}
            <div className="sw-settings" role="group" aria-label={t('lapSound')}>
                <button
                    className={`sw-setting-btn ${settings.soundEnabled ? 'active' : ''}`}
                    onClick={toggleSound}
                    aria-label={`${t('lapSound')}: ${settings.soundEnabled ? 'ON' : 'OFF'}`}
                    aria-pressed={settings.soundEnabled}
                >
                    {settings.soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                    <span>{t('lapSound')}</span>
                </button>
                <button
                    className={`sw-setting-btn ${settings.vibrationEnabled ? 'active' : ''}`}
                    onClick={toggleVibration}
                    aria-label={`${t('vibration')}: ${settings.vibrationEnabled ? 'ON' : 'OFF'}`}
                    aria-pressed={settings.vibrationEnabled}
                >
                    <FaMobileAlt />
                    <span>{t('vibration')}</span>
                </button>
            </div>

            {/* 단축키 안내 */}
            <div className="sw-shortcuts" aria-label={t('shortcutStartStop')}>
                <span><kbd className="sw-kbd">Space</kbd> {t('shortcutStartStop')}</span>
                <span><kbd className="sw-kbd">L</kbd> {t('shortcutLap')}</span>
                <span><kbd className="sw-kbd">R</kbd> {t('shortcutReset')}</span>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="sw-controls" role="group" aria-label="Controls">
                {/* 초기 상태: 시작 버튼만 */}
                {time === 0 && !isRunning && (
                    <button
                        onClick={() => setIsRunning(true)}
                        className="sw-btn sw-btn-start sw-btn-start-large"
                        aria-label={t('start')}
                    >
                        {t('start')}
                    </button>
                )}

                {/* 실행 중: 일시정지 + 랩 */}
                {isRunning && (
                    <>
                        <button
                            onClick={() => setIsRunning(false)}
                            className="sw-btn sw-btn-pause"
                            aria-label={t('pause')}
                        >
                            {t('pause')}
                        </button>
                        <button
                            onClick={handleLap}
                            className="sw-btn sw-btn-lap"
                            aria-label={t('lap')}
                        >
                            {t('lap')}
                        </button>
                    </>
                )}

                {/* 일시정지 상태: 계속 + 초기화 */}
                {!isRunning && time > 0 && (
                    <>
                        <button
                            onClick={() => setIsRunning(true)}
                            className="sw-btn sw-btn-start"
                            aria-label={t('continue')}
                        >
                            {t('continue')}
                        </button>
                        <button
                            onClick={handleReset}
                            className="sw-btn sw-btn-reset"
                            aria-label={t('reset')}
                        >
                            {t('reset')}
                        </button>
                    </>
                )}
            </div>

            {/* 랩 리스트 */}
            {laps.length > 0 && (
                <div className="sw-lap-container" role="region" aria-label={t('lapList')}>
                    {/* 랩 리스트 헤더 */}
                    <div className="sw-lap-header">
                        <span className="sw-lap-header-text">
                            {t('lapList')} ({laps.length})
                        </span>
                    </div>

                    {/* 랩 리스트 테이블 */}
                    <div className="sw-lap-table" role="list">
                        {[...laps].reverse().map((lap, idx) => {
                            const originalIndex = laps.length - 1 - idx;
                            const isFastest = originalIndex === fastestLapIndex && laps.length > 1;
                            const isSlowest = originalIndex === slowestLapIndex && laps.length > 1;

                            return (
                                <div
                                    key={lap.lapNumber}
                                    className={`sw-lap-row ${isFastest ? 'sw-lap-fastest' : ''} ${isSlowest ? 'sw-lap-slowest' : ''}`}
                                    role="listitem"
                                    style={{
                                        borderBottom: idx < laps.length - 1 ? undefined : 'none',
                                    }}
                                >
                                    <span className={`sw-lap-number ${isFastest ? 'sw-lap-fastest-text' : ''} ${isSlowest ? 'sw-lap-slowest-text' : ''}`}>
                                        #{lap.lapNumber}
                                    </span>
                                    <span className={`sw-lap-time ${isFastest ? 'sw-lap-fastest-text' : ''} ${isSlowest ? 'sw-lap-slowest-text' : ''}`}>
                                        {formatTime(lap.lapTime, hasHoursInLaps)}
                                    </span>
                                    <span className="sw-lap-total" style={{ minWidth: hasHoursInLaps ? '90px' : '65px' }}>
                                        {formatTime(lap.totalTime, hasHoursInLaps)}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteLap(lap.lapNumber)}
                                        className="sw-lap-delete"
                                        aria-label={`${t('clearLaps')} #${lap.lapNumber}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* 버튼들 */}
                    <div className="sw-lap-actions">
                        <button onClick={handleExportExcel} className="sw-btn-export" aria-label={t('exportExcel')}>
                            {t('exportExcel')}
                        </button>
                        <button
                            onClick={handleClearLaps}
                            className={`sw-btn-clear ${confirmClear ? 'sw-btn-clear-confirm' : ''}`}
                            aria-label={confirmClear ? t('clearLaps') + ' - confirm' : t('clearLaps')}
                        >
                            {confirmClear ? `${t('clearLaps')}?` : t('clearLaps')}
                        </button>
                    </div>

                    {/* 공유 버튼 */}
                    <ShareButton
                        shareText={getShareText()}
                        shareTitle={t('lapList')}
                        buttonLabel={t('share')}
                        copiedLabel={t('copied')}
                        disabled={laps.length === 0}
                    />

                    {/* 통계 섹션 - 랩 2개 이상일 때 표시 */}
                    {laps.length > 1 && (
                        <div className="sw-stats-container" role="region" aria-label={t('avgLapTime')}>
                            <div className="sw-stats-row">
                                <span className="sw-stats-label">{t('avgLapTime')}</span>
                                <span className="sw-stats-value">{formatTime(averageLapTime, hasHoursInLaps)}</span>
                            </div>
                            <div className="sw-stats-row sw-stats-best">
                                <span className="sw-stats-label">{t('bestRecord')}</span>
                                <span className="sw-stats-value">{formatTime(bestLapTime, hasHoursInLaps)}</span>
                            </div>
                            <div className="sw-stats-row sw-stats-worst">
                                <span className="sw-stats-label">{t('worstRecord')}</span>
                                <span className="sw-stats-value">{formatTime(worstLapTime, hasHoursInLaps)}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
