"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const covariate_1 = require("../covariate");
const core_decorators_1 = require("core-decorators");
const data_1 = require("../../../data");
let InteractionCovariate = class InteractionCovariate extends covariate_1.Covariate {
    calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
        const coefficentData = super.calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables);
        // Check whether the coefficent data has the interaction covariate in it and if it does return it
        if (coefficentData.length === 1 && coefficentData[0].name === this.name) {
            return coefficentData;
        }
        if (this.isCoefficentDatumSetToReferencePoint(coefficentData[0]) ||
            this.isCoefficentDatumSetToReferencePoint(coefficentData[1])) {
            return [data_1.datumFromCovariateReferencePointFactory(this)];
        }
        else {
            return coefficentData;
        }
    }
    isCoefficentDatumSetToReferencePoint(datum) {
        const derivedFieldForDatum = this.derivedField.derivedFrom.find(derivedFromItem => derivedFromItem.name === datum.name);
        if (!derivedFieldForDatum) {
            throw new Error(`No datum found for derived field ${this.derivedField.name}`);
        }
        return (derivedFieldForDatum.referencePoint ===
            datum.coefficent);
    }
};
InteractionCovariate = tslib_1.__decorate([
    core_decorators_1.autobind
], InteractionCovariate);
exports.InteractionCovariate = InteractionCovariate;
//# sourceMappingURL=interaction-covariate.js.map