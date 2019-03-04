"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_decorators_1 = require("core-decorators");
const data_1 = require("../data/data");
const gender_cause_effect_ref_1 = require("../cause-effect/gender-cause-effect-ref");
let LifeYearsLost = class LifeYearsLost {
    constructor(causeEffectRef, lifeTable) {
        this.causeEffectRef = causeEffectRef;
        this.lifeTable = lifeTable;
    }
    getLifeYearsLostDueToRiskFactor(riskFactor, data) {
        const ageDatum = data_1.findDatumWithName('age', data);
        // Calculate Normal LE
        const normalLifeExpectancy = this.lifeTable.getLifeExpectancy(data);
        // Calculate Cause Deleted LE
        /* We concat the age datum at the end since some covariates may need it
        for their calculations and so it will get removed from the data but we
        need it for life expectancy calculations */
        const lifeExpectancyDataWithoutRiskFactorFields = data_1.filterDataUsedToCalculateCoefficientsForCovariateGroup(riskFactor, this.lifeTable.model.getAlgorithmForData(data), data).concat(ageDatum);
        /* Add the cause deleted ref to the filtered data */
        const causeDeletedLifeExpectancyData = lifeExpectancyDataWithoutRiskFactorFields.concat(gender_cause_effect_ref_1.getCauseEffectRefForData(this.causeEffectRef, data)[riskFactor]);
        /* Use the new data to calculate cause deleted LE */
        const causeDeletedLifeExpectancy = this.lifeTable.getLifeExpectancy(causeDeletedLifeExpectancyData);
        // Return subtraction of the two
        return causeDeletedLifeExpectancy - normalLifeExpectancy;
    }
};
LifeYearsLost = tslib_1.__decorate([
    core_decorators_1.autobind
], LifeYearsLost);
exports.LifeYearsLost = LifeYearsLost;
//# sourceMappingURL=life-years-lost.js.map