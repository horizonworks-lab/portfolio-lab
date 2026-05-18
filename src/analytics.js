export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  if ( typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params);
}

export function trackChartUpdate() {
  trackEvent("chart_update");
}

export function trackCopyLink(buttonVariant) {
  trackEvent("copy_link", {
    button_variant: buttonVariant,
  });
}
