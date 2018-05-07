import { IRestrictedCubicSpline, IParameter } from '../../../pmml';
import { IRcsCustomFunctionJson } from '../../../../parsers/json/json-rcs-custom-function';

/**
 * Given a the label field for a Parameter XML node it checks if this predictor
 * has an RCS custom function or not. Eg. age_rcs2 has an rcs function
 *
 * @export
 * @param {string} parameterLabel
 * @returns
 */
export function isRestrictedCubicSplineCustomFunction(parameterLabel: string) {
    return parameterLabel.indexOf('rcs') > -1;
}

/**
 * Gets the variable number of this rcs custom function. Eg. age_rcs2 will return 2
 *
 * @param {string} paramaterLabel
 * @returns
 */
function getSplineVariableNumber(paramaterLabel: string) {
    return Number(
        // Take the parameterLabel argument
        paramaterLabel
            // Split it up by _ since each modifier is preceeded by a _
            .split('_')
            /* Filter out all modified names which are not rcs ones and since
            there can be only one return the first value in the filtered array */
            .filter(modifierName => modifierName.indexOf('rcs') > -1)[0]
            /* At this point the string is rcs[0-9] so split it by rcs and
            return the first value in the array which returns the number */
            .split('rcs')[1],
    );
}

/**
 * Returns the array of knots from the knotLocations field in a RestrictedCubicSpline.PCell node
 *
 * @param {string} knotLocations In the PMML file it is given as '[1, 2, 3, 4]'
 * @returns {Array<number>}
 */
function parseKnotLocations(knotLocations: string): number[] {
    return knotLocations.split(', ').map(knotLocation => {
        return Number(knotLocation);
    });
}

/**
 * Returns the predictor name that represents the first rcs variable. Eg. age_rcs2 it would return age_rcs1
 *
 * @param {string} parameterLabel
 * @returns {string}
 */
function parseFirstVariableName(parameterLabel: string): string {
    /* get the name of the variable without all the modifiers. eg. age_rcs2_c
    would return age */
    const variableNameWithoutModifiers = parameterLabel.split('_')[0];
    /* get the all the modifiers for this variable replacing the rcs modifier
    with rcs1 and then join the array with '_' eg. age_rcs2_c_t would return rcs1_c_t */
    const modifiersWithoutRcsModifier = ['rcs1']
        .concat(
            parameterLabel
                // Split the string by _
                .split('_')
                // Remove the first entry since it has the variable name
                .slice(1)
                // Remove the rcs modifier
                .filter(modifierName => modifierName.indexOf('rcs') === -1),
        )
        // Join the modifiers by _
        .join('_');

    return `${variableNameWithoutModifiers}_${modifiersWithoutRcsModifier}`;
}

/**
 * Returns an RCSSpline object parsed from PMMML
 *
 * @export
 * @param {Parameter} parameter
 * @param {RestrictedCubicSpline} restrictedCubicSpline
 * @returns
 */
export function parseRcsSpline(
    parameter: IParameter,
    restrictedCubicSpline: IRestrictedCubicSpline,
): IRcsCustomFunctionJson | undefined {
    const splineVariableNumber = getSplineVariableNumber(parameter.$.label);

    /* If it's 1 then we don't have to apply the spline function on it since
    the component can be calculated normally */
    if (splineVariableNumber === 1) {
        return undefined;
    } else {
        // Otherwise
        /* Get the RestrictredCubicSpline PCell for this predictor using the
        parameter name field */
        const restrictedCubicSplinePCell = (restrictedCubicSpline.PCell instanceof
        Array
            ? restrictedCubicSpline.PCell
            : [restrictedCubicSpline.PCell]
        ).find(pCell => {
            return pCell.$.parameterName.indexOf(parameter.$.name) > -1;
        });

        // If there isn't one then we have a problem
        if (!restrictedCubicSplinePCell) {
            throw new Error(
                `No Restricted Cubic Spline Cell found for paramater ${parameter
                    .$.name}`,
            );
        } else {
            // Otherwise Return the Spline object
            return {
                knots: parseKnotLocations(
                    restrictedCubicSplinePCell.$.knotLocations,
                ),
                firstVariableCovariate: parseFirstVariableName(
                    parameter.$.label,
                ),
                variableNumber: splineVariableNumber,
            };
        }
    }
}
