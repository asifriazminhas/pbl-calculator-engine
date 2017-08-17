"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mergeArrays(getUniqueIdProperty, arrayOne, arrayTwo) {
    const mergedArray = [];
    arrayTwo.forEach((arrayTwoItem) => {
        const indexOfArrayOneItemWithSameUniqueId = arrayOne
            .findIndex(arrayOneItem => getUniqueIdProperty(arrayOneItem) === getUniqueIdProperty(arrayTwoItem));
        if (indexOfArrayOneItemWithSameUniqueId === -1) {
            mergedArray.push(arrayTwoItem);
        }
        else {
            console.warn(`Found 2 objects with name ${getUniqueIdProperty(arrayTwoItem)}. Merging with priority for second object`);
            mergedArray.push(Object.assign({}, arrayOne[indexOfArrayOneItemWithSameUniqueId], arrayTwoItem));
        }
    });
    arrayOne.forEach((arrayOneItem) => {
        mergedArray
            .find(mergedArrayItem => getUniqueIdProperty(mergedArrayItem) === getUniqueIdProperty(arrayOneItem)) ? null : mergedArray.push(arrayOneItem);
    });
    return mergedArray;
}
exports.mergeArrays = mergeArrays;
function getMergeArraysFunction(getUniqueIdProperty) {
    return (arrayOne, arrayTwo) => {
        return mergeArrays(getUniqueIdProperty, arrayOne, arrayTwo);
    };
}
exports.getMergeArraysFunction = getMergeArraysFunction;
//# sourceMappingURL=merge.js.map