import { IRestrictedCubicSpline, IParameter } from '../../../pmml';
import { CustomFunctionsJson } from '../../../custom-function';
/**
 * Returns a CustomFunction object if one exists for a predictor or null
 *
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns {(CustomFunction<any> | null)}
 */
export declare function parseCustomFunction(parameter: IParameter, restrictedCubicSpline: IRestrictedCubicSpline): CustomFunctionsJson | undefined;
