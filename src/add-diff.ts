import { getDaysInMonth } from "year-helper";

import {
    DAY_MILLISECONDS,
    HOUR_MILLISECONDS,
    MINUTE_MILLISECONDS,
    SECOND_MILLISECONDS,
} from "./constants.ts";
import type { DateTimeDiffResult, DayTimeDiffResult } from "./diff.ts";
import { floorDiv, floorMod } from "./functions.ts";

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
 * The fields are added to the wall-clock date and time in the local time zone.
 *
 * @param dateTimeDiff *Unchecked**, the values in the object must be integers.
 */
export const addDateTimeDiff = (from: Date, dateTimeDiff: Partial<DateTimeDiffResult>): Date => {
    let year = from.getFullYear() + (dateTimeDiff.years ?? 0);
    let month = from.getMonth();

    const monthAdd = (n: number): void => {
        month = addWithCarry(month, n, 12, (carry) => {
            year += carry;
        });
    };

    monthAdd(dateTimeDiff.months ?? 0);

    let date = Math.min(from.getDate(), getDaysInMonth(year, month + 1));

    const dateAdd = (n: number): void => {
        date += n;

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

    dateAdd(dateTimeDiff.days ?? 0);

    let hour = from.getHours();

    const hourAdd = (n: number): void => {
        hour = addWithCarry(hour, n, 24, dateAdd);
    };

    hourAdd(dateTimeDiff.hours ?? 0);

    let minute = from.getMinutes();

    const minuteAdd = (n: number): void => {
        minute = addWithCarry(minute, n, 60, hourAdd);
    };

    minuteAdd(dateTimeDiff.minutes ?? 0);

    let second = from.getSeconds();

    const secondAdd = (n: number): void => {
        second = addWithCarry(second, n, 60, minuteAdd);
    };

    secondAdd(dateTimeDiff.seconds ?? 0);

    const millisecond = addWithCarry(
        from.getMilliseconds(),
        dateTimeDiff.milliseconds ?? 0,
        1000,
        secondAdd,
    );

    const result = new Date(year, month, date, hour, minute, second, millisecond);

    // `new Date` treats the years from 0 to 99 as 1900 to 1999, so set the date again with the full year.
    result.setFullYear(year, month, date);

    return result;
};

/**
 * Calculate `from` + `dayTimeDiff`.
 *
 * A day is always 24 hours, so the result does not depend on the time zone.
 *
 * @param dayTimeDiff _Unchecked_*, if it is an object, the values in it should be integers; if it
 *   is a number which means days, it must not be `NaN` or `Infinity`.
 */
export const addDayTimeDiff = (
    from: Date,
    dayTimeDiff: Partial<DayTimeDiffResult> | number,
): Date => {
    if (typeof dayTimeDiff === "number") {
        return new Date(from.getTime() + dayTimeDiff * DAY_MILLISECONDS);
    }

    return new Date(
        from.getTime() +
            (dayTimeDiff.days ?? 0) * DAY_MILLISECONDS +
            (dayTimeDiff.hours ?? 0) * HOUR_MILLISECONDS +
            (dayTimeDiff.minutes ?? 0) * MINUTE_MILLISECONDS +
            (dayTimeDiff.seconds ?? 0) * SECOND_MILLISECONDS +
            (dayTimeDiff.milliseconds ?? 0),
    );
};
