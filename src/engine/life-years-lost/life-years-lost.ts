import { LifeTableFunctions } from '../life-table/life-table-functions';
import { IGenderCauseEffectRef } from '../cause-effect';
import { autobind } from 'core-decorators';
import {
    filterDataUsedToCalculateCoefficientsForCovariateGroup,
    findDatumWithName,
    Data,
} from '../data/data';
import { getCauseEffectRefForData } from '../cause-effect/gender-cause-effect-ref';
import { RiskFactor } from '../../risk-factors';

@autobind
export class LifeYearsLost {
    causeEffectRef: IGenderCauseEffectRef;
    lifeTable: LifeTableFunctions;

    constructor(
        causeEffectRef: IGenderCauseEffectRef,
        lifeTable: LifeTableFunctions,
    ) {
        this.causeEffectRef = causeEffectRef;
        this.lifeTable = lifeTable;
    }

    getLifeYearsLostDueToRiskFactor(
        riskFactor: RiskFactor,
        data: Data,
    ): number {
        const ageDatum = findDatumWithName('age', data);

        // Calculate Normal LE
        const normalLifeExpectancy = this.lifeTable.getLifeExpectancy(data);

        // Calculate Cause Deleted LE
        /* We concat the age datum at the end since some covariates may need it
        for their calculations and so it will get removed from the data but we
        need it for life expectancy calculations */
        const lifeExpectancyDataWithoutRiskFactorFields = filterDataUsedToCalculateCoefficientsForCovariateGroup(
            riskFactor,
            this.lifeTable.model.getAlgorithmForData(data),
            data,
        ).concat(ageDatum);
        /* Add the cause deleted ref to the filtered data */
        const causeDeletedLifeExpectancyData = lifeExpectancyDataWithoutRiskFactorFields.concat(
            getCauseEffectRefForData(this.causeEffectRef, data)[riskFactor],
        );
        /* Use the new data to calculate cause deleted LE */
        const causeDeletedLifeExpectancy = this.lifeTable.getLifeExpectancy(
            causeDeletedLifeExpectancyData,
        );

        // Return subtraction of the two
        return causeDeletedLifeExpectancy - normalLifeExpectancy;
    }
}
