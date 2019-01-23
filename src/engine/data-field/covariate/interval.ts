import { Margin } from './margin';
import { JsonInterval } from '../../../parsers/json/json-interval';

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
        if (this.lowerMargin && num < this.lowerMargin.margin) {
            return this.lowerMargin.margin;
        } else if (this.higherMargin && num > this.higherMargin.margin) {
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
     * @param {string} [variableName=''] Optional name of the variable this
     * value belongs to. Used in the error message string returned.
     * @returns {(string | true)} Returns an error message if validation fails.
     * True if validation passes.
     * @memberof Interval
     */
    validateLowerMargin(num: number, variableName: string = ''): string | true {
        if (this.lowerMargin) {
            const margin = this.lowerMargin.margin;

            if (this.lowerMargin.isOpen) {
                if (num <= margin) {
                    return `Datum value for variable ${variableName} should be greater than ${margin}`;
                } else if (num < margin) {
                    return `Datum value for variable ${variableName} should be greater than or equal to ${margin}`;
                }
            }
        }

        return true;
    }

    /**
     * Validates whether the num arg is less than for an open margin or
     * less than or equal to for a closed margin
     * @param {number} num value to validate
     * @param {string} [variableName=''] Optional name of the variable this
     * value belongs to. Used in the error message string returned.
     * @returns {(string | true)} Returns an error message if validation fails.
     * True if validation passes.
     * @memberof Interval
     */
    validateHigherMargin(
        num: number,
        variableName: string = '',
    ): string | true {
        if (this.higherMargin) {
            const margin = this.higherMargin.margin;

            if (this.higherMargin.isOpen) {
                if (num >= margin) {
                    return `Datum value for variable ${variableName} should be less than ${margin}`;
                } else if (num > margin) {
                    return `Datum value for variable ${variableName} should be less than or equal to ${margin}`;
                }
            }
        }

        return true;
    }
}
