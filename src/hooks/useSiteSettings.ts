"use client";

import { useEffect, useState } from "react";

export interface SiteSettingsData {
  contactEmail: string;
  phoneNumber: string;
  whatsAppNumber: string;
  defaultMoq: string;
  productionLeadTime: string;
}

const defaultSiteSettings: SiteSettingsData = {
  contactEmail: "vidhyashankar@cutnstitchapparel.com",
  phoneNumber: "+91 99 444 66 3 11",
  whatsAppNumber: "+91 99444 66311",
  defaultMoq: "100 Pieces",
  productionLeadTime: "8-10 business days",
};

export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(defaultSiteSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/site-settings");
        if (!response.ok) return;

        const data = await response.json();
        setSiteSettings((prev) => ({
          contactEmail: typeof data.contactEmail === "string" ? data.contactEmail : prev.contactEmail,
          phoneNumber: typeof data.phoneNumber === "string" ? data.phoneNumber : prev.phoneNumber,
          whatsAppNumber: typeof data.whatsAppNumber === "string" ? data.whatsAppNumber : prev.whatsAppNumber,
          defaultMoq: typeof data.defaultMoq === "string" ? data.defaultMoq : prev.defaultMoq,
          productionLeadTime: typeof data.productionLeadTime === "string" ? data.productionLeadTime : prev.productionLeadTime,
        }));
      } catch {
        // Keep defaults when loading fails
      }
    };

    loadSettings();
  }, []);

  return siteSettings;
}
