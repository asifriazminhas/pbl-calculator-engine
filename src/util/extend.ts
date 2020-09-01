/**
 * Extends the objectToExtend argument by adding all the properties from
 * the newProperties argument. The prototype of the returned object is
 * set to the objectToExtend argument's prototype
 *
 * @export
 * @template T
 * @template U
 * @param {T} objectToExtend
 * @param {U} newProperties
 * @returns {(T & U)}
 */
export function extendObject<T extends object, U extends object>(
    objectToExtend: T,
    newProperties: U,
): T & U {
    return Object.setPrototypeOf(
        Object.assign({}, objectToExtend, newProperties),
        Object.getPrototypeOf(objectToExtend),
    );
}
