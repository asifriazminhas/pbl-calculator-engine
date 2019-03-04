"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const margin_1 = require("./margin");
const error_code_1 = require("../error-code");
class Interval {
    constructor(intervalJson) {
        this.lowerMargin = intervalJson.lowerMargin
            ? new margin_1.Margin(intervalJson.lowerMargin)
            : undefined;
        this.higherMargin = intervalJson.higherMargin
            ? new margin_1.Margin(intervalJson.higherMargin)
            : undefined;
    }
    limitNumber(num) {
        if (this.lowerMargin && this.validateLowerMargin(num) !== true) {
            return this.lowerMargin.margin;
        }
        else if (this.higherMargin &&
            this.validateHigherMargin(num) !== true) {
            return this.higherMargin.margin;
        }
        else {
            return num;
        }
    }
    /**
     * Validates whether the num arg is greater than for an open margin or
     * greater than or equal to for a closed margin
     *
     * @param {number} num value to validate
     * @returns {(ErrorCode | true)} Returns an ErrorCode if validation
     * fails. True if validation passes.
     * @memberof Interval
     */
    validateLowerMargin(num) {
        if (this.lowerMargin) {
            const margin = this.lowerMargin.margin;
            if (this.lowerMargin.isOpen) {
                if (num <= margin) {
                    return error_code_1.ErrorCode.LessThanOrEqualTo;
                }
                else if (num < margin) {
                    return error_code_1.ErrorCode.LessThan;
                }
            }
        }
        return true;
    }
    /**
     * Validates whether the num arg is less than for an open margin or
     * less than or equal to for a closed margin
     * @param {number} num value to validate
     * @returns {(ErrorCode | true)} Returns an ErrorCode if validation fails.
     * True if validation passes.
     * @memberof Interval
     */
    validateHigherMargin(num) {
        if (this.higherMargin) {
            const margin = this.higherMargin.margin;
            if (this.higherMargin.isOpen) {
                if (num >= margin) {
                    return error_code_1.ErrorCode.GreaterThanOrEqualTo;
                }
                else if (num > margin) {
                    return error_code_1.ErrorCode.GreaterThan;
                }
            }
        }
        return true;
    }
}
exports.Interval = Interval;
//# sourceMappingURL=interval.js.map