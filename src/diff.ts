import { getDaysInMonth } from "year-helper";

import { negativize, validateDates, datesToTimestampsWithValidation } from "./functions";

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

const _timeMillisecondsOfDay = (timestamp: number): number => {
    if (timestamp >= 0) {
        return timestamp % 86400000;
    } else {
        // eslint-disable-next-line no-extra-parens
        let t = 86400000 + (timestamp % 86400000);

        if (t === 86400000) {
            t = 0;
        }

        return t;
    }
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
        // e.g. 12:00 to 11:59

        if (startFromLater) {
            // increase a day from the earilier date

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

            // eslint-disable-next-line no-lonely-if
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
            // e.g. 2009-11-02 to 2010-03-04

            months = monthDiff + 11;
        }
    } else {
        // monthDiff === 0, e.g. 2009-12 to 2010-12

        // eslint-disable-next-line no-lonely-if
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
        // e.g. 2010-01-02 to 2010-03-01, 2009-11-02 to 2010-03-04, 2009-12-04 to 2010-12-02
        
        // eslint-disable-next-line no-lonely-if
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
        const { result: diff, earlierMillisecondsOfDay, laterMillisecondsOfDay } = _dateDiff(from, to, false);

        return Object.assign(diff, _timeDiff(earlierMillisecondsOfDay, laterMillisecondsOfDay));
    } else if (to < from) {
        const { result: diff, earlierMillisecondsOfDay, laterMillisecondsOfDay } = _dateDiff(to, from, true);

        const result = Object.assign(diff, _timeDiff(earlierMillisecondsOfDay, laterMillisecondsOfDay));

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

        return { days: days, ..._timeDiff(_timeMillisecondsOfDay(t.a), _timeMillisecondsOfDay(t.b)) };
    } else if (t.b < t.a) {
        const days = Math.floor(_dayDiff({ a: t.b, b: t.a }));

        const result = { days: days, ..._timeDiff(_timeMillisecondsOfDay(t.b), _timeMillisecondsOfDay(t.a)) };

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
