"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithm_1 = require("../algorithm");
const lodash_1 = require("lodash");
const json_covariate_1 = require("../../../parsers/json/json-covariate");
const data_field_1 = require("../../data-field/data-field");
const datum_1 = require("../../data/datum");
class RegressionAlgorithm extends algorithm_1.Algorithm {
    constructor(regressionAlgorithmJson) {
        super(regressionAlgorithmJson);
        this.getAllFields = lodash_1.memoize(() => {
            return data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(this.covariates.map(currentCovariate => {
                return currentCovariate.getDescendantFields();
            })));
        });
        this.covariates = regressionAlgorithmJson.covariates.map(covariateJson => {
            return json_covariate_1.parseCovariateJsonToCovariate(covariateJson, regressionAlgorithmJson.covariates, regressionAlgorithmJson.derivedFields);
        });
    }
    calculateScore(data) {
        /* Go through all the covariates and calculate the data needed to
        calculate the coefficient for each one. On each loop we add the data
        returned to the currentData variable so that we don't recalculate data
        */
        const componentCalculationData = this.covariates.reduce((currentData, covariate) => {
            const dataForCurrentCovariate = covariate.calculateDataToCalculateCoefficent(currentData, this.userFunctions, this.tables);
            return currentData.concat(dataForCurrentCovariate);
        }, this.validateData(data));
        return this.covariates
            .map(covariate => covariate.getComponent(componentCalculationData, this.userFunctions, this.tables))
            .reduce(lodash_1.add, 0);
    }
    getCovariatesForGroup(group) {
        return this.covariates.filter(covariate => {
            return covariate.isPartOfGroup(group);
        });
    }
    getCovariatesWithoutGroup(group) {
        return this.covariates.filter(covariate => {
            return covariate.isPartOfGroup(group) === false;
        });
    }
    getAllFieldsForGroup(group) {
        const covariatesForGroup = this.getCovariatesForGroup(group);
        return data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(covariatesForGroup.map(currentCovariate => {
            return currentCovariate.getDescendantFields();
        }))).concat(covariatesForGroup);
    }
    /**
     * Goes through each datum in the data arg and does the following checks:
     * 1. Checks whether they are within the bounds defined by the interval
     * field on the corresponding DataField object. If they aren't, sets them
     * to either the lower or upper bound
     *
     * @private
     * @param {Data} data
     * @returns {Data}
     * @memberof RegressionAlgorithm
     */
    validateData(data) {
        const allDataFields = this.getAllFields();
        return data.map(datum => {
            const dataFieldForCurrentDatum = data_field_1.DataField.findDataFieldWithName(allDataFields, datum.name);
            return dataFieldForCurrentDatum
                ? datum_1.datumFactoryFromDataField(dataFieldForCurrentDatum, datum.coefficent)
                : datum;
        });
    }
}
exports.RegressionAlgorithm = RegressionAlgorithm;
//# sourceMappingURL=regression-algorithm.js.map