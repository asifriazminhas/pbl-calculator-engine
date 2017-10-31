import { isRestrictedCubicSplineCustomFunction, parseRcsSpline } from './rcs_custom_function';
import { CustomFunctionsJson } from '../../../json-parser/json-types';
import { IRestrictedCubicSpline, IParameter } from '../../../pmml';

/**
 * Returns a CustomFunction object if one exists for a predictor or null
 * 
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns {(CustomFunction<any> | null)}
 */
//TODO Fix this so that the knots are in an Extension node
export function parseCustomFunction(parameter: IParameter, restrictedCubicSpline: IRestrictedCubicSpline): CustomFunctionsJson | undefined {
    //Is it a Spline custom function? If it is
    if(isRestrictedCubicSplineCustomFunction(parameter.$.label)) {
        return parseRcsSpline(parameter, restrictedCubicSpline);
    }
    //Don't know what custom function it is. So return null.
    else {
        return undefined;
    }
}