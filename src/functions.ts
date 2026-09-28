// The maximum absolute value of a timestamp that `Date` can represent.
const MAX_TIMESTAMP = 8.64e15;

// `0 - value` gives `0` instead of `-0` when `value` is `0`.
export const negate = (value: number): number => 0 - value;

// Floor division and its remainder, like `div_euclid` and `rem_euclid` in Rust when `divisor` is positive, so a negative `dividend` borrows the right amount.
export const floorDiv = (dividend: number, divisor: number): number =>
    Math.floor(dividend / divisor);

export const floorMod = (dividend: number, divisor: number): number =>
    dividend - divisor * floorDiv(dividend, divisor);

// `instanceof Date` is `false` for a `Date` from another realm, such as an iframe.
const isDate = (value: unknown): value is Date =>
    Object.prototype.toString.call(value) === "[object Date]";

/**
 * Convert a `Date` or a timestamp to a timestamp.
 *
 * @throws {TypeError} If `value` is neither a `Date` nor a number.
 * @throws {RangeError} If `value` is an invalid date, or a timestamp which is not an integer or out
 *   of the range of `Date`.
 */
export const toTimestamp = (name: string, value: Date | number): number => {
    if (isDate(value)) {
        const timestamp = value.getTime();

        if (Number.isNaN(timestamp)) {
            throw new RangeError(`\`${name}\` is an invalid date.`);
        }

        return timestamp;
    }

    // JavaScript callers can pass any type.
    if (typeof value !== "number") {
        throw new TypeError(
            `\`${name}\` must be a Date or a number, but its type is ${typeof value}.`,
        );
    }

    if (!(Number.isInteger(value) && Math.abs(value) <= MAX_TIMESTAMP)) {
        throw new RangeError(
            `\`${name}\` must be an integer from ${-MAX_TIMESTAMP} to ${MAX_TIMESTAMP}, but it is ${value}.`,
        );
    }

    // Change `-0` to `0` so that a result does not contain `-0`.
    return value === 0 ? 0 : value;
};

/** The same as `toTimestamp`, but returns a `Date`. */
export const toDate = (name: string, value: Date | number): Date =>
    new Date(toTimestamp(name, value));

/**
 * Get a field of a difference object. A missing field is `0`.
 *
 * @throws {TypeError} If the field is neither `undefined` nor a number.
 * @throws {RangeError} If the field is not a safe integer (or not a finite number when `integer` is
 *   `false`).
 */
export const getDiffField = (name: string, value: number | undefined, integer: boolean): number => {
    if (typeof value === "undefined") {
        return 0;
    }

    // JavaScript callers can pass any type.
    if (typeof value !== "number") {
        throw new TypeError(`\`${name}\` must be a number, but its type is ${typeof value}.`);
    }

    if (integer ? !Number.isSafeInteger(value) : !Number.isFinite(value)) {
        throw new RangeError(
            `\`${name}\` must be ${integer ? "a safe integer" : "a finite number"}, but it is ${value}.`,
        );
    }

    return value;
};

/**
 * Make sure a calculated `Date` is valid.
 *
 * @throws {RangeError} If `date` is out of the range of `Date`.
 */
export const validateResult = (date: Date): Date => {
    if (Number.isNaN(date.getTime())) {
        throw new RangeError("The result is out of the range of `Date`.");
    }

    return date;
};
