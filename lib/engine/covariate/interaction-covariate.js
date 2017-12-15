"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const base_covariate_1 = require("./base-covariate");
function isCoefficentDatumSetToReferencePoint(interactionCovariate, datum) {
    const derivedFieldForDatum = interactionCovariate.derivedField.derivedFrom.find(derivedFromItem => derivedFromItem.name === datum.name);
    if (!derivedFieldForDatum) {
        throw new Error(`No derived field found for datum ${datum.name}`);
    }
    return (derivedFieldForDatum.referencePoint ===
        datum.coefficent);
}
function calculateDataToCalculateCoefficent(interactionCovariate, data, userDefinedFunctions, tables) {
    const coefficentData = base_covariate_1.calculateDataToCalculateCoefficent(interactionCovariate, data, userDefinedFunctions, tables);
    if (isCoefficentDatumSetToReferencePoint(interactionCovariate, coefficentData[0]) ||
        isCoefficentDatumSetToReferencePoint(interactionCovariate, coefficentData[1])) {
        return [data_1.datumFromCovariateReferencePointFactory(interactionCovariate)];
    }
    else {
        return coefficentData;
    }
}
exports.calculateDataToCalculateCoefficent = calculateDataToCalculateCoefficent;
//# sourceMappingURL=interaction-covariate.js.map