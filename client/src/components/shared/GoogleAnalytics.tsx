"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "nextjs-google-analytics";
import Cookies from "js-cookie";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isProduction = process.env.NODE_ENV === "production";

const GoogleAnalyticsWrapper = () => {
  const pathname = usePathname(); // Used to track page visits

  useEffect(() => {
    const consent = Cookies.get("nextjs_gdpr_cookie");

    if (!GA_MEASUREMENT_ID) {
      console.warn("Google Analytics Measurement ID is not defined.");
      return;
    }

    if (!isProduction) {
      console.log(
        "Google Analytics is disabled in non-production environments.",
      );
      return;
    }

    if (consent !== "true") {
      console.log("User has not consented to cookies.");
      return;
    }

    // Function to send page view to GA
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag("config", GA_MEASUREMENT_ID, {
          anonymize_ip: true,
          page_path: url,
        });
      }
    };

    // Initial page load
    handleRouteChange(pathname);
  }, [pathname]);

  // Conditionally render GA scripts based on consent
  const consent = Cookies.get("nextjs_gdpr_cookie");

  if (!GA_MEASUREMENT_ID || !isProduction || consent !== "true") {
    return null;
  }

  return <GoogleAnalytics />;
};

export default GoogleAnalyticsWrapper;
