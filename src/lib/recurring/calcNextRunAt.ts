import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  lastDayOfMonth,
  setDate,
  setDay,
} from "date-fns";

type Frequency = "daily" | "weekly" | "monthly" | "yearly";

/**
 * Calculate the nextRunAt date for a recurring expense.
 * - daily: every N days
 * - weekly: every N weeks, optionally aligned to a specific dayOfWeek (0-6)
 * - monthly: every N months, aligned to dayOfMonth (1-31) with safe clamping
 * - yearly: every N years
 */
export function calcNextRunAt(params: {
  from: Date; // base date (usually current nextRunAt or startDate)
  frequency: Frequency;
  interval: number;
  dayOfWeek?: number | null; // weekly: 0=Sun..6=Sat
  dayOfMonth?: number | null; // monthly: 1..31
}): Date {
  const { from, frequency, interval, dayOfWeek, dayOfMonth } = params;

  if (!interval || interval < 1) {
    throw new Error("interval must be >= 1");
  }

  if (frequency === "daily") {
    return addDays(from, interval);
  }

  if (frequency === "weekly") {
    // Move forward by N weeks first
    const base = addWeeks(from, interval);

    // If dayOfWeek not provided, keep same weekday as 'from'
    if (dayOfWeek === null || dayOfWeek === undefined) return base;

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error("dayOfWeek must be between 0 and 6");
    }

    // Align to specific day in that week (weekStartsOn: 0 => Sunday)
    return setDay(base, dayOfWeek, { weekStartsOn: 0 });
  }

  if (frequency === "monthly") {
    const base = addMonths(from, interval);

    // If no dayOfMonth provided, keep same day number behavior
    if (!dayOfMonth) return base;

    if (dayOfMonth < 1 || dayOfMonth > 31) {
      throw new Error("dayOfMonth must be between 1 and 31");
    }

    // Clamp to last valid day of that month (handles Feb, 30-day months)
    const last = lastDayOfMonth(base).getDate();
    const safeDay = Math.min(dayOfMonth, last);

    return setDate(base, safeDay);
  }

  // yearly
  return addYears(from, interval);
}
