export function localToUtc(date: string, includeTime: boolean = false) {
    if (!date || typeof date !== "string") return null;

    const parts = date.trim().split("-");
    if (parts.length !== 3) return null;

    let day, month, year;

    if (parts[0].length === 4) {
        [year, month, day] = parts;
    } else {
        [day, month, year] = parts;
    }

    if (!day || !month || !year) return null;

    let hours = 0,
        minutes = 0,
        seconds = 0,
        ms = 0;

    if (includeTime) {
        const now = new Date();

        hours = now.getUTCHours();
        minutes = now.getUTCMinutes();
        seconds = now.getUTCSeconds();
        ms = now.getUTCMilliseconds();
    }

    let newDateObj = new Date(
        Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            hours,
            minutes,
            seconds,
            ms,
        ),
    );

    return isNaN(newDateObj.getTime()) ? null : newDateObj.toISOString();
}
export const UTCToLocal = (dateStr: string): string => {
    if (!dateStr) return "";

    // 1. Parse the ISO string into a native JavaScript Date object
    const date = new Date(dateStr);

    // Check if the date is valid to prevent crashes
    if (isNaN(date.getTime())) return "";

    // 2. Format the date to the user's local timezone using the browser's language setting
    return new Intl.DateTimeFormat(navigator.language || "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date); // Output: "27 Aug 2026" (or adapted based on user location rules)
};

// utils/dateHelpers.ts

/**
 * Converts a UTC ISO date string directly to YYYY-MM-DD format 
 * so HTML date inputs can read and display it correctly.
 */
export const FormatUtcToInputDate = (utcString: string | undefined | null): string => {
    if (!utcString) return "";

    // Create a date object from the server's string
    const date = new Date(utcString);

    // Guard against invalid date string parsing
    if (isNaN(date.getTime())) return "";

    // Extract year, month, and day safely
    const year = date.getFullYear();

    // Pad with leading zeros so month and day are always 2 digits (e.g., '06')
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Returns exact "YYYY-MM-DD" format required by HTML forms
    return `${year}-${month}-${day}`;
};
