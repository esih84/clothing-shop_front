"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "otp_session";
const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes

export type OtpSession = { phone: string; expiresAt: number };

function readSession(): OtpSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OtpSession;
    if (
      typeof parsed?.phone !== "string" ||
      typeof parsed?.expiresAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Tracks the OTP resend countdown. The expiry timestamp is persisted in
 * localStorage so the remaining time is derived from wall-clock time and stays
 * accurate across page refreshes (a refresh never resets the 2 minutes).
 */
export function useOtpTimer() {
  const [session, setSession] = useState<OtpSession | null>(null);
  const [remaining, setRemaining] = useState(0);

  // Restore any persisted session after mount (avoids a hydration mismatch).
  useEffect(() => {
    setSession(readSession());
  }, []);

  // Tick once per second and derive remaining seconds from the stored expiry.
  useEffect(() => {
    if (!session) {
      setRemaining(0);
      return;
    }
    const tick = () => {
      const ms = session.expiresAt - Date.now();
      setRemaining(ms > 0 ? Math.ceil(ms / 1000) : 0);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [session]);

  const start = useCallback((phone: string) => {
    const next: OtpSession = { phone, expiresAt: Date.now() + OTP_TTL_MS };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return { session, remaining, start, clear };
}
