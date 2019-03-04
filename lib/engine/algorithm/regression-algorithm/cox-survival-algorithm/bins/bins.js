"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undefined_1 = require("../../../../../util/undefined/undefined");
const no_bin_found_error_1 = require("../../../../errors/no-bin-found-error");
const json_bins_1 = require("../../../../../parsers/json/json-bins");
class Bins {
    constructor(binsJson) {
        this.binsData = binsJson.binsData;
        this.binsLookup = json_bins_1.parseBinsLookupFromBinsJson(binsJson);
    }
    getBinDataForScore(score) {
        // Get the bin number for the above cox risk and throw an error if nothing was found
        const binNumber = undefined_1.throwErrorIfUndefined(this.binsLookup.find((binsLookupRow, index) => {
            if (index !== this.binsLookup.length - 1) {
                return (score >= binsLookupRow.minScore &&
                    score < binsLookupRow.maxScore);
            }
            else {
                return (score >= binsLookupRow.minScore &&
                    score <= binsLookupRow.maxScore);
            }
        }), new no_bin_found_error_1.NoBinFoundError(score)).binNumber;
        return this.binsData[binNumber];
    }
    /**
     * Returns the time field for the binDatum with the same survival percent
     * as the survival percent arg
     *
     * @param {number} survivalPercent
     * @param {IBinData[]} binData
     * @returns {number}
     * @memberof Bins
     */
    getTimeForSurvival(survivalPercent, binData) {
        return undefined_1.throwErrorIfUndefined(binData.find(binDatum => {
            return binDatum.survivalPercent === survivalPercent;
        }), new Error(`No bin datum found for survival percent ${survivalPercent}`)).time;
    }
}
exports.Bins = Bins;
//# sourceMappingURL=bins.js.map