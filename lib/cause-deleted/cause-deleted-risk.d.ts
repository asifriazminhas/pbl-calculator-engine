import { Model, Data, CoxSurvivalAlgorithm } from '../engine/model';
import { IGenderSpecificCauseEffectRef } from '../engine/cause-effect';
import { CauseDeletedRef } from './cause-deleted-ref';
import { IExternalPredictor } from './external-predictor';
import moment from 'moment';
import { RiskFactor } from '../risk-factors';
export interface ICauseDeletedModel extends Model<CauseDeletedCox> {
    updateCauseDeletedRef: typeof updateCauseDeletedRef;
}
declare type CauseDeletedCox = CoxSurvivalAlgorithm & {
    getCauseDeletedRisk: typeof getCauseDeletedRisk;
    riskFactorRef: IGenderSpecificCauseEffectRef;
};
/**
 * Adds cause deleted methods to the model argument
 *
 * @export
 * @param {Model} model The Model argument to augment. Each algorithm
 * object within the model will be extended to add cause deleted methods
 * to it
 * @param {CauseDeletedRef} riskFactorRef A JSON array containing the
 * reference exposure values to use for each algorithm when calculating
 * cause deleted
 * @returns {CauseDeletedModel}
 */
export declare function addCauseDeleted(model: Model<CoxSurvivalAlgorithm>, riskFactorRef: CauseDeletedRef): ICauseDeletedModel;
declare function getCauseDeletedRisk(this: CauseDeletedCox, externalPredictors: IExternalPredictor[], riskFactors: RiskFactor[], data: Data, time?: Date | moment.Moment): number;
declare function updateCauseDeletedRef(this: ICauseDeletedModel, newReference: CauseDeletedRef): ICauseDeletedModel;
export {};
