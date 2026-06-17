"use client";

export type AnalyticsPayload = Record<string, string | number | boolean | null>;

export type AnalyticsEvent = {
  eventName: string;
  payload?: AnalyticsPayload;
  path: string;
  createdAt: string;
};

const STORAGE_KEY = "zen_analytics_events";
const MAX_LOCAL_EVENTS = 500;

function readLocalEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((event): event is AnalyticsEvent => (
      typeof event === "object" &&
      event !== null &&
      typeof event.eventName === "string" &&
      typeof event.path === "string" &&
      typeof event.createdAt === "string"
    ));
  } catch {
    return [];
  }
}

function writeLocalEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  try {
    const events = [event, ...readLocalEvents()].slice(0, MAX_LOCAL_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Local analytics are best-effort only.
  }
}

async function insertSupabaseEvent(event: AnalyticsEvent) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return;

  try {
    await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        event_name: event.eventName,
        path: event.path,
        payload: event.payload ?? {},
        created_at: event.createdAt
      })
    });
  } catch (error) {
    console.info("[ZEN analytics] Supabase insert skipped", error);
  }
}

export function trackEvent(eventName: string, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  const event: AnalyticsEvent = {
    eventName,
    payload,
    path: window.location.pathname,
    createdAt: new Date().toISOString()
  };

  console.log("[ZEN analytics]", event);
  writeLocalEvent(event);
  void insertSupabaseEvent(event);
}

export function getStoredAnalyticsEvents() {
  return readLocalEvents();
}

export function clearStoredAnalyticsEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
