"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeArrays = mergeArrays;
exports.getMergeArraysFunction = getMergeArraysFunction;

var _env = require("../env");

function mergeArrays(getUniqueIdProperty, arrayOne, arrayTwo) {
  var mergedArray = [];
  arrayTwo.forEach(function (arrayTwoItem) {
    var indexOfArrayOneItemWithSameUniqueId = arrayOne.findIndex(function (arrayOneItem) {
      return getUniqueIdProperty(arrayOneItem) === getUniqueIdProperty(arrayTwoItem);
    });

    if (indexOfArrayOneItemWithSameUniqueId === -1) {
      mergedArray.push(arrayTwoItem);
    } else {
      if ((0, _env.shouldLogWarnings)()) {
        console.warn("Found 2 objects with name ".concat(getUniqueIdProperty(arrayTwoItem), ". Merging with priority for second object"));
      }

      mergedArray.push(Object.assign({}, arrayOne[indexOfArrayOneItemWithSameUniqueId], arrayTwoItem));
    }
  });
  arrayOne.forEach(function (arrayOneItem) {
    mergedArray.find(function (mergedArrayItem) {
      return getUniqueIdProperty(mergedArrayItem) === getUniqueIdProperty(arrayOneItem);
    }) ? null : mergedArray.push(arrayOneItem);
  });
  return mergedArray;
}

function getMergeArraysFunction(getUniqueIdProperty) {
  return function (arrayOne, arrayTwo) {
    return mergeArrays(getUniqueIdProperty, arrayOne, arrayTwo);
  };
}
//# sourceMappingURL=merge.js.map