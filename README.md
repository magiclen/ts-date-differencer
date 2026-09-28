date-differencer
==========

[![CI](https://github.com/magiclen/ts-date-differencer/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/ts-date-differencer/actions/workflows/ci.yml)

Calculate the time interval between two `Date` objects and output the result in years plus months plus days plus hours plus minutes plus seconds plus milliseconds (instead of representing the same duration in different units). This library is useful for lifespan check and age calculation.

## Usage

```typescript
import {
    addDateTimeDiff,
    addDayTimeDiff,
    dateDiff,
    dateTimeDiff,
    dayDiff,
    dayTimeDiff,
} from "date-differencer";

const a = new Date(2022, 5, 6, 0);
const b = new Date(2023, 7, 9, 1);

console.log(dateDiff(a, b));
/*
{
    "years": 1,
    "months": 2,
    "days": 3
}
*/

console.log(dateTimeDiff(a, b));
/*
{
    "years": 1,
    "months": 2,
    "days": 3,
    "hours": 1,
    "minutes": 0,
    "seconds": 0,
    "milliseconds": 0
}
*/

console.log(Math.trunc(dayDiff(a, b))); // (365 + 31 + 30 + 3) = 429

console.log(dayTimeDiff(a, b));
/*
{
    "days": 429,
    "hours": 1,
    "minutes": 0,
    "seconds": 0,
    "milliseconds": 0
}
*/

console.log(addDateTimeDiff(a, dateTimeDiff(a, b))); // the same as b
console.log(addDayTimeDiff(a, dayTimeDiff(a, b))); // the same as b
```

Every function accepts a `Date` object or a timestamp in milliseconds, such as `Date.now()`. The result is positive when `to` is later than `from`, and negative when `to` is earlier than `from`.

This library can handle leap years and odd/even number of days in a month correctly. The result of the following code is a bit confusing but reasonable.

```typescript
import { dateDiff } from "date-differencer";

const a = new Date(2020, 1, 27);
const b = new Date(2021, 2, 1);

console.log(dateDiff(a, b));
/*
{
    "years": 1,
    "months": 0,
    "days": 2
}

Explanation:
    1. 2020-02-27 + 1 year -> 2021-02-27
    2. 2021-02-27 + 2 days -> 2021-03-01 (2021-02 has 28 days)
*/

console.log(dateDiff(b, a));
/*
{
    "years": -1,
    "months": 0,
    "days": -3
}

Explanation:
    1. 2021-03-01 - 1 year -> 2020-03-01
    2. 2020-03-01 - 3 days -> 2020-02-27 (2020-02 has 29 days)
*/
```

### Time Zones

`dateDiff`, `dateTimeDiff`, and `addDateTimeDiff` work with the wall-clock date and time in the local time zone. For example, during a DST overlap, `01:10` after the clock goes back is treated as 20 minutes earlier than `01:30` before it, even though it is 40 minutes later in real time. If the result of `addDateTimeDiff` does not exist in the local time zone (in a DST gap), it is moved forward, and if it exists twice (in a DST overlap), the earlier one is used, like `new Date(year, month, ...)` does.

Pass `{ utc: true }` to use UTC instead, so the result does not depend on the local time zone. This is useful on servers, or for dates parsed from strings like `"2020-02-27"`, which are UTC midnight.

```typescript
import { addDateTimeDiff, dateDiff, dateTimeDiff } from "date-differencer";

const a = new Date("2020-02-27");
const b = new Date("2021-03-01");

console.log(dateDiff(a, b, { utc: true })); // { "years": 1, "months": 0, "days": 2 }
console.log(addDateTimeDiff(a, dateTimeDiff(a, b, { utc: true }), { utc: true })); // the same as b
```

`dayDiff`, `dayTimeDiff`, and `addDayTimeDiff` treat a day as 24 hours, so they do not depend on the time zone. `addDayTimeDiff` ignores `years` and `months`, so use `addDateTimeDiff` for the result of `dateTimeDiff`.

### Errors

- A `TypeError` is thrown when a date is neither a `Date` object nor a number, or a field of a difference object is not a number.
- A `RangeError` is thrown when a date is invalid, a timestamp is not an integer in the range of `Date`, a field of the difference object passed to `addDateTimeDiff` is not a safe integer (or not a finite number for `addDayTimeDiff`), or the result of `addDateTimeDiff` or `addDayTimeDiff` is out of the range of `Date`.

## Migrating from 0.4.x

- Node.js 24 or later is required.
- `dateDiff` and `dateTimeDiff` decide whether `to` is later than `from` by the wall-clock date and time instead of the timestamp. The result changes only during a DST overlap, where it was wrong before.
- `addDateTimeDiff` no longer borrows one extra unit for a negative whole unit. For example, 2024-01-15 plus `{ months: -12 }` is 2023-01-15 instead of 2022-01-15.
- `addDateTimeDiff` handles the years from 0 to 99 correctly instead of changing them to 1900 to 1999.
- `addDateTimeDiff` and `addDayTimeDiff` throw an error for an invalid input or a result out of range, instead of returning a wrong date or an invalid date.
- `dayDiff` and `dayTimeDiff` throw a `RangeError` for a timestamp out of the range of `Date`.
- The result types are interfaces instead of type aliases, so they can no longer be assigned to `Record<string, number>` directly.
- Every function accepts a timestamp in addition to a `Date` object, and `dateDiff`, `dateTimeDiff`, and `addDateTimeDiff` accept the `{ utc: true }` option.

## Usage for Browsers

[Source](demo.html)

[Demo Page](https://rawcdn.githack.com/magiclen/ts-date-differencer/master/demo.html)

## License

[MIT](LICENSE)
