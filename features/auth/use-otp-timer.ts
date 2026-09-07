"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "otp_session";
const OTP_TTL_MS = 2 * 60 * 1000; // resend cooldown
/**
 * How long the sent code itself stays usable (mirrors the backend's
 * otpExpiryMinutes, now 2). It currently equals the resend cooldown — the two
 * stay separate constants because they answer different questions.
 */
const OTP_VALID_MS = 2 * 60 * 1000;

export type OtpSession = { phone: string; startedAt: number; expiresAt: number };

function readSession(): OtpSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OtpSession>;
    if (
      typeof parsed?.phone !== "string" ||
      typeof parsed?.expiresAt !== "number"
    ) {
      return null;
    }
    // Sessions written before `startedAt` existed: derive it from the cooldown.
    const startedAt =
      typeof parsed.startedAt === "number"
        ? parsed.startedAt
        : parsed.expiresAt - OTP_TTL_MS;
    // A code that can no longer be verified must not keep the login page on the
    // code step — drop the session so the phone step is shown instead.
    if (Date.now() - startedAt > OTP_VALID_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { phone: parsed.phone, startedAt, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}

/**
 * Tracks the OTP resend countdown. The expiry timestamp is persisted in
 * localStorage so the remaining time is derived from wall-clock time and stays
 * accurate across page refreshes (a refresh never resets the 2 minutes).
 *
 * `ready` reports that the persisted session has been read. Callers that decide
 * what to render from the session must wait for it, otherwise the first paint
 * shows the wrong step.
 */
export function useOtpTimer() {
  const [session, setSession] = useState<OtpSession | null>(null);
  const [ready, setReady] = useState(false);
  const [remaining, setRemaining] = useState(0);

  // Restore any persisted session after mount (avoids a hydration mismatch).
  useEffect(() => {
    setSession(readSession());
    setReady(true);
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
    const now = Date.now();
    const next: OtpSession = {
      phone,
      startedAt: now,
      expiresAt: now + OTP_TTL_MS,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return { session, ready, remaining, start, clear };
}
