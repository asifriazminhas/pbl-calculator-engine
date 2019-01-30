import { Margin } from './margin';
import { JsonInterval } from '../../../parsers/json/json-interval';
import { ErrorCode } from '../error-code';

export class Interval {
    lowerMargin?: Margin;
    higherMargin?: Margin;

    constructor(intervalJson: JsonInterval) {
        this.lowerMargin = intervalJson.lowerMargin
            ? new Margin(intervalJson.lowerMargin)
            : undefined;
        this.higherMargin = intervalJson.higherMargin
            ? new Margin(intervalJson.higherMargin)
            : undefined;
    }

    limitNumber(num: number): number {
        if (this.lowerMargin && this.validateLowerMargin(num) !== true) {
            return this.lowerMargin.margin;
        } else if (
            this.higherMargin &&
            this.validateHigherMargin(num) !== true
        ) {
            return this.higherMargin.margin;
        } else {
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
    validateLowerMargin(num: number): ErrorCode | true {
        if (this.lowerMargin) {
            const margin = this.lowerMargin.margin;

            if (this.lowerMargin.isOpen) {
                if (num <= margin) {
                    return ErrorCode.LessThanOrEqualTo;
                } else if (num < margin) {
                    return ErrorCode.LessThan;
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
    validateHigherMargin(num: number): ErrorCode | true {
        if (this.higherMargin) {
            const margin = this.higherMargin.margin;

            if (this.higherMargin.isOpen) {
                if (num >= margin) {
                    return ErrorCode.GreaterThanOrEqualTo;
                } else if (num > margin) {
                    return ErrorCode.GreaterThan;
                }
            }
        }

        return true;
    }
}
