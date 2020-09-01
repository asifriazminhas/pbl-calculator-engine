import { AbridgedLifeExpectancy } from '../engine/abridged-life-expectancy/abridged-life-expectancy';
import { CauseDeletedRef } from './cause-deleted-ref';
import { ICauseDeletedModel } from './cause-deleted-risk';
import { Data } from '../engine/data';
import { IExternalPredictor } from './external-predictor';
import { RiskFactor } from '../risk-factors';
export interface ICauseDeletedAbridgedLE extends AbridgedLifeExpectancy {
    model: ICauseDeletedModel;
    calculateCDForPopulation: typeof calculateCDForPopulation;
    calculateCDForIndividual: typeof calculateCDForIndividual;
}
/**
 * Adds cause deleted methods to the Abridged life expectancy object
 *
 * @export
 * @param {AbridgedLifeExpectancy} abridgedLE Object to extend
 * @param {CauseDeletedRef} riskFactorRef A JSON array containing the
 * reference exposure values to use for each algorithm when calculating
 * cause deleted
 * @returns {ICauseDeletedAbridgedLE}
 */
export declare function addCauseDeleted(abridgedLE: AbridgedLifeExpectancy, riskFactorRef: CauseDeletedRef): ICauseDeletedAbridgedLE;
declare function calculateCDForIndividual(this: ICauseDeletedAbridgedLE, externalPredictors: IExternalPredictor[], riskFactors: RiskFactor[], individual: Data): number;
declare function calculateCDForPopulation(this: ICauseDeletedAbridgedLE, externalPredictors: IExternalPredictor[], riskFactors: RiskFactor[], population: Data[]): number;
export {};
