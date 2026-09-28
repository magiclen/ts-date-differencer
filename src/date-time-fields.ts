/** Options to choose the time zone of the wall-clock date and time. */
export interface TimeZoneOptions {
    /** Use UTC instead of the local time zone. The default value is `false`. */
    utc?: boolean;
}

/** The date and time fields of a `Date`. */
export interface DateTimeFields {
    year: number;
    /** From `1` to `12`. */
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

export const isUTC = (options: TimeZoneOptions | undefined): boolean => options?.utc === true;

export const getDateTimeFields = (date: Date, utc: boolean): DateTimeFields =>
    utc
        ? {
              year: date.getUTCFullYear(),
              month: date.getUTCMonth() + 1,
              day: date.getUTCDate(),
              hour: date.getUTCHours(),
              minute: date.getUTCMinutes(),
              second: date.getUTCSeconds(),
              millisecond: date.getUTCMilliseconds(),
          }
        : {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
              hour: date.getHours(),
              minute: date.getMinutes(),
              second: date.getSeconds(),
              millisecond: date.getMilliseconds(),
          };

/** Create a `Date` from fields. The result is an invalid date if it is out of the range of `Date`. */
export const createDate = (fields: DateTimeFields, utc: boolean): Date => {
    const { year, month, day, hour, minute, second, millisecond } = fields;

    const result = utc
        ? new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond))
        : new Date(year, month - 1, day, hour, minute, second, millisecond);

    // `Date` treats the years from 0 to 99 as 1900 to 1999, so set the date again with the full year.
    if (year >= 0 && year < 100) {
        if (utc) {
            result.setUTCFullYear(year, month - 1, day);
        } else {
            result.setFullYear(year, month - 1, day);

            // The time may have been moved by a DST gap of the same date in the 1900s, so set it again.
            result.setHours(hour, minute, second, millisecond);
        }
    }

    return result;
};
