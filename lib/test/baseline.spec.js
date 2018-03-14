"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const chai_1 = require("chai");
const baseline_1 = require("../engine/regression-algorithm/baseline/baseline");
const no_baseline_hazard_found_1 = require("../engine/errors/no-baseline-hazard-found");
test(`getBaselineForData function`, t => {
    t.test(`When baseline is a number`, t => {
        const baseline = {
            baseline: 1,
        };
        chai_1.expect(baseline_1.getBaselineForData(baseline, [])).to.equal(baseline.baseline);
        t.pass(`Should return the value of the baseline field`);
        t.end();
    });
    t.test(`When the baseline is an object`, t => {
        const baseline = {
            baseline: {
                29: 1,
            },
        };
        t.test(`When the baseline object does not have a value for the coefficient of the found age datum`, t => {
            chai_1.expect(baseline_1.getBaselineForData.bind(null, baseline, [
                {
                    name: 'age',
                    coefficent: 30,
                },
            ])).to.throw(no_baseline_hazard_found_1.NoBaselineFoundForAge);
            t.pass(`Should throw a NoBaselineFoundForAge error`);
            t.end();
        });
        t.test(`When the baseline object has a number value for the coefficient of the found age datum`, t => {
            chai_1.expect(baseline_1.getBaselineForData(baseline, [
                {
                    name: 'age',
                    coefficent: 29,
                },
            ])).to.equal(
            // @ts-ignore
            baseline.baseline[29]);
            t.pass(`Should return the number value`);
            t.end();
        });
    });
});
//# sourceMappingURL=baseline.spec.js.map