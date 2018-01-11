"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const data_1 = require("../data");
const field_1 = require("../field");
// tslint:disable-next-line
const custom_function_1 = require("../custom-function");
// tslint:disable-next-line
const derived_field_1 = require("../derived-field");
const common_tags_1 = require("common-tags");
function calculateDataToCalculateCoefficent(covariate, data, userDefinedFunctions, tables) {
    // Try to find a datum with the same name field in the data arg
    const datumFound = field_1.getDatumForField(covariate, data);
    /* If we did not find anything then we need to calculate the coefficent
    using either a custom function or the coresponding derived field */
    if (!datumFound) {
        // Custom function has higher priority
        if (covariate.customFunction) {
            return custom_function_1.calculateDataToCalculateCoefficent(covariate.customFunction, data, userDefinedFunctions, tables);
        }
        else if (covariate.derivedField) {
            // Fall back to derived field
            try {
                return derived_field_1.calculateDataToCalculateCoefficent(covariate.derivedField, data, userDefinedFunctions, tables);
            }
            catch (err) {
                if (env_1.shouldLogWarnings()) {
                    console.warn(common_tags_1.oneLine `Incomplete data to calculate coefficent for
                        data field ${covariate.name}. Setting it to reference
                        point`);
                }
                return [data_1.datumFactory(covariate.name, covariate.referencePoint)];
            }
        }
        else {
            // Fall back to setting it to reference point
            if (env_1.shouldLogWarnings()) {
                console.warn(common_tags_1.oneLine `Incomplete data to calculate coefficent for
                    datafield ${covariate.name}. Setting it to reference point`);
            }
            return [data_1.datumFromCovariateReferencePointFactory(covariate)];
        }
    }
    else {
        return [datumFound];
    }
}
exports.calculateDataToCalculateCoefficent = calculateDataToCalculateCoefficent;
//# sourceMappingURL=base-covariate.js.map