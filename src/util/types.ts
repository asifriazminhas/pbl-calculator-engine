export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? never : Key }[keyof T]
>;

export type JsonSerializable<T extends object> = {
    // We don't want keys that are mapped to a function. Which is what the
    // OmitByValue part does

    // U = the keys of the object without those which are mapped to a function

    // Depending on the field type we decide what to do to T[U]

    // Array: Then we decide what to do based on the generic
    // type within the array. If the value within the array is an object then
    // it should be mapped to an Array of the JsonSerializable value otherwise
    // it's just the normal array

    // Object: We should JsonSerializable the field

    // Everything else: Gets passed through

    // tslint:disable-next-line:ban-types
    [U in keyof OmitByValue<T, Function>]: T[U] extends Array<infer R>
      ? R extends object
        ? Array<JsonSerializable<R>>
        : T[U]
      : T[U] extends object
      ? JsonSerializable<T[U]>
      : T[U]
}

export type Constructor<T> = new (...args: any[]) => T;
