import { IBaseRefLifeTableRow } from '../life-expectancy/life-expectancy';

export interface IAbridgedLifeTableRow extends IBaseRefLifeTableRow {
    /**
     * The start age for this age group
     *
     * @type {number}
     * @memberof IAbridgedLifeTableRow
     */
    age_start: number;
    /**
     * The end age for this age group
     *
     * @type {number}
     * @memberof IAbridgedLifeTableRow
     */
    age_end: number;
}

export type AbridgedLifeTable = IAbridgedLifeTableRow[];

export interface GenderedAbridgedLifeTable {
    male: AbridgedLifeTable;
    female: AbridgedLifeTable;
}

/**
 * The content of an abridged life table JSON reference file
 *
 * @export
 * @interface IAbridgedLifeTableAndKnots
 */
export interface IAbridgedLifeTableAndKnots {
    /**
     * Knots used to calculate the value of Tx for the last row in the life
     * table
     *
     * @type {[number, number]}
     * @memberof IAbridgedLifeTableAndKnots
     */
    knots: [number, number];
    genderedAbridgedLifeTable: GenderedAbridgedLifeTable;
}
