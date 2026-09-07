"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/shared/config/site-settings";

/**
 * Carries the settings fetched once in the root layout down to the client
 * components that need them (the cart and wishlist pages, the header), so they
 * do not each fire their own request.
 */
const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
