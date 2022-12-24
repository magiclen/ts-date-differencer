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

export type DateTimeDiffResult = DateDiffResult & TimeDiffResult;

const _timeDiff = (earlierMillisecondsOfDay: number, laterMillisecondsOfDay: number): TimeDiffResult => {
    let milliseconds = laterMillisecondsOfDay - earlierMillisecondsOfDay;

    if (laterMillisecondsOfDay < earlierMillisecondsOfDay) {
        milliseconds += 86400000;
    }

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

const _dateDiff = (earlier: Date, later: Date): {
    earlierMillisecondsOfDay: number,
    laterMillisecondsOfDay: number,
    result: DateDiffResult,
} => {
    const earlierYear = earlier.getFullYear();
    const earlierMonth = earlier.getMonth() + 1;
    const earlierDate = earlier.getDate();

    let laterYear = later.getFullYear();
    let laterMonth = later.getMonth() + 1;
    let laterDate = later.getDate();

    // we don't use `getTime()`, because we need a locale datetime.
    // eslint-disable-next-line no-extra-parens
    const laterMillisecondsOfDay = (later.getHours() * 3600000) + (later.getMinutes() * 60000) + (later.getSeconds() * 1000) + later.getMilliseconds();
    // eslint-disable-next-line no-extra-parens
    const earlierMillisecondsOfDay = (earlier.getHours() * 3600000) + (earlier.getMinutes() * 60000) + (earlier.getSeconds() * 1000) + earlier.getMilliseconds();

    let years;
    let months;
    let days;

    if (laterMillisecondsOfDay < earlierMillisecondsOfDay) {
        // e.g. 12:00, 11:59

        // decrease a day
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

        let daysInMonth;

        if (laterMonth > 1) {
            daysInMonth = getDaysInMonth(laterYear, laterMonth - 1);
        } else {
            daysInMonth = getDaysInMonth(laterYear - 1, 12);
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

const negativize = (obj: Record<string, number>) => {
    for (const [key, value] of Object.entries(obj)) {
        if (value !== 0) {
            obj[key] *= -1;
        }
    }
};

const validateDates = (a: Date, b: Date) => {
    if (isNaN(a.getTime()) || isNaN(b.getTime())) {
        throw new RangeError("invalid date");
    }
};

/**
 * Caltulate `b - a`.
 *
 * @returns a key-value object whose keys are date units (in `years`, `months`, etc.) and all values are integers
 * @throws {RangeError} invalid date
 */
export const dateDiff = (a: Date, b: Date): DateDiffResult => {
    if (b > a) {
        return _dateDiff(a, b).result;
    } else if (b < a) {
        const result = _dateDiff(b, a).result;

        negativize(result);

        return result;
    } else {
        validateDates(a, b);

        return {
            years: 0,
            months: 0,
            days: 0,
        };
    }
};

/**
 * Caltulate `b - a`.
 *
 * @returns a key-value object whose keys are date-time units (in `years`, `months`, `hours`, etc.) and all values are integers
 * @throws {RangeError} invalid date
 */
export const dateTimeDiff = (a: Date, b: Date): DateTimeDiffResult => {
    if (b > a) {
        const diff = _dateDiff(a, b);

        return Object.assign(diff.result, _timeDiff(diff.earlierMillisecondsOfDay, diff.laterMillisecondsOfDay));
    } else if (b < a) {
        const diff = _dateDiff(b, a);

        const result = Object.assign(diff.result, _timeDiff(diff.earlierMillisecondsOfDay, diff.laterMillisecondsOfDay));

        negativize(result);

        return result;
    } else {
        validateDates(a, b);

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
