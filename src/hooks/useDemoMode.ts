export const DEMO_MODE_KEY = "acmesync_demo_mode";

export function isDemoModeActive(): boolean {
  if (typeof window === "undefined") return false;
  // Détection synchrone du param URL — aucun délai, aucun useEffect nécessaire
  if (new URLSearchParams(window.location.search).get("demo") === "true") {
    localStorage.setItem(DEMO_MODE_KEY, "true");
    return true;
  }
  return localStorage.getItem(DEMO_MODE_KEY) === "true";
}

export function enableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, "true");
}

export function disableDemoMode(): void {
  localStorage.removeItem(DEMO_MODE_KEY);
}
