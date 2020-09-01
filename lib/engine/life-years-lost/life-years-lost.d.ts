import { LifeTableFunctions } from '../life-table/life-table-functions';
import { IGenderCauseEffectRef } from '../cause-effect';
import { Data } from '../data/data';
import { RiskFactor } from '../../risk-factors';
export declare class LifeYearsLost {
    causeEffectRef: IGenderCauseEffectRef;
    lifeTable: LifeTableFunctions;
    constructor(causeEffectRef: IGenderCauseEffectRef, lifeTable: LifeTableFunctions);
    getLifeYearsLostDueToRiskFactor(riskFactor: RiskFactor, data: Data): number;
}
