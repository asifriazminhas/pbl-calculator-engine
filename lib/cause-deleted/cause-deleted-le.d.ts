import { LifeExpectancy } from '../engine/life-expectancy/life-expectancy';
import { ICauseDeletedModel } from './cause-deleted-risk';
import { IExternalPredictor } from './external-predictor';
import { Data } from '../engine/data';
import { RiskFactor } from '../risk-factors';
export declare function getCauseDeletedQx(this: ICauseDeletedLifeExpectancy, externalPredictors: IExternalPredictor[], riskFactors: RiskFactor[], profile: Data): number;
interface ICauseDeletedLifeExpectancy extends LifeExpectancy<any> {
    model: ICauseDeletedModel;
}
export {};
