import { LifeTableFunctions } from '../life-table/life-table-functions';
import { IGenderCauseEffectRef } from '../cause-effect';
import { autobind } from 'core-decorators';
import { CovariateGroup } from '../data-field/covariate/covariate-group';
import {
    filterDataUsedToCalculateCoefficientsForCovariateGroup,
    findDatumWithName,
    Data,
} from '../data/data';
import { getCauseEffectRefForData } from '../cause-effect/gender-cause-effect-ref';

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
        riskFactor: CovariateGroup,
        data: Data,
    ): number {
        const ageDatum = findDatumWithName('age', data);

        // Calculate Normal LE
        const normalLifeExpectancy = this.lifeTable.getLifeExpectancy(data);

        // Calculate Cause Deleted LE
        const lifeExpectancyDataWithoutRiskFactorFields = filterDataUsedToCalculateCoefficientsForCovariateGroup(
            riskFactor,
            this.lifeTable.survivalFunctions.getAlgorithmForData(data),
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
