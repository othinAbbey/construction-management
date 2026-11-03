// Calendar-date helpers. Dates are "YYYY-MM-DD" strings, always handled in UTC so timezones never shift a day.
const DAY = 86400000;
const ms = (d) => Date.parse(`${d}T00:00:00Z`);
export const addDays = (d, n) => new Date(ms(d) + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (a, b) => Math.round((ms(b) - ms(a)) / DAY);
export const todayIso = () => new Date().toISOString().slice(0, 10);
export const dayOfWeek = (d) => new Date(ms(d)).getUTCDay();
export const shortDate = (d) => (d ? new Date(ms(d)).toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }) : "");
export const monthLabel = (d) => new Date(ms(d)).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
