"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./timer.module.css";

type AmbientType = "rain" | "cafe" | "whiteNoise" | "fire" | "ocean" | "forest";

const AMBIENT_ICONS: Record<AmbientType, string> = {
    rain: "🌧️", cafe: "☕", whiteNoise: "📻", fire: "🔥", ocean: "🌊", forest: "🌲",
};
const AMBIENT_TYPES: AmbientType[] = ["rain", "cafe", "whiteNoise", "fire", "ocean", "forest"];
const AMBIENT_STORAGE_KEY = "ambient_settings";

const AMBIENT_FILES: Record<AmbientType, string> = {
    rain: "/sounds/ambient/rain.mp3",
    cafe: "/sounds/ambient/cafe.mp3",
    whiteNoise: "/sounds/ambient/white-noise.mp3",
    fire: "/sounds/ambient/fire.mp3",
    ocean: "/sounds/ambient/ocean.mp3",
    forest: "/sounds/ambient/forest.mp3",
};

export default function AmbientPlayer({ mode }: { mode: string }) {
    const t = useTranslations("Clock.Timer.ambient");
    const [active, setActive] = useState<AmbientType | null>(null);
    const [volume, setVolume] = useState(() => {
        try { const s = localStorage.getItem(AMBIENT_STORAGE_KEY); if (s) return JSON.parse(s).volume ?? 30; } catch {} return 30;
    });
    const [savedType, setSavedType] = useState<AmbientType | null>(() => {
        try { const s = localStorage.getItem(AMBIENT_STORAGE_KEY); if (s) return JSON.parse(s).type ?? null; } catch {} return null;
    });
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setActive(null);
    }, []);

    const play = useCallback((type: AmbientType) => {
        stop();
        setLoading(true);

        const audio = new Audio(AMBIENT_FILES[type]);
        audio.loop = true;
        audio.volume = volume / 100;
        audio.preload = "auto";

        audio.addEventListener("canplaythrough", () => {
            setLoading(false);
            audio.play().catch(() => setLoading(false));
        }, { once: true });

        audio.addEventListener("error", () => {
            setLoading(false);
        }, { once: true });

        audioRef.current = audio;
        setActive(type);
    }, [stop, volume]);

    const toggle = useCallback((type: AmbientType) => {
        if (active === type) {
            stop();
            setSavedType(null);
            try { localStorage.setItem(AMBIENT_STORAGE_KEY, JSON.stringify({ volume, type: null })); } catch {}
        } else {
            play(type);
            setSavedType(type);
            try { localStorage.setItem(AMBIENT_STORAGE_KEY, JSON.stringify({ volume, type })); } catch {}
        }
    }, [active, stop, play, volume]);

    // 볼륨 변경 시 반영 + 저장
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume / 100;
        try { localStorage.setItem(AMBIENT_STORAGE_KEY, JSON.stringify({ volume, type: active })); } catch {}
    }, [volume, active]);

    // 탭(모드) 전환 시 배경음 정지
    const prevModeRef = useRef(mode);
    useEffect(() => {
        if (prevModeRef.current !== mode) {
            stop();
            prevModeRef.current = mode;
        }
    }, [mode, stop]);

    // 언마운트 시 정리
    useEffect(() => { return () => { stop(); }; }, [stop]);

    return (
        <div className={styles.ambientCard}>
            <div className={styles.ambientTitle}>{t("title")}</div>
            <div className={styles.ambientGrid}>
                {AMBIENT_TYPES.map(type => (
                    <button key={type} onClick={() => toggle(type)}
                        className={`${styles.ambientBtn} ${active === type ? styles.ambientActive : ""}`}
                        disabled={loading && active !== type}>
                        <span className={styles.ambientIcon}>{AMBIENT_ICONS[type]}</span>
                        <span className={styles.ambientLabel}>
                            {loading && active === type ? "..." : t(type)}
                        </span>
                    </button>
                ))}
            </div>
            {active && (
                <div className={styles.ambientVolume}>
                    <input type="range" min={0} max={100} value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        className={styles.volumeSlider} />
                    <span className={styles.volumeValue}>{volume}%</span>
                </div>
            )}
        </div>
    );
}
