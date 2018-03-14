import { Data } from '../../data/data';
/**
 * Mixin to add for a regression algorithm with a baseline value
 *
 * @export
 * @interface IBaselineMixin
 */
export interface IBaselineMixin {
    /**
     * The value of the baseline. If it's an object then it implies that this
     * baseline is dependent on the age of the individual
     *
     * @type {(number | { [index: number]: number | undefined;})}
     * @memberof IBaselineMixin
     */
    baseline: number | {
        [index: number]: number | undefined;
    };
}
/**
 * Returns the value of baseline to use for the given Data argument
 *
 * @export
 * @param {IBaselineMixin} { baseline }
 * @param {Data} data
 * @returns {number}
 */
export declare function getBaselineForData({baseline}: IBaselineMixin, data: Data): number;
