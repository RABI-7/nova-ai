import type { Conversation } from "./types";

const CONV_KEY = "nova.conversations.v1";
const ACTIVE_KEY = "nova.activeId.v1";
const SETTINGS_KEY = "nova.settings.v1";

export interface NovaSettings {
  model: string;
  temperature: number;
  sounds: boolean;
}

export const defaultSettings: NovaSettings = {
  model: "nova-pro",
  temperature: 0.7,
  sounds: false,
};

const isBrowser = () => typeof window !== "undefined";

export function loadConversations(): Conversation[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(CONV_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Conversation[]) : null;
  } catch {
    return null;
  }
}

export function saveConversations(c: Conversation[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CONV_KEY, JSON.stringify(c));
  } catch {}
}

export function loadActiveId(): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveId(id: string) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {}
}

export function loadSettings(): NovaSettings {
  if (!isBrowser()) return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(s: NovaSettings) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}
