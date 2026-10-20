import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

const EMPTY = "—";

type DateInput = string | number | Date | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(date) ? date : null;
}

// 1250 → ৳1,250 (backend এর payment BDT তে)
export function formatCurrency(amount: number | string | null | undefined) {
  if (amount === null || amount === undefined || amount === "") {
    return EMPTY;
  }
  const value = Number(amount);
  if (Number.isNaN(value)) {
    return EMPTY;
  }
  return `৳${value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return EMPTY;
  }
  return value.toLocaleString("en-US");
}

// 12 Oct 2026
export function formatDate(value: DateInput) {
  const date = toDate(value);
  return date ? format(date, "dd MMM yyyy") : EMPTY;
}

// 12 Oct 2026, 03:30 PM
export function formatDateTime(value: DateInput) {
  const date = toDate(value);
  return date ? format(date, "dd MMM yyyy, hh:mm a") : EMPTY;
}

// 03:30 PM
export function formatTime(value: DateInput) {
  const date = toDate(value);
  return date ? format(date, "hh:mm a") : EMPTY;
}

// 3 hours ago
export function formatRelativeTime(value: DateInput) {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : EMPTY;
}

// <input type="datetime-local"> এর value format
export function toDateTimeLocalValue(value: DateInput) {
  const date = toDate(value);
  return date ? format(date, "yyyy-MM-dd'T'HH:mm") : "";
}

// "TECHNICIAN_EN_ROUTE" → "Technician en route"
export function humanizeEnum(value: string | null | undefined) {
  if (!value) {
    return EMPTY;
  }
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// "Rahim Uddin" → "RU"
export function getInitials(name: string | null | undefined, max = 2) {
  if (!name) {
    return "?";
  }
  return name
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function truncate(text: string | null | undefined, length = 80) {
  if (!text) {
    return EMPTY;
  }
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
