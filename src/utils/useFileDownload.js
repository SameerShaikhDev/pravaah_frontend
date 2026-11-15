import { useCallback, useState } from "react";
import { toast } from "sonner";
import { downloadBlob, preopenWindow } from "./downloadBlob";
import { getErrorMessage } from "./formatters";

/**
 * Wraps "fetch a blob -> save it" with loading state and error toast, so every download button
 * (certificates, resume export) shares one implementation.
 *
 *   const { run, busyKey } = useFileDownload();
 *   run(cert._id, () => certificateService.download(cert._id), "certificate.pdf");
 */
export function useFileDownload() {
  const [busyKey, setBusyKey] = useState(null);

  const run = useCallback(async (key, fetchBlob, filename) => {
    setBusyKey(key);
    const win = preopenWindow(); // must happen synchronously in the tap handler (iOS)
    try {
      downloadBlob(await fetchBlob(), filename, win);
    } catch (err) {
      win?.close();
      toast.error(getErrorMessage(err));
    } finally {
      setBusyKey(null);
    }
  }, []);

  return { run, busyKey };
}

export const certificateFilename = (cert) => `pravaah-certificate-${cert.sourceType}.pdf`;
