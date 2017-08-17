export declare function mergeArrays<T>(getUniqueIdProperty: (arrayItem: T) => any, arrayOne: Array<T>, arrayTwo: Array<T>): Array<T>;
export declare function getMergeArraysFunction<T>(getUniqueIdProperty: (arrayItem: T) => any): (arrayOne: T[], arrayTwo: T[]) => T[];
