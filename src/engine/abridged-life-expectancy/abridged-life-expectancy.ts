import { Data, findDatumWithName } from '../data';
import { Model } from '../model';
import * as moment from 'moment';
import {
    IAbridgedLifeTableAndKnots,
    IAbridgedLifeTableRow,
    GenderedAbridgedLifeTable,
} from './abridged-life-table';
import { sum } from 'lodash';

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
export class AbridgedLifeExpectancy {
    private model: Model;
    private genderedAbridgedLifeTable: GenderedAbridgedLifeTable;
    private knots: [number, number];

    constructor(
        model: Model,
        { genderedAbridgedLifeTable, knots }: IAbridgedLifeTableAndKnots,
    ) {
        this.model = model;
        this.genderedAbridgedLifeTable = genderedAbridgedLifeTable;
        this.knots = knots;
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

    private calculateForPopulationForSex(
        population: Data[],
        sex: 'male' | 'female',
    ) {
        // The name of the sex variable
        const SexDatumName = 'sex';
        // Get all the individual who are the current sex
        const populationForCurrentGender = population.filter(data => {
            return findDatumWithName(SexDatumName, data).coefficent === sex;
        });

        // Get the abridged life table for the current gender
        const abridgedLifeTable = this.genderedAbridgedLifeTable[sex];

        // Calculate the one year risk for each individual in the population
        const OneYearFromToday = moment();
        OneYearFromToday.add(1, 'year');
        const qxValues = populationForCurrentGender.map(data => {
            return this.model
                .getAlgorithmForData(data)
                .getRiskToTime(data, OneYearFromToday);
        });

        const AgeDatumName = 'age';
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
                            age >= lifeTableRow.age_start &&
                            age <= lifeTableRow.age_end
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

        // The complete life table we will calculate and use to get the average life expectancy for the population.
        // For now we set all the values except qx to -1. qx comes from the values we calculated earlier
        const completeLifeTable: Array<
            IAbridgedLifeTableRow & {
                lx: number;
                qx: number;
                dx: number;
                Lx: number;
                Tx: number;
                ex: number;
            }
        > = abridgedLifeTable.map((abridgedLifeTableRow, index) => {
            return Object.assign({}, abridgedLifeTableRow, {
                qx: weightedQxForAgeGroups[index],
                lx: -1,
                dx: -1,
                Lx: -1,
                Tx: -1,
                ex: -1,
            });
        });
        const lxForFirstRow = 100000;
        // Populate the lx, dx and Lx values in the life table
        completeLifeTable.forEach((lifeTableRow, index, abridgedLifeTable) => {
            // For the first lx value set it to lxForFirstRow
            // Otherwise previousRowlx  - dx
            lifeTableRow.lx =
                index === 0
                    ? lxForFirstRow
                    : abridgedLifeTable[index - 1].lx -
                      abridgedLifeTable[index - 1].dx;
            lifeTableRow.dx = lifeTableRow.lx * lifeTableRow.qx;
            const nx = this.getnx(abridgedLifeTable[index]);
            // Lx = nx*(lx-dx) + ax*dx*nx
            lifeTableRow.Lx =
                nx * (lifeTableRow.lx - lifeTableRow.dx) +
                lifeTableRow.ax * lifeTableRow.dx * nx;
        });
        // Get the start age for the final group in the life table
        const finalAgeGroupStart =
            abridgedLifeTable[abridgedLifeTable.length - 1].age_start;
        // Reverse the life table since we need to start from the end to calculate Tx
        completeLifeTable.reverse().forEach((lifeTableRow, index) => {
            // If this is the last value (since we reversed it, last value is index==0)
            // then use the spline formula to calculate it
            // Otherwise previousLifeTableTx+ Lx
            lifeTableRow.Tx =
                index === 0
                    ? this.knots[0] * finalAgeGroupStart ** 3 / 3 -
                      this.knots[1] * finalAgeGroupStart ** 2 / 2 -
                      this.knots[1] ** 2 *
                          finalAgeGroupStart /
                          (4 * this.knots[0]) -
                      this.knots[1] ** 3 / (24 * this.knots[0 ** 2])
                    : completeLifeTable[index - 1].Tx + lifeTableRow.Lx;
            // ex = Tx/lx
            lifeTableRow.ex = lifeTableRow.Tx / lifeTableRow.lx;
        });
        // Reverse it again
        completeLifeTable.reverse();

        // The age of which ex value we will use from the life table to calculate the LE for the population
        const AgeLifeExpectancy = 20;
        // Find the ex value for age group that has AgeLifeExpectancy and use it to calculate the LE for this population
        // which we will return
        return (
            completeLifeTable.find(({ age_start, age_end }) => {
                return (
                    AgeLifeExpectancy >= age_start &&
                    AgeLifeExpectancy <= age_end
                );
            })!.ex + AgeLifeExpectancy
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
