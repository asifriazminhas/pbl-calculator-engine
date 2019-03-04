import { Margin } from './margin';
import { JsonInterval } from '../../../parsers/json/json-interval';
import { ErrorCode } from '../error-code';
export declare class Interval {
    lowerMargin?: Margin;
    higherMargin?: Margin;
    constructor(intervalJson: JsonInterval);
    limitNumber(num: number): number;
    /**
     * Validates whether the num arg is greater than for an open margin or
     * greater than or equal to for a closed margin
     *
     * @param {number} num value to validate
     * @returns {(ErrorCode | true)} Returns an ErrorCode if validation
     * fails. True if validation passes.
     * @memberof Interval
     */
    validateLowerMargin(num: number): ErrorCode | true;
    /**
     * Validates whether the num arg is less than for an open margin or
     * less than or equal to for a closed margin
     * @param {number} num value to validate
     * @returns {(ErrorCode | true)} Returns an ErrorCode if validation fails.
     * True if validation passes.
     * @memberof Interval
     */
    validateHigherMargin(num: number): ErrorCode | true;
}
