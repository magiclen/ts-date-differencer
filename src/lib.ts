import { getDaysInMonth } from "year-helper";

export type TimeDiffResult = {
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
};

export type DateDiffResult = {
    years: number,
    months: number,
    days: number,
};

export type DayDiffResult = {
    days: number,
};

export type DateTimeDiffResult = DateDiffResult & TimeDiffResult;
export type DayTimeDiffResult = DayDiffResult & TimeDiffResult;

const _millisecondsToUnits = (milliseconds: number): TimeDiffResult => {
    const hours = Math.floor(milliseconds / 3600000);
    milliseconds -= hours * 3600000;

    const minutes = Math.floor(milliseconds / 60000);
    milliseconds -= minutes * 60000;

    const seconds = Math.floor(milliseconds / 1000);
    milliseconds -= seconds * 1000;

    return {
        hours,
        minutes,
        seconds,
        milliseconds,
    };
};

const _timeDiff = (earlierMillisecondsOfDay: number, laterMillisecondsOfDay: number): TimeDiffResult => {
    let milliseconds = laterMillisecondsOfDay - earlierMillisecondsOfDay;

    if (laterMillisecondsOfDay < earlierMillisecondsOfDay) {
        milliseconds += 86400000;
    }

    return _millisecondsToUnits(milliseconds);
};

const _localeTimeMillisecondsOfDay = (date: Date): number => {
    // eslint-disable-next-line no-extra-parens
    return (date.getHours() * 3600000) + (date.getMinutes() * 60000) + (date.getSeconds() * 1000) + date.getMilliseconds();
};

const _dateDiff = (earlier: Date, later: Date, startFromLater: boolean): {
    earlierMillisecondsOfDay: number,
    laterMillisecondsOfDay: number,
    result: DateDiffResult,
} => {
    let earlierYear = earlier.getFullYear();
    let earlierMonth = earlier.getMonth() + 1;
    let earlierDate = earlier.getDate();

    let laterYear = later.getFullYear();
    let laterMonth = later.getMonth() + 1;
    let laterDate = later.getDate();

    const laterMillisecondsOfDay = _localeTimeMillisecondsOfDay(later);
    const earlierMillisecondsOfDay = _localeTimeMillisecondsOfDay(earlier);

    let years;
    let months;
    let days;

    if (laterMillisecondsOfDay < earlierMillisecondsOfDay) {
        // e.g. 12:00, 11:59

        if (startFromLater) {
            // increase a day from the earilier date

            if (earlierDate < getDaysInMonth(earlierYear, earlierMonth)) {
                earlierDate += 1;
            } else if (earlierMonth < 12) {
                earlierMonth += 1;
                earlierDate = 1;
            } else {
                earlierYear += 1;
                earlierMonth = 1;
                earlierDate = 1;
            }
        } else {
            // decrease a day from the later date

            // eslint-disable-next-line no-lonely-if
            if (laterDate > 1) {
                laterDate -= 1;
            } else if (laterMonth > 1) {
                laterMonth -= 1;
                laterDate = getDaysInMonth(laterYear, laterMonth);
            } else {
                laterYear -= 1;
                laterMonth = 12;
                laterDate = 31;
            }
        }
    }

    const yearDiff = laterYear - earlierYear;
    const monthDiff = laterMonth - earlierMonth;

    if (monthDiff > 0) {
        // e.g. 2010-01, 2010-03

        years = yearDiff;

        if (laterDate >= earlierDate) {
            // e.g. 2010-01-02, 2010-03-04

            months = monthDiff;
        } else {
            // e.g. 2010-01-02, 2010-03-01

            months = monthDiff - 1;
        }
    } else if (monthDiff < 0) {
        // e.g. 2009-11, 2010-03

        years = yearDiff - 1;

        if (laterDate >= earlierDate) {
            // e.g. 2009-11-02, 2010-03-04

            months = monthDiff + 12;
        } else {
            // e.g. 2009-11-02, 2010-03-04

            months = monthDiff + 11;
        }
    } else {
        // monthDiff === 0, e.g. 2009-12, 2010-12

        // eslint-disable-next-line no-lonely-if
        if (laterDate >= earlierDate) {
            // e.g. 2009-12-02, 2010-12-04

            years = yearDiff;
            months = 0;
        } else {
            // e.g. 2009-12-04, 2010-12-02

            years = yearDiff - 1;
            months = 11;
        }
    }

    if (laterDate >= earlierDate) {
        // e.g. 2010-01-02, 2010-03-04 or 2009-11-02, 2010-03-04 or 2009-12-02, 2010-12-04

        days = laterDate - earlierDate;
    } else {
        // e.g. 2010-01-02, 2010-03-01 or 2009-11-02, 2010-03-04 or 2009-12-04, 2010-12-02

        days = laterDate;

        let targetYear;

        if (startFromLater) {
            targetYear = earlierYear;
        } else {
            targetYear = laterYear;
        }

        let daysInMonth;

        if (laterMonth > 1) {
            daysInMonth = getDaysInMonth(targetYear, laterMonth - 1);
        } else {
            daysInMonth = getDaysInMonth(targetYear - 1, 12);
        }

        if (daysInMonth > earlierDate) {
            days += daysInMonth - earlierDate;
        }
    }

    return {
        earlierMillisecondsOfDay,
        laterMillisecondsOfDay,
        result: {
            years,
            months,
            days,
        },
    };
};

