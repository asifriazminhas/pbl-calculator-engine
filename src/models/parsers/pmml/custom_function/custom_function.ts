import { isRestrictedCubicSplineCustomFunction, parseRcsSpline } from './rcs_spline';
import CustomFunction from '../../../custom_functions/custom_function';
import { RestrictedCubicSpline } from '../interfaces/custom/restricted_cubic_spline';
import { Parameter } from '../interfaces/pmml';

/**
 * Returns a CustomFunction object if one exists for a predictor or null
 * 
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns {(CustomFunction<any> | null)}
 */
export function parseCustomFunction(parameter: Parameter, restrictedCubicSpline: RestrictedCubicSpline): CustomFunction<any> | null {
    //Is it a Spline custom function? If it is
    if(isRestrictedCubicSplineCustomFunction(parameter.$.label)) {
        return parseRcsSpline(parameter, restrictedCubicSpline);
    }
    //Don't know what custom function it is. So return null.
    else {
        return null;
    }
}