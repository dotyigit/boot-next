import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isToday(parsedDate)) {
    return "Today";
  } else if (isYesterday(parsedDate)) {
    return "Yesterday";
  } else {
    return format(parsedDate, "MMM d, yyyy");
  }
}

export function formatDateTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - parsedDate.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } else if (diffInMinutes < 24 * 60) {
    return format(parsedDate, "h:mm a");
  } else if (isToday(parsedDate)) {
    return `Today at ${format(parsedDate, "h:mm a")}`;
  } else if (isYesterday(parsedDate)) {
    return `Yesterday at ${format(parsedDate, "h:mm a")}`;
  } else {
    return format(parsedDate, "MMM d, yyyy 'at' h:mm a");
  }
}
