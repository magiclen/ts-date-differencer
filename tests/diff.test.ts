import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DateDiffResult, DateTimeDiffResult, DayTimeDiffResult } from "../src/index.ts";
import {
    addDateTimeDiff,
    addDayTimeDiff,
    dateDiff,
    dateTimeDiff,
    dayDiff,
    dayTimeDiff,
} from "../src/index.ts";

const randomDate = (): Date => new Date(Math.trunc(Math.random() * 3000000000000) - 1000000000000);

// `new Date` treats the years from 0 to 99 as 1900 to 1999, so set the date again with the full year.
const createDate = (year: number, month: number, date: number): Date => {
    const result = new Date(year, month - 1, date);

    result.setFullYear(year, month - 1, date);

    return result;
};

// Compare the wall-clock fields instead of the timestamps, because a wall-clock time in a DST overlap maps to two timestamps.
const getWallClockFields = (date: Date): number[] => [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
];

const zeroDate = (overwrite?: Partial<DateDiffResult>): DateDiffResult => ({
    years: 0,
    months: 0,
    days: 0,
    ...overwrite,
});

const zeroDateTime = (overwrite?: Partial<DateTimeDiffResult>): DateTimeDiffResult => ({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    ...overwrite,
});

const zeroDayTime = (overwrite?: Partial<DayTimeDiffResult>): DayTimeDiffResult => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    ...overwrite,
});

// `0 - value` gives `0` instead of `-0` when `value` is `0`.
const neg = <T extends Partial<DateTimeDiffResult>>(t: T): T => ({
    ...t,
    ...(t.years === undefined ? {} : { years: 0 - t.years }),
    ...(t.months === undefined ? {} : { months: 0 - t.months }),
    ...(t.days === undefined ? {} : { days: 0 - t.days }),
    ...(t.hours === undefined ? {} : { hours: 0 - t.hours }),
    ...(t.minutes === undefined ? {} : { minutes: 0 - t.minutes }),
    ...(t.seconds === undefined ? {} : { seconds: 0 - t.seconds }),
    ...(t.milliseconds === undefined ? {} : { milliseconds: 0 - t.milliseconds }),
});

