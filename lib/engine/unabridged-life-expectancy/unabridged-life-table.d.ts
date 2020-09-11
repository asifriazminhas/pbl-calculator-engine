import { IBaseRefLifeTableRow } from '../life-expectancy/life-expectancy';
import { ICompleteLifeTableRow } from '../life-table/life-table';
export interface IUnAbridgedLifeTableRow extends IBaseRefLifeTableRow {
    age: number;
}
export declare type UnAbridgedLifeTable = IUnAbridgedLifeTableRow[];
export interface IGenderedUnAbridgedLifeTable {
    male: UnAbridgedLifeTable;
    female: UnAbridgedLifeTable;
}
export declare type CompleteUnAbridgedLifeTable = Array<IUnAbridgedLifeTableRow & ICompleteLifeTableRow>;
