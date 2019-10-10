import { LifeExpectancy } from '../engine/life-expectancy/life-expectancy';
import { ICauseDeletedModel } from './cause-deleted-risk';
import { IExternalPredictor } from './external-predictor';
import { Data } from '../engine/data';
import moment from 'moment';
import { RiskFactor } from '../risk-factors';

export function getCauseDeletedQx(
    this: ICauseDeletedLifeExpectancy,
    externalPredictors: IExternalPredictor[],
    riskFactors: RiskFactor[],
    profile: Data,
) {
    const OneYearFromToday = moment();
    OneYearFromToday.add(1, 'year');

    return this.model
        .getAlgorithmForData(profile)
        .getCauseDeletedRisk(externalPredictors, riskFactors, profile);
}

interface ICauseDeletedLifeExpectancy extends LifeExpectancy<any> {
    model: ICauseDeletedModel;
}
