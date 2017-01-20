//interfaces
import {
    Parameter,
    RestrictedCubicSpline
} from '../interfaces/pmml/pmml';
import CustomFunction from '../custom_functions/custom_function';
import RCSSpline from '../custom_functions/rcs_spline';

/**
 * Checks if the predictor has a spline custom function associated with it. It does if the name has an '_rcs'
 * 
 * @param {string} name The of a 
 * @returns {boolean}
 */
function isSplineCustomFunction(name: string): boolean {
    return name.indexOf('rcs') > -1;
}

/**
 * Parses the knotLocations parameter in the PCell node of the RestrictedCubicSpline node
 * 
 * @param {string} knotLocations
 * @returns {Array<number>}
 */
function parseKnotLocations(knotLocations: string): Array<number> {
    return knotLocations.split(', ').map((knotLocation) => {
        return Number(knotLocation);
    });
}

/**
 * Given a Parameter node (represents a predictor) from a PMML file it parses any CustomFunction associated with it and returns it if any
 * 
 * @export
 * @param {{
 *     $: Parameter
 * }} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns {(CustomFunction<any> | null)}
 */
export function parseCustomFunction(parameter: {
    $: Parameter
}, restrictedCubicSpline: RestrictedCubicSpline): CustomFunction<any> | null {
    //Need to find out if there is a custom function associated with this predictor. Custom functions are preent in the parameters label after the after an underscore. example age_rcs1 where age is the name of the predictor and rcs1 is the custom function associated with it
    const parameterLabelSplitByUnderscore = parameter.$.label.split('_');
    const customFunctionName = parameterLabelSplitByUnderscore[1];
    const predictorName = parameterLabelSplitByUnderscore[0];

    //Is there a custom function for this predictor. If there is
    if(customFunctionName) {
        //Is it a Spline custom function? If it is
        if(isSplineCustomFunction(parameter.$.label)) {
            //Get the variable number for this spline custom function. eg. age_rcs1 it's 1
            const splineVariableNumber = Number(customFunctionName.split('rcs')[1]);

            //If it's 1 then we don't have to apply the spline function on it since the component can be calculated normally
            if(splineVariableNumber === 1) {
                return null;
            }
            //Otherwise
            else {
                //Get the RestrictredCubicSpline PCell for this predictor  using the parameter name field
                const restrictedCubicSplinePCell = restrictedCubicSpline.PCell.find((pCell) => {
                    return pCell.$.parameterName === parameter.$.name;
                });
                
                //If there isn't one then we have a problem
                if(!restrictedCubicSplinePCell) {
                    throw new Error(`No Restricted Cubic Spline Cell found for paramater ${parameter.$.name}`)
                }
                //Otherwise Return the Spline object
                else {
                    return new RCSSpline().constructFromPmml(parseKnotLocations(restrictedCubicSplinePCell.$.knotLocations), `${predictorName}_rcs1`, splineVariableNumber);
                }
            }
        }
        //Don't know what custom function it is. So return null.
        else {
            return null;
        }
    }
    //No custom function. Return null.
    else {
        return null;
    }
}