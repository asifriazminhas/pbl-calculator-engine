import { Model, Data, CoxSurvivalAlgorithm } from '../model';
import { IGenderedUnAbridgedLifeTable, IUnAbridgedLifeTableRow } from './unabridged-life-table';
import { LifeExpectancy, ICompleteLifeTableRow } from '../life-expectancy/life-expectancy';
export declare class UnAbridgedLifeExpectancy extends LifeExpectancy<IUnAbridgedLifeTableRow> {
    private genderedUnAbridgedLifeTable;
    constructor(model: Model<CoxSurvivalAlgorithm>, genderedUnAbridgedLifeTable: IGenderedUnAbridgedLifeTable);
    /**
     * Calculates the life expectancy for an individual using a un-abridged
     * life table
     *
     * @param {Data} data The variables and their values for this individual
     * @returns {number}
     * @memberof UnABridgedLifeExpectancy
     */
    calculateForIndividual(data: Data): number;
    getSurvivalToAge(data: Data, toAge: number): number;
    protected getLifeTableRowForAge(completeLifeTable: Array<IUnAbridgedLifeTableRow & ICompleteLifeTableRow>, age: number): (IUnAbridgedLifeTableRow & ICompleteLifeTableRow) | undefined;
    protected getFirstTxValue(lifeTable: Array<IUnAbridgedLifeTableRow & {
        Lx: number;
    }>): number;
    private getCompleteUnAbridgedLifeTable;
}
