import { IBaseRefLifeTableRow } from '../life-expectancy/life-expectancy';
import { ICompleteLifeTableRow } from '../life-table/life-table';

export interface IUnAbridgedLifeTableRow extends IBaseRefLifeTableRow {
    age: number;
}

export type UnAbridgedLifeTable = IUnAbridgedLifeTableRow[];

export interface IGenderedUnAbridgedLifeTable {
    male: UnAbridgedLifeTable;
    female: UnAbridgedLifeTable;
}

export type CompleteUnAbridgedLifeTable = Array<
    IUnAbridgedLifeTableRow & ICompleteLifeTableRow
>;
