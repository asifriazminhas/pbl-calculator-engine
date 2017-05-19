import { isRestrictedCubicSplineCustomFunction, parseRcsSpline } from './rcs_custom_function';
import { CustomFunctionJson } from '../../json/custom_functions/custom_function';
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
export function parseCustomFunction(parameter: Parameter, restrictedCubicSpline: RestrictedCubicSpline): CustomFunctionJson | null {
    //Is it a Spline custom function? If it is
    if(isRestrictedCubicSplineCustomFunction(parameter.$.label)) {
        return parseRcsSpline(parameter, restrictedCubicSpline);
    }
    //Don't know what custom function it is. So return null.
    else {
        return null;
    }
}