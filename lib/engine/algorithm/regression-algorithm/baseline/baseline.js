"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../../data");
const undefined_1 = require("../../../../util/undefined");
const errors_1 = require("../../../errors");
class Baseline {
    constructor(baselineJson) {
        if (baselineJson === null || baselineJson === undefined) {
            this.baseline = 1;
        }
        else if (typeof baselineJson === 'number') {
            this.baseline = baselineJson;
        }
        else {
            this.baseline = baselineJson.reduce((baseline, currentBaselineJsonItem) => {
                baseline[currentBaselineJsonItem.age] =
                    currentBaselineJsonItem.baseline;
                return baseline;
            }, {});
        }
    }
    getBaselineForData(data) {
        /* If it's a number then it's not a function of the age datum in the data argument so return it */
        if (typeof this.baseline === 'number') {
            return this.baseline;
        }
        else {
            // Get the age datum
            const ageDatum = data_1.findDatumWithName('age', data);
            // Get the baseline value for this age value. If it doesn't exist then
            // throw an error
            return undefined_1.throwErrorIfUndefined(this.baseline[Number(ageDatum.coefficent)], new errors_1.NoBaselineFoundForAge(ageDatum.coefficent));
        }
    }
}
exports.Baseline = Baseline;
//# sourceMappingURL=baseline.js.map