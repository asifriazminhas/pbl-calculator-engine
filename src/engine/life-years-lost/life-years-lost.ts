import { LifeTableFunctions } from '../life-table/life-table-functions';
import { IGenderCauseEffectRef } from '../cause-effect';
import { autobind } from 'core-decorators';
import { CovariateGroup } from '../data-field/covariate/covariate-group';
import {
    filterDataUsedToCalculateCoefficientsForCovariateGroup,
    findDatumWithName,
    Data,
} from '../data/data';

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
        /* Get all the covariates whose groups field has the riskFactor argument */
        /* Get all the derived fields which can be used to calculate the coefficient those covariates */
        /* Filter out all the data which matches with any of the fields */
        const lifeExpectancyDataWithoutRiskFactorFields = filterDataUsedToCalculateCoefficientsForCovariateGroup(
            riskFactor,
            this.lifeTable.survivalFunctions.getAlgorithmForData(data),
            data,
        ).concat(ageDatum);
        /* Add the cause deleted ref to the filtered data */
        const causeDeletedLifeExpectancyData = lifeExpectancyDataWithoutRiskFactorFields.concat(
            this.causeEffectRef[
                findDatumWithName('sex', data).coefficent as 'male' | 'female'
            ][riskFactor],
        );
        /* Use the new data to calculate cause deleted LE */
        const causeDeletedLifeExpectancy = this.lifeTable.getLifeExpectancy(
            causeDeletedLifeExpectancyData,
        );

        // Return subtraction of the two
        return causeDeletedLifeExpectancy - normalLifeExpectancy;
    }
}
