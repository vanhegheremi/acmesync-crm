export const DEMO_MODE_KEY = "acmesync_demo_mode";

export function isDemoModeActive(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_MODE_KEY) === "true";
}

export function enableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, "true");
}

export function disableDemoMode(): void {
  localStorage.removeItem(DEMO_MODE_KEY);
}
