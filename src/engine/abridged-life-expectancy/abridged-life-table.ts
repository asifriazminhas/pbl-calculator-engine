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

export interface IGenderedAbridgedLifeTable {
    male: AbridgedLifeTable;
    female: AbridgedLifeTable;
}