describe("basic", () => {
    it("same date", () => {
        const date = new Date();

        assert.deepEqual(dateDiff(date, date), zeroDate());
        assert.deepEqual(dateTimeDiff(date, date), zeroDateTime());
        assert.equal(dayDiff(date, date), 0);
        assert.deepEqual(dayTimeDiff(date, date), zeroDayTime());
    });

    it("diff 1 millisecond", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 1);

        const overwrite = { milliseconds: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 second", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 1000);

        const overwrite = { seconds: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 minute", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 60000);

        const overwrite = { minutes: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 hour", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 3600000);

        const overwrite = { hours: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 day", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 86400000);

        const overwrite = { days: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 1;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(dayDiff(date, datePlus), expectDayResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(dayDiff(datePlus, date), -expectDayResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 month", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

        const overwrite = { months: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 31;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(dayDiff(date, datePlus), expectDayResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(dayDiff(datePlus, date), -expectDayResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 year", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

        const overwrite = { years: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 365;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(dayDiff(date, datePlus), expectDayResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(dayDiff(datePlus, date), -expectDayResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 year +1 month +1 day +1 hour +1 minute +1 second +1 millisecond", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(
            date.getFullYear() + 1,
            date.getMonth() + 1,
            date.getDate() + 1,
            date.getHours() + 1,
            date.getMinutes() + 1,
            date.getSeconds() + 1,
            date.getMilliseconds() + 1,
        );

        const overwrite = { years: 1, months: 1, days: 1 };
        const overwrite2 = {
            hours: 1,
            minutes: 1,
            seconds: 1,
            milliseconds: 1,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 365 + 28 + 1;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });
});

describe("basic 2", () => {
    it("diff 1 millisecond", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 2, 999);
        const datePlus = new Date(2001, 2 - 1, 2, 2, 2, 3, 0);

        const overwrite = { milliseconds: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 second", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 59, 2);
        const datePlus = new Date(2001, 2 - 1, 2, 2, 3, 0, 2);

        const overwrite = { seconds: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 minute", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 59, 2, 2);
        const datePlus = new Date(2001, 2 - 1, 2, 3, 0, 2, 2);

        const overwrite = { minutes: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 hour", () => {
        const date = new Date(2001, 2 - 1, 2, 23, 2, 2, 2);
        const datePlus = new Date(2001, 2 - 1, 3, 0, 2, 2, 2);

        const overwrite = { hours: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 day", () => {
        const date = new Date(2001, 2 - 1, 28, 2, 2, 2, 2);
        const datePlus = new Date(2001, 3 - 1, 1, 2, 2, 2, 2);

        const overwrite = { days: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 1;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(dayDiff(date, datePlus), expectDayResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(dayDiff(datePlus, date), -expectDayResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 2 day (leap)", () => {
        const date = new Date(2004, 2 - 1, 28, 2, 2, 2, 2);
        const datePlus = new Date(2004, 3 - 1, 1, 2, 2, 2, 2);

        const overwrite = { days: 2 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 2;
        const expectDayTimeResult = zeroDayTime(overwrite);

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(dayDiff(date, datePlus), expectDayResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(dayDiff(datePlus, date), -expectDayResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("diff 1 month", () => {
        const date = new Date(2001, 12 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(2002, 1 - 1, 2, 2, 2, 2, 2);

        const overwrite = { months: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 31;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(dayDiff(date, datePlus), expectDayResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(dayDiff(datePlus, date), -expectDayResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });
});

describe("complex", () => {
    it("b > a", () => {
        const date = new Date(2022, 8 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 11 - 1, 11, 7, 8, 9, 10);

        const overwrite = { years: 1, months: 3, days: 6 };
        const overwrite2 = {
            hours: 7,
            minutes: 8,
            seconds: 9,
            milliseconds: 10,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 365 + (31 - 5) + 30 + 31 + 11;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("b > a, but b.time < a.time", () => {
        const date = new Date(2022, 8 - 1, 5, 5, 0, 0, 0);
        const datePlus = new Date(2023, 11 - 1, 11, 4, 59, 59, 999);

        const overwrite = { years: 1, months: 3, days: 5 };
        const overwrite2 = {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 365 + (31 - 5) + 30 + 31 + 10;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("b > a, but b.date < a.date", () => {
        const date = new Date(2022, 8 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 11 - 1, 4, 23, 59, 59, 999);

        const overwrite = { years: 1, months: 2, days: 30 };
        const overwrite2 = {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 365 + (31 - 5) + 30 + 31 + 4;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("b > a, but b.date < a.date & b.month === a.month", () => {
        const date = new Date(2022, 8 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 8 - 1, 4, 23, 59, 59, 999);

        const overwrite = { years: 0, months: 11, days: 30 };
        const overwrite2 = {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 364;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("b > a, but b.month < a.month", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 4 - 1, 30, 23, 59, 59, 999);

        const overwrite = { years: 0, months: 11, days: 25 };
        const overwrite2 = {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 360;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });

    it("b > a, but b.month < a.month & b.date < a.date", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 4 - 1, 4, 23, 59, 59, 999);

        const overwrite = { years: 0, months: 10, days: 30 };
        const overwrite2 = {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 334;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(date, datePlus), expectDateResult);
        assert.deepEqual(dateTimeDiff(date, datePlus), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(date, datePlus)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(date, datePlus), expectDayTimeResult);

        assert.deepEqual(dateDiff(datePlus, date), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(datePlus, date), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(datePlus, date)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(datePlus, date), neg(expectDayTimeResult));
    });
});

describe("invalid date", () => {
    it("should success", () => {
        const date = new Date(1000000, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

        const t1 = (): DateDiffResult => dateDiff(date, datePlus);

        const t2 = (): DateTimeDiffResult => dateTimeDiff(date, datePlus);

        const t3 = (): number => dayDiff(date, datePlus);

        const t4 = (): DayTimeDiffResult => dayTimeDiff(date, datePlus);

        assert.throws(t1, RangeError);
        assert.throws(t2, RangeError);
        assert.throws(t3, RangeError);
        assert.throws(t4, RangeError);
    });
});

describe("special cases", () => {
    it("should success", () => {
        const a = new Date(2020, 2 - 1, 27, 2);
        const b = new Date(2021, 3 - 1, 2, 1);

        {
            const overwrite = { years: 1, months: 0, days: 2 };
            const overwrite2 = {
                hours: 23,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            };

            const expectDateResult = zeroDate(overwrite);
            const expectDateTimeResult = zeroDateTime({
                ...overwrite,
                ...overwrite2,
            });
            const expectDayTruncResult = 368;
            const expectDayTimeResult = zeroDayTime({
                days: expectDayTruncResult,
                ...overwrite2,
            });

            assert.deepEqual(dateDiff(a, b), expectDateResult);
            assert.deepEqual(dateTimeDiff(a, b), expectDateTimeResult);
            assert.equal(Math.trunc(dayDiff(a, b)), expectDayTruncResult);
            assert.deepEqual(dayTimeDiff(a, b), expectDayTimeResult);
        }

        // dateDiff(a, b) and dateDiff(b, a) have different absolute days! Because of the opposite moving direction.

        {
            const overwrite = { years: 1, months: 0, days: 3 };
            const overwrite2 = {
                hours: 23,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            };

            const expectDateResult = zeroDate(overwrite);
            const expectDateTimeResult = zeroDateTime({
                ...overwrite,
                ...overwrite2,
            });
            const expectDayTruncResult = 368;
            const expectDayTimeResult = zeroDayTime({
                days: expectDayTruncResult,
                ...overwrite2,
            });

            assert.deepEqual(dateDiff(b, a), neg(expectDateResult));
            assert.deepEqual(dateTimeDiff(b, a), neg(expectDateTimeResult));
            assert.equal(Math.trunc(dayDiff(b, a)), -expectDayTruncResult);
            assert.deepEqual(dayTimeDiff(b, a), neg(expectDayTimeResult));
        }
    });

    it("should success", () => {
        const a = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const b = new Date(2023, 5 - 1, 4, 23, 59, 59, 999);

        {
            const overwrite = { years: 0, months: 11, days: 29 };
            const overwrite2 = {
                hours: 23,
                minutes: 59,
                seconds: 59,
                milliseconds: 999,
            };

            const expectDateResult = zeroDate(overwrite);
            const expectDateTimeResult = zeroDateTime({
                ...overwrite,
                ...overwrite2,
            });
            const expectDayTruncResult = 364;
            const expectDayTimeResult = zeroDayTime({
                days: expectDayTruncResult,
                ...overwrite2,
            });

            assert.deepEqual(dateDiff(a, b), expectDateResult);
            assert.deepEqual(dateTimeDiff(a, b), expectDateTimeResult);
            assert.equal(Math.trunc(dayDiff(a, b)), expectDayTruncResult);
            assert.deepEqual(dayTimeDiff(a, b), expectDayTimeResult);
        }

        // dateDiff(a, b) and dateDiff(b, a) have different absolute days! Because of the opposite moving direction.

        {
            const overwrite = { years: 0, months: 11, days: 30 };
            const overwrite2 = {
                hours: 23,
                minutes: 59,
                seconds: 59,
                milliseconds: 999,
            };

            const expectDateResult = zeroDate(overwrite);
            const expectDateTimeResult = zeroDateTime({
                ...overwrite,
                ...overwrite2,
            });
            const expectDayTruncResult = 364;
            const expectDayTimeResult = zeroDayTime({
                days: expectDayTruncResult,
                ...overwrite2,
            });

            assert.deepEqual(dateDiff(b, a), neg(expectDateResult));
            assert.deepEqual(dateTimeDiff(b, a), neg(expectDateTimeResult));
            assert.equal(Math.trunc(dayDiff(b, a)), -expectDayTruncResult);
            assert.deepEqual(dayTimeDiff(b, a), neg(expectDayTimeResult));
        }
    });

    it("should success", () => {
        const a = new Date(2022, 1 - 1, 30, 0, 0, 0, 0);
        const b = new Date(2023, 3 - 1, 4, 23, 59, 59, 999);

        {
            const overwrite = { years: 1, months: 1, days: 4 };
            const overwrite2 = {
                hours: 23,
                minutes: 59,
                seconds: 59,
                milliseconds: 999,
            };

            const expectDateResult = zeroDate(overwrite);
            const expectDateTimeResult = zeroDateTime({
                ...overwrite,
                ...overwrite2,
            });
            const expectDayTruncResult = 398;
            const expectDayTimeResult = zeroDayTime({
                days: expectDayTruncResult,
                ...overwrite2,
            });

            assert.deepEqual(dateDiff(a, b), expectDateResult);
            assert.deepEqual(dateTimeDiff(a, b), expectDateTimeResult);
            assert.equal(Math.trunc(dayDiff(a, b)), expectDayTruncResult);
            assert.deepEqual(dayTimeDiff(a, b), expectDayTimeResult);
        }

        // dateDiff(a, b) and dateDiff(b, a) have different absolute days! Because of the opposite moving direction.

        {
            const overwrite = { years: 1, months: 1, days: 5 };
            const overwrite2 = {
                hours: 23,
                minutes: 59,
                seconds: 59,
                milliseconds: 999,
            };

            const expectDateResult = zeroDate(overwrite);
            const expectDateTimeResult = zeroDateTime({
                ...overwrite,
                ...overwrite2,
            });
            const expectDayTruncResult = 398;
            const expectDayTimeResult = zeroDayTime({
                days: expectDayTruncResult,
                ...overwrite2,
            });

            assert.deepEqual(dateDiff(b, a), neg(expectDateResult));
            assert.deepEqual(dateTimeDiff(b, a), neg(expectDateTimeResult));
            assert.equal(Math.trunc(dayDiff(b, a)), -expectDayTruncResult);
            assert.deepEqual(dayTimeDiff(b, a), neg(expectDayTimeResult));
        }
    });

    it("should success", () => {
        const a = new Date(2022, 1 - 1, 30, 0, 0, 0, 0);
        const b = new Date(2023, 3 - 1, 29, 23, 59, 59, 999);

        const overwrite = { years: 1, months: 1, days: 29 };
        const overwrite2 = {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = 423;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        assert.deepEqual(dateDiff(a, b), expectDateResult);
        assert.deepEqual(dateTimeDiff(a, b), expectDateTimeResult);
        assert.equal(Math.trunc(dayDiff(a, b)), expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(a, b), expectDayTimeResult);

        assert.deepEqual(dateDiff(b, a), neg(expectDateResult));
        assert.deepEqual(dateTimeDiff(b, a), neg(expectDateTimeResult));
        assert.equal(Math.trunc(dayDiff(b, a)), -expectDayTruncResult);
        assert.deepEqual(dayTimeDiff(b, a), neg(expectDayTimeResult));
    });
});

describe("add diff back", () => {
    it("addDateTimeDiff (randomly run tests for 1000 times)", () => {
        for (let i = 0; i < 1000; i++) {
            const a = randomDate();
            const b = randomDate();

            const diff = dateTimeDiff(a, b);

            assert.deepEqual(getWallClockFields(addDateTimeDiff(a, diff)), getWallClockFields(b));
        }
    });

    it("addDayTimeDiff (randomly run tests for 1000 times)", () => {
        for (let i = 0; i < 1000; i++) {
            const a = randomDate();
            const b = randomDate();

            const diff = dayTimeDiff(a, b);

            assert.deepEqual(addDayTimeDiff(a, diff), b);
        }
    });
});

describe("add large diff", () => {
    it("addDateTimeDiff", () => {
        assert.deepEqual(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { months: 25 }),
            new Date(2002, 2 - 1, 5),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 }),
            new Date(2000, 2 - 1, 1),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 + 29 }),
            new Date(2000, 3 - 1, 1),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { hours: 25 }),
            new Date(2000, 1 - 1, 6, 1),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { minutes: 61 }),
            new Date(2000, 1 - 1, 5, 1, 1),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { seconds: 61 }),
            new Date(2000, 1 - 1, 5, 0, 1, 1),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { milliseconds: 1001 }),
            new Date(2000, 1 - 1, 5, 0, 0, 1, 1),
        );
    });

    it("addDayTimeDiff", () => {
        assert.deepEqual(
            addDayTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 }),
            new Date(2000, 2 - 1, 1),
        );
        assert.deepEqual(
            addDayTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 + 29 }),
            new Date(2000, 3 - 1, 1),
        );
        assert.deepEqual(
            addDayTimeDiff(new Date(2000, 1 - 1, 5), { hours: 25 }),
            new Date(2000, 1 - 1, 6, 1),
        );
        assert.deepEqual(
            addDayTimeDiff(new Date(2000, 1 - 1, 5), { minutes: 61 }),
            new Date(2000, 1 - 1, 5, 1, 1),
        );
        assert.deepEqual(
            addDayTimeDiff(new Date(2000, 1 - 1, 5), { seconds: 61 }),
            new Date(2000, 1 - 1, 5, 0, 1, 1),
        );
        assert.deepEqual(
            addDayTimeDiff(new Date(2000, 1 - 1, 5), { milliseconds: 1001 }),
            new Date(2000, 1 - 1, 5, 0, 0, 1, 1),
        );
    });
});

describe("add diff with borrow and carry", () => {
    it("negative whole units", () => {
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 1 - 1, 15), { months: -12 }),
            new Date(2023, 1 - 1, 15),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 3 - 1, 10), { hours: -24 }),
            new Date(2024, 3 - 1, 9),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 3 - 1, 10, 1, 30), { minutes: -90 }),
            new Date(2024, 3 - 1, 10),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 3 - 1, 10, 5, 6), { seconds: -60 }),
            new Date(2024, 3 - 1, 10, 5, 5),
        );
    });

    it("milliseconds", () => {
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 1 - 1, 1, 0, 0, 1), { milliseconds: -940 }),
            new Date(2024, 1 - 1, 1, 0, 0, 0, 60),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 1 - 1, 1, 0, 0, 1), { milliseconds: -1000 }),
            new Date(2024, 1 - 1, 1),
        );
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 1 - 1, 1, 0, 0, 0, 999), { milliseconds: 1 }),
            new Date(2024, 1 - 1, 1, 0, 0, 1),
        );
    });
});

describe("years from 0 to 99", () => {
    it("addDateTimeDiff", () => {
        assert.deepEqual(addDateTimeDiff(createDate(50, 1, 1), { years: 1 }), createDate(51, 1, 1));
        assert.deepEqual(addDateTimeDiff(createDate(0, 2, 29), {}), createDate(0, 2, 29));
    });
});
