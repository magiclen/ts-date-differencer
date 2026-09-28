import { getDaysInMonth } from "year-helper";

import {
    DAY_MILLISECONDS,
    HOUR_MILLISECONDS,
    MINUTE_MILLISECONDS,
    SECOND_MILLISECONDS,
} from "./constants.ts";
import type { TimeZoneOptions } from "./date-time-fields.ts";
import { getDateTimeFields, isUTC } from "./date-time-fields.ts";
import { negate, toDate, toTimestamp } from "./functions.ts";

/** The time part of a difference. */
export interface TimeDiffResult {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

/** The result of the `dateDiff` function. */
export interface DateDiffResult {
    years: number;
    months: number;
    days: number;
}

/** The day part of a difference. */
export interface DayDiffResult {
    days: number;
}

/** The result of the `dateTimeDiff` function. */
export interface DateTimeDiffResult extends DateDiffResult, TimeDiffResult {}

/** The result of the `dayTimeDiff` function. */
export interface DayTimeDiffResult extends DayDiffResult, TimeDiffResult {}

/** The wall-clock date and time of a `Date`. */
interface WallClock {
    year: number;
    /** From `1` to `12`. */
    month: number;
    day: number;
    millisecondsOfDay: number;
}

const getWallClock = (date: Date, utc: boolean): WallClock => {
    const { year, month, day, hour, minute, second, millisecond } = getDateTimeFields(date, utc);

    return {
        year,
        month,
        day,
        millisecondsOfDay:
            hour * HOUR_MILLISECONDS +
            minute * MINUTE_MILLISECONDS +
            second * SECOND_MILLISECONDS +
            millisecond,
    };
};

// Compare the fields in the order of year, month, day and time of day, like the derived `Ord` of `WallClock` in the Rust version.
const compareWallClock = (a: WallClock, b: WallClock): number => {
    if (a.year !== b.year) {
        return a.year - b.year;
    }

    if (a.month !== b.month) {
        return a.month - b.month;
    }

    if (a.day !== b.day) {
        return a.day - b.day;
    }

    return a.millisecondsOfDay - b.millisecondsOfDay;
};

const negateDateDiff = (diff: DateDiffResult): DateDiffResult => ({
    years: negate(diff.years),
    months: negate(diff.months),
    days: negate(diff.days),
});

const negateTimeDiff = (diff: TimeDiffResult): TimeDiffResult => ({
    hours: negate(diff.hours),
    minutes: negate(diff.minutes),
    seconds: negate(diff.seconds),
    milliseconds: negate(diff.milliseconds),
});

const millisecondsToUnits = (milliseconds: number): TimeDiffResult => {
    const hours = Math.floor(milliseconds / HOUR_MILLISECONDS);
    milliseconds -= hours * HOUR_MILLISECONDS;

    const minutes = Math.floor(milliseconds / MINUTE_MILLISECONDS);
    milliseconds -= minutes * MINUTE_MILLISECONDS;

    const seconds = Math.floor(milliseconds / SECOND_MILLISECONDS);
    milliseconds -= seconds * SECOND_MILLISECONDS;

    return {
        hours,
        minutes,
        seconds,
        milliseconds,
    };
};

const calculateTimeDiff = (
    earlierMillisecondsOfDay: number,
    laterMillisecondsOfDay: number,
): TimeDiffResult =>
    millisecondsToUnits(
        laterMillisecondsOfDay >= earlierMillisecondsOfDay
            ? laterMillisecondsOfDay - earlierMillisecondsOfDay
            : DAY_MILLISECONDS + laterMillisecondsOfDay - earlierMillisecondsOfDay,
    );

// `earlier` must be earlier than `later`. The date moves from `earlier` to `later`, or from `later` back to `earlier` if `startFromLater` is `true`.
const calculateDateDiff = (
    earlier: WallClock,
    later: WallClock,
    startFromLater: boolean,
): DateDiffResult => {
    let earlierYear = earlier.year;
    let earlierMonth = earlier.month;
    let earlierDate = earlier.day;

    let laterYear = later.year;
    let laterMonth = later.month;
    let laterDate = later.day;

    const laterMillisecondsOfDay = later.millisecondsOfDay;
    const earlierMillisecondsOfDay = earlier.millisecondsOfDay;

    let years;
    let months;
    let days;

    if (laterMillisecondsOfDay < earlierMillisecondsOfDay) {
        // e.g. 12:00 to 11:59

        if (startFromLater) {
            // increase a day from the earlier date

            if (earlierDate < getDaysInMonth(earlierYear, earlierMonth)) {
                // e.g. 2020-01-12 12:00 to 2022-02-15 11:59

                earlierDate += 1;
            } else if (earlierMonth < 12) {
                // e.g. 2020-01-31 12:00 to 2022-02-15 11:59

                earlierMonth += 1;
                earlierDate = 1;
            } else {
                // e.g. 2020-12-31 12:00 to 2022-02-15 11:59

                earlierYear += 1;
                earlierMonth = 1;
                earlierDate = 1;
            }
        } else {
            // decrease a day from the later date

            if (laterDate > 1) {
                // e.g. 2020-01-12 12:00 to 2022-02-15 11:59

                laterDate -= 1;
            } else if (laterMonth > 1) {
                // e.g. 2020-01-12 12:00 to 2022-02-01 11:59

                laterMonth -= 1;
                laterDate = getDaysInMonth(laterYear, laterMonth);
            } else {
                // e.g. 2020-01-12 12:00 to 2022-01-01 11:59

                laterYear -= 1;
                laterMonth = 12;
                laterDate = 31;
            }
        }
    }

    const yearDiff = laterYear - earlierYear;
    const monthDiff = laterMonth - earlierMonth;

    if (monthDiff > 0) {
        // e.g. 2010-01 to 2010-03

        years = yearDiff;

        if (laterDate >= earlierDate) {
            // e.g. 2010-01-02 to 2010-03-04

            months = monthDiff;
        } else {
            // e.g. 2010-01-02 to 2010-03-01

            months = monthDiff - 1;
        }
    } else if (monthDiff < 0) {
        // e.g. 2009-11 to 2010-03

        years = yearDiff - 1;

        if (laterDate >= earlierDate) {
            // e.g. 2009-11-02 to 2010-03-04

            months = monthDiff + 12;
        } else {
            // e.g. 2009-11-04 to 2010-03-02

            months = monthDiff + 11;
        }
    } else {
        // monthDiff === 0, e.g. 2009-12 to 2010-12

        if (laterDate >= earlierDate) {
            // e.g. 2009-12-02 to 2010-12-04

            years = yearDiff;
            months = 0;
        } else {
            // e.g. 2009-12-04 to 2010-12-02

            years = yearDiff - 1;
            months = 11;
        }
    }

    if (laterDate >= earlierDate) {
        // e.g. 2010-01-02 to 2010-03-04, 2009-11-02 to 2010-03-04, 2009-12-02 to 2010-12-04

        if (startFromLater) {
            days = Math.min(laterDate, getDaysInMonth(earlierYear, earlierMonth)) - earlierDate;
        } else {
            days = laterDate - earlierDate;
        }
    } else {
        // e.g. 2010-01-02 to 2010-03-01, 2009-11-04 to 2010-03-02, 2009-12-04 to 2010-12-02

        if (startFromLater) {
            if (earlierMonth < 12) {
                laterDate = Math.min(laterDate, getDaysInMonth(earlierYear, earlierMonth + 1));
            } else {
                // we don't need to handle this because the laterDate cannot be bigger than 31 (January has 31 days)
            }

            days = laterDate + (getDaysInMonth(earlierYear, earlierMonth) - earlierDate);
        } else {
            let daysInMonth: number;

            if (laterMonth > 1) {
                daysInMonth = getDaysInMonth(laterYear, laterMonth - 1);
            } else {
                daysInMonth = 31; // getDaysInMonth(laterYear - 1, 12)
            }

            if (daysInMonth > earlierDate) {
                days = laterDate + (daysInMonth - earlierDate);
            } else {
                days = laterDate;
            }
        }
    }

    return {
        years,
        months,
        days,
    };
};

const calculateDateTimeDiff = (
    earlier: WallClock,
    later: WallClock,
    startFromLater: boolean,
): DateTimeDiffResult => ({
    ...calculateDateDiff(earlier, later, startFromLater),
    ...calculateTimeDiff(earlier.millisecondsOfDay, later.millisecondsOfDay),
});

// `milliseconds` must not be negative.
const calculateDayTimeDiff = (milliseconds: number): DayTimeDiffResult => ({
    days: Math.floor(milliseconds / DAY_MILLISECONDS),
    ...millisecondsToUnits(milliseconds % DAY_MILLISECONDS),
});

/**
 * Calculate the difference between two date-time values in years, months and days.
 *
 * The result is positive when `to` is later than `from`, and negative when `to` is earlier than
 * `from`. The result is calculated with the wall-clock date and time in the local time zone, or in
 * UTC if `options.utc` is `true`. Only complete days are counted, so a remaining time shorter than
 * a day is dropped.
 *
 * @param from A `Date` or a timestamp in milliseconds.
 * @param to A `Date` or a timestamp in milliseconds.
 * @throws {TypeError} If `from` or `to` is neither a `Date` nor a number.
 * @throws {RangeError} If `from` or `to` is an invalid date or timestamp.
 */
export const dateDiff = (
    from: Date | number,
    to: Date | number,
    options?: TimeZoneOptions,
): DateDiffResult => {
    const utc = isUTC(options);
    const fromWallClock = getWallClock(toDate("from", from), utc);
    const toWallClock = getWallClock(toDate("to", to), utc);
    const ordering = compareWallClock(toWallClock, fromWallClock);

    if (ordering > 0) {
        return calculateDateDiff(fromWallClock, toWallClock, false);
    } else if (ordering < 0) {
        return negateDateDiff(calculateDateDiff(toWallClock, fromWallClock, true));
    } else {
        return {
            years: 0,
            months: 0,
            days: 0,
        };
    }
};

/**
 * Calculate the difference between two date-time values in years, months, days, hours, minutes,
 * seconds and milliseconds.
 *
 * The result is positive when `to` is later than `from`, and negative when `to` is earlier than
 * `from`. The result is calculated with the wall-clock date and time in the local time zone, or in
 * UTC if `options.utc` is `true`.
 *
 * @param from A `Date` or a timestamp in milliseconds.
 * @param to A `Date` or a timestamp in milliseconds.
 * @throws {TypeError} If `from` or `to` is neither a `Date` nor a number.
 * @throws {RangeError} If `from` or `to` is an invalid date or timestamp.
 */
export const dateTimeDiff = (
    from: Date | number,
    to: Date | number,
    options?: TimeZoneOptions,
): DateTimeDiffResult => {
    const utc = isUTC(options);
    const fromWallClock = getWallClock(toDate("from", from), utc);
    const toWallClock = getWallClock(toDate("to", to), utc);
    const ordering = compareWallClock(toWallClock, fromWallClock);

    if (ordering > 0) {
        return calculateDateTimeDiff(fromWallClock, toWallClock, false);
    } else if (ordering < 0) {
        const diff = calculateDateTimeDiff(toWallClock, fromWallClock, true);

        return {
            ...negateDateDiff(diff),
            ...negateTimeDiff(diff),
        };
    } else {
        return {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        };
    }
};

/**
 * Calculate the difference between two date-time values in days.
 *
 * A day is always 24 hours, so the result does not depend on the time zone.
 *
 * @param from A `Date` or a timestamp in milliseconds.
 * @param to A `Date` or a timestamp in milliseconds.
 * @returns The difference in days with the decimal part.
 * @throws {TypeError} If `from` or `to` is neither a `Date` nor a number.
 * @throws {RangeError} If `from` or `to` is an invalid date or timestamp.
 */
export const dayDiff = (from: Date | number, to: Date | number): number => {
    const fromTimestamp = toTimestamp("from", from);

    return (toTimestamp("to", to) - fromTimestamp) / DAY_MILLISECONDS;
};

/**
 * Calculate the difference between two date-time values in days, hours, minutes, seconds and
 * milliseconds.
 *
 * A day is always 24 hours, so the result does not depend on the time zone.
 *
 * @param from A `Date` or a timestamp in milliseconds.
 * @param to A `Date` or a timestamp in milliseconds.
 * @throws {TypeError} If `from` or `to` is neither a `Date` nor a number.
 * @throws {RangeError} If `from` or `to` is an invalid date or timestamp.
 */
export const dayTimeDiff = (from: Date | number, to: Date | number): DayTimeDiffResult => {
    const fromTimestamp = toTimestamp("from", from);
    const milliseconds = toTimestamp("to", to) - fromTimestamp;

    if (milliseconds >= 0) {
        return calculateDayTimeDiff(milliseconds);
    } else {
        const diff = calculateDayTimeDiff(-milliseconds);

        return {
            days: negate(diff.days),
            ...negateTimeDiff(diff),
        };
    }
};
