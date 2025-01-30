"use client";

import React from "react";
import CookieConsent from "react-cookie-consent";
import Cookies from "js-cookie";

const CookieConsentBanner = () => {
  const handleAccept = () => {
    Cookies.set("nextjs_gdpr_cookie", "true", { expires: 365 });
    console.log("User accepted cookies.");
  };

  const handleDecline = () => {
    Cookies.set("nextjs_gdpr_cookie", "false", { expires: 365 });
    console.log("User declined cookies.");
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="nextjs_gdpr_cookie"
      style={cookieConsentStyle}
      buttonStyle={buttonStyle}
      declineButtonStyle={declineButtonStyle}
      expires={365}
    >
      We use cookies to improve your experience. By continuing to visit this
      site you agree to our use of cookies.
    </CookieConsent>
  );
};

import { CSSProperties } from "react";

const cookieConsentStyle: CSSProperties = {
  background: "#2B373B",
  padding: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
};

const buttonStyle = {
  color: "#4e503b",
  fontSize: "13px",
  marginRight: "0.5rem",
  borderRadius: "4px",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
};

const declineButtonStyle = {
  color: "#ffffff",
  background: "#d33a3a",
  fontSize: "13px",
  borderRadius: "4px",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
};

export default CookieConsentBanner;
