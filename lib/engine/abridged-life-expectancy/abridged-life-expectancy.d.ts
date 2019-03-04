import { Data } from '../data';
import { Model } from '../model';
import { IAbridgedLifeTableRow, IGenderedAbridgedLifeTable } from './abridged-life-table';
import { LifeExpectancy, ICompleteLifeTableRow } from '../life-expectancy/life-expectancy';
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
export declare class AbridgedLifeExpectancy extends LifeExpectancy<IAbridgedLifeTableRow> {
    private genderedAbridgedLifeTable;
    constructor(model: Model, genderedAbridgedLifeTable: IGenderedAbridgedLifeTable);
    /**
     * Calculates the average life expectancy for a population. Uses the
     * abridged life table for each gender and then averages them to get the
     * life expectancy for the population
     *
     * @param {Data[]} population
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    calculateForPopulation(population: Data[]): number;
    /**
     * Returns the life table row where the age arg is between it's age group
     *
     * @protected
     * @param {(Array<ICompleteLifeTableRow & IAbridgedLifeTableRow>)} completeLifeTable
     * @param {number} age
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    protected getLifeTableRowForAge(completeLifeTable: Array<ICompleteLifeTableRow & IAbridgedLifeTableRow>, age: number): (ICompleteLifeTableRow & IAbridgedLifeTableRow) | undefined;
    private calculateForPopulationForSex;
    /**
     * Return the nx value for this life table row which is the range of ages
     * part of this age group
     *
     * @private
     * @param {IAbridgedLifeTableRow} { age_end, age_start }
     * @returns {number}
     * @memberof AbridgedLifeExpectancy
     */
    private getnx;
    /**
     * Check if an age is part of the age group for an abridged life table row
     *
     * @private
     * @param {IAbridgedLifeTableRow} { age_end, age_start }
     * @param {number} age
     * @returns {boolean}
     * @memberof AbridgedLifeExpectancy
     */
    private isInAgeGroup;
}
