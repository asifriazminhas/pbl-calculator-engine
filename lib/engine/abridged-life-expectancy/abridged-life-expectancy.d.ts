import { Data } from '../data';
import { Model, CoxSurvivalAlgorithm } from '../model';
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
    private SexVariable;
    private ContAgeField;
    constructor(model: Model<CoxSurvivalAlgorithm>, genderedAbridgedLifeTable: IGenderedAbridgedLifeTable);
    /**
     * Calculates the average life expectancy for a population. Uses the
     * abridged life table for each gender and then averages them to get the
     * life expectancy for the population
     *
     * @param {Data[]} population
     * @param {boolean} useWeights Whether the final value LE value should be weighted. Defaults to true.
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    calculateForPopulation(population: Data[], useWeights?: boolean): number;
    /**
     * Returns the life years left for an individual
     *
     * @param {Data} individual
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    calculateForIndividual(individual: Data): number;
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
    protected getFirstTxValue(lifeTable: Array<IAbridgedLifeTableRow & {
        lx: number;
    }>, maxAge: number): number;
    /**
     * Calculates the knots used in the calculation of Tx for the last
     * row in the life table
     *
     * Hsieh J. A general theory of life table construction and a precise
     * abridged life table method. Biom J 1991;2:143-62.
     *
     * @private
     * @param {ICompleteLifeTableRow[]} lifeTable A life table whose lx values
     * are properly populated. The life table should end at the row whose Tx
     * value needs to be calculated using splines
     * @param {[number, number]} ages Age values to be used in the formula
     * for calculating the second knot. Should be the age value in the last
     * row of the life table followed by the age value in the row before
     * @returns {[number, number]}
     * @memberof LifeExpectancy
     */
    private getKnots;
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
    private getMaxAge;
    private getLastValidLifeTableRowIndex;
}
