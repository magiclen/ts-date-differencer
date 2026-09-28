import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { dateDiff, dateTimeDiff } from "../src/index.ts";

// Each test file runs in its own process, so this does not affect other test files.
process.env.TZ = "America/New_York";

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
