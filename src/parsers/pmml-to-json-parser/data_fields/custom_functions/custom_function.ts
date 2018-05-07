import {
    isRestrictedCubicSplineCustomFunction,
    parseRcsSpline,
} from './rcs_custom_function';
import { IRestrictedCubicSpline, IParameter } from '../../../pmml';
import { IRcsCustomFunctionJson } from '../../../../parsers/json/json-rcs-custom-function';

/**
 * Returns a CustomFunction object if one exists for a predictor or null
 * 
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns {(CustomFunction<any> | null)}
 */
//TODO Fix this so that the knots are in an Extension node
export function parseCustomFunction(
    parameter: IParameter,
    restrictedCubicSpline: IRestrictedCubicSpline,
): IRcsCustomFunctionJson | undefined {
    //Is it a Spline custom function? If it is
    if (isRestrictedCubicSplineCustomFunction(parameter.$.label)) {
        return parseRcsSpline(parameter, restrictedCubicSpline);
    } else {
        //Don't know what custom function it is. So return null.
        return undefined;
    }
}
