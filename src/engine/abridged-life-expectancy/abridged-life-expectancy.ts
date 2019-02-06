import { Data, findDatumWithName } from '../data';
import { Model } from '../model';
import {
    IAbridgedLifeTableAndKnots,
    IAbridgedLifeTableRow,
    GenderedAbridgedLifeTable,
} from './abridged-life-table';
import { sum } from 'lodash';
import { LifeExpectancy } from '../life-expectancy/life-expectancy';
import { ICompleteLifeTableRow } from '../life-table/life-table';
import { inRange } from 'lodash';

/**
 * Used to calculate life expectancy with:
 * 1. An abridged life table
 * 2. A population
 *
 * Do no use if life table is an un-abridged one or for an individual
 *
 * @export
 * @class AbridgedLifeExpectancy
 */
export class AbridgedLifeExpectancy extends LifeExpectancy<
    IAbridgedLifeTableRow
> {
    private genderedAbridgedLifeTable: GenderedAbridgedLifeTable;

    constructor(
        model: Model,
        { genderedAbridgedLifeTable, knots }: IAbridgedLifeTableAndKnots,
    ) {
        super(model, knots);

        this.model = model;
        this.genderedAbridgedLifeTable = genderedAbridgedLifeTable;
    }

    /**
     * Calculates the average life expectancy for a population. Uses the
     * abridged life table for each gender and then averages them to get the
     * life expectancy for the population
     *
     * @param {Data[]} population
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    calculateForPopulation(population: Data[]) {
        const malePopLifeExpectancy = this.calculateForPopulationForSex(
            population,
            'male',
        );
        const femalePopLifeExpectancy = this.calculateForPopulationForSex(
            population,
            'female',
        );

        return (malePopLifeExpectancy + femalePopLifeExpectancy) / 2;
    }

    // TODO Fix once this is resolved https://github.com/Microsoft/TypeScript/issues/29779
    /**
     * Returns the life table row where the age arg is between it's age group
     *
     * @protected
     * @param {(Array<ICompleteLifeTableRow & IAbridgedLifeTableRow>)} completeLifeTable
     * @param {number} age
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    // @ts-ignore
    protected getLifeTableRowForAge(
        completeLifeTable: Array<ICompleteLifeTableRow & IAbridgedLifeTableRow>,
        age: number,
    ) {
        return completeLifeTable.find(({ age_start, age_end }) => {
            return inRange(age, age_start, age_end) || age === age_end;
        });
    }

    private calculateForPopulationForSex(
        population: Data[],
        sex: 'male' | 'female',
    ) {
        // The name of the age variable
        const AgeDatumName = 'age';
        // The name of the sex variable
        const SexDatumName = 'sex';
        const algorithmForCurrentSex = this.model.getAlgorithmForData([
            {
                name: SexDatumName,
                coefficent: sex,
            },
        ]);
        // Get the abridged life table for the current gender
        const abridgedLifeTable = this.genderedAbridgedLifeTable[sex];

        // Get all the individuals who are the current sex
        const populationForCurrentGender = population.filter(data => {
            return findDatumWithName(SexDatumName, data).coefficent === sex;
        });

        // Calculate the one year risk for each individual in the population
        const qxValues = populationForCurrentGender.map(data => {
            return this.getQx(data);
        });

        const WeightDatumName = 'WTS_M';
        // Calculate the weighted qx value to use for each row in the abridged life table
        const weightedQxForAgeGroups: number[] = abridgedLifeTable.map(
            lifeTableRow => {
                // Get all the individual who are in the age group of the current life table row
                const currentAgeGroupPop = populationForCurrentGender.filter(
                    data => {
                        const age = findDatumWithName(AgeDatumName, data)
                            .coefficent as number;

                        return (
                            inRange(
                                age,
                                lifeTableRow.age_start,
                                lifeTableRow.age_end,
                            ) || age === lifeTableRow.age_end
                        );
                    },
                );

                // Get the array of calculated qx values for each individual in the current age group population
                const qxValuesForCurrentAgeGroup = currentAgeGroupPop.map(
                    data => {
                        return qxValues[currentAgeGroupPop.indexOf(data)];
                    },
                );
                // Get the array of weights for each individual in the current age group population
                const weightsForCurrentAgeGroup = currentAgeGroupPop.map(
                    data => {
                        return findDatumWithName(WeightDatumName, data)
                            .coefficent as number;
                    },
                );

                // Calculate the weighted mean using qxValuesForCurrentAgeGroup and weightsForCurrentAgeGroup
                return (
                    qxValuesForCurrentAgeGroup.reduce(
                        (weightedQxMean, currentQxValue, index) => {
                            return (
                                weightedQxMean +
                                currentQxValue *
                                    weightsForCurrentAgeGroup[index]
                            );
                        },
                        0,
                    ) / sum(weightsForCurrentAgeGroup)
                );
            },
        );

        const ageMaxAllowableValue = algorithmForCurrentSex.findDataField(
            AgeDatumName,
        ).interval!.higherMargin!.margin;
        // Make a life table with qx, nx and the fields in the ref life table
        // We will complete this in the next line of code
        const refLifeTableWithQxAndNx = abridgedLifeTable
            // Add on the qx and nx fields to each life table row
            .map((lifeTableRow, index) => {
                return Object.assign({}, lifeTableRow, {
                    qx: weightedQxForAgeGroups[index],
                    nx: this.getnx(lifeTableRow),
                });
            });
        const completeLifeTable = this.getCompleteLifeTable(
            refLifeTableWithQxAndNx,
            abridgedLifeTable.find(lifeTableRow => {
                return lifeTableRow.age_start > ageMaxAllowableValue;
            })!.age_start,
        );

        // The age of which ex value we will use from the life table to calculate the LE for the population
        const AgeLifeExpectancy = 20;
        return this.getLifeExpectancyForAge(
            completeLifeTable,
            AgeLifeExpectancy,
        );
    }

    /**
     * Return the nx value for this life table row which is the range of ages
     * part of this age group
     *
     * @private
     * @param {IAbridgedLifeTableRow} { age_end, age_start }
     * @returns {number}
     * @memberof AbridgedLifeExpectancy
     */
    private getnx({ age_end, age_start }: IAbridgedLifeTableRow): number {
        const FinalRowNx = 5;

        const ageDifference = age_end - age_start;

        return ageDifference === 0
            ? 1
            : age_end === undefined ? FinalRowNx : ageDifference + 1;
    }
}
