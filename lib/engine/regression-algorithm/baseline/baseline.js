"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../data/data");
const undefined_1 = require("../../undefined/undefined");
const no_baseline_hazard_found_1 = require("../../errors/no-baseline-hazard-found");
/**
 * Returns the value of baseline to use for the given Data argument
 *
 * @export
 * @param {IBaselineMixin} { baseline }
 * @param {Data} data
 * @returns {number}
 */
function getBaselineForData({ baseline }, data) {
    /* If it's a number then it's not a function of the age datum in the data argument so return it */
    if (typeof baseline === 'number') {
        return baseline;
    }
    else {
        // Get the age datum
        const ageDatum = data_1.findDatumWithName('age', data);
        // Get the baseline value for this age value. If it doesn't exist then
        // throw an error
        return undefined_1.throwErrorIfUndefined(baseline[Number(ageDatum.coefficent)], new no_baseline_hazard_found_1.NoBaselineFoundForAge(ageDatum.coefficent));
    }
}
exports.getBaselineForData = getBaselineForData;
//# sourceMappingURL=baseline.js.map