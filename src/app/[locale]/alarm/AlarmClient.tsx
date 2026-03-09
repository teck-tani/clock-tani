"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import styles from "./alarm.module.css";
import ScrollWheelPicker from "./ScrollWheelPicker";
import pickerStyles from "./scrollWheelPicker.module.css";
import { SOUND_LIST, type SoundType, playMp3, stopAudio } from "@/components/soundUtils";
import SoundPicker from "@/components/SoundPicker";

// ===== Types =====
interface Alarm {
  id: string;
  hour: number;
  minute: number;
  label: string;
  sound: SoundType;
  vibration: boolean;
  enabled: boolean;
}

const PRESETS = [10, 30, 60, 120]; // minutes
const MAX_ALARMS = 10;
const STORAGE_KEY = "alarm_list";
const SNOOZE_MINUTES = 5;

// ===== Component =====
export default function AlarmClient() {
  const t = useTranslations("Alarm");
  const locale = useLocale();

  // Current time - initialize with null to avoid hydration mismatch
  const [now, setNow] = useState<Date | null>(null);

  // Form state
  const [inputHour, setInputHour] = useState(7);
  const [inputMinute, setInputMinute] = useState(0);
  const [inputLabel, setInputLabel] = useState("");
  const [inputSound, setInputSound] = useState<SoundType>("soft-bells");
  const [inputVibration, setInputVibration] = useState(true);

  // Remaining time text for the time picker
  const remainingTimeText = useMemo(() => {
    if (!now) return "";
    const alarmDate = new Date(now);
    alarmDate.setHours(inputHour, inputMinute, 0, 0);
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    const diffMs = alarmDate.getTime() - now.getTime();
    const totalMin = Math.floor(diffMs / 60000);
    if (totalMin < 1) {
      return locale === "ko" ? "1분 이내 울림" : "Rings in less than 1m";
    }
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (locale === "ko") {
      if (h > 0 && m > 0) return `${h}시간 ${m}분 후 울림`;
      if (h > 0) return `${h}시간 후 울림`;
      return `${m}분 후 울림`;
    } else {
      if (h > 0 && m > 0) return `Rings in ${h}h ${m}m`;
      if (h > 0) return `Rings in ${h}h`;
      return `Rings in ${m}m`;
    }
  }, [now, inputHour, inputMinute, locale]);

  // Alarms
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Notification
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  // Modal focus trap ref
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vibrationLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedAlarmsRef = useRef<Set<string>>(new Set());
  const titleFlashRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const originalFaviconRef = useRef<string>("");

  // Load alarms from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = (JSON.parse(saved) as Alarm[]).map((a) => ({
          ...a,
          vibration: a.vibration ?? true,
        }));
        setAlarms(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);

    if (typeof Notification !== "undefined") {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Save alarms to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    }
  }, [alarms, hydrated]);

  // Time tick - start after mount
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Check alarms every second
  useEffect(() => {
    if (!hydrated || ringingAlarmId || !now) return;

    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const currentS = now.getSeconds();

    // 해당 분(HH:MM) 안에 있을 때만 체크 (0~59초 어디서든 감지)
    for (const alarm of alarms) {
      if (!alarm.enabled || alarm.hour !== currentH || alarm.minute !== currentM) continue;

      const firedKey = `${alarm.id}_${currentH}_${currentM}`;
      if (firedAlarmsRef.current.has(firedKey)) continue;

      firedAlarmsRef.current.add(firedKey);
      triggerAlarm(alarm.id);
      break;
    }

    // 분이 바뀌면 이전 fired 기록 정리
    if (currentS === 0) {
      const currentKey = `_${currentH}_${currentM}`;
      firedAlarmsRef.current.forEach((key) => {
        if (!key.endsWith(currentKey)) {
          firedAlarmsRef.current.delete(key);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, hydrated, ringingAlarmId]);

  // Tab title update with flashing when ringing
  useEffect(() => {
    if (!now) return;

    if (ringingAlarmId) {
      const alarm = alarms.find((a) => a.id === ringingAlarmId);
      const label = alarm?.label || t("alarmRinging");
      const timeStr = alarm
        ? `${String(alarm.hour).padStart(2, "0")}:${String(alarm.minute).padStart(2, "0")}`
        : "";
      let toggle = false;

      // Set initial title
      document.title = `🔔 ${t("alarmRinging")}`;

      // Flash title every 500ms
      titleFlashRef.current = setInterval(() => {
        toggle = !toggle;
        document.title = toggle
          ? `🔔 ${t("alarmRinging")}`
          : `⏰ ${timeStr} - ${label}`;
      }, 500);

      return () => {
        if (titleFlashRef.current) {
          clearInterval(titleFlashRef.current);
          titleFlashRef.current = null;
        }
      };
    }

    const activeAlarms = alarms.filter((a) => a.enabled);
    if (activeAlarms.length > 0) {
      const nearest = getNearestAlarm(activeAlarms, now);
      if (nearest) {
        const remaining = getRemainingMs(nearest, now);
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        const timeStr = h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
        document.title = `⏰ ${timeStr} - ${t("title")}`;
        return;
      }
    }

    document.title = t("meta.title");
  }, [now, alarms, ringingAlarmId, t]);

  // Stop audio playback
  const stopAudioOnly = useCallback(() => {
    stopAudio(audioRef.current);
    audioRef.current = null;
  }, []);

  // Play alarm sound (MP3)
  const playSoundFn = useCallback((sound: SoundType) => {
    stopAudioOnly();
    audioRef.current = playMp3(sound);
  }, [stopAudioOnly]);

  // Stop all sound + alarm loop + vibration (for dismiss/snooze/cleanup)
  const stopCurrentSound = useCallback(() => {
    stopAudioOnly();
    if (alarmLoopRef.current) {
      clearInterval(alarmLoopRef.current);
      alarmLoopRef.current = null;
    }
    if (vibrationLoopRef.current) {
      clearInterval(vibrationLoopRef.current);
      vibrationLoopRef.current = null;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  }, [stopAudioOnly]);

  // Favicon helpers
  const setAlarmFavicon = useCallback(() => {
    // Save original favicon
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) originalFaviconRef.current = link.href;

    // Create alarm favicon with canvas
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Red circle background
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    // Bell icon (white)
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔔", 16, 16);

    const dataUrl = canvas.toDataURL("image/png");
    if (link) {
      link.href = dataUrl;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = dataUrl;
      document.head.appendChild(newLink);
    }
  }, []);

  const restoreFavicon = useCallback(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link && originalFaviconRef.current) {
      link.href = originalFaviconRef.current;
    }
  }, []);

  const triggerAlarm = useCallback(
    (alarmId: string) => {
      const alarm = alarms.find((a) => a.id === alarmId);
      if (!alarm) return;

      setRingingAlarmId(alarmId);

      // Play sound in loop
      playSoundFn(alarm.sound);
      alarmLoopRef.current = setInterval(() => {
        playSoundFn(alarm.sound);
      }, 4000);

      // Vibrate (repeating pattern on mobile)
      if (alarm.vibration && navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]);
        vibrationLoopRef.current = setInterval(() => {
          navigator.vibrate([500, 200, 500, 200, 500]);
        }, 3000);
      }

      // Change favicon to alarm icon
      setAlarmFavicon();

      // Browser notification
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        const label = alarm.label || t("alarmRinging");
        new Notification(t("title"), {
          body: `${String(alarm.hour).padStart(2, "0")}:${String(alarm.minute).padStart(2, "0")} - ${label}`,
          icon: "/icon.svg",
        });
      }
    },
    [alarms, playSoundFn, setAlarmFavicon, t]
  );

  const dismissAlarm = useCallback(() => {
    stopCurrentSound();
    restoreFavicon();
    if (ringingAlarmId) {
      setAlarms((prev) => prev.map((a) => (a.id === ringingAlarmId ? { ...a, enabled: false } : a)));
    }
    setRingingAlarmId(null);
    window.scrollTo(0, 0);
  }, [ringingAlarmId, stopCurrentSound, restoreFavicon]);

  const snoozeAlarm = useCallback(() => {
    stopCurrentSound();
    restoreFavicon();
    if (ringingAlarmId) {
      const snoozeTime = new Date(Date.now() + SNOOZE_MINUTES * 60000);
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === ringingAlarmId
            ? { ...a, hour: snoozeTime.getHours(), minute: snoozeTime.getMinutes(), enabled: true }
            : a
        )
      );
    }
    setRingingAlarmId(null);
    window.scrollTo(0, 0);
  }, [ringingAlarmId, stopCurrentSound, restoreFavicon]);

  // Add alarm
  const addAlarm = useCallback(() => {
    if (alarms.length >= MAX_ALARMS) return;

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      hour: inputHour,
      minute: inputMinute,
      label: inputLabel.trim(),
      sound: inputSound,
      vibration: inputVibration,
      enabled: true,
    };

    setAlarms((prev) => [...prev, newAlarm]);
    setInputLabel("");
  }, [alarms.length, inputHour, inputMinute, inputLabel, inputSound, inputVibration]);

  // Quick preset
  const addPreset = useCallback(
    (minutes: number) => {
      if (alarms.length >= MAX_ALARMS) return;

      const target = new Date(Date.now() + minutes * 60000);
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        hour: target.getHours(),
        minute: target.getMinutes(),
        label: minutes >= 60 ? t("hoursLater", { hour: minutes / 60 }) : t("minutesLater", { min: minutes }),
        sound: inputSound,
        vibration: inputVibration,
        enabled: true,
      };

      setAlarms((prev) => [...prev, newAlarm]);
    },
    [alarms.length, inputSound, inputVibration, t]
  );

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const requestNotification = useCallback(() => {
    if (typeof Notification !== "undefined") {
      Notification.requestPermission().then((perm) => setNotifPermission(perm));
    }
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (ringingAlarmId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [ringingAlarmId]);

  // Modal focus trap
  useEffect(() => {
    if (!ringingAlarmId || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableEls = modal.querySelectorAll<HTMLElement>("button");
    if (focusableEls.length > 0) focusableEls[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusableEls.length === 0) return;
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleKeyDown);
    return () => modal.removeEventListener("keydown", handleKeyDown);
  }, [ringingAlarmId]);

  // Screen Wake Lock - prevent screen from turning off when alarms are active
  useEffect(() => {
    const hasActiveAlarm = alarms.some((a) => a.enabled);
    if (!hasActiveAlarm || !("wakeLock" in navigator)) return;

    let cancelled = false;

    const requestWakeLock = async () => {
      try {
        const newLock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          newLock.release();
          return;
        }
        wakeLockRef.current = newLock;
      } catch {
        // Wake lock request failed (e.g., low battery)
      }
    };

    requestWakeLock();

    // Re-acquire wake lock when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [alarms]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentSound();
    };
  }, [stopCurrentSound]);

  // Format helpers
  const formatTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatDate = (d: Date, locale: string) => {
    return d.toLocaleDateString(locale === "en" ? "en-US" : "ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatAlarmTime = (h: number, m: number) => {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const ringingAlarm = ringingAlarmId ? alarms.find((a) => a.id === ringingAlarmId) : null;
  const displayNow = now || new Date();

  if (!hydrated || !now) {
    return (
      <div className={styles.container}>
        <div className={styles.timeSection}>
          <div className={styles.timeDisplay}>--:--:--</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Current Time */}
      <div className={styles.timeSection}>
        <div className={styles.timeLabel}>{t("currentTime")}</div>
        <div className={styles.timeDisplay}>{formatTime(displayNow)}</div>
        <div className={styles.dateDisplay}>{formatDate(displayNow, locale)}</div>
      </div>

      {/* Notification Permission Banner */}
      {notifPermission === "default" && (
        <div className={styles.notificationBanner}>
          <span className={styles.notificationText}>{t("notificationPermission")}</span>
          <button className={styles.notificationBtn} onClick={requestNotification}>
            {t("allowNotification")}
          </button>
        </div>
      )}

      {/* Quick Presets */}
      <div className={styles.presetsSection}>
        <div className={styles.presetsTitle}>{t("quickPresets")}</div>
        <div className={styles.presetsGrid}>
          {PRESETS.map((min) => (
            <button key={min} className={styles.presetBtn} onClick={() => addPreset(min)} disabled={alarms.length >= MAX_ALARMS}>
              {min >= 60 ? t("hourLater", { hour: min / 60 }) : t("minutesLater", { min })}
            </button>
          ))}
        </div>
      </div>

      {/* Set Alarm Form */}
      <div className={styles.setAlarmSection}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>⏰</span>
          {t("setAlarm")}
        </div>

        <div className={styles.timeInputGroup}>
          <div className={pickerStyles.timePickerRow}>
            <ScrollWheelPicker
              value={inputHour}
              onChange={setInputHour}
              min={0}
              max={23}
              label={t("hour")}
            />
            <span className={pickerStyles.timePickerSeparator}>:</span>
            <ScrollWheelPicker
              value={inputMinute}
              onChange={setInputMinute}
              min={0}
              max={59}
              label={t("minute")}
            />
          </div>
          {remainingTimeText && (
            <div className={pickerStyles.remainingTime}>
              <span className={pickerStyles.remainingIcon}>🔔</span>
              {remainingTimeText}
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <span className={styles.inputLabel}>{t("label")}</span>
            <input
              type="text"
              className={styles.labelInput}
              placeholder={t("labelPlaceholder")}
              value={inputLabel}
              onChange={(e) => setInputLabel(e.target.value)}
              maxLength={30}
            />
          </div>
        </div>

        {/* Sound Selector + Vibration Toggle */}
        <div className={styles.formRow}>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <span className={styles.inputLabel}>{t("sound")}</span>
            <SoundPicker
              sound={inputSound}
              onSoundChange={setInputSound}
              vibration={inputVibration}
              onVibrationChange={setInputVibration}
              t={(key: string) => t(key)}
            />
          </div>
        </div>

        {alarms.length >= MAX_ALARMS ? (
          <div className={styles.maxWarning}>{t("maxAlarms")}</div>
        ) : (
          <button className={styles.addAlarmBtn} onClick={addAlarm}>
            + {t("addAlarm")}
          </button>
        )}
      </div>

      {/* Alarm List */}
      <div className={styles.alarmsSection}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🔔</span>
          {t("myAlarms")} ({alarms.length})
        </div>

        {alarms.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔕</div>
            <div className={styles.emptyText}>{t("noAlarms")}</div>
            <div className={styles.emptyDesc}>{t("noAlarmsDesc")}</div>
          </div>
        ) : (
          <div className={styles.alarmList}>
            {alarms.map((alarm) => {
              const remaining = getRemainingMs(alarm, displayNow);
              const isTomorrow = isAlarmTomorrow(alarm, displayNow);

              return (
                <div
                  key={alarm.id}
                  className={`${styles.alarmItem} ${alarm.enabled ? styles.alarmItemActive : ""} ${
                    ringingAlarmId === alarm.id ? styles.alarmItemRinging : ""
                  }`}
                >
                  <div className={styles.alarmTime}>{formatAlarmTime(alarm.hour, alarm.minute)}</div>
                  <div className={styles.alarmInfo}>
                    {alarm.label && <div className={styles.alarmLabel}>{alarm.label}</div>}
                    {alarm.enabled && (
                      <>
                        <div className={styles.alarmRemaining}>{formatRemaining(remaining, t)}</div>
                        {isTomorrow && <div className={styles.alarmTomorrow}>{t("tomorrow")}</div>}
                      </>
                    )}
                  </div>
                  <div className={styles.alarmActions}>
                    <button
                      className={`${styles.toggleBtn} ${alarm.enabled ? styles.toggleBtnActive : ""}`}
                      onClick={() => toggleAlarm(alarm.id)}
                      title={alarm.enabled ? t("enabled") : t("disabled")}
                      role="switch"
                      aria-checked={alarm.enabled}
                      aria-label={`${formatAlarmTime(alarm.hour, alarm.minute)} ${alarm.enabled ? t("enabled") : t("disabled")}`}
                    >
                      <span className={styles.toggleKnob} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => deleteAlarm(alarm.id)} title={t("delete")}>
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alarm Ringing Modal */}
      {ringingAlarm && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={t("alarmRinging")} ref={modalRef}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>🔔</div>
            <div className={styles.modalTime}>{formatAlarmTime(ringingAlarm.hour, ringingAlarm.minute)}</div>
            {ringingAlarm.label && <div className={styles.modalLabel}>{ringingAlarm.label}</div>}
            <div className={styles.modalMessage}>{t("alarmRinging")}</div>
            <div className={styles.modalActions}>
              <button className={styles.dismissBtn} onClick={dismissAlarm}>
                {t("dismiss")}
              </button>
              <button className={styles.snoozeBtn} onClick={snoozeAlarm}>
                {t("snooze")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Utility Functions =====
function getRemainingMs(alarm: Alarm, now: Date): number {
  const target = new Date(now);
  target.setHours(alarm.hour, alarm.minute, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}

function isAlarmTomorrow(alarm: Alarm, now: Date): boolean {
  const target = new Date(now);
  target.setHours(alarm.hour, alarm.minute, 0, 0);
  return target.getTime() <= now.getTime();
}

function getNearestAlarm(alarms: Alarm[], now: Date): Alarm | null {
  let nearest: Alarm | null = null;
  let minRemaining = Infinity;

  for (const alarm of alarms) {
    if (!alarm.enabled) continue;
    const remaining = getRemainingMs(alarm, now);
    if (remaining < minRemaining) {
      minRemaining = remaining;
      nearest = alarm;
    }
  }

  return nearest;
}

function formatRemaining(ms: number, t: ReturnType<typeof useTranslations>): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (totalMinutes < 1) return t("remainingLessThan");
  if (hours === 0) return t("remainingMinutes", { minutes });
  return t("remainingTime", { hours, minutes });
}
