"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datumFromCovariateReferencePointFactory = datumFromCovariateReferencePointFactory;
exports.datumFactoryFromDataField = datumFactoryFromDataField;

function datumFromCovariateReferencePointFactory(covariate) {
  return {
    coefficent: covariate.referencePoint,
    name: covariate.name
  };
}
/**
 * Returns a new Datum object where the name matches with that of the
 * dataField arg and the coefficient arg has been checked if it's within the
 * acceptable bounds. If it isn't then we set it's value to either the lower or
 * upper bound
 *
 * @export
 * @param {DataField} dataField
 * @param {Coefficent} coefficient
 * @returns {IDatum}
 */


function datumFactoryFromDataField(dataField, coefficient) {
  // Find an interval where the num is within it's bounds
  var validatedInterval = typeof coefficient === 'number' && dataField.intervals && dataField.intervals.find(function (interval) {
    return interval.validate(coefficient);
  });
  return {
    name: dataField.name,
    coefficent: dataField.intervals && validatedInterval === undefined ? dataField.intervals[0].limitNumber(coefficient) : coefficient
  };
}
//# sourceMappingURL=datum.js.map