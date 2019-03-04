"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function datumFromCovariateReferencePointFactory(covariate) {
  return {
    coefficent: covariate.referencePoint,
    name: covariate.name
  };
}

exports.datumFromCovariateReferencePointFactory = datumFromCovariateReferencePointFactory;
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
  return {
    name: dataField.name,
    coefficent: dataField.interval && typeof coefficient === 'number' ? dataField.interval.limitNumber(coefficient) : coefficient
  };
}

exports.datumFactoryFromDataField = datumFactoryFromDataField;
//# sourceMappingURL=datum.js.map