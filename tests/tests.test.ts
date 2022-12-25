import {
    dateDiff,
    dateTimeDiff,
    dayDiff,
    dayTimeDiff,
    DateDiffResult,
    DateTimeDiffResult,
    DayTimeDiffResult,
} from "../src/lib";

const zeroDate = (overwrite?: Partial<DateDiffResult>): DateDiffResult => {
    return {
        years: 0,
        months: 0,
        days: 0,
        ...overwrite,
    };
};

const zeroDateTime = (overwrite?: Partial<DateTimeDiffResult>): DateTimeDiffResult => {
    return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        ...overwrite,
    };
};

const zeroDayTime = (overwrite?: Partial<DayTimeDiffResult>): DayTimeDiffResult => {
    return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        ...overwrite,
    };
};

describe("basic", () => {
    it("same date", () => {
        const date = new Date();

        expect(dateDiff(date, date)).toEqual(zeroDate());
        expect(dateTimeDiff(date, date)).toEqual(zeroDateTime());
        expect(dayDiff(date, date)).toBe(0);
        expect(dayTimeDiff(date, date)).toEqual(zeroDayTime());
    });

    it("diff +1 millisecond", () => {
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
    });

    it("diff +1 second", () => {
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
    });

    it("diff +1 minute", () => {
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
    });

    it("diff +1 hour", () => {
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
    });

    it("diff +1 day", () => {
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
    });

    it("diff +1 month", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

        const overwrite = { months: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 31;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);
    });

    it("diff +1 year", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

        const overwrite = { years: 1 };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime(overwrite);
        const expectDayResult = 365;
        const expectDayTimeResult = zeroDayTime({ days: expectDayResult });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(dayDiff(date, datePlus)).toBe(expectDayResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);
    });

    it("diff +1 year +1 month +1 day +1 hour +1 minute +1 second +1 millisecond", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(date.getFullYear() + 1, date.getMonth() + 1, date.getDate() + 1, date.getHours() + 1, date.getMinutes() + 1, date.getSeconds() + 1, date.getMilliseconds() + 1);

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
    });

    it("diff -1 year -1 month -1 day -1 hour -1 minute -1 second -1 millisecond", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(date.getFullYear() + 1, date.getMonth() + 1, date.getDate() + 1, date.getHours() + 1, date.getMinutes() + 1, date.getSeconds() + 1, date.getMilliseconds() + 1);

        const overwrite = { years: -1, months: -1, days: -1 };
        const overwrite2 = {
            hours: -1,
            minutes: -1,
            seconds: -1,
            milliseconds: -1,
        };

        const expectDateResult = zeroDate(overwrite);
        const expectDateTimeResult = zeroDateTime({
            ...overwrite,
            ...overwrite2,
        });
        const expectDayTruncResult = -(365 + 28 + 1);
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        expect(dateDiff(datePlus, date)).toEqual(expectDateResult);
        expect(dateTimeDiff(datePlus, date)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(datePlus, date))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(datePlus, date)).toEqual(expectDayTimeResult);
    });
});

describe("basic 2", () => {
    it("diff +1 millisecond", () => {
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
    });

    it("diff +1 second", () => {
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
    });

    it("diff +1 minute", () => {
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
    });

    it("diff +1 hour", () => {
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
    });

    it("diff +1 day", () => {
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
    });

    it("diff +2 day (leap)", () => {
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
    });

    it("diff +1 month", () => {
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
    });
});

describe("complex", () => {
    it("b > a", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 10 - 1, 11, 7, 8, 9, 10);

        const overwrite = { years: 1, months: 5, days: 6 };
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
        const expectDayTruncResult = 365 + 31 + 30 + 31 + 31 + 30 + 6;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);
    });

    it("b > a, but b.time < a.time", () => {
        const date = new Date(2022, 5 - 1, 5, 5, 0, 0, 0);
        const datePlus = new Date(2023, 10 - 1, 11, 4, 59, 59, 999);

        const overwrite = { years: 1, months: 5, days: 5 };
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
        const expectDayTruncResult = 365 + 31 + 30 + 31 + 31 + 30 + 5;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);
    });

    it("b > a, but b.date < a.date", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 10 - 1, 4, 23, 59, 59, 999);

        const overwrite = { years: 1, months: 4, days: 29 };
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
        const expectDayTruncResult = 365 + 31 + 30 + 31 + 31 + (30 - 5) + 4;
        const expectDayTimeResult = zeroDayTime({
            days: expectDayTruncResult,
            ...overwrite2,
        });

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);
    });

    it("b > a, but b.date < a.date & b.month === a.month", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 5 - 1, 4, 23, 59, 59, 999);

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

        expect(dateDiff(date, datePlus)).toEqual(expectDateResult);
        expect(dateTimeDiff(date, datePlus)).toEqual(expectDateTimeResult);
        expect(Math.trunc(dayDiff(date, datePlus))).toBe(expectDayTruncResult);
        expect(dayTimeDiff(date, datePlus)).toEqual(expectDayTimeResult);
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
    });
});

describe("invalid date", () => {
    it("should success", () => {
        const date = new Date(1000000, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

        const t1 = () => {
            return dateDiff(date, datePlus);
        };

        const t2 = () => {
            return dateTimeDiff(date, datePlus);
        };

        const t3 = () => {
            return dayDiff(date, datePlus);
        };

        const t4 = () => {
            return dayTimeDiff(date, datePlus);
        };

        expect(t1).toThrow(RangeError);
        expect(t2).toThrow(RangeError);
        expect(t3).toThrow(RangeError);
        expect(t4).toThrow(RangeError);
    });
});
