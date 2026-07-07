const STORAGE_KEY = 'vulnguard_scan_history';

export function loadScanHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveScanHistory(history) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Unable to save scan history', err);
  }
}

export function addScanResult(scan) {
  const history = loadScanHistory();
  const next = [{ ...scan, id: Date.now().toString() }, ...history];
  saveScanHistory(next);
  return next;
}

export function clearScanHistory() {
  window.localStorage.removeItem(STORAGE_KEY);
}
