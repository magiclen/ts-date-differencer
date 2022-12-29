import { getDaysInMonth } from "year-helper";

import { DateTimeDiffResult, DayTimeDiffResult } from "./diff";

/**
 * Calculate `from` + `dateTimeDiff`.
 *
 * @param dateTimeDiff **unchecked, the values in the object must be integers**
 */
export const addDateTimeDiff = (from: Date, dateTimeDiff: Partial<DateTimeDiffResult>): Date => {
    let year = from.getFullYear();

    if (typeof dateTimeDiff.years === "number") {
        year += dateTimeDiff.years;
    }

    let month = from.getMonth();

    const monthAdd = (n: number) => {
        month += n;

        if (month >= 12) {
            year += Math.trunc(month / 12);
            month = month % 12;
        } else if (month < 0) {
            year += Math.trunc(month / 12) - 1;

            // eslint-disable-next-line no-extra-parens
            month = 12 - (-month % 12);
            
            if (month === 12) {
                month = 0;
            }
        }
    };

    if (typeof dateTimeDiff.months === "number") {
        monthAdd(dateTimeDiff.months);
    }

    let date = from.getDate();

    const daysInMonth = getDaysInMonth(year, month + 1);

    if (date > daysInMonth) {
        date = daysInMonth;
    }

    const dateAdd = (n: number) => {
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
                    date = daysInMonth + date;
                    break;
                }
    
                date += daysInMonth;
            }
        }
    };

    if (typeof dateTimeDiff.days === "number") {
        dateAdd(dateTimeDiff.days);
    }

    let hour = from.getHours();

    const hourAdd = (n: number) => {
        hour += n;

        if (hour >= 24) {
            dateAdd(Math.trunc(hour / 24));
            hour %= 24;
        } else if (hour < 0) {
            dateAdd(Math.trunc(hour / 24) - 1);

            // eslint-disable-next-line no-extra-parens
            hour = 24 - (-hour % 24);
            
            if (hour === 24) {
                hour = 0;
            }
        }
    };

    if (typeof dateTimeDiff.hours === "number") {
        hourAdd(dateTimeDiff.hours);
    }

    let minute = from.getMinutes();

    const minuteAdd = (n: number) => {
        minute += n;

        if (minute >= 60) {
            hourAdd(Math.trunc(minute / 60));
            minute %= 60;
        } else if (minute < 0) {
            hourAdd(Math.trunc(minute / 60) - 1);

            // eslint-disable-next-line no-extra-parens
            minute = 60 - (-minute % 60);
            
            if (minute === 60) {
                minute = 0;
            }
        }
    };

    if (typeof dateTimeDiff.minutes === "number") {
        minuteAdd(dateTimeDiff.minutes);
    }

    let second = from.getSeconds();

    const secondAdd = (n: number) => {
        second += n;

        if (second >= 60) {
            minuteAdd(Math.trunc(second / 60));
            second %= 60;
        } else if (second < 0) {
            minuteAdd(Math.trunc(second / 60) - 1);

            // eslint-disable-next-line no-extra-parens
            second = 60 - (-second % 60);
            
            if (second === 60) {
                second = 0;
            }
        }
    };

    if (typeof dateTimeDiff.seconds === "number") {
        secondAdd(dateTimeDiff.seconds);
    }

    let millisecond = from.getMilliseconds();

    const millisecondAdd = (n: number) => {
        millisecond += n;

        if (millisecond >= 1000) {
            secondAdd(Math.trunc(millisecond / 1000));
            millisecond %= 1000;
        } else if (millisecond < 0) {
            secondAdd(Math.trunc(millisecond / 1000) - 1);

            // eslint-disable-next-line no-extra-parens
            millisecond = 1000 - (-millisecond % 1000);
            
            if (millisecond === 1000) {
                millisecond = 0;
            }
        }
    };

    if (typeof dateTimeDiff.milliseconds === "number") {
        millisecondAdd(dateTimeDiff.milliseconds);
    }

    return new Date(year, month, date, hour, minute, second, millisecond);
};

/**
 * Calculate `from` + `dayTimeDiff`.
 *
 * @param dateTimeDiff **unchecked, if it is an object, the values in it should be integers; if it is a number which means days, it must not be `NaN` or `Infinit`**
 */
export const addDayTimeDiff = (from: Date, dayTimeDiff: Partial<DayTimeDiffResult> | number): Date => {
    if (typeof dayTimeDiff === "number") {
        // eslint-disable-next-line no-extra-parens
        return new Date(from.getTime() + (dayTimeDiff * 86400000));
    } else {
        let timestamp = from.getTime();

        if (typeof dayTimeDiff.days === "number") {
            timestamp += dayTimeDiff.days * 86400000;
        }

        if (typeof dayTimeDiff.hours === "number") {
            timestamp += dayTimeDiff.hours * 3600000;
        }

        if (typeof dayTimeDiff.minutes === "number") {
            timestamp += dayTimeDiff.minutes * 60000;
        }

        if (typeof dayTimeDiff.seconds === "number") {
            timestamp += dayTimeDiff.seconds * 1000;
        }

        if (typeof dayTimeDiff.milliseconds === "number") {
            timestamp += dayTimeDiff.milliseconds;
        }

        return new Date(timestamp);
    }
};
