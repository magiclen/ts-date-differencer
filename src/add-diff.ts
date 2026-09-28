import { getDaysInMonth } from "year-helper";

import {
    DAY_MILLISECONDS,
    HOUR_MILLISECONDS,
    MINUTE_MILLISECONDS,
    SECOND_MILLISECONDS,
} from "./constants.ts";
import type { TimeZoneOptions } from "./date-time-fields.ts";
import { createDate, getDateTimeFields, isUTC } from "./date-time-fields.ts";
import type { DateTimeDiffResult, DayTimeDiffResult } from "./diff.ts";
import { floorDiv, floorMod, getDiffField, toTimestamp, validateResult } from "./functions.ts";

// The Gregorian calendar repeats every 400 years, which have 146097 days.
const DAYS_IN_400_YEARS = 146_097;

// Add `n` to `value` whose range is from `0` to `base - 1`, pass the carry (or the borrow if it is negative) to `addCarry`, and return the new value.
const addWithCarry = (
    value: number,
    n: number,
    base: number,
    addCarry: (carry: number) => void,
): number => {
    const total = value + n;

    if (total >= 0 && total < base) {
        return total;
    }

    addCarry(floorDiv(total, base));

    return floorMod(total, base);
};

/**
 * Calculate `from` + `dateTimeDiff`.
 *
 * Years and months are added first, and the day is changed to the last day of the month if that
 * month is shorter. Then days, hours, minutes, seconds and milliseconds are added in this order.
 * The fields are added to the wall-clock date and time in the local time zone, or in UTC if
 * `options.utc` is `true`. If the result does not exist in the local time zone (for example, in a
 * DST gap), it is moved forward like `new Date(year, month, ...)` does.
 *
 * @param from A `Date` or a timestamp in milliseconds.
 * @param dateTimeDiff A missing field is treated as `0`. The fields must be safe integers.
 * @throws {TypeError} If `from` is neither a `Date` nor a number, or a field of `dateTimeDiff` is
 *   not a number.
 * @throws {RangeError} If `from` is an invalid date or timestamp, a field of `dateTimeDiff` is not
 *   a safe integer, or the result is out of the range of `Date`.
 */
export const addDateTimeDiff = (
    from: Date | number,
    dateTimeDiff: Partial<DateTimeDiffResult>,
    options?: TimeZoneOptions,
): Date => {
    const utc = isUTC(options);
    const fields = getDateTimeFields(new Date(toTimestamp("from", from)), utc);

    const years = getDiffField("years", dateTimeDiff.years, true);
    const months = getDiffField("months", dateTimeDiff.months, true);
    const days = getDiffField("days", dateTimeDiff.days, true);
    const hours = getDiffField("hours", dateTimeDiff.hours, true);
    const minutes = getDiffField("minutes", dateTimeDiff.minutes, true);
    const seconds = getDiffField("seconds", dateTimeDiff.seconds, true);
    const milliseconds = getDiffField("milliseconds", dateTimeDiff.milliseconds, true);

    let year = fields.year + years;
    let month = fields.month - 1;

    const monthAdd = (n: number): void => {
        month = addWithCarry(month, n, 12, (carry) => {
            year += carry;
        });
    };

    monthAdd(months);

    let date = Math.min(fields.day, getDaysInMonth(year, month + 1));

    const dateAdd = (n: number): void => {
        date += n;

        // Skip whole 400-year cycles first so that the loops below stay short for a large `n`.
        if (Math.abs(date) > DAYS_IN_400_YEARS) {
            const cycles = Math.trunc(date / DAYS_IN_400_YEARS);

            year += cycles * 400;
            date -= cycles * DAYS_IN_400_YEARS;
        }

        if (date === 0) {
            monthAdd(-1);
            date = getDaysInMonth(year, month + 1);
        } else if (date > 28) {
            for (;;) {
                const daysInMonth = getDaysInMonth(year, month + 1);

                if (date <= daysInMonth) {
                    break;
                }

                monthAdd(1);
                date -= daysInMonth;
            }
        } else if (date < 0) {
            for (;;) {
                monthAdd(-1);

                const daysInMonth = getDaysInMonth(year, month + 1);

                if (-date < daysInMonth) {
                    date += daysInMonth;
                    break;
                }

                date += daysInMonth;
            }
        }
    };

    dateAdd(days);

    let hour = fields.hour;

    const hourAdd = (n: number): void => {
        hour = addWithCarry(hour, n, 24, dateAdd);
    };

    hourAdd(hours);

    let minute = fields.minute;

    const minuteAdd = (n: number): void => {
        minute = addWithCarry(minute, n, 60, hourAdd);
    };

    minuteAdd(minutes);

    let second = fields.second;

    const secondAdd = (n: number): void => {
        second = addWithCarry(second, n, 60, minuteAdd);
    };

    secondAdd(seconds);

    const millisecond = addWithCarry(fields.millisecond, milliseconds, 1000, secondAdd);

    return validateResult(
        createDate(
            {
                year,
                month: month + 1,
                day: date,
                hour,
                minute,
                second,
                millisecond,
            },
            utc,
        ),
    );
};

/**
 * Calculate `from` + `dayTimeDiff`.
 *
 * A day is always 24 hours, so the result does not depend on the time zone.
 *
 * @param from A `Date` or a timestamp in milliseconds.
 * @param dayTimeDiff An object whose missing field is treated as `0`, or a number of days. The
 *   values must be finite numbers.
 * @throws {TypeError} If `from` is neither a `Date` nor a number, or `dayTimeDiff` (or its field)
 *   is not a number.
 * @throws {RangeError} If `from` is an invalid date or timestamp, `dayTimeDiff` (or its field) is
 *   not a finite number, or the result is out of the range of `Date`.
 */
export const addDayTimeDiff = (
    from: Date | number,
    dayTimeDiff: Partial<DayTimeDiffResult> | number,
): Date => {
    const timestamp = toTimestamp("from", from);

    if (typeof dayTimeDiff === "number") {
        return validateResult(
            new Date(
                timestamp + getDiffField("dayTimeDiff", dayTimeDiff, false) * DAY_MILLISECONDS,
            ),
        );
    }

    return validateResult(
        new Date(
            timestamp +
                getDiffField("days", dayTimeDiff.days, false) * DAY_MILLISECONDS +
                getDiffField("hours", dayTimeDiff.hours, false) * HOUR_MILLISECONDS +
                getDiffField("minutes", dayTimeDiff.minutes, false) * MINUTE_MILLISECONDS +
                getDiffField("seconds", dayTimeDiff.seconds, false) * SECOND_MILLISECONDS +
                getDiffField("milliseconds", dayTimeDiff.milliseconds, false),
        ),
    );
};
