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
