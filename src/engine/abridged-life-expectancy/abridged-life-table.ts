export interface IAbridgedLifeTableRow {
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
    ax: number;
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
