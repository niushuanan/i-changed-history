import { useCallback, useEffect, useRef, useState } from "react";
import type { TapRecord, TapChannelMessage } from "../types";

const CHANNEL_NAME = "llm-tap-v1";
const STORAGE_KEY = "llm-tap-history";
const MAX_STORED_RECORDS = 200;

function isTapMessage(data: unknown): data is TapChannelMessage {
  if (typeof data !== "object" || data === null) return false;
  const msg = data as Record<string, unknown>;
  return msg.type === "request" || msg.type === "sync-request" || msg.type === "sync-reply" || msg.type === "clear";
}

function loadPersisted(): TapRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TapRecord[];
  } catch {
    return [];
  }
}

function savePersisted(records: TapRecord[]) {
  try {
    const trimmed = records.slice(-MAX_STORED_RECORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — silently ignore.
  }
}

export function useTapChannel(initialGoLatest = true) {
  const [records, setRecords] = useState<TapRecord[]>(loadPersisted);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const recordsRef = useRef<TapRecord[]>([]);

  // Keep ref in sync with state
  recordsRef.current = records;

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, records.length - 1));
  }, [records.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, [records.length]);

  const goLatest = useCallback(() => {
    setCurrentIndex(Math.max(0, records.length - 1));
  }, [records.length]);

  const clear = useCallback(() => {
    setRecords([]);
    setCurrentIndex(-1);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    channelRef.current?.postMessage({ type: "clear" } satisfies TapChannelMessage);
  }, []);

  const exportJson = useCallback(() => {
    const trunc = (s: string, maxLen = 2000): string =>
      s.length <= maxLen ? s
        : s.slice(0, 800) + `\n\n...(中略，共 ${s.length} 字符)...\n\n` + s.slice(-600);

    // Deep-truncate long strings in the exported records
    function truncateStrings(obj: unknown): unknown {
      if (typeof obj === "string") return trunc(obj);
      if (Array.isArray(obj)) return obj.map(truncateStrings);
      if (obj && typeof obj === "object") {
        const result: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          result[k] = truncateStrings(v);
        }
        return result;
      }
      return obj;
    }

    const data = JSON.stringify(truncateStrings(recordsRef.current), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `llm-tap-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<unknown>) => {
      if (!isTapMessage(event.data)) return;

      if (event.data.type === "request") {
        const record = event.data.payload;
        const updated = [...recordsRef.current, record];
        recordsRef.current = updated;
        setRecords(updated);
        savePersisted(updated);
        if (initialGoLatest) {
          setCurrentIndex(updated.length - 1);
        }
      } else if (event.data.type === "sync-request") {
        channel.postMessage({
          type: "sync-reply",
          payload: recordsRef.current,
        } satisfies TapChannelMessage);
      } else if (event.data.type === "clear") {
        recordsRef.current = [];
        setRecords([]);
        setCurrentIndex(-1);
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      } else if (event.data.type === "sync-reply") {
        const incoming = event.data.payload;
        if (incoming.length > recordsRef.current.length) {
          recordsRef.current = incoming;
          setRecords(incoming);
          savePersisted(incoming);
          if (initialGoLatest) {
            setCurrentIndex(incoming.length - 1);
          }
        }
      }
    };

    // Request sync from any game tabs that already have history
    channel.postMessage({ type: "sync-request" } satisfies TapChannelMessage);

    return () => channel.close();
  }, [initialGoLatest]);

  return { records, currentIndex, goNext, goPrev, goLatest, clear, exportJson } as const;
}
