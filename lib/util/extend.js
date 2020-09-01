"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendObject = extendObject;

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
function extendObject(objectToExtend, newProperties) {
  return Object.setPrototypeOf(Object.assign({}, objectToExtend, newProperties), Object.getPrototypeOf(objectToExtend));
}
//# sourceMappingURL=extend.js.map