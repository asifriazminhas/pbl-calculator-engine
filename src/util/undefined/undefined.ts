import { isUndefined } from 'lodash';

export function throwErrorIfUndefined<T>(
    field: T | undefined,
    errorToThrow: Error,
): T {
    if (isUndefined(field)) {
        throw errorToThrow;
    } else {
        return field;
    }
}

export function returnEmptyObjectIfUndefined<T>(field: T | undefined): T | {} {
    return field ? field : {};
}

export function returnEmptyArrayIfUndefined<T>(
    field: Array<T> | undefined,
): Array<T> {
    return field ? field : [];
}

export function returnEmptyStringIfUndefined<T>(field: T | undefined): T | '' {
    return field ? field : '';
}
