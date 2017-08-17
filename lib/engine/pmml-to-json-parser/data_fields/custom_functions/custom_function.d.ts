import { CustomFunctionsJson } from '../../../common/json-types';
import { IRestrictedCubicSpline, IParameter } from '../../../pmml';
/**
 * Returns a CustomFunction object if one exists for a predictor or null
 *
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns {(CustomFunction<any> | null)}
 */
export declare function parseCustomFunction(parameter: IParameter, restrictedCubicSpline: IRestrictedCubicSpline): CustomFunctionsJson | undefined;
