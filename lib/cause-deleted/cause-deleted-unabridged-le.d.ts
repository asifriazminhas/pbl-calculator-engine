import { UnAbridgedLifeExpectancy } from '../engine/unabridged-life-expectancy';
import { ICauseDeletedModel } from './cause-deleted-risk';
import { IExternalPredictor } from './external-predictor';
import { Data } from '../engine/data';
import { CauseDeletedRef } from './cause-deleted-ref';
import { RiskFactor } from '../risk-factors';
export interface ICauseDeletedUnAbridgedLE extends UnAbridgedLifeExpectancy {
    model: ICauseDeletedModel;
    calculateCDForIndividual: typeof calculateCDForIndividual;
}
export declare function addCauseDeleted(unAbridgedLE: UnAbridgedLifeExpectancy, riskFactorRef: CauseDeletedRef): ICauseDeletedUnAbridgedLE;
declare function calculateCDForIndividual(this: ICauseDeletedUnAbridgedLE, externalPredictors: IExternalPredictor[], riskFactors: RiskFactor[], individual: Data): number;
export {};
