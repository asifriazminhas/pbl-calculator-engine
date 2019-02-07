import { IBaseRefLifeTableRow } from '../life-expectancy/life-expectancy';

export interface IUnAbridgedLifeTableRow extends IBaseRefLifeTableRow {
    age: number;
}

export type UnAbridgedLifeTable = IUnAbridgedLifeTableRow[];

export interface IGenderedUnAbridgedLifeTable {
    male: UnAbridgedLifeTable;
    female: UnAbridgedLifeTable;
}
