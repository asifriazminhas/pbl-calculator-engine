import { Covariate } from '../covariate';
import { GenericRcsCustomFunction } from '../../common/generic-types';
import { Data } from '../../common/datum';
export interface RcsCustomFunction extends GenericRcsCustomFunction<Covariate> {
}
/**
 * Evaluates this custom function
 *
 * @param {EvaluateArgs} args
 * @returns {number}
 *
 * @memberOf Spline
 */
export declare function calculateCoefficent(rcsCustomFunction: RcsCustomFunction, data: Data): number;
export declare function calculateDataToCalculateCoefficent(rcsCustomFunction: RcsCustomFunction, data: Data): Data;
