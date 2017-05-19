export function mergeArrays<T>(arrayOne: Array<T>, arrayTwo: Array<T>, getUniqueIdProperty: (arrayItem: T) => any): Array<T> {
    const mergedArray: Array<T> = [];

    arrayTwo.forEach((arrayTwoItem) => {
        const indexOfArrayOneItemWithSameUniqueId = arrayOne
            .findIndex(arrayOneItem => getUniqueIdProperty(arrayOneItem) === getUniqueIdProperty(arrayTwoItem));

        if(indexOfArrayOneItemWithSameUniqueId === -1) {
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