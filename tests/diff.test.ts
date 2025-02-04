import type {
    DateDiffResult,
    DateTimeDiffResult,
    DayTimeDiffResult,
} from "../src/lib.js";
import {
    addDateTimeDiff,
    addDayTimeDiff,
    dateDiff,
    dateTimeDiff,
    dayDiff,
    dayTimeDiff,
} from "../src/lib.js";

const randomDate = (): Date => new Date(Math.trunc(Math.random() * 3000000000000) - 1000000000000);

const zeroDate = (overwrite?: Partial<DateDiffResult>): DateDiffResult => ({
    years: 0,
    months: 0,
    days: 0,
    ...overwrite,
});

const zeroDateTime = (
    overwrite?: Partial<DateTimeDiffResult>,
): DateTimeDiffResult => ({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    ...overwrite,
});

const zeroDayTime = (
    overwrite?: Partial<DayTimeDiffResult>,
): DayTimeDiffResult => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    ...overwrite,
});

// has side effect
const neg = (
    t: Record<string, number> | number,
): Record<string, number> | number => {
    if (typeof t === "object") {
        for (const [key, value] of Object.entries(t)) {
            if (value !== 0) {
                t[key] *= -1;
            }
        }

        return t;
    } else {
        return -t;
    }
};

describe("basic", () => {
    it("same date", () => {
        const date = new Date();

        expect(dateDiff(date, date)).toEqual(zeroDate());
        expect(dateTimeDiff(date, date)).toEqual(zeroDateTime());
        expect(dayDiff(date, date)).toBe(0);
        expect(dayTimeDiff(date, date)).toEqual(zeroDayTime());
    });

    it("diff 1 millisecond", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 1);

        const overwrite = { milliseconds: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 second", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 1000);

        const overwrite = { seconds: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 minute", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 60000);

        const overwrite = { minutes: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 hour", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 3600000);

        const overwrite = { hours: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 day", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 86400000);

        const overwrite = { days: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 1;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(dayDiff(datePlus, date)).toBe(neg(expectDayResult));
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 month", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
        );

        const overwrite = { months: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 31;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(dayDiff(datePlus, date)).toBe(neg(expectDayResult));
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 year", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(
            date.getFullYear() + 1,
            date.getMonth(),
            date.getDate(),
        );

        const overwrite = { years: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 365;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(dayDiff(datePlus, date)).toBe(neg(expectDayResult));
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 second", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 59, 2);
        const datePlus = new Date(2001, 2 - 1, 2, 2, 3, 0, 2);

        const overwrite = { seconds: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 minute", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 59, 2, 2);
        const datePlus = new Date(2001, 2 - 1, 2, 3, 0, 2, 2);

        const overwrite = { minutes: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 hour", () => {
        const date = new Date(2001, 2 - 1, 2, 23, 2, 2, 2);
        const datePlus = new Date(2001, 2 - 1, 3, 0, 2, 2, 2);

        const overwrite = { hours: 1 };

        const expectDateResult = zeroDate();
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayTruncResult = 0;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 day", () => {
        const date = new Date(2001, 2 - 1, 28, 2, 2, 2, 2);
        const datePlus = new Date(2001, 3 - 1, 1, 2, 2, 2, 2);

        const overwrite = { days: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 1;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(dayDiff(datePlus, date)).toBe(neg(expectDayResult));
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 2 day (leap)", () => {
        const date = new Date(2004, 2 - 1, 28, 2, 2, 2, 2);
        const datePlus = new Date(2004, 3 - 1, 1, 2, 2, 2, 2);

        const overwrite = { days: 2 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 2;
        const expectDayTimeResult = zeroDayTime(overwrite);

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(dayDiff(datePlus, date)).toBe(neg(expectDayResult));
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });

    it("diff 1 month", () => {
        const date = new Date(2001, 12 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(2002, 1 - 1, 2, 2, 2, 2, 2);

        const overwrite = { months: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 31;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(dayDiff(datePlus, date)).toBe(neg(expectDayResult));
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);

        expect(dateDiff(datePlus, date)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(datePlus, date)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(
            neg(expectDayTruncResult),
        );
        expect(dayTimeDiff(datePlus, date)).toEqual(neg(expectDayTimeResult));
    });
});

describe("invalid date", () => {
    it("should success", () => {
        const date = new Date(1000000, 1 - 1, 1);
        const datePlus = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
        );

        const t1 = (): DateDiffResult => dateDiff(date, datePlus);

        const t2 = (): DateTimeDiffResult => dateTimeDiff(date, datePlus);

        const t3 = (): number => dayDiff(date, datePlus);

        const t4 = (): DayTimeDiffResult => dayTimeDiff(date, datePlus);

        expect(t1).toThrow(RangeError);
        expect(t2).toThrow(RangeError);
        expect(t3).toThrow(RangeError);
        expect(t4).toThrow(RangeError);
    });
});

describe("spesical cases", () => {
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

            expect(dateDiff(a, b)).toEqual(expectDateResult);
            expect(dateTimeDiff(a, b)).toEqual(expectDateTimeResult);
            expect(Math.trunc(dayDiff(a, b))).toBe(expectDayTruncResult);
            expect(dayTimeDiff(a, b)).toEqual(expectDayTimeResult);
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

            expect(dateDiff(b, a)).toEqual(neg(expectDateResult));
            expect(dateTimeDiff(b, a)).toEqual(neg(expectDateTimeResult));
            expect(Math.trunc(dayDiff(b, a))).toBe(neg(expectDayTruncResult));
            expect(dayTimeDiff(b, a)).toEqual(neg(expectDayTimeResult));
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

            expect(dateDiff(a, b)).toEqual(expectDateResult);
            expect(dateTimeDiff(a, b)).toEqual(expectDateTimeResult);
            expect(Math.trunc(dayDiff(a, b))).toBe(expectDayTruncResult);
            expect(dayTimeDiff(a, b)).toEqual(expectDayTimeResult);
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

            expect(dateDiff(b, a)).toEqual(neg(expectDateResult));
            expect(dateTimeDiff(b, a)).toEqual(neg(expectDateTimeResult));
            expect(Math.trunc(dayDiff(b, a))).toBe(neg(expectDayTruncResult));
            expect(dayTimeDiff(b, a)).toEqual(neg(expectDayTimeResult));
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

            expect(dateDiff(a, b)).toEqual(expectDateResult);
            expect(dateTimeDiff(a, b)).toEqual(expectDateTimeResult);
            expect(Math.trunc(dayDiff(a, b))).toBe(expectDayTruncResult);
            expect(dayTimeDiff(a, b)).toEqual(expectDayTimeResult);
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

            expect(dateDiff(b, a)).toEqual(neg(expectDateResult));
            expect(dateTimeDiff(b, a)).toEqual(neg(expectDateTimeResult));
            expect(Math.trunc(dayDiff(b, a))).toBe(neg(expectDayTruncResult));
            expect(dayTimeDiff(b, a)).toEqual(neg(expectDayTimeResult));
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

        expect(dateDiff(a, b)).toEqual(expectDateResult);
        expect(dateTimeDiff(a, b)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(a, b))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(a, b)).toEqual(expectDayTimeResult);

        expect(dateDiff(b, a)).toEqual(neg(expectDateResult));
        expect(dateTimeDiff(b, a)).toEqual(neg(expectDateTimeResult));
        expect(Math.trunc(dayDiff(b, a))).toBe(neg(expectDayTruncResult));
        expect(dayTimeDiff(b, a)).toEqual(neg(expectDayTimeResult));
    });
});

describe("add diff back", () => {
    it("addDateTimeDiff (randomly run tests for 1000 times)", () => {
        for (let i = 0;i < 1000;i++) {
            const a = randomDate();
            const b = randomDate();

            const diff = dateTimeDiff(a, b);

            expect(addDateTimeDiff(a, diff)).toEqual(b);
        }
    });

    it("addDayTimeDiff (randomly run tests for 1000 times)", () => {
        for (let i = 0;i < 1000;i++) {
            const a = randomDate();
            const b = randomDate();

            const diff = dayTimeDiff(a, b);

            expect(addDayTimeDiff(a, diff)).toEqual(b);
        }
    });
});

describe("add large diff", () => {
    it("addDateTimeDiff", () => {
        expect(addDateTimeDiff(new Date(2000, 1 - 1, 5), { months: 25 }))
            .toEqual(new Date(2002, 2 - 1, 5));
        expect(addDateTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 })).toEqual(
            new Date(2000, 2 - 1, 1),
        );
        expect(addDateTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 + 29 }))
            .toEqual(new Date(2000, 3 - 1, 1));
        expect(addDateTimeDiff(new Date(2000, 1 - 1, 5), { hours: 25 }))
            .toEqual(new Date(2000, 1 - 1, 6, 1));
        expect(addDateTimeDiff(new Date(2000, 1 - 1, 5), { minutes: 61 }))
            .toEqual(new Date(2000, 1 - 1, 5, 1, 1));
        expect(addDateTimeDiff(new Date(2000, 1 - 1, 5), { seconds: 61 }))
            .toEqual(new Date(2000, 1 - 1, 5, 0, 1, 1));
        expect(
            addDateTimeDiff(new Date(2000, 1 - 1, 5), { milliseconds: 1001 }),
        ).toEqual(new Date(2000, 1 - 1, 5, 0, 0, 1, 1));
    });

    it("addDayTimeDiff", () => {
        expect(addDayTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 })).toEqual(
            new Date(2000, 2 - 1, 1),
        );
        expect(addDayTimeDiff(new Date(2000, 1 - 1, 5), { days: 27 + 29 }))
            .toEqual(new Date(2000, 3 - 1, 1));
        expect(addDayTimeDiff(new Date(2000, 1 - 1, 5), { hours: 25 })).toEqual(
            new Date(2000, 1 - 1, 6, 1),
        );
        expect(addDayTimeDiff(new Date(2000, 1 - 1, 5), { minutes: 61 }))
            .toEqual(new Date(2000, 1 - 1, 5, 1, 1));
        expect(addDayTimeDiff(new Date(2000, 1 - 1, 5), { seconds: 61 }))
            .toEqual(new Date(2000, 1 - 1, 5, 0, 1, 1));
        expect(addDayTimeDiff(new Date(2000, 1 - 1, 5), { milliseconds: 1001 }))
            .toEqual(new Date(2000, 1 - 1, 5, 0, 0, 1, 1));
    });
});
