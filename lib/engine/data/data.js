"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var undefined_1 = require("../../util/undefined/undefined");

var errors_1 = require("../errors");

function updateDataWithData(data, dataUpdate) {
  return data.filter(function (datum) {
    return dataUpdate.find(function (datumForRiskFactor) {
      return datumForRiskFactor.name === datum.name;
    }) ? false : true;
  }).concat(dataUpdate);
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
  return undefined_1.throwErrorIfUndefined(data.find(function (datum) {
    return datum.name === name;
  }), new errors_1.NoDatumFoundError(name));
}

exports.findDatumWithName = findDatumWithName;

function updateDataWithDatum(data, datumUpdate) {
  return updateDataWithData(data, [datumUpdate]);
}

exports.updateDataWithDatum = updateDataWithDatum;

function isEqual(dataOne, dataTwo) {
  if (dataOne.length !== dataTwo.length) {
    return false;
  }

  return dataOne.find(function (dataOneDatum) {
    var equivalentDataTwoDatumForCurrentDateOneDatum = dataTwo.find(function (dataTwoDatum) {
      return dataTwoDatum.name === dataOneDatum.name;
    });

    if (!equivalentDataTwoDatumForCurrentDateOneDatum) {
      return true;
    }

    return !(equivalentDataTwoDatumForCurrentDateOneDatum.coefficent === dataOneDatum.coefficent);
  }) ? false : true;
}

exports.isEqual = isEqual;

function filterDataForFields(data, dataFields) {
  var dataFieldNames = dataFields.map(function (dataField) {
    return dataField.name;
  });
  return data.filter(function (datum) {
    return dataFieldNames.indexOf(datum.name) === -1;
  });
}

exports.filterDataForFields = filterDataForFields;
/**
 * Removes all datum from the data arg that can be used to calculate the
 * coefficient for the covariates in the group specified in the covariateGroup
 * arg. For example, if covariateGroup is 'AGE' and one of the datum is 'age',
 * it would be removed from the data argument
 *
 * @export
 * @param {CovariateGroup} covariateGroup
 * @param {CoxSurvivalAlgorithm} cox
 * @param {Data} data
 * @returns {Data}
 */

function filterDataUsedToCalculateCoefficientsForCovariateGroup(covariateGroup, cox, data) {
  return filterDataForFields(data, cox.getAllFieldsForGroup(covariateGroup));
}

exports.filterDataUsedToCalculateCoefficientsForCovariateGroup = filterDataUsedToCalculateCoefficientsForCovariateGroup;
//# sourceMappingURL=data.js.map