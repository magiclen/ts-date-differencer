// `0 - value` gives `0` instead of `-0` when `value` is `0`.
export const negate = (value: number): number => 0 - value;

const validateDate = (a: Date): void => {
    if (isNaN(a.getTime())) {
        throw new RangeError("invalid date");
    }
};

export const validateDates = (a: Date, b: Date): void => {
    validateDate(a);
    validateDate(b);
};

const validateTimestamp = (t: number): void => {
    if (!Number.isInteger(t)) {
        throw new RangeError("invalid date");
    }
};

const dateToTimestampWithValidation = (a: Date | number): number => {
    if (typeof a !== "number") {
        validateDate(a);

        a = a.getTime();
    } else {
        validateTimestamp(a);
    }

    return a;
};

export const datesToTimestampsWithValidation = (
    a: Date | number,
    b: Date | number,
): { a: number; b: number } => ({
    a: dateToTimestampWithValidation(a),
    b: dateToTimestampWithValidation(b),
});
