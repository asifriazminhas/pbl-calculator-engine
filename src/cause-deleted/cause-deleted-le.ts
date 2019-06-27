import { LifeExpectancy } from '../engine/life-expectancy/life-expectancy';
import { CauseDeletedModel } from './cause-deleted-risk';
import { IExternalPredictor } from './external-predictor';
import { Data } from '../engine/data';
import * as moment from 'moment';
import { RiskFactor } from '../risk-factors';

export function getCauseDeletedQx(
    this: ICauseDeletedLifeExpectancy,
    externalPredictors: IExternalPredictor[],
    riskFactor: RiskFactor,
    profile: Data,
) {
    const OneYearFromToday = moment();
    OneYearFromToday.add(1, 'year');

    return this.model
        .getAlgorithmForData(profile)
        .getCauseDeletedRisk(externalPredictors, riskFactor, profile);
}

interface ICauseDeletedLifeExpectancy extends LifeExpectancy<any> {
    model: CauseDeletedModel;
}
