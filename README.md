date-differencer
==========

[![CI](https://github.com/magiclen/ts-date-differencer/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/ts-date-differencer/actions/workflows/ci.yml)

Calculate the time interval between two `Date` objects and output the result in years plus months plus days plus hours plus minutes plus seconds plus milliseconds (instead of representing the same duration in different units). This library is useful for lifespan check and age calculation.

## Usage

```typescript
import {
    dateDiff, dateTimeDiff, dayDiff, dayTimeDiff,
    addDateTimeDiff, addDayTimeDiff
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
console.log(addDayTimeDiff(a, dayTimeDiff(a, b)));   // the same as b
```

This library can handle leap years and odd/even number of days in a month correctly. The result of following code is a bit confusing but reasonable.

```typescript
import { dateDiff } from "date-differencer";

const a = new Date("2020-02-27");
const b = new Date("2021-03-01");

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

## Usage for Browsers

```html
<script src="https://cdn.jsdelivr.net/gh/magiclen/ts-date-differencer/dist/date-differencer.min.js"></script>
<script>
    console.log(DateDifferencer.dateDiff(new Date(2022, 5, 6), new Date(2023, 7, 9)));
    /*
    {
        "years": 1,
        "months": 2,
        "days": 3
    }
    */
</script>
```

## License

[MIT](LICENSE)