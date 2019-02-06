import { IBaseRefLifeTableRow } from '../life-expectancy/life-expectancy';

export interface IUnAbridgedLifeTableRow extends IBaseRefLifeTableRow {
    age: number;
}

export type UnAbridgedLifeTable = IUnAbridgedLifeTableRow[];

export interface IGenderedUnAbridgedLifeTable {
    male: UnAbridgedLifeTable;
    female: UnAbridgedLifeTable;
}

export interface IGenderedUnAbridgedLifeTableAndKnots {
    /**
     * Knots which will be used in the splining formula to get the last value
     * of Tx
     *
     * @type {[number, number]}
     * @memberof IGenderedUnAbridgedLifeTableAndKnots
     */
    knots: [number, number];
    genderedUnAbridgeLifeTable: IGenderedUnAbridgedLifeTable;
}
