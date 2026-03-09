"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SOUND_LIST, type SoundType, playMp3, stopAudio } from "./soundUtils";
import styles from "./soundPicker.module.css";

interface SoundPickerProps {
  sound: SoundType;
  onSoundChange: (sound: SoundType) => void;
  vibration: boolean;
  onVibrationChange: (v: boolean) => void;
  /** Translation function — expects keys: sound, sounds.{name}, preview, vibration, vibrationOn, vibrationOff */
  t: (key: string) => string;
  volume?: number; // 0-100, default 100
}

export default function SoundPicker({
  sound,
  onSoundChange,
  vibration,
  onVibrationChange,
  t,
  volume = 100,
}: SoundPickerProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [supportsVibration, setSupportsVibration] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSupportsVibration("vibrate" in navigator);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio(audioRef.current);
      audioRef.current = null;
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    };
  }, []);

  const stopPreview = useCallback(() => {
    stopAudio(audioRef.current);
    audioRef.current = null;
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    setIsPreviewing(false);
  }, []);

  const handlePreview = useCallback(() => {
    if (isPreviewing) {
      stopPreview();
      return;
    }
    setIsPreviewing(true);
    audioRef.current = playMp3(sound, volume / 100);
    previewTimeoutRef.current = setTimeout(() => {
      stopAudio(audioRef.current);
      audioRef.current = null;
      setIsPreviewing(false);
    }, 5000);
  }, [isPreviewing, sound, volume, stopPreview]);

  const handleSoundChange = useCallback(
    (newSound: SoundType) => {
      onSoundChange(newSound);
      if (isPreviewing) {
        stopPreview();
      }
    },
    [onSoundChange, isPreviewing, stopPreview]
  );

  return (
    <>
      {/* Sound Select + Preview */}
      <div className={styles.soundRow}>
        <select
          className={styles.soundSelect}
          value={sound}
          onChange={(e) => handleSoundChange(e.target.value as SoundType)}
        >
          {SOUND_LIST.map((s) => (
            <option key={s} value={s}>
              {t(`sounds.${s}`)}
            </option>
          ))}
        </select>
        <button
          className={`${styles.previewBtn} ${isPreviewing ? styles.previewBtnActive : ""}`}
          onClick={handlePreview}
          aria-label={t("preview")}
        >
          {isPreviewing ? "■" : "▶"}
        </button>
      </div>

      {/* Vibration Toggle - mobile only */}
      {supportsVibration && (
        <div className={styles.vibrationRow}>
          <button
            className={`${styles.vibrationToggle} ${vibration ? styles.vibrationToggleActive : ""}`}
            onClick={() => onVibrationChange(!vibration)}
            role="switch"
            aria-checked={vibration}
            aria-label={t("vibration")}
          >
            <span className={styles.vibrationKnob} />
          </button>
          <span className={styles.vibrationLabel}>
            {vibration ? t("vibrationOn") : t("vibrationOff")}
          </span>
        </div>
      )}
    </>
  );
}
