import type { Setup } from './vehicle';
const KEY = 'dz-drive-setup-v1';
export function loadSetup(fallback: Setup): Setup {
  try { const raw = localStorage.getItem(KEY); return raw ? { ...fallback, ...JSON.parse(raw) } : fallback; }
  catch { return fallback; }
}
export function saveSetup(setup: Setup) { try { localStorage.setItem(KEY, JSON.stringify(setup)); } catch { /* storage may be unavailable */ } }
