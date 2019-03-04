export declare function throwErrorIfUndefined<T>(field: T | undefined, errorToThrow: Error): T;
export declare function returnEmptyObjectIfUndefined<T>(field: T | undefined): T | {};
export declare function returnEmptyArrayIfUndefined<T>(field: Array<T> | undefined): Array<T>;
export declare function returnEmptyStringIfUndefined<T>(field: T | undefined): T | '';
