// Shared sound constants and utilities for alarm & timer

export const SOUND_LIST = [
  "soft-bells",
  "arpeggio",
  "good-morning",
  "solemn",
  "cheerful",
  "little-dwarf",
  "discreet",
  "lovingly",
  "rooster",
  "early-sunrise",
  "swinging",
  "system-fault",
  "martian-gun",
  "loving-you",
  "sisfus",
] as const;

export type SoundType = (typeof SOUND_LIST)[number];

const OLD_SOUND_TYPES = ["classic", "digital", "gentle", "bird", "school"];

/** Migrate old SoundType values to new ones */
export function migrateSoundType(value: string): SoundType {
  if (OLD_SOUND_TYPES.includes(value)) return "soft-bells";
  if (SOUND_LIST.includes(value as SoundType)) return value as SoundType;
  return "soft-bells";
}

/** Play an MP3 from /sounds/ and return the Audio element */
export function playMp3(sound: SoundType, volume = 1): HTMLAudioElement {
  const audio = new Audio(`/sounds/${sound}.mp3`);
  audio.volume = Math.max(0, Math.min(1, volume));
  audio.play().catch(() => {});
  return audio;
}

/** Stop and clean up an Audio element */
export function stopAudio(audio: HTMLAudioElement | null): void {
  if (!audio) return;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
}
