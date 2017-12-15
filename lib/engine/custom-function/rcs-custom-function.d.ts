import { Covariate } from '../covariate';
import { GenericRcsCustomFunction } from './generic-custom-function';
import { Data } from '../data';
import { Algorithm } from '../algorithm';
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
export declare function calculateDataToCalculateCoefficent(rcsCustomFunction: RcsCustomFunction, data: Data, userDefinedFunctions: Algorithm<any>['userFunctions'], tables: Algorithm<any>['tables']): Data;
