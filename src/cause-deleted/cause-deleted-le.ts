import { LifeExpectancy } from '../engine/life-expectancy/life-expectancy';
import { CauseDeletedModel } from './cause-deleted-risk';
import { IExternalPredictor } from './external-predictor';
import { CovariateGroup } from '../engine/data-field/covariate/covariate-group';
import { Data } from '../engine/data';
import * as moment from 'moment';

export function getCauseDeletedQx(
    this: ICauseDeletedLifeExpectancy,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
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