const _dayDiff = (t: { a: number, b: number }): number => {
    return (t.b - t.a) / 86400000;
};

const negativize = (obj: Record<string, number>) => {
    for (const [key, value] of Object.entries(obj)) {
        if (value !== 0) {
            obj[key] *= -1;
        }
    }
};

const validateDate = (a: Date) => {
    if (isNaN(a.getTime())) {
        throw new RangeError("invalid date");
    }
};

const validateDates = (a: Date, b: Date) => {
    validateDate(a);
    validateDate(b);
};

const validateTimestamp = (t: number) => {
    if (!Number.isInteger(t)) {
        throw new RangeError("invalid date");
    }
};

const dateToTimestampWithValidation = (a: Date | number): number => {
    if (typeof a !== "number") {
        validateDate(a);

        a = a.getTime();
    } else {
        validateTimestamp(a);
    }

    return a;
};

const datesToTimestampsWithValidation = (a: Date | number, b: Date | number): { a: number, b: number } => {
    return {
        a: dateToTimestampWithValidation(a),
        b: dateToTimestampWithValidation(b),
    };
};

/**
 * Caltulate the difference bewteen two `Date` objects.
 *
 * @returns a key-value object whose keys are date units (in `years`, `months`, etc.) and all values are integers
 * @throws {RangeError} invalid date
 */
export const dateDiff = (from: Date, to: Date): DateDiffResult => {
    if (to > from) {
        return _dateDiff(from, to, false).result;
    } else if (to < from) {
        const result = _dateDiff(to, from, true).result;

        negativize(result);

        return result;
    } else {
        validateDates(from, to);

        return {
            years: 0,
            months: 0,
            days: 0,
        };
    }
};

/**
 * Caltulate the difference bewteen two `Date` objects.
 *
 * @returns a key-value object whose keys are date-time units (in `years`, `months`, `hours`, etc.) and all values are integers
 * @throws {RangeError} invalid date
 */
export const dateTimeDiff = (from: Date, to: Date): DateTimeDiffResult => {
    if (to > from) {
        const diff = _dateDiff(from, to, false);

        return Object.assign(diff.result, _timeDiff(diff.earlierMillisecondsOfDay, diff.laterMillisecondsOfDay));
    } else if (to < from) {
        const diff = _dateDiff(to, from, true);

        const result = Object.assign(diff.result, _timeDiff(diff.earlierMillisecondsOfDay, diff.laterMillisecondsOfDay));

        negativize(result);

        return result;
    } else {
        validateDates(from, to);

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
 * Caltulate the difference bewteen two `Date` objects or timestamps.
 *
 * @param a a `Date` or a timestamp in milliseconds
 * @param b a `Date` or a timestamp in milliseconds
 * @returns the difference in days with the decimal part
 * @throws {RangeError} invalid date (or timestamp)
 */
export const dayDiff = (a: Date | number, b: Date | number): number => {
    return _dayDiff(datesToTimestampsWithValidation(a, b));
};

/**
 * Caltulate the difference bewteen two `Date` objects or timestamps.
 *
 * @returns a key-value object whose keys are `days` and time units (`hours`, `minutes`, etc.) and all values are integers
 * @throws {RangeError} invalid date (or timestamp)
 */
export const dayTimeDiff = (a: Date | number, b: Date | number): DayTimeDiffResult => {
    const t = datesToTimestampsWithValidation(a, b);

    if (t.b > t.a) {
        const days = Math.floor(_dayDiff(t));

        return { days: days, ..._timeDiff(t.a % 86400000, t.b % 86400000) };
    } else if (t.b < t.a) {
        const days = Math.floor(_dayDiff({ a: t.b, b: t.a }));

        const result = { days: days, ..._timeDiff(t.b % 86400000, t.a % 86400000) };

        negativize(result);

        return result;
    } else {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        };
    }
};
