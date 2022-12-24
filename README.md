date-differencer
==========

[![CI](https://github.com/magiclen/ts-date-differencer/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/ts-date-differencer/actions/workflows/ci.yml)

Calculate the time interval between two `Date` objects and output the result in years plus months plus days plus hours plus minutes plus seconds plus milliseconds (instead of representing the same duration in different units). This library is useful for lifespan check and age calculation.

## Usage

```typescript
import { dateDiff, dateTimeDiff } from "date-differencer";

const result = dateDiff(new Date(2022, 5, 6), new Date(2023, 7, 9));
/*
{
    "years": 1,
    "months": 2,
    "days": 3
}
*/

const result = dateTimeDiff(new Date(2022, 5, 6, 0), new Date(2023, 7, 9, 1));
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
```

## Usage for Browsers

```html
<script src="https://cdn.jsdelivr.net/gh/magiclen/ts-date-differencer/dist/date-differencer.min.js"></script>
<script>
    const result = DateDifferencer.dateDiff(new Date(2022, 5, 6, 0), new Date(2023, 7, 9, 1));
    /*
    {
        "years": 1,
        "months": 2,
        "days": 3
    }
    */

    const result = DateDifferencer.dateTimeDiff(new Date(2022, 5, 6, 0), new Date(2023, 7, 9, 1));
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
</script>
```

## License

[MIT](LICENSE)