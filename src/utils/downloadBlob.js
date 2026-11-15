/**
 * Saves an already-fetched blob as a file. Works on desktop and on mobile browsers.
 *
 * Mobile notes:
 *  - The <a> must be attached to the DOM before click(), or Firefox/Android ignore it.
 *  - The object URL must outlive the click (revoked after a delay).
 *  - iOS Safari ignores `download` for blobs. We open the PDF in a NEW tab so the app tab stays
 *    alive (navigating the app tab itself to the blob left the dashboard unusable after "back").
 *    Callers should call `preopenWindow()` synchronously inside the tap handler (before awaiting
 *    the fetch) so the popup blocker allows it; pass the result as `win`.
 */
export const isIOS = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export function preopenWindow() {
  if (!isIOS()) return null;
  try {
    const w = window.open("", "_blank");
    if (w) w.document.title = "Loading…";
    return w;
  } catch {
    return null;
  }
}

export function downloadBlob(blob, filename, win = null) {
  const url = window.URL.createObjectURL(blob);
  const revokeLater = () => setTimeout(() => window.URL.revokeObjectURL(url), 120_000);

  if (isIOS()) {
    if (win && !win.closed) win.location.href = url;
    else window.open(url, "_blank") || window.location.assign(url);
    revokeLater();
    return;
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  revokeLater();
}
