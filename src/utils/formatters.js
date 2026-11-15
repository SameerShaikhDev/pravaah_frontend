export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function formatSecondsToClock(seconds = 0) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export function scoreTone(score = 0) {
  if (score >= 75) return "teal";
  if (score >= 50) return "amber";
  return "coral";
}

export function verdictLabel(verdict) {
  const map = {
    strong_hire: "Strong hire",
    hire: "Hire",
    borderline: "Borderline",
    no_hire: "No hire",
  };
  return map[verdict] || verdict;
}

export function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getErrorMessage(error) {
  if (typeof Blob !== "undefined" && error?.response?.data instanceof Blob) {
    return "Download failed. Please try again.";
  }
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}
