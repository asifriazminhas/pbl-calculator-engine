"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undefined_1 = require("../undefined/undefined");
const errors_1 = require("../errors");
function updateDataWithData(data, dataUpdate) {
    return data
        .filter(datum => {
        return dataUpdate.find((datumForRiskFactor) => {
            return datumForRiskFactor.name === datum.name;
        })
            ? false
            : true;
    })
        .concat(dataUpdate);
}
exports.updateDataWithData = updateDataWithData;
/**
 * Returns the IDatum object whose name field is the same as the name argument.
 * Throws a NoDatumFoundError if no IDatum object is found
 *
 * @export
 * @param {string} name
 * @param {Data} data
 * @returns {IDatum}
 */
function findDatumWithName(name, data) {
    return undefined_1.throwErrorIfUndefined(data.find(datum => datum.name === name), new errors_1.NoDatumFoundError(name));
}
exports.findDatumWithName = findDatumWithName;
function updateDataWithDatum(data, datumUpdate) {
    return updateDataWithData(data, [datumUpdate]);
}
exports.updateDataWithDatum = updateDataWithDatum;
//# sourceMappingURL=data.js.map