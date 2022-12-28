export const negativize = (obj: Record<string, number>) => {
    for (const [key, value] of Object.entries(obj)) {
        if (value !== 0) {
            obj[key] *= -1;
        }
    }
};

export const validateDate = (a: Date) => {
    if (isNaN(a.getTime())) {
        throw new RangeError("invalid date");
    }
};

export const validateDates = (a: Date, b: Date) => {
    validateDate(a);
    validateDate(b);
};

export const validateTimestamp = (t: number) => {
    if (!Number.isInteger(t)) {
        throw new RangeError("invalid date");
    }
};

export const dateToTimestampWithValidation = (a: Date | number): number => {
    if (typeof a !== "number") {
        validateDate(a);

        a = a.getTime();
    } else {
        validateTimestamp(a);
    }

    return a;
};

export const datesToTimestampsWithValidation = (a: Date | number, b: Date | number): { a: number, b: number } => {
    return {
        a: dateToTimestampWithValidation(a),
        b: dateToTimestampWithValidation(b),
    };
};
