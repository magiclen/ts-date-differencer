/**
 * @param year **should be an integer**
 */
export const isLeapYear = (year: number): boolean => {
    // eslint-disable-next-line no-extra-parens
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Calculate how many days in a specific month.
 *
 * @param year **should be an integer**
 * @param month **should be an integer from 1 to 12**
 */
export const getDaysInMonth = (year: number, month: number): number => {
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    } else {
        const isOddMonth = month & 1;

        if (month >= 8) {
            return isOddMonth ? 30 : 31;
        } else {
            return isOddMonth ? 31 : 30;
        }
    }
};

const _dateDiff = (earlier: Date, later: Date): {
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
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

    let millisecondsOfDayDiff = laterMillisecondsOfDay - earlierMillisecondsOfDay;

    if (laterMillisecondsOfDay < earlierMillisecondsOfDay) {
        millisecondsOfDayDiff += 86400000;
    }

    const hours = Math.floor(millisecondsOfDayDiff / 3600000);
    millisecondsOfDayDiff -= hours * 3600000;
    
    const minutes = Math.floor(millisecondsOfDayDiff / 60000);
    millisecondsOfDayDiff -= minutes * 60000;
    
    const seconds = Math.floor(millisecondsOfDayDiff / 1000);
    millisecondsOfDayDiff -= seconds * 1000;
    
    const milliseconds = millisecondsOfDayDiff;

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
    };
};

/**
 * Caltulate `b - a`.
 *
 * @returns a multi-unit object and all fields of it are integers
 * @throws {RangeError}
 */
export const dateDiff = (a: Date, b: Date = new Date()): {
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
} => {
    if (b > a) {
        return _dateDiff(a, b);
    } else if (b < a) {
        const result = _dateDiff(b, a);

        for (const [key, value] of Object.entries(result) as [keyof typeof result, number][]) {
            if (value !== 0) {
                result[key] *= -1;
            }
        }

        return result;
    } else {
        if (isNaN(a.getTime()) || isNaN(b.getTime())) {
            throw new RangeError("invalid date");
        }

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
