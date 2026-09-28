import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
    addDateTimeDiff,
    addDayTimeDiff,
    dateDiff,
    dateTimeDiff,
    dayTimeDiff,
} from "../src/index.ts";

// Each test file runs in its own process, so this does not affect other test files.
process.env.TZ = "America/New_York";

const randomDate = (): Date => new Date(Math.trunc(Math.random() * 3000000000000) - 1000000000000);

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

describe("DST overlap", () => {
    it("uses the wall-clock time", () => {
        // 01:10 EST is 40 minutes later than 01:30 EDT, but its wall-clock time is 20 minutes earlier.
        const a = new Date("2024-11-03T01:30:00-04:00");
        const b = new Date("2024-11-03T01:10:00-05:00");

        assert.deepEqual(dateDiff(a, b), { years: 0, months: 0, days: 0 });
        assert.deepEqual(dateTimeDiff(a, b), {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: -20,
            seconds: 0,
            milliseconds: 0,
        });
        assert.deepEqual(dateTimeDiff(b, a), {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 20,
            seconds: 0,
            milliseconds: 0,
        });
    });
});

describe("DST gap", () => {
    it("counts calendar days in dateTimeDiff and 24-hour days in dayTimeDiff", () => {
        // 2024-03-10 has only 23 hours because 02:00 to 03:00 is skipped.
        const a = new Date(2024, 3 - 1, 9, 12);
        const b = new Date(2024, 3 - 1, 10, 12);

        assert.deepEqual(dateTimeDiff(a, b), {
            years: 0,
            months: 0,
            days: 1,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        });
        assert.deepEqual(dayTimeDiff(a, b), {
            days: 0,
            hours: 23,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
        });
    });

    it("moves a result in the gap forward", () => {
        // 2024-03-10 02:30 does not exist, so it becomes 03:30 EDT.
        assert.deepEqual(
            addDateTimeDiff(new Date(2024, 3 - 1, 9, 2, 30), { days: 1 }),
            new Date("2024-03-10T03:30:00-04:00"),
        );
    });
});

describe("years from 0 to 99", () => {
    it("is not affected by a DST gap of the same date in the 1900s", () => {
        // 1950-04-30 02:00 to 03:00 is skipped in New York, but 0050-04-30 02:30 exists.
        const from = new Date(1950, 4 - 1, 29, 2, 30);

        from.setFullYear(50, 4 - 1, 29);

        const result = addDateTimeDiff(from, { days: 1 });

        assert.deepEqual(getWallClockFields(result), [50, 4 - 1, 30, 2, 30, 0, 0]);
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

describe("UTC", () => {
    it("does not depend on the local time zone", () => {
        // Date-only strings are parsed as UTC midnight.
        const a = new Date("2020-02-27");
        const b = new Date("2021-03-01");

        assert.deepEqual(dateDiff(a, b, { utc: true }), { years: 1, months: 0, days: 2 });
        assert.deepEqual(dateDiff(b, a, { utc: true }), { years: -1, months: 0, days: -3 });
        assert.deepEqual(addDateTimeDiff(a, dateTimeDiff(a, b, { utc: true }), { utc: true }), b);
    });
});
