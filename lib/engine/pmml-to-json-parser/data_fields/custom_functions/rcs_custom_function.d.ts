import { IRestrictedCubicSpline, IParameter } from '../../../pmml';
import { RcsCustomFunctionJson } from '../../../custom-function';
/**
 * Given a the label field for a Parameter XML node it checks if this predictor has an RCS custom function or not. Eg. age_rcs2 has an rcs function
 *
 * @export
 * @param {string} parameterLabel
 * @returns
 */
export declare function isRestrictedCubicSplineCustomFunction(parameterLabel: string): boolean;
/**
 * Returns an RCSSpline object parsed from PMMML
 *
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns
 */
export declare function parseRcsSpline(parameter: IParameter, restrictedCubicSpline: IRestrictedCubicSpline): RcsCustomFunctionJson | undefined;
