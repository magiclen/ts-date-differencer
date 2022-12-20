import { dateDiff } from "../src/lib";

const zero = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
};

describe("basic", () => {
    it("same date", () => {
        const date = new Date();
    
        expect(dateDiff(date, date)).toEqual(zero);
    });
    
    it("diff +1 millisecond", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 1);

        const expectResult = structuredClone(zero);

        expectResult.milliseconds = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 second", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 1000);

        const expectResult = structuredClone(zero);

        expectResult.seconds = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 minute", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 60000);

        const expectResult = structuredClone(zero);

        expectResult.minutes = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 hour", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 3600000);

        const expectResult = structuredClone(zero);

        expectResult.hours = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 day", () => {
        const date = new Date();
        const datePlus = new Date(date.getTime() + 86400000);

        const expectResult = structuredClone(zero);

        expectResult.days = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 month", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

        const expectResult = structuredClone(zero);

        expectResult.months = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 year", () => {
        const date = new Date(2001, 1 - 1, 1);
        const datePlus = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

        const expectResult = structuredClone(zero);

        expectResult.years = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("diff +1 year +1 month +1 day +1 hour +1 minute +1 second +1 millisecond", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(date.getFullYear() + 1, date.getMonth() + 1, date.getDate() + 1, date.getHours() + 1, date.getMinutes() + 1, date.getSeconds() + 1, date.getMilliseconds() + 1);

        const expectResult = structuredClone(zero);

        expectResult.years = 1;
        expectResult.months = 1;
        expectResult.days = 1;
        expectResult.hours = 1;
        expectResult.minutes = 1;
        expectResult.seconds = 1;
        expectResult.milliseconds = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("diff -1 year -1 month -1 day -1 hour -1 minute -1 second -1 millisecond", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(date.getFullYear() - 1, date.getMonth() - 1, date.getDate() - 1, date.getHours() - 1, date.getMinutes() - 1, date.getSeconds() - 1, date.getMilliseconds() - 1);

        const expectResult = structuredClone(zero);

        expectResult.years = -1;
        expectResult.months = -1;
        expectResult.days = -1;
        expectResult.hours = -1;
        expectResult.minutes = -1;
        expectResult.seconds = -1;
        expectResult.milliseconds = -1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
});

describe("basic 2", () => {
    it("diff +1 millisecond", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 2, 999);
        const datePlus = new Date(2001, 2 - 1, 2, 2, 2, 3, 0);

        const expectResult = structuredClone(zero);

        expectResult.milliseconds = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("diff +1 second", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 2, 59, 2);
        const datePlus = new Date(2001, 2 - 1, 2, 2, 3, 0, 2);

        const expectResult = structuredClone(zero);

        expectResult.seconds = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("diff +1 minute", () => {
        const date = new Date(2001, 2 - 1, 2, 2, 59, 2, 2);
        const datePlus = new Date(2001, 2 - 1, 2, 3, 0, 2, 2);

        const expectResult = structuredClone(zero);

        expectResult.minutes = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 hour", () => {
        const date = new Date(2001, 2 - 1, 2, 23, 2, 2, 2);
        const datePlus = new Date(2001, 2 - 1, 3, 0, 2, 2, 2);

        const expectResult = structuredClone(zero);

        expectResult.hours = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 day", () => {
        const date = new Date(2001, 2 - 1, 28, 2, 2, 2, 2);
        const datePlus = new Date(2001, 3 - 1, 1, 2, 2, 2, 2);

        const expectResult = structuredClone(zero);

        expectResult.days = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +2 day (leap)", () => {
        const date = new Date(2004, 2 - 1, 28, 2, 2, 2, 2);
        const datePlus = new Date(2004, 3 - 1, 1, 2, 2, 2, 2);

        const expectResult = structuredClone(zero);

        expectResult.days = 2;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
    
    it("diff +1 month", () => {
        const date = new Date(2001, 12 - 1, 2, 2, 2, 2, 2);
        const datePlus = new Date(2002, 1 - 1, 2, 2, 2, 2, 2);

        const expectResult = structuredClone(zero);

        expectResult.months = 1;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
});

describe("complex", () => {
    it("b > a", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 10 - 1, 11, 7, 8, 9, 10);

        const expectResult = structuredClone(zero);

        expectResult.years = 1;
        expectResult.months = 5;
        expectResult.days = 6;
        expectResult.hours = 7;
        expectResult.minutes = 8;
        expectResult.seconds = 9;
        expectResult.milliseconds = 10;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("b > a, but b.time < a.time", () => {
        const date = new Date(2022, 5 - 1, 5, 5, 0, 0, 0);
        const datePlus = new Date(2023, 10 - 1, 11, 4, 59, 59, 999);

        const expectResult = structuredClone(zero);

        expectResult.years = 1;
        expectResult.months = 5;
        expectResult.days = 5;
        expectResult.hours = 23;
        expectResult.minutes = 59;
        expectResult.seconds = 59;
        expectResult.milliseconds = 999;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("b > a, but b.date < a.date", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 10 - 1, 4, 23, 59, 59, 999);

        const expectResult = structuredClone(zero);

        expectResult.years = 1;
        expectResult.months = 4;
        expectResult.days = 29;
        expectResult.hours = 23;
        expectResult.minutes = 59;
        expectResult.seconds = 59;
        expectResult.milliseconds = 999;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("b > a, but b.month < a.month", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 4 - 1, 30, 23, 59, 59, 999);

        const expectResult = structuredClone(zero);

        expectResult.years = 0;
        expectResult.months = 11;
        expectResult.days = 25;
        expectResult.hours = 23;
        expectResult.minutes = 59;
        expectResult.seconds = 59;
        expectResult.milliseconds = 999;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });

    it("b > a, but b.month < a.month & b.date < a.date", () => {
        const date = new Date(2022, 5 - 1, 5, 0, 0, 0, 0);
        const datePlus = new Date(2023, 4 - 1, 4, 23, 59, 59, 999);

        const expectResult = structuredClone(zero);

        expectResult.years = 0;
        expectResult.months = 10;
        expectResult.days = 30;
        expectResult.hours = 23;
        expectResult.minutes = 59;
        expectResult.seconds = 59;
        expectResult.milliseconds = 999;
    
        expect(dateDiff(date, datePlus)).toEqual(expectResult);
    });
});

describe("invalid date", () => {
    it("should success", () => {
        const t = () => {
            const date = new Date(1000000, 1 - 1, 1);
            const datePlus = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

            return dateDiff(date, datePlus);
        };
    
        expect(t).toThrow(RangeError);
    });
});
