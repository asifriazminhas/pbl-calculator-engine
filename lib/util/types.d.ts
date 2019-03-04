export declare type OmitByValue<T, ValueType> = Pick<T, {
    [Key in keyof T]: T[Key] extends ValueType ? never : Key;
}[keyof T]>;
export declare type JsonSerializable<T extends object> = {
    [U in keyof OmitByValue<T, Function>]: T[U] extends Array<infer R> ? R extends object ? Array<JsonSerializable<R>> : T[U] : T[U] extends object ? JsonSerializable<T[U]> : T[U];
};
export declare type Constructor<T> = new (...args: any[]) => T;
