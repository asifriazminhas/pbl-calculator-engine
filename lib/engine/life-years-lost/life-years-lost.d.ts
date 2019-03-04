import { LifeTableFunctions } from '../life-table/life-table-functions';
import { IGenderCauseEffectRef } from '../cause-effect';
import { CovariateGroup } from '../data-field/covariate/covariate-group';
import { Data } from '../data/data';
export declare class LifeYearsLost {
    causeEffectRef: IGenderCauseEffectRef;
    lifeTable: LifeTableFunctions;
    constructor(causeEffectRef: IGenderCauseEffectRef, lifeTable: LifeTableFunctions);
    getLifeYearsLostDueToRiskFactor(riskFactor: CovariateGroup, data: Data): number;
}
