"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datum_1 = require("../common/datum");
const covariate_1 = require("./covariate");
function isCoefficentDatumSetToReferencePoint(interactionCovariate, datum) {
    const derivedFieldForDatum = interactionCovariate.derivedField
        .derivedFrom
        .find(derivedFromItem => derivedFromItem.name === datum.name);
    if (!derivedFieldForDatum) {
        throw new Error(`No derived field found for datum ${datum.name}`);
    }
    return derivedFieldForDatum.referencePoint === datum.coefficent;
}
function calculateDataToCalculateCoefficent(interactionCovariate, data) {
    const coefficentData = covariate_1.calculateDataToCalculateCoefficent(interactionCovariate, data);
    if (isCoefficentDatumSetToReferencePoint(interactionCovariate, coefficentData[0]) || isCoefficentDatumSetToReferencePoint(interactionCovariate, coefficentData[1])) {
        return [
            datum_1.datumFromCovariateReferencePointFactory(interactionCovariate)
        ];
    }
    else {
        return coefficentData;
    }
}
exports.calculateDataToCalculateCoefficent = calculateDataToCalculateCoefficent;
//# sourceMappingURL=interaction-covariate.js.map